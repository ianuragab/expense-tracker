import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const barData = [
  {
    value: 40, label: "Mon", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary, 
    // topLabelComponent: () => (<Typo size={10} style={{ marginBottom: 1 }} fontWeight={'bold'}>40</Typo>)
  }, { value: 20, frontColor: colors.rose },
  {
    value: 50, label: "Tue", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 40, frontColor: colors.rose },
  {
    value: 70, label: "Wed", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 25, frontColor: colors.rose },
  {
    value: 30, label: "Thu", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 30, frontColor: colors.rose },
  {
    value: 60, label: "Fri", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 40, frontColor: colors.rose },
  {
    value: 40, label: "Sat", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 20, frontColor: colors.rose },
  {
    value: 75, label: "Sun", spacing: scale(4), labelWidth: scale(30), frontColor: colors.primary
  }, { value: 50, frontColor: colors.rose },
]

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState(barData);
  const [chartLoading, setChartLoading] = useState(false);

  const getWeeklyStats = async () => {}
  const getMonthlyStats = async () => {}
  const getYearlyStats = async () => {}

  useEffect(() => {
    if (activeIndex === 0) getWeeklyStats();
    else if (activeIndex === 1) getMonthlyStats();
    else getYearlyStats();
  }, [activeIndex]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />


        <ScrollView contentContainerStyle={{ gap: spacingY._20, paddingTop: spacingY._5, paddingBottom: verticalScale(100) }} showsVerticalScrollIndicator={false}>
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            style={styles.segmentStyle}
            activeFontStyle={styles.segmentFontStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
            onChange={(e) => { setActiveIndex(e.nativeEvent.selectedSegmentIndex) }}
          />

          <View style={styles.chartContainer}>
            {chartData?.length > 0 ? <BarChart
              data={chartData}
              barWidth={scale(14)}
              spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
              roundedTop
              hideRules
              yAxisLabelPrefix="₹"
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(38) : scale(35)}
              yAxisTextStyle={{ color: colors.neutral350 }}
              xAxisLabelTextStyle={{ color: colors.neutral350, fontSize: verticalScale(12) }}
              noOfSections={3}
              minHeight={5}
              // maxValue={100}
              isAnimated={true}
              animationDuration={1000}
            /> : <View style={styles.noChart} />}

            {chartLoading && (
              <View style={styles.chartLoadingContainer}><Loading color={colors.white} /></View>
            )}
          </View>
        </ScrollView>

      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {},
  noChart: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: verticalScale(210),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    width: verticalScale(34),
    height: verticalScale(34),
    borderRadius: 100,
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(36),
  },
  segmentFontStyle: {
    fontSize: verticalScale(14),
    fontWeight: 'bold',
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  }
});
