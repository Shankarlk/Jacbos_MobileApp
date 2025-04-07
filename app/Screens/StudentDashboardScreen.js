import React, { useState, useEffect } from "react";
import { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const StudentDashboardScreen = ({ navigation, route }) => {
  const { username,userId, loggeduser,isTeacher } = route.params;
    const menuRef = useRef(null);
    const [notificationMessage, setNotificationMessage] = useState("");

  return (
    <ImageBackground
      source={require("../assets/dashbg.jpeg")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => menuRef.current.open()}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>

        <Menu ref={menuRef}>
          <MenuTrigger />
          <MenuOptions>
            <MenuOption
              onSelect={() =>
                navigation.navigate("StudentDashboardScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Dashboard</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("ChangePasswordScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Change Password</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("StudentDetailsScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Student Details</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("HolidayEventListScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Holidays And Events List</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("PaymentScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Fee Details</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("TestResultScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Test/Academic Result</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("GalleryScreen", {
                  username: username,
                  userId: userId,
                  loggeduser: loggeduser,
                })
              }
            >
              <Text>Gallery</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.navigate("LeaveManagementScreen", {
                  userId: userId,
                  isTeacher: isTeacher,
                })
              }
            >
              <Text>Leave Management</Text>
            </MenuOption>
            <MenuOption
              onSelect={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              }
            >
              <Text>Logout</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{loggeduser}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  stats: { fontSize: 16, color: "gray" },
  sectionTitle: { fontSize: 20, marginVertical: 10 },
  scheduleList: { paddingVertical: 10 },
  scheduleCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    width: width * 0.4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  highlightedCard: {
    backgroundColor: "#007BFF",
  },
  highlightedText: {
    color: "#fff",
  },
  subject: { fontSize: 18, fontWeight: "bold" },
  standard: { fontSize: 16, color: "gray" },
  time: { fontSize: 14, marginTop: 5 },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    width: "50%",
    marginTop: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 3 },
  courseDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  courseName: { fontSize: 24, fontWeight: "bold" },
  materialName: { fontSize: 16, color: "gray", marginTop: 10 },
  progressBar: {
    marginTop: 3,
    marginBottom: 5,
  },
  userInfoContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  menuContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  menuButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  menuOptions: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5, // Adds shadow (Android)
    shadowColor: "#000", // Adds shadow (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default StudentDashboardScreen;
