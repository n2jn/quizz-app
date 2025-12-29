// All import statements remain the same except you need to import `useSession` from your `ctx.tsx` file.

import { Stack } from "expo-router";

// All of the above code remains unchanged. Update the `RootNavigator` to protect routes based on your `SessionProvider` below.


export default function AppLayout() {
  // This renders the navigation stack for all authenticated app routes.
  return <Stack />;
}

