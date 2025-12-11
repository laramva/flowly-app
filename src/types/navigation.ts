// src/navigation/types.ts
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SubjectCategory } from "../storage/studySubjectStorage";

export type RootStackParamList = {
  // AUTH FLOW
  Splash: undefined;
  Login: undefined;
  CreateAccount: undefined;

  // APP FLOW
  Home: undefined;
  Habits: undefined; // ou "Subjects" se você renomear no navigator
  CreateHabit:
    | {
        // usamos "Habit" no nome da rota pra não quebrar nada
        preset?: {
          name?: string;
          category?: SubjectCategory;
        };
      }
    | undefined;
  Focus:
    | {
        subjectId?: string;
      }
    | undefined;

  // SETTINGS / PERFIL
  Settings: undefined;
  Profile: undefined;

  // PAINEL SEMANAL
  WeeklySummary: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
