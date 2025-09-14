import { StyleSheet } from "react-native-unistyles";

export const lightTheme = {
  colors: {
    white: "white",
    foreground: "black",
    primary: "#00a6f4",
    background: "#F2F2F7",
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
