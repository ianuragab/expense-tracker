import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Typo from './Typo'

const HomeCard = () => {
  const { user } = useAuth();

  const { data: wallets, isLoading: walletLoading, error } = useFetchData<WalletType>('wallets', [where('uid', '==', user?.uid), orderBy('created', 'desc')]);

  const getTotalBalance = () => {
    return wallets?.reduce((totals: any, item: WalletType) => {
      totals.balance = totals.balance + Number(item.amount || 0);
      totals.income = totals.income + Number(item.totalIncome || 0);
      totals.expenses = totals.expenses + Number(item.totalExpenses || 0);
      return totals;
    }, { balance: 0, income: 0, expenses: 0 })
  };
  return (
    <ImageBackground source={require('../assets/images/card.png')} style={styles.bgImage} resizeMode='stretch' >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBalanceView}>
            <Typo size={17} color={colors.neutral800} fontWeight={500}>Total Balance</Typo>
            <Icons.DotsThreeOutlineIcon size={verticalScale(22)} color={colors.black} weight='fill' />
          </View>
          <Typo size={28} fontWeight={'bold'} color={colors.black}>₹ {walletLoading ? "----" :getTotalBalance()?.balance?.toFixed(2)}</Typo>
        </View>
        {/* income */}
        <View style={styles.stats}>
          <View style={styles.incomeExpense}>
            <View style={styles.statsIcon}>
              <Icons.ArrowDownIcon size={verticalScale(15)} color={colors.black} weight='bold' />
            </View>
            <Typo size={16} color={colors.neutral700} fontWeight={500}>Income</Typo>
          </View>
          <View style={{ alignSelf: 'center' }}><Typo size={17} color={colors.green} fontWeight={600}>₹ {walletLoading ? "----" :getTotalBalance()?.income?.toFixed(2)}</Typo></View>
        </View>
        {/* expense */}
        <View style={styles.stats}>
          <View style={styles.incomeExpense}>
            <View style={styles.statsIcon}>
              <Icons.ArrowUpIcon size={verticalScale(15)} color={colors.black} weight='bold' />
            </View>
            <Typo size={16} color={colors.neutral700} fontWeight={500}>Expense</Typo>
          </View>
          <View style={{ alignSelf: 'center' }}><Typo size={17} color={colors.rose} fontWeight={600}>₹ {walletLoading ? "----" :getTotalBalance()?.expenses?.toFixed(2)}</Typo></View>
        </View>
      </View>
    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: scale(200),
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(22),
    height: '87%',
    width: '100%',
    justifyContent: 'space-between',
  },
  totalBalanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsIcon: {
    backgroundColor: colors.neutral300,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingY._7,
  }
})