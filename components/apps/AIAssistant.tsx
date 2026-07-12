"use client";

import { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(79,195,247,0.15)] flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4fc3f7]/30 to-[#0a192f] flex items-center justify-center border border-[rgba(79,195,247,0.35)]">
              <Bot size={28} className="text-[#4fc3f7]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-[#050816]" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">AashishAI</h2>
            <p className="font-mono text-xs text-[#4fc3f7]/70">Powered by Groq · llama-3.3-70b</p>
          </div>
          <div className="ml-auto flex items-center gap-3 px-5 py-3 rounded-full bg-green-400/10 border border-green-400/25">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-base
                            ${
                              msg.role === "assistant"
                                ? "bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.25)]"
                                : "bg-[rgba(100,181,246,0.25)] border border-[rgba(100,181,246,0.35)]"
                            }`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={24} className="text-[#4fc3f7]" />
                ) : (
                  <User size={24} className="text-[#64b5f6]" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] px-5 py-4 text-base leading-relaxed
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.25)] flex items-center justify-center">
                  <Bot size={24} className="text-[#4fc3f7]" />
                </div>
                <div className="chat-ai px-5 py-4 flex items-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-[#4fc3f7]/70"
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
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={16} className="text-[#4fc3f7]/60" />
              <span className="font-mono text-xs text-[#4fc3f7]/60">Suggested</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs font-mono px-5 py-3 rounded-full
                             bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.25)]
                             text-[#90caf9]/80 hover:bg-[rgba(79,195,247,0.18)] hover:text-[#4fc3f7]
                             transition-all duration-250"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-[rgba(79,195,247,0.15)]">
          <div className="flex gap-4">
            <input
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask Aashish anything..."
              className="flex-1 px-5 py-4 rounded-2xl bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.25)]
                         text-white placeholder-[#64b5f6]/40 text-base font-mono
                         focus:outline-none focus:border-[rgba(79,195,247,0.6)] focus:bg-[rgba(79,195,247,0.1)]
                         transition-all duration-250"
              disabled={isLoading}
            />
            <button
              id="ai-send-button"
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 rounded-2xl bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.35)]
                         flex items-center justify-center text-[#4fc3f7]
                         hover:bg-[rgba(79,195,247,0.3)] hover:border-[rgba(79,195,247,0.6)]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-250"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
