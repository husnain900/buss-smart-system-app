# NEBULA TRANSIT — BUS SMART SYSTEM
## Antigravity Implementation Master Brief (University Project M245004)

**Existing live reference:** https://m245004-buss-connected.vercel.app/
**Current visible identity:** Bus Smart System Application — Ayesha Batool (M245004), university thesis portal + Smart Transit Bus #12 simulator.

## MISSION / DEFINITION OF DONE
Turn the existing site into a polished, responsive, genuinely interactive **Smart Bus Fleet Operations & Safety Platform**, suitable for an undergraduate demonstration. Preserve the academic author attribution, thesis content and existing code wherever feasible. Build actual persistent app functionality, not a static redesign. Final deliverables include source, tests, mock telemetry engine, backend/database, visual assets, documentation, honest status labels, and a reproducible 5–7 minute live demonstration.

**Important distinction:** a university demo without hardware is SIMULATED. Never label mock data as verified physical telemetry or live GPS. All vehicle actuation must remain simulated unless an independently reviewed, authorized and safe physical integration is provided. Never remotely start/drive a real bus or operate doors while moving.

## CURRENT SITE AUDIT (WHAT COULD BE OBSERVED VIA PUBLIC PAGE)
- Thesis portal, thesis search field, chapter links, credits; 'Sleek Dark' theme indication.
- Vehicle selector: Transit Bus / EV Sedan / Eco Pod, displayed Smart Transit Bus #12.
- Example values: 42 Pax, 250 km usable range, 0 km/h, 10.8 km/l, odometer 142,356.4 km.
- Buttons: IGNITE, Climate, Horn, Hazard, Doors, Run Diagnostic Telemetry Check.
- Page displays 5G IoT and 'Telemetry Verified' without independently observable proof of connected equipment.
- **Cannot independently confirm** that controls function, data is persisted, camera works, API exists, or design is responsive. Test via repository and browser/device inspection.
- **Consistency issue:** a vehicle labeled EV should normally use kWh/100 km or km/kWh, while combustion vehicles may use km/l. Different vehicles must have type-specific metrics.
- **UX issue:** public-facing thesis document and control-room interface are mixed; separate presentation/academic section from fleet product navigation while preserving both.

## BRAND & DESIGN SYSTEM
**New name:** NEBULA TRANSIT (product title). **Tagline:** Intelligence behind every journey.
**Persona:** premium transport operations software, clean 2026 industrial-tech, calm and usable, NOT cyberpunk or casino-like.
Palette:
- Background `#0B1018`; raised surface `#151D28`; card `#1A2532`; stroke `#2A3746`
- Primary text `#F4F7FB`; secondary text `#96A6B7`
- Functional lime accent `#D6F45A` used only sparingly (5–10%)
- Success `#42C895`, caution `#FFBD59`, critical `#FF6875`, info `#6DB6FF`
- Avoid neon gradients, heavy glass blur, endless cards, decorative carousels.
Typography: Inter or Geist; 12-column responsive desktop grid; clear tabular numerals for telemetry. 8pt spacing system; card radius 14px; 44px minimum touch controls; semantic accessible colors and focus outlines.
Appearance modes: dark default, light optional. Respect reduced-motion.

## APP INFORMATION ARCHITECTURE
Public: `/` product/landing overview; `/project` thesis & methods; `/demo` guided student demonstration; `/about` acknowledgments, credits, methodology.
Authenticated: `/app/overview`, `/app/fleet`, `/app/vehicles/[id]`, `/app/live-map`, `/app/trips`, `/app/passengers`, `/app/safety`, `/app/diagnostics`, `/app/maintenance`, `/app/ai-inspection`, `/app/alerts`, `/app/reports`, `/app/settings`.
Admin-only: `/app/admin` for user roles, telemetry simulator scenarios, device pairing logs and audit entries.

## DASHBOARD COMPOSITION
Topbar: NEBULA TRANSIT logo; environment chip **DEMO / SIMULATED**; device connection badge; search; alert count; account.
Left sidebar: Overview, Fleet, Live Map, Trips, Passenger Flow, Safety Center, Maintenance, AI Inspection, Reports, Thesis.
Main hero: bus 3D viewer, status chips, selected bus info, route, next stop, speed, occupancy, remaining range.
Below: mission-critical KPIs (battery/fuel depending on vehicle type, occupancy, route adherence, tire health); contextual warnings; trip timeline; route map; maintenance forecast; recent events.
Right rail on large monitors: alerts and live events; collapse below content on tablets/mobile.
Mobile: bottom navigation; cards stack; active map and camera get fullscreen views; quick actions pinned but never obscure emergencies.

