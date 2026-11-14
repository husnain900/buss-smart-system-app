"use client";

import React, { useState } from "react";
import styles from "./MobileBottomNav.module.css";
import {
  HomeIcon,
  BusIcon,
  CarIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  UsersIcon,
  WrenchIcon,
  CameraIcon,
  ShieldIcon,
  DownloadIcon,
  SlidersIcon,
  BookOpenIcon,
  SettingsIcon,
  XIcon
} from "./icons/Icons";

export default function MobileBottomNav({
  currentView,
  onViewChange,
  activeAlertCount = 0,
  activeScenario = null
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: "dashboard", label: "Home", icon: <HomeIcon size={18} /> },
    { id: "fleet", label: "Fleet", icon: <BusIcon size={18} /> },
    { id: "vehicle", label: "Bus 3D", icon: <CarIcon size={18} /> },
    { id: "routes", label: "Routes", icon: <MapPinIcon size={18} /> },
    {
      id: "more",
      label: "More",
      icon: <MoreHorizontalIcon size={18} />,
      isMore: true,
      badge: activeAlertCount > 0 || activeScenario ? "•" : null
    }
  ];

  const moreItems = [
    { id: "passengers", label: "Passengers", icon: <UsersIcon size={18} />, desc: "Flow density & RFID roll-call" },
    { id: "diagnostics", label: "Diagnostics", icon: <WrenchIcon size={18} />, desc: "4-wheel TPMS & CAN fault codes", badge: activeAlertCount > 0 ? activeAlertCount : null },
    { id: "ai-inspection", label: "AI Inspection", icon: <CameraIcon size={18} />, desc: "Camera visual defect screening" },
    { id: "safety", label: "Safety Ledger", icon: <ShieldIcon size={18} />, desc: "Interlocks & incident log" },
    { id: "reports", label: "Reports", icon: <DownloadIcon size={18} />, desc: "Operational data & CSV export" },
    { id: "demo", label: "Teacher Demo", icon: <SlidersIcon size={18} />, desc: "Guided evaluation scenarios", pill: activeScenario ? "ACTIVE" : null },
    { id: "thesis", label: "Academic Thesis", icon: <BookOpenIcon size={18} />, desc: "Research document & credits" },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={18} />, desc: "Audio, theme & system options" }
  ];

  const handleSelectTab = (tab) => {
    if (tab.isMore) {
      setIsMoreOpen(true);
    } else {
      setIsMoreOpen(false);
      onViewChange(tab.id);
    }
  };

  const handleSelectMoreItem = (itemId) => {
    setIsMoreOpen(false);
    onViewChange(itemId);
  };

  return (
    <>
      <nav className={styles.bottomBar} aria-label="Mobile Navigation">
        {mainTabs.map((tab) => {
          const isSelected = !tab.isMore && currentView === tab.id;
          const isMoreSelected = tab.isMore && !mainTabs.some((t) => !t.isMore && t.id === currentView);
          const active = isSelected || isMoreSelected;

          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${active ? styles.tabBtnActive : ""}`}
              onClick={() => handleSelectTab(tab)}
              aria-current={isSelected ? "page" : undefined}
            >
              <div className={styles.iconWrap}>
                {tab.icon}
                {tab.badge && <span className={styles.dotBadge}>{tab.badge}</span>}
              </div>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More Bottom Sheet */}
      {isMoreOpen && (
        <div className={styles.sheetOverlay} onClick={() => setIsMoreOpen(false)}>
          <div className={styles.bottomSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetHandle} />
              <div className={styles.sheetTitleRow}>
                <span className={styles.sheetTitle}>All Modules &amp; Tools</span>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsMoreOpen(false)}
                  aria-label="Close menu"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            <div className={styles.sheetGrid}>
              {moreItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.sheetItem} ${isActive ? styles.sheetItemActive : ""}`}
                    onClick={() => handleSelectMoreItem(item.id)}
                  >
                    <span className={styles.sheetItemIcon}>{item.icon}</span>
                    <div className={styles.sheetItemText}>
                      <span className={styles.sheetItemLabel}>{item.label}</span>
                      <span className={styles.sheetItemDesc}>{item.desc}</span>
                    </div>
                    {item.badge && <span className={styles.sheetBadge}>{item.badge}</span>}
                    {item.pill && <span className={styles.sheetPill}>{item.pill}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
