import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  Zap, 
  Languages,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, DiscoCode } from '../types';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDisco: DiscoCode;
  language: 'EN' | 'UR' | 'RU';
  initialContext?: any;
}

const PRESET_PROMPTS = [
  'How to keep my bill under 200 protected units?',
  'Is 1.5 Ton Inverter AC cheaper than 2 fans?',
  'What are peak hours today in my DISCO?',
  'How to apply for Solar Net Metering?',
  'How is Fuel Price Adjustment (FPA) calculated?'
];

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  selectedDisco,
  language,
  initialContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Assalamu Alaikum! I am **ElectraCoach AI ⚡**, your personal Pakistani electricity bill, solar, and DISCO tariff advisor. How can I help you reduce your power bill today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages,
          context: {
            disco: selectedDisco,
            language,
            ...initialContext,
          },
          language,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || 'I apologize, I could not generate a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Coach endpoint failed:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I encountered an issue connecting to the ElectraCoach AI server. Please verify your GEMINI_API_KEY settings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base">ElectraCoach AI</h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                  {selectedDisco}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gemini 3.6 Powered Electricity Coach</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Badges Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700 whitespace-nowrap transition-colors text-[11px] font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-1'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[10px] block text-right mt-1 opacity-60 ${
                  msg.sender === 'user' ? 'text-slate-950' : 'text-slate-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>ElectraCoach AI is typing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about bills, inverter ACs, solar, or LESCO tariffs..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
