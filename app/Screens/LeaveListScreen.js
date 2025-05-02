import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Text,ScrollView, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BASE_URL from "./apiConfig";
import NoInternetBanner from "./NoInternetBanner"; 

const LeaveListScreen = ({ navigation,route }) => {
    const { username, loggeduser,isClassteacher } = route.params || { username: "Guest", loggeduser: "Unknown" };
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and filter states
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
          fetchStudentLeaveRequests();  // Replace with your actual fetch method
        }, [])
      );

    useEffect(() => {
        filterData();
    }, [searchText, fromDate, toDate]);

    const fetchStudentLeaveRequests = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/TimeTableApi/getallteacherrequest?userId=${username}`
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
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/TimeTableApi/deleteteacherrequest?Id=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('delete',response);
            if (response.ok) {
                fetchStudentLeaveRequests();
                alert("Deleted successfully");
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred from server");
        }
    };
    
    const filterData = () => {
        let filtered = leaveRequests;

        if (searchText) {
            filtered = filtered.filter((item) =>
                item.leaveReason.toLowerCase().includes(searchText.toLowerCase())
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
    const getApprovalLabel = (approval) => {
        switch (approval) {
            case 1:
                return { text: "Approved", style: styles.approved };
            case 2:
                return { text: "Rejected", style: styles.rejected };
            default:
                return { text: "Pending", style: styles.waiting };
        }
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
            <Text style={[styles.cell, styles.headerText]}>Teacher Name</Text>
            <Text style={[styles.cell, styles.headerText]}>Reason</Text>
            <Text style={[styles.cell, styles.headerText]}>From</Text>
            <Text style={[styles.cell, styles.headerText]}>To</Text>
            <Text style={[styles.cell, styles.headerText]}>Approval</Text>
            <Text style={[styles.cell, styles.headerText]}>Delete</Text>
        </View>
    );

    const renderItem = ({ item }) => {
        const approval = getApprovalLabel(item.approval);
    
        return (
            <TouchableOpacity onPress={() => navigation.navigate("EditLeaveRequestScreen", { 
                username, 
                loggeduser, 
                isClassteacher, 
                leaveItem: item 
              })}>
                <View style={styles.row}>
                    <Text style={styles.teacher}>{item.teacherName}</Text>
                    <Text style={styles.cell}>{item.leaveReason}</Text>
                    <Text style={styles.cell}>{formatDate(item.fromDate)}</Text>
                    <Text style={styles.cell}>{formatDate(item.toDate)}</Text>
    
                    <View style={[styles.statusButton, approval.style]}>
                        <Text style={styles.statusText}>{approval.text}</Text>
                    </View>
    
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };
    

    return (
        <FlatList
    data={filteredRequests}
    keyExtractor={(item, index) => index.toString()}
    renderItem={renderItem}
    ListHeaderComponent={
        <>
            {/* Search, filters, buttons, and header */}
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() =>
                            navigation.navigate("LeaveManagementScreen", {
                                username,
                                loggeduser,
                                isClassteacher,
                            })
                        }
                    >
                        <Text style={styles.createButtonText}>+ Create Leave Request</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Reason"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <View style={styles.dateFilterContainer}>
                    {/* From Date */}
                    <View>
                        <Text style={styles.label}>From Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowFromDatePicker(true)}
                            style={styles.dateInput}
                        >
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
                        <TouchableOpacity
                            onPress={() => setShowToDatePicker(true)}
                            style={styles.dateInput}
                        >
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

                {/* Table Header */}
                {renderHeader()}
            </View>
        </>
    }
    ListEmptyComponent={
        loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
            <Text style={styles.noData}>No leave requests found</Text>
        )
    }
    contentContainerStyle={{ padding: 10,backgroundColor: "#f5f5f5" }}
/>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollViewContent: {
        padding: 10,
        paddingBottom: 10, 
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
    createButton: {
        backgroundColor: "black",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
        elevation: 2,
    },
    createButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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
        marginTop:15,
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
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 10,
    },
    headerRow: {
        backgroundColor: "#ddd",
    },
    teacher: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
        paddingHorizontal: 4,
        color:"#0d6efd"
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
        paddingHorizontal: 4,
    },
    headerText: {
        fontSize: 15,
        fontWeight: "bold",
    },
    actionButton: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 6,
        borderRadius: 4,
        alignItems: "center",
    },
    actionText: {
        fontSize: 13,
        color: "#007bff",
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
    statusButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: "center",
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
    },
    approved: {
        borderColor: "green",
        backgroundColor: "#e6f4ea",
    },
    rejected: {
        borderColor: "red",
        backgroundColor: "#fdeaea",
    },
    waiting: {
        borderColor: "gray",
        backgroundColor: "#f2f2f2",
    },
    
});

export default LeaveListScreen;
