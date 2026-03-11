import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionService";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const getWeeklyStats = async () => {
    setChartLoading(true);
    const res = await fetchWeeklyStats(user?.uid as string);
    if (res.success) {
      setChartData(res?.data?.stats || []);
      setTransactions(res?.data?.transactions || []);
    } else Alert.alert("Error", res.msg || "Error while fetching stats!");
    setChartLoading(false);
  }
  const getMonthlyStats = async () => {
    setChartLoading(true);
    const res = await fetchMonthlyStats(user?.uid as string);
    if (res.success) {
      setChartData(res?.data?.stats || []);
      setTransactions(res?.data?.transactions || []);
    } else Alert.alert("Error", res.msg || "Error while fetching stats!");
    setChartLoading(false);
  }
  const getYearlyStats = async () => {
    setChartLoading(true);
    const res = await fetchYearlyStats(user?.uid as string);
    if (res.success) {
      setChartData(res?.data?.stats || []);
      setTransactions(res?.data?.transactions || []);
    } else Alert.alert("Error", res.msg || "Error while fetching stats!");
    setChartLoading(false);
  }

  useEffect(() => {
    if (activeIndex === 0) {
      setChartData([]);
      setTransactions([]);
      getWeeklyStats();
    } else if (activeIndex === 1) {
      setChartData([]);
      setTransactions([]);
      getMonthlyStats();
    } else {
      setChartData([]);
      setTransactions([]);
      getYearlyStats();
    }
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

          <View>
            <TransactionList
              title="Transactions" emptyListMessage="No transactions found" data={transactions} loading={chartLoading} />
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
