import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BASE_URL from "./apiConfig";

const StudentLeaveManagementTeacher = ({ route }) => {
    const { username } = route.params || { username: "Guest" };
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and filter states
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    useEffect(() => {
        fetchStudentLeaveRequests();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchText, fromDate, toDate]);

    const fetchStudentLeaveRequests = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/TimeTableApi/getallstudentrequest?userId=${username}`
            );
            const data = await response.json();
            console.log("Leave Requests: ", data);

            if (Array.isArray(data)) {
                setLeaveRequests(data);
                setFilteredRequests(data);
            } else {
                setLeaveRequests([]);
                setFilteredRequests([]);
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = leaveRequests;

        if (searchText) {
            filtered = filtered.filter((item) =>
                item.studentName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (fromDate) {
            filtered = filtered.filter((item) => new Date(item.fromDate) >= new Date(fromDate));
        }

        if (toDate) {
            filtered = filtered.filter((item) => new Date(item.toDate) <= new Date(toDate));
        }

        setFilteredRequests(filtered);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Select Date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const renderHeader = () => (
        <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Student Name</Text>
            <Text style={[styles.cell, styles.headerText]}>Reason</Text>
            <Text style={[styles.cell, styles.headerText]}>From</Text>
            <Text style={[styles.cell, styles.headerText]}>To</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.studentName}</Text>
            <Text style={styles.cell}>{item.leaveReason}</Text>
            <Text style={styles.cell}>{formatDate(item.fromDate)}</Text>
            <Text style={styles.cell}>{formatDate(item.toDate)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by Student Name"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            {/* Date Filters */}
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

                {/* Reset Filters Button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                        setSearchText("");
                        setFromDate(null);
                        setToDate(null);
                        setFilteredRequests(leaveRequests);
                    }}
                >
                    <Text style={styles.cancelButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* Leave Requests Table */}
            <View style={styles.table}>
                {renderHeader()}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : filteredRequests.length === 0 ? (
                    <Text style={styles.noData}>No leave requests found</Text>
                ) : (
                    <FlatList
                        data={filteredRequests}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "white",
    },
    dateFilterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dateInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "white",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
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
        paddingHorizontal: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    loader: {
        marginVertical: 20,
    },
    noData: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "gray",
    },
});

export default StudentLeaveManagementTeacher;
