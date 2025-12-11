// src/components/CategoryChipGroup.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { FlowlyColors } from "../theme/colors";
import { SubjectCategory } from "../storage/studySubjectStorage";

export type CategoryFilter = "todos" | SubjectCategory;

type CategoryChipGroupProps = {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  style?: ViewStyle;
};

const ITEMS: { value: CategoryFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "faculdade", label: "Faculdade" },
  { value: "escola", label: "Escola" },
  { value: "outros", label: "Outros" },
];

export function CategoryChipGroup({
  value,
  onChange,
  style,
}: CategoryChipGroupProps) {
  return (
    <View style={[styles.row, style]}>
      {ITEMS.map((item) => {
        const active = item.value === value;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item.value)}
            activeOpacity={0.85}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
   backgroundColor: FlowlyColors.secondary.soft,

    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: FlowlyColors.secondary.soft,
  },
  label: {
    fontSize: 14,
    color: FlowlyColors.text.dark
  },
  labelActive: {
    fontWeight: "700",
    color: FlowlyColors.primary.dark,
  },
});
