// src/screens/WeeklySummaryScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyIcon from "../components/FlowlyIcon";
import FlowlyButton from "../components/FlowlyButton";
import { FlowlyColors } from "../theme/colors";

import {
  getLast7DaysSummary,
  type WeeklySubjectSummary,
} from "../storage/weeklyStudyStorage";
import {
  getStudySubjects,
  type StudySubject,
} from "../storage/studySubjectStorage";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type WeeklyNav = NativeStackNavigationProp<RootStackParamList, "WeeklySummary">;

type Props = {
  navigation: WeeklyNav;
};

type SubjectRow = {
  subjectId: string | null;
  name: string;
  minutes: number;
};

export default function WeeklySummaryScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [rangeLabel, setRangeLabel] = useState("Últimos 7 dias");
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [weekly, subjects] = await Promise.all([
          getLast7DaysSummary(),
          getStudySubjects(),
        ]);

        const subjectsMap = new Map<string, StudySubject>();
        subjects.forEach((s: StudySubject) => {
          subjectsMap.set(s.id, s);
        });

        const subjectRows: SubjectRow[] = weekly.subjects.map(
          (item: WeeklySubjectSummary) => {
            if (item.subjectId) {
              const subj = subjectsMap.get(item.subjectId);
              return {
                subjectId: item.subjectId,
                name: subj?.name ?? "Matéria desconhecida",
                minutes: item.minutes,
              };
            }

            return {
              subjectId: null,
              name: "Sem matéria específica",
              minutes: item.minutes,
            };
          }
        );

        subjectRows.sort((a, b) => b.minutes - a.minutes);

        const total = weekly.subjects.reduce(
          (sum, item) => sum + item.minutes,
          0
        );

        setRows(subjectRows);
        setTotalMinutes(total);
        setRangeLabel("Últimos 7 dias");

        Animated.timing(barAnim, {
  toValue: 1,
  duration: 900,
  useNativeDriver: false, // <-- muda só aqui
}).start();
      } catch (err) {
        console.log("[WeeklySummaryScreen] erro ao carregar:", err);
        setRows([]);
        setTotalMinutes(0);
        setRangeLabel("Últimos 7 dias");
      } finally {
        setLoading(false);
      }
    }

    const unsubscribe = navigation.addListener("focus", load);
    load();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [navigation, barAnim]);

  const maxMinutes = rows.length
    ? Math.max(...rows.map((r) => r.minutes), 10)
    : 10;

  return (
    <View style={styles.root}>
      <ScreenContainer style={styles.screenContainer} backgroundColor="transparent">
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FlowlyIcon name="voltar" size={100} />
            </TouchableOpacity>

            <View style={styles.headerTextWrapper}>
              <Text style={styles.title}>Painel da semana</Text>
              <Text style={styles.subtitle}>
                Veja quais matérias receberam mais carinho nos últimos dias.
              </Text>
            </View>

            <View style={{ width: 28 }} />
          </View>

          {/* CARD PRINCIPAL */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>Resumo geral</Text>
                <Text style={styles.cardRangeLabel}>{rangeLabel}</Text>
              </View>

              <FlowlyIcon name="dashboard" size={120} />
            </View>

            {loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator
                  size="small"
                  color={FlowlyColors.primary.main}
                />
                <Text style={styles.loadingText}>
                  Carregando sua semana...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryLabel}>Total estudado</Text>
                    <Text style={styles.summaryValue}>{totalMinutes} min</Text>
                  </View>

                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryLabel}>Matéria em destaque</Text>
                    <Text style={styles.summaryValueSmall}>
                      {rows[0]?.name ?? "Ainda sem dados"}
                    </Text>
                  </View>
                </View>

                {/* GRÁFICO DE BARRAS */}
                <View style={styles.chartWrapper}>
                  {rows.length === 0 ? (
                    <Text style={styles.emptyText}>
                      Ainda não há registros suficientes para montar o painel da
                      semana. Comece um foco para ver os dados aqui.
                    </Text>
                  ) : (
                    <View style={styles.chartBarsRow}>
                      {rows.map((row, index) => {
                        const heightPercent = row.minutes / maxMinutes;
                        const animatedHeight = barAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 120 * heightPercent],
                        });

                        return (
                          <View
                            key={row.subjectId ?? `none-${index}`}
                            style={styles.barColumn}
                          >
                            <Animated.View
                              style={[
                                styles.bar,
                                {
                                  height: animatedHeight,
                                },
                              ]}
                            >
                              <LinearGradient
                                colors={[
                                  FlowlyColors.primary.light,
                                  FlowlyColors.secondary.pink,
                                ]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0, y: 0 }}
                                style={styles.barGradient}
                              />
                            </Animated.View>

                            <Text style={styles.barMinutes}>
                              {row.minutes} min
                            </Text>
                            <Text style={styles.barLabel} numberOfLines={2}>
                              {row.name}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </>
            )}
          </View>

          {/* BOTÃO VOLTAR */}
          <View style={styles.footer}>
            <FlowlyButton
              label="Voltar para o perfil"
              variant="secondary"
              onPress={() => navigation.goBack()}
              compact
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: FlowlyColors.background.creamLight, // 👈 FUNDO CREME
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTextWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: FlowlyColors.text.soft,
    textAlign: "center",
  },

  // CARD BASE
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: FlowlyColors.background.soft,
    shadowColor: "#A5D8FF",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: -4, height: 10 },
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  cardRangeLabel: {
    marginTop: 2,
    fontSize: 12,
    color: FlowlyColors.text.soft,
  },

  // LOADING
  loadingWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: FlowlyColors.text.soft,
  },

  // RESUMO GERAL
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 18,
  },
  summaryStat: {
    flex: 1,
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: FlowlyColors.text.soft,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: FlowlyColors.primary.main,
  },
  summaryValueSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },

  // GRÁFICO
  chartWrapper: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: FlowlyColors.text.light,
    textAlign: "center",
    marginTop: 12,
  },
  chartBarsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginTop: 8,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  bar: {
    width: 26,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: FlowlyColors.secondary.soft,
    justifyContent: "flex-end",
  },
  barGradient: {
    width: "100%",
    height: "100%",
  },
  barMinutes: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "500",
    color: FlowlyColors.text.primary,
  },
  barLabel: {
    marginTop: 2,
    fontSize: 11,
    color: FlowlyColors.text.soft,
    textAlign: "center",
  },

  // FOOTER
  footer: {
    marginTop: 18,
  },
});
