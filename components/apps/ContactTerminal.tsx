"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, CheckCircle, AlertCircle } from "lucide-react";
import { PERSONAL } from "@/lib/data";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [log, setLog] = useState<string[]>([
    "AashishOS Contact Terminal v1.0",
    "Type your details below and press Send.",
    "─────────────────────────────",
  ]);
  const formRef = useRef<HTMLFormElement>(null);

  const addLog = (line: string) => setLog((prev) => [...prev, line]);

  // Scroll to bottom when log changes
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addLog("ERROR: All fields are required.");
      return;
    }

    setStatus("sending");
    addLog(`> Sending message from ${name} <${email}>...`);
    addLog("> Connecting to mail server...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        addLog("✓ Message delivered successfully!");
        addLog("✓ Aashish will respond within 24 hours.");
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Server error");
      }
    } catch {
      addLog("ERROR: Failed to send message. Try email directly:");
      addLog(`→ ${PERSONAL.email}`);
      setStatus("error");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col p-3 sm:p-6 gap-3 sm:gap-6 min-h-0">
        {/* Terminal log */}
        <div className="terminal flex-1 overflow-y-auto text-xs sm:text-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 pb-3 sm:pb-4 border-b border-[#4fc3f7]/25">
            <Terminal size={18} className="text-[#4fc3f7]" />
            <span className="text-[#4fc3f7]/70 font-mono text-xs">contact.terminal</span>
          </div>
          {log.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`font-mono text-[11px] sm:text-sm ${
                line.startsWith("ERROR")
                  ? "text-red-400"
                  : line.startsWith("✓")
                  ? "text-green-400"
                  : line.startsWith(">")
                  ? "text-[#4fc3f7]"
                  : line.startsWith("→")
                  ? "text-yellow-400"
                  : "text-[#64b5f6]/70"
              }`}
            >
              {line}
            </motion.div>
          ))}
          {status === "sending" && (
            <div className="font-mono text-[11px] sm:text-sm text-[#4fc3f7] flex items-center gap-2 sm:gap-3">
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                ▌
              </motion.span>
              Processing...
            </div>
          )}
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-5 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className="font-mono text-[10px] sm:text-xs text-[#4fc3f7]/70 block mb-2 sm:mb-3">
                --name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                           text-white placeholder-[#64b5f6]/40 text-sm font-mono
                           focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
                disabled={status === "sending" || status === "success"}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] sm:text-xs text-[#4fc3f7]/70 block mb-2 sm:mb-3">
                --email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                           text-white placeholder-[#64b5f6]/40 text-sm font-mono
                           focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
                disabled={status === "sending" || status === "success"}
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] sm:text-xs text-[#4fc3f7]/70 block mb-2 sm:mb-3">
              --message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={3}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                         text-white placeholder-[#64b5f6]/40 text-sm font-mono resize-none
                         focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
              disabled={status === "sending" || status === "success"}
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              id="contact-send-button"
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="flex items-center gap-3 sm:gap-4 px-5 py-3 sm:px-7 sm:py-4 rounded-xl font-mono text-xs sm:text-sm
                         bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.35)]
                         text-[#4fc3f7] active:bg-[rgba(79,195,247,0.3)]
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-400 text-xs sm:text-sm font-mono"
                >
                  <CheckCircle size={18} />
                  Delivered!
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-400 text-xs sm:text-sm font-mono"
                >
                  <AlertCircle size={18} />
                  Failed — email directly
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct contact */}
          <div className="flex flex-wrap gap-3 sm:gap-5 pt-2">
            <a
              href={`mailto:${PERSONAL.email}`}
              className="font-mono text-[10px] sm:text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
            >
              ✉ {PERSONAL.email}
            </a>
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] sm:text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
            >
              ⌥ GitHub
            </a>
            <a
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] sm:text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
            >
              ⌘ LinkedIn
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
