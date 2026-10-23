export interface GameSpec {
  // 1. Game Idea
  title: string;
  theme: string;
  inspiration: string;

  // 2. Player Goal
  playerGoal: string;

  // 3. Core Gameplay
  coreAction: string; // e.g. "click to allocate, avoid hazards, match tiles"
  secondaryActions: string[];

  // 4. Core Loop
  loopAction: string;
  loopResponse: string;
  loopReward: string;
  loopNext: string;

  // 5. Win / Loss
  winCondition: string;
  lossCondition: string;
  sessionEndType: 'timer' | 'lives' | 'target_score' | 'endless';

  // 6. Difficulty and Progression
  progressionType: string;
  unlocksAndUpgrades: string;

  // 7. Visual Style and Mood
  visualStyle: string;
  moodDescription: string;
  colorPaletteIdea: string;

  // 8. Perspective
  perspective: string;

  // 9. Controls
  controlScheme: string;

  // 10. Feedback and Game Feel
  successFeedback: string[];
  failureFeedback: string[];
  soundStyle: string;

  // 11. UI Elements
  uiElements: string[];

  // 12. Audience and Session Length
  targetAudience: string;
  sessionDuration: string;

  // 13. Platform
  platform: string;

  // 14. Optional Features
  optionalFeatures: string[];

  // 15. Technical Choices
  techStackPreference: string;

  // Easy Things You Can Change (Configurable Parameters)
  parameters: {
    gameSpeed: number; // 1 to 10
    spawnRateSeconds: number; // e.g. 1.5s
    sessionLengthSeconds: number; // e.g. 90s
    playerLives: number; // e.g. 3
    targetWinScore: number; // e.g. 1000
    difficultyRamp: 'gentle' | 'moderate' | 'intense';
    soundEffectsEnabled: boolean;
  };
}

export interface QuestionStep {
  id: number;
  areaNumber: number;
  areaTitle: string;
  question: string;
  plainEnglishExplanation: string;
  field: keyof GameSpec | string;
  options: {
    label: string;
    description: string;
    value: string;
    isRecommended?: boolean;
    recommendedBadge?: string;
  }[];
  customPlaceholder?: string;
}

export interface PresetGame {
  id: string;
  title: string;
  category: string;
  pitch: string;
  spec: Partial<GameSpec>;
}
