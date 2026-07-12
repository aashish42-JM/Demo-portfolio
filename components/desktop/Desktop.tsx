"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AppWindow } from "@/types";
import StarField from "./StarField";
import AppIcon from "./AppIcon";
import TaskbarComp from "./Taskbar";
import Window from "./Window";
import AboutApp from "@/components/apps/AboutApp";
import ProjectsApp from "@/components/apps/ProjectsApp";
import SkillGalaxy from "@/components/apps/SkillGalaxy";
import MissionDashboard from "@/components/apps/MissionDashboard";
import JourneyApp from "@/components/apps/JourneyApp";
import LogbookApp from "@/components/apps/LogbookApp";
import AchievementsApp from "@/components/apps/AchievementsApp";
import AIAssistant from "@/components/apps/AIAssistant";
import ContactTerminal from "@/components/apps/ContactTerminal";

const INITIAL_APPS: AppWindow[] = [
  { id: "about", title: "About.exe", icon: "👨‍💻", component: "about", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 80, y: 60 }, size: { width: 640, height: 720 } },
  { id: "projects", title: "Projects.exe", icon: "🧪", component: "projects", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 160, y: 80 }, size: { width: 700, height: 750 } },
  { id: "skills", title: "SkillGalaxy.exe", icon: "🪐", component: "skills", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 120, y: 60 }, size: { width: 750, height: 720 } },
  { id: "missions", title: "Missions.exe", icon: "🎯", component: "missions", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 200, y: 80 }, size: { width: 640, height: 750 } },
  { id: "journey", title: "Journey.exe", icon: "⚔️", component: "journey", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 180, y: 70 }, size: { width: 680, height: 750 } },
  { id: "logbook", title: "Logbook.exe", icon: "📖", component: "logbook", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 140, y: 60 }, size: { width: 680, height: 720 } },
  { id: "achievements", title: "Achievements.exe", icon: "🏆", component: "achievements", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 100, y: 70 }, size: { width: 640, height: 700 } },
  { id: "ai", title: "AskAashish.exe", icon: "🤖", component: "ai", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 120, y: 60 }, size: { width: 520, height: 620 } },
  { id: "contact", title: "Contact.exe", icon: "📡", component: "contact", isOpen: false, isMinimized: false, zIndex: 10, position: { x: 150, y: 80 }, size: { width: 680, height: 700 } },
];

let zCounter = 100;

function renderApp(component: string) {
  switch (component) {
    case "about": return <AboutApp />;
    case "projects": return <ProjectsApp />;
    case "skills": return <SkillGalaxy />;
    case "missions": return <MissionDashboard />;
    case "journey": return <JourneyApp />;
    case "logbook": return <LogbookApp />;
    case "achievements": return <AchievementsApp />;
    case "ai": return <AIAssistant />;
    case "contact": return <ContactTerminal />;
    default: return null;
  }
}

export default function Desktop() {
  const [apps, setApps] = useState<AppWindow[]>(INITIAL_APPS);

  const openApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, isOpen: true, isMinimized: false, zIndex: ++zCounter }
          : app
      )
    );
  }, []);

  const closeApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isOpen: false } : app))
    );
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isMinimized: !app.isMinimized } : app
      )
    );
  }, []);

  const focusApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, zIndex: ++zCounter } : app
      )
    );
  }, []);

  const moveApp = useCallback((id: string, pos: { x: number; y: number }) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, position: pos } : app))
    );
  }, []);

  const handleTaskbarClick = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        if (app.isMinimized) return { ...app, isMinimized: false, zIndex: ++zCounter };
        if (app.isOpen) return { ...app, isMinimized: true };
        return { ...app, isOpen: true, zIndex: ++zCounter };
      })
    );
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ paddingBottom: 48 }}>
      {/* Background */}
      <div className="absolute inset-0 bg-[#050816]">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(17,34,64,0.8)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(10,25,47,0.6)_0%,transparent_60%)]" />
        <StarField />
      </div>

      {/* Desktop area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Flex container for sidebars and center grid */}
        <div className="flex h-full">
          {/* Left decorative sidebar */}
          <div className="flex flex-col justify-center items-center w-24 gap-4 pointer-events-none">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(79,195,247,0.15)] to-[rgba(17,34,64,0.6)] border border-[rgba(79,195,247,0.2)] backdrop-blur-sm flex items-center justify-center text-[#4fc3f7]/40"
              >
                {["◈", "◇", "✧"][i - 1]}
              </motion.div>
            ))}
          </div>

          {/* Center: welcome message and app grid */}
          <div className="flex-1 relative">
            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
            >
              <p className="font-mono text-xs text-[#4fc3f7]/30 tracking-[0.3em] uppercase">
                Welcome to AashishOS v1.0 — Click any app to begin
              </p>
            </motion.div>

            {/* App icons grid */}
            <div className="desktop-grid">
              {apps.map((app, index) => (
                <AppIcon key={app.id} app={app} onOpen={openApp} index={index} />
              ))}
            </div>
          </div>

          {/* Right decorative sidebar */}
          <div className="flex flex-col justify-center items-center w-24 gap-4 pointer-events-none">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(79,195,247,0.15)] to-[rgba(17,34,64,0.6)] border border-[rgba(79,195,247,0.2)] backdrop-blur-sm flex items-center justify-center text-[#4fc3f7]/40"
              >
                {["✦", "◆", "✧"][i - 1]}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Windows */}
        {apps.map((app) => (
          <Window
            key={app.id}
            window={app}
            onClose={closeApp}
            onMinimize={minimizeApp}
            onFocus={focusApp}
            onMove={moveApp}
          >
            {renderApp(app.component)}
          </Window>
        ))}
      </div>

      {/* Taskbar */}
      <TaskbarComp apps={apps} onAppClick={handleTaskbarClick} />
    </div>
  );
}
