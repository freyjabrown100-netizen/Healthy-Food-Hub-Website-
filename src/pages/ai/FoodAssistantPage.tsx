import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../../store/aiStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  BrainCircuit,
  Lock,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FoodAssistantPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    chatMessages,
    appendMessage,
    clearChat,
    guestUsageCount,
    incrementGuestUsage,
    enableDeepThinking,
    setDeepThinking,
  } = useAIStore();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGuest = !user;
  const isGuestLocked = isGuest && guestUsageCount >= 3;

  const starterChips = [
    "What's a quick 20-minute healthy dinner?",
    'High-protein vegetarian meals for muscle growth?',
    'Healthy low-calorie swaps for mayonnaise & sour cream?',
    'How do I calculate my optimal protein intake?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    if (isGuestLocked) return;

    setInputMessage('');
    appendMessage('user', text.trim());
    setLoading(true);
    setErrorToast(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: text.trim() }],
          userPreferences: user?.dietaryPreferences?.join(', ') || 'Healthy, whole foods',
          deepThinking: enableDeepThinking,
        }),
      });

      if (res.status === 429) {
        setErrorToast('Guest limit reached. Please register for free unlimited AI conversations!');
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.reply) {
        appendMessage('assistant', data.reply, enableDeepThinking);
        if (isGuest) {
          incrementGuestUsage();
        }
      } else {
        setErrorToast('Could not reach AI assistant. Please try again.');
      }
    } catch {
      setErrorToast('Network error while communicating with AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 flex flex-col h-[calc(100vh-140px)] min-h-[640px]">
      {/* Header bar with AI Banner Background */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-violet-800/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
        <img
          src="https://cdn.phototourl.com/member/2026-10-23-8a4b8b11-f83a-4a0a-949c-37d3cccc4b26.jpg"
          alt="AI Assistant Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-violet-950/85 to-slate-950/80" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              AI Food & Nutrition Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-200 mt-1">
            Grounded in scientific clinical nutrition, chef culinary hacks, and macro precision.
          </p>
        </div>

        {/* Deep Thinking Mode Toggle */}
        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setDeepThinking(!enableDeepThinking)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              enableDeepThinking
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 backdrop-blur-sm'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Thinking: {enableDeepThinking ? 'HIGH (Argon)' : 'Fast (Flash)'}</span>
          </button>

          <button
            onClick={clearChat}
            aria-label="Clear chat history"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="relative flex-1 overflow-y-auto space-y-4 pr-2">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div
                  className={`flex items-center justify-between text-[10px] mt-2 pt-1 border-t ${
                    isUser
                      ? 'border-emerald-500/50 text-emerald-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isThinkingMode && (
                    <span className="flex items-center gap-1 font-mono-numbers">
                      <BrainCircuit className="w-3 h-3 text-violet-400" /> High Thinking
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-tl-none flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-2">Reasoning through nutrition science...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Guest Lock Overlay */}
        {isGuestLocked && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex items-center justify-center p-6 text-center z-20">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Guest Limit Reached (3/3)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign up free to unlock unlimited AI conversation turns and save favorite recipes to your dashboard.
              </p>
              <Link to="/register">
                <Button variant="primary" className="w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Starter Suggestions Chips */}
      {chatMessages.length <= 2 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {starterChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:border-violet-300 transition-colors text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {errorToast && (
        <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200">
          {errorToast}
        </p>
      )}

      {/* Fixed Bottom Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <input
          type="text"
          value={inputMessage}
          disabled={isGuestLocked || loading}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isGuestLocked
              ? 'Please sign in to continue chatting...'
              : 'Ask a nutrition question or request a healthy swap...'
          }
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="ai"
          disabled={!inputMessage.trim() || isGuestLocked || loading}
          icon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
