import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather"; // Import Feather icons

export default function ChangePasswordTeacher({ route }) {
    const { username } = route.params || { username: "Guest" };

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [secureOld, setSecureOld] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Error", "New password must be at least 6 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                `http://192.168.109.122:5000/api/TimeTableApi/changepasswordteacher?UserId=${encodeURIComponent(username)}&currentpassword=${encodeURIComponent(oldPassword)}&password=${encodeURIComponent(newPassword)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
console.log(`http://192.168.109.122:5000/api/TimeTableApi/changepasswordteacher?UserId=${username}&currentpassword=${oldPassword}&password=${newPassword}`);
            const data = await response.json();
            console.log("Response:", data);

            if (data.message ==="Saved!") {
                Alert.alert("Success", "Password changed successfully");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                Alert.alert("Error", data.message || "Incorrect Current Password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            Alert.alert("Error", "Incorrect Current Password!");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Change Password</Text>

                <Text style={styles.label}>Current Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={secureOld}
                        placeholder="Enter Current Password"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureOld(!secureOld)}>
                        <Feather name={secureOld ? "eye-off" : "eye"} size={22} color="gray" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={secureNew}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                        <Feather name={secureNew ? "eye-off" : "eye"} size={22} color="gray" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={secureConfirm}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                        <Feather name={secureConfirm ? "eye-off" : "eye"} size={22} color="gray" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    formContainer: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 15,
        paddingRight: 10,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
