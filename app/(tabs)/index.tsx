import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authcontext";
import React from "react";
import { StyleSheet } from "react-native";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
      <Typo>Hello {user?.name}</Typo>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
