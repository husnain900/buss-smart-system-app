"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import ThesisReader from "@/components/ThesisReader";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import AboutModal from "@/components/AboutModal";
import { SunIcon, MoonIcon, SmartphoneIcon, BookOpenIcon, AwardIcon } from "@/components/icons/Icons";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [mobileView, setMobileView] = useState("reader");
  const [triggeredFeature, setTriggeredFeature] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleTriggerSimulation = (featureId) => {
    setTriggeredFeature(featureId);
    setMobileView("dashboard");
  };

  const handleClearTrigger = () => {
    setTriggeredFeature(null);
  };

  return (
    <div className={styles.mainWrapper}>
      <header className={styles.topBar} role="banner">
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <h1 className={styles.appTitle}>Bus Smart System Application</h1>
            <button
              type="button"
              className={styles.devBadge}
              onClick={() => setIsAboutOpen(true)}
              title="Click to view Developer Profile &amp; Project Credits"
              aria-label="View developer credentials for Ayesha Batool"
            >
              <span className={styles.devBadgeDot} />
              <span>Ayesha Batool &bull; M245004</span>
            </button>
          </div>
          <p className={styles.authorMeta}>
            Academic Thesis Portal &bull; Designed &amp; Engineered by <strong>Ayesha Batool</strong> (Roll: M245004) &bull; Gomal University Faisalabad
          </p>
        </div>

        <div className={styles.topBarActions}>
          <button
            type="button"
            className={styles.creditsBtn}
            onClick={() => setIsAboutOpen(true)}
            aria-label="Open Project Credits &amp; Architecture Details"
          >
            <AwardIcon size={14} />
            <span>Credits</span>
          </button>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle visual theme between light and dark"
          >
            {theme === "light" ? (
              <>
                <MoonIcon size={14} />
                <span>Sleek Dark</span>
              </>
            ) : (
              <>
                <SunIcon size={14} />
                <span>Modern Light</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className={styles.mobileTabs} role="tablist" aria-label="Mobile View Switcher">
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "reader"}
          className={`${styles.mobileTabBtn} ${mobileView === "reader" ? styles.mobileTabBtnActive : ""}`}
          onClick={() => setMobileView("reader")}
        >
          <BookOpenIcon size={14} />
          <span>Read Thesis</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "dashboard"}
          className={`${styles.mobileTabBtn} ${mobileView === "dashboard" ? styles.mobileTabBtnActive : ""}`}
          onClick={() => setMobileView("dashboard")}
        >
          <SmartphoneIcon size={14} />
          <span>Live Simulator</span>
        </button>
      </div>

      <main className={styles.workspace}>
        <section
          className={`${styles.readerPane} ${mobileView === "reader" ? styles.activeMobilePane : ""}`}
          aria-label="Thesis Reading Workspace"
        >
          <ThesisReader
            onTriggerSimulation={handleTriggerSimulation}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        </section>

        <section
          className={`${styles.dashboardPane} ${mobileView === "dashboard" ? styles.activeMobilePane : ""}`}
          aria-label="Interactive Fleet Telematics Simulator"
        >
          <Dashboard
            triggeredFeature={triggeredFeature}
            clearTrigger={handleClearTrigger}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        </section>
      </main>

      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectView={(view) => setMobileView(view)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
