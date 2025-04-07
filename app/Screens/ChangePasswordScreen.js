import React, { useEffect,useState } from "react";
import { View, Text, TextInput,Button, Modal, TouchableOpacity, StyleSheet,FlatList,Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';;
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = ({route}) => {
  const { username,userId, loggeduser } = route.params;
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
      if (newPassword !== confirmPassword) {
          Alert.alert('Error', 'New passwords do not match');
          return;
      }

      try {
        console.log(userId);
        console.log("username",username);
        console.log("currentPassword",currentPassword);
        console.log("newPassword",newPassword);
          const response = await fetch(`http://192.168.38.122:5000/api/StudentApi/changepassword?UserId=${userId}&userName=${username}&currentpassword=${currentPassword}&password=${newPassword}`);
        const text = await response.text();
        console.log("Raw response:", text); 
        const result = JSON.parse(text);
          console.log(result);
          if (result.message === "Saved!") {
              Alert.alert('Success', 'Password changed successfully');
              navigation.goBack();
          } else {
              Alert.alert('Error', result.message || 'Failed to change password');
          }
      } catch (error) {
        console.log(error);
          Alert.alert('Error', 'Invalid Current Password');
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.title}>Change Password</Text>
            
            <TextInput
                placeholder="Current Password"
                secureTextEntry
            style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <TextInput
                placeholder="New Password"
                secureTextEntry
            style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                placeholder="Confirm New Password"
                secureTextEntry
            style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={handleChangePassword} style={styles.generateButton}>
                <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  generateButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  closeText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  questionCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  listButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ChangePasswordScreen;
