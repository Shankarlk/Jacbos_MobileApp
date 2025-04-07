import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StudentDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { username, userId, loggeduser } = route.params;
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`http://192.168.38.122:5000/api/StudentApi/getstudentdetails?userId=${userId}`);
                const data = await response.json();
                setStudent(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentDetails();
    }, [userId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />;
    }

    if (!student) {
        return <Text style={{ textAlign: 'center', marginTop: 20 }}>Student details not found.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f3f4f6' }}>
        <View style={{ width: '90%', marginBottom: 16, padding: 20, backgroundColor: 'white', borderRadius: 8, shadowOpacity: 0.1, shadowRadius: 4, shadowColor: 'black', shadowOffset: { height: 2, width: 0 } }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>{student.name} {student.surname}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>Email Id: {student.email}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>Phone No: {student.phone}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>Standard: {student.standardName}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>Division: {student.divisionName}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>Date Of Join: {formatDate(student.doj)}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14, backgroundColor: '#3b82f6', borderRadius: 8, alignItems: 'center', width: '50%' }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Back</Text>
        </TouchableOpacity>
    </ScrollView>
    );
};

export default StudentDetailsScreen;
