// src/screens/HabitsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import FlowlyIcon from "../components/FlowlyIcon";
import { FlowlyColors } from "../theme/colors";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

import { getHabits, Habit } from "../storage/habitsStorage";


type HabitsNav = NativeStackNavigationProp<RootStackParamList, "Habits">;

export default function HabitsScreen({ navigation }: { navigation: HabitsNav }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    async function load() {
      const h = await getHabits();
      setHabits(h);
    }
    load();
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Seus hábitos de estudo</Text>

        {habits.length === 0 ? (
          <Text style={styles.empty}>Nenhum hábito cadastrado ainda</Text>
        ) : (
          habits.map((h) => (
            <View key={h.id} style={styles.habitCard}>
              <FlowlyIcon name="habito-estudo" size={40} />
              <Text style={styles.habitName}>{h.name}</Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateHabit")}
        >
          <Text style={styles.buttonText}>Criar novo hábito</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: FlowlyColors.text.primary
,
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: FlowlyColors.text.primary,
    opacity: 0.7,
    marginBottom: 20,
  },
  habitCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#CBB5FF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "700",
    color: FlowlyColors.text.primary

  },
  button: {
    marginTop: 20,
    backgroundColor: FlowlyColors.primary.main,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
