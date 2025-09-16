import { randomUUID } from "expo-crypto";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

interface Routine {
  id: string;
  title: string;
}

interface State {
  routines: Routine[];
}

interface Actions {
  newRoutine: (title: string) => void;
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
    (set) => ({
      routines: [],

      newRoutine: (title: string) =>
        set((state) => {
          return {
            routines: [
              ...state.routines,
              {
                id: randomUUID(),
                title,
              },
            ],
          };
        }),
    }),
    { name: "storage", storage: createJSONStorage(() => zustandStorage) }
  )
);
