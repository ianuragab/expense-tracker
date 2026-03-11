import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { createOrUpdateTransaction, deleteTransaction } from "@/services/transactionService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    date: new Date(),
    category: "",
    description: "",
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  type paramsType = {
    id: string,
    type: string,
    amount: string,
    category?: string,
    date: string,
    description?: string,
    image?: any,
    uid?: string,
    walletId: string,
  }

  const oldTransaction: paramsType = useLocalSearchParams();

  const onSubmit = async () => {
    let { type, amount, date, category, description, walletId, image } = transaction;
    if ((type === 'expense' && !category) || !amount || !date || !walletId) {
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      date,
      category,
      description,
      walletId,
      image: image || null,
      uid: user?.uid,
    };

    if (oldTransaction?.id) transactionData.id = oldTransaction.id;

    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    if (res?.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res?.msg || "Something went wrong!");
    }
    setLoading(false);
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(oldTransaction?.id, oldTransaction?.walletId);
    if (res?.success) router.back();
    else Alert.alert("Transaction", res?.msg);
    setLoading(false);
  }

  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to  delete this transaction?", [
      { text: "Cancel", style: "cancel", onPress: () => { } },
      { text: "Delete", onPress: () => onDelete(), style: "destructive" },
    ])
  }

  const { data: wallets, isLoading: walletLoading, error: walletError } = useFetchData<WalletType>('wallets', [where('uid', '==', user?.uid), orderBy('created', 'desc')]);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        date: new Date(oldTransaction?.date),
        category: oldTransaction?.category || '',
        description: oldTransaction?.description || '',
        walletId: oldTransaction?.walletId,
        image: oldTransaction?.image,
      })
    }
  }, [])


  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Type</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
              value={transaction?.type}
              onChange={item => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Wallet</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets?.map(w => ({ label: `${w.name} (₹ ${w.amount})`, value: w.id })) || []}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
              placeholder={'Select wallet'}
              value={transaction?.walletId}
              onChange={item => {
                setTransaction({ ...transaction, walletId: item.value || '' });
              }}
            />
          </View>

          {transaction?.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Expense Category</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                activeColor={colors.neutral700}
                placeholder={'Select category'}
                value={transaction?.category}
                onChange={item => {
                  setTransaction({ ...transaction, category: item.value || '' });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Date</Typo>
            {showDatePicker ? (
              <View>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === 'ios' ? "spinner" : 'default'}
                  onChange={onDateChange}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(false)}><Typo size={15} fontWeight={500}>Ok</Typo></TouchableOpacity>
                )}
              </View>
            ) : (
              <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Typo>{(transaction.date as Date).toLocaleDateString()}</Typo>
              </Pressable>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Amount</Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) => setTransaction({ ...transaction, amount: Number(value.replace(/[^0-9]/g, "")) })}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>Description</Typo>
              <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>
            <Input
              multiline
              containerStyle={{ flexDirection: 'row', height: verticalScale(100), alignItems: 'flex-start', paddingVertical: 12 }}
              value={transaction.description}
              onChangeText={(value) => setTransaction({ ...transaction, description: value })}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>Receipt</Typo>
              <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>
            <ImageUpload
              file={transaction?.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) => setTransaction({ ...transaction, image: file })}
              placeholder="Upload Receipt Image"
            />
          </View>

        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading ? (
          <Button onPress={showDeleteAlert} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}>
            <Icons.TrashIcon weight="bold" size={verticalScale(24)} color={colors.white} />
          </Button>
        ) : null}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={700}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropdown: {
    flexDirection: "row",
    height: verticalScale(50),
    alignItems: "center",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    fontSize: verticalScale(14),
    color: colors.white,
    paddingHorizontal: spacingX._15,
  },
  androidDropdown: {
    height: verticalScale(50),
    alignItems: "center",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    fontSize: verticalScale(14),
    color: colors.white,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(50),
    alignItems: "center",
    paddingHorizontal: spacingX._15,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    gap: spacingX._10,
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignItems: 'flex-end',
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    borderCurve: 'continuous',
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderColor: colors.neutral500,
    borderWidth: 1,
    paddingVertical: spacingY._7,
    top: 5,
    borderCurve: 'continuous',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: { color: colors.white },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  }
});
