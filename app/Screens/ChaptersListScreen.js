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

const ChaptersListScreen = ({ navigation, route }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { CourseId } = route.params;

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/QuestionApi/getchapterName?standardId=0&courseId=${CourseId}`);
      const data = await response.json();
      console.log(data);
      setChapters(data);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ChapterContentScreen', { chapterId: item.value,CourseId:CourseId,ChapterName:item.text })}
    >
      <Icon name="folder" size={40} color="#007bff" />
      <Text style={styles.title}>{item.text}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (chapters.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.noDataText}>No chapters found for this course.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chapters}
      renderItem={renderItem}
      keyExtractor={(item) => item.value.toString()}
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

export default ChaptersListScreen;
