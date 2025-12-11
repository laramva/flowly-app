// src/storage/studySubjectStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SubjectCategory = "faculdade" | "escola" | "outros";

export type StudySubject = {
  id: string;
  name: string;
  category: SubjectCategory;
  totalMinutes?: number;
};

const STORAGE_KEY = "@flowly_study_subjects_v1";

/**
 * Lê todas as matérias salvas.
 */
export async function getStudySubjects(): Promise<StudySubject[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      category: (item.category ?? "outros") as SubjectCategory,
      totalMinutes:
        typeof item.totalMinutes === "number" ? item.totalMinutes : 0,
    }));
  } catch (err) {
    console.log("[studySubjectStorage] erro ao ler matérias:", err);
    return [];
  }
}

/**
 * Alias para manter compatibilidade com código antigo.
 */
export async function getAllSubjects(): Promise<StudySubject[]> {
  return getStudySubjects();
}

/**
 * Salva a lista completa de matérias.
 */
export async function saveStudySubjects(
  subjects: StudySubject[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.log("[studySubjectStorage] erro ao salvar matérias:", err);
  }
}

/**
 * Adiciona uma nova matéria (já pronta).
 */
export async function addStudySubject(subject: StudySubject): Promise<void> {
  try {
    const current = await getStudySubjects();
    const updated = [...current, subject];
    await saveStudySubjects(updated);
  } catch (err) {
    console.log("[studySubjectStorage] erro ao adicionar matéria:", err);
  }
}

/**
 * Cria uma matéria a partir de nome + categoria.
 */
export async function createSubject(
  name: string,
  category: SubjectCategory
): Promise<StudySubject> {
  const subject: StudySubject = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    category,
    totalMinutes: 0,
  };

  await addStudySubject(subject);
  return subject;
}

/**
 * Atualiza nome / categoria de uma matéria.
 */
export async function updateSubject(
  id: string,
  data: Partial<Pick<StudySubject, "name" | "category">>
): Promise<void> {
  try {
    const current = await getStudySubjects();

    const updated = current.map((s) =>
      s.id === id ? { ...s, ...data } : s
    );

    await saveStudySubjects(updated);
  } catch (err) {
    console.log("[studySubjectStorage] erro ao atualizar matéria:", err);
  }
}

/**
 * Remove matéria pelo id (nome novo).
 */
export async function deleteSubject(id: string): Promise<void> {
  await removeStudySubject(id);
}

/**
 * Remove matéria pelo id (nome antigo, mantido para compatibilidade).
 */
export async function removeStudySubject(id: string): Promise<void> {
  try {
    const current = await getStudySubjects();
    const updated = current.filter((s) => s.id !== id);
    await saveStudySubjects(updated);
  } catch (err) {
    console.log("[studySubjectStorage] erro ao remover matéria:", err);
  }
}

/**
 * Atualiza os minutos de estudo de uma matéria.
 */
export async function updateSubjectMinutes(
  id: string,
  minutesToAdd: number
): Promise<void> {
  try {
    const current = await getStudySubjects();

    const updated = current.map((s) =>
      s.id === id
        ? { ...s, totalMinutes: (s.totalMinutes ?? 0) + minutesToAdd }
        : s
    );

    await saveStudySubjects(updated);
  } catch (err) {
    console.log("[studySubjectStorage] erro ao atualizar minutos:", err);
  }
}

/**
 * Reset total das matérias (usado ao criar uma nova conta).
 */
export async function resetStudySubjects(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.log("[studySubjectStorage] erro ao resetar matérias:", err);
  }
}
