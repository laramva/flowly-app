// src/screens/LoginScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyTextInput from "../components/FlowlyTextInput";
import FlowlyButton from "../components/FlowlyButton";

import { getUser } from "../storage/authStorage";
import { FlowlyColors } from "../theme/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type LoginNav = NativeStackNavigationProp<RootStackParamList, "Login">;

const LAST_LOGIN_KEY = "@flowly:last_login_v1";

type Props = {
  navigation: LoginNav;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Carrega último login salvo (pra já preencher email/senha)
  useEffect(() => {
    async function loadLastLogin() {
      try {
        const stored = await AsyncStorage.getItem(LAST_LOGIN_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored);
        if (parsed?.email) setEmail(String(parsed.email));
        if (parsed?.password) setPassword(String(parsed.password));
      } catch (err) {
        console.log("[Login] erro ao carregar LAST_LOGIN", err);
      }
    }

    loadLastLogin();
  }, []);

  async function handleLogin() {
    try {
      setError("");

      const user = await getUser();
      console.log("[Login] user do storage:", user?.email);

      if (!user) {
        setError("Nenhuma conta encontrada. Crie sua conta para começar.");
        return;
      }

      const trimmedEmail = email.trim().toLowerCase();

      if (
        trimmedEmail !== user.email.toLowerCase() ||
        password !== user.password
      ) {
        setError("E-mail ou senha incorretos.");
        return;
      }

      // salva último login pra facilitar da próxima vez
      await AsyncStorage.setItem(
        LAST_LOGIN_KEY,
        JSON.stringify({ email: trimmedEmail, password })
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.log("[Login] erro geral:", e);
      setError("Algo deu errado ao entrar. Tente novamente.");
    }
  }

  return (
    <LinearGradient
      colors={["#F5F5DC", "#FFC0CB", "#DDA0DD"]}
      style={styles.gradient}
    >
      <ScreenContainer backgroundColor="transparent">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.center}>
            <Image
              source={require("../../assets/mascote/flowly-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Bem-vinda ao Flowly</Text>
            <Text style={styles.subtitle}>
              Seu painel gentil para trackear seus estudos.
            </Text>

            <View style={styles.form}>
              <FlowlyTextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                inputStyle={styles.input}
              />

              <FlowlyTextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
                inputStyle={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <FlowlyButton
                label="Entrar"
                onPress={handleLogin}
                variant="primary"
                style={styles.primaryButton}
                labelStyle={styles.primaryButtonLabel}
              />

              <FlowlyButton
                label="Criar conta"
                onPress={() => navigation.navigate("CreateAccount")}
                variant="secondary"
                style={styles.secondaryButton}
                labelStyle={styles.secondaryButtonLabel}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 180,
    height: 150,
    marginBottom: 20,
  },

  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    color: FlowlyColors.text.dark,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: "Lexend-Regular",
    fontSize: 14,
    color: FlowlyColors.text.light,
    textAlign: "center",
    marginBottom: 24,
  },

  form: {
    width: "100%",
    marginTop: 4,
  },

  input: {
    backgroundColor: "rgba(249, 235, 201, 1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8E2C8",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  error: {
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "Lexend-Regular",
    fontSize: 13,
    color: FlowlyColors.feedback.error,
  },

  primaryButton: {
    marginTop: 16,
    borderRadius: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonLabel: {
    fontFamily: "Lexend-SemiBold",
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 10,
    borderRadius: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  secondaryButtonLabel: {
    fontFamily: "Lexend-SemiBold",
    fontSize: 15,
  },
});
