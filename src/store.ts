import { randomUUID } from "expo-crypto";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface WorkoutDay {
  id: string;
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
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  workoutDayExercises: WorkoutDayExercise[];
}

interface Actions {
  newWorkoutDay: (
    name: string,
    dayOrder: number
  ) => WorkoutDay;
  updateWorkoutDay: (
    id: string,
    name: string,
    dayOrder: number
  ) => WorkoutDay | null;

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

type Store = State & Actions;

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

export const useStore = create<Store>()(
  persist(
    (set) => ({
      workoutDays: [],
      exercises: [],
      workoutDayExercises: [],

      newWorkoutDay(name: string, dayOrder: number) {
        const newWorkoutDay = {
          id: randomUUID(),
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
            workoutDayExercises: [
              ...state.workoutDayExercises,
              newWorkoutDayExercise,
            ],
          };
        });

        return newWorkoutDayExercise;
      },
    }),
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

export const getWorkoutDay = (
  workoutDays: WorkoutDay[],
  id: string
): WorkoutDay | null => {
  return workoutDays.find((day) => day.id === id) ?? null;
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
