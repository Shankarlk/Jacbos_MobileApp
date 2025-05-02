import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert, Linking, StyleSheet,Text,TouchableOpacity,ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import BASE_URL from "./apiConfig";
import NoInternetBanner from "./NoInternetBanner"; 

const EditLeaveRequestScreen = ({route}) => {
    const [loading, setLoading] = useState(false);
    const { username, loggeduser, isClassteacher, leaveItem } = route.params || {};
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
    useEffect(() => {
        if (leaveItem) {
          setLeaveType(leaveItem.leaveType || '');
          setLeaveMessage(leaveItem.leaveReason || '');
          setFromDate(new Date(leaveItem.fromDate));
          setToDate(new Date(leaveItem.toDate));
        }
      }, [leaveItem]);
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
        setLoading(true);
        if(isTeacher == true){
            try {
                
          const fromDtval = new Date(fromDate);
          const toDtval = new Date(toDate);
          const today = new Date();

          if (!username || !leavemessage || !fromDtval || !toDtval) {
              alert("Please fill in all fields.");
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
            const response = await fetch(`${BASE_URL}/api/TimeTableApi/leavemanagement`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: leaveItem ? leaveItem.id : 0,
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
                } catch (error) {
                    console.error(error);
                    alert("An error occurred. Please try again.");
                } finally {
                    setLoading(false); // stop loading
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
            const response = await fetch(`${BASE_URL}/api/StudentApi/studentleavemanagement`, {
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
                        {loading && (
                          <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                          }}>
                            <ActivityIndicator size="large" color="#007BFF" />
                          </View>
                        )}
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
           
              
                <Text style={styles.row}>Leave Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Leave Type"
                  value={leaveType}
                  onChangeText={setLeaveType}
                />
              
            

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
      justifyContent: "top",
      alignItems: "center",
      width: "100%",
      height:"100%"
      // backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      width: "95%",
      height:"95%"
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

export default EditLeaveRequestScreen;
