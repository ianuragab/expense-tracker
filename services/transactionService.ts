import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

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
