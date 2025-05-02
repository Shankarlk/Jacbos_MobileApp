import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity,ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "./apiConfig";

const UpdateStudentMarks = ({ route }) => {
    const [loading, setLoading] = useState(true);
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
    const navigation = useNavigation();
  const [unitData, setUnitData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start loading
        const response = await fetch(`${BASE_URL}/api/UpdateStudentMarksApi/getunittest`);
  
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array!");
        }
  
        setUnitData(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // stop loading
      }
    };
  
    fetchData();
  }, []);
  

  const renderItem = ({ item , index}) => {
    console.log("Rendering Item:", item);
    return (
      <TouchableOpacity style={styles.row}
      onPress={() => navigation.navigate("UpdateStudentScoresScreen", { unitTestId: item.id , unitTestName: item.testNum,username:username,standardId:item.standardId})}
      > 
        <Text style={styles.testname}>{item.testNum || "No TestNum"}</Text>
        <Text style={styles.cell}>{item.standardName || "No StandardName"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Update Student Marks</Text>
      </View> */}

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Unit Test</Text>
        <Text style={styles.headerCell}>Standard Name</Text>
      </View>

      {loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 10 }}>Loading unit tests...</Text>
  </View>
) : unitData.length === 0 ? (
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
  testname: {
    flex: 1,
    textAlign: "center",
    color:"#0d6efd"
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default UpdateStudentMarks;
