import { StyleSheet } from "react-native-unistyles";
import { colors } from "./colors";

export const lightTheme = {
  colors: {
    ...colors,
    white: "#ffffff",
    foreground: "#000000",
    primary: "#51a2ff",
    secondary: "#bedbff",
    background: "#ffffff",
    secondaryBackground: "#f5f5f5",
    border: "#e5e5e5",
  },
};

export const themes = {
  light: lightTheme,
};

export const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

export type Breakpoints = typeof breakpoints;
export type Themes = typeof themes;

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends Themes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends Breakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "light",
  },
  breakpoints,
  themes,
});
