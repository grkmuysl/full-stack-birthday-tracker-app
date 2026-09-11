import { View, Text } from "react-native";
import { PersonResponse } from "@/api/types";
import { daysUntilNextBirthday, formatDaysToGo } from "@/lib/birthdayUtils";

export function PersonCard({ person }: { person: PersonResponse }) {
  const days = daysUntilNextBirthday(person.birthDate);
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="flex-1 bg-white rounded-xl border border-gray-200 p-4 gap-3 m-1.5">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
          <Text className="text-orange-600 font-semibold">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-medium" numberOfLines={1}>
            {person.fullName}
          </Text>
          {person.category && (
            <View
              className="self-start rounded-full px-2 py-0.5 mt-1"
              style={{ backgroundColor: `${person.category.color}30` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: person.category.color }}
              >
                {person.category.name}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text className="text-sm text-gray-500">{formatDaysToGo(days)}</Text>
    </View>
  );
}
