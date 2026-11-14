# NEBULA TRANSIT — System Architecture & Specification

**Project:** Bus Smart System Platform & Vehicle Telemetry Showcase  
**Author & Lead Engineer:** Ayesha Batool (Roll No: M245004)  
**Academic Degree:** Bachelor of Science in Computer Science (BSCS)  
**Institution:** Department of Computer Science, Gomal University, Faisalabad (Class of 2026)  
**Project Supervisor:** Mam Mehwish  

---

## 1. Architectural Overview

NEBULA TRANSIT is an enterprise-grade transit fleet operations and passenger safety platform designed for smart campus and municipal transit corridors. The architecture strictly follows modern transport control room guidelines with a clear separation between simulated telemetry streams and certified hardware actuation boundaries.

```
+-----------------------------------------------------------------------------------+
|                            NEBULA TRANSIT PLATFORM                                |
+-----------------------------------------------------------------------------------+
|  1. Presentation & Academic Tier                                                  |
|     - TopBar with Live Telemetry Indicators & Simulated Mode Badge                |
|     - Academic Thesis Documentation Portal (Chapters 1–6, Search & Defense Links) |
|     - Developer Credentials & University Supervisory Committee Verification       |
+-----------------------------------------------------------------------------------+
|  2. Fleet Operations Control Tier                                                 |
|     - Interactive Bus 3D/2D Visual Inspector with Component Hotspots              |
|     - Moving Door Safety Interlock Engine (Hardware Inhibit at Speed > 0)         |
|     - Live GPS Geographic Polyline Navigation & Stop Schedules                    |
|     - Dynamic Passenger Density Flow, RFID Scan Ledger & Overcrowding Detection   |
|     - 4-Wheel Direct TPMS Telemetry & OBD-II/CAN-Bus Fault Codes Register         |
|     - AI Camera Visual Defect Screening (Tyre Tread & Bodywork Analysis)          |
|     - Safety Center Emergency SOS Beacon & Immutable Incident Ledger              |
|     - Telemetry & Compliance CSV Reporting Engine                                 |
+-----------------------------------------------------------------------------------+
|  3. Deterministic Simulation Tier                                                 |
|     - Examiner 1-Click Guided Demo Controller (5–7 Minute Defense Workflow)       |
|     - High-Precision Multi-Vehicle Physics & Metric Engine:                       |
|         * EV Transit Bus: kWh/100 km, Battery Pack Health, Regenerative Braking   |
|         * Hybrid/Diesel: km/l, Fuel Reserve, Euro-6 Combustion Efficiency         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Safety Interlock Mechanics

The vehicle safety interlock follows strict industrial standards:

1. **State Inhibit Rule:** When vehicle speed $v > 0\text{ km/h}$ or service brakes are disengaged, door actuator commands are rejected.
2. **Audit Guarantee:** Any remote or manual command to disengage door locks during transit is blocked and an immutable entry is recorded in the Safety Ledger.
3. **Safe Release State:** Doors may only open when vehicle speed $v = 0\text{ km/h}$ and parking brake is engaged.

---

## 3. Honest Simulation Disclosure

In accordance with academic integrity guidelines:
* All live telemetry, GPS coordinate updates, and CAN-Bus sensor data in this demonstration portal are simulated.
* The system displays the prominent **DEMO / SIMULATED** environment chip in the top navigation bar.
* No live actuator commands are dispatched to unreviewed physical vehicles without physical hardware safety certifications.
