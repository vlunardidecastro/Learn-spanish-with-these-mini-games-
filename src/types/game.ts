export type TierLevel = 1 | 2 | 3;

export interface IngredientInfo {
  id: string;
  spanishName: string;
  englishName: string;
  articleSpanish: string; // "el" | "la"
  fullSpanish: string; // "el aguacate"
  icon: string;
  actionSpanish: string; // "Corta", "Pica", "Exprime", "Añade"
  actionEnglish: string; // "Chop", "Dice", "Squeeze", "Add"
  color: string;
  secondaryColor: string;
  slicesNeeded: number;
  preparationTip: string;
}

export interface RecipeStep {
  stepIndex: number;
  ingredientId: string;
  instructionSpanish: string;
  instructionEnglish: string;
  instructionAudioText: string;
  completed: boolean;
}

export type GamePhase = 'intro' | 'playing' | 'chopping' | 'mashing' | 'completed';
