import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FlowlyColors } from "../theme/colors";

export type FlowlyButtonVariant = "primary" | "secondary" | "ghost" | "success";

export type FlowlyButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: FlowlyButtonVariant;
  gradient?: boolean;
  compact?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;

  // ADICIONADO:
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function FlowlyButton({
  label,
  onPress,
  variant = "primary",
  gradient = true,
  compact = false,
  disabled = false,
  style,
  labelStyle,

  leftIcon,
  rightIcon,
}: FlowlyButtonProps) {
  const isGradient = gradient && variant !== "ghost";

  const containerStyles = [
    styles.base,
    compact && styles.compact,
    !isGradient && styles.flatLayer,
    variant === "secondary" && styles.secondaryFlat,
    variant === "ghost" && styles.ghostFlat,
    variant === "success" && styles.successFlat,
    variant !== "ghost" && styles.shadowNeon,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === "secondary" && styles.textSecondary,
    variant === "ghost" && styles.textGhost,
    variant === "success" && styles.textSuccess,
    disabled && styles.textDisabled,
    labelStyle,
  ];

  const gradientColors =
    variant === "success"
      ? ["#D5FFE4", "#E8FFF4"]
      : variant === "secondary"
      ? ["#FFF2E5", "#F6CBDD"]
      : ["#F7B8D3", "#A9DDFF"];

  const Inner = (
    <View style={styles.innerRow}>
      {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
      <Text style={textStyles}>{label}</Text>
      {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={styles.touchable}
    >
      {isGradient ? (
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={containerStyles}
        >
          {Inner}
        </LinearGradient>
      ) : (
        <View style={containerStyles}>{Inner}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignSelf: "stretch",
  },
  base: {
    width: "100%",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },

  compact: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  flatLayer: {
    backgroundColor: FlowlyColors.primary.main,
  },
  secondaryFlat: {
    backgroundColor: FlowlyColors.secondary.soft,
  },
  ghostFlat: {
    backgroundColor: "transparent",
  },
  successFlat: {
    backgroundColor: "#D5FFE4",
  },
  shadowNeon: {
    shadowColor: "#C0A4FF",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  disabled: {
    opacity: 0.6,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    color: FlowlyColors.text.dark,
  },
  textSecondary: {
    color: FlowlyColors.primary.dark,
  },
  textGhost: {
    color: FlowlyColors.primary.main,
  },
  textSuccess: {
    color: FlowlyColors.primary.dark,
  },
  textDisabled: {
    color: FlowlyColors.text.light,
  },
});
