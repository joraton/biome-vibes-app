import type { BiomeEvaluation } from "@/types/biome";

export const saveEvaluation = (evaluation: BiomeEvaluation): void => {
  const key = `evaluation_${evaluation.biomeId}_${evaluation.subBiomeId}`;
  localStorage.setItem(key, JSON.stringify(evaluation));
};

export const getEvaluation = (biomeId: string, subBiomeId: string): BiomeEvaluation | null => {
  const key = `evaluation_${biomeId}_${subBiomeId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const getAllEvaluations = (): BiomeEvaluation[] => {
  const evaluations: BiomeEvaluation[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('evaluation_')) {
      const data = localStorage.getItem(key);
      if (data) {
        evaluations.push(JSON.parse(data));
      }
    }
  }
  
  return evaluations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const calculateScore = (answers: number[]): number => {
  const total = answers.reduce((sum, answer) => sum + answer, 0);
  return Math.round((total / 50) * 20 * 10) / 10; // Arrondi à 0.1
};

export const calculateFinalScore = (scoreTest20: number, noteSubjective20?: number, includeSubjective = false): number => {
  if (includeSubjective && noteSubjective20 !== undefined) {
    return Math.round(((scoreTest20 + noteSubjective20) / 2) * 10) / 10;
  }
  return scoreTest20;
};

export const getScoreFeedback = (score: number): string => {
  if (score < 10) return "Expérience mitigée…";
  if (score <= 15) return "Plutôt agréable…";
  return "Coup de cœur !";
};