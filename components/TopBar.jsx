import React from "react";
import styles from "./TopBar.module.css";
import {
  BusIcon,
  BookOpenIcon,
  SlidersIcon,
  AlertTriangleIcon,
  AwardIcon,
  SunIcon,
  MoonIcon,
  RadioIcon,
  ShieldIcon
} from "./icons/Icons";

export default function TopBar({
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
  onOpenAbout,
  activeAlertCount = 0,
  onAlertClick
}) {
  return (
    <header className={styles.topBar} role="banner">
      <div className={styles.brandGroup}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <BusIcon size={18} strokeWidth={2.2} />
          </div>
          <div className={styles.logoText}>
            <div className={styles.logoRow}>
              <span className={styles.brandTitle}>NEBULA TRANSIT</span>
              <span className={styles.simChip} title="All telemetry and vehicle actuation in this academic portal are simulated">
                DEMO / SIMULATED
              </span>
            </div>
            <span className={styles.brandTagline}>Intelligence behind every journey</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.authorBadge}
          onClick={onOpenAbout}
          title="Click to view Developer Profile &amp; Project Credits"
          aria-label="View developer credentials for Ayesha Batool (Roll No: M245004)"
        >
          <span className={styles.authorDot} />
          <span className={styles.authorName}>Ayesha Batool</span>
          <span className={styles.authorRoll}>M245004</span>
        </button>
      </div>

      <nav className={styles.navSwitcher} aria-label="Main Application Modes">
        <button
          type="button"
          className={`${styles.navTab} ${currentView === "fleet" ? styles.navTabActive : ""}`}
          onClick={() => onViewChange("fleet")}
        >
          <RadioIcon size={14} />
          <span>Fleet Control Room</span>
        </button>
        <button
          type="button"
          className={`${styles.navTab} ${currentView === "thesis" ? styles.navTabActive : ""}`}
          onClick={() => onViewChange("thesis")}
        >
          <BookOpenIcon size={14} />
          <span>Academic Thesis</span>
        </button>
        <button
          type="button"
          className={`${styles.navTab} ${currentView === "demo" ? styles.navTabActive : ""}`}
          onClick={() => onViewChange("demo")}
        >
          <SlidersIcon size={14} />
          <span>Teacher Demo</span>
        </button>
      </nav>

      <div className={styles.actionsGroup}>
        <button
          type="button"
          className={`${styles.alertBtn} ${activeAlertCount > 0 ? styles.alertBtnActive : ""}`}
          onClick={onAlertClick}
          title={`${activeAlertCount} active system alert(s)`}
          aria-label={`View ${activeAlertCount} active system alerts`}
        >
          <AlertTriangleIcon size={14} />
          <span className={styles.alertCount}>{activeAlertCount}</span>
        </button>

        <button
          type="button"
          className={styles.creditsBtn}
          onClick={onOpenAbout}
          title="Project Methodology &amp; Student Attribution"
          aria-label="View Project Credits"
        >
          <AwardIcon size={14} />
          <span className={styles.creditsLabel}>Credits</span>
        </button>

        <button
          type="button"
          className={styles.themeBtn}
          onClick={onToggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <MoonIcon size={14} /> : <SunIcon size={14} />}
        </button>
      </div>
    </header>
  );
}
