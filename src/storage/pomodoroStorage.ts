// src/storage/pomodoroStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addTodayMinutes } from "./studyStorage";
import { updateSubjectMinutes } from "./studySubjectStorage";
import { addStudyHistory } from "./weeklyStudyStorage";

const POMODORO_KEY = "@flowly_pomodoro_state_v1";

export type PomodoroState = {
  isRunning: boolean;
  startedAt: number | null; // timestamp em ms
  durationMinutes: number; // duração planejada (ex: 25)
  subjectId: string | null; // matéria associada (opcional)
};

// -------------------------------------------
// SALVAR ESTADO
// -------------------------------------------
async function saveState(state: PomodoroState) {
  await AsyncStorage.setItem(POMODORO_KEY, JSON.stringify(state));
}

// -------------------------------------------
// LER ESTADO
// -------------------------------------------
export async function getPomodoroState(): Promise<PomodoroState> {
  try {
    const raw = await AsyncStorage.getItem(POMODORO_KEY);
    if (!raw) {
      const empty: PomodoroState = {
        isRunning: false,
        startedAt: null,
        durationMinutes: 25,
        subjectId: null,
      };
      await saveState(empty);
      return empty;
    }

    const parsed = JSON.parse(raw);

    const state: PomodoroState = {
      isRunning: !!parsed.isRunning,
      startedAt:
        typeof parsed.startedAt === "number" ? parsed.startedAt : null,
      durationMinutes:
        typeof parsed.durationMinutes === "number"
          ? parsed.durationMinutes
          : 25,
      subjectId:
        typeof parsed.subjectId === "string" ? parsed.subjectId : null,
    };

    return state;
  } catch (err) {
    console.log("Erro ao ler pomodoro:", err);
    return {
      isRunning: false,
      startedAt: null,
      durationMinutes: 25,
      subjectId: null,
    };
  }
}

// -------------------------------------------
// INICIAR POMODORO
// -------------------------------------------
export async function startPomodoro(
  durationMinutes: number = 25,
  subjectId: string | null = null
) {
  try {
    const newState: PomodoroState = {
      isRunning: true,
      startedAt: Date.now(),
      durationMinutes,
      subjectId,
    };

    await saveState(newState);
  } catch (err) {
    console.log("Erro ao iniciar Pomodoro:", err);
  }
}

// -------------------------------------------
// FINALIZAR POMODORO → soma minutos ao dia,
// atualiza matéria e histórico semanal
// -------------------------------------------
export async function stopPomodoro() {
  try {
    const state = await getPomodoroState();

    if (!state.isRunning || !state.startedAt) {
      return;
    }

    const now = Date.now();
    const diffMs = now - state.startedAt;
    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    // nunca negativo, nunca mais que a duração planejada
    const validMinutes = Math.min(
      Math.max(diffMinutes, 0),
      state.durationMinutes || 25
    );

    if (validMinutes > 0) {
      // minutos totais do dia
      await addTodayMinutes(validMinutes);

      // atualiza total da matéria, se tiver
      if (state.subjectId) {
        await updateSubjectMinutes(state.subjectId, validMinutes);

        // registra no histórico semanal
        await addStudyHistory(state.subjectId, validMinutes);
      }
    }

    const newState: PomodoroState = {
      isRunning: false,
      startedAt: null,
      durationMinutes: state.durationMinutes || 25,
      subjectId: null,
    };

    await saveState(newState);
  } catch (err) {
    console.log("Erro ao finalizar Pomodoro:", err);
  }
}

// -------------------------------------------
// RESET (pra debug se precisar)
// -------------------------------------------
export async function resetPomodoro() {
  await saveState({
    isRunning: false,
    startedAt: null,
    durationMinutes: 25,
    subjectId: null,
  });
}
