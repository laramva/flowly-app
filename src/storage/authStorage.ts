// src/storage/authStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@flowly:user_v1";

export type FlowlyUser = {
  name: string;
  email: string;
  password: string;
};

// SALVA / ATUALIZA O USUÁRIO
export async function saveUser(user: FlowlyUser): Promise<void> {
  try {
    const normalized: FlowlyUser = {
      name: user.name?.trim() ?? "",
      email: user.email?.trim().toLowerCase() ?? "",
      password: user.password,
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(normalized));
    console.log("[authStorage] saveUser:", normalized.email);
  } catch (err) {
    console.warn("[authStorage] saveUser error", err);
    throw err;
  }
}

// BUSCA O USUÁRIO SALVO (OU null SE NÃO TIVER)
export async function getUser(): Promise<FlowlyUser | null> {
  try {
    const stored = await AsyncStorage.getItem(USER_KEY);

    if (!stored) {
      console.log("[authStorage] getUser: nenhum usuário salvo");
      return null;
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.email || !parsed.password) return null;

    const user: FlowlyUser = {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: String(parsed.email).trim().toLowerCase(),
      password: String(parsed.password),
    };

    console.log("[authStorage] getUser:", user.email);
    return user;
  } catch (err) {
    console.warn("[authStorage] getUser error", err);
    return null;
  }
}

// LIMPA USUÁRIO (USADO SÓ NO LOGOUT)
export async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log("[authStorage] clearUser");
  } catch (err) {
    console.warn("[authStorage] clearUser error", err);
  }
}
