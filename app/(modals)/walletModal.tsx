import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { createOrUpdateWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const oldWallet: { name: string, image: string, id: string } = useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      })
    }
  }, [oldWallet])

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet?.id;
    setIsLoading(true);

    const res = await createOrUpdateWallet(data);
    if (res?.success) {
      router.back();
    } else Alert.alert("Wallet", res?.msg);

    setIsLoading(false);
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;

    console.log('Deleting wallet: ', oldWallet?.id)
    try {
      
    } catch (error) {
      console.log(error)
    }
  }

  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to do this? \n This action will remove all transactions related to this wallet.", [
      { text: "Cancel", style: "cancel", onPress: () => { } },
      { text: "Yes, I'm sure", onPress: () => onDelete() },
    ])
  }

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary, Freelance..."
              value={wallet?.name}
              onChangeText={(val) => setWallet({ ...wallet, name: val })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              file={wallet?.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldWallet?.id ? (
          <Button onPress={showDeleteAlert} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}>
            <Icons.TrashIcon weight="bold" size={verticalScale(24)} color={colors.white} />
          </Button>
        ) : null}
        <Button onPress={onSubmit} loading={isLoading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={700}>
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(12),
    paddingHorizontal: spacingY._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(130),
    width: verticalScale(130),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
