import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet,ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "./apiConfig";

const StudentMarksListScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);

  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
    const navigation = useNavigation();
  const [unitData, setUnitData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`${BASE_URL}/api/TimeTableApi/getallteacherunittest?userId=${username}`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
     
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("API did not return an array!");
  
        setUnitData(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };
  
    fetchData();
  }, []);
  

  const renderItem = ({ item , index}) => {
    console.log("Rendering Item:", item);
    return (
      <TouchableOpacity style={styles.row}
      onPress={() => navigation.navigate("FullStudentMarksListScreen", { unitTestId: item.id , unitTestName: item.testNum,username:username})}
      >
        <Text style={styles.cell}>{item.testNum || "No TestNum"}</Text>
        <Text style={styles.cell}>{item.standardName || "No StandardName"}</Text>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Update Student Marks</Text>
      </View> */}

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Unit Test</Text>
        <Text style={styles.headerCell}>Standard Name</Text>
      </View>

        {unitData.length === 0 ? (
          <Text>No data available</Text>
        ) : (
          <FlatList 
            data={unitData} 
            renderItem={renderItem} 
            keyExtractor={(item, index) => index.toString()}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default StudentMarksListScreen;
