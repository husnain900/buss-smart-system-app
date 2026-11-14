"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FleetControlRoom.module.css";
import {
  BusIcon,
  CarIcon,
  MapPinIcon,
  CreditCardIcon,
  UserCheckIcon,
  UsersIcon,
  AlertTriangleIcon,
  PlayIcon,
  PauseIcon,
  ThermometerIcon,
  ShieldIcon,
  RadioIcon,
  CheckIcon,
  QrCodeIcon,
  CameraIcon,
  DownloadIcon,
  RefreshCwIcon,
  WrenchIcon,
  ZapIcon,
  VolumeIcon,
  VolumeXIcon,
  InfoIcon,
  LayersIcon
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
  }
];

export default function FleetControlRoom({ onTriggerModal, demoScenarioTrigger, onClearDemoTrigger }) {
  const [activeTab, setActiveTab] = useState("inspector"); // inspector, route, passengers, diagnostics, ai_inspection, safety, reports
  const [selectedVehicleId, setSelectedVehicleId] = useState("EV-12");

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
  const [routeProgress, setRouteProgress] = useState(15); // 0-100%
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
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

  // 3D/2D View Angle
  const [viewAngle, setViewAngle] = useState("perspective"); // perspective, side, front, cockpit

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
      // Trying to OPEN doors
      if (speed > 0 || !isBrakeApplied) {
        // INTERLOCK BLOCKS ACTION
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
      // CLOSE DOORS
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

  // Listen to Demo Scenarios from Teacher Bar
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
      setActiveTab("inspector");
      setIsPowered(true);
      setIsBrakeApplied(false);
      setIsDriving(true);
      setTargetSpeed(35);
      setSpeed(35);
      // Attempt to open door while moving
      setTimeout(() => {
        const warning = `INTERLOCK TEST: Moving door opening strictly blocked at 35 km/h. System protected passengers.`;
        setInterlockLockoutMsg(warning);
        playChime(320, "sawtooth", 0.35);
        logIncident(`INTERLOCK ENFORCED: Remote door open REJECTED while vehicle moving at 35 km/h`, "critical");
      }, 600);
    } else if (demoScenarioTrigger === "overcrowding") {
      setActiveTab("passengers");
      setPassengerCount(44); // Exceeds 42
      playChime(440, "square", 0.3);
      logIncident(`OVERCROWDING ALERT: Passenger count (44) exceeds certified capacity (42 Pax)`, "critical");
    } else if (demoScenarioTrigger === "low_tyre") {
      setActiveTab("diagnostics");
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
      technician: "Technician Verified (Ayesha Batool)",
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

  return (
    <div className={styles.container}>
      {/* Module Navigation Tabs */}
      <div className={styles.moduleNav}>
        <div className={styles.moduleTabsGroup} role="tablist">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "inspector" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("inspector")}
          >
            <BusIcon size={14} />
            <span>3D/2D Bus Inspector</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "route" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("route")}
          >
            <MapPinIcon size={14} />
            <span>Live Route &amp; GPS</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "passengers" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("passengers")}
          >
            <UsersIcon size={14} />
            <span>Passenger Flow</span>
            {isOvercrowded && <span className={styles.tabBadgeAlert}>!</span>}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "diagnostics" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("diagnostics")}
          >
            <WrenchIcon size={14} />
            <span>Diagnostics &amp; TPMS</span>
            {tpmsPressures.rl < 28 && <span className={styles.tabBadgeAlert}>1</span>}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "ai_inspection" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("ai_inspection")}
          >
            <CameraIcon size={14} />
            <span>AI Camera Scanner</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "safety" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("safety")}
          >
            <ShieldIcon size={14} />
            <span>Safety Ledger</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "reports" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <DownloadIcon size={14} />
            <span>Export Reports</span>
          </button>
        </div>

        {/* Vehicle Selection Chips */}
        <div className={styles.vehicleSelector}>
          {Object.values(VEHICLE_CATALOG).map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${styles.vehicleChip} ${selectedVehicleId === v.id ? styles.vehicleChipActive : ""}`}
              onClick={() => setSelectedVehicleId(v.id)}
            >
              <span className={styles.chipCode}>{v.code}</span>
              <span className={styles.chipName}>{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Interlock Banner Notification */}
      <AnimatePresence>
        {interlockLockoutMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.interlockBanner}
          >
            <AlertTriangleIcon size={18} />
            <span>{interlockLockoutMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Telemetry Strip */}
      <div className={styles.telemetryBar}>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Vehicle Status</span>
          <div className={styles.telemetryValWrap}>
            <span className={`${styles.statusDot} ${speed > 0 ? styles.statusDotActive : ""}`} />
            <span className={styles.telemetryValue}>
              {speed > 0 ? `In Transit (${speed} km/h)` : isBrakeApplied ? "Stationary &bull; Brakes On" : "Idle"}
            </span>
          </div>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>
            {vehicle.isElectric ? "Battery State of Charge" : "Fuel Reserve"}
          </span>
          <span className={styles.telemetryValue}>
            {vehicle.isElectric ? "78% (320 kWh)" : "82% Euro-6"}
          </span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Usable Route Range</span>
          <span className={styles.telemetryValue}>{vehicle.usableRange} km</span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Real-Time Efficiency</span>
          <span className={styles.telemetryValue}>
            {vehicle.efficiencyVal} {vehicle.efficiencyUnit}
          </span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Live Occupancy</span>
          <span className={`${styles.telemetryValue} ${isOvercrowded ? styles.textCritical : ""}`}>
            {passengerCount} / {vehicle.capacity} Pax ({occupancyPct}%)
          </span>
        </div>
      </div>

      {/* Main View Container */}
      <div className={styles.viewContent}>
        {activeTab === "inspector" && (
          <div className={styles.inspectorGrid}>
            {/* Visual Bus Stage */}
            <div className={styles.stageCard}>
              <div className={styles.stageHeader}>
                <div>
                  <h3 className={styles.stageTitle}>{vehicle.name}</h3>
                  <span className={styles.stageSub}>{vehicle.type} &bull; {vehicle.route}</span>
                </div>
                <div className={styles.viewAngleSwitcher}>
                  <button
                    type="button"
                    className={`${styles.angleBtn} ${viewAngle === "perspective" ? styles.angleBtnActive : ""}`}
                    onClick={() => setViewAngle("perspective")}
                  >
                    3/4 Angle
                  </button>
                  <button
                    type="button"
                    className={`${styles.angleBtn} ${viewAngle === "side" ? styles.angleBtnActive : ""}`}
                    onClick={() => setViewAngle("side")}
                  >
                    Side Profile
                  </button>
                  <button
                    type="button"
                    className={`${styles.angleBtn} ${viewAngle === "cockpit" ? styles.angleBtnActive : ""}`}
                    onClick={() => setViewAngle("cockpit")}
                  >
                    Cockpit Telematics
                  </button>
                </div>
              </div>

              <div className={styles.vehicleImageWrap}>
                <Image
                  src={vehicle.image}
                  alt={vehicle.alt}
                  width={680}
                  height={380}
                  className={styles.heroBusImage}
                  priority
                />

                {/* Interactive Hotspots */}
                <div className={styles.hotspotsLayer}>
                  <button
                    type="button"
                    className={`${styles.hotspot} ${doorsOpen ? styles.hotspotActive : ""}`}
                    style={{ top: "54%", left: "32%" }}
                    onClick={handleToggleDoors}
                    title="Front Passenger Door Actuator"
                  >
                    <span className={styles.hotspotPing} />
                    <span className={styles.hotspotLabel}>Door 1: {doorsOpen ? "OPEN" : "LOCKED"}</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.hotspot} ${tpmsPressures.rl < 28 ? styles.hotspotCritical : ""}`}
                    style={{ top: "72%", left: "68%" }}
                    onClick={() => setActiveTab("diagnostics")}
                    title="Rear Left Tyre TPMS Sensor"
                  >
                    <span className={styles.hotspotPing} />
                    <span className={styles.hotspotLabel}>RL Tyre: {tpmsPressures.rl} PSI</span>
                  </button>

                  <button
                    type="button"
                    className={styles.hotspot}
                    style={{ top: "22%", left: "48%" }}
                    title="Roof HVAC Module"
                  >
                    <span className={styles.hotspotLabel}>HVAC: {acActive ? "22°C Active" : "Off"}</span>
                  </button>
                </div>
              </div>

              {/* Physical / Actuation Controls */}
              <div className={styles.actuationPanel}>
                <button
                  type="button"
                  className={`${styles.actuateBtn} ${doorsOpen ? styles.doorBtnOpen : styles.doorBtnLocked}`}
                  onClick={handleToggleDoors}
                >
                  <ShieldIcon size={16} />
                  <span>{doorsOpen ? "CLOSE & LOCK DOORS" : "DISENGAGE DOOR LOCKS"}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${isDriving ? styles.driveBtnActive : ""}`}
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
                  {isDriving ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  <span>{isDriving ? "DECELERATE & BRAKE" : "ACCELERATE (DRIVE ROUTE)"}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${hazardsActive ? styles.hazardBtnActive : ""}`}
                  onClick={() => {
                    setHazardsActive((prev) => !prev);
                    playChime(620, "square", 0.1);
                  }}
                >
                  <AlertTriangleIcon size={16} />
                  <span>HAZARD STROBE</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actuateBtn} ${acActive ? styles.acBtnActive : ""}`}
                  onClick={() => setAcActive((prev) => !prev)}
                >
                  <ThermometerIcon size={16} />
                  <span>CLIMATE HVAC</span>
                </button>
              </div>
            </div>

            {/* Quick Overview Sidebar */}
            <div className={styles.sideSummaryCard}>
              <h4 className={styles.summaryTitle}>Mission Status &amp; Core Telematics</h4>
              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span>Corridor Route:</span>
                  <strong>{vehicle.route.split("—")[0]}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Current Speed:</span>
                  <strong className="tabular-num">{speed} km/h</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Door Safety Lock:</span>
                  <span className={doorsOpen ? styles.textCaution : styles.textSuccess}>
                    {doorsOpen ? "DISENGAGED (STATIONARY)" : "SECURED &amp; LOCKED"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Service Brake:</span>
                  <span>{isBrakeApplied ? "Engaged (Hold)" : "Disengaged (Motion)"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>4-Wheel TPMS:</span>
                  <span className={tpmsPressures.rl < 28 ? styles.textCritical : styles.textSuccess}>
                    {tpmsPressures.rl < 28 ? "FAULT (RL 24 PSI)" : "All Nominal (35 PSI)"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Passenger Density:</span>
                  <span className={isOvercrowded ? styles.textCritical : styles.textSuccess}>
                    {passengerCount} / {vehicle.capacity} ({occupancyPct}%)
                  </span>
                </div>
              </div>

              <div className={styles.academicAttributionNote}>
                <InfoIcon size={14} />
                <span>
                  Simulated IoT Telemetry Model designed &amp; engineered by <strong>Ayesha Batool (M245004)</strong> for Bachelor of Science in Computer Science Thesis, Gomal University.
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "route" && (
          <div className={styles.routeGrid}>
            <div className={styles.mapVectorCard}>
              <div className={styles.mapHeader}>
                <h4>Live GPS Route &amp; Transit Corridor</h4>
                <span className={styles.routeProgressText}>Progress: {Math.round(routeProgress)}%</span>
              </div>

              {/* Vector Geographic Polyline */}
              <div className={styles.mapSvgArea}>
                <svg viewBox="0 0 600 320" className={styles.vectorMapSvg}>
                  <defs>
                    <pattern id="gridMap" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridMap)" />

                  {/* Route Polyline */}
                  <path
                    d="M 50,260 C 140,240 200,100 320,130 S 480,80 540,50"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />

                  {/* Stops */}
                  <circle cx="50" cy="260" r="9" fill="#151D28" stroke="#D6F45A" strokeWidth="3" />
                  <text x="65" y="265" fill="#F4F7FB" fontSize="11" fontWeight="700">1. Gomal Campus Terminal</text>

                  <circle cx="210" cy="140" r="9" fill="#151D28" stroke="#D6F45A" strokeWidth="3" />
                  <text x="225" y="145" fill="#F4F7FB" fontSize="11" fontWeight="700">2. Canal Expressway Gate</text>

                  <circle cx="380" cy="115" r="9" fill="#151D28" stroke="#D6F45A" strokeWidth="3" />
                  <text x="395" y="120" fill="#F4F7FB" fontSize="11" fontWeight="700">3. Faisalabad City Tower</text>

                  <circle cx="540" cy="50" r="9" fill="#151D28" stroke="#42C895" strokeWidth="3" />
                  <text x="430" y="45" fill="#F4F7FB" fontSize="11" fontWeight="700">4. Tech Park Terminal</text>
                </svg>
              </div>

              <div className={styles.routeControls}>
                <button
                  type="button"
                  className={styles.routeSpeedBtn}
                  onClick={() => { setTargetSpeed(0); setIsBrakeApplied(true); }}
                >
                  Hold at Stop (0 km/h)
                </button>
                <button
                  type="button"
                  className={styles.routeSpeedBtn}
                  onClick={() => { setIsDriving(true); setIsBrakeApplied(false); setTargetSpeed(35); }}
                >
                  City Transit Speed (35 km/h)
                </button>
                <button
                  type="button"
                  className={styles.routeSpeedBtn}
                  onClick={() => { setIsDriving(true); setIsBrakeApplied(false); setTargetSpeed(60); }}
                >
                  Expressway Speed (60 km/h)
                </button>
              </div>
            </div>

            <div className={styles.routeSideTimeline}>
              <h4>Waypoint Schedule &amp; ETA</h4>
              <div className={styles.timelineList}>
                {vehicle.stops.map((stop, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineText}>
                      <span className={styles.stopName}>{stop}</span>
                      <span className={styles.stopEta}>ETA: +{idx * 6} mins &bull; Dwell: 45s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "passengers" && (
          <div className={styles.passengersGrid}>
            <div className={styles.passengerFlowCard}>
              <div className={styles.flowCardHeader}>
                <div>
                  <h4>Passenger Density &amp; Capacity Control</h4>
                  <p>Smart contactless attendance and overcrowding early-warning threshold</p>
                </div>
                <button
                  type="button"
                  className={styles.rfidTapBtn}
                  onClick={handleSimulateRfidTap}
                >
                  <UserCheckIcon size={14} />
                  <span>Simulate Student RFID Tap</span>
                </button>
              </div>

              <div className={styles.occupancyGauge}>
                <div className={styles.gaugeHeader}>
                  <span>Current Onboard: <strong>{passengerCount} Passengers</strong></span>
                  <span>Safe Capacity: <strong>{vehicle.capacity} Pax</strong></span>
                </div>
                <div className={styles.gaugeTrack}>
                  <div
                    className={`${styles.gaugeFill} ${isOvercrowded ? styles.gaugeFillCritical : ""}`}
                    style={{ width: `${Math.min(100, occupancyPct)}%` }}
                  />
                </div>
                {isOvercrowded && (
                  <div className={styles.overcrowdingAlertBox}>
                    <AlertTriangleIcon size={16} />
                    <span>
                      OVERCROWDING WARNING: Vehicle is operating at {occupancyPct}% of rated capacity. Supplemental dispatch advised.
                    </span>
                  </div>
                )}
              </div>

              {/* RFID Scanner Roll Call Log */}
              <h5 className={styles.rfidLogTitle}>Contactless RFID Student Scan Ledger</h5>
              <div className={styles.rfidTable}>
                <div className={styles.rfidHeaderRow}>
                  <span>Student Name</span>
                  <span>Roll No</span>
                  <span>Smart Card ID</span>
                  <span>Timestamp</span>
                  <span>Status</span>
                </div>
                {rfidLog.map((log, idx) => (
                  <div key={idx} className={styles.rfidDataRow}>
                    <strong>{log.name}</strong>
                    <span className={styles.rollBadge}>{log.roll}</span>
                    <span>{log.cardId}</span>
                    <span className="tabular-num">{log.time}</span>
                    <span className={styles.statusPillBoarded}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className={styles.diagnosticsGrid}>
            <div className={styles.tpmsCard}>
              <h4>4-Wheel TPMS &amp; Tyre Health Telemetry</h4>
              <p className={styles.cardSubtitle}>Direct sensor reading simulation per wheel position</p>

              <div className={styles.tpmsChassis}>
                <div className={styles.tpmsWheelBox}>
                  <span className={styles.wheelPos}>Front-Left (FL)</span>
                  <strong className={styles.wheelPressure}>{tpmsPressures.fl} PSI</strong>
                  <span className={styles.textSuccess}>Nominal</span>
                </div>

                <div className={styles.tpmsWheelBox}>
                  <span className={styles.wheelPos}>Front-Right (FR)</span>
                  <strong className={styles.wheelPressure}>{tpmsPressures.fr} PSI</strong>
                  <span className={styles.textSuccess}>Nominal</span>
                </div>

                <div className={`${styles.tpmsWheelBox} ${tpmsPressures.rl < 28 ? styles.tpmsWheelAlert : ""}`}>
                  <span className={styles.wheelPos}>Rear-Left (RL)</span>
                  <strong className={styles.wheelPressure}>{tpmsPressures.rl} PSI</strong>
                  <span className={tpmsPressures.rl < 28 ? styles.textCritical : styles.textSuccess}>
                    {tpmsPressures.rl < 28 ? "CRITICAL LOW" : "Nominal"}
                  </span>
                </div>

                <div className={styles.tpmsWheelBox}>
                  <span className={styles.wheelPos}>Rear-Right (RR)</span>
                  <strong className={styles.wheelPressure}>{tpmsPressures.rr} PSI</strong>
                  <span className={styles.textSuccess}>Nominal</span>
                </div>
              </div>

              <div className={styles.tpmsActions}>
                <button
                  type="button"
                  className={styles.faultInjectBtn}
                  onClick={() => {
                    setTpmsPressures((prev) => ({ ...prev, rl: 24 }));
                    logIncident("DIAGNOSTIC TEST: Injected low pressure event on Rear-Left tyre (24 PSI)", "caution");
                  }}
                >
                  Simulate RL Tyre Pressure Drop (24 PSI)
                </button>
                <button
                  type="button"
                  className={styles.faultInjectBtn}
                  onClick={() => {
                    setTpmsPressures({ fl: 35, fr: 35, rl: 35, rr: 35 });
                    logIncident("TPMS CALIBRATED: Pressure restored across all 4 tyres to 35 PSI", "info");
                  }}
                >
                  Reset / Re-Inflate to 35 PSI
                </button>
              </div>
            </div>

            <div className={styles.faultsLedgerCard}>
              <h4>Active OBD / CAN-Bus Fault Codes</h4>
              <div className={styles.faultsList}>
                {activeFaults.length > 0 ? (
                  activeFaults.map((f, idx) => (
                    <div key={idx} className={styles.faultItemCritical}>
                      <div className={styles.faultCodeHeader}>
                        <span className={styles.faultCodeBadge}>{f.code}</span>
                        <span className={styles.faultSystem}>{f.system}</span>
                      </div>
                      <p className={styles.faultDesc}>{f.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.nominalStateBox}>
                    <CheckIcon size={20} />
                    <span>All chassis CAN-Bus modules responding with zero error codes.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai_inspection" && (
          <div className={styles.aiInspectionGrid}>
            <div className={styles.aiInspectionCard}>
              <div className={styles.aiHeader}>
                <div>
                  <h4>AI Camera Visual Defect Screening</h4>
                  <p className={styles.cardSubtitle}>
                    Computer vision screening for exterior surface, tyre wear and body panel anomalies
                  </p>
                </div>
                <div className={styles.aiDisclaimerBadge}>
                  <InfoIcon size={13} />
                  <span>AI-assisted visual screening &bull; Requires technician confirmation</span>
                </div>
              </div>

              <div className={styles.testCasesPicker}>
                {DEFAULT_INSPECTION_CASES.map((tc) => (
                  <button
                    key={tc.id}
                    type="button"
                    className={`${styles.testCaseBtn} ${selectedInspectionCase.id === tc.id ? styles.testCaseBtnActive : ""}`}
                    onClick={() => setSelectedInspectionCase(tc)}
                  >
                    <span>{tc.title}</span>
                  </button>
                ))}
              </div>

              <div className={styles.inspectionResultBox}>
                <div className={styles.inspectionImageHolder}>
                  <Image
                    src={selectedInspectionCase.image}
                    alt={selectedInspectionCase.title}
                    width={280}
                    height={160}
                    className={styles.inspectionPreviewImg}
                  />
                  <div className="scan-line" />
                </div>

                <div className={styles.inspectionDetails}>
                  <div className={styles.inspectionStatusRow}>
                    <span className={styles.inspectCat}>{selectedInspectionCase.category}</span>
                    <span className={`${styles.inspectStatusPill} ${selectedInspectionCase.severity === "critical" ? styles.inspectStatusCrit : styles.inspectStatusOk}`}>
                      {selectedInspectionCase.status}
                    </span>
                    <span className={styles.confidenceScore}>Confidence: {selectedInspectionCase.confidence}</span>
                  </div>
                  <h4 className={styles.findingsTitle}>Detected Visual Features:</h4>
                  <p className={styles.findingsText}>{selectedInspectionCase.findings}</p>
                  <h4 className={styles.findingsTitle}>AI Maintenance Recommendation:</h4>
                  <p className={styles.findingsText}>{selectedInspectionCase.recommendation}</p>

                  <button
                    type="button"
                    className={styles.confirmInspectionBtn}
                    onClick={() => handleConfirmInspection(selectedInspectionCase)}
                  >
                    <CheckIcon size={14} />
                    <span>Technician Confirm &amp; Queue Work Order</span>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.inspectionHistoryCard}>
              <h4>Verified Inspection History</h4>
              <div className={styles.historyList}>
                {inspectionHistory.length > 0 ? (
                  inspectionHistory.map((item) => (
                    <div key={item.id} className={styles.historyItem}>
                      <span className={styles.historyTime}>{item.timestamp}</span>
                      <strong>{item.title}</strong>
                      <span className={styles.historyAction}>{item.action}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyHistory}>
                    No work orders queued yet. Select test photo and confirm above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "safety" && (
          <div className={styles.safetyGrid}>
            <div className={styles.safetyCard}>
              <div className={styles.safetyHeader}>
                <h4>Safety Interlock &amp; Incident Event Ledger</h4>
                <p>Immutable operational audit stream tracking door locks, speed violations and SOS beacons</p>
              </div>

              <div className={styles.incidentTable}>
                {incidentLog.map((inc, idx) => (
                  <div
                    key={idx}
                    className={`${styles.incidentRow} ${inc.level === "critical" ? styles.incidentRowCritical : inc.level === "caution" ? styles.incidentRowCaution : ""}`}
                  >
                    <span className={styles.incidentTime}>{inc.timestamp}</span>
                    <span className={styles.incidentLevel}>[{inc.level.toUpperCase()}]</span>
                    <span className={styles.incidentMsg}>{inc.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className={styles.reportsGrid}>
            <div className={styles.reportsCard}>
              <h4>University Academic Demonstration &amp; Telemetry Report</h4>
              <p>Export live trip logs, passenger density data, and safety interlock verifications</p>

              <div className={styles.reportPreview}>
                <div className={styles.reportMetaHeader}>
                  <div>
                    <h5>NEBULA TRANSIT &bull; OPERATIONAL TELEMETRY REPORT</h5>
                    <span>Candidate: Ayesha Batool (M245004) &bull; Gomal University Faisalabad</span>
                  </div>
                  <span className={styles.reportBadge}>SIMULATED SYSTEM AUDIT</span>
                </div>

                <div className={styles.reportStatsGrid}>
                  <div>
                    <span className={styles.rLabel}>Vehicle ID:</span>
                    <strong>{vehicle.id} ({vehicle.code})</strong>
                  </div>
                  <div>
                    <span className={styles.rLabel}>Total Events:</span>
                    <strong>{incidentLog.length} Recorded</strong>
                  </div>
                  <div>
                    <span className={styles.rLabel}>Current Corridor:</span>
                    <strong>{vehicle.route.split("—")[0]}</strong>
                  </div>
                  <div>
                    <span className={styles.rLabel}>Safety Compliance:</span>
                    <strong className={styles.textSuccess}>100% Interlock Adherence</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.downloadCsvBtn}
                  onClick={handleExportCSV}
                >
                  <DownloadIcon size={16} />
                  <span>Download Telemetry &amp; Safety Ledger (CSV)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
