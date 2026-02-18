import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
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
            <TouchableOpacity>
              <Icons.PlusCircleIcon
                weight="fill"
                size={verticalScale(32)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* TODO:wallet list */}
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
