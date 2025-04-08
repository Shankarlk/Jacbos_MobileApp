import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

const PaymentScreen = ({ route }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      const response = await fetch(`http://192.168.109.122:5000/api/StudentApi/getpaymenthistory?userId=${username}`);
      const data = await response.json();
      var sortedData = data.sort((a, b) => a.installmentNum - b.installmentNum);
      setFees(sortedData); 
      console.log(sortedData);
    } catch (err) {
      setError('Failed to fetch fee details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Installment Number :{item.installmentNum}</Text>
      <Text style={styles.amount}>Amount Paid: {item.amount}</Text>
      <Text style={styles.amount}>Payment Date: {formatDate(item.paymentDate)}</Text>
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
      <FlatList
        data={fees}
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
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    color:"blue",
    marginBottom:5,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 17,
    color: 'black',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
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

export default PaymentScreen;