## REAL 3D BUS + 2D FALLBACK
1. Model an original generic 12 m city-transit bus; not a trademarked manufacturer's proprietary design. Use Blender modeling or properly licensed .glb. Build **low-poly optimized web 3D**: 40k–120k triangles target, texture sizes 1k/2k, PBR materials, three LOD levels if needed, compressed GLB/KTX2 or meshopt/Draco as supported. Test on mobile.
2. Export `/public/models/transit-bus.glb`. Name scene nodes/meshes `body`, `front_door`, `rear_door`, `front_left_tyre`, `front_right_tyre`, `rear_left_tyre`, `rear_right_tyre`, `headlamps`, `hazards`, `battery_pack`, `roof_ac`, `camera_front`, `camera_rear`.
3. React Three Fiber / Three.js: OrbitControls with sensible angle limits; tap meshes to reveal real telemetry; highlight only on hover/focus; animated door opening **only when bus speed=0 and brake applied** in demo; hazard blink; camera views: 3/4, front, side, roof, rear, interior cutaway. Provide Reset View.
4. 2D assets as fallback when WebGL unsupported: front, side, rear, top, 3/4 PNG/WebP plus labeled hotspot coordinates, rendered as honest diagrams—not fake 3D geometry.
5. Do NOT assume AI image generation yields GLB. To create a true rotatable model, use modeling workflow or a mesh-generation pipeline followed by cleanup and explicit inspection. If 3D model missing, implement 2D now, without broken placeholders.
6. Avoid copyrighted OEM badges; ensure seats, doors, axle count, and passenger capacity are consistent with the example vehicle.

## ASSET PRODUCTION PROMPTS
### HERO BUS / 2D RENDERS
'Original unbranded modern electric 12-metre city transit bus, graphite metallic body, restrained subtle lime trim, realistic proportions, panoramic front windshield, accessible low floor, wide passenger doors, premium industrial design, neutral studio charcoal background, 3/4 front view, photorealistic product visualization, no text, no logos, no people, consistent wheel placement, clean shadow, 16:9.'
Generate a **consistent matched set** by reference-image conditioning: exact same bus front, side, rear, top, interior cockpit, entry door. Save 1600px wide hero & 800px card WebP; transparent PNG where needed; track licenses and prompts.
### CAMERA INSPECTION DEMO TEST IMAGES
'Unbranded city bus close-up tyre with visibly shallow tread, natural workshop lighting, sharp realistic photo, no text'. Also make good tyre comparison, dented side panel, clean side panel, dashboard warning indicator. These are labeled **synthetic test photos**, not model-validation evidence.
### MAP GRAPHICS
Use actual map service for route/navigation. AI images must not stand in for geographic data.

## FUNCTIONAL MODULES AND ACCEPTANCE CRITERIA
1. **Fleet manager:** add, edit, deactivate demo vehicles; bus/electric/ICE type determines displayed metrics; search, filter, status. All persisted.
2. **Live vehicle status:** simulator ticks every 1–3 seconds; route progress, speed, battery/fuel, temperature, tyre pressure; connection state and last timestamp. No unexplained random fluctuations.
3. **Map/trips:** selectable campus or sample route using real map tiles; simulated location animates along pre-authored polyline; stops, ETA, dwell, timeline, distance, trip reports. Privacy-respecting location handling.
4. **Passenger count:** capacity, in/out events per stop, occupancy percent, over-capacity alert; simulator scenario and persisted history.
5. **Safety controls:** locks, horns, hazards, doors, HVAC are simulated and confirm state. Interlock door-open with stationary state; if moving, reject with clear reason and log the rejection. Do not implement real ignition/drive remote control.
6. **Diagnostics:** fault events with codes, severity, contextual explanations; sample sensor thresholds configured per vehicle; technician inspection note; corrective action and history.
7. **Maintenance:** upcoming service schedule, tyre/charge/brake health, reminders; alert acknowledgment and resolution timestamps.
8. **Camera AI:** user consent and secure HTTPS camera permission, photo upload fallback; image classification of *visually detectable* exterior issues with bounding/region annotation only when model can support it; include confidence and 'needs human confirmation'; never diagnose real internal engine/ECU defects from an image. Save inspection and deletion control.
9. **AI copilot:** natural-language queries about vehicle-specific stored diagnostics/trips; cite telemetry timestamps; distinguish evidence from prediction; safe rule-based deterministic fallback if no AI API key.
10. **Reports:** CSV/PDF export of trip, occupancy, alerts, maintenance history, demo integrity indicators; one-click sample university demo report.
11. **Auth/security:** role-based admin/operator/viewer, Supabase Auth or existing compatible auth, RLS, server-side validation, authenticated audit trail, rate limiting; secret keys only server environment.
12. **Thesis pages:** functional TOC navigation/search; correct candidate/supervisor, citations/figures, architecture, ER diagram, implementation/testing evidence, real limitations.
13. **Accessibility & responsiveness:** 360px to 1920px, keyboard-only operation, aria labels, no color-only alert cues, screen reader text, performance budget.
14. **Microinteraction:** state-driven transitions, subtle camera reveal, accessible hover and focus, toast for saved actions, skeleton loading, helpful empty/error states. Never animate UI without data meaning.

