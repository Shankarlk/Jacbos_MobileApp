import React, { useEffect, useState } from "react";
import { 
    View, Text, FlatList, ActivityIndicator, StyleSheet, 
    TextInput, TouchableOpacity ,ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BASE_URL from "./apiConfig";
import NoInternetBanner from "./NoInternetBanner"; 

export default function OverallStudentAttendance({ route }) {
    const { username } = route.params || { username: "Guest" };
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
                `${BASE_URL}/api/TimeTableApi/getoverallattendance?userId=${username}`
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
      <NoInternetBanner />
            <FlatList
  ListHeaderComponent={
    <>
      <TextInput
        style={styles.input}
        placeholder="Search by Student Name"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.dateFilterContainer}>
        {/* From Date */}
        <View>
          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.dateInput}>
            <Text>{formatDate(fromDate)}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowFromDatePicker(false);
                if (selectedDate) {
                  if (toDate && selectedDate > toDate) {
                    alert("From Date cannot be greater than To Date");
                  } else {
                    setFromDate(selectedDate);
                  }
                }
              }}
            />
          )}
        </View>

        {/* To Date */}
        <View>
          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.dateInput}>
            <Text>{formatDate(toDate)}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowToDatePicker(false);
                if (selectedDate) {
                  if (fromDate && selectedDate < fromDate) {
                    alert("To Date cannot be earlier than From Date");
                  } else {
                    setToDate(selectedDate);
                  }
                }
              }}
            />
          )}
        </View>

        {/* Clear Button */}
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={() => {
            setFromDate(null);
            setToDate(null);
            setSearchText("");
            setFilteredData(attendanceData);
          }}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Header Row */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.headerCell}>Student Name</Text>
        <Text style={styles.headerCell}>Standard</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>
    </>
  }

  data={filteredData}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.studentName}</Text>
      <Text style={styles.cell}>{item.standardName}</Text>
      <Text style={styles.cell}>{formatDate(item.attendanceDate)}</Text>
      <Text style={styles.cell}>{item.isPresent ? "Present" : "Absent"}</Text>
    </View>
  )}
  ListEmptyComponent={
    loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      <Text style={styles.noData}>No attendance records found</Text>
    )
  }
  contentContainerStyle={styles.scrollViewContent}
/>

        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollViewContent: {
        padding: 10,
        paddingBottom: 10, // Ensure there's padding at the bottom for the button to be visible
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
        width: 120,
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
        paddingHorizontal: 10,
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
