import { Stack } from "expo-router";
import { QueryProvider } from "../src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="examples/login"
          options={{ title: "Login Example" }}
        />
        <Stack.Screen
          name="examples/quiz"
          options={{ title: "Quiz Example" }}
        />
        <Stack.Screen
          name="examples/wallet"
          options={{ title: "Wallet & Shop" }}
        />
        <Stack.Screen
          name="examples/profile"
          options={{ title: "Profile Example" }}
        />
        <Stack.Screen
          name="examples/leaderboard"
          options={{ title: "Leaderboard" }}
        />
      </Stack>
    </QueryProvider>
  );
}
