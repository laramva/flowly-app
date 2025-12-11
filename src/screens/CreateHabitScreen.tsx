// src/screens/CreateHabitScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../components/ScreenContainer";
import FlowlyMascot from "../components/FlowlyMascot";
import FlowlyButton from "../components/FlowlyButton";
import FlowlyTextInput from "../components/FlowlyTextInput";
import FlowlyIcon from "../components/FlowlyIcon";
import { FlowlyColors } from "../theme/colors";

import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  SubjectCategory,
  StudySubject,
  updateSubject,
} from "../storage/studySubjectStorage";

type CreateHabitScreenProps = {
  navigation: any;
  route: any;
};

const SUGGESTIONS: { name: string; category: SubjectCategory }[] = [
  { name: "Matemática", category: "escola" },
  { name: "Português", category: "escola" },
  { name: "Inglês", category: "escola" },
  { name: "Física", category: "escola" },
  { name: "Programação", category: "faculdade" },
  { name: "UX / UI", category: "faculdade" },
  { name: "Redação", category: "outros" },
  { name: "Leitura", category: "outros" },
];

const CATEGORIES: SubjectCategory[] = ["faculdade", "escola", "outros"];

type FeedbackModalState = {
  visible: boolean;
  title: string;
  message: string;
};

type EditModalState = {
  visible: boolean;
  id: string | null;
  name: string;
  category: SubjectCategory;
};

