import { useState, useEffect, useCallback } from "react";

/*
  THE MIND STUDIO — TELEMED / CLIENT PORTAL
  Purpose: Client-facing telehealth platform for intake, scheduling, sessions, mood tracking, resources
  Design: Black + Gold. Cormorant Garamond + DM Sans. Warm authority.
  Backend: Supabase (ms_clients, ms_sessions, ms_intake_forms, ms_mood_logs, ms_resources)
  Note: The marketing WEBSITE lives in GHL. This is the CLIENT APP.
*/

const SB = "https://dzlmtvodpyhetvektfuo.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bG10dm9kcHloZXR2ZWt0ZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ4NjQsImV4cCI6MjA4NTE2MDg2NH0.kXoR54d1S1EOqK0CETbJGjGBxV8jA1URbqOYBsJkd5s";
const H = { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" };

async function sbGet(path) { try { const r = await fetch(`${SB}/rest/v1/${path}`, { headers: H }); return r.ok ? await r.json() : []; } catch { return []; } }
async function sbPost(path, body) { try { await fetch(`${SB}/rest/v1/${path}`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(body) }); return true; } catch { return false; } }

const G = "#C9A84C", C = "#F5F0E8", D = "#0A0A0A", W = "#1A1612", GD = "#8A7A3D";
const FONT = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";

const TABS = [
  { id: "welcome", label: "Home", icon: "🏠" },
  { id: "intake", label: "Intake", icon: "📋" },
  { id: "sessions", label: "Sessions", icon: "📅" },
  { id: "mood", label: "Check-In", icon: "🧠" },
  { id: "resources", label: "Resources", icon: "📚" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export default function MindStudioPortal() {
  const [tab, setTab] = useState("welcome");
  const [toast, setToast] = useState(null);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${D}; color:${C}; font-family:'DM Sans',sans-serif; }
        ::selection { background:${G}30; color:${G}; }
        .cm { font-family:'Cormorant Garamond',serif; }
        input,textarea,select { font-family:inherit; }
        .grain { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:0.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
      `}</style>
      <div className="grain" />

      {/* TOAST */}
      {toast && <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:999, background:"#1a3a1a", border:"1px solid #2d5a2d", borderRadius:6, padding:"10px 24px", color:"#4ade80", fontSize:12, letterSpacing:1 }}>{toast}</div>}

      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* SIDEBAR */}
        <aside style={{ width:220, minWidth:220, background:W, borderRight:`1px solid ${G}10`, display:"flex", flexDirection:"column", padding:"24px 0" }}>
          <div style={{ padding:"0 20px 24px", borderBottom:`1px solid ${G}10` }}>
            <div className="cm" style={{ color:G, fontSize:18, fontWeight:600, letterSpacing:2 }}>THE MIND</div>
            <div className="cm" style={{ color:G, fontSize:18, fontWeight:600, letterSpacing:2 }}>STUDIO</div>
            <div style={{ color:GD, fontSize:9, letterSpacing:3, marginTop:6, textTransform:"uppercase" }}>Client Portal</div>
          </div>
          <nav style={{ flex:1, padding:"16px 0", display:"flex", flexDirection:"column", gap:2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 20px", background: tab === t.id ? `${G}12` : "transparent",
                border:"none", borderLeft: tab === t.id ? `2px solid ${G}` : "2px solid transparent",
                color: tab === t.id ? G : `${C}50`, fontSize:13, letterSpacing:0.5, cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.2s"
              }}>
                <span style={{ fontSize:16 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${G}10` }}>
            <div style={{ color:`${C}30`, fontSize:10, letterSpacing:1 }}>Need help?</div>
            <div style={{ color:GD, fontSize:11, marginTop:4 }}>988 (Crisis Line)</div>
            <div style={{ color:GD, fontSize:11 }}>(404) 819-9609</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex:1, overflow:"auto", padding:32 }}>
          {tab === "welcome" && <WelcomeTab setTab={setTab} />}
          {tab === "intake" && <IntakeTab notify={notify} />}
          {tab === "sessions" && <SessionsTab />}
          {tab === "mood" && <MoodTab notify={notify} />}
          {tab === "resources" && <ResourcesTab />}
          {tab === "profile" && <ProfileTab />}
        </main>
      </div>
    </>
  );
}

