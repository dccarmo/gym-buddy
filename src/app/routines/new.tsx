import { HeaderButton } from "@/components/HeaderButton";
import { useRoutineStore } from "@/store";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigation } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { z } from "zod";

const schema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
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
  });

  const navigation = useNavigation();

  const newRoutine = useRoutineStore((state) => state.newRoutine);

  const onSubmit = React.useCallback(
    (data: FormData) => {
      newRoutine(data.title);
      navigation.goBack();
    },
    [navigation, newRoutine]
  );

  React.useEffect(() => {
    navigation.setOptions({
      ...(Platform.OS === "ios"
        ? {
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
          }
        : {
            headerRight: () => (
              <HeaderButton onPress={handleSubmit(onSubmit)} width={60}>
                <Text style={styles.headerButtonTitle}>Save</Text>
              </HeaderButton>
            ),
          }),
    });
  }, [
    handleSubmit,
    navigation,
    onSubmit,
    theme.colors.foreground,
    theme.colors.primary,
  ]);

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContent}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Title"
                placeholderTextColor={
                  Platform.OS === "android"
                    ? theme.colors.foreground
                    : undefined
                }
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingTop: Platform.OS === "ios" ? 64 : 0,
  },
  formContent: {
    padding: 20,
  },
  textInput: {
    height: 70,
    paddingHorizontal: 20,
    fontSize: 18,
    ...(Platform.OS === "ios"
      ? {
          backgroundColor: theme.colors.white,
          borderRadius: 24,
        }
      : {
          borderColor: theme.colors.foreground,
          borderWidth: 1,
          borderRadius: 8,
        }),
  },
  textInputMultiline: {
    height: 120,
    paddingTop: 20,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 8,
  },
  headerButtonTitle: {
    color: theme.colors.white,
  },
}));
