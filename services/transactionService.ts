import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    if (id) {
      // update existing transaction
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id),
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction?.type != type ||
        oldTransaction?.amount != amount ||
        oldTransaction?.walletId != walletId;

      if (shouldRevertOriginal) {
        const revertRes = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId,
        );
        if (!revertRes?.success) return revertRes;
      }
    } else {
      // update new transaction
      const res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type,
      );
      if (!res?.success) return res;
    }

    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactions",
      );
      if (imageUploadRes?.success) {
        transactionData.image = imageUploadRes.data;
      } else {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed!",
        };
      }
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
      msg: "Transaction created successfully",
    };
  } catch (error: any) {
    console.error("Error in transaction: ", error);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walledId: string,
  amount: number,
  type: string,
) => {
  try {
    const walletRef = doc(firestore, "wallets", walledId);
    const walletSnap = await getDoc(walletRef);
    if (!walletSnap.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnap.data() as WalletType;
    if (type == "expense" && walletData.amount! - amount < 0) {
      return { success: false, msg: "Not enough balance in wallet!" };
    }

    const updatedAmount = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount || 0) + amount
        : Number(walletData.amount || 0) - amount;
    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome || 0) + amount
        : Number(walletData.totalExpenses || 0) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedAmount]: updatedTotals,
    });

    return { success: true };
  } catch (error: any) {
    console.log("Error in updating wallet for new transaction: ", error);
    return { success: false, msg: error.message };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newAmount: number,
  newType: string,
  newWalledId: string,
) => {
  try {
    const originalWallletSnap = await getDoc(
      doc(firestore, "wallets", oldTransaction?.walletId),
    );

    const originalWallet = originalWallletSnap.data() as WalletType;

    let newWalletSnap = await getDoc(doc(firestore, "wallets", newWalledId));
    let newWallet = newWalletSnap.data() as WalletType;

    const revertType =
      oldTransaction?.type == "income" ? "totalIncome" : "totalExpenses";
    const revertIncomeExpense: number =
      oldTransaction?.type == "income"
        ? -Number(oldTransaction?.amount)
        : Number(oldTransaction?.amount);

    const revertedWalletAmount =
      Number(originalWallet?.amount || 0) + revertIncomeExpense;
    // wallet amount, after the transaction is removed

    const revertedIncomeExpense =
      Number(originalWallet?.[revertType] || 0) -
      Number(oldTransaction?.amount);

    if (newType == "expense") {
      // if user tries to convert income to expense on the same wallet
      // or if user tries to increase the expense amount and don't have enough balance
      if (
        oldTransaction.walletId == newWalledId &&
        revertedWalletAmount < newAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance!",
        };
      }

      // if user tries to add expense from a new wallet but the wallet don't have enough balance
      if (newWallet.amount! < newAmount) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance!",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction?.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpense,
    });

    ////////////////////////////////////////////

    // refresh new wallet data
    newWalletSnap = await getDoc(doc(firestore, "wallets", newWalledId));
    newWallet = newWalletSnap.data() as WalletType;

    const updatedType = newType == "income" ? "totalIncome" : "totalExpenses";
    const updatedTransAmount: number =
      newType == "income" ? Number(newAmount) : -Number(newAmount);

    const newWalletAmount = Number(newWallet?.amount || 0) + updatedTransAmount;

    const newIncomeExpense =
      Number(newWallet?.[updatedType] || 0) + Number(newAmount);

    await createOrUpdateWallet({
      id: newWalledId,
      amount: newWalletAmount,
      [updatedType]: newIncomeExpense,
    });

    return { success: true };
  } catch (error: any) {
    console.log("Error in updating wallet for new transaction: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string,
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnap = await getDoc(transactionRef);
    if (!transactionSnap.exists()) {
      return { success: false, msg: "Transaction not found!" };
    }

    const transactionData = transactionSnap.data() as TransactionType;

    const transactionType = transactionData.type;
    const transactionAmount = transactionData.amount;

    const walletSnap = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnap.data() as WalletType;

    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      walletData.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpense = walletData?.[updateType]! - transactionAmount;

    // if its expense and the wallet amount can go negative, then don't allow deletion
    if (transactionType == "expense" && newWalletAmount < 0) {
      return { success: false, msg: "You cannot delete this transaction" };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpense,
    });

    await deleteDoc(transactionRef);

    return { success: true, msg: "Transaction deleted successfully!" };
  } catch (error: any) {
    console.log("Error in deleting transaction: ", error);
    return { success: false, msg: error.message };
  }
};
