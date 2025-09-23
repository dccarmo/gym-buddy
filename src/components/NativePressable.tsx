import { styleByPlatform } from "@/utils/platform";
import React from "react";
import { Pressable, PressableProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = Omit<PressableProps, "children"> & {
  children: React.ReactNode;
};

export function NativePressable({
  children,
  style,
  android_ripple,
  ...pressableProps
}: Props) {
  return (
    <Pressable
      android_ripple={{
        foreground: true,
        borderless: false,
        ...android_ripple,
      }}
      style={(state) => [
        styles.container(state.pressed),
        typeof style === "function" ? style(state) : style,
      ]}
      {...pressableProps}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: (pressed: boolean) =>
    styleByPlatform({
      shared: {
        overflow: "hidden",
      },
      ios: {
        opacity: pressed ? 0.5 : 1,
      },
    }),
}));
