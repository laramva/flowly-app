// src/components/CardBase.tsx
import React, { ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { FlowlyColors } from "../theme/colors";

type CardBaseProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CardBase({ children, onPress, style }: CardBaseProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    // antes: FlowlyColors.neutrals.cream (não existe no tema)
    backgroundColor: FlowlyColors.cardLight,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(192,164,255,0.25)",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
  },
});
