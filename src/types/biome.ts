export interface SubBiome {
  id: string;
  nom: string;
  image?: string;
  subEcosystems: string[];
}

export interface Biome {
  id: string;
  nom: string;
  image?: string;
  theme: {
    primary: string;
    accent: string;
    bg: string;
    unsplash: string;
  };
  subBiomes: SubBiome[];
}

export interface BiomeEvaluation {
  biomeId: string;
  subBiomeId: string;
  answers: number[];
  scoreTest20: number;
  noteSubjective20?: number;
  commentaireSubjectif?: string;
  includeSubjective: boolean;
  finalDisplayed: number;
  timestamp: string;
}