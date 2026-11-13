"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { thesisData } from "../app/thesisData";
import styles from "./ThesisReader.module.css";
import {
  BookOpenIcon,
  AwardIcon,
  FileTextIcon,
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  CreditCardIcon,
  SearchIcon,
  UserCheckIcon,
  ShieldIcon,
  ActivityIcon,
  PlayIcon,
  CheckIcon,
  SparklesIcon
} from "./icons/Icons";

export default function ThesisReader({ onTriggerSimulation, onOpenAbout }) {
  const [activeTab, setActiveTab] = useState("cover");
  const [searchQuery, setSearchQuery] = useState("");

  const getSectionIcon = (id) => {
    switch (id) {
      case "1.1": return <BookOpenIcon size={16} />;
      case "1.2": return <ClockIcon size={16} />;
      case "1.3": return <ShieldIcon size={16} />;
      case "1.5": return <ActivityIcon size={16} />;
      case "3.1": return <PlayIcon size={16} />;
      default: return <BookOpenIcon size={16} />;
    }
  };

  const getInteractiveFeature = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("real-time gps tracking") || lower.includes("live bus tracking") || lower.includes("real-time bus tracking")) {
      return { id: "gps", name: "Simulate Live Tracking", icon: <MapPinIcon size={12} /> };
    }
    if (lower.includes("emergency alert") || lower.includes("emergency response") || lower.includes("hazard")) {
      return { id: "emergency", name: "Simulate Emergency Alert", icon: <ShieldIcon size={12} /> };
    }
    if (lower.includes("digital ticketing") || lower.includes("ticket booking") || lower.includes("smart ticketing")) {
      return { id: "ticketing", name: "Simulate Ticket Scan", icon: <CreditCardIcon size={12} /> };
    }
    if (lower.includes("attendance monitoring") || lower.includes("attendance scanner") || lower.includes("smart attendance")) {
      return { id: "attendance", name: "Simulate Student Scan", icon: <UserCheckIcon size={12} /> };
    }
    return null;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];

    thesisData.chapters.forEach((ch) => {
      ch.sections.forEach((sec) => {
        if (sec.title.toLowerCase().includes(query) || sec.content.toLowerCase().includes(query)) {
          results.push({
            type: "chapter",
            tabId: ch.id,
            sectionId: sec.id,
            chapterTitle: `Chapter ${ch.number} - ${ch.title}`,
            sectionTitle: sec.title,
            content: sec.content
          });
        }
      });
    });

    ["declaration", "certificate", "acknowledgments"].forEach((item) => {
      const doc = thesisData[item];
      if (doc.title.toLowerCase().includes(query) || doc.content.toLowerCase().includes(query)) {
        results.push({
          type: "static",
          tabId: item,
          sectionId: item,
          chapterTitle: "Preliminary",
          sectionTitle: doc.title,
          content: doc.content
        });
      }
    });

    return results;
  }, [searchQuery]);

  const selectSearchResult = (item) => {
    setActiveTab(item.tabId);
    setSearchQuery("");
    setTimeout(() => {
      const element = document.getElementById(`sec-${item.sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const activeContent = useMemo(() => {
    if (activeTab === "cover") return null;
    if (activeTab === "declaration") return thesisData.declaration;
    if (activeTab === "certificate") return thesisData.certificate;
    if (activeTab === "acknowledgments") return thesisData.acknowledgments;
    return thesisData.chapters.find((ch) => ch.id === activeTab);
  }, [activeTab]);

  return (
    <div className={styles.readerContainer}>
      <aside className={styles.sidebar} aria-label="Thesis Navigation Sidebar">
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Thesis Portal</h3>
          <span className={styles.sidebarSubtitle}>Bus Smart System Application</span>
        </div>

        <div className={styles.searchWrapper}>
          <div style={{ position: "relative" }}>
            <SearchIcon
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <input
              type="text"
              placeholder="Search thesis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              style={{ paddingLeft: "36px" }}
              aria-label="Search thesis contents"
            />
          </div>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Thesis Preliminary</span>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "cover" ? styles.activeNavItem : ""}`}
              onClick={() => { setActiveTab("cover"); setSearchQuery(""); }}
            >
              <AwardIcon size={15} style={{ marginRight: "8px" }} />
              Thesis Title Cover
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "declaration" ? styles.activeNavItem : ""}`}
              onClick={() => { setActiveTab("declaration"); setSearchQuery(""); }}
            >
              <FileTextIcon size={15} style={{ marginRight: "8px" }} />
              Declaration
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "certificate" ? styles.activeNavItem : ""}`}
              onClick={() => { setActiveTab("certificate"); setSearchQuery(""); }}
            >
              <FileTextIcon size={15} style={{ marginRight: "8px" }} />
              Committee Certificate
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "acknowledgments" ? styles.activeNavItem : ""}`}
              onClick={() => { setActiveTab("acknowledgments"); setSearchQuery(""); }}
            >
              <HeartIcon size={15} style={{ marginRight: "8px" }} />
              Acknowledgments
            </button>
          </div>

          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Chapters</span>
            {thesisData.chapters.map((ch) => (
              <button
                type="button"
                key={ch.id}
                className={`${styles.navItem} ${activeTab === ch.id ? styles.activeNavItem : ""}`}
                onClick={() => { setActiveTab(ch.id); setSearchQuery(""); }}
              >
                <span className={styles.chapterNum}>Ch {ch.number}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ch.title}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <section className={styles.contentArea}>
        <div className={styles.contentWrapper}>
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="search-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className={styles.searchResultsTitle}>
                  Search Results for "{searchQuery}" ({searchResults.length})
                </h3>
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className={styles.searchResultItem}
                      onClick={() => selectSearchResult(item)}
                    >
                      <div className={styles.searchResultHeader}>
                        <span className={styles.searchResultTitleName}>{item.sectionTitle}</span>
                        <span className={styles.searchResultChapter}>{item.chapterTitle}</span>
                      </div>
                      <p className={styles.searchResultSnippet}>
                        {item.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptySearch}>
                    No matches found. Try keywords like "GPS", "ticketing", or "IoT".
                  </div>
                )}
              </motion.div>
            ) : activeTab === "cover" ? (
              <motion.div
                key="cover-page"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className={styles.coverContainer}
              >
                <div className={styles.coverBadge}>Gomal University Academic Thesis</div>
                <h1 className={styles.coverTitle}>{thesisData.title}</h1>
                <p className={styles.coverSubtitle}>
                  Thesis submitted in partial fulfillment of the requirements for the degree of Bachelor of Science in Computer Science
                </p>

                <div className={styles.metaBlock}>
                  <div>
                    <div className={styles.metaLabel}>Submitted By (Candidate)</div>
                    <div className={styles.metaValue}>{thesisData.author.name}</div>
                    <div className={styles.metaLabel} style={{ marginTop: "10px" }}>Roll Number</div>
                    <div className={styles.metaValue} style={{ color: "var(--accent-primary)" }}>
                      {thesisData.author.rollNumber}
                    </div>
                  </div>
                  <div>
                    <div className={styles.metaLabel}>Under Supervision Of</div>
                    <div className={styles.metaValue}>{thesisData.author.supervisor}</div>
                    <div className={styles.metaLabel} style={{ marginTop: "10px" }}>Department</div>
                    <div className={styles.metaValue}>{thesisData.author.department}</div>
                  </div>
                </div>

                <div className={styles.institutionBlock}>
                  <div>Class of {thesisData.author.year}</div>
                  <div className={styles.institutionUni}>{thesisData.author.university}</div>
                </div>

                {onOpenAbout && (
                  <button
                    type="button"
                    className={styles.interactiveBadge}
                    style={{ marginTop: "24px", padding: "8px 16px", fontSize: "0.85rem" }}
                    onClick={onOpenAbout}
                  >
                    <AwardIcon size={15} />
                    <span>View Engineer Attribution &amp; Credits</span>
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "declaration" || activeTab === "certificate" || activeTab === "acknowledgments" ? (
                  <div>
                    <div className={styles.docHeader}>
                      <h2 className={styles.docTitle}>{activeContent.title}</h2>
                      <span className={styles.docSub}>Preliminary Document</span>
                    </div>
                    <div className={styles.sectionContent}>
                      {activeContent.content}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.docHeader}>
                      <span className={styles.docSub}>Chapter {activeContent.number}</span>
                      <h2 className={styles.docTitle}>{activeContent.title}</h2>
                    </div>

                    {activeContent.sections.map((sec) => (
                      <div key={sec.id} id={`sec-${sec.id}`} className={styles.sectionBlock}>
                        <h3 className={styles.sectionTitle}>
                          {getSectionIcon(sec.id)}
                          <span>{sec.id} {sec.title}</span>
                        </h3>

                        <div className={styles.sectionContent}>
                          {sec.content.split("\n").map((line, lIdx) => {
                            if (line.startsWith("* ")) {
                              const feature = getInteractiveFeature(line);
                              return (
                                <li key={lIdx} style={{ marginLeft: "20px", marginBottom: "8px" }}>
                                  {line.replace("* ", "")}
                                  {feature && (
                                    <div>
                                      <button
                                        type="button"
                                        className={styles.interactiveBadge}
                                        onClick={() => onTriggerSimulation(feature.id)}
                                      >
                                        {feature.icon}
                                        <span>{feature.name}</span>
                                        <PlayIcon size={10} style={{ marginLeft: "2px" }} />
                                      </button>
                                    </div>
                                  )}
                                </li>
                              );
                            }

                            const featureInline = getInteractiveFeature(line);
                            return (
                              <p key={lIdx} style={{ marginBottom: "12px" }}>
                                {line}
                                {featureInline && line.length < 150 && (
                                  <span style={{ display: "block" }}>
                                    <button
                                      type="button"
                                      className={styles.interactiveBadge}
                                      onClick={() => onTriggerSimulation(featureInline.id)}
                                    >
                                      {featureInline.icon}
                                      <span>{featureInline.name}</span>
                                      <PlayIcon size={10} style={{ marginLeft: "2px" }} />
                                    </button>
                                  </span>
                                )}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