## BACKEND DESIGN
Preferred adaptation: maintain existing framework after inspecting repository; if suitable use Next.js+TypeScript, React/Tailwind, Three.js/R3F, Supabase Postgres + Auth, optional Realtime, MapLibre/other valid map provider, server AI endpoint.
Tables: `profiles`, `vehicles`, `vehicle_types`, `vehicle_devices`, `telemetry_samples`, `routes`, `stops`, `route_stops`, `trips`, `gps_samples`, `passenger_events`, `commands`, `diagnostic_faults`, `maintenance_jobs`, `alerts`, `inspections`, `inspection_images`, `ai_insights`, `audit_logs`.
All domain tables should have UUID IDs, foreign keys, `created_at`, appropriate indexes; tenant/user ownership; RLS. `telemetry_samples` includes source enum `simulated|hardware`, measured_at, speed_kph, battery_pct(nullable), fuel_pct(nullable), pressure fields, latitude, longitude and validation. Source classification is immutable from client, assigned by trusted backend.
Commands API `POST /api/vehicles/:id/commands`: validate operator auth, command whitelist, state transitions/interlocks, dedupe ID, log requested/accepted/rejected, return updated state; simulator persists outcomes. For real device integration, use a separate secure service with physical safety approval.
AI API `POST /api/inspections`: MIME/size limits, auth, optional model analysis, privacy policy, explicit no-model fallback; never fabricate bounding boxes or confidence. Async job state with progress visible only if implemented.
Realtime channel per vehicle on authorized role; bounded polling fallback. Use deterministic seed scenarios.

## DEMO SCENARIOS (ONE-CLICK CONTROLLED)
- Healthy fleet: 3 buses on route, correct metrics for EV vs diesel.
- Low tyre: rear-left pressure drops below configured threshold => chart/alert/maintenance ticket; examiner can see cause-effect.
- Overcrowding: 42-seat bus exceeds configured safe passenger capacity => alert and suggested dispatch action.
- Door safety: bus traveling 28 km/h => attempted OPEN DOORS is blocked with reason and logged; stop bus and apply brake => door opens in 3D + event log.
- Low battery: EV range estimate decreases, planner flags charging stop.
- AI inspection: upload demo tyre image, display assessment labeled AI-assisted, user confirms result.
- Report: export selected bus events after scenarios.
Reset Demo restores seeded states; demo actions are local/simulated and fully auditable.

## DEVELOPMENT PHASES
0. Inspect existing repository/framework, list routes/components, detect broken buttons, audit accessibility/responsiveness and existing API; establish git branch and backup.
1. Branding/design system and app navigation; preserve thesis and author credit.
2. Working demo simulator, deterministic engine, auth, DB, state persistence, event log and visual feedback.
3. Fleet, routes/map, trips, passenger flow, diagnostics, alerts, maintenance.
4. 2D assets + optional optimized GLB viewer and interaction; mobile fallback.
5. AI camera inspection and AI assistant with explicit reliability limitations.
6. Testing/QA: unit, API integration, mobile/desktop E2E, performance, accessibility; screenshot evidence; deployment.
7. Thesis update & presentation mode, ER/architecture diagrams and evidence.

## REQUIRED PROJECT OUTPUTS
- Working responsive application; verified buttons, forms, scan, reports and navigation
- Database schema and seed migrations; `.env.example` (no credentials)
- `/docs/ARCHITECTURE.md`, `/docs/IMPLEMENTATION_STATUS.md`, `/docs/TEST_CASES.md`, `/docs/DEMO_SCRIPT.md`, `/docs/IMAGE_ASSET_PROMPTS.md`
- Before/after screenshots for desktop/tablet/mobile; evidence for each major functionality
- README instructions for local install, environment setup and deployed limitations

## AGENT EXECUTION INSTRUCTION (PASTE INTO ANTIGRAVITY)
You are the lead product architect, senior frontend/backend engineer, 3D technical artist, accessibility tester and academic demo specialist for NEBULA TRANSIT. Use the entire specification in this file. First inspect my EXISTING REPOSITORY; preserve all existing academic content and authored work. Make a baseline and implementation plan. Implement phase by phase, then actually run build, tests and browser checks after each phase. Prefer working end-to-end functionality over decorative visuals. Use only licensed/properly generated imagery; create 2D asset prompts if image/3D generator is not available; never claim that a 2D image is a GLB. Label simulated telemetry clearly. Keep control commands simulated with safety interlocks. At the end, provide a feature checklist marking VERIFIED WORKING vs DEMO SIMULATED vs NOT IMPLEMENTED, known issues, test evidence and thesis demo guide. Do not rewrite the entire project blindly or expose API keys.
