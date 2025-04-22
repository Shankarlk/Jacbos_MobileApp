import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import BASE_URL from "./apiConfig";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
  
    try {
      const response = await axios.get(`${BASE_URL}/api/StudentApi/forgotpasswordsend`, {
        params: { email },
      });
  
      const { Success, Message } = response.data;
      console.log(response.data);
      if (Success === "True") {
        Alert.alert("Success", Message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", Message || "Invalid email.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Forgot Password Error:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/dummy-school-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.rember}>
        Remembered?{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => navigation.navigate("Login")}
        >
          Sign In!
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "black", marginBottom: 20 },
  rember: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    marginTop: 15,
  },
  logo: { width: 200, height: 100, marginBottom: 10 },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ForgotPasswordScreen;
