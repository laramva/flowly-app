// src/navigation/RootStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";

import HomeScreen from "../screens/HomeScreen";
import FocusScreen from "../screens/FocusScreen";
import HabitsScreen from "../screens/HabitsScreen";
import CreateHabitScreen from "../screens/CreateHabitScreen";

import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

import WeeklySummaryScreen from "../screens/WeeklySummaryScreen";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* AUTH FLOW */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />

      {/* APP FLOW */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Focus" component={FocusScreen} />
      <Stack.Screen name="Habits" component={HabitsScreen} />
      <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />

      {/* USER SETTINGS */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* WEEKLY PANEL */}
      <Stack.Screen name="WeeklySummary" component={WeeklySummaryScreen} />
    </Stack.Navigator>
  );
}
