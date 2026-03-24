import { motion, AnimatePresence } from "framer-motion"

export default function Overlay({
  sections,
  activeIndex,
  setActiveIndex,
  selectedItemIndex,
  setSelectedItemIndex,
  isSleeveOpen,
  setIsSleeveOpen
}) {
  const active = sections[activeIndex]
  const hasItems = Array.isArray(active.items) && active.items.length > 0
  const selectedItem = hasItems ? active.items[selectedItemIndex] : null

  return (
    <div className="overlay">
      <div className="hud-top">
        <div className="brand-block">
          <p className="eyebrow">NOW PLAYING</p>
          <h1 className="artist-name">Ananya Asthana</h1>
          <p className="subline">{active.subtitle}</p>
        </div>

        <div className="top-actions">
          <a href={`${import.meta.env.BASE_URL}resume.pdf`} download className="resume-btn">
            Download Resume
          </a>
        </div>
      </div>

      <div className="hud-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active.id}-${selectedItemIndex}`}
            className="info-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="meta-row">
              <span>{active.side}</span>
              <span>{active.track}</span>
              <span>{hasItems ? selectedItem?.period || active.duration : active.duration}</span>
            </div>

            <h2 className="section-title">{active.title.toUpperCase()}</h2>

            <div className="mini-wave">
              {Array.from({ length: 22 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>

            <div className="tag-row">
              {active.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

           <div className="panel-scroll">
            <div className="body-copy">
              {hasItems ? (
                <>
                  <div className="feature-card">
                    <div className="feature-kicker">{selectedItem?.subtitle || ""}</div>
                    <div className="feature-title">{selectedItem?.title || ""}</div>
                  </div>

                  <div className="item-summary">
                    {selectedItem?.summary || ""}
                  </div>

                  {(selectedItem?.details || []).map((detail, idx) => (
                    <div key={idx} className="content-card">
                      {detail}
                    </div>
                  ))}

                  {!!selectedItem?.stack?.length && (
                    <div className="item-stack">
                      {selectedItem.stack.map((tech) => (
                        <span key={tech} className="tech-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  

                  <div className="item-track-row">
                    {active.items.map((item, idx) => (
                      <button
                        key={item.title}
                        type="button"
                        className={`item-track ${idx === selectedItemIndex ? "active" : ""}`}
                        onClick={() => {
                          if (idx !== selectedItemIndex) {
                            setIsSleeveOpen(false)
                            setSelectedItemIndex(idx)
                          }
                        }}
                      >
                        <span className="item-track-no">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="item-track-title">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                active.links ? (
                  active.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      className="content-card contact-link-card"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <div className="contact-label">{link.label}</div>
                      <div className="contact-value">{link.value}</div>
                    </a>
                  ))
                ) : (
                  active.content.map((item, idx) => (
                    <div key={idx} className="content-card">
                      {item}
                    </div>
                  ))
                )
              )}
            </div>
          </div> 
            <div className="track-controls">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + sections.length) % sections.length)
                }
              >
                ◀ Previous Track
              </button>

              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % sections.length)
                }
              >
                Next Track ▶
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}