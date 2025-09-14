import React from "react";
import {
    Platform,
    Pressable,
    PressableProps,
    StyleProp,
    ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = Omit<PressableProps, "children" | "style"> & {
  width?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function HeaderButton({
  width,
  children,
  style,
  ...pressableProps
}: Props) {
  return (
    <Pressable style={[styles.container(width), style]} {...pressableProps}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: (width?: number) => ({
    height: 36,
    width: width ?? 36,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "android" && {
      backgroundColor: theme.colors.primary,
      width,
      borderRadius: 256,
      overflow: "hidden",
    }),
  }),
}));
