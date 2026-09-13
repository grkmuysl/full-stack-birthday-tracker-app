import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useInfinitePeople } from "@/features/contacts/useInfinitePeople";
import { useCategories } from "@/features/categories/useCategories";
import { PersonCard } from "@/features/contacts/PersonCard";
import { PersonResponse } from "@/api/types";

const ALL_TAB = "all";

export default function DashboardScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(ALL_TAB);

  const { data: categories } = useCategories();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePeople({
    category: activeCategory === ALL_TAB ? undefined : Number(activeCategory),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const people = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );

  const tabs = [{ id: ALL_TAB, name: "All" }, ...(categories ?? [])];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Upcoming Birthdays</Text>
        <TouchableOpacity
          className="bg-orange-500 rounded-lg px-4 py-2 flex-row items-center gap-1"
          onPress={() => router.push("/person-form")}
        >
          <Text className="text-white font-medium">+ Add Person</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pb-3">
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id.toString();
            return (
              <TouchableOpacity
                onPress={() => setActiveCategory(item.id.toString())}
                className={`px-4 py-2 rounded-full mr-2 ${
                  isActive ? "bg-orange-500" : "bg-white border border-gray-200"
                }`}
              >
                <Text
                  className={
                    isActive ? "text-white font-medium" : "text-gray-700"
                  }
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}

      {isError && (
        <Text className="text-center text-red-500 mt-4">
          An error occurred while fetching contacts. Please try again later.
        </Text>
      )}

      {!isLoading && people.length === 0 && (
        <Text className="text-center text-gray-500 mt-4">
          No contacts available.
        </Text>
      )}

      {people.length > 0 && (
        <FlatList
          data={people}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="px-2.5 pb-4"
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator className="my-4" color="#f97316" />
            ) : null
          }
          renderItem={({ item }: { item: PersonResponse }) => (
            <TouchableOpacity
              className="flex-1"
              onPress={() => router.push(`/contacts/${item.id}`)}
            >
              <PersonCard person={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
