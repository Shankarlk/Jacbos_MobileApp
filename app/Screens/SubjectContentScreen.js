import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator,TouchableOpacity } from "react-native";
import BASE_URL from "./apiConfig";

function SubjectContentScreen({ navigation,route }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { username, standardId } = route.params || { username: "Guest", loggeduser: "Unknown" };
   
     useEffect(() => {
        fetchEventDetails();
     }, []);

     const fetchEventDetails = async () => {
        try {      
          // console.log(`${BASE_URL}/api/TimeTableApi/getallteachercourse?userId=${username}`);
          const eventResponse = await fetch(`${BASE_URL}/api/TimeTableApi/getallteachercourse?userId=${username}`);
          const eventData = await eventResponse.json();
          console.log("subject",eventData);
          const filteredData = eventData.filter(item => item.standardId === standardId);
          setEvents(filteredData);
          console.log("filtered",filteredData);
        } catch (err) {
          setError('Failed to fetch event details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ChaptersListScreen", { CourseId: item.courseId })}
    >
      <Text style={styles.title}>{item.courseName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (events.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.noDataText}>No subjects found for this class.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.heading}>Subjects</Text> */}
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  noDataText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    padding: 20,
  },  
  row: {
    justifyContent: 'space-between',
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
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubjectContentScreen;

