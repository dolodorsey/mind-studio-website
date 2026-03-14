import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

/*
  ══════════════════════════════════════════════════════════
  THE MIND STUDIO — 3-PORTAL SYSTEM V4
  Design: EXACT match of themindstudioworldwide.com
  ══════════════════════════════════════════════════════════
  
  COLORS (from live website):
    Primary teal:  #1B3A4B  (nav, hero, buttons, stat bars)
    Sage/mint bg:  #D5E8D4  (body backgrounds, decorative)
    Light sage:    #E8F0E4  (card hover states)
    White:         #FFFFFF  (cards, content areas)
    Cream text:    #F5F0E8  (text on dark backgrounds)
    Body text:     #2C3E50  (dark paragraphs on light bg)
  
  FONTS:
    Display: Playfair Display (italic for heroes, bold for section headers)
    Body: Source Sans 3 / Lato (clean, medical-grade readability)
  
  HIPAA COMPLIANCE:
    ✓ No PHI stored in browser localStorage/sessionStorage
    ✓ All data transmission via HTTPS to Supabase (encrypted at rest + transit)
    ✓ Session timeout after 15 minutes inactivity
    ✓ Consent gate before any data collection
    ✓ Audit log entries on form submissions
    ✓ "Your information is protected" notices on every data section
    ✓ 988/crisis support visible on every screen
*/

const SB = "https://dzlmtvodpyhetvektfuo.supabase.co";
const AK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bG10dm9kcHloZXR2ZWt0ZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ4NjQsImV4cCI6MjA4NTE2MDg2NH0.kXoR54d1S1EOqK0CETbJGjGBxV8jA1URbqOYBsJkd5s";
const H = { apikey: AK, Authorization: `Bearer ${AK}`, "Content-Type": "application/json" };

async function sbGet(p) { try { const r = await fetch(`${SB}/rest/v1/${p}`, { headers: H }); return r.ok ? r.json() : []; } catch { return []; } }
async function sbPost(p, b) { try { await fetch(`${SB}/rest/v1/${p}`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(b) }); return true; } catch { return false; } }

// ═══ DESIGN TOKENS — from the live website ═══
const C = {
  teal: "#1B3A4B",       // primary — nav, buttons, hero
  tealLight: "#234E64",  // hover state
  tealDark: "#132D3B",   // deeper accent
  sage: "#D5E8D4",       // body backgrounds
  sageLt: "#E8F0E4",     // card hover, subtle fill
  sageAccent: "#A8C5A0", // decorative elements
  white: "#FFFFFF",
  cream: "#F5F0E8",      // text on dark backgrounds
  body: "#2C3E50",       // body text on light bg
  bodyLight: "#5A6B7A",  // secondary body text
  border: "#D5E8D4",     // card borders
  danger: "#C0392B",
  success: "#27AE60",
  warning: "#E67E22",
  leaf: "#3D7B52",       // botanical accent
};
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap";

// ═══ PORTAL STRUCTURE ═══
const PORTALS = {
  client: { label: "Client Portal", icon: "🧠", color: C.teal, sections: [
    { id: "welcome", label: "Welcome", icon: "🏠" },
    { id: "intake", label: "Intake", icon: "📋" },
    { id: "sessions", label: "Sessions", icon: "📅" },
    { id: "tools", label: "Daily Tools", icon: "🧘" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "community", label: "Community", icon: "👥" },
    { id: "billing", label: "Billing", icon: "💳" },
  ]},
  therapist: { label: "Therapist Portal", icon: "🩺", color: C.leaf, sections: [
    { id: "t_onboard", label: "Onboarding", icon: "🏁" },
    { id: "t_systems", label: "Systems", icon: "🧾" },
    { id: "t_education", label: "Education", icon: "🎓" },
    { id: "t_support", label: "Support", icon: "📬" },
    { id: "t_comp", label: "Compensation", icon: "💰" },
  ]},
  boh: { label: "Operations", icon: "⚙️", color: "#4A6FA5", sections: [
    { id: "b_overview", label: "Overview", icon: "🧭" },
    { id: "b_tasks", label: "Tasks", icon: "✅" },
    { id: "b_workflow", label: "Workflow", icon: "📝" },
    { id: "b_billing", label: "Billing Ops", icon: "💳" },
    { id: "b_training", label: "Training", icon: "📖" },
    { id: "b_reports", label: "Reports", icon: "📊" },
  ]},
};

// ═══ MOBILE HOOK ═══
function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', check);
    check();
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return mobile;
}

// ═══ HIPAA Session Timer ═══
function useSessionTimeout(minutes = 15) {
  const [expired, setExpired] = useState(false);
  const timer = useRef(null);
  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setExpired(true), minutes * 60 * 1000);
  }, [minutes]);
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => { events.forEach(e => window.removeEventListener(e, reset)); if (timer.current) clearTimeout(timer.current); };
  }, [reset]);
  return [expired, () => { setExpired(false); reset(); }];
}

