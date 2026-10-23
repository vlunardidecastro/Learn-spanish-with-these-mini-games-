import { QuestionStep } from '../types/gameDesign';

export const INTERVIEW_QUESTIONS: QuestionStep[] = [
  {
    id: 1,
    areaNumber: 1,
    areaTitle: 'Game Idea & Theme',
    question: 'What is the basic idea or theme of your game? Any inspirations?',
    plainEnglishExplanation:
      'The theme is the "story setting" or flavor of your game (e.g. running a lemonade stand, dodging deadlines in an office, or trading stocks). You don\'t need a movie plot—just a relatable premise.',
    field: 'theme',
    options: [
      {
        label: 'Business / Tycoon Simulator',
        description: 'Run a store, startup, or coffee shop. Balance revenue, inventory, and customer demand.',
        value: 'Business & Management Tycoon (e.g., Lemonade Stand, Diner Dash)',
        isRecommended: true,
        recommendedBadge: 'Great for Business Students',
      },
      {
        label: 'Fast-Paced Arcade Dodger / Runner',
        description: 'Dodge market crashes, inflation bombs, or office emails while collecting coins.',
        value: 'Arcade Survival / Obstacle Dodger (e.g., Subway Surfers, Flappy Bird)',
      },
      {
        label: 'Resource Allocation / Puzzle',
        description: 'Optimize budget, energy, or supply chain routes on a clean grid to maximize efficiency.',
        value: 'Strategic Resource Grid / Optimization Puzzle (e.g., Mini Metro, 2048)',
      },
      {
        label: 'Trading / Market High-Frequency Clicker',
        description: 'Buy low, sell high, watch market trends fluctuate, and reinvest profits.',
        value: 'Trading & Market Timing Clicker (e.g., Cookie Clicker meets Wall Street)',
      },
    ],
    customPlaceholder: 'Or describe your own custom idea/theme in a sentence or two...',
  },
  {
    id: 2,
    areaNumber: 2,
    areaTitle: 'Player Goal',
    question: 'What is the player ultimately trying to accomplish?',
    plainEnglishExplanation:
      'The player goal gives the player purpose. It answers: "Why am I playing this right now?" Keep it singular and punchy.',
    field: 'playerGoal',
    options: [
      {
        label: 'Reach a Profit / Valuation Milestone',
        description: 'Earn $100,000 revenue or scale to a $1B "Unicorn" status before the fiscal year ends.',
        value: 'Hit a financial or milestone target (e.g. $50,000 revenue or level 10 company)',
        isRecommended: true,
        recommendedBadge: 'Clear Victory Condition',
      },
      {
        label: 'Survive as Long as Possible (High Score)',
        description: 'Hold out against increasing customer rushes or market volatility without going bankrupt.',
        value: 'Survive endless waves or minutes, striving for the personal best high score',
      },
      {
        label: 'Complete Timed Contract Rounds',
        description: 'Satisfy 10 client contracts or orders before the countdown timer hits zero.',
        value: 'Fulfill all customer orders or project deliverables within a strict timer',
      },
      {
        label: 'Solve the Optimization Route / Grid',
        description: 'Connect all supply chain nodes with minimum cost and zero bottlenecks.',
        value: 'Reach 100% operational efficiency with minimal budget spent',
      },
    ],
    customPlaceholder: 'Or write what the player should accomplish...',
  },
  {
    id: 3,
    areaNumber: 3,
    areaTitle: 'Core Gameplay (The Verb)',
    question: 'What does the player repeatedly do moment-to-moment?',
    plainEnglishExplanation:
      'In game design, the "core verb" is the physical or cognitive action the player performs every 2 to 5 seconds.',
    field: 'coreAction',
    options: [
      {
        label: 'Click / Tap to Fulfill & Upgrade',
        description: 'Fast, satisfying clicking to serve customers, fulfill tickets, and purchase upgrades.',
        value: 'Clicking to dispatch resources, fulfill orders, and invest in faster machinery',
        isRecommended: true,
        recommendedBadge: 'Most Reliable & Fun for Web',
      },
      {
        label: 'Move / Steer to Collect & Dodge',
        description: 'Use keyboard arrows or mouse to steer your avatar to catch good items and avoid hazards.',
        value: 'Steering an avatar or cart across the screen to collect profits while evading pitfalls',
      },
      {
        label: 'Sliders & Decision Toggles',
        description: 'Adjust price, marketing spend, and worker wages, then advance time to see profits.',
        value: 'Tuning sliders (Price, Marketing, Staff) and clicking "Next Turn" to evaluate P&L results',
      },
      {
        label: 'Drag & Drop / Matching',
        description: 'Drag shipments to matching warehouses or connect production lines.',
        value: 'Dragging items from conveyor belts into designated delivery zones under time pressure',
      },
    ],
    customPlaceholder: 'Describe the main player action...',
  },
  {
    id: 4,
    areaNumber: 4,
    areaTitle: 'Core Loop',
    question: 'How does the repeating 15-second loop work?',
    plainEnglishExplanation:
      'The "Core Loop" is the engine of player engagement: [Player Action] -> [Game Feedback] -> [Reward / Consequence] -> [Next Action].',
    field: 'loopAction',
    options: [
      {
        label: 'Action: Serve Customer -> Reward: Cash -> Next: Buy Machine',
        description: 'Click hungry customer -> Cash register "cha-ching" -> Bank account grows -> Buy barista machine to serve 2x faster.',
        value: 'Serve incoming customer -> Instant coin chime & tip -> Accumulate cash -> Buy automation upgrade -> Handle bigger crowd',
        isRecommended: true,
        recommendedBadge: 'Classic Tycoon Loop',
      },
      {
        label: 'Action: Dodge Hazard -> Reward: Score Multiplier -> Next: Faster Wave',
        description: 'Evade red obstacle -> Score combo x2 pops up -> Earn bonus speed -> Face more obstacles.',
        value: 'Evade market crash hazard -> Score combo increases -> Multiplier boosts points -> Navigate tighter obstacle lane',
      },
      {
        label: 'Action: Set Market Price -> Reward: Margin Profit -> Next: Expand Inventory',
        description: 'Analyze customer mood -> Set optimal price -> See daily earnings sheet -> Restock higher quality goods.',
        value: 'Set price & marketing balance -> Instant sales report graph -> Pocket profit margin -> Purchase higher tier inventory',
      },
    ],
    customPlaceholder: 'Write your 4-step loop...',
  },
  {
    id: 5,
    areaNumber: 5,
    areaTitle: 'Win & Loss Conditions',
    question: 'How does the player win or lose a round?',
    plainEnglishExplanation:
      'Clear stakes make a game exciting. When do confetti cannons explode (Win), and when does the "Game Over / Bankrupt" screen appear (Loss)?',
    field: 'winCondition',
    options: [
      {
        label: 'Win: Reach Goal / Loss: 3 Strikes or Zero Cash',
        description: 'Win by earning the target revenue ($10,000); lose if cash drops below $0 or 3 angry customers leave.',
        value: 'Win: Reach target milestone score. Loss: Lose all 3 reputation stars (strikes) or run out of cash.',
        isRecommended: true,
        recommendedBadge: 'Balanced Stakes',
      },
      {
        label: 'Timed Challenge (Beat the Clock)',
        description: 'Rounds last 90 seconds. Win if you beat the target score before the buzzer sounds.',
        value: 'Win: Score above the quota when the 90-second timer hits 0:00. Loss: Fall short of the quota.',
      },
      {
        label: 'Endless Survival (No Permanent Win, High Score Focus)',
        description: 'Play until you make a mistake; aim to set the highest possible leaderboard record.',
        value: 'Win: Beat your personal high score. Loss: Collision with obstacle or 3 consecutive missed orders.',
      },
      {
        label: 'Story Milestone Chapters',
        description: 'Progress through 5 stages (Startup -> Growth -> IPO). Win by ringing the opening bell.',
        value: 'Win: Successfully complete Stage 3 IPO. Loss: Run out of runway runway funds before reaching next round.',
      },
    ],
    customPlaceholder: 'Describe your win and loss rules...',
  },
  {
    id: 6,
    areaNumber: 6,
    areaTitle: 'Difficulty & Progression',
    question: 'How should the game get harder and more rewarding over time?',
    plainEnglishExplanation:
      '"Progression" keeps players from getting bored. "Difficulty ramp" ensures early moments are welcoming while later minutes test skill.',
    field: 'progressionType',
    options: [
      {
        label: 'Steady Ramp with Shop Upgrades',
        description: 'Customers arrive faster, but player buys speed upgrades, automated assistants, and premium recipes.',
        value: 'Customer flow increases by 15% every 30 seconds; player spends earnings in an upgrade shop to boost capacity.',
        isRecommended: true,
        recommendedBadge: 'Most Satisfying Flow',
      },
      {
        label: 'Multi-Level Stages (Levels 1 to 5)',
        description: 'Each level introduces a new customer type, faster speed, or new mechanic (e.g. coffee -> bakery -> drive-thru).',
        value: 'Discrete stages with increasing quotas and new customer archetypes introduced each stage.',
      },
      {
        label: 'Dynamic Market Shocks / Random Events',
        description: 'Occasional pop-up events (e.g. "Viral TikTok Trend = 3x Demand" or "Supply Shortage = Double Cost").',
        value: 'Surprise news events every 45 seconds that flip market conditions and require tactical pivot.',
      },
      {
        label: 'Pure Skill Speed Acceleration',
        description: 'Everything moves faster continuously until the player finally slips up.',
        value: 'Gradual, smooth speed acceleration every 10 seconds testing reaction speed.',
      },
    ],
    customPlaceholder: 'Describe how difficulty ramps up...',
  },
  {
    id: 7,
    areaNumber: 7,
    areaTitle: 'Visual Style & Mood',
    question: 'What should the game look and feel like?',
    plainEnglishExplanation:
      'Visual style sets emotional tone. A playful style feels friendly and casual, while a sleek corporate dashboard feels analytical.',
    field: 'visualStyle',
    options: [
      {
        label: 'Clean Modern Minimalist & Vibrant',
        description: 'Crisp cards, smooth rounded buttons, vibrant accent colors, high contrast, feels like a top-tier modern app.',
        value: 'Clean modern minimalist with vibrant pastel accents, crisp typography, and rounded cards.',
        isRecommended: true,
        recommendedBadge: 'Looks Incredible & Easiest to Code',
      },
      {
        label: 'Playful Cartoon / Cozy Diner',
        description: 'Warm colors (amber, mint, cream), cheerful icons, bouncy animations, welcoming character badges.',
        value: 'Playful, warm cartoon aesthetic with cheerful emojis/icons, warm tones, and bouncy visual elements.',
      },
      {
        label: 'Retro Arcade (8-bit / 16-bit Cyber)',
        description: 'Pixelated badges, neon blues and purples, dark background, glowing indicators, nostalgic synth vibe.',
        value: 'Retro arcade neon style with dark canvas, glowing borders, and arcade-inspired typography.',
      },
      {
        label: 'Fintech / Wall Street Dashboard',
        description: 'Sleek dark mode, live glowing candlestick or line charts, metric cards, Bloomberg-terminal inspired.',
        value: 'Polished executive fintech dashboard with dynamic charts, emerald green gains, and crisp data readouts.',
      },
    ],
    customPlaceholder: 'Specify visual style and color ideas...',
  },
  {
    id: 8,
    areaNumber: 8,
    areaTitle: 'Camera & Perspective',
    question: 'What viewpoint does the player look through?',
    plainEnglishExplanation:
      '"Perspective" means where the imaginary camera is placed. For web games, a 2D interface or top-down view is by far the smoothest.',
    field: 'perspective',
    options: [
      {
        label: 'Interactive 2D Dashboard / Stage View',
        description: 'Everything is laid out cleanly on screen with interactive stations, counters, and metric panels.',
        value: 'Fixed 2D interactive stage with visual counters, queue track, and status dashboard.',
        isRecommended: true,
        recommendedBadge: 'Zero Camera Headaches',
      },
      {
        label: 'Top-Down View (Bird\'s-Eye)',
        description: 'Looking straight down from above onto the shop floor, city grid, or traffic lanes.',
        value: 'Top-down bird\'s-eye view looking down on the playfield with entities moving in 2D space.',
      },
      {
        label: 'Side-Scrolling / Lane View',
        description: 'Looking from the side as items or customers scroll horizontally or vertically.',
        value: 'Side view / conveyor lane perspective with items or characters moving left-to-right.',
      },
      {
        label: 'Isometric (Angled 2.5D)',
        description: 'Tilted corner angle giving a sense of 3D depth using 2D art.',
        value: 'Isometric angled perspective showing shop floor with pseudo-3D depth.',
      },
    ],
    customPlaceholder: 'Choose or describe perspective...',
  },
  {
    id: 9,
    areaNumber: 9,
    areaTitle: 'Controls',
    question: 'What input devices should players use?',
    plainEnglishExplanation:
      'How does the player command their actions? Simpler controls make the game immediately playable with zero tutorial friction.',
    field: 'controlScheme',
    options: [
      {
        label: 'Mouse Click & Mobile Tap (One-Click)',
        description: 'Click or tap on-screen stations, buttons, and items. 100% accessible on laptop, desktop, and mobile phones.',
        value: 'Mouse click and touchscreen tap (universal one-handed interaction).',
        isRecommended: true,
        recommendedBadge: 'Works Everywhere Seamlessly',
      },
      {
        label: 'Keyboard (Arrow Keys / WASD + Spacebar)',
        description: 'Great for fast dodging, jumping, or steering an avatar.',
        value: 'Keyboard controls: Arrow keys or WASD for movement, Spacebar or Enter for action.',
      },
      {
        label: 'Hybrid (Mouse to Click + Keyboard Hotkeys)',
        description: 'Click with mouse or use keys [1, 2, 3] for powerups and quick inventory switching.',
        value: 'Mouse primary with keyboard number hotkeys [1-4] and Spacebar for power users.',
      },
      {
        label: 'Drag & Drop Gestures',
        description: 'Click and drag items across areas on the screen.',
        value: 'Drag and drop with mouse or finger gestures with snapping targets.',
      },
    ],
    customPlaceholder: 'Describe your control scheme...',
  },
  {
    id: 10,
    areaNumber: 10,
    areaTitle: 'Feedback & Game Feel ("Juice")',
    question: 'What happens when players succeed or fail?',
    plainEnglishExplanation:
      '"Game Feel" (or "Juice") is the sensory reward that makes interacting feel good: sound chimes, floating "+$50" text, screenshakes, and particle sparkles.',
    field: 'soundStyle',
    options: [
      {
        label: 'Rich Sensory Juice (Popups, Particles, Chimes)',
        description: 'Floating "+$100" text, particle confetti on milestones, satisfying synthesized sound effects, slight haptic pulse.',
        value: 'High game feel: floating score popups, confetti particle bursts, crisp Web Audio sound chimes, and smooth scale transitions.',
        isRecommended: true,
        recommendedBadge: 'Makes Games Addictively Fun',
      },
      {
        label: 'Subtle & Professional',
        description: 'Gentle color highlights (green for profit, red for loss), smooth number counters, muted soft clicks.',
        value: 'Subtle executive feedback: smooth counter animations, clean green/red badges, and soft UI clicks.',
      },
      {
        label: 'Arcade Punchy (Screen Shake & Flash)',
        description: 'Screen shake on mistakes, flash on combos, 8-bit sound effects, dramatic game over slow-motion.',
        value: 'Punchy arcade feedback: mild screen shake on errors, streak flash, and energetic synth sound effects.',
      },
    ],
    customPlaceholder: 'Describe sound and visual feedback...',
  },
  {
    id: 11,
    areaNumber: 11,
    areaTitle: 'User Interface (HUD)',
    question: 'What key information must always be on screen?',
    plainEnglishExplanation:
      'HUD stands for "Heads-Up Display"—the scoreboard, clock, health bars, and buttons the player glances at.',
    field: 'uiElements',
    options: [
      {
        label: 'Full Tycoon HUD (Cash, Timer, Rep/Lives, Goal)',
        description: 'Top bar with Current Cash ($), 3 Reputation Stars, Round Timer, Current Goal Progress Bar, and Pause/Restart.',
        value: 'Revenue/Cash display, Reputation/Lives (3 hearts), Timer/Day clock, Goal progress bar, and Restart button.',
        isRecommended: true,
        recommendedBadge: 'Comprehensive & Clear',
      },
      {
        label: 'Minimalist Score & Timer',
        description: 'Only Score, High Score, and Remaining Time in the top corner to keep the screen uncluttered.',
        value: 'Clean top header: Score, High Score badge, and simple countdown bar.',
      },
      {
        label: 'Stock Ticker / Metrics Header',
        description: 'Portfolio Value, Net Profit, Share Price Graph, and Cash Reserve status.',
        value: 'Financial metric strip: Portfolio Valuation, Day P&L, Cash Reserve, and Multiplier streak.',
      },
    ],
    customPlaceholder: 'List specific UI numbers or buttons needed...',
  },
  {
    id: 12,
    areaNumber: 12,
    areaTitle: 'Target Audience & Session Length',
    question: 'Who will play this, and how long should one game session last?',
    plainEnglishExplanation:
      'A game designed for a quick 2-minute study break is built differently than an hour-long simulation.',
    field: 'sessionDuration',
    options: [
      {
        label: 'Quick Coffee Break (2 to 3 minutes)',
        description: 'Fast, intense, bite-sized fun. Easy to play between classes or meetings; high replayability.',
        value: '2 to 3 minutes per run. Perfect for casual web browser players looking for a quick satisfying break.',
        isRecommended: true,
        recommendedBadge: 'Best Replayability',
      },
      {
        label: 'Micro-Game Blitz (45 to 60 seconds)',
        description: 'Ultra-fast adrenaline sprint with immediate score tally and "Play Again" button.',
        value: '60-second rapid sprint. High tension, instant gratification, quick retry.',
      },
      {
        label: 'Extended Multi-Day Tycoon (5 to 10 minutes)',
        description: 'Progress through multiple days or quarters, saving progress between sessions.',
        value: '5 to 10 minutes session with multi-stage business quarters.',
      },
    ],
    customPlaceholder: 'Specify audience and target minutes...',
  },
  {
    id: 13,
    areaNumber: 13,
    areaTitle: 'Target Platform',
    question: 'Where will players play this game?',
    plainEnglishExplanation:
      'Designing for both desktop and mobile web from day one ensures anyone can click your link and immediately play without installing anything.',
    field: 'platform',
    options: [
      {
        label: 'Responsive Web (Desktop & Mobile Browser)',
        description: 'Works fluidly on laptops with mouse/keyboard AND on phones with touch controls. Zero app store downloads.',
        value: 'Desktop and Mobile web browsers (fully responsive layout with touch and click support).',
        isRecommended: true,
        recommendedBadge: 'Maximum Reach',
      },
      {
        label: 'Desktop Browser Optimized',
        description: 'Tailored for wider screens with mouse precision and keyboard hotkeys.',
        value: 'Desktop web browser (optimized for 16:9 screens with mouse and keyboard).',
      },
      {
        label: 'Mobile-First Portrait Web',
        description: 'Tall portrait format designed specifically for one-handed smartphone play.',
        value: 'Mobile portrait browser view (vertical screen orientation with thumb-friendly controls).',
      },
    ],
    customPlaceholder: 'Specify target platform...',
  },
  {
    id: 14,
    areaNumber: 14,
    areaTitle: 'Optional Advanced Features',
    question: 'Do you want any extra enhancements, or keep the initial build focused?',
    plainEnglishExplanation:
      'In business and software, "Feature Creep" is when a project tries to do too much and never launches. For a first version, less is more!',
    field: 'optionalFeatures',
    options: [
      {
        label: 'Local High Score + Randomized Orders (Focused & Lean)',
        description: 'Saves your best score locally, generates random customers/orders each round. Reliable and quick to build.',
        value: 'Local storage high score persistence and procedurally randomized customer orders.',
        isRecommended: true,
        recommendedBadge: 'Recommended: Ship Fast & Bug-Free',
      },
      {
        label: 'Upgrade Shop & Achievements',
        description: 'Between rounds, spend cash on speed boosters, interior decor, or marketing campaigns.',
        value: 'In-game upgrade shop with persistent upgrades and unlockable achievement badges.',
      },
      {
        label: 'Interactive Difficulty Modes',
        description: 'Choose "Casual / Student Mode" vs "Hardcore / Venture Capitalist Mode".',
        value: 'Difficulty selection: Relaxed Sandbox mode vs High-Stakes Crunch mode.',
      },
      {
        label: 'Daily Challenge / Seeded Runs',
        description: 'Everyone plays the exact same market sequence today to compare scores.',
        value: 'Daily challenge mode with seeded customer sequences.',
      },
    ],
    customPlaceholder: 'Select or write any special features...',
  },
  {
    id: 15,
    areaNumber: 15,
    areaTitle: 'Technical Implementation (Plain English)',
    question: 'What underlying technology is best for your game?',
    plainEnglishExplanation:
      'As a business student, you don\'t need to pick code libraries. Here is our plain-English recommendation for the fastest, most reliable build.',
    field: 'techStackPreference',
    options: [
      {
        label: 'React + HTML5 Canvas & Web Audio (Zero External Bloat)',
        description: 'Uses native browser features. Loads in under 1 second, runs at 60 FPS, generates sounds with code without missing audio files.',
        value: 'React with HTML5 Canvas or SVG rendering and native Web Audio API sound synthesis. Single self-contained bundle, zero external asset dependencies.',
        isRecommended: true,
        recommendedBadge: 'Highest Reliability for AI Studio',
      },
      {
        label: 'Pure React DOM & Tailwind Animation',
        description: 'Standard web elements with CSS transitions. Best for dashboard, card, and clicker games.',
        value: 'Pure React DOM state with Tailwind CSS motion and Lucide icons. Ideal for UI-heavy simulation and clicker mechanics.',
      },
      {
        label: 'Lightweight 2D Canvas Game Loop (requestAnimationFrame)',
        description: 'Dedicated game update loop for silky smooth entity movement and collision detection.',
        value: 'Custom 60 FPS requestAnimationFrame canvas loop with delta-time physics.',
      },
    ],
    customPlaceholder: 'Any specific technical constraints...',
  },
];
