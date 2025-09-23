import { randomUUID } from "expo-crypto";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface Routine {
  id: string;
  name: string;
}

export interface WorkoutDay {
  id: string;
  routineId: string;
  name: string;
  dayOrder: number;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
}

export interface WorkoutDayExercise {
  id: string;
  workoutDayId: string;
  exerciseId: string;

  sets: number;
  minReps?: number;
  maxReps?: number;
  weight?: number;
  restIntervalSeconds?: number;

  exerciseOrder: number;
}

interface State {
  routines: Routine[];
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  workoutDayExercises: WorkoutDayExercise[];
  selectedRoutineId: string;
}

interface Actions {
  newRoutine: (name: string) => Routine;

  newWorkoutDay: (routineId: string, name: string, dayOrder: number) => WorkoutDay;
  updateWorkoutDay: (id: string, name: string, dayOrder: number) => WorkoutDay | null;

  newExercise: (
    name: string,
    description?: string,
    muscleGroup?: string
  ) => Exercise;

  newWorkoutDayExercise: (
    workoutDayId: string,
    exerciseId: string,
    sets: number,
    exerciseOrder: number,
    minReps?: number,
    maxReps?: number,
    weight?: number,
    restIntervalSeconds?: number
  ) => WorkoutDayExercise;
}

type RoutineStore = State & Actions;

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set) => {
      const initialRoutine = { id: randomUUID(), name: "My Routine" };

      return {
        routines: [initialRoutine],
        workoutDays: [],
        exercises: [],
        workoutDayExercises: [],

        selectedRoutineId: initialRoutine.id,

        newRoutine(name: string) {
          const newRoutine = {
            id: randomUUID(),
            name,
          };

          set((state) => {
            return {
              routines: [...state.routines, newRoutine],
            };
          });

          return newRoutine;
        },

        newWorkoutDay(routineId: string, name: string, dayOrder: number) {
          const newWorkoutDay = {
            id: randomUUID(),
            routineId,
            name,
            dayOrder,
          };

          set((state) => {
            return {
              workoutDays: [...state.workoutDays, newWorkoutDay],
            };
          });

          return newWorkoutDay;
        },

        updateWorkoutDay(id: string, name: string, dayOrder: number) {
          let updatedWorkoutDay: WorkoutDay | null = null;

          set((state) => {
            return {
              workoutDays: state.workoutDays.map((workoutDay) => {
                if (workoutDay.id === id) {
                  updatedWorkoutDay = { ...workoutDay, name, dayOrder };
                  return updatedWorkoutDay;
                }
                return workoutDay;
              }),
            };
          });

          return updatedWorkoutDay;
        },

        newExercise(name: string, description?: string, muscleGroup?: string) {
          const newExercise = {
            id: randomUUID(),
            name,
            description,
            muscleGroup,
          };

          set((state) => {
            return {
              exercises: [...state.exercises, newExercise],
            };
          });

          return newExercise;
        },

        newWorkoutDayExercise(
          workoutDayId: string,
          exerciseId: string,
          sets: number,
          exerciseOrder: number,
          minReps?: number,
          maxReps?: number,
          weight?: number,
          restIntervalSeconds?: number
        ) {
          const newWorkoutDayExercise = {
            id: randomUUID(),
            workoutDayId,
            exerciseId,
            sets,
            minReps,
            maxReps,
            weight,
            restIntervalSeconds,
            exerciseOrder,
          };

          set((state) => {
            return {
              workoutDayExercises: [...state.workoutDayExercises, newWorkoutDayExercise],
            };
          });

          return newWorkoutDayExercise;
        },
      };
    },
    {
      name: "storage",
      version: 5,
      migrate: (persistedState) => {
        return {};
      },
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// Standalone getter functions
export const getRoutine = (routines: Routine[], id: string): Routine | null => {
  return routines.find((routine) => routine.id === id) ?? null;
};

export const getWorkoutDay = (
  workoutDays: WorkoutDay[],
  id: string
): WorkoutDay | null => {
  return workoutDays.find((day) => day.id === id) ?? null;
};

export const getWorkoutDaysByRoutine = (
  workoutDays: WorkoutDay[],
  routineId: string
): WorkoutDay[] => {
  return workoutDays.filter((day) => day.routineId === routineId);
};

export const getExercise = (
  exercises: Exercise[],
  id: string
): Exercise | null => {
  return exercises.find((exercise) => exercise.id === id) ?? null;
};

export const getWorkoutDayExercise = (
  workoutDayExercises: WorkoutDayExercise[],
  id: string
): WorkoutDayExercise | null => {
  return workoutDayExercises.find((exercise) => exercise.id === id) ?? null;
};

export const getWorkoutDayExercisesByWorkoutDay = (
  workoutDayExercises: WorkoutDayExercise[],
  workoutDayId: string
): WorkoutDayExercise[] => {
  return workoutDayExercises.filter(
    (exercise) => exercise.workoutDayId === workoutDayId
  );
};
