import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletListItem from "@/components/WalletListItem";
import { colors, radius, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { data: wallets, isLoading, error } = useFetchData<WalletType>('wallets', [where('uid', '==', user?.uid), orderBy('created', 'desc')])
  
  const getTotalBalance = () => {
    return 2390;
  };
  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={44} fontWeight={500}>
              ₹ {getTotalBalance().toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>

        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={18} fontWeight={500}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusCircleIcon
                weight="fill"
                size={verticalScale(32)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {isLoading ? <Loading /> : (
            <FlatList data={wallets} renderItem={({item, index}) => {
              return <WalletListItem index={index} item={item} router={router} />
            }}/>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopLeftRadius: radius._30,
    borderTopRightRadius: radius._30,
    padding: spacingY._20,
    paddingTop: spacingY._25,
  },
  lifeStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
