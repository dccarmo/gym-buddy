import { HeaderButton } from "@/components/HeaderButton";
import {
  WorkoutDayForm,
  WorkoutDayFormData,
  WorkoutDayFormRef,
} from "@/components/WorkoutDayForm";
import {
  getExercise,
  getWorkoutDay,
  getWorkoutDayExercisesByWorkoutDay,
  useStore,
} from "@/store";
import { headerOptionsByPlatform } from "@/utils/platform";
import Feather from "@expo/vector-icons/Feather";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function EditWorkoutDayScreen() {
  const theme = UnistylesRuntime.getTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const workoutDays = useStore((state) => state.workoutDays);
  const exercises = useStore((state) => state.exercises);
  const workoutDayExercises = useStore((state) => state.workoutDayExercises);
  const updateWorkoutDay = useStore((state) => state.updateWorkoutDay);
  const newExercise = useStore((state) => state.newExercise);
  const newWorkoutDayExercise = useStore(
    (state) => state.newWorkoutDayExercise
  );
  const clearWorkoutDayExercises = useStore(
    (state) => state.clearWorkoutDayExercises
  );

  const workoutDay = React.useMemo(() => {
    return getWorkoutDay(workoutDays, id!);
  }, [workoutDays, id]);

  const currentExercises = React.useMemo(() => {
    if (!workoutDay) return [];

    const dayExercises = getWorkoutDayExercisesByWorkoutDay(
      workoutDayExercises,
      workoutDay.id
    );

    return dayExercises.map((dayExercise) => {
      const exercise = getExercise(exercises, dayExercise.exerciseId);
      return {
        name: exercise?.name || "",
        sets: dayExercise.sets,
        minReps: dayExercise.minReps,
        maxReps: dayExercise.maxReps,
        weight: dayExercise.weight,
        restIntervalSeconds: dayExercise.restIntervalSeconds,
      };
    });
  }, [workoutDay, workoutDayExercises, exercises]);

  const defaultValues = React.useMemo(() => {
    if (!workoutDay) return undefined;

    return {
      name: workoutDay.name,
      exercises:
        currentExercises.length > 0
          ? currentExercises
          : [{ name: "", sets: 3 }],
    };
  }, [workoutDay, currentExercises]);

  const onSubmit = React.useCallback(
    (data: WorkoutDayFormData) => {
      if (!workoutDay) return;

      // Update the workout day name and keep the same order
      updateWorkoutDay(workoutDay.id, data.name, workoutDay.dayOrder);

      // Clear existing exercises for this workout day
      clearWorkoutDayExercises(workoutDay.id);

      // Add new exercises
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
      workoutDay,
      navigation,
      updateWorkoutDay,
      clearWorkoutDayExercises,
      newExercise,
      newWorkoutDayExercise,
    ]
  );

  const formRef = React.useRef<WorkoutDayFormRef>({ submitForm(onSubmit) {} });

  if (!workoutDay) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Workout day not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={headerOptionsByPlatform({
          shared: {
            title: "Edit Workout Day",
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
      <WorkoutDayForm defaultValues={defaultValues} ref={formRef} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBackground,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  headerButtonTitle: {
    color: theme.colors.white,
  },
}));
