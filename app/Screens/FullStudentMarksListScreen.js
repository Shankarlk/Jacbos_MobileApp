import React, { useEffect, useState } from "react";
import { 
    View, Text, FlatList, ActivityIndicator, StyleSheet, Button,
    TextInput, TouchableOpacity 
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function FullStudentMarksListScreen({ route }) {
    const { unitTestId, unitTestName,username } = route.params; 
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchText, fromDate, toDate, attendanceData]);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch(
                `http://192.168.109.122:5000/api/TimeTableApi/getallstudentmarks?unitestId=${unitTestId}`
            );
            const data = await response.json();
            console.log("Attendance Data: ", data);

            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => 
                    new Date(b.attendanceDate) - new Date(a.attendanceDate)
                );
                setAttendanceData(sortedData);
                setFilteredData(sortedData);
            } else {
                setAttendanceData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Select Date";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const downloadExcel = async () => {
        try {
        //   const standardId = 1; // Replace this with actual selected ID
          const search = searchText || ""; // searchText from your state
      
          const url = `http://192.168.109.122:5000/api/TimeTableApi/downloadstudentmarks?standardId=${unitTestId}&search=${encodeURIComponent(search)}`;
      
          const fileUri = FileSystem.documentDirectory + "StudentMarks.xlsx";
      
          const downloadResumable = FileSystem.createDownloadResumable(
            url,
            fileUri
          );
      
          const { uri } = await downloadResumable.downloadAsync();
          console.log('Finished downloading to ', uri);
      
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
          } else {
            alert("Sharing is not available on this device");
          }
        } catch (error) {
          console.error("Download error:", error);
          alert("Failed to download Excel file");
        }
      };
      
    

    const filterData = () => {
        let filtered = attendanceData;

        // Filter by Student Name
        if (searchText) {
            filtered = filtered.filter(item =>
                item.studentName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by Date Range
        if (fromDate) {
            filtered = filtered.filter(item => new Date(item.attendanceDate) >= new Date(fromDate));
        }
        if (toDate) {
            filtered = filtered.filter(item => new Date(item.attendanceDate) <= new Date(toDate));
        }

        setFilteredData(filtered);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Search by Student Name"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={styles.downloadButton} onPress={downloadExcel}>
                    <Text style={styles.buttonText}>Download Excel</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.table}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : filteredData.length === 0 ? (
                    <Text style={styles.noData}>No records found</Text>
                ) : (
                    <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionCard}>
                            <Text style={styles.studentName}>Student Name: {item.studentName}</Text>
                            <Text style={styles.questionText}>English: {item.english}</Text>
                            <Text style={styles.questionText}>Hindi: {item.hindi}</Text>
                            <Text style={styles.questionText}>Kannada: {item.kannada}</Text>
                            <Text style={styles.questionText}>Maths: {item.maths}</Text>
                            <Text style={styles.questionText}>Science: {item.science}</Text>
                            <Text style={styles.questionText}>Social Science: {item.socialScience}</Text>
                            <Text style={styles.questionText}>Total Obtained Marks: {parseInt(item.obtainedMarks)}</Text>
                            <Text style={styles.questionText}>Total Max Marks: {parseInt(item.totalMarks)}</Text>
                        </View>
                    )}
                />
                

                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 8, // Optional: add spacing between items (if supported)
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    downloadButton: {
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8, // fallback if gap is not supported
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    questionCard: {
      backgroundColor: '#f0f0f0',
      padding: 16,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 2,
    },
    studentName: {
      fontSize: 18,
      fontWeight:"bold",
      marginBottom: 4,
      color: '#333',
    },
    questionText: {
      fontSize: 16,
      marginBottom: 4,
      color: '#333',
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dateFilterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    dateInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        width: 150,
        backgroundColor: "white",
    },
    table: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerRow: {
        backgroundColor: "#ddd",
        fontWeight: "bold",
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
    },
    headerCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    noData: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "gray",
    },
    clearButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    clearButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
});
