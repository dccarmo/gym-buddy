import { styleByPlatform } from "@/utils/platform";
import React from "react";
import RN, { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = RN.TextInputProps & {
  multiline?: boolean;
  style?: RN.StyleProp<RN.TextStyle>;
};

export function TextInput({ multiline, style, ...textInputProps }: Props) {
  return (
    <RN.TextInput
      style={[styles.container, multiline && styles.textInputMultiline, style]}
      {...textInputProps}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    ...Platform.select({
      web: {}
    }),
    ...styleByPlatform({
      shared: {
        height: 60,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.border,
        borderWidth: 1,
      },
      ios: {
        borderRadius: 24,
      },
      android: {
        borderRadius: 8,
      },
    }),
    variants: {

    }
  },
  textInputMultiline: {
    height: 120,
    paddingTop: 20,
    textAlignVertical: "top",
  },
}));
