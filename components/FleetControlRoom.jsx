"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FleetControlRoom.module.css";
import Bus3DViewer from "./Bus3DViewer";
import {
  BusIcon,
  CarIcon,
  MapPinIcon,
  UsersIcon,
  AlertTriangleIcon,
  PlayIcon,
  PauseIcon,
  ThermometerIcon,
  ShieldIcon,
  RadioIcon,
  CheckIcon,
  CameraIcon,
  DownloadIcon,
  RefreshCwIcon,
  WrenchIcon,
  ZapIcon,
  VolumeIcon,
  VolumeXIcon,
  InfoIcon,
  LayersIcon,
  SearchIcon,
  UserCheckIcon,
  SlidersIcon,
  SettingsIcon,
  ExternalLinkIcon,
  ActivityIcon,
  AwardIcon
} from "./icons/Icons";

const VEHICLE_CATALOG = {
  "EV-12": {
    id: "EV-12",
    code: "BUS-102",
    name: "Nebula Cityliner 12",
    type: "Electric Transit Bus (12m)",
    isElectric: true,
    capacity: 42,
    batteryCap: "320 kWh",
    usableRange: 248,
    efficiencyUnit: "kWh/100 km",
    efficiencyVal: 112,
    route: "Route 01 — Campus Terminal ⇄ Faisalabad Center (Express)",
    stops: ["Gomal University Terminal", "Canal Expressway Gate", "City Tower Square", "Tech Park Terminal"],
    image: "/assets/images/smart_transit_bus.png",
    alt: "Nebula Cityliner 12 Electric Transit Bus Studio Render"
  },
  "EV-08": {
    id: "EV-08",
    code: "POD-08",
    name: "Campus Eco Shuttle 08",
    type: "Autonomous Electric Pod",
    isElectric: true,
    capacity: 14,
    batteryCap: "90 kWh",
    usableRange: 190,
    efficiencyUnit: "kWh/100 km",
    efficiencyVal: 78,
    route: "Route 02 — Gomal University Inner Campus Circular",
    stops: ["CS Dept Gate", "Central Library", "Hostel Quad", "Sports Complex"],
    image: "/assets/images/smart_campus_shuttle.png",
    alt: "Campus Eco Shuttle 08 Autonomous Transit Pod"
  },
  "HY-24": {
    id: "HY-24",
    code: "METRO-24",
    name: "Metro Express 24",
    type: "Clean Hybrid Transit Bus",
    isElectric: false,
    capacity: 52,
    batteryCap: "Euro-6 Hybrid Diesel",
    usableRange: 450,
    efficiencyUnit: "km/l",
    efficiencyVal: 11.4,
    route: "Route 03 — Samanabad Gateways ⇄ Canal Road Belt Line",
    stops: ["Samanabad Terminal", "Railway Junction", "University Gate", "Canal Expressway"],
    image: "/assets/images/smart_ev_car.png",
    alt: "Metro Express Hybrid Transit Vehicle"
  }
};

const DEFAULT_INSPECTION_CASES = [
  {
    id: "tyre_good",
    title: "Tyre Tread Profile (Healthy)",
    category: "Running Gear",
    image: "/assets/images/smart_transit_bus.png",
    findings: "Measured groove depth: 8.4 mm across all 3 central ribs. Uniform wear pattern.",
    status: "PASS",
    severity: "low",
    confidence: "98.2%",
    recommendation: "Tyre certified for route operations. Next routine check in 4,500 km."
  },
  {
    id: "tyre_worn",
    title: "Tyre Tread Wear (Critical)",
    category: "Running Gear",
    image: "/assets/images/smart_transit_bus.png",
    findings: "Measured groove depth: 1.8 mm (Legal safety limit: 2.0 mm). Uneven outer shoulder scuff.",
    status: "ACTION REQUIRED",
    severity: "critical",
    confidence: "96.4%",
    recommendation: "Immediate replacement advised prior to high-speed expressway service."
  },
  {
    id: "body_dent",
    title: "Side Skirt Surface Dent",
    category: "Exterior Body",
    image: "/assets/images/smart_campus_shuttle.png",
    findings: "12 cm cosmetic scratch and minor sheet metal indentation near passenger boarding door.",
    status: "FLAGGED FOR WORKSHOP",
    severity: "caution",
    confidence: "91.8%",
    recommendation: "Surface paint restoration scheduled for overnight maintenance window."
  },
  {
    id: "brake_lining",
    title: "Brake Pad Friction Lining",
    category: "Braking System",
    image: "/assets/images/smart_ev_car.png",
    findings: "Friction material remaining: 3.4 mm (Nominal: 10 mm, Minimum threshold: 3.0 mm).",
    status: "SCHEDULE SERVICE",
    severity: "caution",
    confidence: "94.6%",
    recommendation: "Plan brake shoe renewal during next scheduled depot service inspection."
  }
];

