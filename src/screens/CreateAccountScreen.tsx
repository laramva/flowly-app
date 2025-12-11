// src/screens/CreateAccountScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyTextInput from "../components/FlowlyTextInput";
import FlowlyButton from "../components/FlowlyButton";
import FlowlyIcon from "../components/FlowlyIcon";
import { FlowlyColors } from "../theme/colors";

import { saveUser } from "../storage/authStorage";
import { saveTodayMinutes } from "../storage/studyStorage";
import { resetPomodoro } from "../storage/pomodoroStorage";
import { resetStudySubjects } from "../storage/studySubjectStorage";
import { resetWeeklyStudyData } from "../storage/weeklyStudyStorage";


export default function CreateAccountScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleCreateAccount() {
    try {
      setError("");

      if (!name.trim()) {
        setError("Me conta seu nome.");
        return;
      }

      if (!email.trim()) {
        setError("Digite um e-mail válido.");
        return;
      }

      if (!password || password.length < 4) {
        setError("Crie uma senha com pelo menos 4 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      await saveUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // reset total de dados de estudo para a nova conta
      await saveTodayMinutes(0);
      await resetPomodoro();
      await resetStudySubjects();
      await resetWeeklyStudyData();

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      setError("Algo deu errado ao criar sua conta. Tente novamente.");
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wrapper}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Só precisamos de alguns dados para montar seu cantinho Flowly.
            </Text>

            <View style={styles.iconWrapper}>
              <FlowlyIcon name="habito-energia" size={140} />
            </View>

            <View style={styles.form}>
              <FlowlyTextInput
                label="Nome"
                value={name}
                onChangeText={setName}
                placeholder="Como posso te chamar?"
                inputRef={nameRef}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <FlowlyTextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                inputRef={emailRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <FlowlyTextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Crie uma senha"
                secureTextEntry
                inputRef={passwordRef}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />

              <FlowlyTextInput
                label="Confirmar senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repita a senha"
                secureTextEntry
                inputRef={confirmRef}
                returnKeyType="done"
                onSubmitEditing={handleCreateAccount}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <FlowlyButton
                label="Criar conta"
                onPress={handleCreateAccount}
                style={{ marginTop: 8 }}
              />

              <FlowlyButton
                label="Já tenho uma conta"
                variant="ghost"
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 4 }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  wrapper: {
    width: "100%",
  },
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 26,
    color: FlowlyColors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Lexend-Regular",
    fontSize: 14,
    color: FlowlyColors.text.light,
    marginBottom: 16,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  form: {
    width: "100%",
  },
  error: {
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "Lexend-Regular",
    fontSize: 13,
    color: FlowlyColors.feedback.error,
  },
});
