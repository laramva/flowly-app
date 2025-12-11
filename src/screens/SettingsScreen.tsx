// src/screens/SettingsScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { FlowlyColors } from "../theme/colors";

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          Aqui vão ficar ajustes de notificações, tema, conta, etc.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: FlowlyColors.text.primary,

  },
});
