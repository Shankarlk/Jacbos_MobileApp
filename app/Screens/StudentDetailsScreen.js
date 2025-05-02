import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "./apiConfig";

const StudentDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { username, userId } = route.params;
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/StudentApi/getstudentdetails?userId=${username}`);
                const data = await response.json();
                setStudent(data);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 16, backgroundColor: '#f3f4f6' }}>
    
        {/* Student Details Card */}
        <View style={{ width: '100%',height: '95%', backgroundColor: 'white', borderRadius: 8, elevation: 4, padding: 10, marginTop: 10 }}>
            
            <View style={{ paddingHorizontal: 10,marginTop:"10%"  }}>
                {[
                    { label: 'Student Name', value: `${student.name} ${student.surname}` },
                    { label: 'Email-ID', value: student.email },
                    { label: 'Phone No', value: student.phone },
                    { label: 'Standard', value: student.standardName },
                    { label: 'Section', value: student.divisionName },
                    { label: 'Date of Join', value: formatDate(student.doj) }
                ].map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' }}>
                        
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0d6efd', minWidth: 130,marginBottom:10 }}>
                            {item.label} :
                        </Text>
    
                        <Text style={{ fontSize: 16, color: 'black', flex: 1, flexWrap: 'wrap',marginBottom:10 }}>
                            {item.value}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{ flexDirection: 'row', marginTop: "90%" }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14, backgroundColor: 'black', borderRadius: 8, marginLeft: "25%", width: 120, alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
    
    );
};

export default StudentDetailsScreen;
