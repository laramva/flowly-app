// src/storage/habitsStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "@flowly:habits";
const TODAY_SUMMARY_KEY = "@flowly:today_summary";

export type Habit = {
  id: string;
  name: string; // agora tratado como "matéria" na UI
  category: string;
};

export const DEFAULT_HABITS: Habit[] = [
  { id: "1", name: "Matemática", category: "estudo" },
  { id: "2", name: "Português", category: "estudo" },
  { id: "3", name: "História", category: "estudo" },
  { id: "4", name: "Inglês", category: "estudo" },
];

export async function getHabits(): Promise<Habit[]> {
  const data = await AsyncStorage.getItem(HABITS_KEY);
  if (!data) {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_HABITS));
    return DEFAULT_HABITS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_HABITS;
  }
}

export async function createHabit(habit: Omit<Habit, "id">): Promise<Habit> {
  const current = await getHabits();
  const newHabit: Habit = {
    ...habit,
    id: String(Date.now()),
  };
  const updated = [...current, newHabit];
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
  return newHabit;
}

export async function updateHabit(
  id: string,
  patch: Partial<Pick<Habit, "name" | "category">>
): Promise<void> {
  const current = await getHabits();
  const updated = current.map((h) =>
    h.id === id ? { ...h, ...patch } : h
  );
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
}

export async function deleteHabit(id: string): Promise<void> {
  const current = await getHabits();
  const updated = current.filter((h) => h.id !== id);
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
}

export async function resetHabitsStorage(): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_HABITS));
  await AsyncStorage.removeItem(TODAY_SUMMARY_KEY);
}

export async function getTodayHabitsSummary() {
  const data = await AsyncStorage.getItem(TODAY_SUMMARY_KEY);
  if (!data) {
    const summary = {
      habits: DEFAULT_HABITS,
      completedIds: [] as string[],
    };
    await AsyncStorage.setItem(TODAY_SUMMARY_KEY, JSON.stringify(summary));
    return summary;
  }
  return JSON.parse(data);
}

export async function toggleHabitToday(habitId: string) {
  const summary = await getTodayHabitsSummary();
  const isDone = summary.completedIds.includes(habitId);

  const updated = {
    ...summary,
    completedIds: isDone
      ? summary.completedIds.filter((id: string) => id !== habitId)
      : [...summary.completedIds, habitId],
  };

  await AsyncStorage.setItem(TODAY_SUMMARY_KEY, JSON.stringify(updated));
}
