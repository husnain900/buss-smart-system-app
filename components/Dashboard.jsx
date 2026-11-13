"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import styles from "./Dashboard.module.css";
import {
  MenuIcon,
  WifiIcon,
  BatteryIcon,
  VolumeIcon,
  VolumeXIcon,
  MapPinIcon,
  AlertTriangleIcon,
  CreditCardIcon,
  UserCheckIcon,
  PlayIcon,
  PauseIcon,
  ThermometerIcon,
  ShieldIcon,
  RadioIcon,
  BusIcon,
  CarIcon,
  CheckIcon,
  QrCodeIcon
} from "./icons/Icons";

const VEHICLE_FLEET = {
  bus: {
    id: "bus",
    name: "Smart Transit Bus #12",
    badge: "Fleet Node 12 &bull; Heavy Transit",
    image: "/assets/images/smart_transit_bus.png",
    alt: "Futuristic Studio Smart Transit Bus with LED Lighting",
    range: 250,
    unit: "km/l",
    avgConsumption: 10.8,
    maxSeats: 42,
    route: "Campus Central Express"
  },
  car: {
    id: "car",
    name: "Executive EV Cruiser #04",
    badge: "Fleet Node 04 &bull; Executive EV",
    image: "/assets/images/smart_ev_car.png",
    alt: "Aerodynamic Electric Luxury Sedan Studio Presentation",
    range: 480,
    unit: "kWh/100km",
    avgConsumption: 16.2,
    maxSeats: 5,
    route: "Security &amp; VIP Patrol"
  },
  shuttle: {
    id: "shuttle",
    name: "Campus Eco Shuttle #08",
    badge: "Fleet Node 08 &bull; Autonomous Pod",
    image: "/assets/images/smart_campus_shuttle.png",
    alt: "Autonomous Electric Campus Shuttle Pod Studio Render",
    range: 190,
    unit: "kWh/100km",
    avgConsumption: 12.4,
    maxSeats: 14,
    route: "Gomal Circular Belt"
  }
};

const DEFAULT_ATTENDANCE = [
  { name: "Ayesha Batool", roll: "M245004", time: "08:15 AM", status: "Present" },
  { name: "Ali Raza", roll: "M245012", time: "08:22 AM", status: "Present" },
  { name: "Sadia Kanwal", roll: "M245025", time: "08:30 AM", status: "Present" }
];

const SCAN_POOL = [
  { name: "Ayesha Batool", roll: "M245004" },
  { name: "Muhammad Bilal", roll: "M245008" },
  { name: "Usman Ghani", roll: "M245001" },
  { name: "Fatima Noor", roll: "M245016" },
  { name: "Hamza Tariq", roll: "M245030" }
];

