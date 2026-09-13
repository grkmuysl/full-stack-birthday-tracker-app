import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCategories } from "@/features/categories/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/useCategoryMutations";
import { CategoryRequest } from "@/features/categories/categoriesApi";

const PRESET_COLORS = [
  "#F97316",
  "#14B8A6",
  "#EF4444",
  "#3B82F6",
  "#EAB308",
];

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;
  const router = useRouter();

  const { data: categories } = useCategories();
  const existingCategory = categories?.find((c) => c.id === Number(id));

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [form, setForm] = useState<CategoryRequest>({
    name: "",
    color: PRESET_COLORS[0],
  });

  useEffect(() => {
    if (existingCategory) {
      setForm({ name: existingCategory.name, color: existingCategory.color });
    }
  }, [existingCategory]);

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateCategory.mutateAsync({ id: Number(id), payload: form });
      } else {
        await createCategory.mutateAsync(form);
      }
      router.back();
    } catch {
      Alert.alert("Error", "An error occurred while saving the category.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Are you sure?",
      `"${existingCategory?.name}" category be deleted?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory.mutateAsync(Number(id));
              router.back();
            } catch {
              Alert.alert("Error", "This category could not be deleted.");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 gap-4"
    >
      <Text className="text-xl font-bold">
        {isEditMode ? "Edit Category" : "Add New Category"}
      </Text>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="e.g., Family, Friends, Work"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Color</Text>
        <View className="flex-row flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setForm({ ...form, color })}
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {form.color === color && (
                <Text className="text-white font-bold">✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        className="bg-orange-500 rounded-lg py-3 items-center mt-2"
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Save</Text>
        )}
      </TouchableOpacity>

      {isEditMode && (
        <TouchableOpacity
          className="border border-red-500 rounded-lg py-3 items-center"
          onPress={handleDelete}
        >
          <Text className="text-red-500 font-semibold">Delete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
