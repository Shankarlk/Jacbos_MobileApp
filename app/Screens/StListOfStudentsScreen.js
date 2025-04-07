import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, Button, Alert, StyleSheet, TextInput,TouchableOpacity } from 'react-native';
import axios from 'axios';

function StListOfStudentsScreen ({ route,navigation }) {
    console.log("StListOfStudentsScreen");
    const { standardId } = route.params; // Assuming the standard/class ID is passed from the previous screen
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [searchText, setSearchText] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`http://192.168.109.122:5000/api/StudentApi/getallStudents?standardId=${standardId}`);
            const studentList = response.data;
            
            setStudents(studentList);

            // By default, mark all students as "Present"
            const defaultAttendance = {};
            studentList.forEach(student => {
                defaultAttendance[student.id] = true; // true = Present, false = Absent
            });
            setAttendance(defaultAttendance);
            setFilteredStudents(studentList);

            // Alert.alert("Error", "Failed to fetch students.");
        } catch (error) {
            Alert.alert("Error", "Failed to fetch students.");
            console.error(error);
        }
    };
    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student => 
                student.studentName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };
    const navigateToMessageScreen = (student) => {
        navigation.navigate('MessageScreen', { student:student });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Students List</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Student..."
                value={searchText}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View >
                        <TouchableOpacity onPress={() => navigateToMessageScreen(item)} style={styles.row}>
                            <Text style={styles.studentName}>{item.studentName}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    searchInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8
    },
    studentName: {
        fontSize: 16
    }
});

export default StListOfStudentsScreen;
