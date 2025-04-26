import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from "./apiConfig";

const ChapterContentScreen = ({ navigation, route }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chapterId,CourseId,ChapterName } = route.params;

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch(`http://192.168.109.122:5000/api/TimeTableApi/contenttypelist?Id=${chapterId}`);
      const data = await response.json();
      setContents(data);
      console.log('type',data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ListCourseConScreen', {
            CourseId: CourseId,
          chapterId: chapterId,
          contentId:item.id,
          ChapterName:ChapterName
        })
      }
    >
      <Icon name="folder" size={40} color="#007bff" />
      <Text style={styles.title}>{item.questionTypeName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (contents.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.noDataText}>No content type found for this chapter.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={contents}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
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
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    padding: 20,
  },
});

export default ChapterContentScreen;
