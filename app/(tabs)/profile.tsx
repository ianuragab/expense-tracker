import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authcontext";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.UserIcon size={24} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSixIcon size={24} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.LockIcon size={24} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.PowerIcon size={24} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];
  const handleLogout = async () => {
    await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Cancel Logout"),
      },
      { text: "Logout", style: "destructive", onPress: () => handleLogout() },
    ]);
  };

  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Logout") showLogoutAlert();
    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* User Info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>

          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={600} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={16} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, idx) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(idx * 50).damping(30)}
                key={idx}
                style={styles.listItem}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item?.icon && item?.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={500}>
                    {item?.title}
                  </Typo>
                  <Icons.CaretRightIcon
                    size={verticalScale(20)}
                    color={colors.neutral100}
                    weight="bold"
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    width: verticalScale(125),
    height: verticalScale(125),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: 4,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    borderRadius: radius._15,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
