import Feather from "@expo/vector-icons/Feather";
import { Link, Stack } from "expo-router";
import { Platform, Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function RootLayout() {
  const theme = UnistylesRuntime.getTheme();

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="routines/new"
          options={{
            title: "New Routine",
            presentation: "modal",
            ...(Platform.OS === "ios"
              ? {
                  headerTransparent: true,
                  headerLeft: () => (
                    <Link href="../" asChild>
                      <Pressable style={styles.headerButton()}>
                        <Feather
                          name="x"
                          size={28}
                          color={theme.colors.foreground}
                        />
                      </Pressable>
                    </Link>
                  ),
                  headerRight: () => (
                    <Pressable style={styles.headerButton()}>
                      <Feather
                        name="check"
                        size={28}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                  ),
                }
              : {
                  headerRight: () => (
                    <Pressable style={styles.headerButton(60)}>
                      <Text style={styles.headerButtonTitle}>Save</Text>
                    </Pressable>
                  ),
                }),
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  headerButton: (width?: number) => ({
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "android" && {
      backgroundColor: theme.colors.primary,
      width,
      borderRadius: 256,
    }),
  }),
  headerButtonTitle: {
    color: theme.colors.white,
  },
  headerBackground: {
    flex: 1,
  },
}));
