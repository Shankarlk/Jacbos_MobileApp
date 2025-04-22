import React, { useEffect, useState } from "react"; 
import { View, Text, FlatList, TextInput, StyleSheet,ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import RNPickerSelect from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import BASE_URL from "./apiConfig";

const UpdateStudentScoresScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { unitTestId, unitTestName,username } = route.params; 
  const [dispalyStudents, setDisplayStudents] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = dispalyStudents.filter(student =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchStudents(), fetchCourses()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/UpdateStudentMarksApi/getstudents?Id=${unitTestId}`);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();
      const updatedData = data.map(student => ({
        ...student,
        unitTestName,
        selectedCourse: null, // Store selected course for each student
        marks: student.marks ?? "",
      }));
      setDisplayStudents(updatedData);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/TimeTableApi/getallcourses?userId=${encodeURIComponent(username)}`);
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      console.log(data);
      const formattedCourses = data.map(course => ({
        label: course.text,
        value: course.value,
      }));
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const updateStudentData = (studentId, field, value) => {
    setDisplayStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      const missingCourses = dispalyStudents.some(student => !student.selectedCourse);
  
      if (missingCourses) {
        alert("Please select a course for all students before saving.");
        return; // Stop execution if validation fails
      }
      const payload = dispalyStudents.map(student => ({
        studentId: student.id,
        unitTestId,
        courseId: student.selectedCourse, // Save selected course
        courseMarks: student.marks || 0,
      }));

      console.log("Sending Data:", payload);

      const response = await fetch(`${BASE_URL}/api/UpdateStudentMarksApi/savestudentScores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save student scores");

      const result = await response.json();
      alert("Scores updated successfully!");
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: result.message || "Scores updated successfully!",
      // });
    } catch (error) {
      console.error("Error saving student scores:", error);
      alert("Failed to save scores. Please try again.");
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, { zIndex: dispalyStudents.length - index }]}>
      <Text style={styles.cell}>{item.studentName}</Text>
      <Text style={styles.cell}>{item.unitTestName}</Text>
  
      <View style={styles.dropdown}>
        <DropDownPicker
          open={openDropdown === item.id}
          value={item.selectedCourse}
          items={courses}
          setOpen={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
          setValue={(callback) => {
            const newValue = callback(item.selectedCourse);
            updateStudentData(item.id, "selectedCourse", newValue);
          }}
          onChangeValue={(value) => console.log("Selected Course:", value)}
          placeholder="Select Course"
          style={styles.dropdownPicker}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={dispalyStudents.length - index}
          zIndexInverse={index}
        />
      </View>
  
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.marks?.toString()}
        onChangeText={(text) => updateStudentData(item.id, "marks", text)}
      />
    </View>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading student data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <TextInput
              placeholder="Search by student name..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
  
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Student Name</Text>
              <Text style={styles.headerCell}>Unit Test</Text>
              <Text style={styles.headerCell}>Subject</Text>
              <Text style={styles.headerCell}>Marks</Text>
            </View>
          </>
        }
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
              Back
            </Button>
            <Button mode="contained" onPress={handleSaveChanges} style={styles.button}>
              Save Changes
            </Button>
          </View>
        }
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  
  container: { flex: 1, padding: 10,marginTop:20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: "#ddd", paddingVertical: 10, paddingHorizontal: 5 },
  headerCell: { flex: 1, fontWeight: "bold", textAlign: "center" },
  row: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: "#eee", alignItems: "center" },
  cell: { flex: 1, textAlign: "center" },
  dropdown: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { flex: 1, marginHorizontal: 5 },
  dropdown: {
    flex: 1,
    zIndex: 100, // Ensures dropdown appears above other elements
    marginRight: 10, // Adds space between dropdown and marks box
  },
  dropdownPicker: {
    height: 40, // Same as Marks box
    width: 90, // Keep dropdown wider for better visibility
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    width: 80, // Match dropdown width
  },
  input: {
    height: 40, // Same height as dropdown
    width: 80, // Reduced width for marks box
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: "center",
    backgroundColor: "#fff",
  },searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },  
});


export default UpdateStudentScoresScreen;
