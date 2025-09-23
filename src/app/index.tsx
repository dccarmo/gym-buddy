import { Routine, useRoutineStore } from "@/store";
import { LiquidGlassView } from "@callstack/liquid-glass";
import Feather from "@expo/vector-icons/Feather";
import { Link, Redirect } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function Screen() {
  // const routines = useRoutineStore((state) => state.routines);
  const selectedRoutineId = useRoutineStore((state) => state.selectedRoutineId);
  // const headerHeight = useHeaderHeight();

  return (
    <Redirect
      href={{
        pathname: "/routines/[id]",
        params: { id: selectedRoutineId },
      }}
    />
  );

  // return (
  //   <>
  //     <StatusBar />
  //     <Stack.Screen
  //       options={headerOptionsByPlatform({
  //         shared: {
  //           title: "Routines",
  //         },
  //         ios: {
  //           headerTransparent: true,
  //         },
  //         android: {
  //           headerShadowVisible: false,
  //         },
  //       })}
  //     />
  //     <FlatList
  //       style={styles.container}
  //       contentContainerStyle={styles.contentContainer(headerHeight)}
  //       data={routines}
  //       renderItem={({ item }) => <RoutineItem routine={item} />}
  //       ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
  //     />
  //     <Link href="/routines/new" asChild>
  //       <AddButton />
  //     </Link>
  //   </>
  // );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  contentContainer: (headerHeight: number) => ({
    flex: 1,
    paddingTop: Platform.OS === "ios" ? headerHeight : 20,
    paddingBottom: 20,
    backgroundColor: theme.colors.background,
  }),
}));

interface RoutineItemProps {
  routine: Routine;
}

function RoutineItem({ routine }: RoutineItemProps) {
  return (
    <Link
      href={{
        pathname: "/routines/[id]",
        params: { id: routine.id },
      }}
      asChild
    >
      <Pressable style={routineItemStyles.container}>
        <Text style={routineItemStyles.title}>{routine.name}</Text>
      </Pressable>
    </Link>
  );
}

const routineItemStyles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.blue[100],
    marginHorizontal: 20,
    padding: 20,
    ...(Platform.OS === "ios"
      ? {
          borderRadius: 25,
        }
      : {
          borderRadius: 10,
        }),
  },
  title: {
    fontSize: 20,
  },
}));

interface AddButtonProps {
  onPress?: () => void;
}

function AddButton({ onPress }: AddButtonProps) {
  const theme = UnistylesRuntime.getTheme();

  if (Platform.OS === "ios") {
    return (
      <Pressable style={addButtonStyles.container} onPress={onPress}>
        <LiquidGlassView
          style={addButtonStyles.content}
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
      style={addButtonStyles.container}
      onPress={onPress}
      android_ripple={{
        color: "#FFFFFF50",
        radius: 56,
        foreground: true,
        borderless: false,
      }}
    >
      <View style={addButtonStyles.content}>
        <Feather name="plus" size={28} color={theme.colors.white} />
      </View>
    </Pressable>
  );
}

const addButtonStyles = StyleSheet.create((theme) => ({
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
