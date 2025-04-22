import React, { useEffect, useRef, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

const NoInternetBanner = () => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (netInfo.isConnected === false && !hasNavigated.current) {
      hasNavigated.current = true;
      navigation.navigate("NoInternetScreen");
    }

    if (netInfo.isConnected === true) {
      hasNavigated.current = false;
    }
  }, [netInfo.isConnected]);

  return null;
};

export default NoInternetBanner;
