import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground,BackHandler, StyleSheet, Dimensions,Alert } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import BASE_URL from "./apiConfig";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation, route }) => {
  console.log("Received params:", route.params);
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
  const [schedule, setSchedule] = useState([]);
  const [numberOfClasses, setNumberOfClasses] = useState("0");
  const [numberOfCourses, setNumberOfCourses] = useState("0");

      useFocusEffect(
          useCallback(() => {
            fetchSchedule();  // Replace with your actual fetch method
          }, [])
        );
  
        useFocusEffect(
          React.useCallback(() => {
            const onBackPress = () => {
              Alert.alert(
                "Confirm Logout",
                "Are you sure you want to logout?",
                [
                  {
                    text: "No",
                    style: "cancel",
                    onPress: () => null
                  },
                  {
                    text: "Yes",
                    onPress: () => navigation.navigate("Login")
                  }
                ]
              );
              return true; // Prevent default back action
            };
        
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
        
            return () =>
              BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          }, [])
        );
        
  const fetchSchedule = async () => {
    try {
      if (!username) {
        console.error("User ID is missing");
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/TimeTableApi/gettimetable`, {
        params: { userId: username },
      });
      if (response.data && response.data.schedule) {
        setSchedule(response.data.schedule);
        setNumberOfClasses(response.data.timeTableDetails.numberOfClasses);
        setNumberOfCourses(response.data.timeTableDetails.numberOfCourses);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <Text style={styles.subject}>{item.courseName}</Text>
      <Text style={styles.standard}>{item.standardName}</Text>
      <Text style={styles.time}>{item.date} - {item.endDate}</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.title}>{loggeduser}</Text> */}
        </View>
        <Text style={styles.sectionTitle}>Daily Schedule</Text>
        {schedule.length === 0 ? (
        <Text style={styles.noDataText}>No Schedules Found</Text>
        ) : (
          <FlatList
            data={schedule}
            renderItem={renderScheduleItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={styles.scheduleList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "white" },
  container: { padding: 5 },noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  menuButton: { padding: 10, backgroundColor: "white", borderRadius: 5 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  statBox: { backgroundColor: "white", padding: 15, borderRadius: 10, alignItems: "center", width: "45%" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10,marginLeft:100 },
  scheduleList: { paddingVertical: 1 },
  scheduleCard: { backgroundColor: "#f8f9fa",elevation: 2,shadowColor: '#000', shadowOffset: { width: 0, height: 1 },padding: 15, margin: 5, borderRadius: 10, width: width * 0.45, alignItems: "center" },
  subject: { fontSize: 18, fontWeight: "bold", color: "#0d6efd" },
  standard: { fontSize: 16, color: "#212529" },
  time: { fontSize: 14, marginTop: 5 }
});

export default DashboardScreen;
