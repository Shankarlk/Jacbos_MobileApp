import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import BASE_URL from "./apiConfig";

const TestResultScreen = ({ route,navigation }) => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };

  useEffect(() => {
    fetchTestResults();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

  const fetchTestResults = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/StudentApi/gettestresult?userId=${username}`);
      const data = await response.json();

let seen = new Set();
let uniqueData = data.filter(item => {
    if (!seen.has(item.unitTestName)) {
        seen.add(item.unitTestName);
        return true; // Keep this item
    }
    return false; // Skip duplicates
});

let sortedData = uniqueData.sort((a, b) => 
    a.unitTestName.localeCompare(b.unitTestName, undefined, { numeric: true })
);

console.log(sortedData);

      setTestResults(sortedData);
    } catch (err) {
      setError('Failed to fetch test results.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* <Text style={styles.subject}>Standard : {item.standardName}</Text>
      <Text style={styles.subject}>Division : {item.divisionName}</Text> */}
      {/* <Text style={styles.subject}>{item.unitTestName}</Text> */}
      {/* <Text style={styles.marks}>Test Name: {item.unitTestName}</Text>
      <Text style={styles.marks}>Marks: {item.courseMarks}</Text>
      <Text style={styles.marks}>Test Date: {formatDate(item.testDate)}    </Text> Make From Popup
Routing add machine popup - success messages, part number desc - not coming
Pages 2 grid reload,
Routing Creating,
Roles employee ,
Order Entry   */}
      
          <TouchableOpacity
            style={styles.subject}
            onPress={() => navigation.navigate("ResultScreen", { username: username,loggeduser:loggeduser,unitTestId:item.unitTestId,unitestName:item.unitTestName })}
          >
            <Text style={styles.testname}>{item.unitTestName}</Text>
          </TouchableOpacity>
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
      {/* <Text style={styles.heading}>Tests List</Text> */}
      <FlatList
        data={testResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:120
  },
  row: {
    justifyContent: 'space-between',
  },
  testname:{
    color:"blue",
    fontSize:20
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  marks: {
    fontSize: 16,
    color: 'gray',
  },
  grade: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 5,
    color: 'green',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default TestResultScreen;
