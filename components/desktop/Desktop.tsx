"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppWindow } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import StarField from "./StarField";
import AppIcon from "./AppIcon";
import TaskbarComp from "./Taskbar";
import Window from "./Window";
import MobileNav from "@/components/mobile/MobileNav";
import HomeDashboard from "@/components/mobile/HomeDashboard";
import GalaxyLauncher from "@/components/mobile/GalaxyLauncher";
import MobileAppView from "@/components/mobile/MobileAppView";
import FloatingAIButton from "@/components/mobile/FloatingAIButton";
import AboutApp from "@/components/apps/AboutApp";
import ProjectsApp from "@/components/apps/ProjectsApp";
import SkillGalaxy from "@/components/apps/SkillGalaxy";
import MissionDashboard from "@/components/apps/MissionDashboard";
import JourneyApp from "@/components/apps/JourneyApp";
import LogbookApp from "@/components/apps/LogbookApp";
import AchievementsApp from "@/components/apps/AchievementsApp";
import AIAssistant from "@/components/apps/AIAssistant";
import ContactTerminal from "@/components/apps/ContactTerminal";
import BootScreen from "./BootScreen";
import AIWelcome from "./AIWelcome";

import {
  getDefaultWindowSize,
  getCenteredPosition,
  clampWindowSize,
} from "@/lib/windowConfig";

const createApp = (
  id: string,
  title: string,
  icon: string,
  component: string
): AppWindow => {
  const size = getDefaultWindowSize();
  const position = getCenteredPosition(size);
  return {
    id,
    title,
    icon,
    component,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position,
    size,
    restoredPosition: position,
    restoredSize: size,
  };
};

