// src/utils/studyWeek.js

// Garante que sempre devolvemos um array de NÚMEROS (minutos)
export function mapStudyWeekToMinutes(week) {
  if (!Array.isArray(week)) {
    return [];
  }

  return week.map((day) => {
    // Caso seja objeto { date, totalMinutes }
    if (
      day &&
      typeof day === "object" &&
      typeof day.totalMinutes === "number"
    ) {
      return day.totalMinutes;
    }

    // Caso o storage já devolva número direto
    if (typeof day === "number") {
      return day;
    }

    // Qualquer lixo vira 0 pra não quebrar layout
    return 0;
  });
}
