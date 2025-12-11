// src/components/StudyMinutesDonut.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Dimensions, Animated } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { FlowlyColors } from "../theme/colors";

type Props = {
  todayMinutes: number;
  goalMinutes: number;
};

const { width } = Dimensions.get("window");

// tamanho levemente responsivo, mas limitado para não explodir
const BASE_SIZE = 120;
const SIZE = Math.min(BASE_SIZE + (width - 360) * 0.05, 150);
const STROKE_WIDTH = 22;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// permite animar o círculo do SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function StudyMinutesDonut({ todayMinutes, goalMinutes }: Props) {
  const safeGoal = goalMinutes > 0 ? goalMinutes : 1;
  const rawProgress = todayMinutes / safeGoal;
  const progress = Math.max(0, Math.min(rawProgress, 1)); // clamp 0–1

  const progressAnim = useRef(new Animated.Value(0)).current;

  // quando o progresso mudar, anima do zero até o valor atual
  useEffect(() => {
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false, // 👈 IMPORTANTE: precisa ser false pra animar strokeDashoffset
    }).start();
  }, [progress, progressAnim]);

  const animatedStrokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0], // 0 = círculo completo, 1 = vazio
  });

  return (
    <View style={styles.container}>
      {/* Sombra externa (view) */}
      <View style={styles.shadowWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            {/* Gradiente do progresso (rosa / lilás) */}
            <LinearGradient
              id="donutGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FAD0C4" />
              <Stop offset="50%" stopColor="#F5C2E7" />
              <Stop offset="100%" stopColor="#CDB5FF" />
            </LinearGradient>
          </Defs>

          {/* Trilha de fundo */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={FlowlyColors.background.creamLight}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
          />

          {/* “Sombra” azul clara ligeiramente deslocada para a esquerda */}
          <Circle
            cx={SIZE / 2 - 3}
            cy={SIZE / 2 + 2}
            r={RADIUS}
            stroke="#A5D8FF"
            strokeWidth={STROKE_WIDTH + 4}
            strokeOpacity={0.18}
            strokeLinecap="round"
            fill="none"
          />

          {/* Progresso ANIMADO */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#donutGradient)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animatedStrokeDashoffset}
            rotation={-90}
            originX={SIZE / 2}
            originY={SIZE / 2}
          />
        </Svg>
      </View>

      {/* Texto central */}
      <View style={styles.centerContent}>
        <Text style={styles.minutesText}>{todayMinutes} min</Text>
        <Text style={styles.goalText}>de {goalMinutes} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE + 24,
    height: SIZE + 24,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowWrapper: {
    shadowColor: "#A5D8FF",
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: -10, height: 10 },
    elevation: 14,
    borderRadius: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  minutesText: {
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  goalText: {
    marginTop: 2,
    fontSize: 12,
    color: FlowlyColors.text.soft,
  },
});
