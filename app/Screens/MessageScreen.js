import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Linking, StyleSheet,Text } from 'react-native';
import BASE_URL from "./apiConfig";

const MessageScreen = ({route}) => {
    const { student } = route.params;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    console.log(student);
    const sendWhatsAppMessage =async () => {
        if (!message) {
            Alert.alert('Error', 'Please enter both phone number and message.');
            return;
        }
        console.log(student.id);
        const eventResponse = await fetch(`${BASE_URL}/api/TimeTableApi/sendwatextparent?id=${student.id}&message=${message}`);
        const eventData = await eventResponse.json();
        console.log(eventData);
        if(eventData.Message == undefined){
            alert('Error',"Message Not Sent");
        }else{
        alert(eventData.Message);
        }
    };

    return (
        <View style={styles.container}>
            {/* <TextInput
                style={styles.input}
                placeholder="Enter Parent's WhatsApp Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            /> */}
            <Text style={styles.row}>Student Name : {student.studentName}</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your message here..."
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send WhatsApp Message" onPress={sendWhatsAppMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
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
});

export default MessageScreen;
