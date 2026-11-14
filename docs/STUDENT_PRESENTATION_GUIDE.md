# NEBULA TRANSIT — Smart Mobility Intelligence
## Final Year Project Presentation & Defense Guide
**Candidate:** Ayesha Batool (Roll No: M245004)  
**Supervisor:** Mam Mehwish  
**Department:** Department of Computer Science, Gomal University Faisalabad  
**Project:** Bus Smart System Application / Connected Fleet Operations Platform  

---

## 🎯 Quick Presentation Overview (5–7 Minutes)
Use this guide for your presentation slides and live evaluation. Keep answers crisp, confident, and focused on system architecture, safety logic, and practical demonstration.

---

### Slide 1: Title & Introduction
* **Project Title:** NEBULA TRANSIT — Smart Mobility Intelligence
* **Academic Baseline:** Bus Smart System Application (Class of 2026)
* **Student Name:** Ayesha Batool (M245004)
* **Supervisor:** Mam Mehwish
* **Institution:** Gomal University Faisalabad

> **🗣️ What to Say:**  
> *"Respected teachers and examiners, my name is Ayesha Batool (Roll No: M245004). Today I am presenting my final year project, **NEBULA TRANSIT**, a smart connected bus fleet operations and passenger safety platform designed for modern public transit systems."*

---

### Slide 2: Problem Statement
* **Transit Safety Risks:** Passengers boarding or alighting moving buses causing severe falls and injuries.
* **Lack of Visibility:** Dispatchers have no real-time 3D digital twins or accurate component telemetry.
* **Overcrowding & Revenue Leakage:** Inability to monitor passenger density thresholds and contactless attendance.
* **Manual Inspections:** Vehicle maintenance and tyre tread wear checks are reactive rather than predictive.

> **🗣️ What to Say:**  
> *"Traditional public transit faces high safety risks due to doors opening in motion, overcrowding, and lack of real-time diagnostics. Our goal is to build an intelligent, telemetry-driven platform with an uncompromised automated safety interlock."*

---

### Slide 3: Proposed Solution & Core Modules
* **3D Digital Twin:** Real-time 360° vehicle telemetry model with physical actuation and animated sub-assemblies.
* **Automated Safety Interlock:** Hard software constraint preventing door disengagement whenever vehicle speed > 0 km/h.
* **Corridor Telematics & TPMS:** GPS route simulation with 4-wheel tyre pressure and propulsion efficiency (kWh/100 km).
* **Passenger Flow & Contactless RFID:** Automated boarding density tracking with over-capacity alert triggers.
* **AI Camera Defect Screening:** Computer vision assisted exterior surface and tyre wear screening.

> **🗣️ What to Say:**  
> *"NEBULA TRANSIT solves these problems through five integrated modules: an interactive 3D digital twin, a speed-dependent safety interlock, real-time CAN-bus telematics, RFID student attendance, and AI-assisted defect inspection."*

---

### Slide 4: System Architecture & Technology Stack
* **Frontend Architecture:** Next.js 16 (Turbopack) & React 19 (Server Components + Client Simulators).
* **3D & Animation Engine:** Pure HTML5 Canvas 3D Matrix Projection Engine (60 FPS on desktop & mobile without heavy WebGL bloat).
* **Audio Synthesis:** Web Audio API procedural sound synthesizer (motor whine, door chimes, hazard flasher, air brakes).
* **Design System:** Custom Light-Theme First Design System (`#F7F9FC` canvas, `#174EB6` cobalt blue, 44px touch targets).
* **Data Integrity:** Honest environment classification (`SIMULATED DATA / DEMO MODE`) with immutable audit logging.

> **🗣️ What to Say:**  
> *"The platform is engineered using Next.js 16 and React 19. For performance, we developed an ultra-lightweight 3D projection engine that runs smoothly on both desktop and mobile without extra heavy dependencies, coupled with a browser-safe Web Audio API synthesizer."*

---

### Slide 5: The 5-Minute Live Demo Script
Follow this exact order during the live examiner evaluation:

