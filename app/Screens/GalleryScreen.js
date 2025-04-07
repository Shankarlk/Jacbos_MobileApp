import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator,TouchableOpacity } from "react-native";

function GalleryScreen({ navigation,route }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [standardId, SetStandard] = useState("");
    const { username, userId, loggeduser } = route.params;
   
     useEffect(() => {
        fetchEventDetails();
     }, []);

     const fetchEventDetails = async () => {
        try {
          const studentResponse = await fetch(`http://192.168.38.122:5000/api/StudentApi/getstudentdetails?userId=${userId}`);
          const studentData = await studentResponse.json();
          console.log(studentData);
          if (!studentData || !studentData.id) {
            throw new Error('Student ID not found.');
          }
      
          const StandardId = studentData.standardId;
          console.log(StandardId);
          SetStandard(StandardId);
      
          const eventResponse = await fetch(`http://192.168.38.122:5000/api/GalleryApi/getgalleryevents?StandardId=${StandardId}`);
          const eventData = await eventResponse.json();
          console.log(eventData);
          const uniqueEvents = eventData
          .filter((event, index, self) =>
            index === self.findIndex((e) => e.eventName === event.eventName)
          )
          .sort((a, b) => a.eventName.localeCompare(b.eventName));
        
          setEvents(uniqueEvents);
          console.log(uniqueEvents);
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
      onPress={() => navigation.navigate("ListOfFilesScreen", { eventId: item.eventId,StandardId : standardId })}
    >
      <Text style={styles.title}>{item.eventName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Events</Text>
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

export default GalleryScreen;

