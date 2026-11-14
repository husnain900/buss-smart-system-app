"use client";

import React, { useState, useEffect } from "react";
import styles from "./TopBar.module.css";
import {
  BusIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  MenuIcon
} from "./icons/Icons";

const VIEW_NAMES = {
  dashboard: "Fleet Overview",
  fleet: "Vehicle Fleet Catalog",
  vehicle: "3D Bus Digital Twin",
  routes: "Live Transit Corridors",
  passengers: "Passenger Density & Flow",
  diagnostics: "Chassis Diagnostics & TPMS",
  "ai-inspection": "AI Camera Defect Screening",
  safety: "Safety Interlocks & Audit Ledger",
  reports: "University Telemetry Reports",
  demo: "Examiner Guided Demonstration",
  thesis: "Academic Thesis Documentation",
  settings: "Platform Settings"
};

export default function TopBar({
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
  onOpenAbout,
  activeAlertCount = 0,
  onAlertClick,
  vehicles = {},
  selectedVehicleId = "EV-12",
  onSelectVehicle
}) {
  const [timeStr, setTimeStr] = useState("");
  const [isVehicleMenuOpen, setIsVehicleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }) + " PKT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentVehicle = vehicles[selectedVehicleId] || { code: "BUS-102", name: "Nextrans Cityliner 12" };

  return (
    <header className={styles.topBar} role="banner">
      {/* Breadcrumb / View Title */}
      <div className={styles.leftSection}>
        <div className={styles.breadcrumb}>
          <span className={styles.sectionCategory}>Operations</span>
          <span className={styles.divider}>/</span>
          <h1 className={styles.pageTitle}>{VIEW_NAMES[currentView] || "Fleet Overview"}</h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className={styles.rightSection}>
        {/* Global Vehicle Selector Dropdown */}
        <div className={styles.vehicleSelectWrap}>
          <button
            type="button"
            className={styles.vehicleDropdownBtn}
            onClick={() => setIsVehicleMenuOpen((prev) => !prev)}
            aria-expanded={isVehicleMenuOpen}
            aria-label="Select active vehicle"
          >
            <BusIcon size={14} />
            <span className={styles.vCode}>{currentVehicle.code}</span>
            <span className={styles.vName}>{currentVehicle.name.split(" ")[0]}</span>
            <ChevronDownIcon size={13} className={styles.vChevron} />
          </button>

          {isVehicleMenuOpen && (
            <div className={styles.vehicleMenu} onClick={() => setIsVehicleMenuOpen(false)}>
              {Object.values(vehicles).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`${styles.vehicleOption} ${v.id === selectedVehicleId ? styles.vehicleOptionActive : ""}`}
                  onClick={() => onSelectVehicle(v.id)}
                >
                  <span className={styles.optCode}>{v.code}</span>
                  <div className={styles.optText}>
                    <span className={styles.optName}>{v.name}</span>
                    <span className={styles.optType}>{v.type}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Honest Environment Chip */}
        <div className={styles.simBadge} title="Telemetric readings & vehicle actuation are operating in deterministic software simulation">
          <span className={styles.simDot} />
          <span>DEMO / SIMULATED</span>
        </div>

        {/* Live Clock */}
        <div className={styles.clockBox}>
          <span className="tabular-num">{timeStr || "15:00:00 PKT"}</span>
        </div>

        {/* Alert Notifications */}
        <button
          type="button"
          className={`${styles.actionIconBtn} ${activeAlertCount > 0 ? styles.actionIconBtnAlert : ""}`}
          onClick={onAlertClick}
          title={`${activeAlertCount} active system alert(s)`}
          aria-label="View system alerts"
        >
          <BellIcon size={16} />
          {activeAlertCount > 0 && <span className={styles.notifBadge}>{activeAlertCount}</span>}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className={styles.actionIconBtn}
          onClick={onToggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
          aria-label="Toggle visual theme"
        >
          {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button>

        {/* Student Avatar / Credits Button */}
        <button
          type="button"
          className={styles.studentAvatarBtn}
          onClick={onOpenAbout}
          title="Engineered by Ayesha Batool (M245004) • Gomal University"
          aria-label="View developer credentials and supervisor details"
        >
          <span className={styles.avatarText}>AB</span>
        </button>
      </div>
    </header>
  );
}
