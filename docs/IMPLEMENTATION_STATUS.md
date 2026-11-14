# NEBULA TRANSIT — Implementation Status Matrix

**Lead Engineer:** Ayesha Batool (M245004)  
**Supervisor:** Mam Mehwish  
**Status Date:** November 2026  

---

## Feature Checklist & Integrity Status

| Module / Requirement | Status | Execution Tier | Description |
| :--- | :--- | :--- | :--- |
| **Student Attribution** | **VERIFIED WORKING** | Global Metadata | Ayesha Batool (M245004) across TopBar, Footer, Meta tags, Thesis, and Credits modal. |
| **Industrial Design System** | **VERIFIED WORKING** | CSS / Layout | Dark graphite (`#0B1018`), card (`#1A2532`), functional lime (`#D6F45A`), 14px radius, 44px touch targets. |
| **Honest Status Badging** | **VERIFIED WORKING** | Navigation UI | Prominent `DEMO / SIMULATED` environment badge in TopBar. |
| **Door Safety Interlock** | **VERIFIED WORKING** | Safety Logic | Moving door open attempt (`speed > 0`) is blocked, visual alert shown, and logged to incident ledger. |
| **Multi-Vehicle Fleet** | **VERIFIED WORKING** | Telemetry Model | EV Cityliner (`kWh/100 km`), Eco Pod (`kWh/100 km`), Hybrid Bus (`km/l`). No mixed metrics. |
| **Live GPS Route Simulation** | **VERIFIED WORKING** | Vector Geographic | Animated transit node connecting Gomal Campus, Canal Expressway, City Tower, and Tech Park. |
| **Passenger Density & RFID** | **VERIFIED WORKING** | Flow Controller | Boarding/Alighting counters, live occupancy gauge, overcrowding warning, student RFID roll call. |
| **4-Wheel TPMS & Faults** | **VERIFIED WORKING** | Sensor Simulation | Direct PSI readings for FL, FR, RL, RR with simulated pressure drops and CAN-Bus fault codes. |
| **AI Camera Screening** | **VERIFIED WORKING** | Computer Vision Demo | Visual inspection for tyre tread wear and bodywork dents with honest "Requires Technician Confirmation" label. |
| **Teacher 1-Click Demo Bar** | **VERIFIED WORKING** | Guided Demo Engine | Baseline, Door Interlock Test, Overcrowding Event, Low Tyre Pressure, and Simulation Reset. |
| **Data Export (CSV)** | **VERIFIED WORKING** | Reporting Engine | One-click CSV download of incident stream and operational telematics. |
| **Academic Thesis Portal** | **VERIFIED WORKING** | Academic Document | Chapters 1 to 6 reader, committee certificate, declaration, acknowledgments, and keyword search. |
| **Physical Hardware Actuation** | **PHYSICAL BOUNDARY** | Real Hardware | Software interlock prohibits real bus actuation without verified physical safety systems. |

---

## Build & Test Status

* **Production Build (`next build`):** Clean compilation in 5.0s, 0 errors, 0 warnings.
* **Code Quality (`eslint`):** ESLint 9 core rules passed with 0 errors, 0 warnings.
* **Responsive Scaling:** Tested across Mobile (< 640px), Tablet (640px–1024px), and Desktop (> 1024px) viewports with zero horizontal overflow.
