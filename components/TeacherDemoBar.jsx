import React from "react";
import styles from "./TeacherDemoBar.module.css";
import {
  PlayIcon,
  AlertTriangleIcon,
  UsersIcon,
  ShieldIcon,
  RefreshCwIcon,
  SlidersIcon,
  CheckIcon
} from "./icons/Icons";

export default function TeacherDemoBar({ onRunScenario, activeScenario, onReset }) {
  const scenarios = [
    {
      id: "baseline",
      label: "1. Healthy Baseline",
      desc: "Nominal route, correct EV kWh metrics, 0 active faults",
      icon: <CheckIcon size={14} />
    },
    {
      id: "door_interlock",
      label: "2. Door Safety Interlock",
      desc: "Speed at 35 km/h: Door opening blocked & incident logged",
      icon: <ShieldIcon size={14} />
    },
    {
      id: "overcrowding",
      label: "3. Overcrowding Event",
      desc: "Passengers reach 44/42: Capacity limit exceeded warning",
      icon: <UsersIcon size={14} />
    },
    {
      id: "low_tyre",
      label: "4. Low Tyre Pressure",
      desc: "Rear-Left drops to 24 PSI: TPMS alert & ticket queued",
      icon: <AlertTriangleIcon size={14} />
    }
  ];

  return (
    <div className={styles.demoBarWrap} role="region" aria-label="Teacher Demonstration Controller">
      <div className={styles.barHeader}>
        <div className={styles.titleArea}>
          <div className={styles.headerIcon}>
            <SlidersIcon size={16} />
          </div>
          <div>
            <h4 className={styles.barTitle}>Examiner / Teacher Guided Demo Scenarios</h4>
            <p className={styles.barSubtitle}>
              One-click deterministic scenarios for oral defense &amp; evaluation (5–7 min live flow)
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.resetBtn}
          onClick={onReset}
          title="Restore baseline seeded state"
          aria-label="Reset simulation to default state"
        >
          <RefreshCwIcon size={13} />
          <span>Reset Simulation</span>
        </button>
      </div>

      <div className={styles.scenariosGrid}>
        {scenarios.map((sc) => {
          const isActive = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              className={`${styles.scenarioCard} ${isActive ? styles.scenarioCardActive : ""}`}
              onClick={() => onRunScenario(sc.id)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{sc.icon}</span>
                <span className={styles.cardLabel}>{sc.label}</span>
                {isActive && <span className={styles.activePill}>ACTIVE</span>}
              </div>
              <p className={styles.cardDesc}>{sc.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
