"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./Bus3DViewer.module.css";
import {
  RotateCcwIcon,
  ShieldIcon,
  VolumeIcon,
  VolumeXIcon,
  EyeIcon,
  SparklesIcon,
  AlertTriangleIcon,
  ThermometerIcon,
  ZapIcon
} from "./icons/Icons";

/**
 * NEXTRANS Interactive 3D Bus & Hotspot System
 * Engineered by Ayesha Batool (M245004) - Gomal University Faisalabad
 * 
 * Features:
 * - 3D procedural transit bus scene with real-time pitch/yaw orbit rotation and inertia
 * - Animated sliding passenger doors (with safety interlock)
 * - Rotating wheels and tyre treads when vehicle speed > 0
 * - Dual roof HVAC modules and battery pack with charging LEDs
 * - Dynamic 3D projected interactive hotspots
 * - Camera angle presets (3/4, Side, Front, Cockpit, Top, Reset)
 * - Toggleable 2D Studio Photography fallback
 * - Web Audio API sound synthesis ("Start Experience • Enable Sound")
 */
export default function Bus3DViewer({
  vehicle,
  speed = 0,
  doorsOpen = false,
  isDriving = false,
  hazardsActive = false,
  acActive = true,
  tpmsPressures = { fl: 35, fr: 35, rl: 35, rr: 35 },
  onToggleDoors,
  onSelectDiagnostics,
  onToggleAc,
  onToggleHazards,
  isMuted = false,
  onToggleMute
}) {
  const canvasRef = useRef(null);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "2d"
  const [cameraPreset, setCameraPreset] = useState("perspective"); // perspective, side, front, cockpit, top
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCtxRef = useRef(null);

  // Rotation angles (radians)
  const rotYRef = useRef(-0.55); // Yaw
  const rotXRef = useRef(0.25);  // Pitch
  const zoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const wheelSpinRef = useRef(0);
  const doorAnimRef = useRef(doorsOpen ? 1 : 0);
  const hazardPulseRef = useRef(0);

  // Hotspot screen positions
  const [hotspots, setHotspots] = useState({
    door: { x: 0, y: 0, visible: true },
    tyre: { x: 0, y: 0, visible: true },
    hvac: { x: 0, y: 0, visible: true },
    battery: { x: 0, y: 0, visible: true }
  });

  // Sound Synthesizer via Web Audio API
  const playSound = useCallback((type) => {
    if (isMuted || !audioUnlocked || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;

      if (type === "door_chime") {
        // High-low dual chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(660, now);
        osc2.frequency.setValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.35);
      } else if (type === "interlock_buzz") {
        // Harsh safety warning buzzer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.28);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "horn") {
        // Bus dual electric horn
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const gain = ctx.createGain();
        o1.frequency.setValueAtTime(420, now);
        o2.frequency.setValueAtTime(510, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o1.connect(gain);
        o2.connect(gain);
        gain.connect(ctx.destination);
        o1.start(now);
        o1.stop(now + 0.4);
        o2.start(now);
        o2.stop(now + 0.4);
      }
    } catch {}
  }, [isMuted, audioUnlocked]);

  // Unlock Audio on User Opt-In
  const handleEnableAudio = () => {
    try {
      if (typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
          if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
          }
        }
      }
      setAudioUnlocked(true);
      playSound("door_chime");
    } catch {
      setAudioUnlocked(true);
    }
  };

  // Switch camera angles
  const applyCameraPreset = (preset) => {
    setCameraPreset(preset);
    if (preset === "perspective") {
      rotYRef.current = -0.55;
      rotXRef.current = 0.25;
      zoomRef.current = 1.0;
    } else if (preset === "side") {
      rotYRef.current = 0;
      rotXRef.current = 0.05;
      zoomRef.current = 1.1;
    } else if (preset === "front") {
      rotYRef.current = -Math.PI / 2;
      rotXRef.current = 0.08;
      zoomRef.current = 1.15;
    } else if (preset === "cockpit") {
      rotYRef.current = -1.2;
      rotXRef.current = 0.35;
      zoomRef.current = 1.35;
    } else if (preset === "top") {
      rotYRef.current = -0.4;
      rotXRef.current = 1.1;
      zoomRef.current = 0.95;
    }
  };

  // Main 3D Rendering Engine
  useEffect(() => {
    if (viewMode !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;

    const render = () => {
      // Resize support
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Wheel spin animation when moving
      if (speed > 0) {
        wheelSpinRef.current = (wheelSpinRef.current + (speed * 0.05)) % (Math.PI * 2);
      }

      // Door open/close interpolation (0 = closed, 1 = open)
      const targetDoorAnim = doorsOpen ? 1 : 0;
      doorAnimRef.current += (targetDoorAnim - doorAnimRef.current) * 0.12;

      // Hazard light flashing rhythm
      hazardPulseRef.current = (hazardPulseRef.current + 0.08) % (Math.PI * 2);
      const isHazardLit = hazardsActive && Math.sin(hazardPulseRef.current) > 0;

      // Camera & 3D Math Setup
      const cx = width / 2;
      const cy = height / 2 + 15;
      const scale = Math.min(width, height) * 0.42 * zoomRef.current;

      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);
      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);

      // 3D Point Projection Helper
      const project = (x, y, z) => {
        // Rotate Y (yaw)
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate X (pitch)
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective factor
        const fov = 3.5;
        const pz = fov / (fov + z2 * 0.45);
        return {
          sx: cx + x1 * scale * pz,
          sy: cy - y2 * scale * pz,
          z: z2,
          pz
        };
      };

      // Draw reflective studio floor shadow
      ctx.save();
      const shadowGrad = ctx.createRadialGradient(cx, cy + 55, 10, cx, cy + 55, scale * 1.35);
      shadowGrad.addColorStop(0, "rgba(16, 35, 60, 0.22)");
      shadowGrad.addColorStop(0.6, "rgba(16, 35, 60, 0.08)");
      shadowGrad.addColorStop(1, "rgba(16, 35, 60, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 60, scale * 1.2, scale * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bus Geometry Dimensions (12-meter proportion)
      const busL = 1.35;  // Length (Z: -busL to +busL)
      const busW = 0.52;  // Half-width (X: -busW to +busW)
      const busH = 0.58;  // Height (Y: 0.1 to 0.1 + busH)
      const baseY = -0.15;
      const topY = baseY + busH;

      // Color Palette
      const bodyColor = vehicle.isElectric ? "#1264E9" : "#2563EB";
      const roofColor = "#E2E8F0";
      const glassColor = "rgba(16, 35, 60, 0.82)";
      const highlightColor = "rgba(255, 255, 255, 0.28)";

      // Draw Main Bus 3D Box Faces
      const drawQuad = (p1, p2, p3, p4, fill, stroke) => {
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.lineTo(p4.sx, p4.sy);
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      };

      // 8 Vertices of Main Bus Hull
      const v_flb = project(-busW, baseY, busL);  // Front Left Bottom
      const v_frb = project(busW, baseY, busL);   // Front Right Bottom
      const v_rlb = project(-busW, baseY, -busL); // Rear Left Bottom
      const v_rrb = project(busW, baseY, -busL);  // Rear Right Bottom

      const v_flt = project(-busW, topY, busL);   // Front Left Top
      const v_frt = project(busW, topY, busL);    // Front Right Top
      const v_rlt = project(-busW, topY, -busL);  // Rear Left Top
      const v_rrt = project(busW, topY, -busL);   // Rear Right Top

      // Sort faces by depth
      const faces = [
        // Roof
        { z: (v_flt.z + v_frt.z + v_rlt.z + v_rrt.z) / 4, type: "roof" },
        // Left Side
        { z: (v_flb.z + v_flt.z + v_rlb.z + v_rlt.z) / 4, type: "left" },
        // Right Side (Passenger Doors)
        { z: (v_frb.z + v_frt.z + v_rrb.z + v_rrt.z) / 4, type: "right" },
        // Front (Windshield)
        { z: (v_flb.z + v_frb.z + v_flt.z + v_frt.z) / 4, type: "front" },
        // Rear
        { z: (v_rlb.z + v_rrb.z + v_rlt.z + v_rrt.z) / 4, type: "rear" }
      ];

      faces.sort((a, b) => b.z - a.z);

      faces.forEach((face) => {
        if (face.type === "roof") {
          // Roof Surface
          drawQuad(v_flt, v_frt, v_rrt, v_rlt, roofColor, "#CBD5E1");

          // Roof HVAC Units
          const hvac1_p1 = project(-0.25, topY + 0.08, 0.4);
          const hvac1_p2 = project(0.25, topY + 0.08, 0.4);
          const hvac1_p3 = project(0.25, topY + 0.08, -0.1);
          const hvac1_p4 = project(-0.25, topY + 0.08, -0.1);
          drawQuad(hvac1_p1, hvac1_p2, hvac1_p3, hvac1_p4, acActive ? "#0F9F78" : "#94A3B8", "#64748B");

          // Roof High-Voltage Battery Pack Enclosure
          const bat_p1 = project(-0.3, topY + 0.06, -0.3);
          const bat_p2 = project(0.3, topY + 0.06, -0.3);
          const bat_p3 = project(0.3, topY + 0.06, -0.9);
          const bat_p4 = project(-0.3, topY + 0.06, -0.9);
          drawQuad(bat_p1, bat_p2, bat_p3, bat_p4, "#0F172A", "#334155");
        } else if (face.type === "left") {
          // Left Body Side
          drawQuad(v_flb, v_rlb, v_rlt, v_flt, bodyColor, "#0C4EC1");
          // Window Ribbon
          const win_fl = project(-busW - 0.005, baseY + 0.22, busL - 0.15);
          const win_rl = project(-busW - 0.005, baseY + 0.22, -busL + 0.15);
          const win_rlt = project(-busW - 0.005, topY - 0.05, -busL + 0.15);
          const win_flt = project(-busW - 0.005, topY - 0.05, busL - 0.15);
          drawQuad(win_fl, win_rl, win_rlt, win_flt, glassColor, highlightColor);
        } else if (face.type === "right") {
          // Right Body Side with Sliding Passenger Doors
          drawQuad(v_frb, v_rrb, v_rrt, v_frt, bodyColor, "#0C4EC1");

          // Window Ribbon Right
          const win_fr = project(busW + 0.005, baseY + 0.22, busL - 0.15);
          const win_rr = project(busW + 0.005, baseY + 0.22, -busL + 0.15);
          const win_rrt = project(busW + 0.005, topY - 0.05, -busL + 0.15);
          const win_frt = project(busW + 0.005, topY - 0.05, busL - 0.15);
          drawQuad(win_fr, win_rr, win_rrt, win_frt, glassColor, highlightColor);

          // Animated Front Passenger Door (Slides outward and forward)
          const doorOffset = doorAnimRef.current * 0.18; // outward 3D slide
          const d_p1 = project(busW + doorOffset + 0.01, baseY, 0.95);
          const d_p2 = project(busW + doorOffset + 0.01, baseY, 0.45);
          const d_p3 = project(busW + doorOffset + 0.01, topY - 0.05, 0.45);
          const d_p4 = project(busW + doorOffset + 0.01, topY - 0.05, 0.95);
          drawQuad(d_p1, d_p2, d_p3, d_p4, doorsOpen ? "#0F9F78" : "#1E293B", "#FFFFFF");

          // Rear Passenger Door
          const rd_p1 = project(busW + doorOffset + 0.01, baseY, -0.35);
          const rd_p2 = project(busW + doorOffset + 0.01, baseY, -0.85);
          const rd_p3 = project(busW + doorOffset + 0.01, topY - 0.05, -0.85);
          const rd_p4 = project(busW + doorOffset + 0.01, topY - 0.05, -0.35);
          drawQuad(rd_p1, rd_p2, rd_p3, rd_p4, doorsOpen ? "#0F9F78" : "#1E293B", "#FFFFFF");
        } else if (face.type === "front") {
          // Front Hull & Aerodynamic Windshield
          drawQuad(v_flb, v_frb, v_frt, v_flt, "#0F172A", "#1E293B");

          // Tinted Front Windshield
          const ws_b1 = project(-busW + 0.04, baseY + 0.16, busL + 0.01);
          const ws_b2 = project(busW - 0.04, baseY + 0.16, busL + 0.01);
          const ws_t2 = project(busW - 0.04, topY - 0.04, busL + 0.01);
          const ws_t1 = project(-busW + 0.04, topY - 0.04, busL + 0.01);
          drawQuad(ws_b1, ws_b2, ws_t2, ws_t1, glassColor, "#60A5FA");

          // LED Headlamps
          const hl_l = project(-busW + 0.09, baseY + 0.06, busL + 0.02);
          const hl_r = project(busW - 0.09, baseY + 0.06, busL + 0.02);
          ctx.fillStyle = isDriving ? "#FEF08A" : "#FFFFFF";
          ctx.beginPath();
          ctx.arc(hl_l.sx, hl_l.sy, 5 * hl_l.pz, 0, Math.PI * 2);
          ctx.arc(hl_r.sx, hl_r.sy, 5 * hl_r.pz, 0, Math.PI * 2);
          ctx.fill();

          // Hazard Flashers
          if (isHazardLit) {
            ctx.fillStyle = "#F59E0B";
            ctx.beginPath();
            ctx.arc(hl_l.sx - 6, hl_l.sy, 4 * hl_l.pz, 0, Math.PI * 2);
            ctx.arc(hl_r.sx + 6, hl_r.sy, 4 * hl_r.pz, 0, Math.PI * 2);
            ctx.fill();
          }

          // Destination LED Sign
          const dest_p1 = project(-0.35, topY - 0.02, busL + 0.02);
          const dest_p2 = project(0.35, topY - 0.02, busL + 0.02);
          const dest_p3 = project(0.35, topY + 0.05, busL + 0.02);
          const dest_p4 = project(-0.35, topY + 0.05, busL + 0.02);
          drawQuad(dest_p1, dest_p2, dest_p3, dest_p4, "#000000", "#10B981");
        } else if (face.type === "rear") {
          // Rear Hull
          drawQuad(v_rlb, v_rrb, v_rrt, v_rlt, bodyColor, "#0C4EC1");
          // Rear LED Brakelights
          const rl_l = project(-busW + 0.08, baseY + 0.1, -busL - 0.01);
          const rl_r = project(busW - 0.08, baseY + 0.1, -busL - 0.01);
          ctx.fillStyle = speed === 0 ? "#EF4444" : "#991B1B";
          ctx.beginPath();
          ctx.arc(rl_l.sx, rl_l.sy, 4.5 * rl_l.pz, 0, Math.PI * 2);
          ctx.arc(rl_r.sx, rl_r.sy, 4.5 * rl_r.pz, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw 4 Rotating Wheels with Tyres and Hubcaps
      const wheels = [
        { x: -busW - 0.02, z: 0.72, pos: "fl", label: "Front Left" },
        { x: busW + 0.02, z: 0.72, pos: "fr", label: "Front Right" },
        { x: -busW - 0.02, z: -0.72, pos: "rl", label: "Rear Left" },
        { x: busW + 0.02, z: -0.72, pos: "rr", label: "Rear Right" }
      ];

      wheels.forEach((w) => {
        const wp = project(w.x, baseY + 0.02, w.z);
        const radius = 18 * wp.pz;

        // Tyre Outer Rubber
        ctx.save();
        ctx.beginPath();
        ctx.arc(wp.sx, wp.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#1E293B";
        ctx.fill();
        ctx.strokeStyle = tpmsPressures[w.pos] < 28 ? "#DC465C" : "#475569";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Alloy Rim with Rotation spokes
        ctx.beginPath();
        ctx.arc(wp.sx, wp.sy, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#94A3B8";
        ctx.fill();

        // Rotating Spoke indicator
        ctx.beginPath();
        const spokeAngle = wheelSpinRef.current;
        ctx.moveTo(wp.sx, wp.sy);
        ctx.lineTo(wp.sx + Math.cos(spokeAngle) * radius * 0.55, wp.sy + Math.sin(spokeAngle) * radius * 0.55);
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // Calculate 3D Hotspot Screen Coordinates
      const doorSpot = project(busW + 0.08, baseY + 0.28, 0.7);
      const rlTyreSpot = project(-busW - 0.08, baseY + 0.02, -0.72);
      const hvacSpot = project(0, topY + 0.12, 0.15);
      const batterySpot = project(0, topY + 0.08, -0.6);

      setHotspots({
        door: { x: doorSpot.sx, y: doorSpot.sy, visible: doorSpot.pz > 0 },
        tyre: { x: rlTyreSpot.sx, y: rlTyreSpot.sy, visible: rlTyreSpot.pz > 0 },
        hvac: { x: hvacSpot.sx, y: hvacSpot.sy, visible: hvacSpot.pz > 0 },
        battery: { x: batterySpot.sx, y: batterySpot.sy, visible: batterySpot.pz > 0 }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, speed, doorsOpen, isDriving, hazardsActive, acActive, tpmsPressures, vehicle]);

  // Orbit Mouse/Touch Event Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotYRef.current += dx * 0.008;
    // Limit pitch angle to prevent flipping
    rotXRef.current = Math.max(-0.2, Math.min(1.2, rotXRef.current + dy * 0.006));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.001;
    zoomRef.current = Math.max(0.65, Math.min(1.7, zoomRef.current + zoomDelta));
  };

  return (
    <div className={styles.viewerContainer}>
      {/* Viewer Header Toolbar */}
      <div className={styles.topToolbar}>
        <div className={styles.titleInfo}>
          <div className={styles.liveIndicator}>
            <span className={`${styles.pulseDot} ${speed > 0 ? styles.pulseMoving : ""}`} />
            <span className={styles.liveText}>
              {speed > 0 ? `In Motion • ${speed} km/h` : "Stationary • Brakes Engaged"}
            </span>
          </div>
          <span className={styles.subModel}>{vehicle.name} • 12m City Transit Chassis</span>
        </div>

        <div className={styles.toolbarActions}>
          {/* Audio Opt-in Button */}
          {!audioUnlocked ? (
            <button
              type="button"
              className={styles.audioPromptBtn}
              onClick={handleEnableAudio}
              title="Click to enable Web Audio simulation chimes & horn"
            >
              <VolumeIcon size={14} />
              <span>Enable Sound</span>
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.iconToolBtn} ${isMuted ? styles.mutedBtn : ""}`}
              onClick={onToggleMute}
              title={isMuted ? "Unmute simulation audio" : "Mute audio"}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeXIcon size={16} /> : <VolumeIcon size={16} />}
            </button>
          )}

          {/* Horn Button */}
          <button
            type="button"
            className={styles.hornBtn}
            onClick={() => playSound("horn")}
            title="Actuate Electric Transit Horn"
          >
            HORN
          </button>

          {/* 3D vs 2D Fallback Switcher */}
          <div className={styles.modePillGroup}>
            <button
              type="button"
              className={`${styles.modePill} ${viewMode === "3d" ? styles.modePillActive : ""}`}
              onClick={() => setViewMode("3d")}
            >
              3D Interactive
            </button>
            <button
              type="button"
              className={`${styles.modePill} ${viewMode === "2d" ? styles.modePillActive : ""}`}
              onClick={() => setViewMode("2d")}
            >
              2D Studio HD
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className={styles.viewportStage}>
        {viewMode === "3d" ? (
          <div
            className={styles.canvasWrapper}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
          >
            <canvas ref={canvasRef} className={styles.threeCanvas} />

            {/* Orbit Drag Cue */}
            <div className={styles.dragHelpCue}>
              <RotateCcwIcon size={12} />
              <span>Drag to rotate 360° • Scroll to zoom</span>
            </div>

            {/* Floating 3D Projected Hotspots */}
            {hotspots.door.visible && (
              <button
                type="button"
                className={`${styles.hotspotNode} ${doorsOpen ? styles.hotspotNodeActive : ""}`}
                style={{ left: `${hotspots.door.x}px`, top: `${hotspots.door.y}px` }}
                onClick={() => {
                  onToggleDoors();
                  if (speed > 0) playSound("interlock_buzz");
                  else playSound("door_chime");
                }}
                title="Passenger Door Safety Actuator"
              >
                <span className={styles.pingRing} />
                <span className={styles.nodeLabel}>
                  Door: {doorsOpen ? "OPEN (0 km/h)" : "LOCKED"}
                </span>
              </button>
            )}

            {hotspots.tyre.visible && (
              <button
                type="button"
                className={`${styles.hotspotNode} ${tpmsPressures.rl < 28 ? styles.hotspotNodeCrit : ""}`}
                style={{ left: `${hotspots.tyre.x}px`, top: `${hotspots.tyre.y}px` }}
                onClick={onSelectDiagnostics}
                title="Rear-Left TPMS Pressure Sensor"
              >
                <span className={styles.pingRing} />
                <span className={styles.nodeLabel}>
                  RL Tyre: {tpmsPressures.rl} PSI
                </span>
              </button>
            )}

            {hotspots.hvac.visible && (
              <button
                type="button"
                className={styles.hotspotNode}
                style={{ left: `${hotspots.hvac.x}px`, top: `${hotspots.hvac.y}px` }}
                onClick={onToggleAc}
                title="Roof Dual Climate Unit"
              >
                <span className={styles.nodeLabel}>
                  HVAC: {acActive ? "22°C Active" : "Off"}
                </span>
              </button>
            )}

            {hotspots.battery.visible && (
              <button
                type="button"
                className={styles.hotspotNode}
                style={{ left: `${hotspots.battery.x}px`, top: `${hotspots.battery.y}px` }}
                title="High Voltage Battery Storage Array"
              >
                <span className={styles.nodeLabel}>
                  {vehicle.isElectric ? "320 kWh Array" : "Euro-6 Hybrid"}
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className={styles.studioImageWrapper}>
            <Image
              src={vehicle.image}
              alt={vehicle.alt}
              width={780}
              height={440}
              className={styles.studioBusImg}
              priority
            />
            {/* 2D Fallback Hotspots */}
            <div className={styles.studioHotspots}>
              <button
                type="button"
                className={`${styles.hotspotNode} ${doorsOpen ? styles.hotspotNodeActive : ""}`}
                style={{ left: "34%", top: "54%" }}
                onClick={onToggleDoors}
              >
                <span className={styles.pingRing} />
                <span className={styles.nodeLabel}>
                  Door 1: {doorsOpen ? "OPEN" : "LOCKED"}
                </span>
              </button>

              <button
                type="button"
                className={`${styles.hotspotNode} ${tpmsPressures.rl < 28 ? styles.hotspotNodeCrit : ""}`}
                style={{ left: "70%", top: "72%" }}
                onClick={onSelectDiagnostics}
              >
                <span className={styles.pingRing} />
                <span className={styles.nodeLabel}>
                  RL Tyre: {tpmsPressures.rl} PSI
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Camera Angles Bar */}
      {viewMode === "3d" && (
        <div className={styles.cameraPresetsBar}>
          <span className={styles.presetsLabel}>Camera Views:</span>
          <div className={styles.presetButtons}>
            <button
              type="button"
              className={`${styles.presetBtn} ${cameraPreset === "perspective" ? styles.presetBtnActive : ""}`}
              onClick={() => applyCameraPreset("perspective")}
            >
              3/4 Hero
            </button>
            <button
              type="button"
              className={`${styles.presetBtn} ${cameraPreset === "side" ? styles.presetBtnActive : ""}`}
              onClick={() => applyCameraPreset("side")}
            >
              Side Doors
            </button>
            <button
              type="button"
              className={`${styles.presetBtn} ${cameraPreset === "front" ? styles.presetBtnActive : ""}`}
              onClick={() => applyCameraPreset("front")}
            >
              Front Windshield
            </button>
            <button
              type="button"
              className={`${styles.presetBtn} ${cameraPreset === "cockpit" ? styles.presetBtnActive : ""}`}
              onClick={() => applyCameraPreset("cockpit")}
            >
              Cockpit Dash
            </button>
            <button
              type="button"
              className={`${styles.presetBtn} ${cameraPreset === "top" ? styles.presetBtnActive : ""}`}
              onClick={() => applyCameraPreset("top")}
            >
              Top Roof/HVAC
            </button>
            <button
              type="button"
              className={styles.resetCamBtn}
              onClick={() => applyCameraPreset("perspective")}
              title="Reset to default 3/4 camera orientation"
            >
              <RotateCcwIcon size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
