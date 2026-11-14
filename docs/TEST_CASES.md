# NEBULA TRANSIT — Verification Test Suite

**Lead Author:** Ayesha Batool (M245004)  
**Project:** Bus Smart System Platform  

---

### Test Case TC-01: Moving Door Safety Interlock
* **Pre-condition:** Vehicle is in transit (`speed = 35 km/h`, `isDriving = true`).
* **Action:** Operator presses `DISENGAGE DOOR LOCKS` button.
* **Expected Result:** Actuator command is rejected. A critical alert banner is displayed: *"INTERLOCK ACTIVE: Doors cannot be opened while vehicle is in motion"*. An entry is written to the Safety Ledger: `SAFETY INTERLOCK REJECTED: Door open command blocked at speed 35 km/h`. Doors remain locked.
* **Status:** PASS (Verified in `FleetControlRoom.jsx`).

---

### Test Case TC-02: Passenger Overcrowding Threshold
* **Pre-condition:** Vehicle capacity is 42 seats (`Nebula Cityliner 12`).
* **Action:** Passenger count increases to 44 via simulated RFID card tap or Teacher Demo bar.
* **Expected Result:** Occupancy gauge enters critical state (`> 100%`). Overcrowding banner appears: *"OVERCROWDING WARNING: Vehicle is operating at 105% of rated capacity"*. Acoustic warning sounds, event recorded in Incident Ledger.
* **Status:** PASS (Verified in `FleetControlRoom.jsx`).

---

### Test Case TC-03: TPMS Pressure Drop & Fault Code Generation
* **Pre-condition:** All 4 tyres nominal at 35 PSI.
* **Action:** Click `Simulate RL Tyre Pressure Drop (24 PSI)` or trigger Scenario 4.
* **Expected Result:** Rear-Left wheel gauge displays `24 PSI` in red critical styling. Diagnostic fault `TPMS-04: Rear-Left Low Pressure` appears in CAN-Bus fault ledger with critical severity badge.
* **Status:** PASS (Verified in `FleetControlRoom.jsx`).

---

### Test Case TC-04: AI Camera Visual Screening & Work Order Creation
* **Pre-condition:** AI Camera Scanner tab active.
* **Action:** Select `Tyre Tread Wear (Critical)` and click `Technician Confirm & Queue Work Order`.
* **Expected Result:** Work order logged in verified history table with timestamp and technician name (`Ayesha Batool`). Clear disclaimer indicates screening requires physical technician verification.
* **Status:** PASS (Verified in `FleetControlRoom.jsx`).

---

### Test Case TC-05: Telemetry & Safety Incident CSV Export
* **Pre-condition:** At least 2 events recorded in the Incident Ledger.
* **Action:** Navigate to `Export Reports` and click `Download Telemetry & Safety Ledger (CSV)`.
* **Expected Result:** Clean CSV file generated and downloaded containing valid timestamps, severity levels, event messages, vehicle names, and route details.
* **Status:** PASS (Verified in `FleetControlRoom.jsx`).
