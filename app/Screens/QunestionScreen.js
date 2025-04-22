import React, { useEffect,useState } from "react";
import { View, Text, TextInput,Button, Modal, TouchableOpacity, StyleSheet,ScrollView,FlatList,Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';;
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "./apiConfig";

const QunestionScreen = ({route}) => {
  console.log("Question Received params:", route.params);
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
    const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [standard, setStandard] = useState("");
  const [selectedStandardLabel, setStandardSelectedLabel] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [unitTestNo, setUnitTestNo] = useState("");
  const [chapterName, setNumQuestions] = useState("");
  const [chaptersData, setChaptersData] = useState([]);
  const [maxMarks, setMaxMarks] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [standardsData, setStandardsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [unitTestsData, setUnitTestsData] = useState([]);
  const [testDate, setTestDate] = useState("");
  const [selectedUnitLabel, setSelectedUnitLabel] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [isChapterModalVisible, setChapterModalVisible] = useState(false);
  
  
  useEffect(() => {
    const API_BASE_URL = `${BASE_URL}`; // Ensure correct IP
  
    const fetchData = async () => {
      try {
        
        const standardResponse = await axios.get(`${API_BASE_URL}/api/TimeTableApi/getallstandard?userId=${username}`);
        console.log(`${API_BASE_URL}/api/TimeTableApi/getallstandard?userId=${username}`)
        const standards = await standardResponse.data;
        setStandardsData(standards.length > 0 ? [{ value: 0, text: "Select Standard" }, ...standards] : []);
  
        const courseResponse = await fetch(`${API_BASE_URL}/api/TimeTableApi/getallcourses?userId=${encodeURIComponent(username)}`);
        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        const courses = await courseResponse.json();
        setCoursesData(courses.length > 0 ? [{ value: 0, text: "Select Course" }, ...courses] : []);
  
        const unitTestResponse = await fetch(`${API_BASE_URL}/api/TimeTableApi/getallunittest?userId=${encodeURIComponent(username)}`);
        if (!unitTestResponse.ok) throw new Error("Failed to fetch unit tests");
        const unitTests = await unitTestResponse.json();
        setUnitTestsData(unitTests.length > 0 ? [{ value: 0, text: "Select Unit Test" }, ...unitTests] : []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleGenerateQuestions = async () => {
    
      try {
        if (selectedChapters.length === 0 ) {
          Alert.alert('Error', 'Please select the chapter names.');
          return;
        }
              if (maxMarks === '' ) {
                Alert.alert('Error', 'Please enter max marks.');
                return;
              }
              if (totalHours === '' ) {
                Alert.alert('Error', 'Please enter total hours.');
                return;
              }
              console.log(selectedChapters);
              const selectedChaptersString = selectedChapters.join(", ");
        const response = await axios.get(`${BASE_URL}/api/QuestionApi/generatequenstion`, {
            params: { 
              courseId: language,
              standardId: standard,
              chapterName: selectedChaptersString,
              maxMarks: maxMarks,
              unitTestNo: unitTestNo
            },
            withCredentials: false,
          });
  
        console.log('Questions generated:', response.data);
        setGeneratedQuestions(response.data);
        navigation.navigate("GeneratedQuestions", { generatedQuestions:response.data,selectedLabel:selectedLabel,selectedStandardLabel:selectedStandardLabel,totalHours:totalHours,maxMarks:maxMarks,testName: selectedUnitLabel})
        // setModalVisible(false);
      } catch (error) {
        console.error('Error:', error);
      }
  };

  const sendEmailWithPDF = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing is not available on this device');
        return;
      }
       const pdfUri = await GeneratePDF();
    //    console.log(pdfUri);
        const newPath = `${FileSystem.documentDirectory}${selectedLabel}_Exam_Questions.pdf`;
        await FileSystem.moveAsync({ from: pdfUri, to: newPath });
        await shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error sharing the PDF');
    }
  };
  const handleCourseChange = async (itemValue) => {
    setLanguage(itemValue);
    const selectedItem = coursesData.find((item) => item.value === itemValue);
    setSelectedLabel(selectedItem ? selectedItem.text : "");

    // Fetch chapters based on selected course
    try {
      const response = await fetch(
        `${BASE_URL}/api/QuestionApi/getchapterName?standardId=${standard}&courseId=${itemValue}`
      );
      const chapters = await response.json();
      const formattedChapters = chapters.map((chapter, index) => ({
        label: chapter.text, // Using chapter string as label
        value: chapter.value, // Using chapter string as value
      }));

      setChaptersData(formattedChapters);
      console.log(formattedChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };
  const handleUnitTestChange = async (itemValue) => {
    setUnitTestNo(itemValue);
    const selectedItem = unitTestsData.find((item) => item.value === itemValue);
    setSelectedUnitLabel(selectedItem ? selectedItem.text : "");

    if (itemValue === 0) {
      setMaxMarks("");
      setTestDate("");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/QuestionApi/getunitbyid?unitTestId=${itemValue}`);
      const data = response.data;
      console.log(data);  
      setMaxMarks(data.maxMarks ? data.maxMarks.toString() : ""); 
      setTestDate(data.testDate ? data.testDate.split("T")[0] : "")
    } catch (error) {
      console.error("Error fetching unit test details:", error);
    }
  };




  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Standard</Text>
            <Picker
              selectedValue={standard}
              onValueChange={(itemValue) => {
                setStandard(itemValue);
                const selectedItem = standardsData.find((item) => item.value === itemValue);
                setStandardSelectedLabel(selectedItem ? selectedItem.text : '');
              }}
              style={styles.picker}
            >
              {standardsData.map((item, index) => (
                <Picker.Item key={index} label={item.text} value={item.value} />
              ))}
            </Picker>
  
            <Text style={styles.label}>Subject</Text>
            <Picker
              selectedValue={language}
              onValueChange={handleCourseChange}
              style={styles.picker}
            >
              {coursesData.map((item, index) => (
                <Picker.Item key={index} label={item.text} value={item.value} />
              ))}
            </Picker>
  
            <Text style={styles.label}>Chapter Name</Text>
            <DropDownPicker
              multiple={true}
              open={open}
              value={selectedChapters}
              items={chaptersData}
              setOpen={setOpen}
              setValue={setSelectedChapters}
              setItems={setChaptersData}
              containerStyle={{ marginBottom: open ? 200 : 15 }}
            />
  
            <Text style={styles.label}>Test Name</Text>
            <Picker
              selectedValue={unitTestNo}
              onValueChange={handleUnitTestChange}
              style={styles.picker}
            >
              {unitTestsData.map((item, index) => (
                <Picker.Item key={index} label={item.text} value={item.value} />
              ))}
            </Picker>
  
            <Text style={styles.label}>Max Marks</Text>
            <TextInput
              style={styles.input}
              placeholder="Max Marks"
              keyboardType="numeric"
              value={maxMarks}
              editable={false}
            />
  
            <Text style={styles.label}>Test Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Test Date"
              keyboardType="default"
              value={testDate}
              editable={false}
            />
  
            <Text style={styles.label}>Total Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="Total Hours"
              keyboardType="numeric"
              value={totalHours}
              onChangeText={setTotalHours}
            />
  
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateQuestions}
            >
              <Text style={styles.buttonText}>Generate Questions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:10,
    marginBottom:10,
    padding:15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 50,
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
    width:"100%"
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default QunestionScreen;
