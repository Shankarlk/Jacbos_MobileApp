import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import BASE_URL from './apiConfig';

function FileViewerScreen({ route }) {
  const { file } = route.params || {};
  const [imageError, setImageError] = useState(false);

  if (!file) {
    return (
      <View style={styles.centered}>
        <Text>No file provided</Text>
      </View>
    );
  }

  const fileUrl = `${BASE_URL}/api/GalleryApi/downloadthefile?location=${encodeURIComponent(file)}`;

  if ((file.endsWith(".png") || file.endsWith(".jpeg") || file.endsWith(".jpg")) && !imageError) {
    return (
      <Image
        source={{ uri: fileUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
        onError={() => setImageError(true)}
      />
    );
  }

  if (imageError || (!file.endsWith(".png") && !file.endsWith(".jpeg") && !file.endsWith(".jpg") && !file.endsWith(".mp4"))) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>File not found or unsupported format</Text>
      </View>
    );
  }

  // For MP4 files (optional)
  return (
    <Video
      source={{ uri: fileUrl }}
      style={{ width: "100%", height: "100%" }}
      useNativeControls
      resizeMode="contain"
      onError={(e) => console.log("Video error", e)}
    />
  );
}

const styles = {
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default FileViewerScreen;
