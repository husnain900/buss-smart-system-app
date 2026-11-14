# BUS CONNECTED — Roman Urdu Guide (M245004)

Website: https://m245004-buss-connected.vercel.app/
Project: Bus Smart System Application

## 1. Hum kya bana rahe hain?
NEBULA TRANSIT: AI Smart Bus Fleet, Route & Passenger Safety Platform. Ye CAR project se bilkul alag hai. Thesis pages aur student credits preserve karne hain.

## 2. Design
Dark graphite #0B1018, cards #151D28, white text #F4F7FB, lime accent #D6F45A. Modern fleet control room, uncluttered UI, full mobile responsiveness.

## 3. Important screens
- Fleet Overview: buses ki list, speed, range, status, driver/route.
- Interactive Bus 3D/2D: door, lights, wheels, inside view, hotspots.
- Live Map & Route: bus stops, ETA simulation, route progress aur trip history.
- Passenger Dashboard: entering/exiting counters, occupancy, crowd alert.
- Safety Center: emergency, overspeed, doors while moving blocked in simulator.
- Battery/Fuel: EV me km/kWh or kWh/100 km, fuel bus me km/l. Mix nahin karna.
- AI Camera Inspection: visible bus body damage scan suggestions, not mechanical certainty.
- Diagnostics & Maintenance: sensor readings, service due, repair history.
- Admin & Reports: device logs, incident reports, CSV/PDF.
- Thesis + Teacher Demo: academic section aur guided scenarios.

## 4. 3D aur 2D assets
Original unbranded generic city bus Blender/GLB, mesh parts named front_door, rear_door, wheels, lights, etc. 360 view, door click tabhi open ho jab SIMULATED speed = 0 aur brake applied. 2D matching front/side/rear/top PNG/WebP fallback for slow mobile. AI pictures ko actual rotatable 3D mat kehna.

## 5. Backend aur AI
Login, vehicle/fleet records, routes, stops, passenger counts, alerts, telemetry, inspection images, audit history. Real IoT ke baghair clearly DEMO / SIMULATED. 5G connected ya telemetry verified tabhi show karein jab hardware evidence ho.

## 6. Antigravity me kya karein?
1) Sirf Bus project ka source folder kholo.
2) Isi ZIP ki `ANTIGRAVITY_MASTER_BUS.md` file agent ko do.
3) Audit -> professional UI -> backend -> simulator -> map -> 3D/2D -> AI -> security/testing.
4) Teacher ko demo: start route -> bus stop -> passenger count increase -> overcrowding alert -> moving-door attempt blocked -> report.
5) Har screen ka click, hover, mobile touch, keyboard aur database save verify karein.
