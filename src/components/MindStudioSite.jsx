import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

/*
  THE MIND STUDIO — 3-PORTAL SYSTEM
  Design: "Quiet Authority" — warm, grounded, clinical trust meets luxury wellness
  Palette: #080808 base · #C9A84C gold · #7B9E87 sage · #F5F0E8 cream · #1A1612 warm dark · #2A3A2F sage dark
  Typography: Cormorant Garamond (display) · DM Sans (body)
  Portals: Client (6 sections) · Therapist (5 sections) · BOH Ops (6 sections)
  Quality: Good Times level — animated, interactive, data-rich, production-grade
*/

const SB = "https://dzlmtvodpyhetvektfuo.supabase.co";
const AK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bG10dm9kcHloZXR2ZWt0ZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ4NjQsImV4cCI6MjA4NTE2MDg2NH0.kXoR54d1S1EOqK0CETbJGjGBxV8jA1URbqOYBsJkd5s";
const SK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bG10dm9kcHloZXR2ZWt0ZnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NDg2NCwiZXhwIjoyMDg1MTYwODY0fQ.lhtEGfGYYhEZxzrUl3EN1h53IPyfM8TBpwpoFqdgQVs";
const H = { apikey: AK, Authorization: `Bearer ${AK}`, "Content-Type": "application/json" };
const HS = { apikey: SK, Authorization: `Bearer ${SK}`, "Content-Type": "application/json" };

async function sbGet(p, svc=false) { try { const r = await fetch(`${SB}/rest/v1/${p}`, { headers: svc ? HS : H }); return r.ok ? r.json() : []; } catch { return []; } }
async function sbPost(p, b) { try { await fetch(`${SB}/rest/v1/${p}`, { method:"POST", headers:{...H, Prefer:"return=minimal"}, body:JSON.stringify(b) }); return true; } catch { return false; } }

// ═══ DESIGN TOKENS ═══
const $ = { bg:"#080808", gold:"#C9A84C", sage:"#7B9E87", cream:"#F5F0E8", warm:"#1A1612", sageDk:"#2A3A2F", goldDim:"#8A7A3D", goldGlow:"#C9A84C18", sageGlow:"#7B9E8718", border:"#C9A84C10", borderHover:"#C9A84C30" };
const FONT = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap";

// ═══ PORTAL DEFINITIONS ═══
const PORTALS = {
  client: { label: "CLIENT PORTAL", icon: "🧠", color: $.gold, sections: [
    { id:"welcome", label:"Welcome", icon:"🏠" },
    { id:"intake", label:"Intake", icon:"📋" },
    { id:"sessions", label:"Sessions", icon:"📅" },
    { id:"tools", label:"Daily Tools", icon:"🧘" },
    { id:"resources", label:"Resources", icon:"📚" },
    { id:"community", label:"Community", icon:"👥" },
    { id:"billing", label:"Billing", icon:"💳" },
  ]},
  therapist: { label: "THERAPIST PORTAL", color: $.sage, icon: "🩺", sections: [
    { id:"t_welcome", label:"Onboarding", icon:"🏁" },
    { id:"t_systems", label:"Systems", icon:"🧾" },
    { id:"t_education", label:"Education", icon:"🎓" },
    { id:"t_support", label:"Support", icon:"📬" },
    { id:"t_billing", label:"Compensation", icon:"💰" },
  ]},
  boh: { label: "BOH OPS", color: "#5B9BD5", icon: "⚙️", sections: [
    { id:"b_overview", label:"Overview", icon:"🧭" },
    { id:"b_tasks", label:"Tasks", icon:"📋" },
    { id:"b_workflow", label:"Workflow", icon:"📝" },
    { id:"b_insurance", label:"Billing", icon:"💳" },
    { id:"b_training", label:"Training", icon:"🧠" },
    { id:"b_reports", label:"Reports", icon:"🧾" },
  ]},
};

