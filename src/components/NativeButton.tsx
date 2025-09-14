import { LiquidGlassView, LiquidGlassViewProps } from "@callstack/liquid-glass";
import React from "react";
import { Platform, Pressable, PressableProps } from "react-native";

type Props = Omit<PressableProps, "children"> & {
  children: React.ReactNode;
  glassProps?: LiquidGlassViewProps;
};

export function NativeButton({
  children,
  glassProps,
  ...pressableProps
}: Props) {
  if (Platform.OS === "ios") {
    return (
      <Pressable {...pressableProps}>
        <LiquidGlassView interactive {...glassProps}>
          {children}
        </LiquidGlassView>
      </Pressable>
    );
  }

  return (
    <Pressable
      android_ripple={{
        color: "#FFFFFF50",
        radius: 56,
        foreground: true,
        borderless: false,
      }}
      {...pressableProps}
    >
      {children}
    </Pressable>
  );
}
