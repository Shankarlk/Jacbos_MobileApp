import React, { useEffect, useState } from 'react'; 
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import BASE_URL from "./apiConfig";

const StudentDashboardScreen = ({ route }) => {
  const { username, userId, loggeduser, isTeacher } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/StudentApi/getstudentdetails?userId=${username}`
        );
        const data = await response.json();
        setStudent(data);
        console.log("Fetched Student Data:", data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [userId]);

  return (
    <ImageBackground
      source={require("../assets/dashbg.jpeg")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        {/* Show loading text until data is fetched */}
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : student ? (
          // Render Student Info Card only if student is not null
          <View style={styles.studentCard}>
            <Text style={styles.studentName}>
              Student Name: {student.name} {student.surname}
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoBox}>{student.standardName}</Text>
              <Text style={styles.infoBox}>Section: {student.divisionName}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Student details not available</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  loadingText: { fontSize: 18, color: "gray" },
  errorText: { fontSize: 18, color: "red" },
  studentCard: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    elevation: 4,
    alignItems: "center",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  infoBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StudentDashboardScreen;
