import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";

function ListOfFilesScreen({ route, navigation }) {
  const { eventId,StandardId } = route.params;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

 
      useEffect(() => {
         fetchEventDetails();
      }, []);
 
      const fetchEventDetails = async () => {
         try {       
           const eventResponse = await fetch(`http://192.168.109.122:5000/api/GalleryApi/getgalleryevents?StandardId=${StandardId}`);
           const eventData = await eventResponse.json();
           console.log(eventData);
           const specificEvent = eventData.filter(event => event.eventId === Number(eventId));
           console.log("Filtered Event:", specificEvent);
           
           setFiles(specificEvent);
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
      onPress={() => navigation.navigate("FileViewerScreen", { file: item.location })}
    >
      <Text style={styles.title}>{item.fileName}</Text>
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
      <Text style={styles.heading}>Files</Text>
      <FlatList
        data={files}
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

export default ListOfFilesScreen;
