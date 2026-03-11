import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransactionList from "@/components/TransactionList";
import { colors, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { limit, orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ];

  const { data: allTransactions, isLoading: transLoading } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions?.filter((item) => {
    if (search.length > 1) {
      if (item.category?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  })

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              placeholder="rent, clothing..."
              value={search}
              onChangeText={(val) => setSearch(val)}
            />
          </View>

          <View>
            <TransactionList
              data={filteredTransactions}
              loading={transLoading}
              emptyListMessage="No matching transaction found!"
            />
          </View>
        </ScrollView>
      </View>

    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
    marginBottom: spacingY._20,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
