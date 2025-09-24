import { LiquidGlassView } from "@callstack/liquid-glass";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Platform, Pressable, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

interface Props {
  onPress?: () => void;
}

export function AddButton({ onPress }: Props) {
  const theme = UnistylesRuntime.getTheme();

  if (Platform.OS === "ios") {
    return (
      <Pressable style={styles.container} onPress={onPress}>
        <LiquidGlassView
          style={styles.content}
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
      style={styles.container}
      onPress={onPress}
      android_ripple={{
        color: "#FFFFFF50",
        radius: 56,
        foreground: true,
        borderless: false,
      }}
    >
      <View style={styles.content}>
        <Feather name="plus" size={28} color={theme.colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
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
          width: 80,
          height: 80,
          backgroundColor: theme.colors.primary,
          borderRadius: 14,
        }),
  },
}));