| Step | Action on Screen | What Happens in the App | What to Explain to the Examiner |
| :--- | :--- | :--- | :--- |
| **1. Baseline Nominal** | Open `/dashboard` | Bus #102 is stationary (0 km/h, brake on, 42 Pax capacity, nominal 35 PSI tyres). | *"Here is our fleet overview. All 3 vehicles are online, operating with EV-correct metrics (112 kWh/100 km)."* |
| **2. Interactive 3D Twin** | Drag bus 360° & click "Side Doors" / "Cockpit" | Bus rotates in 3D; hotspots reveal door, tyre, and battery status. Click **"Enable Sound"** for motor & chime. | *"Examiners can rotate the digital twin 360 degrees or switch camera angles to inspect doors, tyres, and rooftop HVAC."* |
| **3. Safety Interlock Test** | Click **"Drive (Throttle)"** (bus speeds up to 35 km/h). Now click **"Open Doors"**. | **ACTION BLOCKED!** Red warning banner pops up: *"INTERLOCK ACTIVE: Doors cannot be opened while vehicle is in motion."* | *"Notice that the safety interlock strictly blocks opening doors while in motion and logs this attempt into the immutable safety ledger."* |
| **4. Safe Door Opening** | Click **"Brake (Stop)"** (speed drops to 0 km/h). Now click **"Open Doors"**. | Doors physically slide open in 3D with chime. Drive throttle is now locked until doors close. | *"Once the bus makes a full stop with brakes engaged, the doors unlock safely. Throttle is locked while doors remain open."* |
| **5. Overcrowding Event** | Go to **"Teacher Demo"** & click **"3. Overcrowding Event"**. | Passenger count jumps to 44/42 Pax (105%). Red alert triggers: *"OVERCROWDING WARNING"*. | *"Our passenger flow module detects over-capacity situations and alerts dispatchers to dispatch a secondary shuttle."* |
| **6. TPMS & AI Scanner** | Go to **"Diagnostics"** -> click **"Simulate RL Drop"**. Then open **"AI Inspection"**. | Rear-Left drops to 24 PSI -> Fault code `TPMS-04`. AI scanner checks tyre tread (1.8 mm wear) -> Technician verifies. | *"The system monitors 4-wheel TPMS in real time. Our AI camera inspection flags worn tyres and queues maintenance work orders."* |
| **7. Export Report** | Go to **"Reports"** -> click **"Download CSV"**. | Telemetry & safety audit ledger downloads instantly as a clean CSV report. | *"Finally, all operational events, interlock rejections, and attendance logs can be exported as an official audit report."* |

---

### Slide 6: Key Results & Technical Achievements
* **100% Interlock Compliance:** Zero moving door openings permitted across all test runs.
* **Cross-Platform Responsive:** Desktop (1440×900) persistent 248px sidebar + Mobile (390×844) 5-tab bottom navigation with zero horizontal overflow.
* **Clean Production Code:** 0 Build errors, 0 ESLint warnings, 100% accessible touch targets (≥44px).
* **Academic Distinction:** Clear separation of simulated telemetry and proven research methods.

---

### Slide 7: Defense Q&A (Frequently Asked Questions)

#### Q1: "Is this connected to real physical bus hardware or simulated?"
* **Answer:** *"Sir/Madam, in accordance with engineering integrity standards, this thesis platform runs on a **deterministic software simulation engine**. Unverified mock telemetry is never claimed as live hardware. It simulates CAN-Bus packets, GPS updates, and speed sensors to validate safety logic before physical deployment."*

#### Q2: "How does the Safety Interlock work?"
* **Answer:** *"The interlock functions as a state machine. When the vehicle speed is greater than 0 km/h or the service brake is released, the door actuator relay is in a hard-lock state. Any remote or physical open command is rejected, flagged with an audible alert, and logged to the immutable safety ledger."*

#### Q3: "Why does the electric bus use kWh/100 km instead of km/l?"
* **Answer:** *"Electric vehicles do not consume liquid fuel, so using km/l is physically inaccurate. Electric mobility standards (such as SAE and ISO) measure consumption in kilowatt-hours per 100 kilometers (`kWh/100 km`), while our hybrid bus (Metro Express 24) appropriately uses `km/l`."*

#### Q4: "What does the AI Camera Inspection do?"
* **Answer:** *"It performs computer vision visual screening on exterior high-wear areas like tyre groove depth (e.g., detecting wear below the 2.0 mm safety limit) and body panel dents. It provides a confidence score and explicitly requires technician sign-off before generating a workshop maintenance ticket."*

---

### Slide 8: Conclusion & Acknowledgments
* **Summary:** NEBULA TRANSIT demonstrates how modern web engineering, 3D digital twins, and safety interlocks elevate public bus operations.
* **Acknowledgments:** Special thanks to supervisor **Mam Mehwish** and the **Department of Computer Science, Gomal University Faisalabad** for their guidance.

---
*(Created for candidate Ayesha Batool — Roll No: M245004 — Gomal University Faisalabad)*
