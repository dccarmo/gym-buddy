import { HeaderButton } from "@/components/HeaderButton";
import { useStore, WorkoutDay } from "@/store";
import { headerOptionsByPlatform, styleByPlatform } from "@/utils/platform";
import Feather from "@expo/vector-icons/Feather";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Screen() {
  const workoutDays = useStore((state) => state.workoutDays);

  const updateWorkoutDay = useStore((state) => state.updateWorkoutDay);

  const headerHeight = useHeaderHeight();

  const router = useRouter();

  return (
    <>
      <StatusBar />
      <Stack.Screen
        options={headerOptionsByPlatform({
          shared: {
            title: "My Routine",
          },
          ios: {
            headerTransparent: true,

            headerRight: () => (
              <HeaderButton onPress={() => {}}>
                <Feather name="edit" size={22} />
              </HeaderButton>
            ),
          },
          android: {
            headerShadowVisible: false,
            headerRight: () => (
              <HeaderButton onPress={() => {}} width={50}>
                <Text style={styles.headerButtonTitle}>Edit</Text>
              </HeaderButton>
            ),
          },
        })}
      />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer(headerHeight)}
        data={workoutDays}
        renderItem={({ item }) => (
          <Item
            item={item}
            onSaveName={(name) =>
              updateWorkoutDay(item.id, name, item.dayOrder)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                // const workoutDay = newWorkoutDay(
                //   id,
                //   "",
                //   workoutDays.length + 1
                // );

                router.navigate({
                  pathname: "/workout-day/new",
                });
              }}
              style={(state) => styles.addButton(state.pressed)}
            >
              <Text style={styles.addButtonTitle}>Add Workout Day</Text>
            </Pressable>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  contentContainer: (headerHeight: number) =>
    styleByPlatform({
      shared: {
        flex: 1,
        paddingBottom: 20,
        backgroundColor: theme.colors.background,
      },
      ios: {
        paddingTop: headerHeight,
      },
      android: {
        paddingTop: 20,
      },
    }),
  title: {
    paddingLeft: 20,
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 40,
  },
  footer: {
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: (pressed: boolean) =>
    styleByPlatform({
      shared: {},
      android: {
        backgroundColor: pressed ? theme.colors.secondaryBackground : undefined,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 256,
      },
      ios: {
        opacity: pressed ? 0.5 : 1,
      },
    }),
  addButtonTitle: styleByPlatform({
    shared: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  }),
  headerButtonTitle: {
    color: theme.colors.white,
  },
}));

interface ItemProps {
  item: WorkoutDay;
  onSaveName: (name: string) => void;
}

function Item({ item, onSaveName }: ItemProps) {
  const [name, setName] = React.useState(item.name);

  return (
    <View style={itemStyles.container}>
      <TextInput
        style={itemStyles.nameInput}
        value={name}
        onChangeText={setName}
        onBlur={() => onSaveName(name)}
      />
    </View>
  );
}

const itemStyles = StyleSheet.create((theme) => ({
  container: styleByPlatform({
    shared: {
      backgroundColor: theme.colors.blue[200],
      marginHorizontal: 20,
      padding: 20,
    },
    ios: {
      borderRadius: 25,
    },
    android: {
      borderRadius: 10,
    },
  }),
  nameInput: {
    fontSize: 20,
  },
}));
