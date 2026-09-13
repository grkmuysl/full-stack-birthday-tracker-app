import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePerson } from "@/features/contacts/usePerson";
import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);

  const { data: person, isLoading, isError } = usePerson(personId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (isError || !person) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Person not found.</Text>
      </View>
    );
  }

  const days = daysUntilNextBirthday(person.birthDate);
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-orange-500 px-6 pt-8 pb-6 flex-row items-center gap-4">
        <View className="h-20 w-20 rounded-full bg-white/30 items-center justify-center border-4 border-white">
          <Text className="text-white text-xl font-bold">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold">
            {person.fullName}
          </Text>
          <Text className="text-white/90">{formatDaysToGo(days)}</Text>
        </View>
        <TouchableOpacity
          className="bg-white/20 rounded-lg px-3 py-2"
          onPress={() => router.push(`/person-form?id=${person.id}`)}
        >
          <Text className="text-white font-medium">Edit</Text>
        </TouchableOpacity>
      </View>

      <View className="p-6 gap-5">
        <View>
          <Text className="text-sm text-gray-500 mb-1">Category</Text>
          {person.category ? (
            <View
              className="self-start rounded-full px-3 py-1"
              style={{ backgroundColor: `${person.category.color}30` }}
            >
              <Text
                className="font-medium"
                style={{ color: person.category.color }}
              >
                {person.category.name}
              </Text>
            </View>
          ) : (
            <Text>—</Text>
          )}
        </View>

        {person.note && (
          <View>
            <Text className="text-sm text-gray-500 mb-1">Notes</Text>
            <Text>{person.note}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
