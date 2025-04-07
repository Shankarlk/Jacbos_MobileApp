import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [uname, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sentotp, setSentOtp] = useState('');
  const [token, setToken] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogin = async () => {
    if (!uname) {
      Alert.alert("Error", "Please enter username");
      return;
    }
    if (!pwd) {
      Alert.alert("Error", "Please enter password");
      return;
    }
  
    try {
      const API_BASE_URL = "http://192.168.109.122:5000";
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        "Username": uname,
        "password": pwd,
        "EmailAddress": uname
      }, {
        headers: { "Content-Type": "application/json" }
      });
  
      if (!response.data || !response.data.data) {
        Alert.alert("Login Failed", "Unexpected response from server.");
        return;
      }
  
      const { id: userId, fullName, phoneNumber } = response.data.data;
      const authToken = response.data.token;
  
      setUserId(userId);
      setFullName(fullName);
      setPhoneNumber(phoneNumber);
      setToken(authToken);
  
      await AsyncStorage.setItem("authToken", authToken);
      const timetableResponse = await axios.get(`${API_BASE_URL}/api/TimeTableApi/gettimetable`, {
        params: { userId: userId },
      });

      if (!timetableResponse.data || timetableResponse.data === "") {
        // navigation.navigate("StudentDashboardScreen", { username: uname, userId: userId, loggeduser: fullName, isTeacher: false });
      navigation.reset({
        index: 0,
        routes: [{ 
          name: "MainStudentApp", 
          params: { screen: "Dashboard", username: userId, loggeduser: fullName } 
        }],
      });
  
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ 
          name: "MainApp", 
          params: { screen: "Dashboard", username: userId, loggeduser: fullName } 
        }],
      });
  
    } catch (error) {
      console.error("Login Failed:", error);
  
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert("Login Failed", "Invalid username or password! Please try again.");
        } else {
          Alert.alert("Login Failed", `Server Error: ${error.response.status}`);
        }
      } else {
        Alert.alert("Login Failed", "Network Error! Please check your internet connection.");
      }
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/dummy-school-logo.png')} style={styles.logo} />

      <Text style={styles.title}>LOGIN</Text>
      <TextInput style={styles.input} placeholder="Email Address" value={uname} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={pwd} onChangeText={setPassword} secureTextEntry />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity>
          <Text style={styles.link}>Terms of Use</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <View style={styles.footerLinks}>
        <TouchableOpacity>
          <Text style={styles.link}>Don’t have an account?</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} JACOBS EDUCARE, All Rights Reserved</Text>
        <Text style={styles.footerText}>Powered by EVOLUTION SOFTWARE SOLUTIONS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  logo: { width: 200, height: 100, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#002366', marginBottom: 20 },
  input: { width: '100%', height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15 },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#002366', justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerLinks: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
  link: { color: '#002366', textDecorationLine: 'underline' },
  footer: { position: 'absolute', bottom: 20, alignItems: 'center' },
  footerText: { fontSize: 15, color: 'gray' },
});

export default LoginScreen;
