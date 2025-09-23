import { Stack } from "expo-router";
import { Platform } from "react-native";
import { type UnistylesValues } from "react-native-unistyles";
import { type NonEmptyObject } from "type-fest";

type PlatformAndShared = Platform["OS"] | "shared";

export function headerOptionsByPlatform(
  options: NonEmptyObject<
    Partial<
      Record<
        PlatformAndShared,
        React.ComponentProps<(typeof Stack)["Screen"]>["options"]
      >
    >
  >
) {
  return {
    ...options["shared"],
    ...options[Platform.OS],
  };
}

export function componentByPlatform(
  components: NonEmptyObject<Partial<Record<Platform["OS"], React.ReactNode>>>
) {
  return components[Platform.OS];
}

export function styleByPlatform(
  style: NonEmptyObject<Partial<Record<PlatformAndShared, UnistylesValues>>>
) {
  return {
    ...style["shared"],
    ...style[Platform.OS],
    // TO-DO fix this to use ReactNativeStyleSheet
  } as any;
}
