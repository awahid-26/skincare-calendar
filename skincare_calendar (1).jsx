import { useState } from "react";

const WEDDING_DATE = new Date(2026, 9, 25); // Oct 25 - adjustable
const START_DATE = new Date(2026, 4, 17); // May 17

// Key milestone dates (relative to wedding)
const getWeddingMilestones = (weddingDate) => {
  const d = (days) => {
    const date = new Date(weddingDate);
    date.setDate(date.getDate() - days);
    return date;
  };
  return {
    stopIPL: d(42),        // 6 weeks before
    stopActives: d(14),    // 2 weeks before
    lastWax: d(7),         // 1 week before
    wedding: weddingDate,
  };
};

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const MONTH_INDICES = [4, 5, 6, 7, 8, 9]; // 0-indexed months

const getDayRoutine = (date, milestones) => {
  const dow = date.getDay(); // 0=Sun
  const isPast = date < new Date(2026, 4, 17);
  const isWedding = date.toDateString() === milestones.wedding.toDateString();
  const afterWedding = date > milestones.wedding;
  const isStopIPL = date >= milestones.stopIPL && date < milestones.stopActives;
  const isStopActives = date >= milestones.stopActives && date < milestones.lastWax;
  const isLastWeek = date >= milestones.lastWax && date < milestones.wedding;

  if (isWedding) return { type: "wedding", label: "💍 Wedding Day!", color: "#c9a96e" };
  if (afterWedding) return null;

  // Phases
  if (isLastWeek) {
    if (dow === 0) return { type: "wax", label: "Wax only (no IPL)", color: "#f4a9c0" };
    return { type: "barrier", label: "Barrier + SPF only", color: "#e8d5f0" };
  }

  if (isStopActives) {
    if (dow === 0) return { type: "wax", label: "Wax only (no IPL)", color: "#f4a9c0" };
    if (dow === 2 || dow === 4 || dow === 6) return { type: "solawave", label: "Hydrate + Solawave", color: "#b8e4f9" };
    return { type: "hydrate", label: "Hydration focus", color: "#e8d5f0" };
  }

  if (isStopIPL) {
    if (dow === 0) return { type: "wax", label: "Wax only (no IPL)", color: "#f4a9c0" };
    if (dow === 3) return { type: "retinol", label: "Retinol night", color: "#ffd6a5" };
    if (dow === 5) return { type: "aha", label: "AHA/BHA night", color: "#ffb3b3" };
    if (dow === 2 || dow === 4 || dow === 6) return { type: "solawave", label: "Solawave", color: "#b8e4f9" };
    return { type: "hydrate", label: "Hydration", color: "#e8d5f0" };
  }

  // Regular weeks
  if (dow === 0) return { type: "wax", label: "Wax + IPL", color: "#f4a9c0" };
  if (dow === 1) return { type: "recovery", label: "Recovery", color: "#e8d5f0" };
  if (dow === 2) return { type: "ease", label: "Ease in + Solawave", color: "#b8e4f9" };
  if (dow === 3) return { type: "retinol", label: "Retinol night", color: "#ffd6a5" };
  if (dow === 4) return { type: "hydrate", label: "Hydrate + Solawave", color: "#b8e4f9" };
  if (dow === 5) return { type: "aha", label: "AHA/BHA night", color: "#ffb3b3" };
  if (dow === 6) return { type: "solawave", label: "Barrier + Solawave", color: "#b8e4f9" };
  return null;
};

const typeColors = {
  wax: { bg: "#fce4ec", text: "#880e4f", dot: "#e91e8c" },
  recovery: { bg: "#f3e5f5", text: "#4a148c", dot: "#9c27b0" },
  ease: { bg: "#e3f2fd", text: "#0d47a1", dot: "#2196f3" },
  retinol: { bg: "#fff8e1", text: "#e65100", dot: "#ff9800" },
  hydrate: { bg: "#e8f5e9", text: "#1b5e20", dot: "#4caf50" },
  aha: { bg: "#fbe9e7", text: "#bf360c", dot: "#ff5722" },
  solawave: { bg: "#e1f5fe", text: "#01579b", dot: "#03a9f4" },
  barrier: { bg: "#f3e5f5", text: "#4a148c", dot: "#ce93d8" },
  wedding: { bg: "#fff9c4", text: "#f57f17", dot: "#c9a96e" },
};

const phaseLabels = [
  { label: "Full Routine Phase", color: "#e8f5e9", border: "#4caf50" },
  { label: "No IPL (6 wks out)", color: "#fff8e1", border: "#ff9800" },
  { label: "No Actives (2 wks out)", color: "#fce4ec", border: "#e91e8c" },
  { label: "Barrier Only (1 wk out)", color: "#f3e5f5", border: "#9c27b0" },
];

