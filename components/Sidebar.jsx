"use client";

import React from "react";
import styles from "./Sidebar.module.css";
import {
  HomeIcon,
  BusIcon,
  CarIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
  CameraIcon,
  ShieldIcon,
  DownloadIcon,
  SlidersIcon,
  BookOpenIcon,
  SettingsIcon,
  AwardIcon,
  ChevronRightIcon
} from "./icons/Icons";

export default function Sidebar({
  currentView,
  onViewChange,
  activeAlertCount = 0,
  activeScenario = null,
  isCollapsed = false,
  onToggleCollapse,
  onOpenAbout
}) {
  const primaryNavItems = [
    { id: "dashboard", label: "Overview", icon: <HomeIcon size={18} /> },
    { id: "fleet", label: "Fleet Catalog", icon: <BusIcon size={18} /> },
    { id: "vehicle", label: "3D Bus Twin", icon: <CarIcon size={18} /> },
    { id: "routes", label: "Routes & GPS", icon: <MapPinIcon size={18} /> },
    { id: "passengers", label: "Passengers", icon: <UsersIcon size={18} /> },
    {
      id: "diagnostics",
      label: "Diagnostics",
      icon: <WrenchIcon size={18} />,
      badge: activeAlertCount > 0 ? activeAlertCount : null
    },
    { id: "ai-inspection", label: "AI Inspection", icon: <CameraIcon size={18} /> },
    { id: "safety", label: "Safety Ledger", icon: <ShieldIcon size={18} /> },
    { id: "reports", label: "Reports", icon: <DownloadIcon size={18} /> }
  ];

  const academicNavItems = [
    {
      id: "demo",
      label: "Teacher Demo",
      icon: <SlidersIcon size={18} />,
      pill: activeScenario ? "ACTIVE" : null
    },
    { id: "thesis", label: "Academic Thesis", icon: <BookOpenIcon size={18} /> }
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`} aria-label="Main Navigation">
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <div className={styles.logoMark}>
          <BusIcon size={20} strokeWidth={2.2} />
        </div>
        {!isCollapsed && (
          <div className={styles.brandText}>
            <div className={styles.brandTitleRow}>
              <span className={styles.brandTitle}>NEBULA</span>
              <span className={styles.brandSuffix}>TRANSIT</span>
            </div>
            <span className={styles.brandTagline}>Intelligence behind every journey</span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <div className={styles.navScrollArea}>
        <div className={styles.navSection}>
          {!isCollapsed && <span className={styles.sectionLabel}>Operations</span>}
          <nav className={styles.navList}>
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={() => onViewChange(item.id)}
                  title={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  {!isCollapsed && <span className={styles.itemLabel}>{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className={styles.itemBadge}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.navDivider} />

        <div className={styles.navSection}>
          {!isCollapsed && <span className={styles.sectionLabel}>Academic &amp; Evaluation</span>}
          <nav className={styles.navList}>
            {academicNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={() => onViewChange(item.id)}
                  title={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  {!isCollapsed && <span className={styles.itemLabel}>{item.label}</span>}
                  {!isCollapsed && item.pill && (
                    <span className={styles.activePill}>{item.pill}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Student Attribution Card */}
      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={styles.attributionCard}
          onClick={onOpenAbout}
          title="Click to view full developer profile and thesis credentials"
          aria-label="View Student Credits"
        >
          <div className={styles.avatar}>AB</div>
          {!isCollapsed && (
            <div className={styles.studentInfo}>
              <div className={styles.studentNameRow}>
                <span className={styles.studentName}>Ayesha Batool</span>
                <span className={styles.rollBadge}>M245004</span>
              </div>
              <span className={styles.studentDept}>Gomal University • CS</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
