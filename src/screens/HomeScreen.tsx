// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyButton from "../components/FlowlyButton";
import FlowlyIcon from "../components/FlowlyIcon";
import StudyMinutesDonut from "../components/StudyMinutesDonut";

import { FlowlyColors } from "../theme/colors";
import { getUser, type FlowlyUser } from "../storage/authStorage";
import { getTodayMinutes } from "../storage/studyStorage";
import type { RootStackParamList } from "../navigation/types";

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeNavigation;
};

// ----------------------------------------------------
// RESPONSIVIDADE
// ----------------------------------------------------
const { width } = Dimensions.get("window");

// escala baseada em iPhone 12 (390 de largura)
const scale = width / 390;
const rs = (size: number) => Math.round(size * scale);

// tamanhos de ícone responsivos
const iconXL = Math.round(width * 0.32); // card gentileza
const iconL = Math.round(width * 0.26); // ícone "Hoje" e "Começar foco"
const iconM = Math.round(width * 0.22); // meta diária
const iconS = Math.round(width * 0.20); // ícone criar matéria

// espaçamentos responsivos
const responsivePadding = Math.max(14, width * 0.045);
const cardMarginTop = Math.max(16, width * 0.04);
const headerMarginBottom = Math.max(14, width * 0.035);

const DAILY_GOAL_MINUTES = 60;

