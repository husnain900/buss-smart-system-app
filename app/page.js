"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import TopBar from "@/components/TopBar";
import FleetControlRoom from "@/components/FleetControlRoom";
import TeacherDemoBar from "@/components/TeacherDemoBar";
import ThesisReader from "@/components/ThesisReader";
import Footer from "@/components/Footer";
import AboutModal from "@/components/AboutModal";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [currentView, setCurrentView] = useState("fleet"); // fleet, thesis, demo
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [demoScenario, setDemoScenario] = useState(null);
  const [activeAlertCount, setActiveAlertCount] = useState(1); // 1 baseline alert (simulated stream)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleRunDemoScenario = (scenarioId) => {
    setDemoScenario(scenarioId);
    if (scenarioId === "low_tyre" || scenarioId === "overcrowding" || scenarioId === "door_interlock") {
      setActiveAlertCount((prev) => prev + 1);
    }
  };

  const handleResetDemo = () => {
    setDemoScenario("baseline");
    setActiveAlertCount(1);
  };

  return (
    <div className={styles.appShell}>
      {/* Industrial-tech Top Navigation */}
      <TopBar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeAlertCount={activeAlertCount}
        onAlertClick={() => setCurrentView("fleet")}
      />

      <main className={styles.mainContainer}>
        {/* Examiner & Teacher Guided Demo Toolbar (Visible in Demo mode or expandable) */}
        {(currentView === "demo" || currentView === "fleet") && (
          <TeacherDemoBar
            activeScenario={demoScenario}
            onRunScenario={handleRunDemoScenario}
            onReset={handleResetDemo}
          />
        )}

        {/* Dynamic View Rendering */}
        {currentView === "thesis" ? (
          <div className={styles.thesisViewWrap}>
            <ThesisReader
              onTriggerSimulation={(featureId) => {
                setCurrentView("fleet");
                if (featureId === "gps") handleRunDemoScenario("baseline");
                if (featureId === "emergency") handleRunDemoScenario("door_interlock");
                if (featureId === "ticketing" || featureId === "attendance") handleRunDemoScenario("overcrowding");
              }}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          </div>
        ) : (
          <FleetControlRoom
            onTriggerModal={() => setIsAboutOpen(true)}
            demoScenarioTrigger={demoScenario}
            onClearDemoTrigger={() => setDemoScenario(null)}
          />
        )}
      </main>

      {/* Attributed Global Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectView={(view) => setCurrentView(view)}
      />

      {/* Developer Attribution & Architectural Credits Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
