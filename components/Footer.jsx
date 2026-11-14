import React from "react";
import styles from "./Footer.module.css";
import { AwardIcon, ShieldIcon, RadioIcon, SparklesIcon, BookOpenIcon, BusIcon } from "./icons/Icons";

export default function Footer({ onOpenAbout, onSelectView }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.mainRow}>
          <div className={styles.brandSection}>
            <div className={styles.brandTitle}>
              <span className={styles.brandDot} />
              <span className={styles.brandName}>NEBULA TRANSIT &bull; Smart Mobility Intelligence &bull; Bus Connected</span>
            </div>
            <p className={styles.attribution}>
              Designed &amp; Engineered by <strong>Ayesha Batool</strong> - Roll No: <strong>M245004</strong>
            </p>
            <p className={styles.institution}>
              Department of Computer Science &bull; Gomal University, Faisalabad &bull; Supervised by Mam Mehwish
            </p>
          </div>

          <div className={styles.actionsSection}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusPulse} />
              <RadioIcon size={14} className={styles.statusIcon} />
              <span className={styles.statusText}>Simulated Telemetry Engine Online</span>
            </div>

            <div className={styles.navLinks}>
              <button
                type="button"
                className={styles.footerLink}
                onClick={onOpenAbout}
                aria-label="View Project Credits & Specifications"
              >
                <AwardIcon size={14} />
                <span>Project Credits</span>
              </button>
              {onSelectView && (
                <>
                  <button
                    type="button"
                    className={styles.footerLink}
                    onClick={() => onSelectView("thesis")}
                    aria-label="View Thesis Documentation"
                  >
                    <BookOpenIcon size={14} />
                    <span>Thesis Document</span>
                  </button>
                  <button
                    type="button"
                    className={styles.footerLink}
                    onClick={() => onSelectView("fleet")}
                    aria-label="Open Fleet Simulator"
                  >
                    <BusIcon size={14} />
                    <span>Fleet Control Room</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.copyText}>
            &copy; {currentYear} Ayesha Batool (M245004). Bachelor of Science in Computer Science Academic Thesis Project.
          </span>
          <div className={styles.badgeRow}>
            <span className={styles.techBadge}>Industrial Tech UI</span>
            <span className={styles.techBadge}>Simulated IoT Telemetry</span>
            <span className={styles.techBadge}>Safety Interlock Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
