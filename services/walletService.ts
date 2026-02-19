import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>,
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets",
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes?.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes?.data;
    }

    if (!walletData?.id) {
      // create new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); // updates onl the provided fields.
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("Error in creating and updating wallet: ", error);
    return { success: false, msg: error.message };
  }
};
