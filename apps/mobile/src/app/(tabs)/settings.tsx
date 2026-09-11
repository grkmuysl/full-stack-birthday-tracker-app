import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-4">
      <Text>Settings</Text>
      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-lg"
        onPress={logout}
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
