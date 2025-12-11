// src/screens/FocusScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyIcon from "../components/FlowlyIcon";
import FlowlyButton from "../components/FlowlyButton";
import { FlowlyColors } from "../theme/colors";

import { getTodayMinutes } from "../storage/studyStorage";
import {
  startPomodoro,
  stopPomodoro,
  getPomodoroState,
} from "../storage/pomodoroStorage";

import {
  getStudySubjects,
  type StudySubject,
} from "../storage/studySubjectStorage";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type FocusNav = NativeStackNavigationProp<RootStackParamList, "Focus">;

type FocusScreenProps = {
  navigation: FocusNav;
};

const DURATION_PRESETS = [15, 25, 50, 60]; // minutos

export default function FocusScreen({ navigation }: FocusScreenProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [minutesToday, setMinutesToday] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);

  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  async function refreshMinutes() {
    const m = await getTodayMinutes();
    setMinutesToday(m);
  }

  async function loadInitialState() {
    try {
      const [today, pomodoro, storedSubjects] = await Promise.all([
        getTodayMinutes(),
        getPomodoroState(),
        getStudySubjects(),
      ]);

      setMinutesToday(today);
      setSubjects(storedSubjects ?? []);

      if ((storedSubjects ?? []).length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(storedSubjects[0].id);
      }

      // Se tinha um pomodoro em andamento, retoma a contagem
      if (pomodoro.isRunning && pomodoro.startedAt) {
        const now = Date.now();
        const diffMs = now - pomodoro.startedAt;
        const elapsedSec = Math.floor(diffMs / 1000);
        const totalSec = (pomodoro.durationMinutes || 25) * 60;
        const remaining = totalSec - elapsedSec;

        if (remaining <= 0) {
          // já acabou, força finalização
          await stopPomodoro();
          await refreshMinutes();
          setIsRunning(false);
          setSelectedDuration(pomodoro.durationMinutes || 25);
          setRemainingSeconds((pomodoro.durationMinutes || 25) * 60);
        } else {
          setIsRunning(true);
          setSelectedDuration(pomodoro.durationMinutes || 25);
          setRemainingSeconds(remaining);
          if (pomodoro.subjectId) {
            setSelectedSubjectId(pomodoro.subjectId);
          }
        }
      } else {
        // nada rodando → usa default
        setIsRunning(false);
        setSelectedDuration(pomodoro.durationMinutes || 25);
        setRemainingSeconds((pomodoro.durationMinutes || 25) * 60);
      }
    } catch (err) {
      console.log("[FocusScreen] erro ao carregar estado inicial:", err);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadInitialState);
    loadInitialState();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [navigation]);

  // sempre que mudar a duração e não estiver rodando, reseta o tempo
  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning]);

  // efeito do timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopPomodoro()
            .then(refreshMinutes)
            .catch((err) =>
              console.log("[FocusScreen] erro ao finalizar pomodoro:", err)
            );
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  async function handleStart() {
    try {
      await startPomodoro(selectedDuration, selectedSubjectId);
      setIsRunning(true);
      setRemainingSeconds(selectedDuration * 60);
    } catch (err) {
      console.log("[FocusScreen] erro ao iniciar pomodoro:", err);
    }
  }

  async function handleStop() {
    try {
      await stopPomodoro();
      setIsRunning(false);
      await refreshMinutes();
      setRemainingSeconds(selectedDuration * 60);
    } catch (err) {
      console.log("[FocusScreen] erro ao encerrar pomodoro:", err);
    }
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: FlowlyColors.background.creamLight },
      ]}
    >
      <ScreenContainer
        style={styles.screenContainer}
        backgroundColor="transparent"
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.85}
            >
              {/* GATO VOLTAR BEM MAIOR */}
              <FlowlyIcon name="voltar" size={100} />
            </TouchableOpacity>

            <Text style={styles.title}>Sessão de foco</Text>

            <View style={{ width: 44 }} />{/* espaçador para alinhar */}
          </View>

          {/* TIMER EM CARD PASTEL */}
          <View style={styles.timerCard}>
            <Text style={styles.timerValue}>{formattedTimer}</Text>
            <Text style={styles.timerLabel}>tempo restante</Text>
          </View>

          {/* PRESETS DE DURAÇÃO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duração da sessão</Text>
            <View style={styles.presetRow}>
              {DURATION_PRESETS.map((d) => {
                const selected = d === selectedDuration;
                const disabled = isRunning;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.presetChip,
                      selected && styles.presetChipSelected,
                      disabled && styles.presetChipDisabled,
                    ]}
                    onPress={() => {
                      if (!isRunning) setSelectedDuration(d);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        selected && styles.presetChipTextSelected,
                      ]}
                    >
                      {d === 60 ? "1h" : `${d} min`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* SELEÇÃO DE MATÉRIA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matéria desta sessão</Text>

            {subjects.length === 0 ? (
              <Text style={styles.emptySubjectsText}>
                Você ainda não criou matérias. Vá em "Criar matéria" na Home para
                adicionar suas matérias de estudo.
              </Text>
            ) : (
              <View style={styles.subjectChipsContainer}>
                {subjects.map((subj) => {
                  const selected = subj.id === selectedSubjectId;
                  return (
                    <TouchableOpacity
                      key={subj.id}
                      style={[
                        styles.subjectChip,
                        selected && styles.subjectChipSelected,
                      ]}
                      onPress={() => setSelectedSubjectId(subj.id)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.subjectChipText,
                          selected && styles.subjectChipTextSelected,
                        ]}
                      >
                        {subj.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* HOJE */}
          <View style={styles.todayCard}>
            <FlowlyIcon
              name="habito-estudo"
              size={100}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.todayLabel}>Minutos de hoje</Text>
            <Text style={styles.todayValue}>{minutesToday} min</Text>
          </View>

          {/* BOTÕES COM FLOWLYBUTTON GRADIENTE */}
          {isRunning ? (
            <FlowlyButton
              label="Encerrar foco"
              onPress={handleStop}
              variant="secondary"
              style={styles.focusButton}
            />
          ) : (
            <FlowlyButton
              label="Começar foco"
              onPress={handleStart}
              variant="primary"
              style={styles.focusButton}
            />
          )}
        </View>
      </ScreenContainer>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    borderRadius: 999,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },

  /* TIMER EM CARD */
  timerCard: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: FlowlyColors.background.soft,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  timerValue: {
    fontSize: 48,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },

  timerLabel: {
    marginTop: 6,
    fontSize: 14,
    color: FlowlyColors.text.light,
  },

  /* SEÇÕES */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    marginBottom: 8,
  },

  /* PRESETS */
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: FlowlyColors.background.creamLight,
  },
  presetChipSelected: {
    backgroundColor: FlowlyColors.primary.main,
  },
  presetChipDisabled: {
    opacity: 0.6,
  },
  presetChipText: {
    fontSize: 13,
    color: FlowlyColors.text.primary,
  },
  presetChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* MATÉRIAS */
  subjectChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: FlowlyColors.background.creamLight,
  },
  subjectChipSelected: {
    backgroundColor: FlowlyColors.primary.main,
  },
  subjectChipText: {
    fontSize: 13,
    color: FlowlyColors.text.primary,
  },
  subjectChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptySubjectsText: {
    fontSize: 13,
    color: FlowlyColors.text.light,
  },

  /* HOJE */
  todayCard: {
    backgroundColor: FlowlyColors.background.creamLight,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 24,
  },

  todayLabel: {
    fontSize: 14,
    color: FlowlyColors.text.primary,
  },

  todayValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },

  /* BOTÃO DE FOCO (FLOWLYBUTTON) */
  focusButton: {
    marginTop: 4,
  },
});
