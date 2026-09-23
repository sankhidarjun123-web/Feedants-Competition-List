import "../../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="competition/[competitionId]"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="home"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="candidate"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </AuthProvider>);
}