export default function SkincareCalendar() {
  const [weddingDate, setWeddingDate] = useState("2026-10-25");
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeMonth, setActiveMonth] = useState(4);

  const parsedWedding = new Date(weddingDate + "T12:00:00");
  const milestones = getWeddingMilestones(parsedWedding);

  const renderMonth = (monthIndex) => {
    const year = 2026;
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startPad = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, monthIndex, d));
    }

    return days;
  };

  const getPhaseBackground = (date, milestones) => {
    if (!date) return "transparent";
    if (date >= milestones.lastWax && date <= milestones.wedding) return "#fdf0ff";
    if (date >= milestones.stopActives && date < milestones.lastWax) return "#fff5f5";
    if (date >= milestones.stopIPL && date < milestones.stopActives) return "#fffdf0";
    return "transparent";
  };

  const getDaysUntilWedding = () => {
    const today = new Date(2026, 4, 17);
    const diff = Math.ceil((parsedWedding - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const monthName = (idx) => ["January","February","March","April","May","June","July","August","September","October","November","December"][idx];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "linear-gradient(135deg, #fdf4ff 0%, #fff0f8 50%, #f0f8ff 100%)",
      minHeight: "100vh",
      padding: "24px 16px",
      color: "#2d1b2e"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#c9a96e", textTransform: "uppercase", marginBottom: 6 }}>
          Bridal Glow Countdown
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#2d1b2e", letterSpacing: -1 }}>
          Skincare Calendar
        </h1>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
          May 17 → Your Wedding Day
        </div>

        {/* Wedding date picker */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <label style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase" }}>Wedding Date:</label>
          <input
            type="date"
            value={weddingDate}
            min="2026-10-01"
            max="2026-10-31"
            onChange={e => setWeddingDate(e.target.value)}
            style={{
              border: "1.5px solid #c9a96e",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 14,
              background: "white",
              color: "#2d1b2e",
              fontFamily: "Georgia, serif"
            }}
          />
          <div style={{
            background: "#c9a96e",
            color: "white",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 600
          }}>
            {getDaysUntilWedding()} days to go ✨
          </div>
        </div>
      </div>

      {/* Key Milestone Banner */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 24,
        boxShadow: "0 2px 16px rgba(201,169,110,0.12)",
        border: "1px solid #f0e0d0"
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#c9a96e", textTransform: "uppercase", marginBottom: 12 }}>Key Dates</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            { label: "Last IPL", date: milestones.stopIPL, emoji: "🔴" },
            { label: "Stop Actives", date: milestones.stopActives, emoji: "⚠️" },
            { label: "Last Wax", date: milestones.lastWax, emoji: "✨" },
            { label: "Wedding Day", date: milestones.wedding, emoji: "💍" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <div style={{ fontSize: 18 }}>{m.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2d1b2e" }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {m.date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {MONTH_INDICES.map(mi => (
          <button
            key={mi}
            onClick={() => setActiveMonth(mi)}
            style={{
              flex: "0 0 auto",
              padding: "8px 16px",
              borderRadius: 20,
              border: activeMonth === mi ? "2px solid #c9a96e" : "2px solid #e0d0e8",
              background: activeMonth === mi ? "#c9a96e" : "white",
              color: activeMonth === mi ? "white" : "#666",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              transition: "all 0.2s"
            }}
          >
            {monthName(mi).slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "20px 16px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
        marginBottom: 20
      }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#2d1b2e" }}>
          {monthName(activeMonth)} 2026
        </h2>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 6 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1, padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {renderMonth(activeMonth).map((date, i) => {
            if (!date) return <div key={i} />;
            const routine = getDayRoutine(date, milestones);
            const isToday = date.toDateString() === new Date(2026, 4, 17).toDateString();
            const isFuturePast = date < new Date(2026, 4, 17);
            const tc = routine ? typeColors[routine.type] : null;

            return (
              <div
                key={i}
                onClick={() => routine && setSelectedDay({ date, routine })}
                style={{
                  borderRadius: 8,
                  padding: "6px 4px",
                  minHeight: 56,
                  background: isFuturePast ? "#f9f9f9" : tc ? tc.bg : "#fafafa",
                  border: isToday ? "2px solid #c9a96e" : routine?.type === "wedding" ? "2px solid #c9a96e" : "1px solid #f0e8f0",
                  cursor: routine ? "pointer" : "default",
                  opacity: isFuturePast ? 0.4 : 1,
                  transition: "transform 0.15s",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => { if(routine) e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isToday ? "#c9a96e" : "#444",
                  marginBottom: 3
                }}>{date.getDate()}</div>
                {routine && (
                  <div style={{
                    fontSize: 9,
                    color: tc?.text,
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}>
                    {routine.label}
                  </div>
                )}
                {isToday && (
                  <div style={{
                    position: "absolute", top: 2, right: 4,
                    fontSize: 8, color: "#c9a96e", fontWeight: 800
                  }}>TODAY</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "20px",
          boxShadow: "0 4px 24px rgba(201,169,110,0.2)",
          border: "1.5px solid #c9a96e",
          marginBottom: 20
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#c9a96e", textTransform: "uppercase" }}>
                {selectedDay.date.toLocaleDateString("en-CA", { weekday: "long" })}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {selectedDay.date.toLocaleDateString("en-CA", { month: "long", day: "numeric" })}
              </div>
            </div>
            <button onClick={() => setSelectedDay(null)} style={{
              background: "#f0e8f0", border: "none", borderRadius: "50%",
              width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#888"
            }}>✕</button>
          </div>

          <RoutineDetail type={selectedDay.routine.type} date={selectedDay.date} milestones={milestones} />
        </div>
      )}

      {/* Legend */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "16px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#c9a96e", textTransform: "uppercase", marginBottom: 12 }}>Legend</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(typeColors).map(([type, c]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: c.bg, border: `2px solid ${c.dot}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", textTransform: "capitalize" }}>
                {type === "aha" ? "AHA/BHA night" : type === "wax" ? "Wax + IPL day" : type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoutineDetail({ type, date, milestones }) {
  // Vitamin C phase logic
  const getVitCLabel = (date) => {
    if (!date) return "Vitamin C serum";
    const aug1 = new Date(2026, 7, 1);
    const stopActives = milestones.stopActives;
    if (date >= stopActives) return "Klairs Vitamin Drop 5% ← gentlest for final stretch";
    if (date >= aug1) return "GOODAL Green Tangerine Vitamin C ← upgraded from Aug";
    return "Klairs Freshly Juiced Vitamin Drop 5% ← build tolerance now";
  };

  const getVitCBadge = (date) => {
    if (!date) return null;
    const aug1 = new Date(2026, 7, 1);
    const stopActives = milestones.stopActives;
    if (date >= stopActives) return { label: "Phase 3 — Barrier mode: Klairs 5% only", color: "#f3e5f5", border: "#9c27b0" };
    if (date >= aug1) return { label: "Phase 2 — Upgraded: GOODAL Green Tangerine", color: "#e8f5e9", border: "#4caf50" };
    return { label: "Phase 1 — Building tolerance: Klairs 5%", color: "#e3f2fd", border: "#2196f3" };
  };

  const vitCLabel = getVitCLabel(date);
  const vitCBadge = getVitCBadge(date);

  const injectVitC = (steps) => steps.map(s =>
    s.startsWith("Vitamin C") ? vitCLabel : s
  );

  const routines = {
    wax: {
      emoji: "🪮",
      title: "Wax + IPL Day",
      morning: ["Pyunkang Yul Cleansing Foam (gentle)", "Plain moisturizer", "SPF"],
      evening: ["Wax (upper lip, brows, forehead)", "Hypochlorous acid spray on waxed areas — let air dry", "Wait 30–60 min", "IPL (sideburns only)", "Hypochlorous acid spray again after IPL — let air dry", "Plain moisturizer only — no actives, no serums", "Aquaphor (thin layer to seal everything in)"],
      note: "Hypochlorous acid is antimicrobial and anti-inflammatory — perfect for open follicles after waxing and IPL. Aquaphor on waxed areas tonight is especially soothing. No serums, no actives, no Solawave today.",
    },
    recovery: {
      emoji: "💧",
      title: "Recovery Day",
      morning: ["Hypochlorous acid spray on waxed areas — let air dry", "Pyunkang Yul Cleansing Foam (gentle)", "BoJ serum", "Eye cream", "Dr. Althea cream", "SPF"],
      evening: ["Gentle cleanse", "BoJ serum", "Barrier Support Serum", "COSRX Snail Peptide Eye Cream", "Dr. Althea cream", "Aquaphor (thin layer — seals in all layers underneath)"],
      note: "Skin is still recovering from wax + IPL. Hypochlorous acid in the morning helps prevent post-wax breakouts. Aquaphor at the end locks in your barrier serum and moisturizer overnight.",
    },
    ease: {
      emoji: "✨",
      title: "Ease Back In + Solawave",
      morning: ["Cleanse", "Vitamin C serum (AM only)", "Beauty of Joseon serum", "Moisturizer", "SPF"],
      evening: ["Double cleanse", "BoJ serum", "Barrier Support Serum", "COSRX Snail Peptide Eye Cream", "Solawave wand", "Dr. Althea cream", "Aquaphor (final seal)"],
      note: "Vitamin C goes first in the morning — always use before SPF for maximum brightening and antioxidant protection. Gentle re-introduction after wax recovery.",
    },
    retinol: {
      emoji: "🌙",
      title: "Retinol Night (Sandwich Method)",
      morning: ["Cleanse", "Vitamin C serum", "BoJ serum", "Eye cream", "Moisturizer", "SPF"],
      evening: ["Double cleanse", "Wait 20 min (let skin fully dry)", "Retinol (avoid waxed zones: forehead, upper lip, brows)", "Wait 20 min", "Barrier Support Serum ← buffers retinol irritation", "P+ Wrinkle Lift Eye Serum ← retinol eye, use only tonight", "Dr. Althea cream", "Aquaphor (final seal — locks in retinol benefits)"],
      note: "Retinol sandwich: Barrier Serum over retinol reduces irritation. Aquaphor on top locks it all in. Vitamin C in the AM + retinol at night = powerful brightening combo for your wedding glow.",
    },
    hydrate: {
      emoji: "🌿",
      title: "Hydration + Solawave",
      morning: ["Cleanse", "Vitamin C serum", "BoJ serum", "Eye cream", "Moisturizer", "SPF"],
      evening: ["Double cleanse", "BoJ serum", "Barrier Support Serum", "COSRX Snail Peptide Eye Cream", "Solawave wand", "Dr. Althea cream", "Aquaphor (final seal)"],
      note: "Recovery night after retinol. Aquaphor seals in all the hydration overnight — you'll wake up with plump, dewy skin.",
    },
    aha: {
      emoji: "⚗️",
      title: "AHA/BHA Night",
      morning: ["Gentle cleanse", "Vitamin C serum", "Light moisturizer", "Heavy SPF (skin will be sensitive)"],
      evening: ["Double cleanse", "AHA/BHA 30% (10–15 mins, rinse off)", "COSRX Snail Peptide Eye Cream (eye area only — skip actives here)", "Plain moisturizer only — no other serums", "Aquaphor (thin layer to protect freshly exfoliated skin)"],
      note: "Never use AHA/BHA the same night as retinol. Aquaphor after exfoliation helps protect the fresh skin underneath. SPF is critical the next morning.",
    },
    solawave: {
      emoji: "🔆",
      title: "Barrier + Solawave Day",
      morning: ["Cleanse", "Vitamin C serum", "BoJ serum", "Eye cream", "Moisturizer", "SPF"],
      evening: ["Double cleanse", "BoJ serum", "COSRX Snail Peptide Eye Cream", "Solawave wand", "Dr. Althea cream", "Aquaphor (final seal)"],
      note: "Light buffer day before Sunday wax. Vitamin C in the AM boosts your SPF protection going into the weekend.",
    },
    barrier: {
      emoji: "🛡️",
      title: "Barrier Focus Only",
      morning: ["Gentle cleanse", "Vitamin C serum", "BoJ serum", "Dr. Althea cream", "SPF"],
      evening: ["Gentle cleanse", "BoJ serum", "Barrier Support Serum", "COSRX Snail Peptide Eye Cream", "Dr. Althea cream", "Aquaphor (final seal — your skin's best friend this week)"],
      note: "No actives at all this close to the wedding. Vitamin C is safe to keep in the AM. Aquaphor + Barrier Serum every night this week = maximum plumpness for the big day.",
    },
    wedding: {
      emoji: "💍",
      title: "Wedding Day!",
      morning: ["Gentle cleanse", "Vitamin C serum", "BoJ serum", "COSRX Snail Peptide Eye Cream", "Dr. Althea cream", "SPF"],
      evening: [],
      note: "You've done the work. Today just glow! 🥂",
    },
  };

  const r = routines[type] || routines.recovery;

  return (
    <div>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{r.emoji} <strong>{r.title}</strong></div>

      {vitCBadge && type !== "wax" && (
        <div style={{
          display: "inline-block",
          background: vitCBadge.color,
          border: `1.5px solid ${vitCBadge.border}`,
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 700,
          color: vitCBadge.border,
          marginBottom: 10,
          letterSpacing: 0.5
        }}>💊 {vitCBadge.label}</div>
      )}

      <div style={{
        background: "#fff9f0",
        borderLeft: "3px solid #c9a96e",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 12,
        color: "#666",
        marginBottom: 14,
        fontStyle: "italic"
      }}>{r.note}</div>

      {r.morning.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#c9a96e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>☀️ Morning</div>
          <ol style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: 13, color: "#444", lineHeight: 1.9 }}>
            {injectVitC(r.morning).map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </>
      )}

      {r.evening.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6a4c93", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>🌙 Evening</div>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#444", lineHeight: 1.9 }}>
            {r.evening.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </>
      )}
    </div>
  );
}
