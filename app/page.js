"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import FleetControlRoom from "@/components/FleetControlRoom";
import ThesisReader from "@/components/ThesisReader";
import Footer from "@/components/Footer";
import AboutModal from "@/components/AboutModal";

const VEHICLES_META = {
  "EV-12": {
    id: "EV-12",
    code: "BUS-102",
    name: "Nebula Cityliner 12",
    type: "Electric Transit Bus (12m)"
  },
  "EV-08": {
    id: "EV-08",
    code: "POD-08",
    name: "Campus Eco Shuttle 08",
    type: "Autonomous Electric Pod"
  },
  "HY-24": {
    id: "HY-24",
    code: "METRO-24",
    name: "Metro Express 24",
    type: "Clean Hybrid Transit Bus"
  }
};

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, fleet, vehicle, routes, passengers, diagnostics, ai-inspection, safety, reports, demo, thesis, settings
  const [selectedVehicleId, setSelectedVehicleId] = useState("EV-12");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [demoScenario, setDemoScenario] = useState(null);
  const [activeAlertCount, setActiveAlertCount] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      {/* Desktop 248px Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeAlertCount={activeAlertCount}
        activeScenario={demoScenario}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <div className={styles.mainContentWrapper}>
        {/* Topbar across content */}
        <TopBar
          currentView={currentView}
          onViewChange={(view) => setCurrentView(view)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAbout={() => setIsAboutOpen(true)}
          activeAlertCount={activeAlertCount}
          onAlertClick={() => setCurrentView("safety")}
          vehicles={VEHICLES_META}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(id) => setSelectedVehicleId(id)}
        />

        {/* Dynamic Content Region */}
        <main className={styles.mainContainer}>
          {currentView === "thesis" ? (
            <div className={styles.thesisViewWrap}>
              <ThesisReader
                onTriggerSimulation={(featureId) => {
                  setCurrentView("dashboard");
                  if (featureId === "gps") handleRunDemoScenario("baseline");
                  if (featureId === "emergency") handleRunDemoScenario("door_interlock");
                  if (featureId === "ticketing" || featureId === "attendance") handleRunDemoScenario("overcrowding");
                }}
                onOpenAbout={() => setIsAboutOpen(true)}
              />
            </div>
          ) : (
            <FleetControlRoom
              currentView={currentView}
              onViewChange={(view) => setCurrentView(view)}
              onTriggerModal={() => setIsAboutOpen(true)}
              demoScenarioTrigger={demoScenario}
              onClearDemoTrigger={() => setDemoScenario(null)}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
            />
          )}
        </main>

        {/* Global Subtle Footer */}
        <Footer
          onOpenAbout={() => setIsAboutOpen(true)}
          onSelectView={(view) => setCurrentView(view)}
        />
      </div>

      {/* Mobile-First Bottom Navigation (5 items max + More Sheet) */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeAlertCount={activeAlertCount}
        activeScenario={demoScenario}
      />

      {/* Academic Credits & Developer Attribution Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
