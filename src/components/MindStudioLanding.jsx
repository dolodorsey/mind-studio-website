'use client';
import { useEffect, useRef, useState } from 'react';

// ═══════════════════════════════════════════════════════════
// THE MIND STUDIO — Gold Standard Landing Page
// Professional mental health practice · Prenatal specialty
// Design DNA: doctordorsey.com standard
// ═══════════════════════════════════════════════════════════

const LOGO = '/images/mind-studio-logo-transparent.png';
const LOGO_FULL = '/images/mind-studio-logo.png';

// Unsplash stock images — warm, clinical, non-urban
const IMG = {
  hero: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1920&q=80',
  pregnant: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
  wellness: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
  cozy: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80',
  sunrise: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80',
  yoga: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
  serene: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&q=80',
};

export default function MindStudioLanding() {
  const [ld, setLd] = useState(false);
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  const refs = useRef([]);
  const addR = (el) => { if (el && !refs.current.includes(el)) refs.current.push(el); };

  useEffect(() => { setTimeout(() => setLd(true), 2400); }, []);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
    }), { threshold: 0.1 });
    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [ld]);

  const R = { opacity: 0, transform: 'translateY(35px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' };

  return (<>
    {/* ── PRELOADER ── */}
    <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#0A0A08',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',opacity:ld?0:1,visibility:ld?'hidden':'visible',transition:'opacity 1s cubic-bezier(0.16,1,0.3,1), visibility 1s'}}>
      <img src={LOGO_FULL} alt="" style={{width:160,objectFit:'contain',marginBottom:16,animation:'pulse 2s ease-in-out infinite',borderRadius:16}} />
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase',color:'#D4B87A',opacity:0.6}}>Heal your mind · Transform your life</div>
    </div>

    {/* ── MOBILE NAV ── */}
    <div style={{position:'fixed',top:0,right:mo?'0':'-100%',width:'100%',height:'100%',background:'#0A0A08',zIndex:999,display:'flex',flexDirection:'column',justifyContent:'center',padding:'96px clamp(20px,4vw,80px)',transition:'right 0.6s cubic-bezier(0.16,1,0.3,1)'}}>
      {['services','about','prenatal','team','connect'].map(s => <a key={s} href={`#${s}`} onClick={() => setMo(false)} style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,5vw,56px)',fontWeight:300,textDecoration:'none',display:'block',padding:'14px 0',borderBottom:'1px solid rgba(245,240,232,0.06)',color:'#F5F0E8'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</a>)}
      <a href="https://mind-studio-app.vercel.app" style={{display:'inline-block',fontFamily:'DM Mono,monospace',fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'#0A0A08',background:'#5DCAA5',padding:'14px 40px',textDecoration:'none',marginTop:40,borderRadius:0}}>Client Portal</a>
    </div>

    {/* ── NAV ── */}
    <nav style={{position:'fixed',top:0,left:0,width:'100%',zIndex:1000,padding:'16px clamp(20px,4vw,80px)',display:'flex',alignItems:'center',justifyContent:'space-between',background:sc?'rgba(10,10,8,0.95)':'transparent',backdropFilter:sc?'blur(20px)':'none',transition:'background 0.4s,backdrop-filter 0.4s'}}>
      <a href="#" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
        <img src={LOGO} alt="" style={{height:36,objectFit:'contain'}} />
        <div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(14px,1.5vw,18px)',fontWeight:500,color:'#D4B87A',lineHeight:1,letterSpacing:'0.05em'}}>THE MIND STUDIO</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.2em',color:'rgba(245,240,232,0.3)',textTransform:'uppercase'}}>Mental Health &amp; Wellness</div>
        </div>
      </a>
      <ul className="desk-nav" style={{display:'flex',gap:32,listStyle:'none',margin:0,padding:0}}>
        {['services','about','prenatal','connect'].map(s => <li key={s}><a href={`#${s}`} className="na" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.45)',textDecoration:'none'}}>{s}</a></li>)}
      </ul>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <a href="https://mind-studio-app.vercel.app" className="desk-cta" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(7px,0.65vw,9px)',letterSpacing:'0.2em',textTransform:'uppercase',color:'#0A0A08',background:'#5DCAA5',padding:'9px 22px',textDecoration:'none'}}>Client Portal</a>
        <button className="mob-btn" onClick={() => setMo(!mo)} style={{display:'none',background:'none',border:'none',cursor:'pointer',width:26,height:18,position:'relative'}}>
          <span style={{display:'block',width:'100%',height:'1px',background:'#F5F0E8',position:'absolute',left:0,top:mo?8:2,transition:'all 0.3s',transform:mo?'rotate(45deg)':'none'}} />
          <span style={{display:'block',width:'100%',height:'1px',background:'#F5F0E8',position:'absolute',left:0,top:8,transition:'all 0.3s',opacity:mo?0:1}} />
          <span style={{display:'block',width:'100%',height:'1px',background:'#F5F0E8',position:'absolute',left:0,top:mo?8:14,transition:'all 0.3s',transform:mo?'rotate(-45deg)':'none'}} />
        </button>
      </div>
    </nav>

    {/* ══════════ HERO ══════════ */}
    <section style={{position:'relative',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'center',background:'#0A0A08'}}>
      <img src={IMG.hero} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.3,animation:'slowZoom 20s ease-in-out infinite alternate'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(135deg,rgba(10,10,8,0.8) 0%,rgba(10,10,8,0.3) 50%,rgba(10,10,8,0.6) 100%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(180deg,rgba(10,10,8,0.5) 0%,transparent 25%,transparent 65%,#0A0A08 100%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.04,backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")'}} />

      <div style={{position:'relative',zIndex:4,maxWidth:640,padding:'0 clamp(20px,4vw,80px)'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.35em',textTransform:'uppercase',color:'#5DCAA5',marginBottom:20,animation:'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 2.4s both'}}>The Mind Studio · Atlanta</div>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(38px,7vw,88px)',fontWeight:300,lineHeight:1.06,letterSpacing:'-0.02em',color:'#F5F0E8',margin:0,animation:'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 2.6s both'}}>Heal your mind.<br/><em style={{fontStyle:'italic',color:'#D4B87A'}}>Transform your life.</em></h1>
        <p style={{fontSize:'clamp(13px,1.2vw,17px)',color:'rgba(245,240,232,0.5)',lineHeight:1.75,maxWidth:460,marginTop:24,animation:'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 2.8s both'}}>Compassionate, evidence-based therapy for individuals, couples, and expectant mothers. Your journey to wellness starts here.</p>
        <div style={{display:'flex',gap:16,marginTop:40,flexWrap:'wrap',animation:'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 3s both'}}>
          <a href="#connect" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.25em',textTransform:'uppercase',color:'#0A0A08',background:'#5DCAA5',padding:'14px 36px',textDecoration:'none'}}>Book a session</a>
          <a href="#services" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.25em',textTransform:'uppercase',color:'#F5F0E8',padding:'14px 36px',textDecoration:'none',border:'1px solid rgba(245,240,232,0.15)'}}>Learn more</a>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,width:'100%',height:'2px',background:'linear-gradient(90deg,transparent,#5DCAA5,transparent)',zIndex:4,opacity:0.4}} />
    </section>

    {/* ══════════ STATS BAR ══════════ */}
    <section style={{background:'#0D0D0B',borderBottom:'1px solid rgba(245,240,232,0.04)',padding:'clamp(32px,5vw,56px) clamp(20px,4vw,80px)'}}>
      <div ref={addR} style={{...R,maxWidth:1400,margin:'0 auto',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:24}}>
        {[{v:'100%',l:'Confidential'},{v:'HIPAA',l:'Compliant'},{v:'50+',l:'Specialties'},{v:'Virtual',l:'& In-Person'},{v:'Prenatal',l:'Specialty'}].map((s,i) => (
          <div key={i} style={{textAlign:'center',minWidth:100}}>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(24px,3vw,40px)',fontWeight:300,color:'#5DCAA5',lineHeight:1}}>{s.v}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.3)',marginTop:6}}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>

    {/* ══════════ SERVICES ══════════ */}
    <section id="services" style={{position:'relative',padding:'clamp(80px,10vw,140px) clamp(20px,4vw,80px)',background:'#0A0A08'}}>
      <img src={IMG.office} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.05,filter:'brightness(0.3)'}} />
      <div style={{maxWidth:1400,margin:'0 auto',position:'relative',zIndex:1}}>
        <div ref={addR} style={R}>
          <div style={{width:40,height:1,background:'#5DCAA5',marginBottom:16}} />
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,5vw,60px)',fontWeight:300,lineHeight:1.1,letterSpacing:'-0.02em',color:'#F5F0E8',marginBottom:16}}>How we <em style={{fontStyle:'italic',color:'#5DCAA5'}}>help.</em></h2>
          <p style={{fontSize:'clamp(13px,1.1vw,16px)',color:'rgba(245,240,232,0.4)',lineHeight:1.7,maxWidth:500,marginBottom:48}}>Every mind is different. We offer a range of evidence-based approaches tailored to your unique journey.</p>
        </div>
        <div className="svc-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2}}>
          {[
            {n:'Individual Therapy',d:'One-on-one sessions with a licensed therapist. CBT, DBT, EMDR, and more.'},
            {n:'Couples Counseling',d:'Strengthen your relationship through guided communication and conflict resolution.'},
            {n:'Prenatal & Perinatal',d:'Specialized support for expectant and new mothers navigating the emotional journey of parenthood.'},
            {n:'Trauma & PTSD',d:'Evidence-based trauma processing in a safe, compassionate environment.'},
            {n:'Anxiety & Depression',d:'Practical tools and therapeutic techniques to manage mood and find balance.'},
            {n:'Virtual Sessions',d:'HIPAA-encrypted video therapy from the comfort and privacy of your own space.'},
          ].map((s,i) => (
            <div key={i} ref={addR} style={{...R,transitionDelay:`${i*0.08}s`}}>
              <div className="svc-card" style={{background:'rgba(245,240,232,0.02)',border:'1px solid rgba(245,240,232,0.06)',padding:'clamp(28px,3vw,44px)',height:'100%',position:'relative',overflow:'hidden',cursor:'default',transition:'all 0.4s'}}>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(44px,4vw,56px)',fontWeight:300,color:'rgba(93,202,165,0.08)',position:'absolute',top:-6,right:12,lineHeight:1}}>0{i+1}</div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(18px,2vw,24px)',fontWeight:400,color:'#F5F0E8',marginBottom:10,position:'relative'}}>{s.n}</div>
                <div style={{fontSize:'clamp(12px,1vw,14px)',color:'rgba(245,240,232,0.4)',lineHeight:1.75,position:'relative'}}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════ PREGNANT WOMAN — CINEMATIC BREAK ══════════ */}
    <div style={{position:'relative',height:'clamp(320px,50vw,550px)',overflow:'hidden'}}>
      <img src={IMG.pregnant} alt="Prenatal wellness" style={{position:'absolute',top:0,left:0,width:'100%',height:'130%',objectFit:'cover',opacity:0.5,transform:'translateY(-15%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(180deg,#0A0A08 0%,transparent 15%,transparent 80%,#0A0A08 100%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',padding:'0 clamp(40px,6vw,120px)'}}>
        <div style={{maxWidth:500}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#5DCAA5',marginBottom:12}}>Prenatal Specialty</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(24px,4vw,48px)',fontWeight:300,fontStyle:'italic',color:'#D4B87A',lineHeight:1.3,textShadow:'0 2px 30px rgba(0,0,0,0.8)'}}>&ldquo;Motherhood begins in the mind long before it begins in the body.&rdquo;</div>
        </div>
      </div>
    </div>

    {/* ══════════ PRENATAL SECTION ══════════ */}
    <section id="prenatal" style={{position:'relative',padding:'clamp(80px,10vw,140px) clamp(20px,4vw,80px)',background:'#0A0A08'}}>
      <img src={IMG.yoga} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.06,filter:'brightness(0.25)'}} />
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <div ref={addR} style={R}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(32px,5vw,80px)',alignItems:'center'}} className="prenatal-grid">
            <div>
              <div style={{width:40,height:1,background:'#D4B87A',marginBottom:16}} />
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(26px,4.5vw,52px)',fontWeight:300,lineHeight:1.1,color:'#F5F0E8',marginBottom:20}}>Prenatal &amp; perinatal <em style={{fontStyle:'italic',color:'#D4B87A'}}>mental health.</em></h2>
              <p style={{fontSize:'clamp(13px,1.1vw,16px)',color:'rgba(245,240,232,0.45)',lineHeight:1.8,marginBottom:24}}>The journey to motherhood is beautiful and complex. We provide specialized, compassionate care for expectant and new mothers experiencing anxiety, depression, grief, or the emotional overwhelm of this transformative time.</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {['Perinatal depression','Postpartum anxiety','Birth trauma','Pregnancy loss','Bonding concerns','Identity shifts'].map((item,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'#5DCAA5',flexShrink:0}} />
                    <span style={{fontSize:13,color:'rgba(245,240,232,0.5)'}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{position:'relative'}}>
              <img src={IMG.serene} alt="" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:0,opacity:0.8}} />
              <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(180deg,transparent 60%,#0A0A08 100%)'}} />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══════════ ABOUT ══════════ */}
    <section id="about" style={{position:'relative',padding:'clamp(80px,10vw,140px) clamp(20px,4vw,80px)',background:'#F5F0E8',color:'#0A0A08'}}>
      <img src={IMG.cozy} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.06,filter:'brightness(0.25)'}} />
      <div style={{maxWidth:1400,margin:'0 auto',position:'relative',zIndex:1}}>
        <div ref={addR} style={R}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:32}}>
            <div style={{width:40,height:1,background:'#5DCAA5'}} />
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.35em',textTransform:'uppercase',color:'#5DCAA5'}}>A Kollective Company</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(40px,6vw,100px)',alignItems:'center'}} className="about-grid">
            <div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(26px,4.5vw,52px)',fontWeight:300,lineHeight:1.1,letterSpacing:'-0.02em',color:'#0A0A08',marginBottom:20}}>A different kind of <em style={{fontStyle:'italic',color:'#5DCAA5'}}>practice.</em></h2>
              <p style={{fontSize:'clamp(14px,1.3vw,18px)',color:'rgba(10,10,8,0.5)',lineHeight:1.8,marginBottom:24}}>The Mind Studio operates under The Kollective Hospitality Group — bringing the same standard of excellence we deliver in hospitality to mental healthcare. We believe therapy should feel like a sanctuary, not a sterile office.</p>
              <p style={{fontSize:'clamp(14px,1.3vw,18px)',color:'rgba(10,10,8,0.5)',lineHeight:1.8,marginBottom:32}}>Our therapists are licensed, verified, and deeply committed to culturally competent care. Whether you are navigating life transitions, healing from trauma, or preparing for parenthood — we meet you where you are.</p>
              <div style={{display:'flex',gap:'clamp(24px,4vw,56px)',flexWrap:'wrap'}}>
                {[{n:'Licensed',l:'Therapists'},{n:'HIPAA',l:'Encrypted'},{n:'Prenatal',l:'Specialty'},{n:'Virtual',l:'Sessions'}].map((s,i) => (
                  <div key={i}>
                    <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(22px,2.5vw,36px)',fontWeight:400,color:'#5DCAA5',lineHeight:1}}>{s.n}</div>
                    <div style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(10,10,8,0.3)',marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src={IMG.nature} alt="" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',opacity:0.9}} />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══════════ NATURE CINEMATIC BREAK ══════════ */}
    <div style={{position:'relative',height:'clamp(240px,35vw,380px)',overflow:'hidden'}}>
      <img src={IMG.sunrise} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'130%',objectFit:'cover',opacity:0.55,transform:'translateY(-15%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(180deg,#0A0A08 0%,transparent 20%,transparent 75%,#0A0A08 100%)'}} />
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 20px'}}>
        <div>
          <img src={LOGO} alt="" style={{width:56,objectFit:'contain',margin:'0 auto 16px',display:'block',opacity:0.7}} />
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(20px,3vw,40px)',fontWeight:300,fontStyle:'italic',color:'#D4B87A',lineHeight:1.3,textShadow:'0 2px 30px rgba(0,0,0,0.8)'}}>Your mind deserves the same care as your body.</div>
        </div>
      </div>
    </div>

    {/* ══════════ HOW IT WORKS ══════════ */}
    <section style={{padding:'clamp(80px,10vw,140px) clamp(20px,4vw,80px)',background:'#0A0A08'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div ref={addR} style={R}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <div style={{width:40,height:1,background:'#5DCAA5',margin:'0 auto 16px'}} />
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,5vw,56px)',fontWeight:300,lineHeight:1.1,color:'#F5F0E8'}}>Begin your <em style={{fontStyle:'italic',color:'#5DCAA5'}}>journey.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2}} className="steps-grid">
            {[
              {n:'01',t:'Reach out',d:'Fill out our secure intake form or call us. No judgment, no pressure.'},
              {n:'02',t:'Get matched',d:'We pair you with a therapist who specializes in your specific needs.'},
              {n:'03',t:'First session',d:'Meet your therapist virtually or in-person. Set goals. Build trust.'},
              {n:'04',t:'Grow',d:'Consistent sessions, daily tools, and a care team invested in your progress.'},
            ].map((s,i) => (
              <div key={i} ref={addR} style={{...R,transitionDelay:`${i*0.12}s`}}>
                <div style={{background:'rgba(245,240,232,0.02)',border:'1px solid rgba(245,240,232,0.06)',padding:'clamp(24px,3vw,40px)',height:'100%',textAlign:'center'}}>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:48,fontWeight:300,color:'rgba(93,202,165,0.15)',lineHeight:1,marginBottom:16}}>{s.n}</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(18px,2vw,24px)',fontWeight:400,color:'#F5F0E8',marginBottom:10}}>{s.t}</div>
                  <div style={{fontSize:13,color:'rgba(245,240,232,0.4)',lineHeight:1.7}}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ══════════ CONNECT ══════════ */}
    <section id="connect" style={{position:'relative',padding:'clamp(80px,10vw,140px) clamp(20px,4vw,80px)',background:'#0A0A08'}}>
      <img src={IMG.wellness} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.06,filter:'brightness(0.2)'}} />
      <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
        <div ref={addR} style={R}>
          <img src={LOGO} alt="" style={{width:72,objectFit:'contain',margin:'0 auto 20px',display:'block',opacity:0.6}} />
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,5vw,60px)',fontWeight:300,lineHeight:1.1,color:'#F5F0E8',marginBottom:16}}>{"Let's"} <em style={{fontStyle:'italic',color:'#5DCAA5'}}>begin.</em></h2>
          <p style={{fontSize:'clamp(14px,1.3vw,18px)',color:'rgba(245,240,232,0.45)',lineHeight:1.7,maxWidth:520,margin:'0 auto 40px'}}>Take the first step. Reach out for a free consultation — no obligation, completely confidential.</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',marginBottom:48}}>
            <a href="https://mind-studio-app.vercel.app" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.2em',textTransform:'uppercase',color:'#0A0A08',background:'#5DCAA5',padding:'14px 36px',textDecoration:'none'}}>Start intake</a>
            <a href="mailto:thedoctordorsey@gmail.com?subject=Mind Studio Inquiry" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.2em',textTransform:'uppercase',color:'#F5F0E8',padding:'14px 36px',textDecoration:'none',border:'1px solid rgba(245,240,232,0.15)'}}>Email us</a>
            <a href="tel:+14045551234" style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(8px,0.7vw,10px)',letterSpacing:'0.2em',textTransform:'uppercase',color:'#F5F0E8',padding:'14px 36px',textDecoration:'none',border:'1px solid rgba(245,240,232,0.15)'}}>Call</a>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24,maxWidth:500,margin:'0 auto'}}>
            <div style={{textAlign:'center',padding:20,border:'1px solid rgba(245,240,232,0.06)',background:'rgba(245,240,232,0.02)'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#D4B87A',marginBottom:6}}>Inquiries</div>
              <a href="mailto:thedoctordorsey@gmail.com" style={{fontSize:12,color:'#D4B87A',textDecoration:'none',borderBottom:'1px solid rgba(212,184,122,0.3)',paddingBottom:2}}>thedoctordorsey@gmail.com</a>
            </div>
            <div style={{textAlign:'center',padding:20,border:'1px solid rgba(245,240,232,0.06)',background:'rgba(245,240,232,0.02)'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#D4B87A',marginBottom:6}}>Crisis Line</div>
              <span style={{fontSize:12,color:'rgba(245,240,232,0.5)'}}>988 Suicide &amp; Crisis Lifeline</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── FOOTER ── */}
    <footer style={{padding:'40px clamp(20px,4vw,80px)',borderTop:'1px solid rgba(245,240,232,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0A0A08',flexWrap:'wrap',gap:16}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src={LOGO} alt="" style={{height:24,objectFit:'contain',opacity:0.4}} />
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'clamp(7px,0.65vw,9px)',letterSpacing:'0.15em',color:'rgba(245,240,232,0.3)'}}>© 2026 The Mind Studio</div>
      </div>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <span style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.1em',color:'rgba(245,240,232,0.2)'}}>🔒 HIPAA Compliant</span>
        <a href="https://mind-studio-app.vercel.app" style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.1em',color:'rgba(245,240,232,0.3)',textDecoration:'none'}}>Client Portal</a>
        <a href="https://instagram.com/themindstudioforever" target="_blank" rel="noopener noreferrer" style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.1em',color:'rgba(245,240,232,0.3)',textDecoration:'none'}}>@themindstudioforever</a>
        <a href="https://doctordorsey.com" target="_blank" rel="noopener noreferrer" style={{fontFamily:'DM Mono,monospace',fontSize:8,letterSpacing:'0.1em',color:'rgba(245,240,232,0.3)',textDecoration:'none'}}>Dr. Dorsey</a>
      </div>
    </footer>

    <style>{`
      @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
      @keyframes pulse { 0%,100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
      .na:hover { color: #F5F0E8 !important; }
      .svc-card:hover { border-color: rgba(93,202,165,0.2) !important; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; color: #F5F0E8; background: #0A0A08; -webkit-font-smoothing: antialiased; }
      @media (max-width: 1024px) { .svc-grid { grid-template-columns: repeat(2,1fr) !important; } .steps-grid { grid-template-columns: repeat(2,1fr) !important; } }
      @media (max-width: 768px) { .desk-nav { display: none !important; } .desk-cta { display: none !important; } .mob-btn { display: block !important; } .svc-grid { grid-template-columns: 1fr !important; } .steps-grid { grid-template-columns: 1fr !important; } .prenatal-grid { grid-template-columns: 1fr !important; } .about-grid { grid-template-columns: 1fr !important; } }
    `}</style>
  </>);
}
