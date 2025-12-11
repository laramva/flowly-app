import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./authStorage";

export type WeeklySubjectSummary = {
  subjectId: string | null;
  minutes: number;
};

export type WeeklySummary = {
  subjects: WeeklySubjectSummary[];
  updatedAt: number; // timestamp da última atualização
};

// monta uma chave por usuário (usando o e-mail, já que não temos id)
function getWeeklyKey(userEmail: string) {
  return `@flowly_weekly_summary_${userEmail}`;
}

// ----------------------------------------------------
// SALVAR USO DE MINUTOS POR MATÉRIA (HISTÓRICO SEMANAL)
// ----------------------------------------------------
export async function addStudyHistory(
  subjectId: string | null,
  minutes: number
): Promise<void> {
  try {
    if (minutes <= 0) return;

    const user = await getUser();
    if (!user?.email) return;

    const key = getWeeklyKey(user.email);
    const raw = await AsyncStorage.getItem(key);

    let summary: WeeklySummary = raw
      ? JSON.parse(raw)
      : { subjects: [], updatedAt: Date.now() };

    // garante array tipado
    if (!Array.isArray(summary.subjects)) {
      summary.subjects = [];
    }

    // procurar entry da matéria
    const existing = summary.subjects.find(
      (s: WeeklySubjectSummary) => s.subjectId === subjectId
    );

    if (existing) {
      existing.minutes += minutes;
    } else {
      summary.subjects.push({
        subjectId,
        minutes,
      });
    }

    summary.updatedAt = Date.now();

    await AsyncStorage.setItem(key, JSON.stringify(summary));
  } catch (err) {
    console.log("[weeklyStudyStorage] erro em addStudyHistory:", err);
  }
}

// ----------------------------------------------------
// PEGAR RESUMO (USADO NA TELA DE PAINEL SEMANAL)
// ----------------------------------------------------
export async function getLast7DaysSummary(): Promise<WeeklySummary> {
  try {
    const user = await getUser();
    if (!user?.email) {
      return { subjects: [], updatedAt: Date.now() };
    }

    const key = getWeeklyKey(user.email);
    const raw = await AsyncStorage.getItem(key);

    if (!raw) {
      return { subjects: [], updatedAt: Date.now() };
    }

    const parsed = JSON.parse(raw);

    const summary: WeeklySummary = {
      subjects: Array.isArray(parsed.subjects)
        ? parsed.subjects.map((item: any) => ({
            subjectId:
              typeof item.subjectId === "string" ? item.subjectId : null,
            minutes:
              typeof item.minutes === "number" ? item.minutes : 0,
          }))
        : [],
      updatedAt:
        typeof parsed.updatedAt === "number"
          ? parsed.updatedAt
          : Date.now(),
    };

    return summary;
  } catch (err) {
    console.log("[weeklyStudyStorage] erro em getLast7DaysSummary:", err);
    return { subjects: [], updatedAt: Date.now() };
  }
}

// ----------------------------------------------------
// RESET GERAL (USADO AO CRIAR USUÁRIO NOVO)
// ----------------------------------------------------
export async function resetWeeklyStudyData(): Promise<void> {
  try {
    const user = await getUser();
    if (!user?.email) return;

    const key = getWeeklyKey(user.email);
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log("[weeklyStudyStorage] erro ao resetar weekly data:", err);
  }
}
