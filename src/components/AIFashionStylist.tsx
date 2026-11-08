import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: Product[];
}

interface AIFashionStylistProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}

export const AIFashionStylist: React.FC<AIFashionStylistProps> = ({
  isOpen,
  onClose,
  onOpenProduct
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am your TechNova AI Gadget Expert. Looking for the best electric trimmer, neck massager, electric kettle, or smart gadgets with same-day delivery in Dhaka? How may I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Best hair trimmer for beard trimming?',
    'Which electric kettle is best for office?',
    'What is your warranty & return policy?',
    'How fast is same-day delivery in Dhaka?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history })
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || "I'd be pleased to help you refine your style. Let me know what occasion you are dressing for.",
        recommendedProducts: data.recommendedProducts
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Stylist chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: "I apologize, my atelier connection was momentarily interrupted. However, our signature velvet panjabis and handloom Jamdani collections are currently available for immediate dispatch across Bangladesh."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col justify-end sm:justify-start">
      {/* Mobile Backdrop */}
      <div
        className="sm:hidden fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:w-[420px] h-[88vh] sm:h-[580px] bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
        {/* Mobile Drag Bar */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>TechNova AI Gadget Expert</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600/30 text-red-400 font-sans uppercase font-bold">
                  Gemini 3.8
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">Specs, Warranty &amp; Smart Shopping Advisor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close stylist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                      : 'bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-tl-none font-light'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Recommended Products */}
              {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                <div className="mt-2.5 ml-8 space-y-2 w-[85%]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended Garments:
                  </span>
                  <div className="space-y-2">
                    {m.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onOpenProduct(p);
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer flex items-center gap-2.5 transition group min-h-[48px]"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold block">
                            {p.category}
                          </span>
                          <h5 className="text-[11px] font-medium text-white truncate group-hover:text-amber-400 transition">
                            {p.title}
                          </h5>
                          <p className="text-[11px] font-mono font-bold text-neutral-200 mt-0.5">
                            ৳{(p.salePrice ?? p.price).toLocaleString('en-BD')}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-400 ml-8 text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Aura is curating styling advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Horizontal Scroller */}
        <div className="px-3 py-2 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 border border-neutral-700/60 transition whitespace-nowrap min-h-[36px]"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 safe-area-bottom"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for sizing, fabrics, matching pairs..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
