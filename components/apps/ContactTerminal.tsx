"use client";

import { useState } from "react";
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

  const addLog = (line: string) => setLog((prev) => [...prev, line]);

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
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Terminal log */}
      <div className="terminal flex-1 overflow-y-auto text-sm space-y-2">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#4fc3f7]/25">
          <Terminal size={18} className="text-[#4fc3f7]" />
          <span className="text-[#4fc3f7]/70 font-mono">contact.terminal</span>
        </div>
        {log.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={`font-mono ${
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
          <div className="font-mono text-[#4fc3f7] flex items-center gap-2">
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#4fc3f7]/70 block mb-2">
              --name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                         text-white placeholder-[#64b5f6]/40 text-sm font-mono
                         focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
              disabled={status === "sending" || status === "success"}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[#4fc3f7]/70 block mb-2">
              --email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                         text-white placeholder-[#64b5f6]/40 text-sm font-mono
                         focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
              disabled={status === "sending" || status === "success"}
            />
          </div>
        </div>
        <div>
          <label className="font-mono text-xs text-[#4fc3f7]/70 block mb-2">
            --message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[rgba(79,195,247,0.25)]
                       text-white placeholder-[#64b5f6]/40 text-sm font-mono resize-none
                       focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-all"
            disabled={status === "sending" || status === "success"}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            id="contact-send-button"
            type="submit"
            disabled={status === "sending" || status === "success"}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-sm
                       bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.35)]
                       text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.3)]
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
                className="flex items-center gap-2 text-green-400 text-sm font-mono"
              >
                <CheckCircle size={18} />
                Delivered!
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm font-mono"
              >
                <AlertCircle size={18} />
                Failed — email directly
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct contact */}
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={`mailto:${PERSONAL.email}`}
            className="font-mono text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
          >
            ✉ {PERSONAL.email}
          </a>
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
          >
            ⌥ GitHub
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#64b5f6]/70 hover:text-[#4fc3f7] transition-all"
          >
            ⌘ LinkedIn
          </a>
        </div>
      </form>
    </div>
  );
}
