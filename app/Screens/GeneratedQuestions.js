import React, { useState, useEffect } from "react";
import { View, Text, FlatList,Button, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const GeneratedQuestions = ({ route }) => {
    const navigation = useNavigation();
    const [questions, setQuestions] = useState([]);
    const { generatedQuestions,selectedLabel,selectedStandardLabel,totalHours,maxMarks,testName } = route.params; 
    
    useEffect(() => {
        if (route.params?.generatedQuestions) {
        //   console.log("Generated Questions:", route.params.generatedQuestions);
          setQuestions(Array.isArray(route.params.generatedQuestions) ? route.params.generatedQuestions : []);
        }
      }, [route.params?.generatedQuestions]);
      
const GeneratePDF = async () => {
    try {
        const mmarks = maxMarks;  
        let totalMarks =0;
        let questionsByType = {};
        
        questions.forEach(function (item) {
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
const GeneratePDFAns = async () => {
    try {
        const mmarks = maxMarks;  
        let totalMarks =0;
        let questionsByType = {};
        
        questions.forEach(function (item) {
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
        });
    });
    //     Object.keys(questionsByType).forEach((type) => {
    //         sectionIndex++;
    //         const questions = questionsByType[type];
    //         const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    //         const numOfQuestions = questions.length;
    //         const marksPerQuestion = totalMarks / numOfQuestions;

    //         questionsHTML += `
    //             <div class="section-title">${toRoman(sectionIndex)}. ${type} <span class="marks">(${numOfQuestions} × ${marksPerQuestion} = ${totalMarks} Marks)</span></div>`;

    //         questions.forEach((q, index) => {
    //             questionsHTML += `
    //                 <div class="question">${index + 1}. ${q.questionName}</div>`;
    //             if (q.answers) {
    //                 // questionsHTML += `<div class="answer">${q.answers.replace(/\n/g, "<br> <br>")}</div>`;
    //                 const answersArray = q.answers.split("\n"); // Split answers by newline
    //                 const half = Math.ceil(answersArray.length / 2); // Get midpoint to divide into two columns

    //                 const leftColumn = answersArray.slice(0, half).join("<br><br>"); // First half
    //                 const rightColumn = answersArray.slice(half).join("<br><br>"); // Second half

    //                 questionsHTML += `
    //                     <div class="answer-container">
    //                         <div class="answer-column">${leftColumn}</div>
    //                         <div class="answer-column">${rightColumn}</div>
    //                     </div>
    //                 `;

    //             }
    //         });
    // });

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
      

  
    const renderItem = ({ item }) => (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>Question: {item.questionName}</Text>
        <Text style={styles.questionText}>Question Type: {item.questionType}</Text>
        <Text style={styles.questionText}>Standard Name: {item.standardName}</Text>
        <Text style={styles.questionText}>Course Name: {item.courseName}</Text>
        <Text style={styles.questionText}>Answers: {item.answers}</Text>
        <Text style={styles.questionText}>Options: {item.questionOptions}</Text>
      </View>
    );
  
    return (
      <View style={{ flex: 1, padding: 10 }}>
        {/* <Text style={styles.headerText}>Generated Questions</Text> */}
        {questions.length > 0 ? (
          <View >
          <Button title="Share" style={{paddingBottom:80}} onPress={sendEmailWithPDF} />
          <Button title="Share With Answers" style={{paddingBottom:80}} onPress={sendEmailWithPDFAns} />
          
             <FlatList
    data={questions}
    renderItem={renderItem}
    keyExtractor={(item, index) => index.toString()}
    contentContainerStyle={{ paddingBottom: 10 }} // Ensures space at bottom
  />
          </View>
        ) : (
          <Text>No Questions Available</Text>
        )}
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
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

export default GeneratedQuestions;
