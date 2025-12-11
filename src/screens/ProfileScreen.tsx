// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyIcon from "../components/FlowlyIcon";
import FlowlyButton from "../components/FlowlyButton";
import { FlowlyColors } from "../theme/colors";

import type { FlowlyUser } from "../storage/authStorage";
import { getUser } from "../storage/authStorage";
import { getTodayMinutes } from "../storage/studyStorage";
import type { StudySubject } from "../storage/studySubjectStorage";
import { getStudySubjects } from "../storage/studySubjectStorage";

type Props = {
  navigation: any;
};

const PROFILE_GRADIENT =
  FlowlyColors.gradient.home ?? FlowlyColors.gradient.main;

export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<FlowlyUser | null>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showWeeklyDetails, setShowWeeklyDetails] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await getUser();
        setUser(u ?? null);

        const minutes = await getTodayMinutes();
        setTodayMinutes(minutes);

        const storedSubjects = await getStudySubjects();
        setSubjects(storedSubjects ?? []);
      } catch (err) {
        console.log("[ProfileScreen] erro ao carregar dados:", err);
        setSubjects([]);
      }
    };

    const unsubscribe = navigation.addListener("focus", load);
    load();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [navigation]);

  const firstName = user?.name?.trim().split(" ")[0] || "estudante";
  const totalSubjects = subjects.length;
  const totalMinutesAllSubjects = subjects.reduce(
    (sum, subj) => sum + (subj.totalMinutes ?? 0),
    0
  );

  // para o painel / gráfico: só matérias com minutos > 0
  const subjectsWithMinutes = subjects.filter(
    (s) => (s.totalMinutes ?? 0) > 0
  );
  const maxSubjectMinutes = subjectsWithMinutes.reduce(
    (max, subj) => Math.max(max, subj.totalMinutes ?? 0),
    0
  );

  const handleGoHome = () => {
    navigation.navigate("Home");
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <LinearGradient
      colors={PROFILE_GRADIENT as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScreenContainer style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER PERFIL */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <FlowlyIcon name="perfil" size={96} />
            </View>

            <Text style={styles.nameText}>
              {user?.name || "Usuário Flowly"}
            </Text>
            <Text style={styles.emailText}>
              {user?.email || "email@flowly.app"}
            </Text>
          </View>

          {/* RESUMO DO DIA */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Resumo do dia</Text>
              <FlowlyIcon name="progresso" size={64} />
            </View>

            <Text style={styles.cardBodyText}>
              Hoje você estudou{" "}
              <Text style={styles.highlightText}>{todayMinutes} minutos</Text>.
            </Text>

            {todayMinutes === 0 && (
              <Text style={styles.secondaryText}>
                Ainda não registrou estudos hoje. Que tal começar um bloco de foco,{" "}
                {firstName}?
              </Text>
            )}
          </View>

          {/* RESUMO DE MATÉRIAS */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Suas matérias</Text>
              <FlowlyIcon name="habito-estudo" size={64} />
            </View>

            {totalSubjects === 0 ? (
              <Text style={styles.cardBodyText}>
                Você ainda não criou nenhuma matéria. Comece criando uma para
                organizar seus estudos.
              </Text>
            ) : (
              <>
                <Text style={styles.cardBodyText}>
                  Você tem{" "}
                  <Text style={styles.highlightText}>{totalSubjects} matérias</Text>{" "}
                  cadastradas e já acumulou{" "}
                  <Text style={styles.highlightText}>
                    {totalMinutesAllSubjects} minutos
                  </Text>{" "}
                  estudando ao longo do tempo.
                </Text>

                <View style={styles.subjectsList}>
                  {subjects.slice(0, 4).map((subj) => (
                    <View key={subj.id} style={styles.subjectRow}>
                      <FlowlyIcon name="criar" size={32} />
                      <View style={styles.subjectTextWrapper}>
                        <Text style={styles.subjectName}>{subj.name}</Text>
                        {subj.totalMinutes != null && (
                          <Text style={styles.subjectMinutes}>
                            {subj.totalMinutes} min estudados
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            <FlowlyButton
              label="Criar nova matéria"
              variant="secondary"
              onPress={() => navigation.navigate("CreateHabit")}
              style={styles.cardButton}
            />
          </View>

          {/* RESUMO DA SEMANA (PAINEL) */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Resumo da semana</Text>
              <FlowlyIcon name="habito-energia" size={64} />
            </View>

            {subjectsWithMinutes.length === 0 ? (
              <Text style={styles.cardBodyText}>
                Assim que você começar a estudar suas matérias, este painel vai mostrar
                quanto tempo foi dedicado a cada uma, com um toque neon pastel.
              </Text>
            ) : (
              <>
                <Text style={styles.cardBodyText}>
                  Aqui você vê um resumo do tempo dedicado às suas matérias.
                </Text>

                <View style={styles.weeklyMiniList}>
                  {subjectsWithMinutes.slice(0, 3).map((subj) => {
                    const minutes = subj.totalMinutes ?? 0;
                    return (
                      <View key={subj.id} style={styles.weeklyMiniRow}>
                        <Text style={styles.weeklyMiniName}>{subj.name}</Text>
                        <Text style={styles.weeklyMiniMinutes}>
                          {minutes} min
                        </Text>
                      </View>
                    );
                  })}
                  {subjectsWithMinutes.length > 3 && (
                    <Text style={styles.weeklyMiniMore}>
                      + {subjectsWithMinutes.length - 3} matérias com tempo registrado
                    </Text>
                  )}
                </View>

                <FlowlyButton
                  label="Ver painel detalhado"
                  variant="secondary"
                  onPress={() => navigation.navigate("WeeklySummary")}
                  style={styles.cardButton}
                />
              </>
            )}
          </View>

          {/* AÇÕES DE CONTA */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Conta</Text>
            </View>

            <Text style={styles.cardBodyText}>
              Se quiser voltar para a página inicial ou sair da conta, use as ações
              abaixo.
            </Text>

            <View style={styles.actionsRow}>
              <FlowlyButton
                label="Voltar para a Home"
                variant="secondary"
                onPress={handleGoHome}
                style={styles.smallButton}
              />

              <FlowlyButton
                label="Sair da conta"
                variant="ghost"
                onPress={() => setShowLogoutConfirm(true)}
                style={styles.smallButton}
                labelStyle={styles.logoutLabel}
              />
            </View>
          </View>
        </ScrollView>

        {/* POPUP DE CONFIRMAÇÃO DE SAÍDA */}
        {showLogoutConfirm && (
          <View style={styles.modalBackdrop}>
            <View style={styles.logoutConfirmCard}>
              <FlowlyIcon name="flowly-desanimado" size={80} />
              <Text style={styles.logoutTitle}>
                Tem certeza que deseja sair?
              </Text>
              <Text style={styles.logoutText}>
                Sua conta continua salva. Você poderá entrar novamente usando o
                mesmo e-mail e senha quando quiser.
              </Text>

              <View style={styles.logoutButtonsRow}>
                <TouchableOpacity
                  style={[styles.logoutButton, styles.logoutButtonSecondary]}
                  onPress={() => setShowLogoutConfirm(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.logoutButtonLabelCancel}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.logoutButton, styles.logoutButtonPrimary]}
                  onPress={handleConfirmLogout}
                  activeOpacity={0.85}
                >
                  <Text style={styles.logoutButtonLabelExit}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* PAINEL DETALHADO – "PÁGINA NOVA" EM OVERLAY COM GRÁFICOS PASTEL NEON */}
        {showWeeklyDetails && (
          <View style={styles.weeklyBackdrop}>
            <LinearGradient
              colors={FlowlyColors.gradient.main as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.weeklyCard}
            >
              <Text style={styles.weeklyTitle}>Resumo detalhado</Text>
              <Text style={styles.weeklySubtitle}>
                Tempo total estudado por matéria. Visual pastel neon para você enxergar
                suas prioridades com carinho.
              </Text>

              {subjectsWithMinutes.length === 0 ? (
                <Text style={styles.weeklyEmptyText}>
                  Ainda não há dados suficientes para montar o gráfico. Comece um bloco
                  de foco e volte aqui depois.
                </Text>
              ) : (
                <View style={styles.weeklyChart}>
                  {subjectsWithMinutes.map((subj) => {
                    const minutes = subj.totalMinutes ?? 0;
                    const widthPct =
                      maxSubjectMinutes > 0
                        ? (minutes / maxSubjectMinutes) * 100
                        : 0;

                    return (
                      <View key={subj.id} style={styles.weeklyBarRow}>
                        <Text style={styles.weeklyBarLabel} numberOfLines={1}>
                          {subj.name}
                        </Text>

                        <View style={styles.weeklyBarTrack}>
                          <LinearGradient
                            colors={["#A78BFA", "#F8B4D9", "#8EC5FC"]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={[styles.weeklyBarFill, { width: `${widthPct || 4}%` }]}
                          />
                        </View>

                        <Text style={styles.weeklyBarMinutes}>
                          {minutes} min
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              <FlowlyButton
                label="Fechar painel"
                variant="secondary"
                onPress={() => setShowWeeklyDetails(false)}
                style={styles.weeklyCloseButton}
              />
            </LinearGradient>
          </View>
        )}
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: FlowlyColors.background.soft,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  nameText: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  emailText: {
    marginTop: 4,
    fontSize: 14,
    color: FlowlyColors.text.soft,
  },

  // CARD BASE
  card: {
    marginBottom: 18,
    padding: 18,
    borderRadius: 24,
    backgroundColor: FlowlyColors.background.soft,
    shadowColor: "#A5D8FF",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: -6, height: 10 },
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  cardBodyText: {
    fontSize: 14,
    color: FlowlyColors.text.light,
  },
  secondaryText: {
    marginTop: 6,
    fontSize: 13,
    color: FlowlyColors.text.soft,
  },
  highlightText: {
    color: FlowlyColors.primary.main,
    fontWeight: "700",
  },

  // MATÉRIAS
  subjectsList: {
    marginTop: 10,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectTextWrapper: {
    marginLeft: 10,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },
  subjectMinutes: {
    fontSize: 12,
    color: FlowlyColors.text.soft,
  },

  cardButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },

  // MINI RESUMO DA SEMANA
  weeklyMiniList: {
    marginTop: 10,
  },
  weeklyMiniRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weeklyMiniName: {
    fontSize: 14,
    color: FlowlyColors.text.primary,
  },
  weeklyMiniMinutes: {
    fontSize: 14,
    fontWeight: "600",
    color: FlowlyColors.primary.main,
  },
  weeklyMiniMore: {
    marginTop: 4,
    fontSize: 12,
    color: FlowlyColors.text.soft,
  },

  // AÇÕES
  actionsRow: {
    marginTop: 12,
    gap: 10,
  },
  smallButton: {
    alignSelf: "stretch",
  },
  logoutLabel: {
    color: FlowlyColors.text.dark,
    fontWeight: "700",
  },

  // MODAL LOGOUT
  modalBackdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoutConfirmCard: {
    width: "100%",
    padding: 18,
    borderRadius: 24,
    backgroundColor: FlowlyColors.background.soft,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  logoutTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    textAlign: "center",
  },
  logoutText: {
    marginTop: 6,
    fontSize: 13,
    color: FlowlyColors.text.soft,
    textAlign: "center",
  },
  logoutButtonsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 8,
    alignSelf: "stretch",
  },
  logoutButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonSecondary: {
    backgroundColor: FlowlyColors.secondary.soft,
  },
  logoutButtonPrimary: {
    backgroundColor: FlowlyColors.primary.soft,
  },
  logoutButtonLabelCancel: {
    color: FlowlyColors.text.dark,
    fontWeight: "700",
  },
  logoutButtonLabelExit: {
    color: FlowlyColors.text.dark,
    fontWeight: "700",
  },

  // WEEKLY PANEL (OVERLAY)
  weeklyBackdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  weeklyCard: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: FlowlyColors.text.dark,
    textAlign: "center",
  },
  weeklySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: FlowlyColors.text.dark,
    textAlign: "center",
  },
  weeklyEmptyText: {
    marginTop: 12,
    fontSize: 13,
    color: FlowlyColors.text.dark,
    textAlign: "center",
  },
  weeklyChart: {
    marginTop: 16,
    marginBottom: 10,
  },
  weeklyBarRow: {
    marginBottom: 10,
  },
  weeklyBarLabel: {
    fontSize: 13,
    color: FlowlyColors.text.dark,
    marginBottom: 4,
  },
  weeklyBarTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  weeklyBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  weeklyBarMinutes: {
    marginTop: 2,
    fontSize: 12,
    color: FlowlyColors.text.dark,
  },
  weeklyCloseButton: {
    marginTop: 8,
    alignSelf: "stretch",
  },
});
