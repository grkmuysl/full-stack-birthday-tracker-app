import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useCategories } from "@/features/categories/useCategories";
import { CategoryResponse } from "@/api/types";

export default function CategoriesScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useCategories();

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Categories</Text>
        <TouchableOpacity
          className="bg-orange-500 rounded-lg px-4 py-2"
          onPress={() => router.push("/category-form")}
        >
          <Text className="text-white font-medium">+ Add Category</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}

      {isError && (
        <Text className="text-center text-red-500 mt-4">
          Categories could not be loaded.
        </Text>
      )}

      {data && data.length === 0 && (
        <Text className="text-center text-gray-500 mt-4">
          No categories added yet.
        </Text>
      )}

      {data && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-100 mx-4" />
          )}
          renderItem={({ item }: { item: CategoryResponse }) => (
            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-4"
              onPress={() => router.push(`/category-form?id=${item.id}`)}
            >
              <View
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text className="font-medium">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
