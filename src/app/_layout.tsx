import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
