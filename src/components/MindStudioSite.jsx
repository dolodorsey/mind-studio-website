import { useState, useEffect, useRef } from "react";

/*
  THE MIND STUDIO — V3 WEBSITE
  Design DNA: Warm authority. Black + Gold. Brain iconography.
  Palette: #0A0A0A (base) · #C9A84C (gold primary) · #F5F0E8 (cream) · #1A1612 (warm dark)
  Typography: Cormorant Garamond (display) · DM Sans (body)
  Motion: Slow reveal, healing energy, cubic-bezier(0.16, 1, 0.3, 1)
  Brand: "Healing the World — One Brain at a Time."
*/

const GOLD = "#C9A84C";
const CREAM = "#F5F0E8";
const DARK = "#0A0A0A";
const WARM_DARK = "#1A1612";
const GOLD_DIM = "#8A7A3D";

const PAGES = ["home","services","about","providers","contact"];

// ═══ FONTS ═══
const fontLink = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

// ═══ MAIN APP ═══
export default function MindStudioSite() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navTo = (p) => { setPage(p); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <link href={fontLink} rel="stylesheet" />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${DARK}; color: ${CREAM}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::selection { background: ${GOLD}30; color: ${GOLD}; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        .grain { position: fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999; opacity:0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideRight { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .fade-up { animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fade-in { animation: fadeIn 1.4s ease forwards; }
        .reveal-line { animation: slideRight 1.2s cubic-bezier(0.16,1,0.3,1) forwards; transform-origin: left; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; font-family: inherit; }
      `}</style>
      <div className="grain" />

      {/* ═══ PRELOADER ═══ */}
      {!loaded && (
        <div style={{ position:"fixed", inset:0, zIndex:10000, background:DARK, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20, transition:"opacity 0.6s", opacity: loaded ? 0 : 1 }}>
          <div className="cormorant" style={{ fontSize:"clamp(28px,5vw,48px)", color:GOLD, fontWeight:300, letterSpacing:6, textTransform:"uppercase" }}>The Mind Studio</div>
          <div style={{ width:60, height:1, background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div style={{ color:GOLD_DIM, fontSize:11, letterSpacing:4, textTransform:"uppercase" }}>Healing the World — One Brain at a Time</div>
        </div>
      )}

      {/* ═══ NAV ═══ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"16px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", background: scrollY > 60 ? `${DARK}E8` : "transparent", backdropFilter: scrollY > 60 ? "blur(12px)" : "none", borderBottom: scrollY > 60 ? `1px solid ${GOLD}15` : "none", transition:"all 0.4s" }}>
        <button onClick={() => navTo("home")} style={{ background:"none", border:"none", display:"flex", alignItems:"center", gap:12 }}>
          <div className="cormorant" style={{ color:GOLD, fontSize:20, fontWeight:600, letterSpacing:3 }}>THE MIND STUDIO</div>
        </button>
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {PAGES.map(p => (
            <button key={p} onClick={() => navTo(p)} style={{ background:"none", border:"none", color: page === p ? GOLD : CREAM+"80", fontSize:12, letterSpacing:2, textTransform:"uppercase", fontWeight:400, transition:"color 0.3s", padding:"4px 0", borderBottom: page === p ? `1px solid ${GOLD}` : "1px solid transparent" }}>
              {p === "home" ? "HOME" : p.toUpperCase()}
            </button>
          ))}
          <button onClick={() => navTo("contact")} style={{ background:`${GOLD}15`, border:`1px solid ${GOLD}40`, borderRadius:4, padding:"8px 20px", color:GOLD, fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>
            GET STARTED
          </button>
        </div>
      </nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <div style={{ minHeight:"100vh" }}>
        {page === "home" && <HomePage navTo={navTo} />}
        {page === "services" && <ServicesPage navTo={navTo} />}
        {page === "about" && <AboutPage />}
        {page === "providers" && <ProvidersPage navTo={navTo} />}
        {page === "contact" && <ContactPage />}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop:`1px solid ${GOLD}15`, padding:"60px 40px 40px", background:WARM_DARK }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40 }}>
          <div>
            <div className="cormorant" style={{ color:GOLD, fontSize:24, fontWeight:600, letterSpacing:3, marginBottom:16 }}>THE MIND STUDIO</div>
            <p style={{ color:CREAM+"60", fontSize:13, lineHeight:1.7, maxWidth:320 }}>Healing the World — One Brain at a Time. Compassionate, convenient, and confidential mental health care across all 50 states.</p>
          </div>
          <div>
            <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:3, marginBottom:16, textTransform:"uppercase" }}>Navigation</div>
            {PAGES.map(p => <button key={p} onClick={() => navTo(p)} style={{ display:"block", background:"none", border:"none", color:CREAM+"60", fontSize:13, marginBottom:8, textAlign:"left" }}>{p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
          </div>
          <div>
            <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:3, marginBottom:16, textTransform:"uppercase" }}>Contact</div>
            <p style={{ color:CREAM+"60", fontSize:13, lineHeight:2 }}>theDoctorDorsey@gmail.com<br/>(404) 819-9609<br/>Atlanta, GA</p>
          </div>
          <div>
            <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:3, marginBottom:16, textTransform:"uppercase" }}>Legal</div>
            <p style={{ color:CREAM+"60", fontSize:13, lineHeight:2 }}>Privacy Policy<br/>Terms of Service<br/>HIPAA Notice</p>
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:"40px auto 0", paddingTop:24, borderTop:`1px solid ${GOLD}10`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:CREAM+"30", fontSize:11 }}>© 2026 The Mind Studio, LLC. All rights reserved.</span>
          <span style={{ color:CREAM+"30", fontSize:11 }}>A Kollective Hospitality Group Company</span>
        </div>
      </footer>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════
function HomePage({ navTo }) {
  return (
    <>
      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"120px 40px 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 50% at 50% 40%, ${GOLD}08 0%, transparent 70%)` }} />
        <div className="fade-up" style={{ position:"relative", zIndex:1 }}>
          <div style={{ color:GOLD_DIM, fontSize:11, letterSpacing:6, textTransform:"uppercase", marginBottom:32 }}>National Mental Health Organization</div>
          <h1 className="cormorant" style={{ fontSize:"clamp(40px,8vw,96px)", fontWeight:300, lineHeight:1.05, color:CREAM, maxWidth:900, marginBottom:24 }}>
            Healing the World<span style={{ color:GOLD }}> —</span><br/>One Brain at a Time
          </h1>
          <div style={{ width:80, height:1, background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin:"0 auto 32px" }} className="reveal-line" />
          <p style={{ color:CREAM+"70", fontSize:16, lineHeight:1.8, maxWidth:560, margin:"0 auto 48px", fontWeight:300 }}>
            Compassionate, convenient, and confidential therapy — virtual, in-home, or in-office. Across all 50 states. Insurance and Medicaid accepted.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navTo("contact")} style={{ background:GOLD, color:DARK, border:"none", borderRadius:4, padding:"14px 36px", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>
              Begin Your Journey
            </button>
            <button onClick={() => navTo("providers")} style={{ background:"transparent", color:GOLD, border:`1px solid ${GOLD}40`, borderRadius:4, padding:"14px 36px", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:400 }}>
              For Providers
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ padding:"100px 40px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>Our Services</div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:300, color:CREAM }}>Therapy That Fits Your Life</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
          {[
            { icon: "🧠", title: "Individual Therapy", desc: "One-on-one support tailored to your unique needs — anxiety, depression, trauma, burnout, and beyond." },
            { icon: "💛", title: "Couples & Family", desc: "Strengthen relationships, improve communication, and navigate transitions together with expert guidance." },
            { icon: "🌱", title: "Youth Programs", desc: "Mentorship-based therapy that meets young people where they are — building trust and emotional resilience." },
            { icon: "🏠", title: "In-Home Sessions", desc: "Therapy in the comfort of your home. We come to you, so healing happens where you feel safest." },
            { icon: "💻", title: "Virtual Telehealth", desc: "HIPAA-compliant video sessions from anywhere. Flexible scheduling — mornings, evenings, weekends." },
            { icon: "🏥", title: "Insurance Billing", desc: "We accept most insurance plans including Medicaid. Our team handles claims and paperwork for you." },
          ].map((s, i) => (
            <div key={i} style={{ background:WARM_DARK, border:`1px solid ${GOLD}10`, borderRadius:8, padding:32, transition:"border-color 0.4s, transform 0.4s", cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD+"40"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = GOLD+"10"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize:28, marginBottom:16 }}>{s.icon}</div>
              <h3 className="cormorant" style={{ fontSize:22, fontWeight:600, color:CREAM, marginBottom:12 }}>{s.title}</h3>
              <p style={{ color:CREAM+"60", fontSize:14, lineHeight:1.7, fontWeight:300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STAT STRIP */}
      <section style={{ padding:"80px 40px", background:`linear-gradient(180deg, ${WARM_DARK} 0%, ${DARK} 100%)`, borderTop:`1px solid ${GOLD}10`, borderBottom:`1px solid ${GOLD}10` }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:40, textAlign:"center" }}>
          {[
            { num: "50", label: "States Served" },
            { num: "24/7", label: "Support Available" },
            { num: "100%", label: "Confidential" },
            { num: "4+", label: "Therapy Formats" },
          ].map((s, i) => (
            <div key={i}>
              <div className="cormorant" style={{ fontSize:48, fontWeight:300, color:GOLD }}>{s.num}</div>
              <div style={{ color:CREAM+"50", fontSize:11, letterSpacing:3, textTransform:"uppercase", marginTop:8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"100px 40px", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>Getting Started</div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:300, color:CREAM }}>Four Steps to Feeling Better</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:32 }}>
          {[
            { step: "01", title: "Complete Intake", desc: "Brief online form about your needs and preferences." },
            { step: "02", title: "Get Matched", desc: "We pair you with a licensed provider who fits your story." },
            { step: "03", title: "Choose Format", desc: "Virtual, in-home, or in-office — whatever works for you." },
            { step: "04", title: "Begin Healing", desc: "Your first session starts the journey toward clarity and peace." },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div className="cormorant" style={{ fontSize:40, fontWeight:300, color:GOLD, marginBottom:16 }}>{s.step}</div>
              <h3 style={{ color:CREAM, fontSize:15, fontWeight:600, marginBottom:8, letterSpacing:1 }}>{s.title}</h3>
              <p style={{ color:CREAM+"50", fontSize:13, lineHeight:1.7, fontWeight:300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"100px 40px", textAlign:"center", background:`radial-gradient(ellipse 70% 50% at 50% 50%, ${GOLD}06 0%, transparent 70%)` }}>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:300, color:CREAM, marginBottom:16 }}>Your Mind Deserves This</h2>
        <p style={{ color:CREAM+"60", fontSize:15, maxWidth:480, margin:"0 auto 40px", lineHeight:1.7 }}>No waitlists. No judgment. Just real support from real professionals who understand your world.</p>
        <button onClick={() => navTo("contact")} style={{ background:GOLD, color:DARK, border:"none", borderRadius:4, padding:"16px 48px", fontSize:14, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>
          Start Today
        </button>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════════════════════════════
function ServicesPage({ navTo }) {
  const services = [
    { title: "Individual Therapy", icon: "🧠", detail: "Personalized one-on-one therapeutic support. We help individuals overcome anxiety, depression, burnout, trauma, identity struggles, and more — with clarity, compassion, and practical tools that empower long-term growth.", features: ["Anxiety & Depression", "Trauma Recovery", "Burnout & Stress", "Identity Exploration", "Life Transitions", "Grief & Loss"] },
    { title: "Couples & Family Counseling", icon: "💛", detail: "Whether you're working through conflict, communication barriers, or transitions like co-parenting or blended families, we guide you with a framework that fosters empathy, understanding, and deeper connection.", features: ["Communication Skills", "Conflict Resolution", "Co-Parenting", "Blended Families", "Relationship Rebuilding", "Premarital Counseling"] },
    { title: "Youth & Adolescent Programs", icon: "🌱", detail: "Young people deserve support they can relate to. Our programming reimagines therapy as safe, natural mentorship — building trust while addressing emotional regulation, school stress, and identity development.", features: ["Emotional Regulation", "School Stress", "Social Anxiety", "Identity Development", "Peer Relationships", "Family Dynamics"] },
    { title: "In-Home & Virtual Sessions", icon: "🏠", detail: "Not everyone can or wants to sit in a therapist's office. We bring care directly to you — in the comfort of your home or via secure video sessions. Convenient, comfortable, confidential.", features: ["HIPAA-Compliant Video", "Licensed In-Home Visits", "Flexible Scheduling", "Evening & Weekend Slots", "Mobile-Friendly Platform", "Secure Messaging"] },
    { title: "Insurance & Medicaid Billing", icon: "🏥", detail: "Mental health care shouldn't be a financial burden. We accept most insurance plans including Medicaid. Our back-office handles claims and paperwork — so all you have to do is show up.", features: ["Most Major Insurance", "Medicaid Accepted", "Claims Handling", "Benefits Verification", "No Surprise Billing", "Sliding Scale Available"] },
    { title: "Supervised Billing for Providers", icon: "📋", detail: "Licensed therapists can partner with The Mind Studio through our supervised billing model. We handle client acquisition, intake, admin, and billing support — you focus on clinical care.", features: ["License Utilization", "Client Pipeline", "Admin Support", "Billing Infrastructure", "No Platform Lock-In", "Clinical Autonomy"] },
  ];

  return (
    <section style={{ padding:"140px 40px 100px", maxWidth:1000, margin:"0 auto" }}>
      <div className="fade-up" style={{ textAlign:"center", marginBottom:80 }}>
        <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>What We Offer</div>
        <h1 className="cormorant" style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:CREAM }}>Our Services</h1>
      </div>
      {services.map((s, i) => (
        <div key={i} style={{ marginBottom:64, padding:40, background:WARM_DARK, border:`1px solid ${GOLD}10`, borderRadius:8 }}>
          <div style={{ display:"flex", gap:20, alignItems:"flex-start", marginBottom:20 }}>
            <span style={{ fontSize:32 }}>{s.icon}</span>
            <div>
              <h2 className="cormorant" style={{ fontSize:28, fontWeight:600, color:CREAM, marginBottom:8 }}>{s.title}</h2>
              <p style={{ color:CREAM+"60", fontSize:14, lineHeight:1.8, maxWidth:600 }}>{s.detail}</p>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:16 }}>
            {s.features.map((f, j) => (
              <span key={j} style={{ background:`${GOLD}10`, border:`1px solid ${GOLD}20`, borderRadius:4, padding:"6px 14px", color:GOLD, fontSize:11, letterSpacing:0.5 }}>{f}</span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign:"center", marginTop:40 }}>
        <button onClick={() => navTo("contact")} style={{ background:GOLD, color:DARK, border:"none", borderRadius:4, padding:"14px 40px", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>Book a Consultation</button>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════
function AboutPage() {
  return (
    <section style={{ padding:"140px 40px 100px", maxWidth:900, margin:"0 auto" }}>
      <div className="fade-up" style={{ textAlign:"center", marginBottom:80 }}>
        <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>Who We Are</div>
        <h1 className="cormorant" style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:CREAM }}>About The Mind Studio</h1>
      </div>

      <div style={{ fontSize:16, lineHeight:2, color:CREAM+"80", marginBottom:48 }}>
        <p style={{ marginBottom:24 }}>The Mind Studio is a nationally recognized mental health organization delivering compassionate, convenient, and confidential care across all 50 states. Built on a philosophy that healing requires safety, comfort, and human connection, we deliver therapy in a way that fits the realities of modern life.</p>
        <p style={{ marginBottom:24 }}>Our goal is simple: provide therapy that doesn't feel like therapy. We want every person — regardless of background, insurance status, or personal history — to feel seen, heard, and supported.</p>
        <p>With a scalable national footprint and a culturally grounded approach, The Mind Studio is becoming the go-to mental health provider for individuals, families, and communities across America.</p>
      </div>

      <div style={{ width:"100%", height:1, background:`linear-gradient(90deg, transparent, ${GOLD}40, transparent)`, margin:"60px 0" }} />

      {/* VALUES */}
      <div style={{ marginBottom:60 }}>
        <h2 className="cormorant" style={{ fontSize:32, fontWeight:600, color:GOLD, marginBottom:32, textAlign:"center" }}>Our Values</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {[
            ["Compassion over credentials", "Connection is the foundation of care."],
            ["Comfort over formality", "Our sessions feel like conversations, not checklists."],
            ["Access over barriers", "Insurance, location, or stigma should never stand in the way."],
            ["Culture over conformity", "Therapy should reflect the people it serves."],
            ["Progress over perfection", "We meet clients where they are."],
            ["Presence over performance", "Your story deserves to be heard with humanity first."],
          ].map(([title, desc], i) => (
            <div key={i} style={{ padding:24, background:WARM_DARK, border:`1px solid ${GOLD}10`, borderRadius:6 }}>
              <h3 style={{ color:GOLD, fontSize:14, fontWeight:600, marginBottom:6, letterSpacing:0.5 }}>{title}</h3>
              <p style={{ color:CREAM+"60", fontSize:13, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOUNDER */}
      <div style={{ padding:40, background:`linear-gradient(135deg, ${WARM_DARK}, ${DARK})`, border:`1px solid ${GOLD}15`, borderRadius:8, textAlign:"center" }}>
        <div className="cormorant" style={{ fontSize:28, fontWeight:300, color:CREAM, marginBottom:12 }}>Founded by Dr. Bryan Dorsey</div>
        <p style={{ color:CREAM+"60", fontSize:14, lineHeight:1.8, maxWidth:500, margin:"0 auto" }}>Visionary behind The Kollective Hospitality Group. Building national infrastructure for accessible, culturally grounded mental health care.</p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROVIDERS PAGE (for therapists/clinics)
// ═══════════════════════════════════════════════════════════════
function ProvidersPage({ navTo }) {
  return (
    <section style={{ padding:"140px 40px 100px", maxWidth:1000, margin:"0 auto" }}>
      <div className="fade-up" style={{ textAlign:"center", marginBottom:80 }}>
        <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>For Licensed Professionals</div>
        <h1 className="cormorant" style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:CREAM }}>Partner With Us</h1>
        <p style={{ color:CREAM+"60", fontSize:16, maxWidth:600, margin:"20px auto 0", lineHeight:1.7 }}>The most strategic move you can make for your practice — without changing what you do best.</p>
      </div>

      {/* VALUE PROP */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:64 }}>
        <div style={{ padding:32, background:WARM_DARK, border:`1px solid ${GOLD}15`, borderRadius:8 }}>
          <h3 className="cormorant" style={{ fontSize:22, color:GOLD, marginBottom:16 }}>What We Provide</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {["Client pipeline & acquisition", "HIPAA-compliant infrastructure", "Full non-clinical operational support", "Marketing & brand licensing", "Scheduling, billing, credentialing", "No up-front fees — shared success"].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ color:GOLD, fontSize:14, marginTop:2 }}>✓</span>
                <span style={{ color:CREAM+"70", fontSize:14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:32, background:WARM_DARK, border:`1px solid ${GOLD}15`, borderRadius:8 }}>
          <h3 className="cormorant" style={{ fontSize:22, color:GOLD, marginBottom:16 }}>What Makes This Different</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {["Not locked into a rigid platform", "Not giving up your branding", "Not beholden to tech-heavy systems", "Not adding workload — removing it", "You keep full clinical autonomy", "Your license, your judgment, your practice"].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ color:GOLD, fontSize:14, marginTop:2 }}>→</span>
                <span style={{ color:CREAM+"70", fontSize:14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IDEAL FOR */}
      <div style={{ padding:40, background:`linear-gradient(135deg, ${GOLD}08, transparent)`, border:`1px solid ${GOLD}15`, borderRadius:8, marginBottom:64 }}>
        <h3 className="cormorant" style={{ fontSize:24, color:CREAM, marginBottom:24, textAlign:"center" }}>Built For Providers Who</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16 }}>
          {["Have an approved location or telehealth license", "Are great clinicians but don't want to manage logistics", "Are tired of inconsistent caseloads or late reimbursements", "Want to grow without hiring a team", "Prefer not to deal with client billing or scheduling"].map((item, i) => (
            <div key={i} style={{ background:`${DARK}80`, border:`1px solid ${GOLD}10`, borderRadius:6, padding:16, color:CREAM+"70", fontSize:13, lineHeight:1.6 }}>{item}</div>
          ))}
        </div>
      </div>

      {/* COMPENSATION */}
      <div style={{ marginBottom:64 }}>
        <h3 className="cormorant" style={{ fontSize:28, color:GOLD, marginBottom:32, textAlign:"center" }}>Three Compensation Structures</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
          {[
            { option: "A", title: "Flat Monthly", desc: "Fixed payment per month for the use of your license. No clinical duties required." },
            { option: "B", title: "Percentage-Based", desc: "Receive a percentage of gross revenue billed through your license and/or NPI." },
            { option: "C", title: "Hybrid", desc: "Base stipend plus per-client billing bonus. Flexibility meets guaranteed income." },
          ].map((c, i) => (
            <div key={i} style={{ background:WARM_DARK, border:`1px solid ${GOLD}20`, borderRadius:8, padding:32, textAlign:"center" }}>
              <div className="cormorant" style={{ fontSize:48, fontWeight:300, color:GOLD, marginBottom:8 }}>{c.option}</div>
              <h4 style={{ color:CREAM, fontSize:15, fontWeight:600, marginBottom:12, letterSpacing:1 }}>{c.title}</h4>
              <p style={{ color:CREAM+"60", fontSize:13, lineHeight:1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center" }}>
        <button onClick={() => navTo("contact")} style={{ background:GOLD, color:DARK, border:"none", borderRadius:4, padding:"16px 48px", fontSize:14, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>Schedule a Call</button>
        <p style={{ color:CREAM+"40", fontSize:12, marginTop:16 }}>15-minute private call. No contracts. No pitch. Just two professionals exploring fit.</p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "client", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    try {
      await fetch("https://dzlmtvodpyhetvektfuo.supabase.co/rest/v1/contact_submissions", {
        method: "POST",
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bG10dm9kcHloZXR2ZWt0ZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ4NjQsImV4cCI6MjA4NTE2MDg2NH0.kXoR54d1S1EOqK0CETbJGjGBxV8jA1URbqOYBsJkd5s",
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ ...form, brand_key: "mind_studio", source: "website" }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <section style={{ padding:"140px 40px 100px", maxWidth:700, margin:"0 auto" }}>
      <div className="fade-up" style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:16 }}>Get In Touch</div>
        <h1 className="cormorant" style={{ fontSize:"clamp(36px,6vw,56px)", fontWeight:300, color:CREAM }}>Let's Talk</h1>
        <p style={{ color:CREAM+"60", fontSize:15, marginTop:12 }}>If you're reading this, you've already taken the first step.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign:"center", padding:60, background:WARM_DARK, border:`1px solid ${GOLD}20`, borderRadius:8 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🧠</div>
          <h2 className="cormorant" style={{ fontSize:28, color:GOLD, marginBottom:12 }}>Message Received</h2>
          <p style={{ color:CREAM+"60", fontSize:14 }}>Our team will reach out within 24 hours. Healing starts here.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ display:"flex", gap:16 }}>
            {["client","provider","partnership"].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))} style={{ flex:1, background: form.type === t ? `${GOLD}20` : WARM_DARK, border:`1px solid ${form.type === t ? GOLD : GOLD+"20"}`, borderRadius:6, padding:"12px 16px", color: form.type === t ? GOLD : CREAM+"60", fontSize:12, letterSpacing:1, textTransform:"uppercase", fontFamily:"inherit" }}>
                {t === "client" ? "I Need Therapy" : t === "provider" ? "I'm a Provider" : "Partnership"}
              </button>
            ))}
          </div>
          {[
            { key: "name", label: "Full Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone (optional)", type: "tel" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display:"block", color:GOLD_DIM, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))} style={{ width:"100%", background:WARM_DARK, border:`1px solid ${GOLD}20`, borderRadius:4, padding:"12px 16px", color:CREAM, fontSize:14, fontFamily:"inherit", outline:"none" }} />
            </div>
          ))}
          <div>
            <label style={{ display:"block", color:GOLD_DIM, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4} style={{ width:"100%", background:WARM_DARK, border:`1px solid ${GOLD}20`, borderRadius:4, padding:"12px 16px", color:CREAM, fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }} />
          </div>
          <button onClick={handleSubmit} style={{ background:GOLD, color:DARK, border:"none", borderRadius:4, padding:"14px 40px", fontSize:14, letterSpacing:2, textTransform:"uppercase", fontWeight:600, alignSelf:"center" }}>Send Message</button>
        </div>
      )}

      {/* CONTACT INFO */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24, marginTop:60 }}>
        {[
          { icon: "📞", label: "Call or Text", value: "(404) 819-9609" },
          { icon: "📧", label: "Email", value: "theDoctorDorsey@gmail.com" },
          { icon: "📍", label: "Headquarters", value: "Atlanta, Georgia" },
        ].map((c, i) => (
          <div key={i} style={{ textAlign:"center", padding:24, background:WARM_DARK, border:`1px solid ${GOLD}10`, borderRadius:6 }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{c.icon}</div>
            <div style={{ color:GOLD_DIM, fontSize:10, letterSpacing:2, marginBottom:4, textTransform:"uppercase" }}>{c.label}</div>
            <div style={{ color:CREAM, fontSize:14 }}>{c.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
