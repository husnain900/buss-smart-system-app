import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AboutModal.module.css";
import {
  AwardIcon,
  XIcon,
  CheckIcon,
  ShieldIcon,
  BusIcon,
  CarIcon,
  MapPinIcon,
  CreditCardIcon,
  UserCheckIcon,
  RadioIcon
} from "./icons/Icons";

export default function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerTitleWrap}>
                <div className={styles.badge}>
                  <AwardIcon size={14} />
                  <span>Academic Thesis &amp; Engineering Project</span>
                </div>
                <h2 id="modal-title" className={styles.title}>
                  NEBULA TRANSIT &bull; Smart Bus Fleet Platform
                </h2>
                <p className={styles.subtitle}>
                  Gomal University Faisalabad &bull; Department of Computer Science (Class of 2026)
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close modal"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.developerCard}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar}>AB</div>
                  <div className={styles.onlineStatus} title="System Active" />
                </div>
                <div className={styles.devInfo}>
                  <span className={styles.devRole}>Lead Architect &amp; Software Engineer</span>
                  <h3 className={styles.devName}>Ayesha Batool</h3>
                  <div className={styles.devRoll}>
                    Roll Number: <strong>M245004</strong>
                  </div>
                  <p className={styles.devDegree}>
                    Bachelor of Science in Computer Science (BSCS) &bull; Class of 2026
                  </p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Project Supervisor</span>
                  <span className={styles.detailValue}>Mam Mehwish</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Department</span>
                  <span className={styles.detailValue}>Department of Computer Science</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Institution</span>
                  <span className={styles.detailValue}>Gomal University, Faisalabad</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Project Status</span>
                  <span className={styles.statusPill}>
                    <CheckIcon size={12} />
                    Verified &amp; Evaluated
                  </span>
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <h4>Enterprise Core Architecture</h4>
              </div>

              <div className={styles.modulesGrid}>
                <div className={styles.moduleCard}>
                  <div className={styles.moduleIcon}>
                    <MapPinIcon size={16} />
                  </div>
                  <div>
                    <h5>Real-Time GPS Tracking</h5>
                    <p>Live vector waypoint route tracking with dynamic ETA &amp; telematics.</p>
                  </div>
                </div>

                <div className={styles.moduleCard}>
                  <div className={styles.moduleIcon}>
                    <UserCheckIcon size={16} />
                  </div>
                  <div>
                    <h5>Smart RFID Roll Call</h5>
                    <p>Contactless passenger attendance scanning with timestamps.</p>
                  </div>
                </div>

                <div className={styles.moduleCard}>
                  <div className={styles.moduleIcon}>
                    <CreditCardIcon size={16} />
                  </div>
                  <div>
                    <h5>Digital QR Ticketing</h5>
                    <p>Fare calculation, boarding pass generation &amp; validation.</p>
                  </div>
                </div>

                <div className={styles.moduleCard}>
                  <div className={styles.moduleIcon}>
                    <RadioIcon size={16} />
                  </div>
                  <div>
                    <h5>IoT Fleet Telemetry</h5>
                    <p>Remote ignition, climate control, speed sensing &amp; SOS alerts.</p>
                  </div>
                </div>
              </div>

              <div className={styles.techStack}>
                <span className={styles.techTag}>Next.js 16</span>
                <span className={styles.techTag}>React 19</span>
                <span className={styles.techTag}>Framer Motion</span>
                <span className={styles.techTag}>GSAP Physics</span>
                <span className={styles.techTag}>Web Audio API</span>
                <span className={styles.techTag}>Pure SVG Icons</span>
                <span className={styles.techTag}>Responsive Glassmorphism</span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.footerNote}>
                Designed &amp; Engineered by <strong>Ayesha Batool</strong> (Roll No: <strong>M245004</strong>)
              </span>
              <button className={styles.primaryBtn} onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

