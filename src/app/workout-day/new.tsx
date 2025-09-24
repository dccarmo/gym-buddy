import { HeaderButton } from "@/components/HeaderButton";
import {
  WorkoutDayForm,
  WorkoutDayFormData,
  WorkoutDayFormRef,
} from "@/components/WorkoutDayForm";
import { useStore } from "@/store";
import { headerOptionsByPlatform } from "@/utils/platform";
import Feather from "@expo/vector-icons/Feather";
import { Link, Stack, useNavigation } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function Screen() {
  const theme = UnistylesRuntime.getTheme();
  const navigation = useNavigation();

  const workoutDays = useStore((state) => state.workoutDays);
  const newWorkoutDay = useStore((state) => state.newWorkoutDay);
  const newExercise = useStore((state) => state.newExercise);
  const newWorkoutDayExercise = useStore(
    (state) => state.newWorkoutDayExercise
  );

  const onSubmit = React.useCallback(
    (data: WorkoutDayFormData) => {
      const workoutDay = newWorkoutDay(data.name, workoutDays.length + 1);

      data.exercises.forEach((exerciseData, index) => {
        const exercise = newExercise(exerciseData.name);

        newWorkoutDayExercise(
          workoutDay.id,
          exercise.id,
          exerciseData.sets,
          index + 1,
          exerciseData.minReps,
          exerciseData.maxReps,
          exerciseData.weight,
          exerciseData.restIntervalSeconds
        );
      });

      navigation.goBack();
    },
    [
      navigation,
      newWorkoutDay,
      newExercise,
      newWorkoutDayExercise,
      workoutDays.length,
    ]
  );

  const formRef = React.useRef<WorkoutDayFormRef>({ submitForm(onSubmit) {} });

  return (
    <>
      <Stack.Screen
        options={headerOptionsByPlatform({
          shared: {
            title: "New Workout Day",
          },
          ios: {
            headerTransparent: true,
            headerLeft: () => (
              <Link href="../" asChild>
                <HeaderButton>
                  <Feather name="x" size={28} color={theme.colors.foreground} />
                </HeaderButton>
              </Link>
            ),
            headerRight: () => (
              <HeaderButton
                onPress={() => formRef.current.submitForm(onSubmit)}
              >
                <Feather name="check" size={28} color={theme.colors.primary} />
              </HeaderButton>
            ),
          },
          android: {
            headerRight: () => (
              <HeaderButton
                onPress={() => formRef.current.submitForm(onSubmit)}
                width={60}
              >
                <Text style={styles.headerButtonTitle}>Save</Text>
              </HeaderButton>
            ),
          },
        })}
      />
      <WorkoutDayForm ref={formRef} />
    </>
  );
}
const styles = StyleSheet.create((theme, rt) => ({
  headerButtonTitle: {
    color: theme.colors.white,
  },
}));
