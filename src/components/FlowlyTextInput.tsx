// src/components/FlowlyTextInput.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { FlowlyColors } from "../theme/colors";

// Props base: tudo que um TextInput normal aceita + nossas coisinhas
export type FlowlyTextInputProps = TextInputProps & {
  label?: string;
  inputStyle?: any;
  inputRef?: React.RefObject<TextInput | null>;
};

export default function FlowlyTextInput({
  label,
  inputStyle,
  inputRef,
  ...rest
}: FlowlyTextInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        placeholderTextColor={FlowlyColors.text.light}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: FlowlyColors.text.dark,
    marginBottom: 6,
    fontFamily: "Lexend-Regular",
  },
  input: {
    backgroundColor: FlowlyColors.background.cream,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 15,
    color: FlowlyColors.text.dark,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
