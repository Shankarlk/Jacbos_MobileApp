import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, Button, Alert, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import BASE_URL from "./apiConfig";

function ListOfStudentsScreen ({ route }) {   
    const { standardId } = route.params || {};
    // console.log("ListOfStudentsScreen Loaded");
    // console.log("Received standardId:", standardId);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [searchText, setSearchText] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [disabledStudents, setDisabledStudents] = useState({});


    useEffect(() => {
        fetchStudents();
    }, []);

    // const fetchStudents = async () => {
    //     try {
    //         const response = await axios.get(`${BASE_URL}/api/StudentApi/getallStudents?standardId=${standardId}`);
    //         const studentList = response.data;
            
    //         setStudents(studentList);

    //         // By default, mark all students as "Present"
    //         const defaultAttendance = {};
    //         studentList.forEach(student => {
    //             defaultAttendance[student.id] = true; // true = Present, false = Absent
    //         });
    //         setAttendance(defaultAttendance);
    //         setFilteredStudents(studentList);

    //         // Alert.alert("Error", "Failed to fetch students.");
    //     } catch (error) {
    //         Alert.alert("Error", "Failed to fetch students.");
    //         console.error(error);
    //     }
    // };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/StudentApi/getallStudents?standardId=${standardId}`);
            const studentList = response.data;
    
            // Fetch leave data for students
            const leaveResponse = await axios.get(`${BASE_URL}/api/StudentApi/getstudentleave?standardId=${standardId}`);
            const studentLeaves = leaveResponse.data;
    
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
            const defaultAttendance = {};
            const disabledStudents = {};
    
            studentList.forEach(student => {
                // Check if the student is on leave today
                const isOnLeave = studentLeaves.some(leave => 
                    leave.studentId === student.id &&
                    today >= leave.fromDate.split('T')[0] &&
                    today <= leave.toDate.split('T')[0]
                );
    
                // If on leave, mark as absent (false) and disable toggle
                defaultAttendance[student.id] = isOnLeave ? false : true;
                disabledStudents[student.id] = isOnLeave; // true means disabled
            });
    
            setStudents(studentList);
            setAttendance(defaultAttendance);
            setFilteredStudents(studentList);
            setDisabledStudents(disabledStudents); // Store disabled states
        } catch (error) {
            Alert.alert("Error", "Failed to fetch students.");
            console.error(error);
        }
    };
    

    const toggleAttendance = (studentId) => {
        setAttendance(prevState => ({
            ...prevState,
            [studentId]: !prevState[studentId] // Toggle attendance status
        }));
    };
    const submitAttendance = async () => {
        const attendanceData = students.map(student => ({
            id: 0,
            studentId: student.id,
            isPresent: !!attendance[student.id], 
            attendanceDate: new Date().toISOString(), 
            isActive: true, 
            isDeleted: false 
        }));
    
        try {
            await axios.post(`${BASE_URL}/api/TimeTableApi/updateattendance`, attendanceData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(attendanceData);
            Alert.alert("Success", "Attendance submitted successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to submit attendance.");
            console.error(error);
        }
    };
    
    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredStudents(students); // Reset to full list if empty
        } else {
            const filtered = students.filter(student => 
                student.studentName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mark Attendance</Text>
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
                    <View style={styles.row}>
                        <Text style={styles.studentName}>{item.studentName}</Text>
                        <Switch
                            value={attendance[item.id]}
                            onValueChange={() => toggleAttendance(item.id)}
                            disabled={disabledStudents[item.id]} // Disable toggle if student is on leave
                        />
                    </View>
                )}
            />

            <Button title="Submit Attendance" onPress={submitAttendance} />
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

export default ListOfStudentsScreen;