export default function HomeScreen({ navigation }: Props) {
  const [user, setUser] = useState<FlowlyUser | null>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);

  const firstName = user?.name?.trim().split(" ")[0] || "você";

  const progress =
    DAILY_GOAL_MINUTES > 0
      ? Math.min(1, todayMinutes / DAILY_GOAL_MINUTES)
      : 0;

  // ----------------------------------------------------
  // ANIMAÇÃO DO ÍCONE "SPLASH" (CARD GENTILEZA)
  // ----------------------------------------------------
  const splashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(splashAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(splashAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [splashAnim]);

  const splashTranslateY = splashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // sobe e desce 10px
  });

  const splashScale = splashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04], // pulsação bem suave
  });

  // ----------------------------------------------------
  // LOAD USER + MINUTOS
  // ----------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const u = await getUser();
        if (!isMounted) return;

        setUser(u ?? null);

        const minutes = await getTodayMinutes();
        if (!isMounted) return;

        setTodayMinutes(minutes);
      } catch (err) {
        console.log("[HomeScreen] erro ao carregar dados", err);
      }
    };

    const unsub = navigation.addListener("focus", load);
    load();

    return () => {
      isMounted = false;
      unsub();
    };
  }, [navigation]);

  // ----------------------------------------------------
  // ACTIONS
  // ----------------------------------------------------
  const handleStartFocus = () => {
    navigation.navigate("Focus");
  };

  const handleGoProfile = () => {
    navigation.navigate("Profile");
  };

  const handleGoCreateHabit = () => {
    navigation.navigate("CreateHabit");
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <View
      style={[
        styles.gradient,
        { backgroundColor: FlowlyColors.background.creamLight },
      ]}
    >
      <ScreenContainer
        style={styles.screenContainer}
        backgroundColor={FlowlyColors.background.creamLight}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Olá, {firstName}</Text>
              <Text style={styles.greetingSubtitle}>
                Acompanhe seus estudos com carinho.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleGoProfile}
              style={styles.profileIconWrapper}
              activeOpacity={0.8}
            >
              <FlowlyIcon name="perfil" size={Math.round(width * 0.16)} />
            </TouchableOpacity>
          </View>

          {/* CARD GENTILEZA - SPLASH EM CIMA, TEXTO EMBAIXO */}
          <View style={[styles.card, styles.quoteCard]}>
            <Animated.View
              style={[
                styles.quoteIconCentered,
                {
                  transform: [
                    { translateY: splashTranslateY },
                    { scale: splashScale },
                  ],
                },
              ]}
            >
              <FlowlyIcon name="splash" size={iconXL} />
            </Animated.View>

            <Text style={styles.quoteTextCentered}>
              Hoje vamos com gentileza. Marque o que conseguir, descanse quando
              precisar.
            </Text>

            <Text style={styles.quoteHighlightCentered}>
              O Flowly cuida do resto.
            </Text>
          </View>

          {/* CARD HOJE */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Hoje</Text>

              <FlowlyIcon name="habito-exercicio" size={iconL} />
            </View>

            <View style={styles.todayRow}>
              <StudyMinutesDonut
                todayMinutes={todayMinutes}
                goalMinutes={DAILY_GOAL_MINUTES}
              />

              <View style={styles.todayTextColumn}>
                <Text style={styles.todayMinutesText}>
                  Você já estudou{" "}
                  <Text style={styles.todayMinutesHighlight}>
                    {todayMinutes} min
                  </Text>{" "}
                  hoje.
                </Text>
                <Text style={styles.todayProgressText}>
                  {Math.round(progress * 100)}% da meta diária alcançada.
                </Text>
              </View>
            </View>
          </View>

          {/* CARD COMEÇAR FOCO */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Começar foco</Text>

              <FlowlyIcon name="habito-estudo" size={iconL} />
            </View>

            <Text style={styles.focusSubtitle}>
              Escolha uma matéria, sente confortável e comece um bloco de foco
              sem distrações.
            </Text>

            <FlowlyButton
              label="Começar foco"
              onPress={handleStartFocus}
              variant="primary"
              compact
              style={styles.primaryButton}
            />
          </View>

          {/* CARD META DIÁRIA */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Meta diária</Text>

              <FlowlyIcon name="progresso" size={iconM} />
            </View>

            <Text style={styles.goalMinutes}>{DAILY_GOAL_MINUTES} min</Text>
            <Text style={styles.goalHint}>
              Um objetivo gentil para você se aproximar todos os dias.
            </Text>

            <View style={styles.createRow}>
              <FlowlyIcon name="criar" size={iconS} />
              <Text style={styles.createText}>
                Comece criando uma matéria para organizar seus estudos.
              </Text>
            </View>

            <FlowlyButton
              label="Criar matéria"
              onPress={handleGoCreateHabit}
              variant="secondary"
              compact
              style={styles.secondaryButton}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

// ----------------------------------------------------
// ESTILOS
// ----------------------------------------------------
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    paddingHorizontal: Math.max(20, width * 0.06),
    paddingTop: Math.max(24, width * 0.06),
    paddingBottom: Math.max(32, width * 0.08),
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: headerMarginBottom,
  },
  greeting: {
    fontSize: rs(22),
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  greetingSubtitle: {
    marginTop: 4,
    fontSize: rs(14),
    color: FlowlyColors.text.soft,
  },

  // ícone de perfil grande no header
  profileIconWrapper: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: FlowlyColors.secondary.soft,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // ainda deixo esses aqui caso use de novo em outro lugar
  profileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: FlowlyColors.secondary.soft,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profileButtonLabel: {
    fontSize: rs(14),
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },

  // CARD BASE
  card: {
    marginTop: cardMarginTop,
    padding: responsivePadding,
    borderRadius: 24,
    backgroundColor: FlowlyColors.background.soft,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: rs(18),
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },

  // CARD GENTILEZA (VERTICAL)
  quoteCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Math.max(18, width * 0.04),
  },
  quoteIconCentered: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quoteTextCentered: {
    fontSize: rs(15),
    color: FlowlyColors.text.light,
    textAlign: "center",
    lineHeight: rs(22),
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  quoteHighlightCentered: {
    fontSize: rs(15),
    color: FlowlyColors.primary.main,
    fontWeight: "700",
    textAlign: "center",
    marginTop: -2,
  },

  // CARD HOJE
  todayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayTextColumn: {
    flex: 1,
    marginLeft: 18,
  },
  todayMinutesText: {
    fontSize: rs(14),
    color: FlowlyColors.text.light,
    marginBottom: 4,
  },
  todayMinutesHighlight: {
    fontWeight: "700",
    color: FlowlyColors.primary.main,
  },
  todayProgressText: {
    fontSize: rs(13),
    color: FlowlyColors.text.soft,
  },

  // CARD FOCUS
  focusSubtitle: {
    fontSize: rs(14),
    color: FlowlyColors.text.soft,
    marginBottom: 14,
  },
  primaryButton: {
    alignSelf: "flex-start",
    marginTop: 4,
  },

  // CARD META DIÁRIA
  goalMinutes: {
    fontSize: rs(24),
    fontWeight: "700",
    color: FlowlyColors.primary.main,
    marginBottom: 4,
  },
  goalHint: {
    fontSize: rs(13),
    color: FlowlyColors.text.soft,
    marginBottom: 12,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  createText: {
    flex: 1,
    marginLeft: 10,
    fontSize: rs(14),
    color: FlowlyColors.text.primary,
  },
  secondaryButton: {
    alignSelf: "flex-start",
  },
});
