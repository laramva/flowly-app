// src/components/FlowlyDialog.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FlowlyColors } from "../theme/colors";
import FlowlyIcon from "./FlowlyIcon";

export type FlowlyDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
  /** opcional: mostrar um ícone fofinho acima do texto */
  iconName?: string;
};

const FlowlyDialog: React.FC<FlowlyDialogProps> = ({
  visible,
  title,
  description,
  primaryLabel = "OK",
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
  iconName,
}) => {
  if (!visible) return null;

  const handlePrimary = () => {
    onPrimary?.();
    onClose?.();
  };

  const handleSecondary = () => {
    onSecondary?.();
    onClose?.();
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        {iconName ? (
          <View style={styles.iconWrapper}>
            <FlowlyIcon name={iconName as any} size={80} />
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        <View style={styles.buttonsRow}>
          {secondaryLabel ? (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSecondary}
            >
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrimary}
          >
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FlowlyDialog;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: FlowlyColors.background.main,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: FlowlyColors.text.light,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: FlowlyColors.primary.main,
    marginLeft: 8,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: FlowlyColors.text.white,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: FlowlyColors.background.soft,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },
});