export default function MindStudioApp() {
  const [portal, setPortal] = useState("client");
  const [section, setSection] = useState("welcome");
  const [toast, setToast] = useState(null);
  const [time, setTime] = useState(new Date());
  const [animIn, setAnimIn] = useState(true);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t); }, []);

  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const switchSection = (s) => { setAnimIn(false); setTimeout(() => { setSection(s); setAnimIn(true); }, 200); };
  const switchPortal = (p) => { setPortal(p); setSection(PORTALS[p].sections[0].id); setAnimIn(true); };

  const P = PORTALS[portal];
  const accent = P.color;

  return (
    <>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:${$.bg};color:${$.cream};font-family:'DM Sans',sans-serif;overflow-x:hidden}
        ::selection{background:${accent}30;color:${accent}}
        .cm{font-family:'Cormorant Garamond',serif}
        input,textarea,select{font-family:inherit}
        .grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        .anim-up{animation:fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards}
        .anim-in{animation:fadeIn 0.6s ease forwards}
        .anim-slide{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        input:focus,textarea:focus,select:focus{outline:none;border-color:${accent}40 !important}
      `}</style>
      <div className="grain"/>

      {/* TOAST */}
      {toast && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:999,background:$.sageDk,border:`1px solid ${$.sage}40`,borderRadius:8,padding:"10px 24px",color:$.sage,fontSize:12,letterSpacing:1,animation:"fadeUp 0.4s ease"}}>{toast}</div>}

      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* ═══ SIDEBAR ═══ */}
        <aside style={{width:240,minWidth:240,background:$.warm,borderRight:`1px solid ${$.border}`,display:"flex",flexDirection:"column"}}>

          {/* BRAND */}
          <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${$.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`${accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{P.icon}</div>
              <div>
                <div className="cm" style={{color:accent,fontSize:15,fontWeight:600,letterSpacing:2,lineHeight:1}}>THE MIND</div>
                <div className="cm" style={{color:accent,fontSize:15,fontWeight:600,letterSpacing:2,lineHeight:1}}>STUDIO</div>
              </div>
            </div>
            <div style={{color:`${$.cream}25`,fontSize:9,letterSpacing:3,textTransform:"uppercase"}}>{P.label}</div>
          </div>

          {/* PORTAL SWITCHER */}
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${$.border}`,display:"flex",gap:4}}>
            {Object.entries(PORTALS).map(([k,v]) => (
              <button key={k} onClick={() => switchPortal(k)} style={{flex:1,padding:"6px 4px",background:portal===k?`${v.color}15`:"transparent",border:`1px solid ${portal===k?v.color+"40":"transparent"}`,borderRadius:4,color:portal===k?v.color:`${$.cream}30`,fontSize:9,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",transition:"all 0.3s"}}>{v.icon}</button>
            ))}
          </div>

          {/* SECTIONS */}
          <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}} className="scrollbar-hide">
            {P.sections.map((s,i) => (
              <button key={s.id} onClick={() => switchSection(s.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 20px",background:section===s.id?`${accent}08`:"transparent",border:"none",borderLeft:section===s.id?`2px solid ${accent}`:"2px solid transparent",color:section===s.id?accent:`${$.cream}40`,fontSize:12,letterSpacing:0.5,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.25s",animationDelay:`${i*50}ms`}} className={section===s.id?"":""}
                onMouseEnter={e=>{if(section!==s.id)e.currentTarget.style.color=`${$.cream}60`}}
                onMouseLeave={e=>{if(section!==s.id)e.currentTarget.style.color=`${$.cream}40`}}>
                <span style={{fontSize:15,width:20,textAlign:"center"}}>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>

          {/* FOOTER */}
          <div style={{padding:"14px 20px",borderTop:`1px solid ${$.border}`}}>
            <div style={{color:`${$.cream}20`,fontSize:9,letterSpacing:1,marginBottom:4}}>
              {time.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </div>
            <div style={{color:`${$.cream}15`,fontSize:9}}>Need help? Call 988 · (404) 819-9609</div>
          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main style={{flex:1,overflow:"auto",padding:"28px 36px",opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(8px)",transition:"opacity 0.3s, transform 0.3s"}} className="scrollbar-hide">

          {/* CLIENT PORTAL SECTIONS */}
          {section === "welcome" && <ClientWelcome switchSection={switchSection} accent={accent} />}
          {section === "intake" && <ClientIntake notify={notify} accent={accent} />}
          {section === "sessions" && <ClientSessions accent={accent} />}
          {section === "tools" && <ClientTools accent={accent} />}
          {section === "resources" && <ClientResources accent={accent} />}
          {section === "community" && <ClientCommunity accent={accent} />}
          {section === "billing" && <ClientBilling accent={accent} />}

          {/* THERAPIST PORTAL SECTIONS */}
          {section === "t_welcome" && <TherapistOnboarding accent={accent} />}
          {section === "t_systems" && <TherapistSystems accent={accent} />}
          {section === "t_education" && <TherapistEducation accent={accent} />}
          {section === "t_support" && <TherapistSupport accent={accent} notify={notify} />}
          {section === "t_billing" && <TherapistBilling accent={accent} />}

          {/* BOH PORTAL SECTIONS */}
          {section === "b_overview" && <BOHOverview accent={accent} />}
          {section === "b_tasks" && <BOHTasks accent={accent} notify={notify} />}
          {section === "b_workflow" && <BOHWorkflow accent={accent} />}
          {section === "b_insurance" && <BOHInsurance accent={accent} />}
          {section === "b_training" && <BOHTraining accent={accent} />}
          {section === "b_reports" && <BOHReports accent={accent} />}
        </main>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function SectionHeader({title, subtitle, accent}) {
  return (
    <div className="anim-up" style={{marginBottom:32}}>
      <h1 className="cm" style={{fontSize:"clamp(28px,4vw,40px)",fontWeight:300,color:$.cream,lineHeight:1.2}}>{title}</h1>
      {subtitle && <p style={{color:`${$.cream}50`,fontSize:13,marginTop:8,maxWidth:500,lineHeight:1.7}}>{subtitle}</p>}
      <div style={{width:40,height:1,background:`linear-gradient(90deg,${accent},transparent)`,marginTop:16}}/>
    </div>
  );
}
function Card({children, accent, glow, hover=true, style={}}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{background:$.warm,border:`1px solid ${hovered&&hover?accent+"30":$.border}`,borderRadius:8,padding:24,transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)",transform:hovered&&hover?"translateY(-2px)":"none",boxShadow:glow&&hovered?`0 8px 32px ${accent}08`:"none",...style}}>
      {children}
    </div>
  );
}
function Btn({label,color,textColor,onClick,full,disabled,size="md"}) {
  const pad = size==="sm"?"6px 14px":size==="lg"?"14px 36px":"10px 24px";
  const fs = size==="sm"?10:size==="lg"?13:11;
  return <button onClick={onClick} disabled={disabled} style={{background:color,color:textColor,border:`1px solid ${textColor}30`,borderRadius:4,padding:pad,fontSize:fs,letterSpacing:1.5,textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?0.4:1,width:full?"100%":"auto",transition:"all 0.2s",fontWeight:500}}>{label}</button>;
}
function Stat({label,value,sub,accent,icon}) {
  return (
    <Card accent={accent} glow>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:`${$.cream}35`,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{label}</div>
          <div className="cm" style={{fontSize:32,fontWeight:300,color:accent}}>{value}</div>
          {sub && <div style={{color:`${$.cream}30`,fontSize:10,marginTop:4}}>{sub}</div>}
        </div>
        {icon && <span style={{fontSize:24,opacity:0.3}}>{icon}</span>}
      </div>
    </Card>
  );
}
function InputField({label,value,onChange,type="text",placeholder="",rows}) {
  const shared = {width:"100%",background:`${$.bg}80`,border:`1px solid ${$.border}`,borderRadius:4,padding:"10px 14px",color:$.cream,fontSize:13,fontFamily:"inherit"};
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",color:$.goldDim,fontSize:9,letterSpacing:2,marginBottom:5,textTransform:"uppercase"}}>{label}</label>
      {rows ? <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{...shared,resize:"vertical"}}/> : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={shared}/>}
    </div>
  );
}
function ProgressBar({value,max=100,accent,height=3}) {
  return <div style={{width:"100%",height,background:`${accent}15`,borderRadius:2,overflow:"hidden"}}><div style={{width:`${(value/max)*100}%`,height:"100%",background:accent,borderRadius:2,transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)"}}/></div>;
}

// ═══════════════════════════════════════════════════════════════════════
// CLIENT PORTAL — Section 1: Welcome & Onboarding
// ═══════════════════════════════════════════════════════════════════════
function ClientWelcome({switchSection, accent}) {
  const cards = [
    {icon:"📋",title:"Complete Intake",desc:"Tell us about yourself for therapist matching",action:"intake",progress:0},
    {icon:"📅",title:"Book Session",desc:"Schedule your first appointment",action:"sessions",progress:0},
    {icon:"🧘",title:"Daily Check-In",desc:"Track mood, energy, and sleep",action:"tools",progress:0},
    {icon:"📚",title:"Explore Resources",desc:"Breathing, journaling, and wellness tools",action:"resources",progress:0},
    {icon:"👥",title:"Community",desc:"Connect with support groups and events",action:"community",progress:0},
    {icon:"💳",title:"Insurance & Billing",desc:"Manage coverage and payments",action:"billing",progress:0},
  ];
  return (
    <div style={{maxWidth:900}}>
      <SectionHeader title="Welcome to Your Healing Space" subtitle="This is your private, confidential portal. Everything here is designed to support your journey — at your pace, on your terms." accent={accent}/>

      {/* QUICK START CHECKLIST */}
      <Card accent={accent} style={{marginBottom:24,background:`linear-gradient(135deg,${$.warm},${$.bg})`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:`${accent}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:16}}>✨</span></div>
          <div>
            <div style={{color:accent,fontSize:13,fontWeight:600,letterSpacing:1}}>QUICK START CHECKLIST</div>
            <div style={{color:`${$.cream}40`,fontSize:11}}>Complete these steps to begin therapy</div>
          </div>
          <div style={{marginLeft:"auto"}}>
            <span className="cm" style={{fontSize:28,color:accent}}>0/4</span>
          </div>
        </div>
        <ProgressBar value={0} accent={accent}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:16}}>
          {["Complete Intake","Verify Insurance","Match Therapist","Book First Session"].map((s,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",background:`${$.bg}50`,borderRadius:4,border:`1px solid ${$.border}`}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:`1.5px solid ${$.cream}20`,flexShrink:0}}/>
              <span style={{color:`${$.cream}40`,fontSize:11}}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION CARDS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
        {cards.map((c,i) => (
          <button key={i} onClick={()=>switchSection(c.action)} style={{background:$.warm,border:`1px solid ${$.border}`,borderRadius:8,padding:20,textAlign:"left",cursor:"pointer",fontFamily:"inherit",transition:"all 0.3s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=accent+"30";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=$.border;e.currentTarget.style.transform="none"}}>
            <span style={{fontSize:28,display:"block",marginBottom:12}}>{c.icon}</span>
            <div style={{color:$.cream,fontSize:14,fontWeight:600,marginBottom:4}}>{c.title}</div>
            <div style={{color:`${$.cream}40`,fontSize:12,lineHeight:1.5}}>{c.desc}</div>
          </button>
        ))}
      </div>

      {/* CRISIS BANNER */}
      <div style={{marginTop:24,padding:"16px 20px",background:`${$.sageDk}40`,border:`1px solid ${$.sage}20`,borderRadius:8,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:20}}>💚</span>
        <div>
          <div style={{color:$.sage,fontSize:12,fontWeight:600}}>Crisis Support Available 24/7</div>
          <div style={{color:`${$.cream}40`,fontSize:11}}>988 Suicide & Crisis Lifeline · Text HOME to 741741 · Emergencies: 911</div>
        </div>
      </div>
    </div>
  );
}

// ═══ CLIENT — Section 2: Intake ═══
function ClientIntake({notify, accent}) {
  const [step,setStep] = useState(1);
  const [f,setF] = useState({first_name:"",last_name:"",email:"",phone:"",dob:"",state:"",city:"",insurance:"",member_id:"",medicaid:false,format:"virtual",type:"individual",referral:"",complaint:"",goals:"",prev_therapy:false,meds:"",ec_name:"",ec_phone:"",hipaa:false,telehealth:false});
  const [done,setDone] = useState(false);
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  const submit = async () => {
    await sbPost("ms_intake_forms",{form_type:"initial_intake",form_data:f,hipaa_consent:f.hipaa,telehealth_consent:f.telehealth});
    setDone(true); notify("Intake submitted");
  };

  if(done) return (
    <div style={{maxWidth:560,textAlign:"center",paddingTop:80}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:`${accent}15`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:36}}>✅</div>
      <h2 className="cm" style={{fontSize:32,color:accent,marginBottom:12}}>Intake Complete</h2>
      <p style={{color:`${$.cream}50`,fontSize:14,lineHeight:1.8}}>Our team will verify your insurance, match you with a licensed therapist, and contact you within 24-48 hours.</p>
    </div>
  );

  return (
    <div style={{maxWidth:640}}>
      <SectionHeader title="Intake Form" subtitle={`Step ${step} of 4 — All information is HIPAA-protected and confidential.`} accent={accent}/>
      <div style={{display:"flex",gap:4,marginBottom:28}}>{[1,2,3,4].map(n=><div key={n} style={{flex:1,height:3,borderRadius:2,background:n<=step?accent:`${accent}20`,transition:"background 0.4s"}}/>)}</div>

      {step===1 && <div className="anim-slide">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <InputField label="First Name" value={f.first_name} onChange={e=>s("first_name",e.target.value)}/>
          <InputField label="Last Name" value={f.last_name} onChange={e=>s("last_name",e.target.value)}/>
        </div>
        <InputField label="Email" value={f.email} onChange={e=>s("email",e.target.value)} type="email"/>
        <InputField label="Phone" value={f.phone} onChange={e=>s("phone",e.target.value)} type="tel"/>
        <InputField label="Date of Birth" value={f.dob} onChange={e=>s("dob",e.target.value)} type="date"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <InputField label="State" value={f.state} onChange={e=>s("state",e.target.value)}/>
          <InputField label="City" value={f.city} onChange={e=>s("city",e.target.value)}/>
        </div>
      </div>}

      {step===2 && <div className="anim-slide">
        <InputField label="Insurance Provider" value={f.insurance} onChange={e=>s("insurance",e.target.value)} placeholder="e.g., Amerigroup, Peach State, Anthem"/>
        <InputField label="Member/Policy ID" value={f.member_id} onChange={e=>s("member_id",e.target.value)}/>
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <input type="checkbox" checked={f.medicaid} onChange={e=>s("medicaid",e.target.checked)} style={{accentColor:accent}}/>
          <label style={{color:`${$.cream}60`,fontSize:13}}>I am enrolled in Medicaid</label>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",color:$.goldDim,fontSize:9,letterSpacing:2,marginBottom:5,textTransform:"uppercase"}}>Session Format</label>
          <div style={{display:"flex",gap:6}}>{["virtual","in_home","in_office"].map(v=>(
            <button key={v} onClick={()=>s("format",v)} style={{flex:1,padding:"10px",background:f.format===v?`${accent}15`:$.bg,border:`1px solid ${f.format===v?accent:$.border}`,borderRadius:4,color:f.format===v?accent:`${$.cream}40`,fontSize:11,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase"}}>{v.replace(/_/g," ")}</button>
          ))}</div>
        </div>
        <InputField label="How did you hear about us?" value={f.referral} onChange={e=>s("referral",e.target.value)}/>
      </div>}

      {step===3 && <div className="anim-slide">
        <InputField label="What brings you to therapy?" value={f.complaint} onChange={e=>s("complaint",e.target.value)} rows={4} placeholder="Tell us in your own words..."/>
        <InputField label="Goals for therapy" value={f.goals} onChange={e=>s("goals",e.target.value)} rows={3} placeholder="What would progress look like?"/>
        <InputField label="Current Medications" value={f.meds} onChange={e=>s("meds",e.target.value)} placeholder="List any current medications"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <InputField label="Emergency Contact" value={f.ec_name} onChange={e=>s("ec_name",e.target.value)}/>
          <InputField label="Emergency Phone" value={f.ec_phone} onChange={e=>s("ec_phone",e.target.value)} type="tel"/>
        </div>
      </div>}

      {step===4 && <div className="anim-slide">
        <Card accent={accent} style={{marginBottom:16}}>
          <div style={{color:$.cream,fontSize:14,fontWeight:600,marginBottom:8}}>HIPAA Notice of Privacy Practices</div>
          <p style={{color:`${$.cream}40`,fontSize:12,lineHeight:1.8,marginBottom:12}}>The Mind Studio protects your health information per HIPAA. Your data is used only for treatment, payment, and operations.</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" checked={f.hipaa} onChange={e=>s("hipaa",e.target.checked)} style={{accentColor:accent}}/><span style={{color:$.cream,fontSize:12}}>I acknowledge the HIPAA Notice</span></div>
        </Card>
        <Card accent={accent}>
          <div style={{color:$.cream,fontSize:14,fontWeight:600,marginBottom:8}}>Telehealth Informed Consent</div>
          <p style={{color:`${$.cream}40`,fontSize:12,lineHeight:1.8,marginBottom:12}}>I consent to telehealth sessions through The Mind Studio's HIPAA-compliant platform.</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" checked={f.telehealth} onChange={e=>s("telehealth",e.target.checked)} style={{accentColor:accent}}/><span style={{color:$.cream,fontSize:12}}>I consent to telehealth services</span></div>
        </Card>
      </div>}

      <div style={{display:"flex",justifyContent:"space-between",marginTop:28}}>
        {step>1?<Btn label="← Back" color={$.warm} textColor={`${$.cream}50`} onClick={()=>setStep(s=>s-1)}/>:<div/>}
        {step<4?<Btn label="Continue →" color={`${accent}15`} textColor={accent} onClick={()=>setStep(s=>s+1)}/>:
          <Btn label="Submit Intake" color={accent} textColor={$.bg} onClick={submit} disabled={!f.hipaa||!f.telehealth||!f.first_name||!f.email}/>}
      </div>
    </div>
  );
}

// ═══ CLIENT — Section 3: Sessions ═══
function ClientSessions({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Your Sessions" subtitle="View upcoming appointments, join virtual sessions, and review history." accent={accent}/>
      <Card accent={accent} style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:48,opacity:0.2,marginBottom:16}}>📅</div>
        <p style={{color:`${$.cream}35`,fontSize:14}}>Once matched with a therapist, your sessions will appear here.</p>
        <p style={{color:`${$.cream}25`,fontSize:12,marginTop:8}}>You'll be able to join video sessions, reschedule, and view notes.</p>
      </Card>
    </div>
  );
}

// ═══ CLIENT — Section 4: Daily Tools ═══
function ClientTools({accent}) {
  const [mood,setMood] = useState({mood:5,energy:5,anxiety:5,sleep:5,notes:""});
  const [logged,setLogged] = useState(false);
  const [history] = useState([
    {day:"Mon",mood:6,energy:5,anxiety:4,sleep:7},{day:"Tue",mood:5,energy:4,anxiety:6,sleep:5},
    {day:"Wed",mood:7,energy:6,anxiety:3,sleep:8},{day:"Thu",mood:6,energy:7,anxiety:4,sleep:7},
    {day:"Fri",mood:8,energy:7,anxiety:2,sleep:8},{day:"Sat",mood:7,energy:8,anxiety:3,sleep:9},
    {day:"Today",mood:mood.mood,energy:mood.energy,anxiety:mood.anxiety,sleep:mood.sleep},
  ]);

  const logMood = async () => {
    await sbPost("ms_mood_logs",{mood_score:mood.mood,energy_level:mood.energy,anxiety_level:mood.anxiety,sleep_quality:mood.sleep,notes:mood.notes});
    setLogged(true);
  };

  const Slider = ({label,k,emoji,low,high}) => (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{color:$.cream,fontSize:12}}>{emoji} {label}</span>
        <span className="cm" style={{color:accent,fontSize:24,fontWeight:300}}>{mood[k]}</span>
      </div>
      <input type="range" min={1} max={10} value={mood[k]} onChange={e=>setMood(m=>({...m,[k]:+e.target.value}))} style={{width:"100%",accentColor:accent,height:4}}/>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:`${$.cream}20`,fontSize:9}}>{low}</span><span style={{color:`${$.cream}20`,fontSize:9}}>{high}</span></div>
    </div>
  );

  return (
    <div style={{maxWidth:800}}>
      <SectionHeader title="Daily Tools & Check-In" subtitle="Track your mental state over time. Your therapist uses this data to personalize your care." accent={accent}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* MOOD LOG */}
        <Card accent={accent}>
          {logged ? (
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <span style={{fontSize:48}}>🧠</span>
              <div className="cm" style={{color:accent,fontSize:22,marginTop:12}}>Logged</div>
              <div style={{color:`${$.cream}40`,fontSize:12,marginTop:4}}>Consistency builds clarity.</div>
            </div>
          ) : (
            <>
              <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:16,fontWeight:600}}>TODAY'S CHECK-IN</div>
              <Slider label="Mood" k="mood" emoji="😊" low="Low" high="Great"/>
              <Slider label="Energy" k="energy" emoji="⚡" low="Exhausted" high="Energized"/>
              <Slider label="Anxiety" k="anxiety" emoji="😰" low="Calm" high="Very Anxious"/>
              <Slider label="Sleep" k="sleep" emoji="😴" low="Poor" high="Excellent"/>
              <InputField label="Notes" value={mood.notes} onChange={e=>setMood(m=>({...m,notes:e.target.value}))} rows={2} placeholder="What's on your mind..."/>
              <Btn label="Log Check-In" color={accent} textColor={$.bg} onClick={logMood} full/>
            </>
          )}
        </Card>

        {/* MOOD CHART */}
        <Card accent={accent}>
          <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:16,fontWeight:600}}>WEEK OVERVIEW</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{fill:`${$.cream}30`,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,10]} tick={{fill:`${$.cream}20`,fontSize:9}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:$.warm,border:`1px solid ${$.border}`,borderRadius:6,color:$.cream,fontSize:11}}/>
              <Area type="monotone" dataKey="mood" stroke={accent} fill="url(#moodGrad)" strokeWidth={2}/>
              <Area type="monotone" dataKey="energy" stroke={$.sage} fill="none" strokeWidth={1.5} strokeDasharray="4 4"/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:2,background:accent}}/><span style={{color:`${$.cream}30`,fontSize:9}}>Mood</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:2,background:$.sage,borderTop:"1px dashed"}}/><span style={{color:`${$.cream}30`,fontSize:9}}>Energy</span></div>
          </div>
        </Card>
      </div>

      {/* TOOLS GRID */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:16}}>
        {[
          {icon:"🌅",title:"Morning Affirmation",desc:"Start your day with intention"},
          {icon:"🌊",title:"4-7-8 Breathing",desc:"Activate your calm nervous system"},
          {icon:"📓",title:"Journal Prompt",desc:"Write without editing for 5 minutes"},
          {icon:"🌳",title:"5-4-3-2-1 Grounding",desc:"Reconnect with the present moment"},
          {icon:"🎧",title:"Guided Meditation",desc:"10-minute body scan"},
          {icon:"🌙",title:"Evening Wind-Down",desc:"Release the day before sleep"},
        ].map((t,i) => (
          <Card key={i} accent={accent} glow>
            <span style={{fontSize:24,display:"block",marginBottom:8}}>{t.icon}</span>
            <div style={{color:$.cream,fontSize:13,fontWeight:600,marginBottom:4}}>{t.title}</div>
            <div style={{color:`${$.cream}40`,fontSize:11,lineHeight:1.5}}>{t.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══ CLIENT — Section 5: Resources ═══
function ClientResources({accent}) {
  const [res,setRes] = useState([]);
  const [filter,setFilter] = useState("all");
  const [loading,setLoading] = useState(true);
  useEffect(()=>{sbGet("ms_resources?for_audience=eq.client&is_active=eq.true&order=category").then(r=>{setRes(r);setLoading(false)});},[]);
  if(loading) return <div style={{color:`${$.cream}20`,padding:40}}>Loading resources...</div>;
  const cats = ["all",...new Set(res.map(r=>r.category))];
  const filtered = filter==="all"?res:res.filter(r=>r.category===filter);
  const catColor = {affirmations:$.gold,breathing:"#5B9BD5",journaling:"#A78BFA",grounding:$.sage,education:"#F59E0B",practical:"#06B6D4",assessment:"#EC4899",crisis:"#EF4444"};

  return (
    <div style={{maxWidth:800}}>
      <SectionHeader title="Wellness Library" subtitle="Breathing exercises, journal prompts, coping tools, and educational resources." accent={accent}/>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{background:filter===c?`${accent}12`:$.warm,border:`1px solid ${filter===c?accent:$.border}`,borderRadius:4,padding:"5px 12px",color:filter===c?accent:`${$.cream}40`,fontSize:10,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{c}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(r=>(
          <Card key={r.id} accent={accent}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{background:(catColor[r.category]||accent)+"20",color:catColor[r.category]||accent,padding:"2px 8px",borderRadius:3,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>{r.category}</span>
            </div>
            <div style={{color:$.cream,fontSize:15,fontWeight:600,marginBottom:6}}>{r.title}</div>
            <p style={{color:`${$.cream}50`,fontSize:13,lineHeight:1.8}}>{r.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══ CLIENT — Section 6: Community ═══
function ClientCommunity({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Community & Events" subtitle="Connect with others on the same journey. Safe, moderated, confidential." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {icon:"🗣️",title:"Discussion Groups",desc:"Join therapist-led virtual groups for anxiety, grief, identity, and more."},
          {icon:"❓",title:"Ask a Therapist",desc:"Submit anonymous questions answered by licensed professionals."},
          {icon:"📅",title:"Upcoming Events",desc:"RSVP to open discussions, workshops, and wellness events."},
          {icon:"📝",title:"Anonymous Questions",desc:"No names. No judgment. Just answers from people who understand."},
        ].map((c,i) => <Card key={i} accent={accent} glow><span style={{fontSize:28,display:"block",marginBottom:10}}>{c.icon}</span><div style={{color:$.cream,fontSize:14,fontWeight:600,marginBottom:4}}>{c.title}</div><div style={{color:`${$.cream}40`,fontSize:12,lineHeight:1.5}}>{c.desc}</div></Card>)}
      </div>
    </div>
  );
}

// ═══ CLIENT — Section 7: Billing ═══
function ClientBilling({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Billing & Membership" subtitle="Manage your insurance, view session history, and update payment info." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat label="Plan" value="—" sub="Complete intake to verify" accent={accent} icon="💳"/>
        <Stat label="Sessions" value="0" sub="Total completed" accent={accent} icon="📅"/>
      </div>
      <Card accent={accent} style={{marginTop:12}}>
        <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:12,fontWeight:600}}>ACTIONS</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {["Update Insurance","View Session History","Submit Payment Issue","Upgrade to Premium"].map(a=>(
            <button key={a} style={{background:`${$.bg}60`,border:`1px solid ${$.border}`,borderRadius:4,padding:"8px 14px",color:`${$.cream}50`,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{a}</button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// THERAPIST PORTAL SECTIONS
// ═══════════════════════════════════════════════════════════════════════
function TherapistOnboarding({accent}) {
  const checks = ["Welcome Video Watched","W-9 Uploaded","License Uploaded","Insurance Uploaded","Handbook Read","Contract Signed"];
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Welcome to The Mind Studio" subtitle="Complete your onboarding to start receiving client referrals." accent={accent}/>
      <Card accent={accent}>
        <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:16,fontWeight:600}}>ONBOARDING CHECKLIST</div>
        {checks.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<checks.length-1?`1px solid ${$.border}`:"none"}}><div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${$.cream}20`,flexShrink:0}}/><span style={{color:`${$.cream}50`,fontSize:13}}>{c}</span></div>))}
        <ProgressBar value={0} max={checks.length} accent={accent} height={4}/>
      </Card>
    </div>
  );
}
function TherapistSystems({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Systems & Scheduling" subtitle="How to manage your calendar, view intake notes, and run virtual sessions." accent={accent}/>
      {["How to Use the Platform","View Client Intake Notes","Managing Your Calendar","Virtual Session SOP","Emergency Escalation Guide"].map((t,i)=>(
        <Card key={i} accent={accent} style={{marginBottom:8}}><div style={{color:$.cream,fontSize:14,fontWeight:500}}>{t}</div><div style={{color:`${$.cream}30`,fontSize:11,marginTop:4}}>Documentation available</div></Card>
      ))}
    </div>
  );
}
function TherapistEducation({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Continuing Education" subtitle="Free CEU trainings, supervision recordings, and clinical resources." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat label="CEUs Earned" value="0" sub="This quarter" accent={accent} icon="🎓"/>
        <Stat label="Trainings Available" value="12" sub="Relias + live webinars" accent={accent} icon="📚"/>
      </div>
    </div>
  );
}
function TherapistSupport({accent, notify}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Therapist Support" subtitle="Weekly check-ins, supervisor chat, leave requests, and escalation." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {["Weekly Check-In Form","Chat with Supervisor","Submit Leave Request","Report Red Flag"].map((a,i)=>(
          <Card key={i} accent={accent} glow><button onClick={()=>notify(`${a} — coming soon`)} style={{background:"none",border:"none",color:$.cream,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%"}}>{a}</button></Card>
        ))}
      </div>
    </div>
  );
}
function TherapistBilling({accent}) {
  const data = [{month:"Jan",revenue:0},{month:"Feb",revenue:0},{month:"Mar",revenue:0}];
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Compensation & Billing" subtitle="Submit session logs, view pay schedule, and track earnings." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        <Stat label="This Month" value="$0" accent={accent} icon="💰"/>
        <Stat label="Sessions" value="0" accent={accent} icon="📋"/>
        <Stat label="Next Payout" value="—" accent={accent} icon="📅"/>
      </div>
      <Card accent={accent}>
        <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:12,fontWeight:600}}>EARNINGS TREND</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{fill:`${$.cream}30`,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:`${$.cream}20`,fontSize:9}} axisLine={false} tickLine={false}/>
            <Bar dataKey="revenue" fill={`${accent}40`} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// BOH OPS PORTAL SECTIONS
// ═══════════════════════════════════════════════════════════════════════
function BOHOverview({accent}) {
  return (
    <div style={{maxWidth:900}}>
      <SectionHeader title="BOH Operations Center" subtitle="The engine behind The Mind Studio. Team overview, org chart, and communication SOPs." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <Stat label="Active Clients" value="0" accent={accent} icon="👤"/>
        <Stat label="Therapists" value="0" accent={accent} icon="🩺"/>
        <Stat label="Pending Intakes" value="0" accent={accent} icon="📋"/>
        <Stat label="Claims This Month" value="0" accent={accent} icon="💳"/>
      </div>
      <Card accent={accent}>
        <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:12,fontWeight:600}}>TEAM ROLES</div>
        {["Concierge","Scheduler","Billing Assistant","VA / Admin","Intake Specialist"].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${$.border}`}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:`${accent}40`}}/>
            <span style={{color:`${$.cream}60`,fontSize:13}}>{r}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
function BOHTasks({accent, notify}) {
  const [tasks] = useState([
    {title:"Review 3 pending intakes",role:"Intake Specialist",priority:"high"},
    {title:"Verify insurance for new clients",role:"Billing Assistant",priority:"high"},
    {title:"Follow up with inactive clients (10+ days)",role:"Concierge",priority:"medium"},
    {title:"Update therapist availability calendar",role:"Scheduler",priority:"medium"},
    {title:"Process session logs from last week",role:"Billing Assistant",priority:"low"},
  ]);
  const pColor = {high:"#EF4444",medium:"#F59E0B",low:$.sage};
  return (
    <div style={{maxWidth:800}}>
      <SectionHeader title="Task Flow & Checklists" subtitle="Role-based daily tasks, KPIs, and SOP references." accent={accent}/>
      {tasks.map((t,i)=>(
        <Card key={i} accent={accent} style={{marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${$.cream}20`,flexShrink:0,cursor:"pointer"}} onClick={()=>notify("Task completed")}/>
            <div style={{flex:1}}>
              <div style={{color:$.cream,fontSize:13,fontWeight:500}}>{t.title}</div>
              <div style={{color:`${$.cream}30`,fontSize:10,marginTop:2}}>{t.role}</div>
            </div>
            <span style={{background:pColor[t.priority]+"20",color:pColor[t.priority],padding:"2px 8px",borderRadius:3,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>{t.priority}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
function BOHWorkflow({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Client & Therapist Workflow" subtitle="SOPs for intake, onboarding, booking, follow-up, and progress tracking." accent={accent}/>
      {["Client Intake SOP","Therapist Onboarding SOP","Booking + Follow-Up SOP","No-Show / Cancellation Handling","Client Progress Tracking"].map((s,i)=>(
        <Card key={i} accent={accent} style={{marginBottom:8}}><div style={{color:$.cream,fontSize:14,fontWeight:500}}>{s}</div></Card>
      ))}
    </div>
  );
}
function BOHInsurance({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Insurance & Billing Ops" subtitle="Verification SOPs, billing tools, therapist log review, and escalation protocols." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat label="Claims Submitted" value="0" accent={accent} icon="📄"/>
        <Stat label="Claims Paid" value="0" accent={accent} icon="✅"/>
      </div>
    </div>
  );
}
function BOHTraining({accent}) {
  return (
    <div style={{maxWidth:700}}>
      <SectionHeader title="Training & Development" subtitle="Platform tutorials, automation walkthroughs, lead handling scripts, and team huddles." accent={accent}/>
      {["How to Use GHL (Admin)","Automation Walkthroughs","Lead Handling Scripts","Monthly Team Huddle Recordings"].map((t,i)=>(
        <Card key={i} accent={accent} style={{marginBottom:8}}><span style={{color:$.cream,fontSize:14,fontWeight:500}}>{t}</span></Card>
      ))}
    </div>
  );
}
function BOHReports({accent}) {
  const data = [{week:"W1",clients:0,claims:0},{week:"W2",clients:0,claims:0},{week:"W3",clients:0,claims:0},{week:"W4",clients:0,claims:0}];
  return (
    <div style={{maxWidth:800}}>
      <SectionHeader title="Reports & Metrics" subtitle="Client conversion, therapist utilization, lead sources, and claims tracking." accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <Stat label="Conversion Rate" value="0%" accent={accent}/>
        <Stat label="Therapist Util." value="0%" accent={accent}/>
        <Stat label="Avg. Intake Time" value="—" accent={accent}/>
        <Stat label="Claims Ratio" value="0/0" accent={accent}/>
      </div>
      <Card accent={accent}>
        <div style={{color:accent,fontSize:11,letterSpacing:2,marginBottom:12,fontWeight:600}}>WEEKLY PERFORMANCE</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <XAxis dataKey="week" tick={{fill:`${$.cream}30`,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:`${$.cream}20`,fontSize:9}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:$.warm,border:`1px solid ${$.border}`,borderRadius:6,color:$.cream,fontSize:11}}/>
            <Line type="monotone" dataKey="clients" stroke={accent} strokeWidth={2} dot={{fill:accent,r:3}}/>
            <Line type="monotone" dataKey="claims" stroke={$.sage} strokeWidth={1.5} strokeDasharray="4 4"/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