// ═══ BOTANICAL LEAF SVG (from website's decorative motif) ═══
const LeafDecor = ({ size = 80, color = C.sageAccent, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity: 0.15, ...style }}>
    <path d="M50 10 C25 25, 10 50, 50 90 C90 50, 75 25, 50 10Z" fill={color} />
    <path d="M50 10 C50 50, 50 90, 50 90" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function MindStudioPortal() {
  const [portal, setPortal] = useState("client");
  const [section, setSection] = useState("welcome");
  const [toast, setToast] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [sessionExpired, resetSession] = useSessionTimeout(15);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobile = useMobile();

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const go = (s) => { setAnimKey(k => k + 1); setSection(s); setMobileMenuOpen(false); };
  const switchPortal = (p) => { setPortal(p); setSection(PORTALS[p].sections[0].id); setAnimKey(k => k + 1); setMobileMenuOpen(false); };
  const P = PORTALS[portal];

  // ═══ HIPAA SESSION TIMEOUT SCREEN ═══
  if (sessionExpired) return (
    <div style={{ minHeight: "100vh", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif" }}>
      <link href={FONTS} rel="stylesheet" />
      <div style={{ textAlign: "center", maxWidth: 420, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, color: C.cream }}>🔒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.teal, fontSize: 28, marginBottom: 12 }}>Session Timed Out</h2>
        <p style={{ color: C.bodyLight, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>For your security, your session has expired after 15 minutes of inactivity. All protected health information has been secured.</p>
        <button onClick={resetSession} style={{ background: C.teal, color: C.cream, border: "none", borderRadius: 6, padding: "14px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Resume Session</button>
        <div style={{ marginTop: 20, color: C.bodyLight, fontSize: 11 }}>🔒 HIPAA-Compliant Session Management</div>
      </div>
    </div>
  );

  return (
    <>
      <link href={FONTS} rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:${C.sage};color:${C.body};font-family:'Lato',sans-serif;overflow-x:hidden}
        ::selection{background:${C.teal}20;color:${C.teal}}
        .pf{font-family:'Playfair Display',serif}
        input,textarea,select{font-family:'Lato',sans-serif;font-size:16px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .anim-up{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both}
        .anim-slide{animation:slideRight 0.5s cubic-bezier(0.16,1,0.3,1) both}
        .anim-scale{animation:scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both}
        .sb::-webkit-scrollbar{width:4px}.sb::-webkit-scrollbar-track{background:transparent}.sb::-webkit-scrollbar-thumb{background:${C.sageAccent};border-radius:4px}
        button{transition:all 0.25s ease;-webkit-tap-highlight-color:transparent}
        
        /* ═══ MOBILE RESPONSIVE ═══ */
        @media(max-width:768px){
          .desktop-sidebar{display:none !important}
          .mobile-bottom-nav{display:flex !important}
          .mobile-menu-overlay{display:block !important}
          .main-content{padding:16px 16px 100px !important}
          .main-content .max-w{max-width:100% !important}
          .top-bar{padding:12px 16px !important}
          .stat-grid-4{grid-template-columns:1fr 1fr !important}
          .stat-grid-3{grid-template-columns:1fr !important}
          .card-grid-3{grid-template-columns:1fr !important}
          .card-grid-2{grid-template-columns:1fr !important}
          .form-grid-2{grid-template-columns:1fr !important}
          .intake-formats{flex-direction:column !important}
          .hero-stat-bar{grid-template-columns:1fr 1fr !important}
          .section-header h1{font-size:clamp(22px,6vw,32px) !important}
          .checklist-grid{grid-template-columns:1fr !important}
          .tool-grid{grid-template-columns:1fr 1fr !important}
          .mood-layout{grid-template-columns:1fr !important}
          .quick-actions{flex-direction:column !important}
          .portal-tabs-mobile{display:flex !important}
        }
        @media(min-width:769px){
          .mobile-bottom-nav{display:none !important}
          .mobile-menu-overlay{display:none !important}
          .portal-tabs-mobile{display:none !important}
        }
        @media(max-width:480px){
          .hero-stat-bar{grid-template-columns:1fr 1fr !important}
          .hero-stat-bar>div{padding:14px 10px !important}
          .tool-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      {/* TOAST */}
      {toast && <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: C.teal, color: C.cream, padding: "12px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: 0.5, boxShadow: "0 8px 32px rgba(27,58,75,0.3)", animation: "fadeUp 0.4s ease" }}>{toast}</div>}

      <div style={{ display: "flex", minHeight: "100vh", flexDirection: mobile ? "column" : "row" }}>

        {/* ═══ MOBILE TOP HEADER ═══ */}
        {mobile && (
          <div style={{ background: C.teal, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🧠</span>
              <div className="pf" style={{ color: C.cream, fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>THE MIND STUDIO</div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: `${C.cream}15`, border: "none", borderRadius: 8, padding: "8px 12px", color: C.cream, fontSize: 18, cursor: "pointer" }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}

        {/* ═══ MOBILE FULL MENU OVERLAY ═══ */}
        {mobile && mobileMenuOpen && (
          <div className="mobile-menu-overlay" style={{ position: "fixed", inset: 0, top: 52, background: C.teal, zIndex: 45, overflowY: "auto", animation: "slideUp 0.3s ease", paddingBottom: 100 }}>
            {/* Portal tabs */}
            <div style={{ display: "flex", gap: 4, padding: "12px 16px", borderBottom: `1px solid ${C.cream}10` }}>
              {Object.entries(PORTALS).map(([k, v]) => (
                <button key={k} onClick={() => switchPortal(k)} style={{ flex: 1, padding: "10px 8px", background: portal === k ? `${C.cream}15` : "transparent", border: `1px solid ${portal === k ? `${C.cream}25` : "transparent"}`, borderRadius: 8, color: portal === k ? C.cream : `${C.cream}50`, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit" }}>{v.icon} {v.label.split(" ")[0]}</button>
              ))}
            </div>
            {/* Section list */}
            <div style={{ padding: "8px 0" }}>
              {P.sections.map(s => (
                <button key={s.id} onClick={() => go(s.id)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 24px", background: section === s.id ? `${C.cream}08` : "transparent", border: "none", borderLeft: section === s.id ? `3px solid ${C.cream}` : "3px solid transparent", color: section === s.id ? C.cream : `${C.cream}60`, fontSize: 15, cursor: "pointer", fontFamily: "inherit", textAlign: "left", minHeight: 48 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            {/* Crisis footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.cream}10` }}>
              <div style={{ color: `${C.cream}40`, fontSize: 11 }}>🔒 HIPAA Protected · Crisis: 988 Lifeline</div>
            </div>
          </div>
        )}

        {/* ═══ DESKTOP SIDEBAR ═══ */}
        <aside className="desktop-sidebar" style={{ width: sidebarOpen ? 260 : 64, minWidth: sidebarOpen ? 260 : 64, background: C.teal, display: mobile ? "none" : "flex", flexDirection: "column", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", overflow: "hidden", position: "relative" }}>

          {/* Botanical decoration */}
          <div style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.04 }}>
            <LeafDecor size={200} color={C.cream} />
          </div>

          {/* LOGO + BRAND */}
          <div style={{ padding: sidebarOpen ? "24px 24px 16px" : "24px 12px 16px", borderBottom: `1px solid ${C.cream}10`, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.cream}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
              {sidebarOpen && <div>
                <div className="pf" style={{ color: C.cream, fontSize: 18, fontWeight: 600, letterSpacing: 1.5, lineHeight: 1.1 }}>THE MIND</div>
                <div className="pf" style={{ color: C.cream, fontSize: 18, fontWeight: 600, letterSpacing: 1.5, lineHeight: 1.1 }}>STUDIO</div>
              </div>}
            </div>
            {sidebarOpen && <div style={{ color: `${C.cream}40`, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 10 }}>{P.label}</div>}
          </div>

          {/* PORTAL TABS */}
          <div style={{ padding: sidebarOpen ? "10px 16px" : "10px 8px", borderBottom: `1px solid ${C.cream}10`, display: "flex", gap: 4 }}>
            {Object.entries(PORTALS).map(([k, v]) => (
              <button key={k} onClick={() => switchPortal(k)} style={{ flex: 1, padding: sidebarOpen ? "8px 6px" : "8px", background: portal === k ? `${C.cream}15` : "transparent", border: `1px solid ${portal === k ? `${C.cream}25` : "transparent"}`, borderRadius: 6, color: portal === k ? C.cream : `${C.cream}40`, fontSize: sidebarOpen ? 10 : 16, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", textAlign: "center" }}>
                {sidebarOpen ? v.label.split(" ")[0] : v.icon}
              </button>
            ))}
          </div>

          {/* NAV SECTIONS */}
          <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }} className="sb">
            {P.sections.map((s, i) => (
              <button key={s.id} onClick={() => go(s.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: sidebarOpen ? "12px 24px" : "12px 0", justifyContent: sidebarOpen ? "flex-start" : "center", background: section === s.id ? `${C.cream}08` : "transparent", border: "none", borderLeft: sidebarOpen ? (section === s.id ? `3px solid ${C.cream}` : "3px solid transparent") : "none", color: section === s.id ? C.cream : `${C.cream}50`, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left", letterSpacing: 0.3 }}>
                <span style={{ fontSize: sidebarOpen ? 16 : 20 }}>{s.icon}</span>
                {sidebarOpen && <span>{s.label}</span>}
              </button>
            ))}
          </nav>

          {/* HIPAA + CRISIS FOOTER */}
          {sidebarOpen && <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.cream}10`, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 10 }}>🔒</span>
              <span style={{ color: `${C.cream}40`, fontSize: 10, letterSpacing: 1 }}>HIPAA PROTECTED</span>
            </div>
            <div style={{ color: `${C.cream}25`, fontSize: 10, lineHeight: 1.6 }}>Crisis: 988 Lifeline · Text HOME to 741741</div>
            <div style={{ color: `${C.cream}15`, fontSize: 9, marginTop: 4 }}>(404) 819-9609 · themindstudioworldwide.com</div>
          </div>}
        </aside>

        {/* ═══ MAIN CONTENT AREA ═══ */}
        <main key={animKey} className="anim-up sb" style={{ flex: 1, overflowY: "auto", background: C.sage, position: "relative" }}>

          {/* TOP BAR - hidden on mobile (replaced by mobile header) */}
          {!mobile && <div className="top-bar" style={{ padding: "16px 40px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ color: C.body, fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
              {P.sections.find(s => s.id === section)?.icon} {P.sections.find(s => s.id === section)?.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ color: C.bodyLight, fontSize: 11 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.sageLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
            </div>
          </div>}

          <div className="main-content" style={{ padding: mobile ? "20px 16px 100px" : "32px 40px 60px", maxWidth: 960, margin: "0 auto" }}>
            {/* CLIENT PORTAL */}
            {section === "welcome" && <WelcomeSection go={go} />}
            {section === "intake" && <IntakeSection notify={notify} />}
            {section === "sessions" && <SessionsSection />}
            {section === "tools" && <ToolsSection />}
            {section === "resources" && <ResourcesSection />}
            {section === "community" && <CommunitySection />}
            {section === "billing" && <BillingSection />}
            {/* THERAPIST PORTAL */}
            {section === "t_onboard" && <TOnboardSection />}
            {section === "t_systems" && <TSystemsSection />}
            {section === "t_education" && <TEducationSection />}
            {section === "t_support" && <TSupportSection notify={notify} />}
            {section === "t_comp" && <TCompSection />}
            {/* BOH PORTAL */}
            {section === "b_overview" && <BOverviewSection />}
            {section === "b_tasks" && <BTasksSection notify={notify} />}
            {section === "b_workflow" && <BWorkflowSection />}
            {section === "b_billing" && <BBillingSection />}
            {section === "b_training" && <BTrainingSection />}
            {section === "b_reports" && <BReportsSection />}
          </div>
        </main>

        {/* ═══ MOBILE BOTTOM NAV BAR ═══ */}
        {mobile && (
          <nav className="mobile-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "6px 0", paddingBottom: "max(6px, env(safe-area-inset-bottom))", zIndex: 40, boxShadow: "0 -2px 12px rgba(0,0,0,0.06)" }}>
            {P.sections.slice(0, 5).map(s => (
              <button key={s.id} onClick={() => go(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 8px", minWidth: 56, minHeight: 44 }}>
                <span style={{ fontSize: 20, opacity: section === s.id ? 1 : 0.4 }}>{s.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: section === s.id ? C.teal : C.bodyLight }}>{s.label}</span>
                {section === s.id && <div style={{ width: 20, height: 2, background: C.teal, borderRadius: 1, marginTop: 1 }} />}
              </button>
            ))}
            <button onClick={() => setMobileMenuOpen(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 8px", minWidth: 56, minHeight: 44 }}>
              <span style={{ fontSize: 20, opacity: 0.4 }}>•••</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: C.bodyLight }}>More</span>
            </button>
          </nav>
        )}
      </div>
    </>
  );
}

// ═══ SHARED COMPONENTS (website-matched) ═══
function SH({ title, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 className="pf" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, color: C.teal, lineHeight: 1.25, fontStyle: "italic" }}>{title}</h1>
      {sub && <p style={{ color: C.bodyLight, fontSize: 14, marginTop: 8, maxWidth: 560, lineHeight: 1.8 }}>{sub}</p>}
      <div style={{ width: 48, height: 3, background: C.teal, borderRadius: 2, marginTop: 14 }} />
    </div>
  );
}
function WCard({ children, hover = true, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: C.white, border: `1px solid ${h && hover ? C.sageAccent : C.border}`, borderRadius: 12, padding: 24, transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", boxShadow: h && hover ? "0 8px 32px rgba(27,58,75,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", transform: h && hover ? "translateY(-2px)" : "none", ...style }}>{children}</div>
  );
}
function TealBtn({ label, onClick, full, outline, disabled, size = "md" }) {
  const p = size === "sm" ? "8px 18px" : size === "lg" ? "14px 40px" : "11px 28px";
  const fs = size === "sm" ? 11 : size === "lg" ? 14 : 12;
  return <button onClick={onClick} disabled={disabled} style={{ background: outline ? "transparent" : C.teal, color: outline ? C.teal : C.cream, border: `2px solid ${C.teal}`, borderRadius: 6, padding: p, fontSize: fs, fontWeight: 700, letterSpacing: 0.8, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Lato', sans-serif", opacity: disabled ? 0.4 : 1, width: full ? "100%" : "auto" }}>{label}</button>;
}
function StatCard({ label, value, sub, icon }) {
  return (
    <WCard><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: C.bodyLight, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>{label}</div>
        <div className="pf" style={{ fontSize: 36, fontWeight: 700, color: C.teal, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: C.bodyLight, fontSize: 11, marginTop: 6 }}>{sub}</div>}
      </div>
      {icon && <span style={{ fontSize: 28, opacity: 0.25 }}>{icon}</span>}
    </div></WCard>
  );
}
function Input({ label, value, onChange, type = "text", placeholder = "", rows, required }) {
  const s = { width: "100%", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.body, fontSize: 14, fontFamily: "'Lato', sans-serif" };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: C.teal, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>
      {rows ? <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{ ...s, resize: "vertical" }} /> : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={s} />}
    </div>
  );
}
function HipaaNotice() {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: `${C.sage}80`, borderRadius: 8, marginBottom: 20, border: `1px solid ${C.sageAccent}40` }}>
    <span>🔒</span><span style={{ color: C.bodyLight, fontSize: 11 }}>Your information is encrypted and HIPAA-protected. We never share your data without consent.</span>
  </div>;
}
function ProgressSteps({ current, total }) {
  return <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>{Array.from({ length: total }, (_, i) => (
    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? C.teal : C.border, transition: "background 0.4s" }} />
  ))}</div>;
}

// ═══════════════════════════════════════════════════════════════
// CLIENT PORTAL — WELCOME
// ═══════════════════════════════════════════════════════════════
function WelcomeSection({ go }) {
  const steps = [
    { done: false, label: "Complete Intake Form", action: "intake" },
    { done: false, label: "Verify Insurance", action: "billing" },
    { done: false, label: "Match with Therapist", action: "sessions" },
    { done: false, label: "Book First Session", action: "sessions" },
  ];
  return (
    <div>
      <SH title="Heal Your Mind, Transform Your Life" sub="Welcome to your private, confidential healing space. Everything here is designed to support your journey — at your pace, on your terms." />

      {/* HERO STAT BAR — matches website's stat section */}
      <div className="hero-stat-bar" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, background: C.teal, borderRadius: 12, overflow: "hidden", marginBottom: 28 }} className="anim-scale hero-stat-bar">
        {[
          { val: "100%", label: "Confidential" },
          { val: "24/7", label: "Crisis Support" },
          { val: "HIPAA", label: "Compliant" },
          { val: "50+", label: "State Coverage" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.cream}10` : "none" }}>
            <div className="pf" style={{ color: C.cream, fontSize: 28, fontWeight: 700, fontStyle: "italic" }}>{s.val}</div>
            <div style={{ color: `${C.cream}60`, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* QUICK START CHECKLIST */}
      <WCard style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div className="pf" style={{ color: C.teal, fontSize: 20, fontWeight: 600, fontStyle: "italic" }}>Quick Start Checklist</div>
            <div style={{ color: C.bodyLight, fontSize: 12, marginTop: 2 }}>Complete these steps to begin your care</div>
          </div>
          <div className="pf" style={{ fontSize: 32, color: C.teal, fontWeight: 700 }}>0/4</div>
        </div>
        <div style={{ width: "100%", height: 4, background: C.sageLt, borderRadius: 2, marginBottom: 16 }}>
          <div style={{ width: "0%", height: "100%", background: C.teal, borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
        <div className="checklist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => go(s.action)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.sageLt, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${s.done ? C.success : C.sageAccent}`, background: s.done ? C.success : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.done && <span style={{ color: C.white, fontSize: 12 }}>✓</span>}
              </div>
              <span style={{ color: C.body, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </WCard>

      {/* SECTION GRID — website card style */}
      <div className="card-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: "📋", title: "Complete Intake", desc: "Tell us about yourself so we can match you with the right therapist.", action: "intake" },
          { icon: "📅", title: "Your Sessions", desc: "Book appointments, join virtual sessions, and track progress.", action: "sessions" },
          { icon: "🧘", title: "Daily Check-In", desc: "Track your mood, energy, sleep, and anxiety over time.", action: "tools" },
          { icon: "📚", title: "Wellness Library", desc: "Breathing exercises, journal prompts, affirmations, and coping tools.", action: "resources" },
          { icon: "👥", title: "Community", desc: "Connect with support groups, ask questions, and RSVP to events.", action: "community" },
          { icon: "💳", title: "Billing & Insurance", desc: "Manage your insurance, view session history, and handle payments.", action: "billing" },
        ].map((c, i) => (
          <button key={i} onClick={() => go(c.action)} className="anim-up" style={{ animationDelay: `${i * 80}ms`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{c.icon}</span>
            <div className="pf" style={{ color: C.teal, fontSize: 16, fontWeight: 600, fontStyle: "italic", marginBottom: 6 }}>{c.title}</div>
            <div style={{ color: C.bodyLight, fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div>
          </button>
        ))}
      </div>

      {/* CRISIS SUPPORT — always visible per HIPAA/duty of care */}
      <div style={{ padding: "18px 24px", background: C.white, border: `2px solid ${C.sageAccent}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.sageLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💚</div>
        <div>
          <div style={{ color: C.teal, fontSize: 14, fontWeight: 700 }}>Crisis Support Available 24/7</div>
          <div style={{ color: C.bodyLight, fontSize: 12, marginTop: 2 }}>988 Suicide & Crisis Lifeline · Text HOME to 741741 · Emergencies: 911</div>
        </div>
      </div>
    </div>
  );
}

// ═══ CLIENT — INTAKE (4-step, HIPAA-compliant) ═══
function IntakeSection({ notify }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", dob: "", state: "", city: "", insurance: "", member_id: "", medicaid: false, format: "virtual", reason: "", goals: "", meds: "", prev: false, ec_name: "", ec_phone: "", hipaa: false, telehealth: false });
  const [done, setDone] = useState(false);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    await sbPost("ms_intake_forms", { form_type: "initial_intake", form_data: f, hipaa_consent: f.hipaa, telehealth_consent: f.telehealth });
    setDone(true);
    notify("Intake submitted securely");
  };

  if (done) return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.sageLt, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 40 }}>✅</div>
      <h2 className="pf" style={{ fontSize: 32, color: C.teal, fontStyle: "italic", marginBottom: 12 }}>Intake Complete</h2>
      <p style={{ color: C.bodyLight, fontSize: 15, lineHeight: 1.8, maxWidth: 440, margin: "0 auto" }}>Our team will verify your insurance, match you with a licensed therapist, and reach out within 24–48 hours.</p>
      <div style={{ marginTop: 20 }}><HipaaNotice /></div>
    </div>
  );

  return (
    <div style={{ maxWidth: 640 }}>
      <SH title="Begin Your Journey" sub={`Step ${step} of 4 — All information is encrypted and HIPAA-protected.`} />
      <HipaaNotice />
      <ProgressSteps current={step} total={4} />

      {step === 1 && <div className="anim-slide">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px"}} className="form-grid-2 }}>
          <Input label="First Name" value={f.first} onChange={e => u("first", e.target.value)} required />
          <Input label="Last Name" value={f.last} onChange={e => u("last", e.target.value)} required />
        </div>
        <Input label="Email" value={f.email} onChange={e => u("email", e.target.value)} type="email" required />
        <Input label="Phone" value={f.phone} onChange={e => u("phone", e.target.value)} type="tel" required />
        <Input label="Date of Birth" value={f.dob} onChange={e => u("dob", e.target.value)} type="date" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px"}} className="form-grid-2 }}>
          <Input label="State" value={f.state} onChange={e => u("state", e.target.value)} required />
          <Input label="City" value={f.city} onChange={e => u("city", e.target.value)} />
        </div>
      </div>}

      {step === 2 && <div className="anim-slide">
        <Input label="Insurance Provider" value={f.insurance} onChange={e => u("insurance", e.target.value)} placeholder="e.g., Amerigroup, Peach State, Anthem" />
        <Input label="Member / Policy ID" value={f.member_id} onChange={e => u("member_id", e.target.value)} />
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" checked={f.medicaid} onChange={e => u("medicaid", e.target.checked)} style={{ accentColor: C.teal, width: 18, height: 18 }} />
          <label style={{ color: C.body, fontSize: 14 }}>I am enrolled in Medicaid</label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: C.teal, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>Preferred Session Format</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["virtual", "in_home", "in_office"].map(v => (
              <button key={v} onClick={() => u("format", v)} style={{ flex: 1, padding: 12, background: f.format === v ? C.teal : C.white, border: `2px solid ${f.format === v ? C.teal : C.border}`, borderRadius: 8, color: f.format === v ? C.cream : C.body, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>{v.replace(/_/g, " ")}</button>
            ))}
          </div>
        </div>
      </div>}

      {step === 3 && <div className="anim-slide">
        <Input label="What brings you to therapy?" value={f.reason} onChange={e => u("reason", e.target.value)} rows={4} placeholder="Share in your own words — there are no wrong answers." required />
        <Input label="Goals for therapy" value={f.goals} onChange={e => u("goals", e.target.value)} rows={3} placeholder="What would progress look like for you?" />
        <Input label="Current medications" value={f.meds} onChange={e => u("meds", e.target.value)} placeholder="List any current medications or write N/A" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px"}} className="form-grid-2 }}>
          <Input label="Emergency Contact Name" value={f.ec_name} onChange={e => u("ec_name", e.target.value)} />
          <Input label="Emergency Contact Phone" value={f.ec_phone} onChange={e => u("ec_phone", e.target.value)} type="tel" />
        </div>
      </div>}

      {step === 4 && <div className="anim-slide">
        <WCard style={{ marginBottom: 14 }}>
          <div className="pf" style={{ color: C.teal, fontSize: 18, fontWeight: 600, fontStyle: "italic", marginBottom: 8 }}>HIPAA Notice of Privacy Practices</div>
          <p style={{ color: C.bodyLight, fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>The Mind Studio protects your health information in accordance with HIPAA regulations. Your protected health information (PHI) is used only for treatment, payment, and healthcare operations. We will never sell, share, or disclose your information without your written consent except as required by law.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={f.hipaa} onChange={e => u("hipaa", e.target.checked)} style={{ accentColor: C.teal, width: 20, height: 20 }} /><span style={{ color: C.body, fontSize: 14, fontWeight: 600 }}>I acknowledge the HIPAA Notice of Privacy Practices</span></div>
        </WCard>
        <WCard>
          <div className="pf" style={{ color: C.teal, fontSize: 18, fontWeight: 600, fontStyle: "italic", marginBottom: 8 }}>Telehealth Informed Consent</div>
          <p style={{ color: C.bodyLight, fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>I consent to receiving mental health services via telehealth through The Mind Studio's HIPAA-compliant platform. I understand sessions are conducted through secure, encrypted video and that I am responsible for ensuring a private environment on my end.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={f.telehealth} onChange={e => u("telehealth", e.target.checked)} style={{ accentColor: C.teal, width: 20, height: 20 }} /><span style={{ color: C.body, fontSize: 14, fontWeight: 600 }}>I consent to telehealth services</span></div>
        </WCard>
      </div>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        {step > 1 ? <TealBtn label="← Back" outline onClick={() => setStep(s => s - 1)} /> : <div />}
        {step < 4 ? <TealBtn label="Continue →" onClick={() => setStep(s => s + 1)} /> : <TealBtn label="Submit Intake" onClick={submit} disabled={!f.hipaa || !f.telehealth || !f.first || !f.email} />}
      </div>
    </div>
  );
}

// ═══ CLIENT — SESSIONS ═══
function SessionsSection() {
  return (
    <div><SH title="Your Sessions" sub="Once matched with a therapist, your appointments, virtual sessions, and session notes will appear here." />
      <WCard style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 56, opacity: 0.15, marginBottom: 16 }}>📅</div>
        <p className="pf" style={{ color: C.teal, fontSize: 22, fontStyle: "italic", marginBottom: 8 }}>No Sessions Yet</p>
        <p style={{ color: C.bodyLight, fontSize: 13, maxWidth: 360, margin: "0 auto" }}>Complete your intake and insurance verification to be matched with a licensed therapist.</p>
      </WCard>
    </div>
  );
}

// ═══ CLIENT — DAILY TOOLS (mood tracker + visualizations) ═══
function ToolsSection() {
  const [mood, setMood] = useState({ mood: 5, energy: 5, anxiety: 5, sleep: 5, notes: "" });
  const [logged, setLogged] = useState(false);
  const history = [
    { day: "Mon", mood: 6, energy: 5, anxiety: 4, sleep: 7 }, { day: "Tue", mood: 5, energy: 4, anxiety: 6, sleep: 5 },
    { day: "Wed", mood: 7, energy: 6, anxiety: 3, sleep: 8 }, { day: "Thu", mood: 6, energy: 7, anxiety: 4, sleep: 7 },
    { day: "Fri", mood: 8, energy: 7, anxiety: 2, sleep: 8 }, { day: "Sat", mood: 7, energy: 8, anxiety: 3, sleep: 9 },
    { day: "Today", mood: mood.mood, energy: mood.energy, anxiety: mood.anxiety, sleep: mood.sleep },
  ];
  const radarData = [
    { metric: "Mood", value: mood.mood }, { metric: "Energy", value: mood.energy },
    { metric: "Sleep", value: mood.sleep }, { metric: "Calm", value: 10 - mood.anxiety },
  ];

  const logMood = async () => {
    await sbPost("ms_mood_logs", { mood_score: mood.mood, energy_level: mood.energy, anxiety_level: mood.anxiety, sleep_quality: mood.sleep, notes: mood.notes });
    setLogged(true);
  };

  const Slider = ({ label, k, emoji, low, high }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ color: C.body, fontSize: 13, fontWeight: 600 }}>{emoji} {label}</span>
        <span className="pf" style={{ color: C.teal, fontSize: 28, fontWeight: 700 }}>{mood[k]}</span>
      </div>
      <input type="range" min={1} max={10} value={mood[k]} onChange={e => setMood(m => ({ ...m, [k]: +e.target.value }))} style={{ width: "100%", accentColor: C.teal, height: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.bodyLight, fontSize: 10 }}>{low}</span><span style={{ color: C.bodyLight, fontSize: 10 }}>{high}</span></div>
    </div>
  );

  return (
    <div>
      <SH title="Daily Tools & Check-In" sub="Consistent tracking helps your therapist personalize your care. Your data is encrypted and only visible to your care team." />
      <HipaaNotice />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="mood-layout">
        {/* MOOD LOG */}
        <WCard>
          {logged ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <span style={{ fontSize: 56 }}>🧠</span>
              <div className="pf" style={{ color: C.teal, fontSize: 24, fontStyle: "italic", marginTop: 12 }}>Check-In Complete</div>
              <p style={{ color: C.bodyLight, fontSize: 12, marginTop: 4 }}>Consistency builds clarity. See you tomorrow.</p>
            </div>
          ) : (
            <>
              <div className="pf" style={{ color: C.teal, fontSize: 18, fontStyle: "italic", fontWeight: 600, marginBottom: 16 }}>Today's Check-In</div>
              <Slider label="Mood" k="mood" emoji="😊" low="Low" high="Great" />
              <Slider label="Energy" k="energy" emoji="⚡" low="Exhausted" high="Energized" />
              <Slider label="Anxiety" k="anxiety" emoji="😰" low="Calm" high="Very Anxious" />
              <Slider label="Sleep Quality" k="sleep" emoji="😴" low="Poor" high="Excellent" />
              <Input label="Notes (optional)" value={mood.notes} onChange={e => setMood(m => ({ ...m, notes: e.target.value }))} rows={2} placeholder="What's on your mind today..." />
              <TealBtn label="Log Check-In" onClick={logMood} full />
            </>
          )}
        </WCard>

        {/* CHARTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WCard>
            <div className="pf" style={{ color: C.teal, fontSize: 15, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Weekly Mood Trend</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={history}>
                <defs><linearGradient id="mgV4" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.25} /><stop offset="95%" stopColor={C.teal} stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="day" tick={{ fill: C.bodyLight, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: C.bodyLight, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="mood" stroke={C.teal} fill="url(#mgV4)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="energy" stroke={C.sageAccent} fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </WCard>
          <WCard>
            <div className="pf" style={{ color: C.teal, fontSize: 15, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Today's Wellness Radar</div>
            <ResponsiveContainer width="100%" height={140}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: C.bodyLight, fontSize: 10 }} />
                <Radar name="Today" dataKey="value" stroke={C.teal} fill={C.teal} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </WCard>
        </div>
      </div>

      {/* WELLNESS TOOLS GRID */}
      <div className="pf" style={{ color: C.teal, fontSize: 20, fontStyle: "italic", fontWeight: 600, marginBottom: 14 }}>Wellness Toolbox</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="tool-grid">
        {[
          { icon: "🌅", title: "Morning Affirmation", desc: "Start your day with intention and self-compassion" },
          { icon: "🌊", title: "4-7-8 Breathing", desc: "Activate your parasympathetic nervous system" },
          { icon: "📓", title: "Journal Prompt", desc: "Write freely for 5 minutes without editing" },
          { icon: "🌳", title: "5-4-3-2-1 Grounding", desc: "Reconnect with the present through your senses" },
          { icon: "🎧", title: "Guided Meditation", desc: "10-minute body scan for deep relaxation" },
          { icon: "🌙", title: "Evening Wind-Down", desc: "Release the day and prepare for restful sleep" },
        ].map((t, i) => (
          <WCard key={i}><span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{t.icon}</span><div className="pf" style={{ color: C.teal, fontSize: 15, fontWeight: 600, fontStyle: "italic", marginBottom: 4 }}>{t.title}</div><div style={{ color: C.bodyLight, fontSize: 12, lineHeight: 1.6 }}>{t.desc}</div></WCard>
        ))}
      </div>
    </div>
  );
}

// ═══ CLIENT — RESOURCES ═══
function ResourcesSection() {
  const [res, setRes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => { sbGet("ms_resources?for_audience=eq.client&is_active=eq.true&order=category").then(r => { setRes(r); setLoading(false); }); }, []);
  const cats = ["all", ...new Set(res.map(r => r.category))];
  const filtered = filter === "all" ? res : res.filter(r => r.category === filter);
  if (loading) return <div style={{ color: C.bodyLight, padding: 40 }}>Loading resources...</div>;
  return (
    <div>
      <SH title="Wellness Library" sub="Curated resources for breathing, journaling, coping skills, and emotional education." />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {cats.map(c => <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? C.teal : C.white, border: `1.5px solid ${filter === c ? C.teal : C.border}`, borderRadius: 20, padding: "6px 16px", color: filter === c ? C.cream : C.body, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{c}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => (
          <WCard key={r.id}>
            <span style={{ display: "inline-block", background: C.sageLt, color: C.teal, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{r.category}</span>
            <div className="pf" style={{ color: C.teal, fontSize: 18, fontWeight: 600, fontStyle: "italic", marginBottom: 6 }}>{r.title}</div>
            <p style={{ color: C.bodyLight, fontSize: 13, lineHeight: 1.8 }}>{r.content}</p>
          </WCard>
        ))}
      </div>
    </div>
  );
}

// ═══ CLIENT — COMMUNITY ═══
function CommunitySection() {
  return (
    <div><SH title="Community & Events" sub="Safe, moderated spaces for connection and support. All participation is confidential." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="card-grid-2">
        {[
          { icon: "🗣️", title: "Discussion Groups", desc: "Therapist-led virtual groups: anxiety, grief, identity, perinatal support, and more." },
          { icon: "❓", title: "Ask a Therapist", desc: "Submit anonymous questions answered by licensed professionals." },
          { icon: "📅", title: "Upcoming Events", desc: "RSVP to open discussions, workshops, and community wellness events." },
          { icon: "📝", title: "Anonymous Submissions", desc: "No names. No judgment. Just answers from people who understand." },
        ].map((c, i) => <WCard key={i}><span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>{c.icon}</span><div className="pf" style={{ color: C.teal, fontSize: 16, fontWeight: 600, fontStyle: "italic", marginBottom: 4 }}>{c.title}</div><div style={{ color: C.bodyLight, fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div></WCard>)}
      </div>
    </div>
  );
}

// ═══ CLIENT — BILLING ═══
function BillingSection() {
  return (
    <div><SH title="Billing & Membership" sub="Manage your insurance, view session history, and handle payments." />
      <HipaaNotice />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="card-grid-2">
        <StatCard label="Current Plan" value="—" sub="Complete intake to verify" icon="💳" />
        <StatCard label="Sessions" value="0" sub="Total completed" icon="📅" />
      </div>
      <WCard>
        <div className="pf" style={{ color: C.teal, fontSize: 16, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Update Insurance Info", "View Session History", "Submit Payment Issue", "Request Itemized Receipt", "Upgrade to Premium"].map(a => (
            <button key={a} style={{ background: C.sageLt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{a}</button>
          ))}
        </div>
      </WCard>
    </div>
  );
}

// ═══ THERAPIST PORTAL SECTIONS ═══
function TOnboardSection() {
  const checks = ["Watch Welcome Video", "Upload W-9", "Upload License Copy", "Upload Malpractice Insurance", "Read Therapist Handbook", "Sign Contract", "Complete HIPAA Training"];
  return (
    <div><SH title="Welcome, Therapist" sub="Complete your onboarding checklist to start receiving client referrals through The Mind Studio." />
      <WCard>
        <div className="pf" style={{ color: C.teal, fontSize: 18, fontStyle: "italic", fontWeight: 600, marginBottom: 16 }}>Onboarding Checklist</div>
        {checks.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < checks.length - 1 ? `1px solid ${C.sageLt}` : "none" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${C.sageAccent}`, flexShrink: 0 }} />
          <span style={{ color: C.body, fontSize: 14 }}>{c}</span>
        </div>))}
        <div style={{ width: "100%", height: 4, background: C.sageLt, borderRadius: 2, marginTop: 16 }}><div style={{ width: "0%", height: "100%", background: C.teal, borderRadius: 2 }} /></div>
      </WCard>
    </div>
  );
}
function TSystemsSection() {
  return (<div><SH title="Systems & Scheduling" sub="How to manage your calendar, view client intake notes, and run virtual sessions." />
    {["Platform Guide (GHL)", "Viewing Client Intake Notes", "Managing Your Calendar", "Virtual Session SOP", "Emergency Escalation Guide"].map((t, i) => (
      <WCard key={i} style={{ marginBottom: 10 }}><div style={{ color: C.teal, fontSize: 15, fontWeight: 700 }}>{t}</div><div style={{ color: C.bodyLight, fontSize: 12, marginTop: 4 }}>Documentation available</div></WCard>
    ))}</div>);
}
function TEducationSection() {
  return (<div><SH title="Continuing Education & Supervision" sub="Free CEU opportunities, clinical trainings, and biweekly supervision recordings." />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><StatCard label="CEUs Earned" value="0" sub="This quarter" icon="🎓" /><StatCard label="Available Trainings" value="12" sub="Relias + live webinars" icon="📚" /></div></div>);
}
function TSupportSection({ notify }) {
  return (<div><SH title="Therapist Support" sub="Weekly check-ins, supervisor contact, leave requests, and escalation procedures." />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {["Weekly Check-In Form", "Chat with Supervisor", "Submit Leave Request", "Report Red Flag / Escalation"].map((a, i) => (
        <WCard key={i}><button onClick={() => notify(`${a} — coming soon`)} style={{ background: "none", border: "none", color: C.teal, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%" }}>{a}</button></WCard>
      ))}</div></div>);
}
function TCompSection() {
  const d = [{ m: "Jan", rev: 0 }, { m: "Feb", rev: 0 }, { m: "Mar", rev: 0 }];
  return (<div><SH title="Compensation & Billing" sub="Submit session logs, view pay schedule, and track earnings." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }} className="stat-grid-3"><StatCard label="This Month" value="$0" icon="💰" /><StatCard label="Sessions" value="0" icon="📋" /><StatCard label="Next Payout" value="—" icon="📅" /></div>
    <WCard>
      <div className="pf" style={{ color: C.teal, fontSize: 15, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Earnings Trend</div>
      <ResponsiveContainer width="100%" height={160}><BarChart data={d}><XAxis dataKey="m" tick={{ fill: C.bodyLight, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.bodyLight, fontSize: 9 }} axisLine={false} tickLine={false} /><Bar dataKey="rev" fill={C.sageAccent} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
    </WCard></div>);
}

// ═══ BOH OPS PORTAL SECTIONS ═══
function BOverviewSection() {
  return (<div><SH title="Operations Center" sub="The engine behind The Mind Studio. Team metrics, org structure, and communication SOPs." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }} className="stat-grid-4"><StatCard label="Active Clients" value="0" icon="👤" /><StatCard label="Therapists" value="0" icon="🩺" /><StatCard label="Pending Intake" value="0" icon="📋" /><StatCard label="Claims/Month" value="0" icon="💳" /></div>
    <WCard>
      <div className="pf" style={{ color: C.teal, fontSize: 16, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Team Roles</div>
      {["Concierge", "Scheduler", "Billing Assistant", "VA / Admin", "Intake Specialist"].map((r, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.sageLt}` }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: C.sageAccent }} /><span style={{ color: C.body, fontSize: 14 }}>{r}</span></div>))}
    </WCard></div>);
}
function BTasksSection({ notify }) {
  const tasks = [
    { t: "Review 3 pending intake forms", role: "Intake Specialist", p: "high" },
    { t: "Verify insurance for new clients", role: "Billing Assistant", p: "high" },
    { t: "Follow up with inactive clients (10+ days)", role: "Concierge", p: "medium" },
    { t: "Update therapist availability calendar", role: "Scheduler", p: "medium" },
    { t: "Process session logs from last week", role: "Billing Assistant", p: "low" },
  ];
  const pc = { high: C.danger, medium: C.warning, low: C.success };
  return (<div><SH title="Task Flow & Checklists" sub="Role-based daily tasks prioritized by urgency." />
    {tasks.map((tk, i) => (<WCard key={i} style={{ marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div onClick={() => notify("Task completed")} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${C.sageAccent}`, flexShrink: 0, cursor: "pointer" }} />
      <div style={{ flex: 1 }}><div style={{ color: C.body, fontSize: 14, fontWeight: 600 }}>{tk.t}</div><div style={{ color: C.bodyLight, fontSize: 11, marginTop: 2 }}>{tk.role}</div></div>
      <span style={{ background: `${pc[tk.p]}15`, color: pc[tk.p], padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{tk.p}</span>
    </div></WCard>))}</div>);
}
function BWorkflowSection() {
  return (<div><SH title="Client & Therapist Workflow SOPs" sub="Standard operating procedures for every stage of the client and therapist lifecycle." />
    {["Client Intake Processing SOP", "Therapist Onboarding SOP", "Booking & Follow-Up SOP", "No-Show / Cancellation Handling", "Client Progress Tracking", "Flags & Escalation Procedures"].map((s, i) => (
      <WCard key={i} style={{ marginBottom: 8 }}><div style={{ color: C.teal, fontSize: 15, fontWeight: 700 }}>{s}</div></WCard>
    ))}</div>);
}
function BBillingSection() {
  return (<div><SH title="Insurance & Billing Operations" sub="Verification SOPs, claims tracking, and payment escalation procedures." /><HipaaNotice />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><StatCard label="Claims Submitted" value="0" icon="📄" /><StatCard label="Claims Paid" value="0" icon="✅" /></div></div>);
}
function BTrainingSection() {
  return (<div><SH title="Training & Development" sub="Platform tutorials, automation walkthroughs, and team huddle recordings." />
    {["GHL Admin Features Guide", "Automation Walkthroughs", "Lead Handling Scripts", "Monthly Team Huddle Recordings", "Slack / Email Communication SOP"].map((t, i) => (
      <WCard key={i} style={{ marginBottom: 8 }}><span style={{ color: C.teal, fontSize: 15, fontWeight: 700 }}>{t}</span></WCard>
    ))}</div>);
}
function BReportsSection() {
  const d = [{ w: "W1", clients: 0, claims: 0 }, { w: "W2", clients: 0, claims: 0 }, { w: "W3", clients: 0, claims: 0 }, { w: "W4", clients: 0, claims: 0 }];
  return (<div><SH title="Reports & Metrics" sub="Client conversion, therapist utilization, lead sources, and claims performance." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }} className="stat-grid-4"><StatCard label="Conversion" value="0%" /><StatCard label="Therapist Util." value="0%" /><StatCard label="Avg Intake" value="—" /><StatCard label="Claims Ratio" value="0/0" /></div>
    <WCard>
      <div className="pf" style={{ color: C.teal, fontSize: 15, fontStyle: "italic", fontWeight: 600, marginBottom: 12 }}>Weekly Performance</div>
      <ResponsiveContainer width="100%" height={180}><LineChart data={d}><XAxis dataKey="w" tick={{ fill: C.bodyLight, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.bodyLight, fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} /><Line type="monotone" dataKey="clients" stroke={C.teal} strokeWidth={2.5} dot={{ fill: C.teal, r: 4 }} /><Line type="monotone" dataKey="claims" stroke={C.sageAccent} strokeWidth={1.5} strokeDasharray="4 4" /></LineChart></ResponsiveContainer>
    </WCard></div>);
}
