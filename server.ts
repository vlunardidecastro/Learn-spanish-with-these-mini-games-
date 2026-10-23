import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
}) : null;

// Server-side AI assist endpoint for game design suggestions & prompt generation
app.post('/api/ai/assist', async (req, res) => {
  try {
    const { action, currentSpec, message, history } = req.body;
    
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment variables.',
      });
    }

    let prompt = '';
    const systemInstruction = `You are a supportive, insightful Game Design & Prompt Engineering Assistant specialized in helping business students turn raw ideas into clear, production-ready game specifications and prompts for AI coding agents (Google AI Studio, Codex).
Explain game-dev concepts in plain, intuitive English (use business or everyday metaphors if helpful).
Keep answers crisp, encouraging, structured, and practical.`;

    if (action === 'chat') {
      prompt = `Here is the current game draft state:
${JSON.stringify(currentSpec, null, 2)}

User question or idea:
"${message}"

Recent conversation:
${JSON.stringify(history || [])}

Respond conversationally, friendly, and clearly. If introducing any game term, define it in 1 sentence and provide 2-3 simple options with a recommended pick. Keep response focused and under 250 words.`;
    } else if (action === 'suggest_ideas') {
      prompt = `The user is a business student with a theme or seed: "${message || currentSpec?.title || 'Business Simulation / Strategy'}".
Suggest 3 catchy, high-fun, accessible game concepts. For each:
- Title
- One-sentence pitch
- Core mechanic (what the player repeatedly clicks/does)
- Why it's fun
- Recommended simplicity rating (1-5 stars)`;
    } else if (action === 'refine_spec') {
      prompt = `Analyze this game specification draft:
${JSON.stringify(currentSpec, null, 2)}

Provide:
1. Executive Summary & One-sentence concept
2. The Core Loop: Action -> Feedback -> Reward/Consequence -> Repeat
3. Scope & Simplification suggestions: Identify anything overly complex for a first build and suggest a simpler alternative.
4. Technical recommendation (plain English explanation of why HTML5 Canvas/React with Web Audio is optimal).
5. 6-8 easy tuning knobs (parameters the student can modify later like game speed, spawn rate, timer, profit margin).`;
    } else {
      prompt = message;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate AI response' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