export default function CreateHabitScreen({
  navigation,
  route,
}: CreateHabitScreenProps) {
  const editingId: string | undefined = route?.params?.subjectId;

  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SubjectCategory>("outros");
  const [loading, setLoading] = useState(false);

  // popup pastel de feedback (salvo / erro)
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    visible: false,
    title: "",
    message: "",
  });

  // popup pastel de confirmação de apagar
  const [deleteTarget, setDeleteTarget] = useState<StudySubject | null>(null);

  // popup pastel de edição (nome + categoria)
  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    id: null,
    name: "",
    category: "outros",
  });

  async function loadSubjects() {
    try {
      const all = await getAllSubjects();
      setSubjects(all);

      if (editingId) {
        const found = all.find((s) => s.id === editingId);
        if (found) {
          setName(found.name);
          setCategory(found.category);
        }
      }
    } catch (err) {
      console.warn("[CreateHabitScreen] loadSubjects error", err);
    }
  }

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadSubjects);
    return unsub;
  }, [navigation, editingId]);

  async function handleSave() {
    if (!name.trim()) {
      setFeedbackModal({
        visible: true,
        title: "Quase lá",
        message: "Dê um nome para a matéria antes de salvar.",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateSubject(editingId, {
          name: name.trim(),
          category,
        });
      } else {
        await createSubject(name.trim(), category);
      }

      await loadSubjects();
      setName("");
      setCategory("outros");

      setFeedbackModal({
        visible: true,
        title: "Pronto!",
        message: "Sua matéria foi salva com carinho.",
      });
    } catch (err) {
      console.warn("[CreateHabitScreen] handleSave error", err);
      setFeedbackModal({
        visible: true,
        title: "Algo não saiu como esperado",
        message:
          "Não foi possível salvar a matéria agora. Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  // abre popup pastel de confirmação de apagar
  function handleDelete(id: string) {
    const target = subjects.find((s) => s.id === id) || null;
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteSubject(deleteTarget.id);
      await loadSubjects();
    } catch (err) {
      console.warn("[CreateHabitScreen] delete error", err);
      setFeedbackModal({
        visible: true,
        title: "Não deu para apagar agora",
        message:
          "Não foi possível apagar a matéria. Tente novamente mais tarde.",
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  // abre popup pastel de edição (nome + categoria)
  function handleOpenEditModal(subject: StudySubject) {
    setEditModal({
      visible: true,
      id: subject.id,
      name: subject.name,
      category: subject.category,
    });
  }

  // confirma edição via popup
  async function handleConfirmEdit() {
    if (!editModal.id || !editModal.name.trim()) {
      setFeedbackModal({
        visible: true,
        title: "Quase lá",
        message: "Dê um nome para a matéria antes de salvar a edição.",
      });
      return;
    }

    try {
      await updateSubject(editModal.id, {
        name: editModal.name.trim(),
        category: editModal.category,
      });

      await loadSubjects();
      setEditModal((prev) => ({ ...prev, visible: false }));

      setFeedbackModal({
        visible: true,
        title: "Matéria atualizada",
        message: "As informações da matéria foram atualizadas com carinho.",
      });
    } catch (err) {
      console.warn("[CreateHabitScreen] handleConfirmEdit error", err);
      setFeedbackModal({
        visible: true,
        title: "Algo não saiu como esperado",
        message:
          "Não foi possível atualizar a matéria agora. Tente novamente em alguns instantes.",
      });
    }
  }

  function handleSuggestionPress(s: { name: string; category: SubjectCategory }) {
    setName(s.name);
    setCategory(s.category);
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <Text style={styles.title}>Criar matéria</Text>
        <Text style={styles.subtitle}>
          Dê um nome e uma categoria para organizar seus estudos com carinho.
        </Text>

        {/* MASCOTE */}
        <View style={styles.mascotWrapper}>
          <FlowlyMascot name="habito-rotina" size={80} />
        </View>

        {/* CARD PRINCIPAL */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nome da matéria</Text>
          <Text style={styles.cardHint}>Algo que faça sentido para você.</Text>

          <View style={styles.inputWrapper}>
            <FlowlyTextInput
              placeholder="Ex.: UX, Matemática, Inglês..."
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={[styles.cardTitle, { marginTop: 16 }]}>Categoria</Text>

          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const selected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.saveButtonWrapper}>
            <FlowlyButton
              label={editingId ? "Atualizar matéria" : "Salvar matéria"}
              onPress={handleSave}
              disabled={loading}
            />
          </View>
        </View>

        {/* SUGESTÕES */}
        <View style={styles.suggestionsCard}>
          <Text style={styles.sectionTitle}>Sugestões de matéria</Text>
          <Text style={styles.sectionSubtitle}>
            Toque em uma sugestão para preencher automaticamente.
          </Text>

          <View style={styles.suggestionsGrid}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={`${s.category}-${s.name}`}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(s)}
                activeOpacity={0.85}
              >
                <Text style={styles.suggestionName}>{s.name}</Text>
                <Text style={styles.suggestionCategory}>{s.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SUAS MATÉRIAS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suas matérias</Text>
          {subjects.length === 0 ? (
            <Text style={styles.emptyText}>
              Você ainda não cadastrou matérias.
            </Text>
          ) : (
            subjects.map((s) => (
              <View key={s.id} style={styles.subjectRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectName}>{s.name}</Text>
                  <Text style={styles.subjectCategory}>{s.category}</Text>
                </View>

                <View style={styles.subjectActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenEditModal(s)}
                    activeOpacity={0.85}
                  >
                    <FlowlyIcon name="lapis" size={30} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { marginLeft: 8 }]}
                    onPress={() => handleDelete(s.id)}
                    activeOpacity={0.85}
                  >
                    <FlowlyIcon name="lixeira" size={30} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* POPUP PASTEL – FEEDBACK (SALVO / ERRO) */}
      {feedbackModal.visible && (
        <View style={styles.modalBackdrop}>
          <LinearGradient
            colors={FlowlyColors.gradient.main as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalCard}
          >
            <View style={styles.modalContent}>
              <FlowlyMascot name="flowly-neutral" size={80} />

              <Text style={styles.modalTitle}>{feedbackModal.title}</Text>
              <Text style={styles.modalText}>{feedbackModal.message}</Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.plainModalButton,
                    styles.plainModalButtonSecondary,
                  ]}
                  activeOpacity={0.85}
                  onPress={() =>
                    setFeedbackModal((prev) => ({ ...prev, visible: false }))
                  }
                >
                  <Text style={styles.plainModalButtonLabel}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* POPUP PASTEL – CONFIRMAÇÃO DE APAGAR */}
      {deleteTarget && (
        <View style={styles.modalBackdrop}>
          <LinearGradient
            colors={FlowlyColors.gradient.main as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalCard}
          >
            <View style={styles.modalContent}>
              <FlowlyMascot name="lixeira" size={86} />

              <Text style={styles.modalTitle}>Apagar matéria?</Text>
              <Text style={styles.modalText}>
                {`Tem certeza que deseja apagar "${deleteTarget.name}"? Você pode criar novamente depois, se quiser.`}
              </Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.plainModalButton,
                    styles.plainModalButtonSecondary,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setDeleteTarget(null)}
                >
                  <Text style={styles.plainModalButtonLabel}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.plainModalButton,
                    styles.plainModalButtonPrimary,
                  ]}
                  activeOpacity={0.85}
                  onPress={confirmDelete}
                >
                  <Text style={styles.plainModalButtonLabel}>Apagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* POPUP PASTEL – EDIÇÃO DE MATÉRIA */}
      {editModal.visible && (
        <View style={styles.modalBackdrop}>
          <LinearGradient
            colors={FlowlyColors.gradient.main as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalCard}
          >
            <View style={styles.modalContent}>
              <FlowlyMascot name="lapis" size={80} />

              <Text style={styles.modalTitle}>Editar matéria</Text>
              <Text style={styles.modalText}>
                Ajuste o nome e a categoria desta matéria.
              </Text>

              <View style={{ alignSelf: "stretch", marginTop: 12 }}>
                <FlowlyTextInput
                  placeholder="Nome da matéria"
                  value={editModal.name}
                  onChangeText={(text) =>
                    setEditModal((prev) => ({ ...prev, name: text }))
                  }
                />

                <Text style={[styles.cardTitle, { marginTop: 14 }]}>
                  Categoria
                </Text>

                <View style={styles.categoryRow}>
                  {CATEGORIES.map((cat) => {
                    const selected = editModal.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryChip,
                          selected && styles.categoryChipSelected,
                        ]}
                        onPress={() =>
                          setEditModal((prev) => ({
                            ...prev,
                            category: cat,
                          }))
                        }
                        activeOpacity={0.9}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            selected && styles.categoryChipTextSelected,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.plainModalButton,
                    styles.plainModalButtonSecondary,
                  ]}
                  activeOpacity={0.85}
                  onPress={() =>
                    setEditModal((prev) => ({ ...prev, visible: false }))
                  }
                >
                  <Text style={styles.plainModalButtonLabel}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.plainModalButton,
                    styles.plainModalButtonPrimary,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleConfirmEdit}
                >
                  <Text style={styles.plainModalButtonLabel}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: FlowlyColors.text.light,
    marginTop: 4,
  },

  mascotWrapper: {
    marginTop: 16,
    alignItems: "center",
  },

  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: FlowlyColors.background.soft,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
  },
  cardHint: {
    fontSize: 13,
    color: FlowlyColors.text.light,
    marginTop: 4,
    marginBottom: 8,
  },

  inputWrapper: {
    marginTop: 8,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: FlowlyColors.background.creamLight,
  },
  categoryChipSelected: {
    backgroundColor: FlowlyColors.primary.main,
  },
  categoryChipText: {
    fontSize: 13,
    color: FlowlyColors.text.primary,
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  saveButtonWrapper: {
    marginTop: 20,
  },

  suggestionsCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: FlowlyColors.background.creamLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: FlowlyColors.text.light,
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: FlowlyColors.background.soft,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },
  suggestionCategory: {
    fontSize: 12,
    color: FlowlyColors.text.light,
  },

  emptyText: {
    fontSize: 13,
    color: FlowlyColors.text.light,
    marginTop: 6,
  },

  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "600",
    color: FlowlyColors.text.primary,
  },
  subjectCategory: {
    fontSize: 12,
    color: FlowlyColors.text.light,
  },
  subjectActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: FlowlyColors.background.creamLight,
  },

  // MODAIS PASTEL GRADIENTE
  modalBackdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    zIndex: 1000,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  modalContent: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  modalTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: FlowlyColors.text.dark,
    textAlign: "center",
  },
  modalText: {
    marginTop: 6,
    fontSize: 13,
    color: FlowlyColors.text.dark,
    textAlign: "center",
  },
  modalButtonsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },

  // botões "crus" dentro dos modais
  plainModalButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  plainModalButtonSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  plainModalButtonPrimary: {
    backgroundColor: FlowlyColors.primary.soft,
  },
  plainModalButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: FlowlyColors.text.dark,
  },
});