// ═══ WELCOME ═══
function WelcomeTab({ setTab }) {
  return (
    <div style={{ maxWidth:800 }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>Welcome Back</div>
        <h1 className="cm" style={{ fontSize:"clamp(32px,5vw,48px)", fontWeight:300, color:C, lineHeight:1.2 }}>Your Mind Matters Here</h1>
        <p style={{ color:`${C}60`, fontSize:15, lineHeight:1.8, marginTop:16, maxWidth:560 }}>This is your private space for healing. Complete your intake, schedule sessions, track your mood, and access tools designed to support your journey.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:40 }}>
        {[
          { icon:"📋", title:"Complete Intake", desc:"Tell us about yourself so we can match you with the right provider.", action:"intake" },
          { icon:"📅", title:"View Sessions", desc:"See upcoming appointments and session history.", action:"sessions" },
          { icon:"🧠", title:"Daily Check-In", desc:"Track your mood, energy, and progress over time.", action:"mood" },
          { icon:"📚", title:"Resources", desc:"Breathing exercises, journal prompts, and wellness tools.", action:"resources" },
        ].map((c, i) => (
          <button key={i} onClick={() => setTab(c.action)} style={{ background:W, border:`1px solid ${G}10`, borderRadius:8, padding:24, textAlign:"left", cursor:"pointer", fontFamily:"inherit", transition:"border-color 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = G+"40"} onMouseLeave={e => e.currentTarget.style.borderColor = G+"10"}>
            <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
            <div style={{ color:C, fontSize:14, fontWeight:600, marginBottom:6 }}>{c.title}</div>
            <div style={{ color:`${C}50`, fontSize:12, lineHeight:1.6 }}>{c.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ background:`linear-gradient(135deg, ${G}08, transparent)`, border:`1px solid ${G}15`, borderRadius:8, padding:32 }}>
        <h3 className="cm" style={{ fontSize:22, color:G, marginBottom:8 }}>Crisis Support Available 24/7</h3>
        <p style={{ color:`${C}60`, fontSize:13, lineHeight:1.7 }}>If you are in crisis, please call 988 (Suicide & Crisis Lifeline) or text HOME to 741741. For emergencies, call 911.</p>
      </div>
    </div>
  );
}

// ═══ INTAKE ═══
function IntakeTab({ notify }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    first_name:"", last_name:"", email:"", phone:"", dob:"", state:"", city:"",
    insurance_provider:"", insurance_id:"", medicaid:false,
    session_format:"virtual", client_type:"individual", referral_source:"",
    chief_complaint:"", goals:"", previous_therapy:false, current_medications:"",
    emergency_contact_name:"", emergency_contact_phone:"",
    hipaa_consent:false, telehealth_consent:false
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const clientData = {
      first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone,
      date_of_birth: form.dob || null, state: form.state, city: form.city,
      insurance_provider: form.insurance_provider, insurance_id: form.insurance_id,
      medicaid: form.medicaid, session_format: form.session_format, client_type: form.client_type,
      referral_source: form.referral_source, consent_signed: form.telehealth_consent, hipaa_signed: form.hipaa_consent,
      intake_status: "submitted"
    };
    const intakeData = { form_type: "initial_intake", form_data: form, hipaa_consent: form.hipaa_consent, telehealth_consent: form.telehealth_consent };
    await sbPost("ms_intake_forms", intakeData);
    setSubmitted(true);
    notify("Intake submitted successfully");
  };

  if (submitted) return (
    <div style={{ maxWidth:600, textAlign:"center", padding:"80px 0" }}>
      <div style={{ fontSize:64, marginBottom:24 }}>✅</div>
      <h2 className="cm" style={{ fontSize:32, color:G, marginBottom:12 }}>Intake Complete</h2>
      <p style={{ color:`${C}60`, fontSize:14, lineHeight:1.8 }}>Thank you. Our team will review your information, verify your insurance, and match you with a licensed therapist within 24-48 hours. You'll receive a confirmation email with next steps.</p>
    </div>
  );

  const Input = ({ label, k, type="text", required=false, placeholder="" }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>{label}{required && <span style={{ color:"#e05555" }}> *</span>}</label>
      <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={{ width:"100%", background:W, border:`1px solid ${G}15`, borderRadius:4, padding:"11px 14px", color:C, fontSize:13, outline:"none" }} />
    </div>
  );

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:8 }}>Intake Form</div>
        <h1 className="cm" style={{ fontSize:36, fontWeight:300, color:C }}>Tell Us About You</h1>
        <p style={{ color:`${C}50`, fontSize:13, marginTop:8 }}>Step {step} of 4 — All information is confidential and HIPAA-protected.</p>
      </div>

      {/* PROGRESS */}
      <div style={{ display:"flex", gap:4, marginBottom:32 }}>
        {[1,2,3,4].map(s => <div key={s} style={{ flex:1, height:3, borderRadius:2, background: s <= step ? G : `${G}20`, transition:"background 0.3s" }} />)}
      </div>

      {step === 1 && (
        <div>
          <h3 style={{ color:G, fontSize:13, letterSpacing:2, marginBottom:20, textTransform:"uppercase" }}>Personal Information</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Input label="First Name" k="first_name" required />
            <Input label="Last Name" k="last_name" required />
          </div>
          <Input label="Email" k="email" type="email" required />
          <Input label="Phone" k="phone" type="tel" />
          <Input label="Date of Birth" k="dob" type="date" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Input label="State" k="state" />
            <Input label="City" k="city" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 style={{ color:G, fontSize:13, letterSpacing:2, marginBottom:20, textTransform:"uppercase" }}>Insurance & Preferences</h3>
          <Input label="Insurance Provider" k="insurance_provider" placeholder="e.g., Amerigroup, Peach State, Anthem" />
          <Input label="Member/Policy ID" k="insurance_id" />
          <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <input type="checkbox" checked={form.medicaid} onChange={e => set("medicaid", e.target.checked)} style={{ accentColor:G }} />
            <label style={{ color:`${C}70`, fontSize:13 }}>I am enrolled in Medicaid</label>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>Preferred Session Format</label>
            <div style={{ display:"flex", gap:8 }}>
              {["virtual","in_home","in_office"].map(f => (
                <button key={f} onClick={() => set("session_format", f)} style={{ flex:1, padding:"10px 12px", background: form.session_format === f ? `${G}20` : W, border:`1px solid ${form.session_format === f ? G : G+"20"}`, borderRadius:4, color: form.session_format === f ? G : `${C}60`, fontSize:12, letterSpacing:1, cursor:"pointer", fontFamily:"inherit", textTransform:"uppercase" }}>
                  {f.replace(/_/g," ")}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>Session Type</label>
            <div style={{ display:"flex", gap:8 }}>
              {["individual","couples","family","youth"].map(t => (
                <button key={t} onClick={() => set("client_type", t)} style={{ flex:1, padding:"10px 12px", background: form.client_type === t ? `${G}20` : W, border:`1px solid ${form.client_type === t ? G : G+"20"}`, borderRadius:4, color: form.client_type === t ? G : `${C}60`, fontSize:12, cursor:"pointer", fontFamily:"inherit", textTransform:"uppercase" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Input label="How Did You Hear About Us?" k="referral_source" placeholder="e.g., Doctor referral, Google, friend" />
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 style={{ color:G, fontSize:13, letterSpacing:2, marginBottom:20, textTransform:"uppercase" }}>Clinical Information</h3>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>What brings you to therapy?</label>
            <textarea value={form.chief_complaint} onChange={e => set("chief_complaint", e.target.value)} rows={4} placeholder="Tell us in your own words..." style={{ width:"100%", background:W, border:`1px solid ${G}15`, borderRadius:4, padding:"11px 14px", color:C, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>Goals for Therapy</label>
            <textarea value={form.goals} onChange={e => set("goals", e.target.value)} rows={3} placeholder="What would progress look like for you?" style={{ width:"100%", background:W, border:`1px solid ${G}15`, borderRadius:4, padding:"11px 14px", color:C, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
          <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <input type="checkbox" checked={form.previous_therapy} onChange={e => set("previous_therapy", e.target.checked)} style={{ accentColor:G }} />
            <label style={{ color:`${C}70`, fontSize:13 }}>I have attended therapy before</label>
          </div>
          <Input label="Current Medications (if any)" k="current_medications" placeholder="List any current medications" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Input label="Emergency Contact Name" k="emergency_contact_name" />
            <Input label="Emergency Contact Phone" k="emergency_contact_phone" type="tel" />
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 style={{ color:G, fontSize:13, letterSpacing:2, marginBottom:20, textTransform:"uppercase" }}>Consent & Agreements</h3>
          <div style={{ background:W, border:`1px solid ${G}15`, borderRadius:8, padding:24, marginBottom:20 }}>
            <h4 style={{ color:C, fontSize:14, fontWeight:600, marginBottom:12 }}>HIPAA Notice of Privacy Practices</h4>
            <p style={{ color:`${C}50`, fontSize:12, lineHeight:1.8, marginBottom:16 }}>The Mind Studio is committed to protecting your personal health information in accordance with HIPAA regulations. Your information will only be used for treatment, payment, and healthcare operations. You have the right to access, amend, and request restrictions on your health information.</p>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="checkbox" checked={form.hipaa_consent} onChange={e => set("hipaa_consent", e.target.checked)} style={{ accentColor:G }} />
              <label style={{ color:C, fontSize:13 }}>I acknowledge and agree to the HIPAA Notice of Privacy Practices</label>
            </div>
          </div>
          <div style={{ background:W, border:`1px solid ${G}15`, borderRadius:8, padding:24, marginBottom:20 }}>
            <h4 style={{ color:C, fontSize:14, fontWeight:600, marginBottom:12 }}>Telehealth Informed Consent</h4>
            <p style={{ color:`${C}50`, fontSize:12, lineHeight:1.8, marginBottom:16 }}>I understand that telehealth involves the use of electronic communications to deliver health care services. I consent to participate in telehealth sessions with a licensed provider through The Mind Studio's HIPAA-compliant platform. I understand that telehealth has limitations and that I can withdraw consent at any time.</p>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="checkbox" checked={form.telehealth_consent} onChange={e => set("telehealth_consent", e.target.checked)} style={{ accentColor:G }} />
              <label style={{ color:C, fontSize:13 }}>I consent to telehealth services through The Mind Studio</label>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:32 }}>
        {step > 1 ? <Btn label="← Back" color={W} textColor={`${C}60`} border={`${G}20`} onClick={() => setStep(s => s-1)} /> : <div />}
        {step < 4 ?
          <Btn label="Continue →" color={`${G}15`} textColor={G} border={G+"40"} onClick={() => setStep(s => s+1)} /> :
          <Btn label="Submit Intake" color={G} textColor={D} border={G} onClick={submit} disabled={!form.hipaa_consent || !form.telehealth_consent || !form.first_name || !form.email} />
        }
      </div>
    </div>
  );
}

// ═══ SESSIONS ═══
function SessionsTab() {
  return (
    <div style={{ maxWidth:700 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:8 }}>Sessions</div>
        <h1 className="cm" style={{ fontSize:36, fontWeight:300, color:C }}>Your Appointments</h1>
      </div>
      <div style={{ textAlign:"center", padding:"80px 0" }}>
        <div style={{ fontSize:48, marginBottom:16, opacity:0.3 }}>📅</div>
        <p style={{ color:`${C}40`, fontSize:14, lineHeight:1.8 }}>Once you complete your intake and are matched with a therapist, your sessions will appear here. You'll be able to view upcoming appointments, join virtual sessions, and review past session notes.</p>
        <div style={{ marginTop:24, color:GD, fontSize:12 }}>Scheduling is managed through our secure booking system.</div>
      </div>
    </div>
  );
}

// ═══ MOOD CHECK-IN ═══
function MoodTab({ notify }) {
  const [mood, setMood] = useState({ mood_score:5, energy_level:5, anxiety_level:5, sleep_quality:5, notes:"" });
  const [history, setHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const submitMood = async () => {
    await sbPost("ms_mood_logs", mood);
    setSubmitted(true);
    notify("Check-in logged");
    setTimeout(() => setSubmitted(false), 5000);
  };

  const Slider = ({ label, k, low, high, emoji }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <label style={{ color:C, fontSize:13, fontWeight:500 }}>{emoji} {label}</label>
        <span className="cm" style={{ color:G, fontSize:24, fontWeight:300 }}>{mood[k]}</span>
      </div>
      <input type="range" min={1} max={10} value={mood[k]} onChange={e => setMood(m => ({...m, [k]: parseInt(e.target.value)}))} style={{ width:"100%", accentColor:G, height:4 }} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ color:`${C}30`, fontSize:10 }}>{low}</span>
        <span style={{ color:`${C}30`, fontSize:10 }}>{high}</span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:8 }}>Daily Check-In</div>
        <h1 className="cm" style={{ fontSize:36, fontWeight:300, color:C }}>How Are You Today?</h1>
        <p style={{ color:`${C}50`, fontSize:13, marginTop:8 }}>Track your mental state over time. Your therapist can use this data to support your care plan.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign:"center", padding:"60px 0", background:W, border:`1px solid ${G}15`, borderRadius:8 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🧠</div>
          <h3 className="cm" style={{ color:G, fontSize:24 }}>Check-In Recorded</h3>
          <p style={{ color:`${C}50`, fontSize:13, marginTop:8 }}>Thank you for checking in. Consistency builds clarity.</p>
        </div>
      ) : (
        <div style={{ background:W, border:`1px solid ${G}10`, borderRadius:8, padding:32 }}>
          <Slider label="Mood" k="mood_score" low="Very Low" high="Great" emoji="😊" />
          <Slider label="Energy" k="energy_level" low="Exhausted" high="Energized" emoji="⚡" />
          <Slider label="Anxiety" k="anxiety_level" low="Calm" high="Very Anxious" emoji="😰" />
          <Slider label="Sleep Quality" k="sleep_quality" low="Poor" high="Excellent" emoji="😴" />
          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", color:GD, fontSize:10, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>Any notes for today?</label>
            <textarea value={mood.notes} onChange={e => setMood(m => ({...m, notes: e.target.value}))} rows={3} placeholder="What's on your mind..." style={{ width:"100%", background:D, border:`1px solid ${G}15`, borderRadius:4, padding:"11px 14px", color:C, fontSize:13, outline:"none", resize:"vertical" }} />
          </div>
          <button onClick={submitMood} style={{ width:"100%", background:G, color:D, border:"none", borderRadius:4, padding:"14px", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Log Check-In</button>
        </div>
      )}
    </div>
  );
}

// ═══ RESOURCES ═══
function ResourcesTab() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    sbGet("ms_resources?for_audience=eq.client&is_active=eq.true&order=category").then(r => { setResources(r); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color:`${C}30`, padding:40, textAlign:"center" }}>Loading resources...</div>;

  const categories = ["all", ...new Set(resources.map(r => r.category))];
  const filtered = filter === "all" ? resources : resources.filter(r => r.category === filter);

  const catColors = { affirmations:"#C9A84C", breathing:"#5B9BD5", journaling:"#A78BFA", grounding:"#4ade80", education:"#F59E0B", practical:"#06B6D4", assessment:"#EC4899", crisis:"#EF4444" };

  return (
    <div style={{ maxWidth:800 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:8 }}>Wellness Library</div>
        <h1 className="cm" style={{ fontSize:36, fontWeight:300, color:C }}>Resources & Tools</h1>
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:24 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? `${G}15` : W, border:`1px solid ${filter === c ? G : G+"15"}`, borderRadius:4, padding:"6px 14px", color: filter === c ? G : `${C}50`, fontSize:11, letterSpacing:1, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>{c}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background:W, border:`1px solid ${G}10`, borderRadius:8, padding:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ background:(catColors[r.category] || G) + "20", color:catColors[r.category] || G, padding:"2px 8px", borderRadius:3, fontSize:10, letterSpacing:1, textTransform:"uppercase" }}>{r.category}</span>
              <span style={{ color:`${C}30`, fontSize:10, letterSpacing:1, textTransform:"uppercase" }}>{r.content_type}</span>
            </div>
            <h3 style={{ color:C, fontSize:16, fontWeight:600, marginBottom:8 }}>{r.title}</h3>
            <p style={{ color:`${C}60`, fontSize:13, lineHeight:1.8 }}>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ PROFILE ═══
function ProfileTab() {
  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ color:GD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:8 }}>Your Account</div>
        <h1 className="cm" style={{ fontSize:36, fontWeight:300, color:C }}>Profile</h1>
      </div>
      <div style={{ textAlign:"center", padding:"60px 0", background:W, border:`1px solid ${G}15`, borderRadius:8 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`${G}20`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <span style={{ fontSize:32 }}>👤</span>
        </div>
        <p style={{ color:`${C}50`, fontSize:14 }}>Profile management will be available after your intake is complete and your account is verified.</p>
        <div style={{ marginTop:20, color:GD, fontSize:12 }}>For account questions: theDoctorDorsey@gmail.com</div>
      </div>
    </div>
  );
}

// ═══ SHARED ═══
function Btn({ label, color, textColor, border, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ background:color, color:textColor, border:`1px solid ${border}`, borderRadius:4, padding:"12px 28px", fontSize:12, letterSpacing:1.5, textTransform:"uppercase", cursor: disabled ? "not-allowed" : "pointer", fontFamily:"inherit", opacity: disabled ? 0.4 : 1 }}>{label}</button>;
}
