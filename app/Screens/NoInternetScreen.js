import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, BackHandler } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function NoInternetScreen() {
  const netInfo = useNetInfo();
  const navigation = useNavigation();

  useEffect(() => {
    if (netInfo.isConnected) {
        navigation.goBack();     
          
    }
  }, [netInfo.isConnected]);

  
  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ No Internet Connection</Text> 
      <Text style={styles.subtitle}>Waiting for connection to resume...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height:"100%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
