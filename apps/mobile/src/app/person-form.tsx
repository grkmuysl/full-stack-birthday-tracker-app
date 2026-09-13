import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCategories } from "@/features/categories/useCategories";
import { usePerson } from "@/features/contacts/usePerson";
import {
  useCreatePerson,
  useUpdatePerson,
  useDeletePerson,
} from "@/features/contacts/useContactMutations";
import { PersonRequest } from "@/api/types";

const emptyForm: PersonRequest = {
  fullName: "",
  birthDate: "",
  birthYearKnown: true,
  categoryId: null,
  note: "",
};

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;
  const router = useRouter();

  const { data: categories } = useCategories();
  const { data: existingPerson } = usePerson(isEditMode ? Number(id) : 0);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const [form, setForm] = useState<PersonRequest>(emptyForm);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (existingPerson) {
      setForm({
        fullName: existingPerson.fullName,
        birthDate: existingPerson.birthDate,
        birthYearKnown: existingPerson.birthYearKnown,
        categoryId: existingPerson.category?.id ?? null,
        note: existingPerson.note ?? "",
      });
    }
  }, [existingPerson]);

  const isSubmitting = createPerson.isPending || updatePerson.isPending;

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updatePerson.mutateAsync({ id: Number(id), payload: form });
      } else {
        await createPerson.mutateAsync(form);
      }
      router.back();
    } catch {
      Alert.alert(
        "Error",
        "An error occurred while saving the person. Please try again.",
      );
    }
  };

  const handleDelete = () => {
    Alert.alert("Are you sure?", `${existingPerson?.fullName} be deleted?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePerson.mutateAsync(Number(id));
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 gap-4"
    >
      <Text className="text-xl font-bold">
        {isEditMode ? "Edit Person" : "Add New Person"}
      </Text>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Full Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          value={form.fullName}
          onChangeText={(text) => setForm({ ...form, fullName: text })}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Birth Date</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg px-4 py-3"
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{form.birthDate || "Select Date"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.birthDate ? new Date(form.birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={(_event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const iso = selectedDate.toISOString().split("T")[0];
                setForm({ ...form, birthDate: iso });
              }
            }}
          />
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-gray-600">I know the birth year</Text>
        <Switch
          value={form.birthYearKnown}
          onValueChange={(value) => setForm({ ...form, birthYearKnown: value })}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Category</Text>
        <View className="flex-row flex-wrap gap-2">
          {categories?.map((cat) => {
            const isSelected = form.categoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setForm({ ...form, categoryId: cat.id })}
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={
                    isSelected ? "text-white font-medium" : "text-gray-700"
                  }
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-gray-600">Notes</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.note ?? ""}
          onChangeText={(text) => setForm({ ...form, note: text })}
        />
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
