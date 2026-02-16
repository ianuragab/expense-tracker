import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authcontext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields.");
      return;
    }
    setIsLoading(true);
    let resp = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if (!resp.success) {
      Alert.alert("Login", resp?.msg);
      return;
    }
    console.log("Good to Go");
  };

  const onSignUp = () => {
    router.push("/(auth)/register");
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>

          <Input
            onChangeText={(val) => (emailRef.current = val)}
            placeholder="Enter your email"
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            onChangeText={(val) => (passwordRef.current = val)}
            placeholder="Enter your password"
            secureTextEntry
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={700} color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15} style={styles.footerText}>
            Don&apos;t have an account?
          </Typo>
          <Pressable onPress={onSignUp}>
            <Typo size={15} fontWeight={700} color={colors.primary}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "600",
    color: colors.text,
  },
  form: {
    gap: spacingY._25,
  },
  forgotPassword: {
    textAlign: "right",
    color: colors.text,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
