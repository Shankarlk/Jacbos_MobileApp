import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ScrollView, StyleSheet, 
  ActivityIndicator, TouchableOpacity 
} from "react-native";

function ListCourseConScreen({ route, navigation }) {
  const { CourseId } = route.params;
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {       
      const eventResponse = await fetch(`http://192.168.109.122:5000/api/TimeTableApi/getcoursematerial?Id=${CourseId}`);
      const eventData = await eventResponse.json();
      
      console.log(eventData);
      // Separate course materials and exercises
      const materials = eventData.filter(item => item.isMaterial === true);
      const exercisesList = eventData.filter(item => item.isMaterial === false);

      setCourseMaterials(materials);
      setExercises(exercisesList);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("FileViewerScreen", { file: item.courseMaterialPath })}
    >
      <Text style={styles.title}>{item.courseMaterialName}</Text>
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
      {/* Course Materials Section 📚*/}
      {courseMaterials.length > 0 && (
        <>
          <Text style={styles.heading}>Materials</Text>
          <FlatList
            data={courseMaterials}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Exercises Section 📝*/}
      {exercises.length > 0 && (
        <>
          <Text style={styles.heading}> Exercises</Text>
          <FlatList
            data={exercises}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:30,
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

export default ListCourseConScreen;