const INITIAL_APPS: AppWindow[] = [
  createApp("about", "About.exe", "👨‍💻", "about"),
  createApp("projects", "Projects.exe", "🧪", "projects"),
  createApp("skills", "SkillGalaxy.exe", "🪐", "skills"),
  createApp("missions", "Missions.exe", "🎯", "missions"),
  createApp("journey", "Journey.exe", "⚔️", "journey"),
  createApp("logbook", "Logbook.exe", "📖", "logbook"),
  createApp("achievements", "Achievements.exe", "🏆", "achievements"),
  createApp("ai", "AskAashish.exe", "🤖", "ai"),
  createApp("contact", "Contact.exe", "📡", "contact"),
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
  const isMobile = useIsMobile();
  const [apps, setApps] = useState<AppWindow[]>(INITIAL_APPS);
  const [focusedAppId, setFocusedAppId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutDownState, setShutDownState] = useState<"idle" | "confirming" | "shutdown" | "reboot">("idle");
  const [bootStage, setBootStage] = useState<"boot" | "welcome" | "desktop">("desktop");
  const [showDesktop, setShowDesktop] = useState(false);

  // Mobile state — "home" | "galaxy" | "contact" | app-id
  const [mobileActiveTab, setMobileActiveTab] = useState("home");
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>(null);

  // Handle intro - skip boot screen, go straight to welcome
  useEffect(() => {
    setBootStage("welcome");
    setShowDesktop(false);
  }, []);

  const handleBootComplete = () => {
    setBootStage("welcome");
  };

  const handleWelcomeComplete = (action?: "explore" | "ask-ai" | "resume") => {
    setBootStage("desktop");
    setShowDesktop(true);
    if (action === "ask-ai") {
      if (isMobile) {
        setMobileOpenAppId("ai");
        setMobileActiveTab("ai");
      } else {
        setApps((prev) =>
          prev.map((app) =>
            app.id === "ai"
              ? { ...app, isOpen: true, isMinimized: false, isMaximized: false, zIndex: ++zCounter }
              : app
          )
        );
        setFocusedAppId("ai");
      }
    }
  };

  const handleSkip = () => {
    setBootStage("desktop");
    setShowDesktop(true);
  };

  // Desktop handlers
  const openApp = useCallback((id: string) => {
    const size = getDefaultWindowSize();
    const centeredPos = getCenteredPosition(size);
    setApps((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              zIndex: ++zCounter,
              position: centeredPos,
              size,
              restoredPosition: centeredPos,
              restoredSize: size,
            }
          : app
      )
    );
    setFocusedAppId(id);
  }, []);

  const closeApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isOpen: false, isMinimized: false, isMaximized: false } : app
      )
    );
    setFocusedAppId((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isMinimized: true } : app
      )
    );
  }, []);

  const focusApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, zIndex: ++zCounter } : app
      )
    );
    setFocusedAppId(id);
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        if (app.isMaximized) {
          return {
            ...app,
            isMaximized: false,
            position: app.restoredPosition,
            size: app.restoredSize,
          };
        }
        return {
          ...app,
          isMaximized: true,
          restoredPosition: app.position,
          restoredSize: app.size,
        };
      })
    );
    setFocusedAppId(id);
  }, []);

  const moveApp = useCallback((id: string, pos: { x: number; y: number }) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, position: pos } : app))
    );
  }, []);

  const resizeApp = useCallback((id: string, size: { width: number; height: number }) => {
    const clamped = clampWindowSize(size);
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, size: clamped } : app))
    );
  }, []);

  const handleTaskbarClick = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        if (app.isMinimized) return { ...app, isMinimized: false, zIndex: ++zCounter };
        if (app.isOpen) return { ...app, isMinimized: true };
        const size = getDefaultWindowSize();
        const position = getCenteredPosition(size);
        return {
          ...app,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: ++zCounter,
          position,
          size,
          restoredPosition: position,
          restoredSize: size,
        };
      })
    );
    setFocusedAppId(id);
  }, []);

  // Mobile handlers
  const handleMobileOpenApp = useCallback((id: string) => {
    setMobileOpenAppId(id);
    setMobileActiveTab(id);
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isOpen: true } : { ...app, isOpen: false }
      )
    );
  }, []);

  const handleMobileCloseApp = useCallback(() => {
    setMobileOpenAppId(null);
    setMobileActiveTab("galaxy");
    setApps((prev) =>
      prev.map((app) => ({ ...app, isOpen: false }))
    );
  }, []);

  const handleMobileTabChange = useCallback((tab: string) => {
    if (tab === "home") {
      setMobileActiveTab("home");
      setMobileOpenAppId(null);
      setApps((prev) => prev.map((app) => ({ ...app, isOpen: false })));
    } else if (tab === "core") {
      setMobileActiveTab("galaxy");
      setMobileOpenAppId(null);
      setApps((prev) => prev.map((app) => ({ ...app, isOpen: false })));
    } else if (tab === "contact") {
      handleMobileOpenApp("contact");
    }
  }, [handleMobileOpenApp]);

  const handleMobileOpenFromGalaxy = useCallback((id: string) => {
    if (id === "ai") {
      handleMobileOpenApp("ai");
    } else {
      handleMobileOpenApp(id);
    }
  }, [handleMobileOpenApp]);

  const handleMobileFloatAITap = useCallback(() => {
    setMobileActiveTab("galaxy");
    setMobileOpenAppId(null);
    setApps((prev) => prev.map((app) => ({ ...app, isOpen: false })));
  }, []);

  const handleMobileFloatAILongPress = useCallback(() => {
    handleMobileOpenApp("ai");
  }, [handleMobileOpenApp]);

  const mobileOpenApp = mobileOpenAppId ? apps.find((a) => a.id === mobileOpenAppId) ?? null : null;
  const showGalaxyLauncher = mobileActiveTab === "galaxy" && !mobileOpenApp;
  const showHomeDashboard = mobileActiveTab === "home" && !mobileOpenApp;
  const showMobileNav = !mobileOpenApp || mobileActiveTab === "contact";

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ paddingBottom: isMobile ? 0 : 48 }}>
      {/* Boot Screens */}
      <AnimatePresence mode="wait">
        {bootStage === "boot" && (
          <BootScreen key="boot" onComplete={handleBootComplete} onSkip={handleSkip} />
        )}
        {bootStage === "welcome" && (
          <AIWelcome key="welcome" onComplete={handleWelcomeComplete} onSkip={handleSkip} />
        )}
      </AnimatePresence>

      {/* Desktop Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDesktop ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#050816]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(17,34,64,0.8)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(10,25,47,0.6)_0%,transparent_60%)]" />
          <StarField />
        </div>

      {/* ═══════════════ MOBILE LAYOUT ═══════════════ */}
      {isMobile ? (
        <>
          {/* Home Dashboard */}
          <AnimatePresence mode="wait">
            {showHomeDashboard && (
              <HomeDashboard key="home" />
            )}
          </AnimatePresence>

          {/* Galaxy Launcher with AI Core Orb */}
          <AnimatePresence mode="wait">
            {showGalaxyLauncher && (
              <GalaxyLauncher
                key="galaxy"
                onOpenApp={handleMobileOpenFromGalaxy}
                onOpenAI={() => handleMobileOpenApp("ai")}
              />
            )}
          </AnimatePresence>

          {/* Mobile Fullscreen App View */}
          <AnimatePresence mode="wait">
            {mobileOpenApp && (
              <MobileAppView
                key={mobileOpenApp.id}
                app={mobileOpenApp}
                onClose={handleMobileCloseApp}
              >
                {renderApp(mobileOpenApp.component)}
              </MobileAppView>
            )}
          </AnimatePresence>

          {/* Mobile Bottom Nav */}
          <MobileNav activeTab={mobileActiveTab} onTabChange={handleMobileTabChange} />

          {/* Floating AI Button */}
          <AnimatePresence>
            {mobileActiveTab !== "galaxy" && !mobileOpenApp && (
              <FloatingAIButton
                onTap={handleMobileFloatAITap}
                onLongPress={handleMobileFloatAILongPress}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
      /* ═══════════════ DESKTOP LAYOUT ═══════════════ */
      <>
        {/* Desktop area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Floating info widget (top left) */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute top-6 left-6 z-20"
          >
            <div className="glass p-4 rounded-2xl border border-[rgba(79,195,247,0.3)] shadow-[0_0_30px_rgba(79,195,247,0.15)] backdrop-blur-md">
              <p className="font-mono text-sm text-[#4fc3f7] mb-1">Welcome back, Aashish</p>
              <p className="font-mono text-[10px] text-[#64b5f6]/70 mb-2">BSc CSIT Student | AI Developer</p>
              <p className="font-mono text-[10px] text-[#90caf9]/50 mb-3">Building AI-powered applications</p>
              <button
                onClick={() => {
                  localStorage.removeItem("aashishos-has-visited");
                  window.location.reload();
                }}
                className="font-mono text-[9px] text-[#4fc3f7]/60 hover:text-[#4fc3f7] transition-colors"
              >
                Replay intro
              </button>
            </div>
          </motion.div>

          {/* Status indicators (bottom right) */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute bottom-16 right-6 z-20 pointer-events-none"
          >
            <div className="glass px-4 py-3 rounded-2xl border border-[rgba(79,195,247,0.25)] backdrop-blur-md flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
                <span className="font-mono text-[10px] text-[#90caf9]/70">System Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4fc3f7] shadow-[0_0_8px_rgba(79,195,247,0.7)]" />
                <span className="font-mono text-[10px] text-[#90caf9]/70">AI Assistant Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#90caf9]/50" />
                <span className="font-mono text-[10px] text-[#64b5f6]/60">Portfolio v1.0</span>
              </div>
            </div>
          </motion.div>

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
              isFocused={focusedAppId === app.id}
              onClose={closeApp}
              onMinimize={minimizeApp}
              onFocus={focusApp}
              onMove={moveApp}
              onResize={resizeApp}
              onToggleMaximize={toggleMaximize}
            >
              {app.isOpen && !app.isMinimized && renderApp(app.component)}
            </Window>
          ))}
        </div>

        {/* Taskbar */}
        <TaskbarComp
          apps={apps}
          onAppClick={handleTaskbarClick}
          startMenuOpen={startMenuOpen}
          setStartMenuOpen={setStartMenuOpen}
          openApp={openApp}
          setShutDownState={setShutDownState}
        />
      </>
      )}

      {/* Shutdown Confirmation/Overlay */}
      {shutDownState !== "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => shutDownState === "shutdown" && setShutDownState("idle")}
        >
          {shutDownState === "confirming" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-8 rounded-2xl border border-[rgba(79,195,247,0.4)] shadow-[0_0_60px_rgba(79,195,247,0.2)] max-w-md w-full mx-4"
            >
              <h2 className="text-[#4fc3f7] font-mono text-xl mb-2">System Prompt</h2>
              <p className="text-[#90caf9]/80 font-mono text-sm mb-6">
                Are you sure you want to shut down AashishOS?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShutDownState("idle")}
                  className="px-6 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-mono text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShutDownState("shutdown")}
                  className="px-6 py-2 rounded-lg bg-[#4fc3f7]/20 border border-[#4fc3f7]/40 text-[#4fc3f7] hover:bg-[#4fc3f7]/30 font-mono text-sm transition-all"
                >
                  Shutdown
                </button>
              </div>
            </motion.div>
          )}

          {shutDownState === "shutdown" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[#4fc3f7] font-mono text-3xl mb-4"
              >
                System Offline...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="text-[#90caf9]/60 font-mono text-lg"
              >
                Click anywhere to boot AashishOS
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}
