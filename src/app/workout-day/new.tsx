import { HeaderButton } from "@/components/HeaderButton";
import { TextInput } from "@/components/Input";
import { NativePressable } from "@/components/NativePressable";
import { useRoutineStore } from "@/store";
import { headerOptionsByPlatform, styleByPlatform } from "@/utils/platform";
import { OCR } from "@dccarmo/react-native-ocr";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack, useNavigation } from "expo-router";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { z } from "zod";

const exerciseSchema = z.object({
  name: z
    .string("Exercise name is required")
    .min(1, "Exercise name is required")
    .max(100, "Exercise name must be less than 100 characters"),
  sets: z
    .number({ message: "Sets must be a number" })
    .min(1, "Sets must be at least 1"),
  minReps: z
    .number({ message: "Min reps must be a number" })
    .min(1, "Min reps must be at least 1")
    .optional(),
  maxReps: z
    .number({ message: "Max reps must be a number" })
    .min(1, "Max reps must be at least 1")
    .optional(),
  weight: z
    .number({ message: "Weight must be a number" })
    .min(0, "Weight must be at least 0")
    .optional(),
  restIntervalSeconds: z
    .number({ message: "Rest interval must be a number" })
    .min(0, "Rest interval must be at least 0")
    .optional(),
});

const schema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});

type FormData = z.infer<typeof schema>;

export default function Screen() {
  const theme = UnistylesRuntime.getTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      exercises: [{ name: "", sets: 3 }],
    },
  });

  const {
    fields,
    append: appendExercise,
    remove,
  } = useFieldArray({
    control,
    name: "exercises",
  });

  const navigation = useNavigation();

  const workoutDays = useRoutineStore((state) => state.workoutDays);
  const newWorkoutDay = useRoutineStore((state) => state.newWorkoutDay);
  const newExercise = useRoutineStore((state) => state.newExercise);
  const newWorkoutDayExercise = useRoutineStore(
    (state) => state.newWorkoutDayExercise
  );
  const selectedRoutineId = useRoutineStore((state) => state.selectedRoutineId);

  const onSubmit = React.useCallback(
    (data: FormData) => {
      const workoutDay = newWorkoutDay(
        selectedRoutineId,
        data.name,
        workoutDays.length + 1
      );

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
      selectedRoutineId,
      workoutDays.length,
    ]
  );

  const appendExerciseFromImage = React.useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const text = await OCR.recognizeText(result.assets[0].uri);

      console.log("text", text);
    }
  }, []);

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
              <HeaderButton onPress={handleSubmit(onSubmit)}>
                <Feather name="check" size={28} color={theme.colors.primary} />
              </HeaderButton>
            ),
          },
          android: {
            headerRight: () => (
              <HeaderButton onPress={handleSubmit(onSubmit)} width={60}>
                <Text style={styles.headerButtonTitle}>Save</Text>
              </HeaderButton>
            ),
          },
        })}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContent}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}

          <View style={styles.exercisesSection}>
            <View style={styles.exercisesHeader}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              <View style={styles.exercisesHeaderButtons}>
                <NativePressable
                  style={styles.addButton}
                  onPress={appendExerciseFromImage}
                >
                  <Feather
                    name="camera"
                    size={20}
                    color={theme.colors.primary}
                  />
                </NativePressable>
                <NativePressable
                  style={styles.addButton}
                  onPress={() => appendExercise({ name: "", sets: 3 })}
                >
                  <Feather name="plus" size={20} color={theme.colors.primary} />
                </NativePressable>
              </View>
            </View>

            {fields.map((field, index) => (
              <View key={field.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
                  {fields.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => remove(index)}
                    >
                      <Feather name="x" size={20} />
                    </TouchableOpacity>
                  )}
                </View>

                <Controller
                  control={control}
                  name={`exercises.${index}.name`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Exercise name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={styles.exerciseInput}
                    />
                  )}
                />
                {errors.exercises?.[index]?.name && (
                  <Text style={styles.errorText}>
                    {errors.exercises[index]?.name?.message}
                  </Text>
                )}

                <View style={styles.exerciseRow}>
                  <View style={styles.exerciseInputGroup}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <Controller
                      control={control}
                      name={`exercises.${index}.sets`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="3"
                          value={value?.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="numeric"
                          style={styles.numberInput}
                        />
                      )}
                    />
                    {errors.exercises?.[index]?.sets && (
                      <Text style={styles.errorText}>
                        {errors.exercises[index]?.sets?.message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.exerciseInputGroup}>
                    <Text style={styles.inputLabel}>Weight</Text>
                    <Controller
                      control={control}
                      name={`exercises.${index}.weight`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="0"
                          value={value?.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="numeric"
                          style={styles.numberInput}
                        />
                      )}
                    />
                    {errors.exercises?.[index]?.weight && (
                      <Text style={styles.errorText}>
                        {errors.exercises[index]?.weight?.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.exerciseRow}>
                  <View style={styles.exerciseInputGroup}>
                    <Text style={styles.inputLabel}>Min Reps</Text>
                    <Controller
                      control={control}
                      name={`exercises.${index}.minReps`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="8"
                          value={value?.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="numeric"
                          style={styles.numberInput}
                        />
                      )}
                    />
                    {errors.exercises?.[index]?.minReps && (
                      <Text style={styles.errorText}>
                        {errors.exercises[index]?.minReps?.message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.exerciseInputGroup}>
                    <Text style={styles.inputLabel}>Max Reps</Text>
                    <Controller
                      control={control}
                      name={`exercises.${index}.maxReps`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="12"
                          value={value?.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="numeric"
                          style={styles.numberInput}
                        />
                      )}
                    />
                    {errors.exercises?.[index]?.maxReps && (
                      <Text style={styles.errorText}>
                        {errors.exercises[index]?.maxReps?.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.exerciseInputGroup}>
                  <Text style={styles.inputLabel}>Rest Interval (seconds)</Text>
                  <Controller
                    control={control}
                    name={`exercises.${index}.restIntervalSeconds`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="60"
                        value={value?.toString()}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="numeric"
                        style={styles.numberInput}
                      />
                    )}
                  />
                  {errors.exercises?.[index]?.restIntervalSeconds && (
                    <Text style={styles.errorText}>
                      {errors.exercises[index]?.restIntervalSeconds?.message}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            {errors.exercises &&
              typeof errors.exercises.message === "string" && (
                <Text style={styles.errorText}>{errors.exercises.message}</Text>
              )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBackground,
  },
  contentContainer: {
    paddingTop: Platform.OS === "ios" ? 64 : 0,
  },
  formContent: {
    padding: 20,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 8,
  },
  headerButtonTitle: {
    color: theme.colors.white,
  },
  exercisesSection: {
    marginTop: 24,
  },
  exercisesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  exercisesHeaderButtons: {
    flexDirection: "row",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  addButton: styleByPlatform({
    shared: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 8,
      backgroundColor: theme.colors.white,
      borderRadius: 10,
    },
    ios: {
      borderRadius: 256,
    },
  }),
  exerciseCard: styleByPlatform({
    shared: {
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    ios: {
      borderRadius: 24,
    },
  }),
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  removeButton: {
    padding: 4,
  },
  exerciseInput: {
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  exerciseInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  numberInput: {
    // height: 50,
  },
}));
