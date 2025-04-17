import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import BASE_URL from "./apiConfig";

const UnitTestScreen = ({ route }) => {
    const { username } = route.params || { username: "Guest" };
    const [unitTestRecords, setUnitTestRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUnitTestRecords();
    }, []);

    const fetchUnitTestRecords = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/TimeTableApi/getallunittestdetails`
            );
            const data = await response.json();
            console.log("Unit Test Records: ", data);

            if (Array.isArray(data)) {
                setUnitTestRecords(data);
            } else {
                setUnitTestRecords([]);
            }
        } catch (error) {
            console.error("Error fetching unit test records:", error);
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

    const renderHeader = () => (
        <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Test Name</Text>
            <Text style={[styles.cell, styles.headerText]}>Test Date</Text>
            <Text style={[styles.cell, styles.headerText]}>Standard Name</Text>
            <Text style={[styles.cell, styles.headerText]}>Max Marks</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.testNum}</Text>
            <Text style={styles.cell}>{formatDate(item.testDate)}</Text>
            <Text style={styles.cell}>{item.standardName}</Text>
            <Text style={styles.cell}>{item.maxMarks}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.table}>
                {renderHeader()}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : unitTestRecords.length === 0 ? (
                    <Text style={styles.noData}>No unit test records found</Text>
                ) : (
                    <FlatList
                        data={unitTestRecords}
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

export default UnitTestScreen;
