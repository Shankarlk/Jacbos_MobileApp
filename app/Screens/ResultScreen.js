import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

function ResultScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
    const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const { username, userId, loggeduser,unitTestId,unitestName } = route.params;

  useEffect(() => {
    fetchTestResults();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch(
        `http://192.168.38.122:5000/api/StudentApi/gettestresult?userId=${userId}`
      );
      const data = await response.json();
      let sortedData = data.sort((a, b) => a.unitTestName.localeCompare(b.courseName, undefined, { numeric: true }));
      setTestResults(sortedData);
    } catch (err) {
      setError("Failed to fetch test results.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* <Text style={styles.subject}>Standard : {item.standardName}</Text>
       <Text style={styles.subject}>Division : {item.divisionName}</Text> */}
      <Text style={styles.subject}>{item.courseName}</Text>
       <Text style={styles.marks}>Marks: {item.courseMarks}</Text>
       <Text style={styles.marks}>Test Date: {formatDate(item.testDate)}    </Text>

    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{unitestName}</Text>
      <FlatList
        data={testResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
  },
  marks: {
    fontSize: 16,
    color: "gray",
  },
  grade: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 5,
    color: "green",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default ResultScreen;
