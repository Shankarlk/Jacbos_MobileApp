import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Linking, StyleSheet,Text,TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";

const LeaveManagementScreen = ({route}) => {
  const { username, loggeduser,isClassteacher } = route.params || { username: "Guest", loggeduser: "Unknown" };
  const isTeacher = isClassteacher;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [leaveType, setLeaveType] = useState(null);
    const [items, setItems] = useState([
      { label: "Select Leave Type", value: "" },
      { label: "Casual Leave (CL)", value: "CL" },
      { label: "Earned Leave (EL)", value: "EL" },
      { label: "Sick Leave (SL)", value: "SL" },
      { label: "Loss of Pay (LOP)", value: "LOP" },
    ]);
    const [leavemessage, setLeaveMessage] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    // console.log(student);
    const handleFromDateChange = (event, selectedDate) => {
        setShowFromDatePicker(false);
        if (selectedDate) setFromDate(selectedDate);
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowToDatePicker(false);
        if (selectedDate) setToDate(selectedDate);
    };

    const formatDate = (date) => {
        return date ? date.toDateString() : 'Select Date';
    };
    const sendWhatsAppMessage =async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDateNormalized = new Date(fromDate);
        fromDateNormalized.setHours(0, 0, 0, 0);
        const toDateNormalized = new Date(toDate);
        toDateNormalized.setHours(0, 0, 0, 0);

        if (fromDateNormalized < today) {
            Alert.alert("Invalid Submission", "From Date cannot be earlier than today.");
            return;
        }
        if (fromDateNormalized > toDateNormalized) {
            Alert.alert("Invalid Submission", "From Date cannot be later than To Date.");
            return;
        }
        if (!leavemessage) {
            Alert.alert('Error', 'Please enter leave message.');
            return;
        }
        console.log(username);
        if(isTeacher == true){
          const fromDtval = new Date(fromDate);
          const toDtval = new Date(toDate);
          const today = new Date();

          if (!username || !leaveType || !leavemessage || !fromDtval || !toDtval) {
              alert("Please fill in all fields.");
              return;
          }
          if (!leaveType) {
              Alert.alert('Error', 'Please select leave type.');
              return;
          }

          // Validate Date Range
          if (fromDtval < today.setHours(0, 0, 0, 0)) {
              alert("From Date cannot be in the past.");
              return;
          }

          if (toDtval < fromDtval) {
              alert("To Date cannot be before From Date.");
              return;
          }

            const fromDt = new Date(fromDate).toISOString();
            const toDt = new Date(toDate).toISOString();
            const response = await fetch("http://192.168.109.122:5000/api/TimeTableApi/leavemanagement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id:0,
                    userId: username,
                    teacherId:0,
                    leaveType:leaveType,
                    leaveReason: leavemessage,
                    fromDate: fromDt,
                    toDate: toDt
                })
            });
        const eventData = await response.json();
        console.log("Repsonse : ",eventData);
        if(eventData.Message == undefined){
            alert('Message Not Sent');
        }else{
        alert(eventData.Message);
        }
        }else{
            const fromDt = new Date(fromDate).toISOString();
            const toDt = new Date(toDate).toISOString();
            console.log("Parent Sending...",`{
                    id:0,
                    userId: ${username},
                    teacherId:0,
                    leaveReason: ${leavemessage},
                    fromDate: ${fromDt},
                    toDate: ${toDt}
                }`);
            const response = await fetch("http://192.168.109.122:5000/api/StudentApi/studentleavemanagement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id:0,
                    userId: username,
                    studentId:0,
                    leaveReason: leavemessage,
                    fromDate: fromDt,
                    toDate: toDt
                })
            });
            const eventData = await response.json();
            console.log("Repsonse : ",eventData);
            if(eventData.Message == undefined){
                alert('Message Not Sent');
            }else{
            alert(eventData.Message);
            }
        }
    };

    return (
            <View style={styles.container}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
            {/* <Text style={styles.row}>Enter The Leave Reason</Text>
            <TextInput
                style={[styles.input, styles.leavetextArea]}
                placeholder="Enter your message here..."
                multiline
                numberOfLines={4}
                value={leavemessage}
                onChangeText={setLeaveMessage}
            /> */}
            <Text style={styles.row}>From Date</Text>
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.input}>
                <Text>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
                <DateTimePicker value={fromDate || new Date()} mode="date" display="default" onChange={handleFromDateChange} />
            )}

            <Text style={styles.row}>To Date</Text>
            <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.input}>
                <Text>{formatDate(toDate)}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
                <DateTimePicker value={toDate || new Date()} mode="date" display="default" onChange={handleToDateChange} />
            )}
           {isTeacher && (
              <>
                <Text style={styles.row}>Leave Type</Text>
                <DropDownPicker
                  open={open}
                  value={leaveType}
                  items={items}
                  setOpen={setOpen}
                  setValue={setLeaveType}
                  setItems={setItems}
                  placeholder="Select Leave Type"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </>
            )}

            <Text style={styles.row}>Enter The Leave Message</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your message here..."
                multiline
                numberOfLines={4}
                value={leavemessage}
                onChangeText={setLeaveMessage}
            />
        
                    <TouchableOpacity onPress={sendWhatsAppMessage} style={styles.generateButton}>
                        <Text style={styles.buttonText}>Send Leave Request</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f4f4",
    },
    button: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
      // backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      width: "90%",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    label: {
      fontWeight: "bold",
      marginTop: 10,
    },
    picker: {
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    generateButton: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
    },
    closeText: {
      color: "red",
      textAlign: "center",
      marginTop: 10,
    },
    questionCard: {
      backgroundColor: "#fff",
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    questionText: {
      fontSize: 16,
      marginBottom: 5,
    },
    listButton: {
      backgroundColor: "#007bff",
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    leavetextArea: {
        height: 50,
        textAlignVertical: 'top',
    },
  
    closeButton: {
      backgroundColor: "red",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    row:{
        marginTop:10,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: "#fff",
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: "#ccc",
    },
  });

export default LeaveManagementScreen;
