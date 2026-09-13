import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { usePeople } from "@/features/contacts/usePeople";
import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";
import { PersonResponse } from "@/api/types";

export default function ContactsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = usePeople();

  const filtered = data?.content.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-2 gap-3">
        <Text className="text-2xl font-bold">All Contacts</Text>
        <TextInput
          placeholder="Search contacts..."
          value={search}
          onChangeText={setSearch}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}

      {isError && (
        <Text className="text-center text-red-500 mt-4">
          Failed to load contacts.
        </Text>
      )}

      {filtered && filtered.length === 0 && (
        <Text className="text-center text-gray-500 mt-4">
          No matching contacts found.
        </Text>
      )}

      {filtered && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-100 ml-16" />
          )}
          renderItem={({ item }: { item: PersonResponse }) => {
            const days = daysUntilNextBirthday(item.birthDate);
            const initials = item.fullName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <TouchableOpacity
                className="flex-row items-center gap-3 px-4 py-3"
                onPress={() => router.push(`/contacts/${item.id}`)}
              >
                <View className="h-11 w-11 rounded-full bg-orange-100 items-center justify-center">
                  <Text className="text-orange-600 font-semibold">
                    {initials}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium">{item.fullName}</Text>
                  <Text className="text-sm text-gray-500">
                    {formatDaysToGo(days)}
                  </Text>
                </View>
                {item.category && (
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: `${item.category.color}30` }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: item.category.color }}
                    >
                      {item.category.name}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
