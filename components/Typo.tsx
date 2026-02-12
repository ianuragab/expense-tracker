import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  style,
  textProps = {},
  children,
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
    ...style,
  };
  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
