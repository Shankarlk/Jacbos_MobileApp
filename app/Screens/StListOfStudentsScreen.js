import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, Button, Alert, StyleSheet, TextInput,ActivityIndicator,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Modal } from 'react-native';
import BASE_URL from "./apiConfig";
import NoInternetBanner from "./NoInternetBanner"; 

function StListOfStudentsScreen ({ route,navigation }) {
    const [loading, setLoading] = useState(true);
    const { standardId } = route.params; // Assuming the standard/class ID is passed from the previous screen
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [groupMessage, setGroupMessage] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const sendWhatsAppToAll = async () => {
        if (!groupMessage.trim()) {
            Alert.alert('Error', 'Please enter a message.');
            return;
        }
    
        try {
            for (let i = 0; i < filteredStudents.length; i++) {
                const student = filteredStudents[i];
                const studentId = student.id;
    
                const response = await fetch(`${BASE_URL}/api/TimeTableApi/sendwatextparent?id=${studentId}&message=${encodeURIComponent(groupMessage)}`);
                const result = await response.json();
                console.log(result);
                if (result.Message) {
                    console.log(`Success for ${student.studentName}: ${result.Message}`);
                } else {
                    console.warn(`Failed for ${student.studentName}`);
                }
            }
    
            Alert.alert('Success', 'Messages sent to all students.');
            setGroupMessage('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error sending WhatsApp messages:', error);
            Alert.alert('Error', 'Something went wrong while sending messages.');
        }
    };
    
    
    const fetchStudents = async () => {
        try {
            setLoading(true); // Start loading
            const response = await axios.get(`${BASE_URL}/api/StudentApi/getallStudents?standardId=${standardId}`);
            const studentList = response.data;
    
            setStudents(studentList);
    
            // By default, mark all students as "Present"
            const defaultAttendance = {};
            studentList.forEach(student => {
                defaultAttendance[student.id] = true;
            });
    
            setAttendance(defaultAttendance);
            setFilteredStudents(studentList);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch students.");
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
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
      <NoInternetBanner />
            <Text style={styles.header}>Students List</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Student..."
                value={searchText}
                onChangeText={handleSearch}
            />
           {loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ marginBottom: 10 }}>Loading students...</Text>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
) : (
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
)}

            {/* <Button
                title="Send Message to All"
                onPress={() => setModalVisible(true)}
                color="#007AFF"
            />  */}
            
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Send Message to All</Text>
        </TouchableOpacity>       
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Send To All Message</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Type your message..."
                        value={groupMessage}
                        onChangeText={setGroupMessage}
                        multiline
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                        <Button title="Send" onPress={sendWhatsAppToAll} color="black" />
                    </View>
                </View>
            </View>
        </Modal>
        
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
        fontSize: 16,
        color:"#0d6efd"
    },modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    modalInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});

export default StListOfStudentsScreen;
