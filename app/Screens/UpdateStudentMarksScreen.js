import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const UpdateStudentMarks = ({ route }) => {
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
    const navigation = useNavigation();
  const [unitData, setUnitData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.109.122:5000/api/UpdateStudentMarksApi/getunittest');
        
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API Response:", data);

        if (!Array.isArray(data)) {
          throw new Error("API did not return an array!");
        }

        setUnitData(data);
        console.log("Updated State:", data); // Ensuring state updates
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item , index}) => {
    console.log("Rendering Item:", item);
    return (
      <TouchableOpacity style={styles.row}
      onPress={() => navigation.navigate("UpdateStudentScoresScreen", { unitTestId: item.id , unitTestName: item.testNum,username:username})}
      >
        <Text style={styles.cell}>{item.testNum || "No TestNum"}</Text>
        <Text style={styles.cell}>{item.standardName || "No StandardName"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Update Student Marks</Text>
      </View>

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

export default UpdateStudentMarks;
