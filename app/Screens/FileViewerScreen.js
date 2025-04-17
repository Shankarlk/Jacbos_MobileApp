import React from "react";
import { View, Image, Text } from "react-native";
import { Video } from "expo-av";
import BASE_URL from "./apiConfig";

function FileViewerScreen({ route }) {
  const { file } = route.params || {};
  const fileUrl = `${BASE_URL}/api/GalleryApi/downloadthefile?location=${encodeURIComponent(file)}`;

  return (
    <View style={{ flex: 1 }}>
      {file.endsWith(".png") || file.endsWith(".jpeg") || file.endsWith(".jpg") ? (
        <Image source={{ uri: fileUrl }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
      ) : file.endsWith(".mp4") ? (
        <Video source={{ uri: fileUrl }} style={{ width: "100%", height: "100%" }} useNativeControls resizeMode="contain" />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Unsupported file format</Text>
        </View>
      )}
    </View>
  );
}

export default FileViewerScreen;
