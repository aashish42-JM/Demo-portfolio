"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Who are you?",
  "What projects have you built?",
  "What are your future goals?",
  "What technologies are you learning?",
  "Tell me about Career-Tantra",
  "What's your mission?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm AashishAI — a digital version of Aashish Timalsina. Ask me anything about my projects, skills, goals, or journey. I'm here to help you get to know the real Aashish!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle virtual keyboard on mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onResize = () => {
      // When keyboard opens, scroll input into view
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    };

    const onVisualViewport = () => {
      // When virtual keyboard shows/hides on iOS/Android
      if (window.visualViewport) {
        onResize();
      }
    };

    window.visualViewport?.addEventListener?.("resize", onVisualViewport);
    return () => {
      window.visualViewport?.removeEventListener?.("resize", onVisualViewport);
    };
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hmm, my AI core seems to be offline right now. Please add a GROQ_API_KEY to .env.local to enable me! 🔧",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="px-4 py-3 sm:p-6 border-b border-[rgba(79,195,247,0.15)] flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#4fc3f7]/30 to-[#0a192f] flex items-center justify-center border border-[rgba(79,195,247,0.35)]">
              <Bot size={22} className="text-[#4fc3f7]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-green-500 border-2 sm:border-4 border-[#050816]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-sm sm:text-xl text-white">AashishAI</h2>
            <p className="font-mono text-[9px] sm:text-xs text-[#4fc3f7]/70 truncate">Powered by Groq · llama-3.3-70b</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-3 rounded-full bg-green-400/10 border border-green-400/25">
            <div className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[9px] sm:text-xs text-green-400 hidden sm:inline">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 sm:p-6 space-y-5 sm:space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-base
                            ${
                              msg.role === "assistant"
                                ? "bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.25)]"
                                : "bg-[rgba(100,181,246,0.25)] border border-[rgba(100,181,246,0.35)]"
                            }`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={18} className="text-[#4fc3f7]" />
                ) : (
                  <User size={18} className="text-[#64b5f6]" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 sm:px-5 sm:py-4 text-[13px] sm:text-base leading-relaxed
                            ${msg.role === "user" ? "chat-user text-white" : "chat-ai text-[#90caf9]"}`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.25)] flex items-center justify-center">
                  <Bot size={22} className="text-[#4fc3f7]" />
                </div>
                <div className="chat-ai px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4fc3f7]/70"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-2 sm:pb-4 shrink-0">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <Sparkles size={13} className="text-[#4fc3f7]/60" />
              <span className="font-mono text-[9px] sm:text-xs text-[#4fc3f7]/60">Suggested</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] sm:text-xs font-mono px-2.5 sm:px-5 py-1.5 sm:py-3 rounded-full
                             bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.25)]
                             text-[#90caf9]/80 active:bg-[rgba(79,195,247,0.2)] active:text-[#4fc3f7]
                             transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input - fixed at bottom */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-[rgba(79,195,247,0.15)] shrink-0 bg-[#050816]/90 backdrop-blur-sm">
          <div className="flex gap-2 sm:gap-4">
            <input
              ref={inputRef}
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask Aashish anything..."
              className="flex-1 px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.25)]
                         text-white placeholder-[#64b5f6]/40 text-sm sm:text-base font-mono
                         focus:outline-none focus:border-[rgba(79,195,247,0.6)] focus:bg-[rgba(79,195,247,0.1)]
                         transition-all duration-200"
              disabled={isLoading}
            />
            <button
              id="ai-send-button"
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.35)]
                         flex items-center justify-center text-[#4fc3f7]
                         active:bg-[rgba(79,195,247,0.3)] active:border-[rgba(79,195,247,0.6)]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-150"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
