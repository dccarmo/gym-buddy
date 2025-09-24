import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
        />
        <Stack.Screen
          name="workout-day/new"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="workout-day/[id]/edit"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
