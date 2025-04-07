import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation, route }) => {
  console.log("Received params:", route.params);
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
  const [schedule, setSchedule] = useState([]);
  const [numberOfClasses, setNumberOfClasses] = useState("0");
  const [numberOfCourses, setNumberOfCourses] = useState("0");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      if (!username) {
        console.error("User ID is missing");
        return;
      }
      const response = await axios.get("http://192.168.109.122:5000/api/TimeTableApi/gettimetable", {
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
    <ImageBackground source={require("../assets/dashbg.jpeg")} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.title}>{loggeduser}</Text> */}
        </View>
        <Text style={styles.sectionTitle}>Daily Schedules</Text>
        <FlatList data={schedule} renderItem={renderScheduleItem} keyExtractor={(item, index) => index.toString()} numColumns={2} contentContainerStyle={styles.scheduleList} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#F5F5F5" },
  container: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  menuButton: { padding: 10, backgroundColor: "white", borderRadius: 5 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  statBox: { backgroundColor: "white", padding: 15, borderRadius: 10, alignItems: "center", width: "45%" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  scheduleList: { paddingVertical: 10 },
  scheduleCard: { backgroundColor: "#EDEDED", padding: 15, margin: 5, borderRadius: 8, width: width * 0.45, alignItems: "center" },
  subject: { fontSize: 18, fontWeight: "bold", color: "#673AB7" },
  standard: { fontSize: 16, color: "gray" },
  time: { fontSize: 14, marginTop: 5 }
});

export default DashboardScreen;
