// src/components/StudySubjectRow.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { StudySubject } from "../storage/studySubjectStorage";
import { FlowlyColors } from "../theme/colors";
import FlowlyButton from "./FlowlyButton";
import FlowlyIcon, { FlowlyIconName } from "./FlowlyIcon";
import { CardBase } from "./CardBase";

type Props = {
  subject: StudySubject;
  style?: ViewStyle;
  onPressStudy?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
};

function getIconForCategory(category: StudySubject["category"]): FlowlyIconName {
  switch (category) {
    case "faculdade":
      return "flowly-livro";
    case "escola":
      return "flowly-laptop";
    case "outros":
    default:
      return "flowly-neutral";
  }
}

function formatCategory(category: StudySubject["category"]): string {
  switch (category) {
    case "faculdade":
      return "Faculdade";
    case "escola":
      return "Escola";
    case "outros":
    default:
      return "Outros";
  }
}

export function StudySubjectRow({
  subject,
  style,
  onPressStudy,
  onPressEdit,
  onPressDelete,
}: Props) {
  return (
    <CardBase style={[styles.card, style]}>
      <View style={styles.left}>
        <FlowlyIcon name={getIconForCategory(subject.category)} size={40} />

        <View style={styles.textBox}>
          <Text style={styles.name} numberOfLines={1}>
            {subject.name}
          </Text>
          <Text style={styles.category}>{formatCategory(subject.category)}</Text>
        </View>
      </View>

      <View style={styles.right}>
        {onPressEdit && (
          <TouchableOpacity
            onPress={onPressEdit}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <FlowlyIcon name="lapis" size={22} />
          </TouchableOpacity>
        )}

        {onPressDelete && (
          <TouchableOpacity
            onPress={onPressDelete}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <FlowlyIcon name="lixeira" size={22} />
          </TouchableOpacity>
        )}

        {onPressStudy && (
          <View style={styles.studyButtonWrapper}>
            <FlowlyButton compact label="Estudar" onPress={onPressStudy} />
          </View>
        )}
      </View>
    </CardBase>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textBox: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.dark,
  },
  category: {
    marginTop: 2,
    fontSize: 13,
    color: FlowlyColors.text.dark,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  studyButtonWrapper: {
    marginLeft: 8,
  },
});
