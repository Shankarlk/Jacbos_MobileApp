import React, { useEffect, useState } from "react";
import { 
    View, Text, FlatList, ActivityIndicator, StyleSheet, Button,
    TextInput, TouchableOpacity 
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from "@react-native-community/datetimepicker";
import BASE_URL from "./apiConfig";

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
    const [isClassTeacher, setIsClassTeacher] = useState(false);
    const [allowedCourses, setAllowedCourses] = useState([]);


    useEffect(() => {
        fetchAttendanceData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchText, fromDate, toDate, attendanceData]);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/TimeTableApi/getallstudentmarks?unitestId=${unitTestId}&userId=${username}`
            );
            const data = await response.json();
            console.log("Data: ", data);

            if (Array.isArray(data.students)) {
                const sortedData = data.students.sort((a, b) =>
                    (a.studentName || "").localeCompare(b.studentName || "")
                );
                setAttendanceData(sortedData);
                setFilteredData(sortedData);
                setIsClassTeacher(data.isClassTeacher);
                setAllowedCourses(data.allowedCourses || []); // optional: if you include this in API
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
    const canShow = (subject) => {
        return isClassTeacher || allowedCourses.includes(subject);
    }
    const downloadExcel = async () => {
        try {
        //   const standardId = 1; // Replace this with actual selected ID
          const search = searchText || ""; // searchText from your state
      
          const url = `${BASE_URL}/api/TimeTableApi/downloadstudentmarks?standardId=${unitTestId}&search=${encodeURIComponent(search)}&userId=${username}`;
      
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
                    <>
                        {/* Table Header */}
                        <View style={styles.tableRowHeader}>
                            <Text style={styles.tableCellHeader}>Name</Text>
                            {canShow("English") && <Text style={styles.tableCellHeader}>Eng</Text>}
                            {canShow("Hindi") && <Text style={styles.tableCellHeader}>Hin</Text>}
                            {canShow("Kannada") && <Text style={styles.tableCellHeader}>Kan</Text>}
                            {canShow("Maths") && <Text style={styles.tableCellHeader}>Math</Text>}
                            {canShow("Science") && <Text style={styles.tableCellHeader}>Sci</Text>}
                            {canShow("SocialScience") && <Text style={styles.tableCellHeader}>Soc</Text>}
                            {isClassTeacher && (
                                <>
                                    <Text style={styles.tableCellHeader}>Obtd</Text>
                                    <Text style={styles.tableCellHeader}>Max</Text>
                                </>
                            )}
                        </View>
    
                        {/* Table Rows */}
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.studentName}</Text>
                                    {canShow("English") && <Text style={styles.tableCell}>{item.english}</Text>}
                                    {canShow("Hindi") && <Text style={styles.tableCell}>{item.hindi}</Text>}
                                    {canShow("Kannada") && <Text style={styles.tableCell}>{item.kannada}</Text>}
                                    {canShow("Maths") && <Text style={styles.tableCell}>{item.maths}</Text>}
                                    {canShow("Science") && <Text style={styles.tableCell}>{item.science}</Text>}
                                    {canShow("SocialScience") && <Text style={styles.tableCell}>{item.socialScience}</Text>}
                                    {isClassTeacher && (
                                        <>
                                            <Text style={styles.tableCell}>{parseInt(item.obtainedMarks)}</Text>
                                            <Text style={styles.tableCell}>{parseInt(item.totalMarks)}</Text>
                                        </>
                                    )}
                                </View>
                            )}
                        />
                    </>
                )}
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginBottom:50,
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
    tableRowHeader: {
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableCellHeader: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
        color: "#333",
    },
    tableCell: {
        flex: 1,
        fontSize: 13,
        textAlign: "center",
        color: "#555",
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