export default function FleetControlRoom({
  currentView = "dashboard",
  onViewChange,
  onTriggerModal,
  demoScenarioTrigger,
  onClearDemoTrigger,
  selectedVehicleId = "EV-12",
  onSelectVehicle
}) {
  // Telemetry state
  const [isPowered, setIsPowered] = useState(true);
  const [isBrakeApplied, setIsBrakeApplied] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [interlockLockoutMsg, setInterlockLockoutMsg] = useState(null);
  const [acActive, setAcActive] = useState(true);
  const [hazardsActive, setHazardsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Route & GPS
  const [routeProgress, setRouteProgress] = useState(15);
  const [isDriving, setIsDriving] = useState(false);

  // Passenger & RFID
  const [passengerCount, setPassengerCount] = useState(26);
  const [rfidLog, setRfidLog] = useState([
    { name: "Ayesha Batool", roll: "M245004", time: "08:15 AM", cardId: "RF-9941", status: "Boarded" },
    { name: "Ali Raza", roll: "M245012", time: "08:22 AM", cardId: "RF-8820", status: "Boarded" },
    { name: "Sadia Kanwal", roll: "M245025", time: "08:30 AM", cardId: "RF-7731", status: "Boarded" }
  ]);

  // Diagnostics & TPMS
  const [tpmsPressures, setTpmsPressures] = useState({ fl: 35, fr: 35, rl: 35, rr: 35 });
  const [activeFaults, setActiveFaults] = useState([]);
  const [incidentLog, setIncidentLog] = useState([
    { timestamp: "08:00:15", level: "info", text: "Fleet node telemetry session initialized. Verified simulated stream." },
    { timestamp: "08:14:22", level: "info", text: "Departure verified from Gomal Campus Central Station on Schedule." }
  ]);

  // AI Inspection
  const [selectedInspectionCase, setSelectedInspectionCase] = useState(DEFAULT_INSPECTION_CASES[0]);
  const [inspectionHistory, setInspectionHistory] = useState([]);

  // Fleet Filter
  const [fleetFilter, setFleetFilter] = useState("all"); // all, electric, hybrid
  const [searchQuery, setSearchQuery] = useState("");

  const vehicle = VEHICLE_CATALOG[selectedVehicleId] || VEHICLE_CATALOG["EV-12"];

  // Web Audio chime helper
  const playChime = useCallback((freq = 520, type = "sine", duration = 0.15) => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try { osc.stop(); ctx.close(); } catch {}
      }, duration * 1000);
    } catch {}
  }, [isMuted]);

  // Add Incident Log entry
  const logIncident = useCallback((text, level = "info") => {
    const timeStr = new Date().toLocaleTimeString();
    setIncidentLog((prev) => [{ timestamp: timeStr, level, text }, ...prev]);
  }, []);

  // Handle Door Toggle with Safety Interlock
  const handleToggleDoors = () => {
    if (!doorsOpen) {
      if (speed > 0 || !isBrakeApplied) {
        const warning = `INTERLOCK ACTIVE: Doors cannot be opened while vehicle is in motion (${speed} km/h). Apply service brakes to a full stop.`;
        setInterlockLockoutMsg(warning);
        playChime(320, "sawtooth", 0.3);
        logIncident(`SAFETY INTERLOCK REJECTED: Door open command blocked at speed ${speed} km/h`, "critical");
        setTimeout(() => setInterlockLockoutMsg(null), 5000);
        return;
      }
      setDoorsOpen(true);
      playChime(640, "sine", 0.2);
      logIncident(`DOORS OPENED: Full vehicle stop confirmed (0 km/h, brake engaged)`, "info");
    } else {
      setDoorsOpen(false);
      playChime(480, "sine", 0.15);
      logIncident(`DOORS CLOSED & LOCKED: Vehicle ready for transit`, "info");
    }
  };

  // Speed Simulation physics tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDriving && isPowered && !doorsOpen) {
        setSpeed((prev) => {
          if (prev < targetSpeed) return Math.min(targetSpeed, prev + 2);
          if (prev > targetSpeed) return Math.max(targetSpeed, prev - 2);
          return prev;
        });

        setRouteProgress((prev) => {
          if (prev >= 100) return 0;
          return parseFloat((prev + (speed / 120)).toFixed(1));
        });
      } else {
        setSpeed((prev) => Math.max(0, prev - 4));
        if (speed === 0) setIsBrakeApplied(true);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [isDriving, isPowered, doorsOpen, targetSpeed, speed]);

  // Listen to Demo Scenarios from Teacher Bar / Demo Screen
  useEffect(() => {
    if (!demoScenarioTrigger) return;

    if (demoScenarioTrigger === "baseline") {
      setSpeed(0);
      setTargetSpeed(0);
      setIsBrakeApplied(true);
      setDoorsOpen(false);
      setPassengerCount(26);
      setTpmsPressures({ fl: 35, fr: 35, rl: 35, rr: 35 });
      setActiveFaults([]);
      logIncident("Teacher Demo: Baseline nominal state initialized", "info");
    } else if (demoScenarioTrigger === "door_interlock") {
      setIsPowered(true);
      setIsBrakeApplied(false);
      setIsDriving(true);
      setTargetSpeed(35);
      setSpeed(35);
      setTimeout(() => {
        const warning = `INTERLOCK TEST: Moving door opening strictly blocked at 35 km/h. Passengers protected.`;
        setInterlockLockoutMsg(warning);
        playChime(320, "sawtooth", 0.35);
        logIncident(`INTERLOCK ENFORCED: Remote door open REJECTED while vehicle moving at 35 km/h`, "critical");
      }, 600);
    } else if (demoScenarioTrigger === "overcrowding") {
      setPassengerCount(44);
      playChime(440, "square", 0.3);
      logIncident(`OVERCROWDING ALERT: Passenger count (44) exceeds certified capacity (42 Pax)`, "critical");
    } else if (demoScenarioTrigger === "low_tyre") {
      setTpmsPressures({ fl: 35, fr: 35, rl: 24, rr: 35 });
      setActiveFaults((prev) => [
        { code: "TPMS-04", system: "Running Gear", desc: "Rear-Left Low Pressure (24 PSI vs 35 PSI spec)", severity: "critical" },
        ...prev
      ]);
      playChime(420, "square", 0.3);
      logIncident(`CRITICAL FAULT: TPMS-04 Rear-Left tyre pressure dropped to 24 PSI`, "critical");
    }

    onClearDemoTrigger();
  }, [demoScenarioTrigger, onClearDemoTrigger, logIncident, playChime]);

  // RFID Tap simulation
  const handleSimulateRfidTap = () => {
    const studentPool = [
      { name: "Ayesha Batool", roll: "M245004" },
      { name: "Muhammad Bilal", roll: "M245008" },
      { name: "Hamza Tariq", roll: "M245030" },
      { name: "Fatima Noor", roll: "M245016" }
    ];
    const picked = studentPool[Math.floor(Math.random() * studentPool.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const cardCode = `RF-${Math.floor(1000 + Math.random() * 9000)}`;

    setRfidLog((prev) => [
      { name: picked.name, roll: picked.roll, time: timeStr, cardId: cardCode, status: "Boarded" },
      ...prev
    ]);
    setPassengerCount((prev) => Math.min(vehicle.capacity + 4, prev + 1));
    playChime(880, "triangle", 0.12);
    logIncident(`RFID CARD TAP: ${picked.name} (${picked.roll}) successfully registered onboard`, "info");
  };

  // AI Inspection Confirmation
  const handleConfirmInspection = (testCase) => {
    const entry = {
      id: Date.now(),
      title: testCase.title,
      status: testCase.status,
      timestamp: new Date().toLocaleTimeString(),
      technician: "Technician Verified (Ayesha Batool - M245004)",
      action: testCase.severity === "critical" ? "Service Work Order Created" : "Routine Logged"
    };
    setInspectionHistory((prev) => [entry, ...prev]);
    logIncident(`AI INSPECTION CONFIRMED: ${testCase.title} verified by technician. Action: ${entry.action}`, "info");
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const headers = "Timestamp,Event Level,Log Message,Vehicle,Route\n";
    const rows = incidentLog
      .map((log) => `"${log.timestamp}","${log.level}","${log.text.replace(/"/g, '""')}","${vehicle.name}","${vehicle.route}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Nebula_Transit_Report_${selectedVehicleId}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    logIncident("REPORT EXPORTED: Telemetry & Safety incident ledger CSV downloaded", "info");
  };

  const isOvercrowded = passengerCount > vehicle.capacity;
  const occupancyPct = Math.round((passengerCount / vehicle.capacity) * 100);

  // Filtered vehicles
  const filteredVehicles = Object.values(VEHICLE_CATALOG).filter((v) => {
    if (fleetFilter === "electric" && !v.isElectric) return false;
    if (fleetFilter === "hybrid" && v.isElectric) return false;
    if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.controlRoom}>
      {/* Safety Interlock Banner Notification */}
      <AnimatePresence>
        {interlockLockoutMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.interlockBanner}
            role="alert"
          >
            <AlertTriangleIcon size={18} />
            <span>{interlockLockoutMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          1. DASHBOARD OVERVIEW (Section 4 Wireframe)
      ============================================================== */}
      {currentView === "dashboard" && (
        <div className={styles.dashboardView}>
          {/* Main Editorial Page Header */}
          <div className={styles.editorialHeader}>
            <div className={styles.headerTitleGroup}>
              <h2 className={styles.editorialTitle}>Fleet Overview</h2>
              <p className={styles.editorialSub}>
                Real-time telematics, corridor status &amp; safety interlock monitoring for university transit.
              </p>
            </div>
            <div className={styles.headerActionGroup}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => onViewChange("reports")}
              >
                <DownloadIcon size={14} />
                <span>View Report</span>
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onViewChange("vehicle")}
              >
                <CarIcon size={14} />
                <span>Open 3D Inspector</span>
              </button>
            </div>
          </div>

          {/* First KPI Band: 4 Equal Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Fleet Online Status</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>3 / 3</span>
                <span className={styles.kpiUnit}>Units</span>
              </div>
              <div className={styles.kpiFooter}>
                <span className={styles.statusDotOnline} />
                <span className={styles.kpiDelta}>100% On-Schedule • Simulated</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>
                {vehicle.isElectric ? "Battery State of Charge" : "Fuel Level"}
              </span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{vehicle.isElectric ? "78%" : "82%"}</span>
                <span className={styles.kpiUnit}>{vehicle.batteryCap}</span>
              </div>
              <div className={styles.kpiFooter}>
                <span className={styles.statusDotOnline} />
                <span className={styles.kpiDelta}>400V DC • Thermal Nominal</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Usable Route Range</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{vehicle.usableRange}</span>
                <span className={styles.kpiUnit}>km</span>
              </div>
              <div className={styles.kpiFooter}>
                <span className={styles.kpiDelta}>
                  Efficiency: {vehicle.efficiencyVal} {vehicle.efficiencyUnit}
                </span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Live Passenger Density</span>
              <div className={styles.kpiValueRow}>
                <span className={`${styles.kpiValue} ${isOvercrowded ? styles.textCrit : ""}`}>
                  {passengerCount} / {vehicle.capacity}
                </span>
                <span className={styles.kpiUnit}>Pax</span>
              </div>
              <div className={styles.kpiFooter}>
                <span className={isOvercrowded ? styles.statusDotCrit : styles.statusDotOnline} />
                <span className={`${styles.kpiDelta} ${isOvercrowded ? styles.textCrit : ""}`}>
                  {occupancyPct}% • {isOvercrowded ? "Overcrowded" : "Safe Capacity"}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: 8/12 Bus Hero + 4/12 Route & Safety Stack */}
          <div className={styles.heroSectionGrid}>
            {/* Left 8/12: 3D Bus Hero Canvas */}
            <div className={styles.heroBusCard}>
              <Bus3DViewer
                vehicle={vehicle}
                speed={speed}
                doorsOpen={doorsOpen}
                isDriving={isDriving}
                hazardsActive={hazardsActive}
                acActive={acActive}
                tpmsPressures={tpmsPressures}
                onToggleDoors={handleToggleDoors}
                onSelectDiagnostics={() => onViewChange("diagnostics")}
                onToggleAc={() => setAcActive((prev) => !prev)}
                onToggleHazards={() => {
                  setHazardsActive((prev) => !prev);
                  playChime(620, "square", 0.1);
                }}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted((prev) => !prev)}
              />

              {/* Minimal Actuation Buttons */}
              <div className={styles.quickActuationRow}>
                <button
                  type="button"
                  className={`${styles.actuateBtn} ${doorsOpen ? styles.btnDoorOpen : ""}`}
                  onClick={handleToggleDoors}
                >
                  <ShieldIcon size={15} />
                  <span>{doorsOpen ? "Close Doors" : "Open Doors"}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${isDriving ? styles.btnDriveActive : ""}`}
                  onClick={() => {
                    if (doorsOpen) {
                      setInterlockLockoutMsg("INTERLOCK: Close passenger doors prior to applying drive throttle.");
                      return;
                    }
                    setIsDriving((prev) => !prev);
                    if (!isDriving) {
                      setIsBrakeApplied(false);
                      setTargetSpeed(42);
                      logIncident("THROTTLE ENGAGED: Vehicle accelerating along transit corridor", "info");
                    } else {
                      setTargetSpeed(0);
                      logIncident("SERVICE BRAKE ENGAGED: Vehicle decelerating to safe stop", "info");
                    }
                  }}
                >
                  {isDriving ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
                  <span>{isDriving ? "Brake (Stop)" : "Drive (Throttle)"}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${hazardsActive ? styles.btnHazardActive : ""}`}
                  onClick={() => {
                    setHazardsActive((prev) => !prev);
                    playChime(620, "square", 0.1);
                  }}
                >
                  <AlertTriangleIcon size={15} />
                  <span>Hazards</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${acActive ? styles.btnAcActive : ""}`}
                  onClick={() => setAcActive((prev) => !prev)}
                >
                  <ThermometerIcon size={15} />
                  <span>HVAC Climate</span>
                </button>
              </div>
            </div>

            {/* Right 4/12: Stacked Route Summary + Safety Status */}
            <div className={styles.sideStack}>
              {/* Route Progress Card */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <span className={styles.sideCardTitle}>Corridor Progress</span>
                  <span className={styles.sideCardPill}>{Math.round(routeProgress)}% Completed</span>
                </div>
                <span className={styles.corridorName}>{vehicle.route}</span>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${routeProgress}%` }} />
                </div>
                <div className={styles.nextStopRow}>
                  <span className={styles.nextStopLabel}>Next Station:</span>
                  <strong className={styles.nextStopName}>{vehicle.stops[1] || "City Center"}</strong>
                </div>
                <div className={styles.stopSeqList}>
                  {vehicle.stops.slice(0, 3).map((stop, idx) => (
                    <div key={idx} className={styles.stopItem}>
                      <span className={styles.stopDot} />
                      <span className={styles.stopText}>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Interlock Status Card */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <span className={styles.sideCardTitle}>Safety Interlocks</span>
                  <span className={doorsOpen ? styles.statusCautionPill : styles.statusOkPill}>
                    {doorsOpen ? "Doors Unlocked" : "Secured &amp; Locked"}
                  </span>
                </div>
                <div className={styles.safetyInfoList}>
                  <div className={styles.safetyRow}>
                    <span>Speed Interlock:</span>
                    <strong className={speed > 0 ? styles.textWarn : styles.textOk}>
                      {speed > 0 ? `Active (${speed} km/h)` : "Armed (0 km/h)"}
                    </strong>
                  </div>
                  <div className={styles.safetyRow}>
                    <span>Service Brake:</span>
                    <strong>{isBrakeApplied ? "Engaged (Park)" : "Released (Motion)"}</strong>
                  </div>
                  <div className={styles.safetyRow}>
                    <span>TPMS Health:</span>
                    <strong className={tpmsPressures.rl < 28 ? styles.textCrit : styles.textOk}>
                      {tpmsPressures.rl < 28 ? "Fault (RL 24 PSI)" : "Nominal (35 PSI)"}
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.viewSafetyBtn}
                  onClick={() => onViewChange("safety")}
                >
                  <span>Open Safety Ledger</span>
                  <ExternalLinkIcon size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: 7/12 Route Map + 5/12 Telemetry Charts */}
          <div className={styles.chartsRow}>
            {/* 7/12 Route Map */}
            <div className={styles.routeMapCard}>
              <div className={styles.cardHeaderWithAction}>
                <div>
                  <h3 className={styles.blockTitle}>Live Transit Corridor Route</h3>
                  <span className={styles.blockSub}>GPS tracking along Gomal University Expressway</span>
                </div>
                <button
                  type="button"
                  className={styles.tinyActionBtn}
                  onClick={() => onViewChange("routes")}
                >
                  Detailed Map
                </button>
              </div>

              <div className={styles.mapCanvasHolder}>
                <svg viewBox="0 0 600 240" className={styles.routeSvg}>
                  <defs>
                    <pattern id="lightGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(20,40,70,0.04)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lightGrid)" />
                  <path
                    d="M 40,190 C 120,170 190,80 320,100 S 480,50 560,40"
                    fill="none"
                    stroke="#174EB6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />
                  {/* Stops */}
                  <circle cx="40" cy="190" r="7" fill="#FFFFFF" stroke="#174EB6" strokeWidth="3" />
                  <rect x="52" y="180" width="105" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
                  <text x="56" y="193" fill="#13243D" fontSize="10" fontWeight="700">1. Gomal Terminal</text>

                  <circle cx="220" cy="115" r="7" fill="#FFFFFF" stroke="#174EB6" strokeWidth="3" />
                  <rect x="150" y="95" width="85" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
                  <text x="154" y="108" fill="#13243D" fontSize="10" fontWeight="700">2. Canal Gate</text>

                  <circle cx="390" cy="90" r="7" fill="#FFFFFF" stroke="#174EB6" strokeWidth="3" />
                  <rect x="390" y="105" width="85" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
                  <text x="394" y="118" fill="#13243D" fontSize="10" fontWeight="700">3. City Tower</text>

                  <circle cx="560" cy="40" r="7" fill="#FFFFFF" stroke="#15803D" strokeWidth="3" />
                  <rect x="460" y="25" width="90" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
                  <text x="464" y="38" fill="#13243D" fontSize="10" fontWeight="700">4. Tech Park</text>
                </svg>
              </div>
            </div>

            {/* 5/12 Telemetry Real-time Readings */}
            <div className={styles.telemetryCard}>
              <div className={styles.cardHeaderWithAction}>
                <div>
                  <h3 className={styles.blockTitle}>Telemetry &amp; Powertrain</h3>
                  <span className={styles.blockSub}>Direct simulated sensor stream</span>
                </div>
                <button
                  type="button"
                  className={styles.tinyActionBtn}
                  onClick={() => onViewChange("diagnostics")}
                >
                  Diagnostics
                </button>
              </div>

              <div className={styles.telemetryMeters}>
                <div className={styles.meterBox}>
                  <span className={styles.meterLabel}>Motor Speed</span>
                  <div className={styles.meterValueRow}>
                    <span className="tabular-num">{speed}</span>
                    <span className={styles.meterUnit}>km/h</span>
                  </div>
                  <div className={styles.meterBar}>
                    <div className={styles.meterFill} style={{ width: `${(speed / 80) * 100}%` }} />
                  </div>
                </div>

                <div className={styles.meterBox}>
                  <span className={styles.meterLabel}>Efficiency Rate</span>
                  <div className={styles.meterValueRow}>
                    <span className="tabular-num">{vehicle.efficiencyVal}</span>
                    <span className={styles.meterUnit}>{vehicle.efficiencyUnit}</span>
                  </div>
                  <div className={styles.meterBar}>
                    <div className={styles.meterFill} style={{ width: "55%" }} />
                  </div>
                </div>

                <div className={styles.meterBox}>
                  <span className={styles.meterLabel}>Battery Temp</span>
                  <div className={styles.meterValueRow}>
                    <span className="tabular-num">28.4</span>
                    <span className={styles.meterUnit}>°C</span>
                  </div>
                  <div className={styles.meterBar}>
                    <div className={styles.meterFill} style={{ width: "35%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Recent Activity Data Table */}
          <div className={styles.activityCard}>
            <div className={styles.cardHeaderWithAction}>
              <div>
                <h3 className={styles.blockTitle}>Recent Activity &amp; Incident Stream</h3>
                <span className={styles.blockSub}>Chronological telemetry events with source attribution</span>
              </div>
              <span className={styles.simStreamBadge}>Simulated Stream</span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.activityTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Event Description</th>
                    <th>Vehicle</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentLog.slice(0, 5).map((log, idx) => (
                    <tr key={idx}>
                      <td className="tabular-num">{log.timestamp}</td>
                      <td>
                        <span className={`${styles.levelPill} ${styles[`level_${log.level}`]}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td>{log.text}</td>
                      <td>{vehicle.code}</td>
                      <td>
                        <span className={styles.sourceSimPill}>SIMULATED</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          2. FLEET CATALOG VIEW (/fleet)
      ============================================================== */}
      {currentView === "fleet" && (
        <div className={styles.fleetView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Vehicle Fleet Catalog</h2>
              <p className={styles.viewSub}>Manage connected buses, specifications, and propulsion systems</p>
            </div>
            <div className={styles.fleetFilterRow}>
              <button
                type="button"
                className={`${styles.filterBtn} ${fleetFilter === "all" ? styles.filterBtnActive : ""}`}
                onClick={() => setFleetFilter("all")}
              >
                All Vehicles
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${fleetFilter === "electric" ? styles.filterBtnActive : ""}`}
                onClick={() => setFleetFilter("electric")}
              >
                100% Electric
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${fleetFilter === "hybrid" ? styles.filterBtnActive : ""}`}
                onClick={() => setFleetFilter("hybrid")}
              >
                Clean Hybrid
              </button>
            </div>
          </div>

          <div className={styles.fleetGrid}>
            {filteredVehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <div key={v.id} className={`${styles.vehicleCard} ${isSelected ? styles.vehicleCardSelected : ""}`}>
                  <div className={styles.vCardHeader}>
                    <div>
                      <span className={styles.vCardCode}>{v.code}</span>
                      <h3 className={styles.vCardName}>{v.name}</h3>
                      <span className={styles.vCardType}>{v.type}</span>
                    </div>
                    {isSelected && <span className={styles.selectedPill}>ACTIVE TWIN</span>}
                  </div>

                  <div className={styles.vCardImgWrap}>
                    <Image
                      src={v.image}
                      alt={v.alt}
                      width={380}
                      height={200}
                      className={styles.vCardImg}
                    />
                  </div>

                  <div className={styles.vCardSpecs}>
                    <div className={styles.vSpecItem}>
                      <span className={styles.vSpecLabel}>Energy Storage</span>
                      <strong>{v.batteryCap}</strong>
                    </div>
                    <div className={styles.vSpecItem}>
                      <span className={styles.vSpecLabel}>Usable Range</span>
                      <strong>{v.usableRange} km</strong>
                    </div>
                    <div className={styles.vSpecItem}>
                      <span className={styles.vSpecLabel}>Efficiency</span>
                      <strong>{v.efficiencyVal} {v.efficiencyUnit}</strong>
                    </div>
                    <div className={styles.vSpecItem}>
                      <span className={styles.vSpecLabel}>Passenger Cap</span>
                      <strong>{v.capacity} Pax</strong>
                    </div>
                  </div>

                  <div className={styles.vCardFooter}>
                    <button
                      type="button"
                      className={`${styles.selectVBtn} ${isSelected ? styles.selectVBtnActive : ""}`}
                      onClick={() => onSelectVehicle(v.id)}
                    >
                      {isSelected ? "Currently Active in Twin" : "Select for Simulation"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==============================================================
          3. 3D DIGITAL TWIN INSPECTOR (/vehicle)
      ============================================================== */}
      {currentView === "vehicle" && (
        <div className={styles.vehicleView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>3D Bus Digital Twin &amp; Actuators</h2>
              <p className={styles.viewSub}>Rotatable 360° chassis, physical actuation controls, and safety interlocks</p>
            </div>
            <span className={styles.modelTag}>{vehicle.name} • 12m City Transit Chassis</span>
          </div>

          <div className={styles.inspectorContainer}>
            <Bus3DViewer
              vehicle={vehicle}
              speed={speed}
              doorsOpen={doorsOpen}
              isDriving={isDriving}
              hazardsActive={hazardsActive}
              acActive={acActive}
              tpmsPressures={tpmsPressures}
              onToggleDoors={handleToggleDoors}
              onSelectDiagnostics={() => onViewChange("diagnostics")}
              onToggleAc={() => setAcActive((prev) => !prev)}
              onToggleHazards={() => {
                setHazardsActive((prev) => !prev);
                playChime(620, "square", 0.1);
              }}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
            />

            {/* Actuation Command Center */}
            <div className={styles.actuationCenter}>
              <h4 className={styles.actuationTitle}>Primary Vehicle Controls</h4>
              <div className={styles.actuationGrid}>
                <button
                  type="button"
                  className={`${styles.fullActuateBtn} ${doorsOpen ? styles.btnDoorOpen : ""}`}
                  onClick={handleToggleDoors}
                >
                  <ShieldIcon size={18} />
                  <div>
                    <strong>{doorsOpen ? "CLOSE PASSENGER DOORS" : "DISENGAGE DOOR LOCKS"}</strong>
                    <span className={styles.btnHint}>Speed interlock enforces 0 km/h</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.fullActuateBtn} ${isDriving ? styles.btnDriveActive : ""}`}
                  onClick={() => {
                    if (doorsOpen) {
                      setInterlockLockoutMsg("INTERLOCK: Close passenger doors prior to applying drive throttle.");
                      return;
                    }
                    setIsDriving((prev) => !prev);
                    if (!isDriving) {
                      setIsBrakeApplied(false);
                      setTargetSpeed(42);
                      logIncident("THROTTLE ENGAGED: Vehicle accelerating along transit corridor", "info");
                    } else {
                      setTargetSpeed(0);
                      logIncident("SERVICE BRAKE ENGAGED: Vehicle decelerating to safe stop", "info");
                    }
                  }}
                >
                  {isDriving ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                  <div>
                    <strong>{isDriving ? "ENGAGE SERVICE BRAKE" : "ACCELERATE (DRIVE)"}</strong>
                    <span className={styles.btnHint}>Throttle disabled when doors open</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.fullActuateBtn} ${hazardsActive ? styles.btnHazardActive : ""}`}
                  onClick={() => {
                    setHazardsActive((prev) => !prev);
                    playChime(620, "square", 0.1);
                  }}
                >
                  <AlertTriangleIcon size={18} />
                  <div>
                    <strong>HAZARD STROBE</strong>
                    <span className={styles.btnHint}>Amber flashers &amp; relay tick</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.fullActuateBtn} ${acActive ? styles.btnAcActive : ""}`}
                  onClick={() => setAcActive((prev) => !prev)}
                >
                  <ThermometerIcon size={18} />
                  <div>
                    <strong>CLIMATE CONTROL (HVAC)</strong>
                    <span className={styles.btnHint}>Roof dual units (22°C Auto)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          4. ROUTES & GPS (/routes)
      ============================================================== */}
      {currentView === "routes" && (
        <div className={styles.routesView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Live Transit Corridor Route &amp; GPS</h2>
              <p className={styles.viewSub}>Real-time polyline navigation, schedule adherence &amp; waypoint ETAs</p>
            </div>
            <span className={styles.progressPill}>Route Progress: {Math.round(routeProgress)}%</span>
          </div>

          <div className={styles.routesGrid}>
            <div className={styles.mapContainer}>
              <svg viewBox="0 0 600 320" className={styles.fullRouteSvg}>
                <defs>
                  <pattern id="routeGridPattern" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(20,40,70,0.05)" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#routeGridPattern)" />
                <path
                  d="M 50,260 C 140,240 200,100 320,130 S 480,80 540,50"
                  fill="none"
                  stroke="#174EB6"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8 5"
                />
                <circle cx="50" cy="260" r="9" fill="#FFFFFF" stroke="#174EB6" strokeWidth="4" />
                <rect x="65" y="250" width="155" height="20" rx="4" fill="#FFFFFF" opacity="0.9" />
                <text x="70" y="264" fill="#13243D" fontSize="11" fontWeight="700">1. Gomal Campus Terminal</text>

                <circle cx="210" cy="140" r="9" fill="#FFFFFF" stroke="#174EB6" strokeWidth="4" />
                <rect x="140" y="115" width="150" height="20" rx="4" fill="#FFFFFF" opacity="0.9" />
                <text x="145" y="129" fill="#13243D" fontSize="11" fontWeight="700">2. Canal Expressway Gate</text>

                <circle cx="380" cy="115" r="9" fill="#FFFFFF" stroke="#174EB6" strokeWidth="4" />
                <rect x="380" y="130" width="145" height="20" rx="4" fill="#FFFFFF" opacity="0.9" />
                <text x="385" y="144" fill="#13243D" fontSize="11" fontWeight="700">3. Faisalabad City Tower</text>

                <circle cx="540" cy="50" r="9" fill="#FFFFFF" stroke="#15803D" strokeWidth="4" />
                <rect x="420" y="35" width="115" height="20" rx="4" fill="#FFFFFF" opacity="0.9" />
                <text x="425" y="49" fill="#13243D" fontSize="11" fontWeight="700">4. Tech Park Terminal</text>
              </svg>

              <div className={styles.speedSimulationRow}>
                <button
                  type="button"
                  className={styles.simSpeedBtn}
                  onClick={() => { setTargetSpeed(0); setIsBrakeApplied(true); }}
                >
                  Hold at Stop (0 km/h)
                </button>
                <button
                  type="button"
                  className={styles.simSpeedBtn}
                  onClick={() => { setIsDriving(true); setIsBrakeApplied(false); setTargetSpeed(35); }}
                >
                  City Transit Speed (35 km/h)
                </button>
                <button
                  type="button"
                  className={styles.simSpeedBtn}
                  onClick={() => { setIsDriving(true); setIsBrakeApplied(false); setTargetSpeed(60); }}
                >
                  Expressway Speed (60 km/h)
                </button>
              </div>
            </div>

            <div className={styles.timelineCard}>
              <h4 className={styles.timelineTitle}>Station Timetable &amp; Dwell</h4>
              <div className={styles.timetableList}>
                {vehicle.stops.map((stop, idx) => (
                  <div key={idx} className={styles.timetableItem}>
                    <span className={styles.timeDot} />
                    <div className={styles.timeInfo}>
                      <span className={styles.timeStop}>{stop}</span>
                      <span className={styles.timeMeta}>ETA: +{idx * 6} mins • Dwell: 45s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          5. PASSENGER DENSITY & FLOW (/passengers)
      ============================================================== */}
      {currentView === "passengers" && (
        <div className={styles.passengersView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Passenger Density &amp; Flow Control</h2>
              <p className={styles.viewSub}>Contactless RFID student attendance &amp; automated overcrowding prevention</p>
            </div>
            <button
              type="button"
              className={styles.rfidActionBtn}
              onClick={handleSimulateRfidTap}
            >
              <UserCheckIcon size={16} />
              <span>Simulate Student RFID Tap</span>
            </button>
          </div>

          <div className={styles.densityCard}>
            <div className={styles.densityHeader}>
              <div>
                <span className={styles.densityLabel}>Current Onboard:</span>
                <strong className={styles.densityVal}>{passengerCount} Passengers</strong>
              </div>
              <div>
                <span className={styles.densityLabel}>Safe Seating Capacity:</span>
                <strong className={styles.densityVal}>{vehicle.capacity} Pax</strong>
              </div>
            </div>

            <div className={styles.gaugeTrack}>
              <div
                className={`${styles.gaugeFill} ${isOvercrowded ? styles.gaugeFillCrit : ""}`}
                style={{ width: `${Math.min(100, occupancyPct)}%` }}
              />
            </div>

            {isOvercrowded && (
              <div className={styles.crowdAlert}>
                <AlertTriangleIcon size={18} />
                <span>
                  OVERCROWDING WARNING: Vehicle is operating at {occupancyPct}% of rated capacity. Secondary shuttle dispatch advised.
                </span>
              </div>
            )}
          </div>

          {/* RFID Student Log Table */}
          <div className={styles.rfidLogCard}>
            <h4 className={styles.rfidCardTitle}>Contactless RFID Student Scan Ledger</h4>
            <div className={styles.tableWrapper}>
              <table className={styles.activityTable}>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Smart Card Code</th>
                    <th>Boarding Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rfidLog.map((log, idx) => (
                    <tr key={idx}>
                      <td><strong>{log.name}</strong></td>
                      <td><span className={styles.rollBadge}>{log.roll}</span></td>
                      <td className="tabular-num">{log.cardId}</td>
                      <td className="tabular-num">{log.time}</td>
                      <td><span className={styles.statusPillBoarded}>{log.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          6. DIAGNOSTICS & TPMS (/diagnostics)
      ============================================================== */}
      {currentView === "diagnostics" && (
        <div className={styles.diagnosticsView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Chassis Diagnostics &amp; 4-Wheel TPMS</h2>
              <p className={styles.viewSub}>Continuous sensor reading simulation &amp; CAN-Bus fault detection</p>
            </div>
          </div>

          <div className={styles.diagGrid}>
            <div className={styles.tpmsCard}>
              <h4 className={styles.tpmsTitle}>4-Wheel Tyre Pressure Monitoring (TPMS)</h4>
              <div className={styles.tpmsChassisGraphic}>
                <div className={styles.wheelBox}>
                  <span className={styles.wName}>Front Left (FL)</span>
                  <strong className={styles.wPsi}>{tpmsPressures.fl} PSI</strong>
                  <span className={styles.wStatusOk}>Nominal</span>
                </div>
                <div className={styles.wheelBox}>
                  <span className={styles.wName}>Front Right (FR)</span>
                  <strong className={styles.wPsi}>{tpmsPressures.fr} PSI</strong>
                  <span className={styles.wStatusOk}>Nominal</span>
                </div>
                <div className={`${styles.wheelBox} ${tpmsPressures.rl < 28 ? styles.wheelBoxCrit : ""}`}>
                  <span className={styles.wName}>Rear Left (RL)</span>
                  <strong className={styles.wPsi}>{tpmsPressures.rl} PSI</strong>
                  <span className={tpmsPressures.rl < 28 ? styles.wStatusCrit : styles.wStatusOk}>
                    {tpmsPressures.rl < 28 ? "CRITICAL LOW" : "Nominal"}
                  </span>
                </div>
                <div className={styles.wheelBox}>
                  <span className={styles.wName}>Rear Right (RR)</span>
                  <strong className={styles.wPsi}>{tpmsPressures.rr} PSI</strong>
                  <span className={styles.wStatusOk}>Nominal</span>
                </div>
              </div>

              <div className={styles.tpmsTestButtons}>
                <button
                  type="button"
                  className={styles.faultInjectBtn}
                  onClick={() => {
                    setTpmsPressures((prev) => ({ ...prev, rl: 24 }));
                    logIncident("DIAGNOSTIC TEST: Injected low pressure event on Rear-Left tyre (24 PSI)", "caution");
                  }}
                >
                  Simulate RL Pressure Drop (24 PSI)
                </button>
                <button
                  type="button"
                  className={styles.faultResetBtn}
                  onClick={() => {
                    setTpmsPressures({ fl: 35, fr: 35, rl: 35, rr: 35 });
                    logIncident("TPMS CALIBRATED: Pressure restored across all 4 tyres to 35 PSI", "info");
                  }}
                >
                  Reset / Re-Inflate (35 PSI)
                </button>
              </div>
            </div>

            <div className={styles.faultsCard}>
              <h4 className={styles.faultsTitle}>Active CAN-Bus / OBD-II Fault Codes</h4>
              <div className={styles.faultsList}>
                {activeFaults.length > 0 ? (
                  activeFaults.map((f, idx) => (
                    <div key={idx} className={styles.faultItemCrit}>
                      <span className={styles.faultBadge}>{f.code}</span>
                      <div>
                        <strong>{f.system}</strong>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.nominalBox}>
                    <CheckIcon size={22} />
                    <span>All chassis CAN-Bus ECUs responding with zero active fault codes.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          7. AI CAMERA INSPECTION (/ai-inspection)
      ============================================================== */}
      {currentView === "ai-inspection" && (
        <div className={styles.aiView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>AI Camera Visual Defect Screening</h2>
              <p className={styles.viewSub}>
                Computer vision screening for exterior surface, tyre wear and body panel anomalies
              </p>
            </div>
            <div className={styles.disclaimerPill}>
              <InfoIcon size={13} />
              <span>AI-Assisted Visual Screening • Requires Technician Confirmation</span>
            </div>
          </div>

          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <div className={styles.casePicker}>
                {DEFAULT_INSPECTION_CASES.map((tc) => (
                  <button
                    key={tc.id}
                    type="button"
                    className={`${styles.caseBtn} ${selectedInspectionCase.id === tc.id ? styles.caseBtnActive : ""}`}
                    onClick={() => setSelectedInspectionCase(tc)}
                  >
                    {tc.title}
                  </button>
                ))}
              </div>

              <div className={styles.aiResultLayout}>
                <div className={styles.aiImgHolder}>
                  <Image
                    src={selectedInspectionCase.image}
                    alt={selectedInspectionCase.title}
                    width={320}
                    height={180}
                    className={styles.aiPreviewImg}
                  />
                </div>

                <div className={styles.aiTextHolder}>
                  <div className={styles.aiMetaRow}>
                    <span className={styles.aiCat}>{selectedInspectionCase.category}</span>
                    <span className={`${styles.aiStatus} ${selectedInspectionCase.severity === "critical" ? styles.aiCrit : styles.aiOk}`}>
                      {selectedInspectionCase.status}
                    </span>
                    <span className={styles.aiConf}>Confidence: {selectedInspectionCase.confidence}</span>
                  </div>
                  <h4 className={styles.aiSectionTitle}>Detected Visual Features:</h4>
                  <p className={styles.aiParagraph}>{selectedInspectionCase.findings}</p>
                  <h4 className={styles.aiSectionTitle}>Maintenance Recommendation:</h4>
                  <p className={styles.aiParagraph}>{selectedInspectionCase.recommendation}</p>

                  <button
                    type="button"
                    className={styles.confirmInspectBtn}
                    onClick={() => handleConfirmInspection(selectedInspectionCase)}
                  >
                    <CheckIcon size={14} />
                    <span>Technician Confirm &amp; Queue Work Order (Ayesha Batool)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.historyCard}>
              <h4 className={styles.historyTitle}>Verified Inspection History</h4>
              <div className={styles.historyList}>
                {inspectionHistory.length > 0 ? (
                  inspectionHistory.map((item) => (
                    <div key={item.id} className={styles.historyItem}>
                      <span className="tabular-num">{item.timestamp}</span>
                      <strong>{item.title}</strong>
                      <span className={styles.hAction}>{item.action}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyNotice}>
                    No work orders queued yet. Select test photo and confirm above.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          8. SAFETY LEDGER (/safety)
      ============================================================== */}
      {currentView === "safety" && (
        <div className={styles.safetyView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Safety Interlocks &amp; Incident Ledger</h2>
              <p className={styles.viewSub}>
                Immutable audit stream tracking speed-dependent door blocks, brake interlocks and alarms
              </p>
            </div>
          </div>

          <div className={styles.safetyCardWrap}>
            <div className={styles.tableWrapper}>
              <table className={styles.activityTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Operational Incident Log</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentLog.map((inc, idx) => (
                    <tr key={idx}>
                      <td className="tabular-num">{inc.timestamp}</td>
                      <td>
                        <span className={`${styles.levelPill} ${styles[`level_${inc.level}`]}`}>
                          {inc.level.toUpperCase()}
                        </span>
                      </td>
                      <td>{inc.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          9. REPORTS (/reports)
      ============================================================== */}
      {currentView === "reports" && (
        <div className={styles.reportsView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>University Academic Demonstration &amp; Telemetry Report</h2>
              <p className={styles.viewSub}>
                Export live trip logs, passenger density data, and safety interlock verifications
              </p>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.reportHeader}>
              <div>
                <h3 className={styles.reportDocTitle}>NEBULA TRANSIT • OPERATIONAL TELEMETRY REPORT</h3>
                <span className={styles.reportAuthor}>Candidate: Ayesha Batool (M245004) • Gomal University Faisalabad</span>
              </div>
              <span className={styles.reportSimBadge}>SIMULATED SYSTEM AUDIT</span>
            </div>

            <div className={styles.reportStatsGrid}>
              <div className={styles.rItem}>
                <span className={styles.rLabel}>Vehicle ID:</span>
                <strong>{vehicle.id} ({vehicle.code})</strong>
              </div>
              <div className={styles.rItem}>
                <span className={styles.rLabel}>Total Events:</span>
                <strong>{incidentLog.length} Recorded</strong>
              </div>
              <div className={styles.rItem}>
                <span className={styles.rLabel}>Corridor Route:</span>
                <strong>{vehicle.route.split("—")[0]}</strong>
              </div>
              <div className={styles.rItem}>
                <span className={styles.rLabel}>Safety Compliance:</span>
                <strong className={styles.textOk}>100% Interlock Adherence</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.csvDownloadBtn}
              onClick={handleExportCSV}
            >
              <DownloadIcon size={16} />
              <span>Download Telemetry &amp; Safety Ledger (CSV)</span>
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          10. TEACHER DEMO (/demo)
      ============================================================== */}
      {currentView === "demo" && (
        <div className={styles.demoView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Examiner &amp; Teacher Guided Demonstration</h2>
              <p className={styles.viewSub}>
                One-click deterministic scenarios for oral defense &amp; evaluation (5–7 min live flow)
              </p>
            </div>
            <button
              type="button"
              className={styles.resetSimBtn}
              onClick={() => {
                setSpeed(0);
                setTargetSpeed(0);
                setIsBrakeApplied(true);
                setDoorsOpen(false);
                setPassengerCount(26);
                setTpmsPressures({ fl: 35, fr: 35, rl: 35, rr: 35 });
                setActiveFaults([]);
                logIncident("Teacher Demo: Baseline nominal state initialized", "info");
              }}
            >
              <RefreshCwIcon size={14} />
              <span>Reset to Baseline</span>
            </button>
          </div>

          <div className={styles.demoScenariosGrid}>
            <div
              className={styles.demoCard}
              onClick={() => {
                setSpeed(0);
                setTargetSpeed(0);
                setIsBrakeApplied(true);
                setDoorsOpen(false);
                setPassengerCount(26);
                setTpmsPressures({ fl: 35, fr: 35, rl: 35, rr: 35 });
                setActiveFaults([]);
                logIncident("Scenario 1: Nominal route initialized", "info");
              }}
            >
              <div className={styles.demoCardTop}>
                <CheckIcon size={18} />
                <strong>1. Healthy Baseline Fleet</strong>
              </div>
              <p>Nominal route operation, correct EV kWh metrics, 0 active faults, doors secured.</p>
            </div>

            <div
              className={styles.demoCard}
              onClick={() => {
                setIsPowered(true);
                setIsBrakeApplied(false);
                setIsDriving(true);
                setTargetSpeed(35);
                setSpeed(35);
                setTimeout(() => {
                  const warning = `INTERLOCK TEST: Moving door opening strictly blocked at 35 km/h. Passengers protected.`;
                  setInterlockLockoutMsg(warning);
                  playChime(320, "sawtooth", 0.35);
                  logIncident(`INTERLOCK ENFORCED: Remote door open REJECTED while vehicle moving at 35 km/h`, "critical");
                }, 600);
              }}
            >
              <div className={styles.demoCardTop}>
                <ShieldIcon size={18} />
                <strong>2. Door Safety Interlock (35 km/h)</strong>
              </div>
              <p>Bus travels at 35 km/h: Door open attempt is strictly blocked with warning and audit logged.</p>
            </div>

            <div
              className={styles.demoCard}
              onClick={() => {
                setPassengerCount(44);
                playChime(440, "square", 0.3);
                logIncident(`OVERCROWDING ALERT: Passenger count (44) exceeds certified capacity (42 Pax)`, "critical");
              }}
            >
              <div className={styles.demoCardTop}>
                <UsersIcon size={18} />
                <strong>3. Overcrowding Event (44/42 Pax)</strong>
              </div>
              <p>Passengers exceed certified seating capacity: Triggers automated dispatcher early-warning.</p>
            </div>

            <div
              className={styles.demoCard}
              onClick={() => {
                setTpmsPressures({ fl: 35, fr: 35, rl: 24, rr: 35 });
                setActiveFaults((prev) => [
                  { code: "TPMS-04", system: "Running Gear", desc: "Rear-Left Low Pressure (24 PSI vs 35 PSI spec)", severity: "critical" },
                  ...prev
                ]);
                playChime(420, "square", 0.3);
                logIncident(`CRITICAL FAULT: TPMS-04 Rear-Left tyre pressure dropped to 24 PSI`, "critical");
              }}
            >
              <div className={styles.demoCardTop}>
                <AlertTriangleIcon size={18} />
                <strong>4. Low Tyre Pressure (RL 24 PSI)</strong>
              </div>
              <p>Rear-Left tyre pressure drops below 28 PSI safety threshold: TPMS fault code generated.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          11. SETTINGS (/settings)
      ============================================================== */}
      {currentView === "settings" && (
        <div className={styles.settingsView}>
          <div className={styles.viewHeadingRow}>
            <div>
              <h2 className={styles.viewTitle}>Platform Settings &amp; Attribution</h2>
              <p className={styles.viewSub}>Sensory preferences, data source validation, and academic thesis details</p>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.settingRow}>
              <div>
                <strong>Simulation Audio Engine</strong>
                <p>Web Audio API synthesizer for propulsion hum, air brakes, and door chimes</p>
              </div>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setIsMuted((prev) => !prev)}
              >
                {isMuted ? "Sound Disabled (Muted)" : "Sound Enabled"}
              </button>
            </div>

            <div className={styles.settingRow}>
              <div>
                <strong>Telemetric Data Source</strong>
                <p>Environment classification for audit compliance</p>
              </div>
              <span className={styles.simPill}>SIMULATED DATA / DEMO MODE</span>
            </div>

            <div className={styles.settingRow}>
              <div>
                <strong>Thesis Candidate Attribution</strong>
                <p>Ayesha Batool (Roll No: M245004) • Gomal University Faisalabad</p>
              </div>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onTriggerModal}
              >
                View Full Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
