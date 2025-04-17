import React, { useEffect, useState } from 'react';
import { View, Text,Button, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Linking } from 'react-native';
import { Video } from 'expo-av';
import BASE_URL from "./apiConfig";

const FileDownloader = ({ route }) => {
  const { fileName, fileId } = route.params; 
  const [videoUri, setVideoUri] = useState(null);
  const fileUri = FileSystem.documentDirectory + fileName;
  const [base64, setBase64] = useState(null);
  const [pdfSource, setpdfSource] = useState(null);

  useEffect(() => {
    const downloadFile = async () => {
      const url = `${BASE_URL}/api/TimeTableApi/downloadthefile?fileName=${fileId}`; 

      try {
        const response = await FileSystem.downloadAsync(url, fileUri);
        setVideoUri(response.uri);
        //  Alert.alert('File downloaded successfully!', `File saved to: ${response.uri}`);
         const fileExists = await FileSystem.getInfoAsync(fileUri);
         console.log('File exists:', fileExists.exists);
         if (fileExists.exists) {
          // Read the file as a Base64 string
          const base64Data = await FileSystem.readAsStringAsync(response.uri, {
            encoding: FileSystem.EncodingType.Base64,
          }); 
          console.log('Base64 length:', base64Data.length); 
          setBase64(base64Data); 
          // await FileSystem.writeAsStringAsync(fileUri, base64, {
          //   encoding: FileSystem.EncodingType.Base64,
          // });
          setpdfSource(`data:application/pdf;base64,${base64Data.trim()}`);

        } else {
          console.error('File does not exist at:', fileUri);
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', error.message);
      }
    };

    downloadFile();
  }, [fileId, fileUri]); 
  
  const openPDF = async () => {
    if (videoUri) {
      Alert.alert('Open', 'PDF file ');
      await Linking.openURL(videoUri);
    } else {
      Alert.alert('Error', 'PDF file not available');
    }
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
      fileName.endsWith('.mp4') ? (
        <Video
          source={{ uri: videoUri }} 
          style={styles.video}
          useNativeControls={true}
          resizeMode="contain" 
          isLooping 
          shouldPlay 
        />
      ) : (  
        base64 ? (
          <Button title="Open PDF" onPress={openPDF} />
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Loading PDF...</Text>
          </View>
        )
      )) : (
        <View style={styles.loadingContainer}>
          <Text>Loading video...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300, // Adjust height as needed
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FileDownloader;
