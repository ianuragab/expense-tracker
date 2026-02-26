import { colors, radius, spacingX } from '@/constants/theme'
import { WalletType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { Router } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Typo from './Typo'

const WalletListItem = ({
  item, index, router
}: {item: WalletType, index: number, router: Router}) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).damping(12)} >
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.imageContainer} >
          <Image source={item?.image} style={{flex: 1}} contentFit='cover' transition={100} />
        </View>

        <View style={styles.nameContainer}>
          <Typo size={16} fontWeight={500}>{item?.name}</Typo>
          <Typo size={14} color={colors.neutral400}>₹ {item?.amount}</Typo>
        </View>

        <Icons.CaretRightIcon weight='bold' size={verticalScale(20)} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  )
} 

export default WalletListItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(17),
  }, 
  imageContainer: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  nameContainer: {
    flex: 1,
    gap:2,
    marginLeft: spacingX._10
  }
})