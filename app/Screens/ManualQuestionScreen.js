import React, { useEffect,useState } from "react";
import { View, Text, TextInput,Button, Modal, TouchableOpacity, StyleSheet,FlatList,Alert,Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';;
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "./apiConfig";

const ManualQuestionScreen = ({ route }) => {
  const { username, loggeduser } = route.params || { username: "Guest", loggeduser: "Unknown" };
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [standard, setStandard] = useState("");
  const [selectedStandardLabel, setStandardSelectedLabel] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [unitTestNo, setUnitTestNo] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [standardsData, setStandardsData] = useState([]);
  const [chapterName, setNumQuestions] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [unitTestsData, setUnitTestsData] = useState([]);
  const [selectedUnitLabel, setSelectedUnitLabel] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [chaptersData, setChaptersData] = useState([]);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [viewModalQuestions, setViewModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [finalSelectedQuestions, setFinalSelectedQuestions] = useState([]);
  const [testDate, setTestDate] = useState("");

  const handleSelectQuestion = (question) => {
    setSelectedQuestions((prevSelected) => {
      // Check if the question is already selected
      const isSelected = prevSelected.some((q) => q.id === question.id);
      
      if (isSelected) {
        return prevSelected.filter((q) => q.id !== question.id);
      } else {
        return [...prevSelected, question];
      }
    });
  };
  
  const questionTypes = [
    { label: "Multiple Choice Questions", value: "Multiple Choice Questions" },
    { label: "Match The Following", value: "Match The Following" },
    { label: "Fill in the Blanks", value: "Fill in the Blanks" },
    {
      label: "Answers The Following Questions in One Word (1 Marks)",
      value: "Answers The Following Questions in One Word (1 Marks)",
    },
    {
      label: "Answers The Following Questions (2 Marks)",
      value: "Answers The Following Questions (2 Marks)",
    },
    {
      label: "Answers The Following Questions (3 Marks)",
      value: "Answers The Following Questions (3 Marks)",
    },
    {
      label: "Answers The Following Questions (5 Marks)",
      value: "Answers The Following Questions (5 Marks)",
    },
    {
      label: "Answers The Following Questions (10 Marks)",
      value: "Answers The Following Questions (10 Marks)",
    },
  ];

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

      setChaptersData([{ value: 0, label: "Select Chapter Name" }, ...formattedChapters]);
      // setChaptersData(formattedChapters);
      console.log(formattedChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardResponse = await fetch(
          `${BASE_URL}/api/TimeTableApi/getallstandard?userId=${encodeURIComponent(username)}`
        );
        const standards = await standardResponse.json();
        setStandardsData([{ value: 0, text: "Select Standard" }, ...standards]);
        const courseResponse = await fetch(
          `${BASE_URL}/api/TimeTableApi/getallcourses?userId=${encodeURIComponent(username)}`
        );
        const courses = await courseResponse.json();
        setCoursesData([{ value: 0, text: "Select Course" }, ...courses]);
        // setCoursesData(courses);

        const unitTestResponse = await fetch(
          `${BASE_URL}/api/TimeTableApi/getallunittest?userId=${encodeURIComponent(username)}`
        );
        const unitTests = await unitTestResponse.json();
        setUnitTestsData([{ value: 0, text: "Select Unit Test" }, ...unitTests]);
        // setUnitTestsData(unitTests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGenerateQuestions = async () => {
    try {
      // Replace with your actual API URL
      // const response = await fetch(`${BASE_URL}/api/TimeTableApi/generatequenstion?courseId=${language}&standardId=${standard}&numQuestions=${numQuestions}&maxMarks=${maxMarks}&unitTestNo=${unitTestNo}}`, {
      //   method: 'GET',
      // });
      if (standard === "") {
        Alert.alert('Error', 'Please select the standard.');
        return;
      }
      if (language === "") {
        Alert.alert('Error', 'Please select the course.');
        return;
      }
      if (selectedChapters.length === 0 ) {
        Alert.alert('Error', 'Please select the chapter names.');
        return;
      }
      if (maxMarks === "") {
        Alert.alert('Error', 'Please enter max marks.');
        return;
      }
      if (totalHours === "") {
        Alert.alert('Error', 'Please enter total hours.');
        return;
      }
      const selectedChaptersString = selectedChapters.join(", ");
      const response = await axios.get(
        "${BASE_URL}/api/QuestionApi/getmanualquestions",
        {
          params: {
            courseId: language,
            standardId: standard,
            chapterName: selectedChaptersString,
            questionsType: questionType,
          },
          withCredentials: false,
        }
      );

      // console.log("Questions generated:", response.data);
      console.log("Values:", language,standard,selectedChaptersString,questionType);
      setGeneratedQuestions(response.data);
      setListModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseModal = () => {
    setFinalSelectedQuestions(selectedQuestions); // Save selected questions
    console.log(selectedQuestions);
    setListModalVisible(false); // Close the modal
  };

  const handleViewCloseModal = () => {
    setViewModalVisible(false); 
  };

  const handleViewSelectedQuestions = () => {
    setViewModalVisible(true); 
  };
  
  const GeneratePDF = async () => {
      try {
          const mmarks = maxMarks;  
          let totalMarks =0;
          let questionsByType = {};
          
          finalSelectedQuestions.forEach(function (item) {
                      const questionName = item.questionName; 
                      const questionType = item.questionType; 
                      const answers = item.answers; 
                      const questionOptions = item.questionOptions; 
                      const marksPerQuestion = {
                        'Fill in the Blanks': 1,
                        'Multiple Choice Questions': 1,
                        'Match The Following': 1,
                        'Answers The Following Questions in One Word (1 Marks)': 1,
                        'Answers The Following Questions (2 Marks)': 2,
                        'Answers The Following Questions (3 Marks)': 3,
                        'Answers The Following Questions (5 Marks)': 5,
                        'Answers The Following Questions (10 Marks)': 10,
                      };
    
                      const marks = marksPerQuestion[questionType] || 0; // Default to 0 if type not found
                      totalMarks += marks;
    
                      if (!questionsByType[questionType]) {
                        questionsByType[questionType] = [];
                      }
                      questionsByType[questionType].push({ questionName, answers, marks, questionOptions });
                    });
         const testName = selectedUnitLabel;
          const examData = {
              schoolName: "SCHOOL NAME",
              examName: testName,
              subject: selectedLabel,
              standard: selectedStandardLabel,
              time: totalHours,
              maxMarks: mmarks,
              questionsByType: questionsByType
          };
          const htmlContent = generateHTMLContent(examData);
          const { uri } = await Print.printToFileAsync({ html: htmlContent });
          return uri;
      } catch (error) {
          console.error("PDF Generation Error: ", error);
      }
  };
  const generateHTMLContent = (examData) => {
      const { schoolName, examName, subject, standard, time, maxMarks, questionsByType } = examData;
      function toRoman(num) {
          const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
          return romanNumerals[num - 1] || num; // Fallback to number if out of range
      }
      let questionsHTML = "";
      let sectionIndex = 0;
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      const sortedTypes = Object.entries(questionsByType)
      .sort(([, marksA], [, marksB]) => marksA - marksB) // Sort by marks
      .map(([type]) => type); 
      sortedTypes.forEach((type) => {  
          sectionIndex++;
          const questions = questionsByType[type];
          const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
          const numOfQuestions = questions.length;
          const marksPerQuestion = totalMarks / numOfQuestions;
       
          questionsHTML += `
              <div class="section-title">${toRoman(sectionIndex)}. ${type} <span class="marks">(${numOfQuestions} × ${marksPerQuestion} = ${totalMarks} Marks)</span></div>`;
      
          questions.forEach((q, index) => {
              questionsHTML += `
                  <div class="question">${index + 1}. ${q.questionName}</div>`;
              if (q.questionOptions) {
                  const answersArray = q.questionOptions.split("\n");
                  const half = Math.ceil(answersArray.length / 2);
      
                  const leftColumn = answersArray.slice(0, half).join("<br><br>");
                  const rightColumn = answersArray.slice(half).join("<br><br>");
      
                  questionsHTML += `
                      <div class="answer-container">
                          <div class="answer-column">${leftColumn}</div>
                          <div class="answer-column">${rightColumn}</div>
                      </div>
                  `;
              }
          });
      });
      return `
          <html>
              <head>
                  <style>
                      body { font-family: Arial, sans-serif; padding: 20px; }
                      h1, h2 { text-align: center; }
                      .header { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                      .info {
                          display: flex;
                          justify-content: space-between;
                          align-items: flex-start;
                          font-size: 16px;
                          font-weight: bold; 
                          margin-bottom:10px;
                      }
                      .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; }
                      .question { font-size: 15px; margin: 10px 0; margin-left: 20px; }
                      .marks { float: right; font-weight: bold; }
                      .answer { font-size: 14px; margin-left: 40px; margin-bottom:10px}
                      .left{
                          display: flex;
                          flex-direction: column;
                          text-align: left;
                      }
  
                      .right {
                          display: flex;
                          flex-direction: column;
                          text-align: right;
                      }
                          .answer-container {
                              display: flex;
                              gap: 20px; /* Space between columns */
                              margin-left: 45px;
                          }
  
                          .answer-column {
                              flex: 1;
                              text-align: left;
                          }
  
                  </style>
              </head>
              <body>
                  <h1>${schoolName}</h1> 
                  <h2 class="header">${examName}</h2>
                  <h3 class="header">${previousYear} - ${currentYear}</h3>
                  <div class="info">
                      <span class="left">Subject: ${subject}
                      </span>
                      <span class="right"> TIME: ${time} HOURS 
                      </span>   
                  </div>
                  <div class="info">
                      <span class="left">
                      STD: ${standard}</span>
                      <span class="right">  MAXIMUM MARKS: ${maxMarks}
                      </span>
                  </div>
                  ${questionsHTML}
              </body>
          </html>`;
  };
  const sendEmailWithPDF = async () => {
    try {
      // Calculate the total marks of selected questions
      let totalMarks = 0;
      finalSelectedQuestions.forEach((item) => {
        const marksPerQuestion = {
          'Fill in the Blanks': 1,
          'Multiple Choice Questions': 1,
          'Match The Following': 1,
          'Answers The Following Questions in One Word (1 Marks)': 1,
          'Answers The Following Questions (2 Marks)': 2,
          'Answers The Following Questions (3 Marks)': 3,
          'Answers The Following Questions (5 Marks)': 5,
          'Answers The Following Questions (10 Marks)': 10,
        };
  
        const marks = marksPerQuestion[item.questionType] || 0; // Default to 0 if type not found
        totalMarks += marks;
      });
  
      // Check if totalMarks matches maxMarks
      if (totalMarks !== maxMarks) {
        Alert.alert(
          "Error",
          `Selected questions total ${totalMarks} marks, but required max is ${maxMarks}. Adjust the selection.`
        );
        return;
      }
  
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Sharing is not available on this device");
        return;
      }
  
      const pdfUri = await GeneratePDF();
      const newPath = `${FileSystem.documentDirectory}${selectedLabel}_Exam_Questions.pdf`;
      await FileSystem.moveAsync({ from: pdfUri, to: newPath });
      await shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert("Error sharing the PDF");
    }
  };
  
  const GeneratePDFAns = async () => {
      try {
          const mmarks = maxMarks;  
          let totalMarks =0;
          let questionsByType = {};
          
          finalSelectedQuestions.forEach(function (item) {
                      const questionName = item.questionName; 
                      const questionType = item.questionType; 
                      const answers = item.answers; 
                      const questionOptions = item.questionOptions; 
                      const marksPerQuestion = {
                        'Fill in the Blanks': 1,
                        'Multiple Choice Questions': 1,
                        'Match The Following': 1,
                        'Answers The Following Questions in One Word (1 Marks)': 1,
                        'Answers The Following Questions (2 Marks)': 2,
                        'Answers The Following Questions (3 Marks)': 3,
                        'Answers The Following Questions (5 Marks)': 5,
                        'Answers The Following Questions (10 Marks)': 10,
                      };
    
                      const marks = marksPerQuestion[questionType] || 0; // Default to 0 if type not found
                      totalMarks += marks;
    
                      if (!questionsByType[questionType]) {
                        questionsByType[questionType] = [];
                      }
                      questionsByType[questionType].push({ questionName, answers, marks, questionOptions });
                    });
                    const testName = selectedUnitLabel;
          const examData = {
              schoolName: "SCHOOL NAME",
              examName: testName,
              subject: selectedLabel,
              standard: selectedStandardLabel,
              time: totalHours,
              maxMarks: mmarks,
              questionsByType: questionsByType
          };
          const htmlContent = generateHTMLContentAns(examData);
          const { uri } = await Print.printToFileAsync({ html: htmlContent });
          return uri;
      } catch (error) {
          console.error("PDF Generation Error: ", error);
      }
  };
  const generateHTMLContentAns = (examData) => {
      const { schoolName, examName, subject, standard, time, maxMarks, questionsByType } = examData;
      function toRoman(num) {
          const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
          return romanNumerals[num - 1] || num; // Fallback to number if out of range
      }
      let questionsHTML = "";
      let sectionIndex = 0;
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      const sortedTypes = Object.entries(questionsByType)
      .sort(([, marksA], [, marksB]) => marksA - marksB) // Sort by marks
      .map(([type]) => type); 
      sortedTypes.forEach((type) => {  
          sectionIndex++;
          const questions = questionsByType[type];
          const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
          const numOfQuestions = questions.length;
          const marksPerQuestion = totalMarks / numOfQuestions;
       
          questionsHTML += `
              <div class="section-title">${toRoman(sectionIndex)}. ${type} <span class="marks">(${numOfQuestions} × ${marksPerQuestion} = ${totalMarks} Marks)</span></div>`;
      
          questions.forEach((q, index) => {
              questionsHTML += `
                  <div class="question">${index + 1}. ${q.questionName}</div>`;
                  if (q.questionOptions) {
                      const questionOptions = q.questionOptions.split("\n");
                      const half = Math.ceil(questionOptions.length / 2);
          
                      const leftColumn = questionOptions.slice(0, half).join("<br><br>");
                      const rightColumn = questionOptions.slice(half).join("<br><br>");
          
                      questionsHTML += `
                          <div class="answer-container">
                              <div class="answer-column">${leftColumn}</div>
                              <div class="answer-column">${rightColumn}</div>
                          </div>
                      `;
                  }
                  if (q.answers) {
                      const answersArray = q.answers;
                      // const half = Math.ceil(answersArray.length / 2);
          
                      // const leftColumn = answersArray.slice(0, half).join("<br><br>");
                      // const rightColumn = answersArray.slice(half).join("<br><br>");
          
                      questionsHTML += `
                          <div class="answer-container" style="margin:20px">
                              <div class="answer-column">Answers : </div>
                              <div class="answer-column">${answersArray}</div>
                          </div>
                      `;
                  }
          });
      });
      return `
          <html>
              <head>
                  <style>
                      body { font-family: Arial, sans-serif; padding: 20px; }
                      h1, h2 { text-align: center; }
                      .header { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                      .info {
                          display: flex;
                          justify-content: space-between;
                          align-items: flex-start;
                          font-size: 16px;
                          font-weight: bold; 
                          margin-bottom:10px;
                      }
                      .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; }
                      .question { font-size: 15px; margin: 10px 0; margin-left: 20px; }
                      .marks { float: right; font-weight: bold; }
                      .answer { font-size: 14px; margin-left: 40px; margin-bottom:10px}
                      .left{
                          display: flex;
                          flex-direction: column;
                          text-align: left;
                      }
  
                      .right {
                          display: flex;
                          flex-direction: column;
                          text-align: right;
                      }
                          .answer-container {
                              display: flex;
                              gap: 20px; /* Space between columns */
                              margin-left: 45px;
                          }
  
                          .answer-column {
                              text-align: left;
                          }
  
                  </style>
              </head>
              <body>
                  <h1>${schoolName}</h1> 
                  <h2 class="header">${examName}</h2>
                  <h3 class="header">${previousYear} - ${currentYear}</h3>
                  <div class="info">
                      <span class="left">Subject: ${subject}
                      </span>
                      <span class="right"> TIME: ${time} HOURS 
                      </span>   
                  </div>
                  <div class="info">
                      <span class="left">
                      STD: ${standard}</span>
                      <span class="right">  MAXIMUM MARKS: ${maxMarks}
                      </span>
                  </div>
                  ${questionsHTML}
              </body>
          </html>`;
  };
  const sendEmailWithPDFAns = async () => {
          try {
            let totalMarks = 0;
            finalSelectedQuestions.forEach((item) => {
              const marksPerQuestion = {
                'Fill in the Blanks': 1,
                'Multiple Choice Questions': 1,
                'Match The Following': 1,
                'Answers The Following Questions in One Word (1 Marks)': 1,
                'Answers The Following Questions (2 Marks)': 2,
                'Answers The Following Questions (3 Marks)': 3,
                'Answers The Following Questions (5 Marks)': 5,
                'Answers The Following Questions (10 Marks)': 10,
              };
        
              const marks = marksPerQuestion[item.questionType] || 0; // Default to 0 if type not found
              totalMarks += marks;
            });
        
            // Check if totalMarks matches maxMarks
            if (totalMarks !== maxMarks) {
              Alert.alert(
                "Error",
                `Selected questions total ${totalMarks} marks, but required max is ${maxMarks}. Adjust the selection.`
              );
              return;
            }
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
              Alert.alert('Sharing is not available on this device');
              return;
            }
             const pdfUri = await GeneratePDFAns();
          //    console.log(pdfUri);
              const newPath = `${FileSystem.documentDirectory}${selectedLabel}_Exam_Questions.pdf`;
              await FileSystem.moveAsync({ from: pdfUri, to: newPath });
              await shareAsync(newPath);
          } catch (error) {
            console.error(error);
            Alert.alert('Error sharing the PDF');
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
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Generate Questions</Text>
      </TouchableOpacity> */}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <Text style={styles.title}>Generate Questions</Text> */}

          <Text style={styles.label}>Standard Name</Text>
          <Picker
            selectedValue={standard}
            onValueChange={(itemValue) => {
              setStandard(itemValue);
              const selectedItem = standardsData.find(
                (item) => item.value === itemValue
              );
              setStandardSelectedLabel(selectedItem ? selectedItem.text : "");
            }}
            style={styles.picker}
          >
            {standardsData.map((item, index) => (
              <Picker.Item key={index} label={item.text} value={item.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Subject Name</Text>
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
            setItems={setNumQuestions}
          />
          {/* <Picker
            selectedValue={chapterName}
            onValueChange={(itemValue) => setNumQuestions(itemValue)}
            style={styles.picker}
          >
            {chaptersData.length > 0 ? (
              chaptersData.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))
            ) : (
              <Picker.Item label="No Chapters Available" value="" />
            )}
          </Picker> */}

          <Text style={styles.label}>Question Type</Text>
          <Picker
            selectedValue={questionType}
            onValueChange={(itemValue) => setQuestionType(itemValue)}
            style={styles.picker}
          >
            {questionTypes.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>

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
          <TextInput
            style={styles.input}
            placeholder="Max Marks"
            keyboardType="numeric"
            value={maxMarks}
            editable={false}
            onChangeText={setMaxMarks}
          />
          <TextInput
            style={styles.input}
            placeholder="Test Date"
            keyboardType="default"
            value={testDate}  
            editable={false}
            onChangeText={setTestDate} 
          />
          <TextInput
            style={styles.input}
            placeholder="Total Hours"
            keyboardType="numeric"
            value={totalHours}
            onChangeText={setTotalHours}
          />

          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              handleGenerateQuestions();
            }}
          >
            <Text style={styles.buttonText}>Generate Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              handleViewSelectedQuestions();
            }}
          >
            <Text style={styles.buttonText}>View Selected Questions</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      <Modal visible={listModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>List of Selected Questions</Text>

            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            {generatedQuestions.length > 0 ? (
              <FlatList
                data={generatedQuestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedQuestions.some(
                    (q) => q.id === item.id
                  );

                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectQuestion(item)}
                    >
                      <View
                        style={[
                          styles.questionCard,
                          isSelected && { backgroundColor: "#D3E3FC" },
                        ]}
                      >
                        <Text style={styles.questionText}>
                          Q: {item.questionName}
                        </Text>
                        <Text>Type: {item.questionType}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <Text>No questions selected</Text>
            )}
          </View>
        </View>
      </Modal>
      
      <Modal visible={viewModalQuestions} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.closeButton}></Text>
            <Text style={styles.title}>List of Selected Questions</Text>
            
            <Button title="Share" style={{paddingBottom:80}} onPress={sendEmailWithPDF} />
            <Button title="Share With Answers" style={{paddingBottom:80}} onPress={sendEmailWithPDFAns} />
            <TouchableOpacity
              onPress={handleViewCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <FlatList
            data={finalSelectedQuestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.questionCard}>
                <Text style={styles.questionText}>Questions Name: {item.questionName}</Text>
                <Text style={styles.questionText}>Question Type: {item.questionType}</Text>
                <Text style={styles.questionText}>Options: {item.questionOptions}</Text>
                <Text style={styles.questionText}>Answers: {item.answers}</Text>
                </View>
            )}
            />

          </View>
        </View>
      </Modal>
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
    width: "100%",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
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

  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ManualQuestionScreen;