export default function Dashboard({ triggeredFeature, clearTrigger, onOpenAbout }) {
  const [selectedVehicle, setSelectedVehicle] = useState("bus");
  const [activeScreen, setActiveScreen] = useState("home");
  const [isMuted, setIsMuted] = useState(false);

  const [isEngineOn, setIsEngineOn] = useState(false);
  const [isAcOn, setIsAcOn] = useState(false);
  const [isHornActive, setIsHornActive] = useState(false);
  const [isHazardsOn, setIsHazardsOn] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const [odometer, setOdometer] = useState(142356.4);
  const [range, setRange] = useState(250);
  const [avgFuel, setAvgFuel] = useState(10.8);
  const [speed, setSpeed] = useState(0);

  const [isBusMoving, setIsBusMoving] = useState(false);
  const [busProgress, setBusProgress] = useState(0);
  const busMarkerRef = useRef(null);
  const mapPathRef = useRef(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [selectedRoute, setSelectedRoute] = useState("route1");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [passengerName, setPassengerName] = useState("Ayesha Batool");

  const [attendanceLogs, setAttendanceLogs] = useState(DEFAULT_ATTENDANCE);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const activeVehicleData = VEHICLE_FLEET[selectedVehicle] || VEHICLE_FLEET.bus;

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const playSynthesizedTone = useCallback((frequency = 440, type = "sine", duration = 0.2, gainValue = 0.05) => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try {
          osc.stop();
          ctx.close();
        } catch {}
      }, duration * 1000);
    } catch {}
  }, [isMuted]);

  useEffect(() => {
    if (!triggeredFeature) return;
    if (triggeredFeature === "gps") {
      setActiveScreen("map");
      setIsEngineOn(true);
      setIsBusMoving(true);
      showToast("GPS Telematics Online");
    } else if (triggeredFeature === "emergency") {
      setActiveScreen("emergency");
      setSosActive(true);
      setIsHazardsOn(true);
      showToast("Emergency Dispatch Triggered");
    } else if (triggeredFeature === "ticketing") {
      setActiveScreen("ticketing");
      showToast("Digital Ticket Terminal Ready");
    } else if (triggeredFeature === "attendance") {
      setActiveScreen("attendance");
      showToast("RFID Scanner Operational");
    }
    clearTrigger();
  }, [triggeredFeature, clearTrigger, showToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEngineOn && isBusMoving) {
        setOdometer((prev) => parseFloat((prev + 0.1).toFixed(1)));
        setRange((prev) => Math.max(0, prev - 1));
        setSpeed(Math.floor(Math.random() * 15) + 50);
        setAvgFuel((prev) => parseFloat((prev + (Math.random() * 0.2 - 0.1)).toFixed(1)));
      } else {
        setSpeed(0);
        if (!isEngineOn) setIsBusMoving(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isEngineOn, isBusMoving]);

  useEffect(() => {
    if (activeScreen !== "map" || !isBusMoving || !mapPathRef.current || !busMarkerRef.current) return;

    const path = mapPathRef.current;
    const length = path.getTotalLength();
    const animObj = { progress: busProgress };

    const anim = gsap.to(animObj, {
      progress: 100,
      duration: 16,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        setBusProgress(animObj.progress);
        const point = path.getPointAtLength((animObj.progress / 100) * length);
        gsap.set(busMarkerRef.current, {
          x: point.x,
          y: point.y
        });
      }
    });

    return () => {
      anim.kill();
    };
  }, [activeScreen, isBusMoving, busProgress]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rotateX = -(mouseY / (height / 2)) * 14;
    const rotateY = (mouseX / (width / 2)) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleHorn = () => {
    setIsHornActive(true);
    playSynthesizedTone(480, "sawtooth", 0.3, 0.08);
    setTimeout(() => setIsHornActive(false), 300);
    showToast("Acoustic Horn Sounded");
  };

  const simulateCardScan = () => {
    const target = SCAN_POOL[Math.floor(Math.random() * SCAN_POOL.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setAttendanceLogs((prev) => [
      { name: target.name, roll: target.roll, time: timeStr, status: "Present" },
      ...prev
    ]);

    playSynthesizedTone(880, "triangle", 0.15, 0.05);
    showToast(`RFID Verified: ${target.name} (${target.roll})`);
  };

  const generateTicket = (e) => {
    e.preventDefault();
    const routeNames = {
      route1: "Gomal University Main ⇄ Faisalabad Center (Express)",
      route2: "Samanabad Gateways ⇄ Canal Road Belt Line",
      route3: "University Circle Outer Perimeter"
    };
    const ticketId = Math.random().toString(36).substring(3, 9).toUpperCase();
    const dateStr = new Date().toLocaleDateString();

    setTicketDetails({
      id: ticketId,
      passenger: passengerName || "Ayesha Batool",
      route: routeNames[selectedRoute],
      price: selectedRoute === "route1" ? "PKR 120" : selectedRoute === "route2" ? "PKR 90" : "PKR 50",
      date: dateStr,
      time: "09:40 AM"
    });

    playSynthesizedTone(660, "sine", 0.1, 0.04);
    showToast("QR Boarding Pass Generated");
  };

  const triggerSOS = () => {
    setSosActive((prev) => {
      const next = !prev;
      if (next) {
        setIsHazardsOn(true);
        playSynthesizedTone(920, "square", 0.4, 0.1);
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setEmergencyAlerts((prevLogs) => [
          `SOS Beacon Broadcast at ${timeStr} &bull; GPS: 31.4187 N, 73.0791 E (Gomal Sector)`,
          ...prevLogs
        ]);
        showToast("Emergency Dispatch Alert Broadcasted!");
      } else {
        setIsHazardsOn(false);
        showToast("Emergency Status Cleared");
      }
      return next;
    });
  };

  const switchVehicle = (vehicleKey) => {
    setSelectedVehicle(vehicleKey);
    const data = VEHICLE_FLEET[vehicleKey];
    setRange(data.range);
    setAvgFuel(data.avgConsumption);
    showToast(`Active Vehicle: ${data.name}`);
  };

  return (
    <div className={styles.phoneWrapper}>
      <div className={styles.phoneNotch}>
        <div className={styles.speakerBar} />
      </div>

      <div className={styles.statusBar}>
        <span>09:40 AM</span>
        <div className={styles.statusIcons}>
          <button
            type="button"
            className={styles.muteToggleBtn}
            onClick={() => setIsMuted((prev) => !prev)}
            title={isMuted ? "Sound Muted (Click to Unmute)" : "Sound Active (Click to Mute)"}
            aria-label="Toggle Sound Effects"
          >
            {isMuted ? <VolumeXIcon size={13} /> : <VolumeIcon size={13} />}
          </button>
          <WifiIcon size={12} />
          <span>5G IoT</span>
          <BatteryIcon size={14} />
        </div>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: "absolute",
              top: 48,
              left: 16,
              right: 16,
              background: "rgba(37, 99, 235, 0.95)",
              color: "white",
              fontSize: "0.74rem",
              fontWeight: 600,
              padding: "9px 14px",
              borderRadius: "12px",
              textAlign: "center",
              zIndex: 1000,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.25)"
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.appHeader}>
        <button
          className={styles.headerBtn}
          onClick={() => setActiveScreen("home")}
          aria-label="Return to Dashboard Home"
        >
          <MenuIcon size={16} />
        </button>
        <div className={styles.headerTitleWrapper}>
          <h4 className={styles.headerTitle}>
            {activeScreen === "home" ? activeVehicleData.name :
             activeScreen === "map" ? "Live GPS Telematics" :
             activeScreen === "ticketing" ? "Smart Ticketing Desk" :
             activeScreen === "attendance" ? "RFID Roll Call Console" : "Emergency SOS Dispatch"}
          </h4>
          <span className={styles.headerSubtitle}>
            {activeScreen === "home" ? "Smart Fleet Node" : "Integrated System"}
          </span>
        </div>
        <button
          className={styles.headerBtn}
          onClick={() => setActiveScreen("emergency")}
          aria-label="Open Emergency Beacon"
        >
          <AlertTriangleIcon
            size={16}
            style={{ color: sosActive ? "var(--accent-danger)" : "var(--text-primary)" }}
          />
        </button>
      </div>

      <div className={styles.screenContent}>
        <AnimatePresence mode="wait">
          {activeScreen === "home" ? (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div className={styles.vehicleSwitcher} role="tablist" aria-label="Vehicle Fleet Selector">
                <button
                  type="button"
                  className={`${styles.vehiclePill} ${selectedVehicle === "bus" ? styles.vehiclePillActive : ""}`}
                  onClick={() => switchVehicle("bus")}
                >
                  <BusIcon size={12} />
                  <span>Transit Bus</span>
                </button>
                <button
                  type="button"
                  className={`${styles.vehiclePill} ${selectedVehicle === "car" ? styles.vehiclePillActive : ""}`}
                  onClick={() => switchVehicle("car")}
                >
                  <CarIcon size={12} />
                  <span>EV Sedan</span>
                </button>
                <button
                  type="button"
                  className={`${styles.vehiclePill} ${selectedVehicle === "shuttle" ? styles.vehiclePillActive : ""}`}
                  onClick={() => switchVehicle("shuttle")}
                >
                  <RadioIcon size={12} />
                  <span>Eco Pod</span>
                </button>
              </div>

              <div
                className={styles.vehicleDisplay}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  animate={tilt.x === 0 && tilt.y === 0 ? {
                    y: [0, -4, 0]
                  } : {}}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: "relative",
                    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: tilt.x === 0 ? "transform 0.4s ease" : "transform 0.08s ease-out"
                  }}
                >
                  <Image
                    src={activeVehicleData.image}
                    alt={activeVehicleData.alt}
                    width={230}
                    height={125}
                    className={styles.busImage}
                    priority
                  />
                </motion.div>
                <div className={styles.busImageGlow} />
                <span className={styles.vehicleMetaBadge}>
                  {activeVehicleData.route} &bull; {activeVehicleData.maxSeats} Pax
                </span>
              </div>

              <div className={styles.statsCard}>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{range} km</span>
                    <span className={styles.statLabel}>Usable Range</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {isEngineOn && isBusMoving ? speed : 0} km/h
                    </span>
                    <span className={styles.statLabel}>Current Speed</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{avgFuel} {activeVehicleData.unit}</span>
                    <span className={styles.statLabel}>Efficiency</span>
                  </div>
                </div>
                <div className={styles.lastUpdated}>
                  Odometer: {odometer.toLocaleString()} km &bull; Telemetry Verified
                </div>
              </div>

              <div className={styles.controlsGrid}>
                <div className={styles.mainDialWrapper}>
                  {isEngineOn && (
                    <div
                      className="pulse-ring"
                      style={{ position: "absolute", width: "120px", height: "120px" }}
                    />
                  )}
                  <button
                    type="button"
                    className={`${styles.mainDial} ${isEngineOn ? styles.mainDialActive : ""}`}
                    onClick={() => {
                      const next = !isEngineOn;
                      setIsEngineOn(next);
                      playSynthesizedTone(next ? 520 : 300, "sine", 0.25, 0.07);
                      showToast(next ? "Powertrain Online &bull; Telemetry Active" : "Powertrain Offline");
                    }}
                    aria-label={isEngineOn ? "Stop Vehicle Powertrain" : "Start Vehicle Powertrain"}
                  >
                    {isEngineOn ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
                    <span className={styles.mainDialLabel}>
                      {isEngineOn ? "SHUTDOWN" : "IGNITE"}
                    </span>
                  </button>
                </div>

                <div className={styles.satelliteButtons}>
                  <button
                    type="button"
                    className={`${styles.satelliteBtn} ${isAcOn ? styles.satelliteBtnActive : ""}`}
                    onClick={() => {
                      if (!isEngineOn) {
                        showToast("Start powertrain first!");
                        return;
                      }
                      setIsAcOn((prev) => !prev);
                      playSynthesizedTone(400, "sine", 0.1, 0.03);
                    }}
                  >
                    <ThermometerIcon size={16} className={isAcOn ? "spin-slow" : ""} />
                    <span className={styles.satelliteBtnLabel}>Climate</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.satelliteBtn} ${isHornActive ? styles.satelliteBtnActive : ""}`}
                    onClick={handleHorn}
                  >
                    <VolumeIcon size={16} />
                    <span className={styles.satelliteBtnLabel}>Horn</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.satelliteBtn} ${isHazardsOn ? styles.satelliteBtnActive : ""}`}
                    onClick={() => {
                      setIsHazardsOn((prev) => !prev);
                      playSynthesizedTone(600, "square", 0.1, 0.03);
                    }}
                  >
                    <AlertTriangleIcon
                      size={16}
                      style={{ color: isHazardsOn ? "var(--accent-danger)" : "inherit" }}
                    />
                    <span className={styles.satelliteBtnLabel}>Hazard</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.satelliteBtn} ${isDoorOpen ? styles.satelliteBtnActive : ""}`}
                    onClick={() => {
                      setIsDoorOpen((prev) => !prev);
                      playSynthesizedTone(350, "triangle", 0.15, 0.04);
                      showToast(isDoorOpen ? "Automated Doors Locked" : "Automated Doors Opened");
                    }}
                  >
                    <ShieldIcon size={16} />
                    <span className={styles.satelliteBtnLabel}>Doors</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={styles.bottomActionBtn}
                onClick={() => {
                  playSynthesizedTone(750, "sine", 0.15, 0.04);
                  showToast("Diagnostics: CAN-Bus &amp; IoT sensors nominal 100%");
                }}
              >
                <RadioIcon size={14} />
                <span>Run Diagnostic Telemetry Check</span>
              </button>
            </motion.div>
          ) : activeScreen === "map" ? (
            <motion.div
              key="map-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={styles.secondaryPanel}
            >
              <h3 className={styles.panelTitle}>
                <MapPinIcon size={17} /> GPS Live Route Telematics
              </h3>

              <div className={styles.mapContainer}>
                <svg viewBox="0 0 300 200" className={styles.mapSvg}>
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  <path
                    ref={mapPathRef}
                    d="M 30,170 Q 60,60 150,100 T 270,30"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ strokeDasharray: "2 2" }}
                  />

                  <circle cx="30" cy="170" r="8" className={`${styles.mapStopNode} ${busProgress >= 0 ? styles.mapStopNodeActive : ""}`} />
                  <circle cx="120" cy="88" r="8" className={`${styles.mapStopNode} ${busProgress >= 45 ? styles.mapStopNodeActive : ""}`} />
                  <circle cx="270" cy="30" r="8" className={`${styles.mapStopNode} ${busProgress >= 95 ? styles.mapStopNodeActive : ""}`} />

                  <text x="35" y="185" fontSize="8" fontWeight="600" fill="var(--text-secondary)">Gomal Campus</text>
                  <text x="130" y="93" fontSize="8" fontWeight="600" fill="var(--text-secondary)">Canal Gate</text>
                  <text x="215" y="30" fontSize="8" fontWeight="600" fill="var(--text-secondary)">Fsd Center</text>

                  <g ref={busMarkerRef} transform="translate(30, 170)">
                    <circle cx="0" cy="0" r="7" className={styles.mapBusIndicator} />
                    <rect x="-4" y="-2.5" width="8" height="5" fill="white" rx="1" />
                  </g>
                </svg>
              </div>

              <div className={styles.mapStatsCard}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    Status: {isBusMoving ? "Transit Active" : "Stationary"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEngineOn) {
                        showToast("Ignite powertrain first!");
                        return;
                      }
                      setIsBusMoving((prev) => !prev);
                    }}
                    style={{
                      fontSize: "0.7rem",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: isBusMoving ? "var(--accent-warning)" : "var(--accent-success)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {isBusMoving ? "Pause Route" : "Simulate Drive"}
                  </button>
                </div>

                <div className={styles.mapLogItem}>
                  <span>Waypoint Progress:</span>
                  <strong>{Math.round(busProgress)}%</strong>
                </div>
                <div className={styles.mapLogItem}>
                  <span>Next Arrival:</span>
                  <strong>{busProgress < 45 ? "Canal Gate (3.8 km)" : busProgress < 95 ? "Faisalabad Center (7.4 km)" : "Gomal Campus Terminal"}</strong>
                </div>
                <div className={styles.mapLogItem}>
                  <span>GPS Coordinates:</span>
                  <strong>{(31.4187 + (busProgress * 0.0002)).toFixed(4)} N, {(73.0791 + (busProgress * 0.0003)).toFixed(4)} E</strong>
                </div>
              </div>
            </motion.div>
          ) : activeScreen === "ticketing" ? (
            <motion.div
              key="ticket-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={styles.secondaryPanel}
            >
              <h3 className={styles.panelTitle}>
                <CreditCardIcon size={17} /> Digital QR Ticketing
              </h3>

              {!ticketDetails ? (
                <form className={styles.ticketForm} onSubmit={generateTicket}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 600 }}>Passenger Name</label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className={styles.ticketSelect}
                      placeholder="Enter Passenger Name"
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 600 }}>Transit Corridor</label>
                    <select
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className={styles.ticketSelect}
                    >
                      <option value="route1">Gomal Main ⇄ Fsd Center (PKR 120)</option>
                      <option value="route2">Samanabad Gateways ⇄ Canal Road (PKR 90)</option>
                      <option value="route3">University Outer Circle (PKR 50)</option>
                    </select>
                  </div>

                  <button type="submit" className={styles.checkoutBtn}>
                    <QrCodeIcon size={15} />
                    <span>Issue Digital Boarding Pass</span>
                  </button>
                </form>
              ) : (
                <div className={styles.receiptCard}>
                  <span className={styles.ticketBadge}>
                    BOARDING PASS ID: {ticketDetails.id}
                  </span>
                  <div className={styles.ticketGrid}>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>PASSENGER</div>
                      <div style={{ fontWeight: 700 }}>{ticketDetails.passenger}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>FARE</div>
                      <div style={{ fontWeight: 700, color: "var(--accent-primary)" }}>{ticketDetails.price}</div>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>CORRIDOR</div>
                      <div style={{ fontWeight: 600 }}>{ticketDetails.route}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>DATE</div>
                      <div style={{ fontWeight: 600 }}>{ticketDetails.date}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>STATUS</div>
                      <div style={{ fontWeight: 700, color: "var(--accent-success)" }}>CONFIRMED</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                    <div style={{ background: "white", padding: "6px", border: "1px solid var(--border-color)", borderRadius: "4px" }}>
                      <div className={styles.barcodeSim} style={{ width: "160px" }} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTicketDetails(null)}
                    style={{
                      background: "transparent",
                      color: "var(--accent-primary)",
                      border: "none",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: "4px"
                    }}
                  >
                    Issue Another Ticket
                  </button>
                </div>
              )}
            </motion.div>
          ) : activeScreen === "attendance" ? (
            <motion.div
              key="attendance-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={styles.secondaryPanel}
            >
              <h3 className={styles.panelTitle}>
                <UserCheckIcon size={17} /> Contactless RFID Roll Call
              </h3>

              <div className={styles.scannerCard}>
                <div className={styles.scannerTarget}>
                  <div className={styles.scanLine} />
                  <RadioIcon size={34} style={{ color: "var(--accent-primary)", opacity: 0.6 }} />
                </div>
                <button
                  type="button"
                  className={styles.checkoutBtn}
                  onClick={simulateCardScan}
                  style={{ width: "auto", padding: "8px 16px" }}
                >
                  <UserCheckIcon size={14} />
                  <span>Tap Student RFID Smart Card</span>
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700 }}>
                  Live Scans ({attendanceLogs.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setAttendanceLogs([])}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "0.65rem",
                    cursor: "pointer"
                  }}
                >
                  Clear History
                </button>
              </div>

              <div className={styles.scanLog}>
                {attendanceLogs.length > 0 ? (
                  attendanceLogs.map((log, idx) => (
                    <div key={idx} className={styles.scanLogRow}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{log.name}</div>
                        <div style={{ fontSize: "0.58rem", color: "var(--text-muted)" }}>Roll No: {log.roll}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--accent-success)", fontWeight: 700 }}>{log.status}</div>
                        <div style={{ fontSize: "0.58rem", color: "var(--text-muted)" }}>{log.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", padding: "16px" }}>
                    No students scanned yet. Tap RFID Smart Card above.
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="emergency-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={styles.secondaryPanel}
            >
              <h3 className={styles.panelTitle} style={{ color: "var(--accent-danger)" }}>
                <AlertTriangleIcon size={17} /> Emergency Safety Dispatch
              </h3>

              <div className={styles.sosContainer}>
                <button
                  type="button"
                  className={`${styles.sosBtn} ${sosActive ? styles.sosBtnActive : ""}`}
                  onClick={triggerSOS}
                  aria-label="Toggle Emergency SOS Beacon"
                >
                  SOS
                </button>
                <div>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {sosActive ? "EMERGENCY BEACON TRANSMITTING" : "SAFETY BEACON STANDBY"}
                  </h4>
                  <p style={{ fontSize: "0.64rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                    {sosActive
                      ? "Transmitting live GPS telemetry coordinates to Gomal Campus Dispatch."
                      : "Hold SOS in emergency situation to alert Central Security &amp; fleet management."}
                  </p>
                </div>

                {sosActive && (
                  <div className={styles.sosActiveAlert}>
                    <AlertTriangleIcon size={14} />
                    <span>Active Alert Broadcast: High-Priority Beacon Engaged</span>
                  </div>
                )}
              </div>

              <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>Dispatch Notification Log:</span>
              <div className={styles.scanLog} style={{ maxHeight: "105px" }}>
                {emergencyAlerts.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: "0.64rem",
                      padding: "5px 0",
                      borderBottom: "1px solid rgba(239, 68, 68, 0.15)",
                      color: "var(--accent-danger)"
                    }}
                  >
                    {log}
                  </div>
                ))}
                {emergencyAlerts.length === 0 && (
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", padding: "12px" }}>
                    All telematics channels secure. Zero active incidents.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.phoneNavBar} role="navigation" aria-label="Simulator Navigation">
        <button
          type="button"
          className={`${styles.navBarItem} ${activeScreen === "home" ? styles.navBarItemActive : ""}`}
          onClick={() => setActiveScreen("home")}
          aria-label="Vehicle Dashboard"
        >
          <RadioIcon size={17} />
          <span className={styles.navBarItemLabel}>Fleet</span>
        </button>

        <button
          type="button"
          className={`${styles.navBarItem} ${activeScreen === "map" ? styles.navBarItemActive : ""}`}
          onClick={() => {
            setActiveScreen("map");
            if (isEngineOn) setIsBusMoving(true);
          }}
          aria-label="GPS Route Tracker"
        >
          <MapPinIcon size={17} />
          <span className={styles.navBarItemLabel}>GPS Map</span>
        </button>

        <button
          type="button"
          className={`${styles.navBarItem} ${activeScreen === "ticketing" ? styles.navBarItemActive : ""}`}
          onClick={() => setActiveScreen("ticketing")}
          aria-label="Digital Ticketing Desk"
        >
          <CreditCardIcon size={17} />
          <span className={styles.navBarItemLabel}>Tickets</span>
        </button>

        <button
          type="button"
          className={`${styles.navBarItem} ${activeScreen === "attendance" ? styles.navBarItemActive : ""}`}
          onClick={() => setActiveScreen("attendance")}
          aria-label="RFID Attendance Scanner"
        >
          <UserCheckIcon size={17} />
          <span className={styles.navBarItemLabel}>Roll Call</span>
        </button>

        <button
          type="button"
          className={`${styles.navBarItem} ${activeScreen === "emergency" ? styles.navBarItemActive : ""}`}
          onClick={() => setActiveScreen("emergency")}
          aria-label="Emergency SOS Console"
        >
          <AlertTriangleIcon size={17} />
          <span className={styles.navBarItemLabel}>SOS</span>
          {sosActive && <div className={styles.badgeDot} />}
        </button>
      </div>
    </div>
  );
}
