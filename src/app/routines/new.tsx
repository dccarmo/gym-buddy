import React from "react";
import { Platform, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export default function Screen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
        <Text style={{ fontSize: 64 }}>Add Routine</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingTop: Platform.OS === "ios" ? 64 : 0,
  },
}));
