import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ChefHat, 
  Utensils, 
  Calendar, 
  CreditCard,
  Flame,
  Bot
} from 'lucide-react';

interface AiCulinaryConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDishRecommendation?: (dishName: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AiCulinaryConcierge: React.FC<AiCulinaryConciergeProps> = ({
  isOpen,
  onClose,
  onSelectDishRecommendation,
}) => {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Nchinda! Welcome to Bamenda Dine & Track. I am Chef Bih, your culinary guide for authentic Abakwa delicacies. Whether you crave royal Achu yellow soup with smoked kanda, flame-charred Kati Kati with fufu corn, or a sunset table in Up Station, ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    "What is the story behind Achu Yellow Soup?",
    "Recommend a traditional meal for 4 guests",
    "What is Kati Kati and how is it prepared?",
    "Best table with a sunset view in Up Station",
    "How does secure delivery OTP and MoMo payment work?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Achu and Kati Kati are the pride of Bamenda! Try them today with fresh palm wine.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "In Bamenda, our greatest feasts feature Royal Achu with golden limestone soup, tender kanda, and charred Kati Kati with steaming fufu corn and jamajama greens. You can reserve a table or order direct delivery with MTN MoMo or Orange Money!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="ai-concierge-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">
                  Chef Bih • Abakwa Culinary Concierge
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Powered by Gemini AI • Grassfields Gastronomy
              </p>
            </div>
          </div>
          <button
            id="btn-close-ai-concierge"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="bg-emerald-50/60 p-2.5 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-emerald-900 font-bold flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-emerald-100/70 text-emerald-900 rounded-lg border border-emerald-200 transition-colors shadow-2xs text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-amber-600 text-white' : 'bg-emerald-800 text-amber-300'
              }`}>
                {msg.sender === 'user' ? '👤' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[9px] block mt-1 ${
                  msg.sender === 'user' ? 'text-amber-200 text-right' : 'text-slate-400'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-xs flex-shrink-0">
                <ChefHat className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-500 border border-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-200"></span>
                <span className="text-[11px] ml-1">Chef Bih is crafting a recommendation...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about Achu, Kati Kati, table reservations, palm wine..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              id="btn-send-ai-message"
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
