import React, { useState } from 'react';
import { GameSpec } from '../types/gameDesign';
import { Sparkles, Send, X, Bot, User, Loader2, Lightbulb, HelpCircle } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: GameSpec;
  initialPrompt?: string;
  onApplyIdea?: (pitch: string, title: string) => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  spec,
  initialPrompt,
  onApplyIdea,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hi! I'm your Game Design & Prompt Engineering Co-Pilot. As a business student, you don't need any coding or game-dev jargon—I'll explain every concept in plain English and help you pick fun mechanics. What are you thinking of making, or do you want me to suggest 3 high-potential ideas?",
    },
  ]);
  const [inputVal, setInputVal] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string, actionType: 'chat' | 'suggest_ideas' | 'refine_spec' = 'chat') => {
    if (!textToSend.trim() && actionType === 'chat') return;

    const userMsg = textToSend || (actionType === 'suggest_ideas' ? 'Suggest 3 business game ideas' : 'Refine my game specification');
    const updatedMessages = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(updatedMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          message: userMsg,
          currentSpec: spec,
          history: updatedMessages.slice(-4),
        }),
      });

      if (!res.ok) {
        throw new Error('AI assistant response error');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.text || "I've reviewed your request! Let's continue refining your core loop and mechanics.",
        },
      ]);
    } catch (err) {
      console.error(err);
      // Fallback friendly guidance if offline or API key not attached
      let fallbackText = "Here is my advice: For your game idea, keep the core loop under 15 seconds: Action (tap/click) -> Immediate Feedback (sound/points) -> Reinvestment (shop upgrade). This keeps player retention high without unnecessary code complexity!";
      if (actionType === 'suggest_ideas') {
        fallbackText = `Here are 3 accessible, high-fun game ideas for business students:

1. **Coffee Cart Tycoon**: Click to brew espresso, serve waiting students before class, adjust prices when it rains, and buy auto-steamers.
2. **Supply Chain Rush**: Reroute ships around blocked canals, clear port queues, and keep global manufacturing factories from shutting down.
3. **Angel Pitch Elevator**: Steer a startup founder up a skyscraper elevator, dodging buzzwords ('Synergy!') and collecting Term Sheets to reach $1B Unicorn status.`;
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackText,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Game Design Co-Pilot
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Plain-English Game Advice & Brainstorming for Business Students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2.5 bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 shrink-0">
            Quick Prompts:
          </span>
          <button
            onClick={() => sendMessage('', 'suggest_ideas')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-800 dark:text-purple-200 rounded-lg border border-purple-200 dark:border-purple-800 shrink-0 font-medium transition-colors"
          >
            💡 Brainstorm 3 Ideas
          </button>
          <button
            onClick={() => sendMessage('', 'refine_spec')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-800 dark:text-purple-200 rounded-lg border border-purple-200 dark:border-purple-800 shrink-0 font-medium transition-colors"
          >
            🔍 Simplify My Spec
          </button>
          <button
            onClick={() => sendMessage('What makes a good 3-minute casual game addictive?')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-800 dark:text-purple-200 rounded-lg border border-purple-200 dark:border-purple-800 shrink-0 font-medium transition-colors"
          >
            ✨ What is Game Feel?
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Co-pilot is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputVal, 'chat');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about game rules, win conditions, or simplifying mechanics..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
