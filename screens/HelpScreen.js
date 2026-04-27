import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform, Image } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function HelpScreen() {
  const openPDF = async () => {
    const pdfModule = require("../assets/manuals/IdeaBank_User_Manual_Application_Web.pdf");

    try {
      const resolved = Image.resolveAssetSource(pdfModule);
      const uri = typeof pdfModule === "string" ? pdfModule : resolved?.uri;

      if (!uri) {
        Alert.alert("Error", "PDF asset not found");
        return;
      }

      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && typeof window.open === "function") {
          window.open(uri, "_blank");
          return;
        }

        await Linking.openURL(uri);
        return;
      }

      let openUri = uri;
      if (Platform.OS === "android" && openUri.startsWith("file://")) {
        openUri = await FileSystem.getContentUriAsync(openUri);
      }

      try {
        await Linking.openURL(openUri);
        return;
      } catch (e) {
        // Fall through to sharing-based fallback.
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "User Manual",
        });
        return;
      }

      Alert.alert("Error", "Cannot open the PDF");
    } catch (error) {
      console.error("Failed to open PDF:", error);
      Alert.alert("Error", "Failed to open the PDF");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openPDF}>
        <Text style={styles.buttonText}>Open User Manual</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
