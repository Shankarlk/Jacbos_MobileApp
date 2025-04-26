import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ScrollView, StyleSheet, 
  ActivityIndicator, TouchableOpacity 
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from "./apiConfig";

function ListCourseConScreen({ route, navigation }) {
  const { CourseId,chapterId,contentId,ChapterName } = route.params;
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {       
      const eventResponse = await fetch(`${BASE_URL}/api/TimeTableApi/getcoursematerial?Id=${CourseId}`);
      const eventData = await eventResponse.json();
      
      const materials = eventData.filter(item => item.isMaterial === true && item.chapterId===chapterId && parseInt(item.contentType)===contentId);
      const exercisesList = eventData.filter(item => item.isMaterial === false && item.chapterId===chapterId && parseInt(item.contentType)===contentId);

      setCourseMaterials(materials);
      setExercises(exercisesList);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'file-pdf';
      case 'doc':
      case 'docx':
        return 'file-word';
      case 'ppt':
      case 'pptx':
        return 'file-powerpoint';
      case 'xls':
      case 'xlsx':
        return 'file-excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'file-image';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'file-video';
      case 'mp3':
      case 'wav':
        return 'file-music';
      case 'zip':
      case 'rar':
        return 'folder-zip';
      default:
        return 'file';
    }
  };
    
  const renderItem = ({ item }) => {
    const iconName = getFileIcon(item.courseMaterialName);
    const nameWithoutExt = item.courseMaterialName.replace(/\.[^/.]+$/, "");
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("FileViewerScreen", { file: item.courseMaterialPath })}
      >
        <Icon name={iconName} size={40} color="#007bff" style={styles.icon} />
        <Text style={styles.title}>{nameWithoutExt}</Text>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chapterName}>{ChapterName}</Text>
  
      <View style={styles.sectionContainer}>
        {/* Chapter Documents */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Documents:</Text>
          {courseMaterials.length > 0 ? (
            <FlatList
              data={courseMaterials}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No documents available</Text>
          )}
        </View>
  
        {/* Chapter Exercises */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Exercise :</Text>
          {exercises.length > 0 ? (
            <FlatList
              data={exercises}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No exercises available</Text>
          )}
        </View>
      </View>
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
  chapterName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  
  sectionBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 150,
  },
  icon: {
    fontSize: 36,
    marginBottom: 10,
  }, 
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 10,
  },
  
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
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
