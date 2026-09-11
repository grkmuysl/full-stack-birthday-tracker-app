import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
    } catch {
      setError("Failed to create account. Email might already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6 gap-4">
        <Text className="text-2xl font-bold text-center mb-4">
          Create Account
        </Text>

        <View className="gap-2">
          <Text className="text-sm text-gray-600">Full Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm text-gray-600">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm text-gray-600">Şifre</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text className="text-sm text-red-500">{error}</Text>}

        <TouchableOpacity
          className="bg-orange-500 rounded-lg py-3 items-center mt-2"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Register</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center gap-1 mt-2">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/(auth)/login">
            <Text className="text-orange-500 font-medium">Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
