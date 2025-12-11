// src/components/ScreenContainer.tsx
import React from "react";
import { View, StyleSheet, SafeAreaView, ViewStyle } from "react-native";
import { FlowlyColors } from "../theme/colors";

type ScreenContainerProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
};

export function ScreenContainer({
  children,
  backgroundColor,
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      style={[
        styles.safe,
        backgroundColor ? { backgroundColor } : null,
      ]}
    >
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: FlowlyColors.background.main, // padrão branco
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default ScreenContainer;
