// src/storage/studyStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@flowly_today_minutes_v1";

// -------------------------------------------
// OBTÉM MINUTOS DO DIA
// -------------------------------------------
export async function getTodayMinutes(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;

    const value = parseInt(raw, 10);
    return isNaN(value) ? 0 : value;
  } catch (err) {
    console.log("Erro ao ler minutos:", err);
    return 0;
  }
}

// -------------------------------------------
// SALVA MINUTOS DO DIA (SUBSTITUI)
// -------------------------------------------
export async function saveTodayMinutes(minutes: number): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, String(minutes));
  } catch (err) {
    console.log("Erro ao salvar minutos:", err);
  }
}

// -------------------------------------------
// SOMA MINUTOS AO TOTAL DO DIA
// -------------------------------------------
export async function addTodayMinutes(amount: number): Promise<void> {
  try {
    const current = await getTodayMinutes();
    const updated = current + amount;

    await saveTodayMinutes(updated);
  } catch (err) {
    console.log("Erro ao adicionar minutos:", err);
  }
}
