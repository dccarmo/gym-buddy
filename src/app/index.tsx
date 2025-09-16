import { useRoutineStore } from "@/store";
import { LiquidGlassView } from "@callstack/liquid-glass";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function Screen() {
  const routines = useRoutineStore((state) => state.routines);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={routines}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
      <Link href="/routines/new" asChild>
        <AddButton />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface AddButtonProps {
  onPress?: () => void;
}

function AddButton({ onPress }: AddButtonProps) {
  const theme = UnistylesRuntime.getTheme();

  if (Platform.OS === "ios") {
    return (
      <Pressable style={addButtonStyles.container} onPress={onPress}>
        <LiquidGlassView
          style={addButtonStyles.content}
          tintColor={theme.colors.primary}
          interactive
        >
          <Feather name="plus" size={28} color={theme.colors.white} />
        </LiquidGlassView>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={addButtonStyles.container}
      onPress={onPress}
      android_ripple={{
        color: "#FFFFFF50",
        radius: 56,
        foreground: true,
        borderless: false,
      }}
    >
      <View style={addButtonStyles.content}>
        <Feather name="plus" size={28} color={theme.colors.white} />
      </View>
    </Pressable>
  );
}

const addButtonStyles = StyleSheet.create((theme) => ({
  container: {
    position: "absolute",
    bottom: 40,
    right: 40,
    ...(Platform.OS === "android" && {
      overflow: "hidden",
      borderRadius: 14,
      elevation: 4,
    }),
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "ios"
      ? {
          width: 50,
          height: 50,
          borderRadius: 25,
        }
      : {
          width: 56,
          height: 56,
          backgroundColor: theme.colors.primary,
          borderRadius: 14,
        }),
  },
}));
