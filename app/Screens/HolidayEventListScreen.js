import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import BASE_URL from "./apiConfig";

const HolidayEventListScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/PublicHolidayApi/getpublicholidays`); 
      const data = await response.json();
        console.log(data);
      const holidayList = data.filter(item => !item.isEvent)
      .sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));
      const eventList = data.filter(item => item.isEvent)
      .sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));

      setHolidays(holidayList);
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.holidayOrEventName}</Text>
      <Text style={styles.date}>{formatDate(item.holidayDate)}</Text>
    </View>
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
      <Text style={styles.heading}>Holiday</Text>
      <FlatList
        data={holidays}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false} 
      />

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
};

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
    marginTop:10,
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
    color:"blue",
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'black',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HolidayEventListScreen;
