import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation,route }) => {
  const { username,userId, loggeduser } = route.params;
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [step, setStep] = useState(1); 

  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      Alert.alert("Error", "Please enter your email or phone number");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOrPhone)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.get('http://192.168.38.122:5000/api/StudentApi/sendemailotp', {
        email: emailOrPhone,
      });

      setSentOtp(response.data.Opt);
      console.log(response.data.Opt);
      console.log(response);
      setStep(2);
      Alert.alert("Success", "OTP sent successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Try again.");
      console.error("OTP Sending Error:", error);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === sentOtp) {
      Alert.alert("Success", "OTP Verified Successfully");
      setStep(3);
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await axios.get('http://192.168.38.122:5000/api/StudentApi/forgotpassword', {
        UserId: userId,
        password: newPassword
      });

      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", "Password reset failed. Try again.");
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Id"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Reset Password" onPress={handleResetPassword} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 24, textAlign: "center" },
  input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, textAlign: "center" },
});

export default ForgotPasswordScreen;
