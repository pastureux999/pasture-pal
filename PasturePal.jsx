import { useState, useRef, useEffect } from "react";

// ── Brand Tokens ──────────────────────────────────────────────────
const C = {
  cream:      "#F5EDD8",
  offWhite:   "#FBF7EE",
  parchment:  "#E8D9B5",
  dark:       "#1E1509",
  brown:      "#3D2B10",
  midBrown:   "#6B4C22",
  stone:      "#8A7355",
  pebble:     "#B5A080",
  sage:       "#7A9E82",
  sageDark:   "#4D7057",
  sageLight:  "#A8C5AD",
  sagePale:   "#E8F0E9",
  white:      "#FFFFFF",
  terracotta: "#B85C34",
  dustyRose:  "#C8907A",
  wheat:      "#C8A050",
  sky:        "#7898A8",
  lavender:   "#9888B0",
  meadow:     "#7AA860",
};

const F = {
  display: "'Playfair Display', Georgia, serif",
  body:    "'Jost', sans-serif",
  mono:    "'DM Mono', monospace",
};

// ── Global Styles ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Jost:wght@400;500;600;700&family=DM+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.cream}; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.parchment}; border-radius: 10px; }

  input:focus, textarea:focus, select:focus {
    border-color: ${C.sage} !important;
    outline: none;
    box-shadow: 0 0 0 3px rgba(122,158,130,0.18) !important;
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes modalEnter {
    from { opacity: 0; transform: scale(0.96) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1; }
  }

  .pp-animate  { animation: fadeSlideIn 0.3s ease both; }
  .pp-modal    { animation: modalEnter 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

  .pp-card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
  .pp-card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(42,31,14,0.13), 0 3px 8px rgba(42,31,14,0.07) !important;
  }
  .pp-card-hover:active { transform: translateY(0) scale(0.99); }

  .pp-btn { transition: opacity 0.15s, transform 0.12s, box-shadow 0.15s; }
  .pp-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .pp-btn:active:not(:disabled) { transform: scale(0.97); }

  .pp-tab { transition: color 0.15s, background 0.15s; }

  .pp-dot-1 { animation: dotPulse 1.4s ease infinite; }
  .pp-dot-2 { animation: dotPulse 1.4s ease 0.2s infinite; }
  .pp-dot-3 { animation: dotPulse 1.4s ease 0.4s infinite; }
`;

// ── Highland Cow SVG ──────────────────────────────────────────────
function HighlandCowLogo({ size = 48, color = C.brown }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 38 Q10 22 4 14 Q6 20 14 28 Q20 34 28 38Z" fill={color} opacity="0.9"/>
      <path d="M92 38 Q110 22 116 14 Q114 20 106 28 Q100 34 92 38Z" fill={color} opacity="0.9"/>
      <path d="M28 38 Q12 24 5 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M92 38 Q108 24 115 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="60" cy="52" rx="28" ry="26" fill={color} opacity="0.08"/>
      <ellipse cx="60" cy="52" rx="28" ry="26" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M34 38 Q38 30 42 36 Q46 28 50 35 Q54 26 58 34 Q62 26 66 34 Q70 28 74 35 Q78 30 82 36 Q86 30 88 36" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M32 42 Q36 34 40 40 Q44 32 48 38 Q52 30 56 37 Q60 29 64 37 Q68 31 72 38 Q76 33 80 40 Q84 34 88 42" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round"/>
      <path d="M33 46 Q37 39 41 44 Q45 37 49 43 Q53 36 57 42 Q61 35 65 42 Q69 37 73 43 Q77 39 81 44 Q85 39 87 46" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M35 50 Q39 44 43 49 Q47 43 51 48 Q55 42 59 48 Q63 42 67 48 Q71 43 75 49 Q79 44 83 50" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M34 48 Q30 54 32 62 Q34 56 36 52" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path d="M86 48 Q90 54 88 62 Q86 56 84 52" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <circle cx="49" cy="52" r="3.5" fill={color} opacity="0.15"/>
      <circle cx="49" cy="52" r="3.5" stroke={color} strokeWidth="1.2" fill="none"/>
      <circle cx="48.5" cy="51.5" r="1.5" fill={color}/>
      <circle cx="71" cy="52" r="3.5" fill={color} opacity="0.15"/>
      <circle cx="71" cy="52" r="3.5" stroke={color} strokeWidth="1.2" fill="none"/>
      <circle cx="70.5" cy="51.5" r="1.5" fill={color}/>
      <ellipse cx="60" cy="68" rx="14" ry="9" fill={color} opacity="0.12"/>
      <ellipse cx="60" cy="68" rx="14" ry="9" stroke={color} strokeWidth="1.4" fill="none"/>
      <ellipse cx="54" cy="70" rx="3" ry="2" fill={color} opacity="0.5"/>
      <ellipse cx="66" cy="70" rx="3" ry="2" fill={color} opacity="0.5"/>
      <path d="M54 67 Q60 65 66 67" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M56 77 Q58 82 60 84 Q62 82 64 77" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M34 46 Q26 42 24 50 Q30 46 36 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M86 46 Q94 42 96 50 Q90 46 84 50" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const daysUntil = (d) => { if (!d) return null; return Math.ceil((new Date(d + "T00:00:00") - new Date()) / 86400000); };
const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

// ── Seed Data ─────────────────────────────────────────────────────
const SEED = [
  { id: uid(), name: "Daisy", species: "Cattle", breed: "Hereford", sex: "Female", dob: "2021-03-14", tag: "HF-001", color: C.terracotta, emoji: "🐄", notes: "Gentle girl, first-time heifer this spring. Loves ear scratches.", weight: [{ date: "2024-01-10", lbs: 920 }, { date: "2024-04-01", lbs: 970 }], meds: [{ id: uid(), name: "Ivermectin", date: "2024-03-01", due: "2024-09-01", notes: "Dewormer" }, { id: uid(), name: "Bovishield Gold", date: "2024-02-15", due: "2025-02-15", notes: "Annual booster" }], calving: [{ id: uid(), date: "2024-04-18", calfName: "Buttercup", calfSex: "Female", notes: "Easy birth, healthy calf." }], reminders: [{ id: uid(), text: "Check hooves", due: "2024-08-15" }], photos: [], isPro: false },
  { id: uid(), name: "Clover", species: "Goat", breed: "Nubian", sex: "Female", dob: "2022-05-02", tag: "NG-007", color: C.sage, emoji: "🐐", notes: "Produces 3qt/day. Loves getting into everything.", weight: [{ date: "2024-03-20", lbs: 145 }], meds: [{ id: uid(), name: "CDT Vaccine", date: "2024-01-20", due: "2025-01-20", notes: "Annual" }], calving: [], reminders: [{ id: uid(), text: "Hoof trim", due: "2024-07-30" }], photos: [], isPro: false },
  { id: uid(), name: "Rosie", species: "Pig", breed: "Berkshire", sex: "Female", dob: "2023-08-11", tag: "BK-003", color: C.dustyRose, emoji: "🐷", notes: "Expected to farrow mid-August.", weight: [{ date: "2024-04-05", lbs: 280 }], meds: [], calving: [], reminders: [{ id: uid(), text: "Prepare farrowing pen", due: "2024-08-01" }], photos: [], isPro: true },
];

const STRIPE_CONFIG = {
  monthlyPriceId: "price_YOUR_MONTHLY_ID",
  yearlyPriceId:  "price_YOUR_YEARLY_ID",
  monthlyAmount:  9,
  yearlyAmount:   79,
};

function startStripeCheckout(priceId) {
  alert(`Stripe Integration\n\nTo go live:\n1. Add your Stripe publishable key\n2. Create /api/create-checkout-session\n3. Redirect to Stripe Checkout\n\nPrice ID: ${priceId}`);
}

// ── AI ─────────────────────────────────────────────────────────────
async function askAI(msgs, animals, imageBase64 = null) {
  const system = `You are the AI heart of "PasturePal," a cozy homestead app for small farm owners.
You're warm, practical, and knowledgeable about animal husbandry, gardening, and homesteading.
Farm animals: ${animals.map(a => `${a.name} (${a.breed} ${a.species}, ${a.sex})`).join(", ")}.
Keep answers friendly and concise. Always suggest a vet for serious health concerns.`;
  const lastMsg = msgs[msgs.length - 1];
  let content = lastMsg.content;
  if (imageBase64 && typeof content === "string") {
    content = [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
      { type: "text", text: content },
    ];
  }
  const apiMsgs = [...msgs.slice(0, -1), { role: "user", content }];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: apiMsgs }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong!";
}

// ── UI Primitives ──────────────────────────────────────────────────

function Badge({ color = C.sage, bg, children, small, outline }) {
  const bgColor = bg || (outline ? "transparent" : color + "1A");
  return (
    <span style={{
      background: bgColor,
      color: outline ? C.stone : color,
      border: `1px solid ${outline ? C.parchment : color + "55"}`,
      borderRadius: 100,
      padding: small ? "2px 8px" : "3px 10px",
      fontSize: small ? 10 : 11,
      fontFamily: F.body,
      fontWeight: 600,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
    }}>{children}</span>
  );
}

function Card({ children, style = {}, onClick, hoverable }) {
  return (
    <div
      onClick={onClick}
      className={hoverable || onClick ? "pp-card-hover" : ""}
      style={{
        background: C.offWhite,
        borderRadius: 16,
        border: `1px solid ${C.parchment}`,
        boxShadow: "0 2px 8px rgba(42,31,14,0.06), 0 1px 2px rgba(42,31,14,0.04)",
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small, full, style = {}, disabled, icon }) {
  const VARIANTS = {
    primary: {
      background: C.brown,
      color: C.cream,
      border: "none",
      boxShadow: "0 2px 8px rgba(61,43,16,0.3)",
    },
    sage: {
      background: C.sage,
      color: C.white,
      border: "none",
      boxShadow: "0 2px 8px rgba(122,158,130,0.3)",
    },
    ghost: {
      background: "transparent",
      color: C.brown,
      border: `1.5px solid ${C.parchment}`,
    },
    outline: {
      background: "transparent",
      color: C.dark,
      border: `1.5px solid ${C.midBrown}44`,
    },
    danger: {
      background: C.terracotta + "15",
      color: C.terracotta,
      border: `1.5px solid ${C.terracotta}44`,
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="pp-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: F.body,
        fontWeight: 600,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        padding: small ? "7px 16px" : "11px 24px",
        fontSize: small ? 12 : 13,
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.45 : 1,
        letterSpacing: "0.02em",
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block",
      fontFamily: F.body,
      fontSize: 10,
      color: C.stone,
      marginBottom: 6,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
    }}>
      {children}
    </label>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, rows }) {
  const base = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1.5px solid ${C.parchment}`,
    fontFamily: F.body,
    fontSize: 14,
    background: C.white,
    color: C.dark,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {rows
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: `1.5px solid ${C.parchment}`,
          fontFamily: F.body,
          fontSize: 14,
          background: C.white,
          color: C.dark,
          cursor: "pointer",
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
      <div style={{ flex: 1, height: 1, background: C.parchment }} />
      {label && <span style={{ fontFamily: F.body, fontSize: 10, color: C.pebble, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: C.parchment }} />
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(30,21,9,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="pp-modal"
        style={{
          background: C.offWhite,
          borderRadius: 20,
          padding: "28px 28px 24px",
          maxWidth: wide ? 580 : 500,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          border: `1.5px solid ${C.parchment}`,
          boxShadow: "0 40px 100px rgba(30,21,9,0.3), 0 8px 20px rgba(30,21,9,0.15)",
        }}
      >
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontFamily: F.display, color: C.dark, fontSize: 22, fontWeight: 700 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ background: C.parchment, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: C.stone, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
          </div>
        )}
        {!title && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button
              onClick={onClose}
              style={{ background: C.parchment, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: C.stone, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Photo Upload ───────────────────────────────────────────────────
function PhotoUpload({ photos = [], onAdd, onRemove, isPro, maxFree = 2 }) {
  const inputRef = useRef();
  const canAdd = isPro || photos.length < maxFree;
  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onAdd({ id: uid(), src: ev.target.result, date: new Date().toISOString().split("T")[0] });
    reader.readAsDataURL(file); e.target.value = "";
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
        {photos.map(p => (
          <div key={p.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "1", border: `1.5px solid ${C.parchment}` }}>
            <img src={p.src} alt="animal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              onClick={() => onRemove(p.id)}
              style={{ position: "absolute", top: 5, right: 5, background: "rgba(30,21,9,0.7)", border: "none", borderRadius: 6, width: 24, height: 24, color: C.cream, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
          </div>
        ))}
        {canAdd && (
          <div
            onClick={() => inputRef.current.click()}
            style={{ borderRadius: 12, border: `2px dashed ${C.parchment}`, aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: C.cream, gap: 6, transition: "border-color 0.15s, background 0.15s" }}
          >
            <span style={{ fontSize: 22, color: C.pebble }}>+</span>
            <span style={{ fontFamily: F.body, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Photo</span>
          </div>
        )}
      </div>
      {!isPro && photos.length >= maxFree && (
        <p style={{ fontFamily: F.body, fontSize: 12, color: C.sage, marginBottom: 6, fontWeight: 500 }}>✦ Upgrade to Pro for unlimited photos</p>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

// ── Upgrade Modal ──────────────────────────────────────────────────
function UpgradeModal({ onClose, onUpgrade }) {
  const [billing, setBilling] = useState("yearly");
  const features = [
    { icon: "🐄", text: "Unlimited animals in your herd" },
    { icon: "📷", text: "Unlimited photo uploads per animal" },
    { icon: "🤖", text: "AI Farm Hand — ask anything, anytime" },
    { icon: "🔬", text: "AI image analysis for health checks" },
    { icon: "🌱", text: "Breeding & pregnancy tracker" },
    { icon: "💉", text: "Full medication & health history" },
    { icon: "🔔", text: "Smart reminders & due-date alerts" },
  ];
  return (
    <Modal onClose={onClose} wide>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 28, marginTop: -8 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 88, height: 88, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.cream} 0%, ${C.parchment} 100%)`,
          border: `2px solid ${C.parchment}`,
          boxShadow: `0 0 0 6px ${C.offWhite}, 0 0 0 8px ${C.parchment}55`,
          marginBottom: 18,
        }}>
          <HighlandCowLogo size={56} color={C.brown} />
        </div>
        <h2 style={{ fontFamily: F.display, color: C.dark, margin: "0 0 6px", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>
          PasturePal <span style={{ color: C.sage }}>Pro</span>
        </h2>
        <p style={{ fontFamily: F.body, color: C.stone, margin: 0, fontSize: 14 }}>Everything your homestead needs to thrive.</p>
      </div>

      {/* Billing toggle */}
      <div style={{ display: "flex", background: C.cream, borderRadius: 12, padding: 4, marginBottom: 24, border: `1.5px solid ${C.parchment}`, gap: 4 }}>
        {[["monthly", `$${STRIPE_CONFIG.monthlyAmount}/month`], ["yearly", `$${STRIPE_CONFIG.yearlyAmount}/year  ·  Save 27%`]].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setBilling(v)}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: billing === v ? 700 : 500,
              background: billing === v ? C.white : "transparent",
              color: billing === v ? C.dark : C.stone,
              boxShadow: billing === v ? "0 2px 6px rgba(42,31,14,0.1)" : "none",
              transition: "all 0.15s",
            }}
          >
            {label}
            {v === "yearly" && billing !== "yearly" && (
              <span style={{ marginLeft: 6, background: C.sage + "22", color: C.sageDark, borderRadius: 100, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>BEST</span>
            )}
          </button>
        ))}
      </div>

      {/* Features */}
      <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
        {features.map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: C.sagePale, border: `1.5px solid ${C.sageLight}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
            }}>
              {icon}
            </div>
            <span style={{ fontFamily: F.body, fontSize: 14, color: C.brown, fontWeight: 500 }}>{text}</span>
            <div style={{ marginLeft: "auto", color: C.sage, fontSize: 14, fontWeight: 700 }}>✓</div>
          </div>
        ))}
      </div>

      <Btn
        full
        variant="primary"
        style={{ fontSize: 14, padding: "14px 24px", borderRadius: 12, letterSpacing: "0.01em" }}
        onClick={() => {
          startStripeCheckout(billing === "monthly" ? STRIPE_CONFIG.monthlyPriceId : STRIPE_CONFIG.yearlyPriceId);
          onUpgrade();
          onClose();
        }}
      >
        Start 14-Day Free Trial →
      </Btn>
      <p style={{ fontFamily: F.body, fontSize: 11, color: C.pebble, textAlign: "center", marginTop: 12, letterSpacing: "0.02em" }}>
        Cancel anytime · No hidden fees · Powered by Stripe
      </p>
    </Modal>
  );
}

// ── Add Animal ─────────────────────────────────────────────────────
const EMOJIS = { Cattle:"🐄", Goat:"🐐", Pig:"🐷", Sheep:"🐑", Chicken:"🐔", Horse:"🐴", Rabbit:"🐰", Duck:"🦆", Other:"🐾" };
const PALETTE = [C.terracotta, C.sage, C.dustyRose, C.sky, C.wheat, C.lavender, C.meadow];

function AddAnimalModal({ onSave, onClose, canAdd }) {
  const [f, setF] = useState({ name: "", species: "Cattle", breed: "", sex: "Female", dob: "", tag: "", notes: "" });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Add to Your Herd" onClose={onClose}>
      {!canAdd && (
        <div style={{ background: C.sagePale, border: `1.5px solid ${C.sageLight}`, borderRadius: 12, padding: 14, marginBottom: 20, fontFamily: F.body, fontSize: 13, color: C.sageDark, lineHeight: 1.6 }}>
          You've reached the 3-animal free limit. <strong>Upgrade to Pro</strong> for unlimited animals.
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div style={{ gridColumn: "1/-1" }}><Input label="Name *" value={f.name} onChange={v => s("name", v)} placeholder="e.g. Biscuit" /></div>
        <Select label="Species" value={f.species} onChange={v => s("species", v)} options={Object.keys(EMOJIS)} />
        <Input label="Breed" value={f.breed} onChange={v => s("breed", v)} placeholder="e.g. Hereford" />
        <Select label="Sex" value={f.sex} onChange={v => s("sex", v)} options={["Female", "Male", "Wether", "Steer", "Castrated"]} />
        <Input label="Tag / ID" value={f.tag} onChange={v => s("tag", v)} placeholder="e.g. HF-001" />
        <div style={{ gridColumn: "1/-1" }}><Input label="Date of Birth" value={f.dob} onChange={v => s("dob", v)} type="date" /></div>
        <div style={{ gridColumn: "1/-1" }}><Input label="Notes" value={f.notes} onChange={v => s("notes", v)} placeholder="Personality, quirks, health notes…" rows={3} /></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose} small>Cancel</Btn>
        <Btn variant="primary" small disabled={!f.name || !canAdd} onClick={() => {
          if (!f.name || !canAdd) return;
          onSave({ ...f, id: uid(), emoji: EMOJIS[f.species] || "🐾", color: PALETTE[Math.floor(Math.random() * PALETTE.length)], meds: [], calving: [], reminders: [], photos: [], weight: [] });
        }}>Add to Herd</Btn>
      </div>
    </Modal>
  );
}

function QuickAddModal({ title, fields, onSave, onClose }) {
  const [f, setF] = useState(() => Object.fromEntries(fields.map(x => [x.key, ""])));
  return (
    <Modal title={title} onClose={onClose}>
      {fields.map(field => field.type === "select"
        ? <Select key={field.key} label={field.label} value={f[field.key]} onChange={v => setF(p => ({ ...p, [field.key]: v }))} options={field.options} />
        : <Input key={field.key} label={field.label} value={f[field.key]} onChange={v => setF(p => ({ ...p, [field.key]: v }))} type={field.type || "text"} rows={field.rows} />
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" small onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" small onClick={() => onSave({ ...f, id: uid() })}>Save</Btn>
      </div>
    </Modal>
  );
}

// ── Animal Avatar ──────────────────────────────────────────────────
function AnimalAvatar({ animal, size = 52, radius = 12 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `linear-gradient(135deg, ${animal.color}33 0%, ${animal.color}11 100%)`,
      border: `2px solid ${animal.color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, flexShrink: 0, overflow: "hidden",
    }}>
      {animal.photos?.[0]
        ? <img src={animal.photos[0].src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={animal.name} />
        : animal.emoji
      }
    </div>
  );
}

// ── Animal Detail ──────────────────────────────────────────────────
function AnimalDetail({ animal, onUpdate, onBack, isPro, onUpgrade }) {
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);
  const upd = patch => onUpdate({ ...animal, ...patch });
  const TABS = [
    { key: "overview",  label: "Overview",   icon: "📋" },
    { key: "photos",    label: "Photos",     icon: "📷" },
    { key: "health",    label: "Health",     icon: "💉" },
    { key: "calving",   label: "Births",     icon: "🌱" },
    { key: "reminders", label: "Reminders",  icon: "🔔" },
  ];

  const age = animal.dob
    ? Math.floor((Date.now() - new Date(animal.dob)) / 31557600000)
    : null;
  const latestWeight = animal.weight?.slice(-1)[0];

  return (
    <div className="pp-animate">
      {/* Header banner */}
      <div style={{
        background: `linear-gradient(135deg, ${animal.color}22 0%, ${animal.color}08 100%)`,
        border: `1.5px solid ${animal.color}33`,
        borderRadius: 20,
        padding: "20px 20px 0",
        marginBottom: 0,
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: animal.color + "14",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{ background: C.white + "CC", backdropFilter: "blur(8px)", border: `1px solid ${C.parchment}`, borderRadius: 10, padding: "7px 13px", cursor: "pointer", fontSize: 16, color: C.stone, flexShrink: 0, marginTop: 2 }}
          >←</button>
          <AnimalAvatar animal={animal} size={64} radius={14} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 6px", fontFamily: F.display, fontSize: 26, color: C.dark, fontWeight: 800, letterSpacing: "-0.02em" }}>{animal.name}</h2>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <Badge color={animal.color}>{animal.breed} {animal.species}</Badge>
              <Badge color={C.stone} outline>{animal.sex}</Badge>
              {animal.tag && <Badge outline>#{animal.tag}</Badge>}
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${animal.color}22`, marginTop: 4 }}>
          {[
            ["Age", age !== null ? `${age} yr${age !== 1 ? "s" : ""}` : "—"],
            ["Weight", latestWeight ? `${latestWeight.lbs} lbs` : "—"],
            ["Tag", animal.tag || "—"],
          ].map(([label, val], i) => (
            <div key={label} style={{ flex: 1, padding: "12px 0", textAlign: i === 1 ? "center" : i === 2 ? "right" : "left", paddingRight: i === 2 ? 0 : 0 }}>
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.dark }}>{val}</div>
              <div style={{ fontFamily: F.body, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, overflowX: "auto", padding: "14px 0 0", marginBottom: 20 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="pp-tab"
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: tab === t.key ? 700 : 500,
              background: tab === t.key ? C.brown : "transparent",
              color: tab === t.key ? C.cream : C.stone,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div style={{ display: "grid", gap: 14 }} className="pp-animate">
          {animal.notes && (
            <Card style={{ borderLeft: `3px solid ${animal.color}`, paddingLeft: 18 }}>
              <div style={{ fontFamily: F.body, fontSize: 10, color: animal.color, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Notes</div>
              <p style={{ margin: 0, fontFamily: F.body, fontSize: 14, color: C.brown, lineHeight: 1.75 }}>{animal.notes}</p>
            </Card>
          )}

          <Card>
            <div style={{ fontFamily: F.body, fontSize: 10, color: C.sage, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16 }}>Animal Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Date of Birth", fmt(animal.dob)],
                ["Species", `${animal.emoji} ${animal.species}`],
                ["Breed", animal.breed || "—"],
                ["Latest Weight", latestWeight ? `${latestWeight.lbs} lbs` : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: F.body, fontSize: 10, color: C.pebble, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontFamily: F.body, fontSize: 15, color: C.dark, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          {!isPro && (
            <div
              onClick={onUpgrade}
              className="pp-card-hover"
              style={{
                cursor: "pointer",
                background: `linear-gradient(135deg, ${C.cream} 0%, ${C.parchment}55 100%)`,
                border: `1.5px solid ${C.parchment}`,
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <HighlandCowLogo size={44} color={C.midBrown} />
              </div>
              <div style={{ fontFamily: F.display, fontSize: 20, color: C.dark, marginBottom: 6, fontWeight: 700 }}>Unlock Pro Features</div>
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.stone, marginBottom: 18, lineHeight: 1.65, maxWidth: 240, margin: "0 auto 18px" }}>
                AI health assistant, unlimited photos, breeding tracker &amp; more — from $9/mo
              </div>
              <Btn variant="primary" small>Start Free Trial</Btn>
            </div>
          )}
        </div>
      )}

      {tab === "photos" && (
        <div className="pp-animate">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h4 style={{ margin: 0, fontFamily: F.display, color: C.dark, fontSize: 20, fontWeight: 700 }}>Photo Gallery</h4>
            {!isPro && <Badge color={C.stone} small outline>{animal.photos?.length || 0} / 2 free</Badge>}
          </div>
          <PhotoUpload
            photos={animal.photos || []}
            onAdd={p => upd({ photos: [...(animal.photos || []), p] })}
            onRemove={id => upd({ photos: (animal.photos || []).filter(p => p.id !== id) })}
            isPro={isPro}
          />
          {(animal.photos || []).length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.pebble }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📷</div>
              <div style={{ fontFamily: F.body, fontSize: 14, color: C.stone }}>No photos yet</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: C.pebble, marginTop: 4 }}>Add your first photo above</div>
            </div>
          )}
        </div>
      )}

      {tab === "health" && (
        <div style={{ display: "grid", gap: 12 }} className="pp-animate">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontFamily: F.display, color: C.dark, fontSize: 20, fontWeight: 700 }}>Medications & Vaccines</h4>
            <Btn small variant="outline" onClick={() => setModal("med")} icon="＋">Add</Btn>
          </div>
          {(animal.meds || []).length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.pebble }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>💉</div>
              <div style={{ fontFamily: F.body, fontSize: 14 }}>No medications recorded yet</div>
            </div>
          )}
          {(animal.meds || []).map(m => {
            const d = daysUntil(m.due);
            const urgent = d !== null && d <= 14 && d >= 0;
            const overdue = d !== null && d < 0;
            return (
              <Card key={m.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: urgent || overdue ? C.terracotta + "15" : C.sagePale,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>💉</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontWeight: 700, color: C.dark, fontSize: 15 }}>{m.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 11, color: C.pebble, marginTop: 3 }}>Given: {fmt(m.date)}</div>
                  {m.due && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <Badge color={overdue ? C.terracotta : urgent ? C.wheat : C.sage} small>
                        {overdue ? "Overdue" : urgent ? `Due in ${d}d` : `Next: ${fmt(m.due)}`}
                      </Badge>
                    </div>
                  )}
                  {m.notes && <div style={{ fontFamily: F.body, fontSize: 13, color: C.stone, marginTop: 6 }}>{m.notes}</div>}
                </div>
                <button onClick={() => upd({ meds: (animal.meds || []).filter(x => x.id !== m.id) })} style={{ background: "none", border: "none", cursor: "pointer", color: C.pebble, fontSize: 16, padding: "2px 4px" }}>✕</button>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "calving" && (
        <div style={{ display: "grid", gap: 12 }} className="pp-animate">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontFamily: F.display, color: C.dark, fontSize: 20, fontWeight: 700 }}>Birth Records</h4>
            <Btn small variant="outline" onClick={() => setModal("calving")} icon="＋">Add</Btn>
          </div>
          {(animal.calving || []).length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🌱</div>
              <div style={{ fontFamily: F.body, fontSize: 14, color: C.stone }}>No birth records yet</div>
            </div>
          )}
          {(animal.calving || []).map(c => (
            <Card key={c.id} style={{ borderLeft: `3px solid ${C.sage}`, paddingLeft: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: F.body, fontWeight: 700, color: C.dark, fontSize: 15 }}>{c.calfName || "Unnamed"}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 11, color: C.pebble, marginTop: 3 }}>{fmt(c.date)}</div>
                  {c.notes && <div style={{ fontFamily: F.body, fontSize: 13, color: C.stone, marginTop: 6 }}>{c.notes}</div>}
                </div>
                <Badge color={C.sage} small>{c.calfSex}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "reminders" && (
        <div style={{ display: "grid", gap: 12 }} className="pp-animate">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontFamily: F.display, color: C.dark, fontSize: 20, fontWeight: 700 }}>Reminders</h4>
            <Btn small variant="outline" onClick={() => setModal("reminder")} icon="＋">Add</Btn>
          </div>
          {(animal.reminders || []).length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔔</div>
              <div style={{ fontFamily: F.body, fontSize: 14, color: C.stone }}>No reminders set</div>
            </div>
          )}
          {(animal.reminders || []).map(r => {
            const d = daysUntil(r.due);
            const urgent = d !== null && d <= 7;
            const overdue = d !== null && d < 0;
            return (
              <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: overdue ? C.terracotta : urgent ? C.wheat : C.sage, flexShrink: 0, boxShadow: urgent ? `0 0 0 3px ${(overdue ? C.terracotta : C.wheat) + "33"}` : "none" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontSize: 15, color: C.dark, fontWeight: 600 }}>{r.text}</div>
                  {r.due && (
                    <div style={{ fontFamily: F.mono, fontSize: 11, marginTop: 3, color: overdue ? C.terracotta : urgent ? C.wheat : C.pebble }}>
                      {fmt(r.due)}{d !== null ? (d === 0 ? " · Today" : d < 0 ? " · Overdue" : ` · ${d}d away`) : ""}
                    </div>
                  )}
                </div>
                <button onClick={() => upd({ reminders: (animal.reminders || []).filter(x => x.id !== r.id) })} style={{ background: "none", border: "none", cursor: "pointer", color: C.pebble, fontSize: 16 }}>✕</button>
              </Card>
            );
          })}
        </div>
      )}

      {modal === "med"      && <QuickAddModal title="Add Medication" onClose={() => setModal(null)} fields={[{ key: "name", label: "Medication Name" }, { key: "date", label: "Date Given", type: "date" }, { key: "due", label: "Next Due Date", type: "date" }, { key: "notes", label: "Notes", rows: 2 }]} onSave={d => { upd({ meds: [...(animal.meds || []), d] }); setModal(null); }} />}
      {modal === "calving"  && <QuickAddModal title="Add Birth Record" onClose={() => setModal(null)} fields={[{ key: "date", label: "Birth Date", type: "date" }, { key: "calfName", label: "Name" }, { key: "calfSex", label: "Sex", type: "select", options: ["Female", "Male"] }, { key: "notes", label: "Notes", rows: 2 }]} onSave={d => { upd({ calving: [...(animal.calving || []), d] }); setModal(null); }} />}
      {modal === "reminder" && <QuickAddModal title="Add Reminder" onClose={() => setModal(null)} fields={[{ key: "text", label: "Reminder" }, { key: "due", label: "Due Date", type: "date" }]} onSave={d => { upd({ reminders: [...(animal.reminders || []), d] }); setModal(null); }} />}
    </div>
  );
}

// ── AI Chat ────────────────────────────────────────────────────────
const QUICK_PROMPTS = ["Is this calf healthy?", "Signs of milk fever?", "Deworming schedule?", "When to wean?", "What to plant now?"];

function AIChat({ animals, isPro, onUpgrade }) {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: "Howdy from PasturePal! 🐄\n\nI'm your AI farm hand — ask me anything about your animals, health concerns, calving, planting, or homesteading. You can even send a photo for a quick health check.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingImg, setPendingImg] = useState(null);
  const imgRef = useRef();
  const bottomRef = useRef();
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const handleImg = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPendingImg(ev.target.result);
    reader.readAsDataURL(file); e.target.value = "";
  };

  const send = async () => {
    if ((!input.trim() && !pendingImg) || loading) return;
    const txt = input.trim() || "Please analyze this photo of my animal.";
    const userMsg = { role: "user", content: txt, image: pendingImg };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs); setInput(""); setPendingImg(null); setLoading(true);
    try {
      const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const imgData = userMsg.image ? userMsg.image.split(",")[1] : null;
      const reply = await askAI(apiMsgs, animals, imgData);
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Something went wrong — please try again." }]);
    }
    setLoading(false);
  };

  if (!isPro) return (
    <div style={{ textAlign: "center", padding: "52px 20px" }} className="pp-animate">
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 92, height: 92, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.cream} 0%, ${C.parchment} 100%)`,
        border: `2px solid ${C.parchment}`,
        boxShadow: `0 0 0 6px ${C.offWhite}, 0 0 0 8px ${C.parchment}55`,
        marginBottom: 22,
      }}>
        <HighlandCowLogo size={60} color={C.midBrown} />
      </div>
      <h3 style={{ fontFamily: F.display, color: C.dark, margin: "0 0 10px", fontSize: 26, fontWeight: 800 }}>AI Farm Hand</h3>
      <p style={{ fontFamily: F.body, color: C.stone, lineHeight: 1.7, fontSize: 14, maxWidth: 300, margin: "0 auto 6px" }}>
        Ask anything about animal health, calving, medications, planting schedules, and more. Send photos for AI health checks.
      </p>
      <p style={{ fontFamily: F.body, fontSize: 11, color: C.pebble, margin: "0 auto 28px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Pro feature · From $9/month</p>
      <Btn variant="primary" onClick={onUpgrade} style={{ padding: "12px 28px", fontSize: 14 }}>Unlock AI Farm Hand</Btn>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 240px)", minHeight: 380 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
            {m.role === "assistant" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, paddingLeft: 2 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.sage + "22", border: `1px solid ${C.sage}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HighlandCowLogo size={12} color={C.sageDark} />
                </div>
                <span style={{ fontFamily: F.body, fontSize: 10, color: C.stone, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Farm Hand</span>
              </div>
            )}
            {m.image && <img src={m.image} style={{ maxWidth: 180, borderRadius: 12, border: `1.5px solid ${C.parchment}`, marginBottom: 4 }} alt="uploaded" />}
            <div style={{
              maxWidth: "80%",
              padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: m.role === "user" ? C.brown : C.white,
              color: m.role === "user" ? C.cream : C.dark,
              fontFamily: F.body,
              fontSize: 14,
              lineHeight: 1.7,
              border: m.role === "user" ? "none" : `1.5px solid ${C.parchment}`,
              boxShadow: m.role === "user" ? "0 2px 8px rgba(61,43,16,0.2)" : "0 1px 4px rgba(42,31,14,0.05)",
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, paddingLeft: 2, marginTop: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.sage + "22", border: `1px solid ${C.sage}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HighlandCowLogo size={12} color={C.sageDark} />
              </div>
            </div>
            <div style={{ padding: "14px 18px", borderRadius: "4px 18px 18px 18px", background: C.white, border: `1.5px solid ${C.parchment}`, display: "flex", gap: 5, alignItems: "center" }}>
              {[1, 2, 3].map(n => (
                <div key={n} className={`pp-dot-${n}`} style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attached image preview */}
      {pendingImg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.sagePale, borderRadius: 10, marginBottom: 6, border: `1px solid ${C.sageLight}` }}>
          <img src={pendingImg} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} alt="pending" />
          <span style={{ fontFamily: F.body, fontSize: 13, color: C.sageDark, flex: 1, fontWeight: 500 }}>Photo ready to send</span>
          <button onClick={() => setPendingImg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.stone, fontSize: 16 }}>✕</button>
        </div>
      )}

      {/* Input bar */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          onClick={() => imgRef.current.click()}
          style={{ background: C.white, border: `1.5px solid ${C.parchment}`, borderRadius: 10, padding: "0 13px", cursor: "pointer", color: C.stone, fontSize: 18, flexShrink: 0, transition: "background 0.15s" }}
        >📷</button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask anything about your farm…"
          style={{ flex: 1, padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.parchment}`, fontFamily: F.body, fontSize: 14, background: C.white, color: C.dark, outline: "none" }}
        />
        <Btn onClick={send} variant="primary" style={{ borderRadius: 10, padding: "11px 20px" }}>Send</Btn>
      </div>

      {/* Quick prompts */}
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {QUICK_PROMPTS.map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            style={{ background: C.white, border: `1.5px solid ${C.parchment}`, borderRadius: 100, padding: "5px 13px", fontFamily: F.body, fontSize: 11, color: C.stone, cursor: "pointer", fontWeight: 500, transition: "background 0.15s, color 0.15s" }}
          >
            {q}
          </button>
        ))}
      </div>
      <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────
function StatCard({ icon, value, label, accent }) {
  return (
    <Card style={{ textAlign: "center", padding: "18px 10px", borderTop: `3px solid ${accent}`, position: "relative", overflow: "hidden" }}>
      <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.85 }}>{icon}</div>
      <div style={{ fontFamily: F.display, fontSize: 32, color: C.dark, fontWeight: 800, lineHeight: 1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontFamily: F.body, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{label}</div>
    </Card>
  );
}

function Dashboard({ animals, onSelect, onUpgrade, isPro }) {
  const allMeds = animals.flatMap(a =>
    (a.meds || []).filter(m => { const d = daysUntil(m.due); return d !== null && d <= 30 && d >= 0; })
      .map(m => ({ ...m, animalName: a.name }))
  );
  const allRem = animals.flatMap(a =>
    (a.reminders || []).filter(r => { const d = daysUntil(r.due); return d !== null && d <= 7 && d >= 0; })
      .map(r => ({ ...r, animalName: a.name }))
  );
  const alerts = [
    ...allMeds.map(m => ({ text: `${m.animalName}: ${m.name}`, due: m.due, type: "med" })),
    ...allRem.map(r => ({ text: `${r.animalName}: ${r.text}`, due: r.due, type: "reminder" })),
  ].sort((a, b) => new Date(a.due) - new Date(b.due));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <StatCard icon="🐄" value={animals.length} label="Animals" accent={C.sage} />
        <StatCard icon="💉" value={allMeds.length} label="Meds Due" accent={allMeds.length > 0 ? C.terracotta : C.parchment} />
        <StatCard icon="🔔" value={allRem.length} label="Reminders" accent={allRem.length > 0 ? C.wheat : C.parchment} />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.terracotta, boxShadow: `0 0 0 3px ${C.terracotta}22` }} />
            <span style={{ fontFamily: F.body, fontSize: 11, color: C.terracotta, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Coming Up</span>
          </div>
          {alerts.map((item, i) => {
            const d = daysUntil(item.due);
            const urgent = d <= 3;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < alerts.length - 1 ? `1px solid ${C.parchment}` : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: urgent ? C.terracotta : C.sage, flexShrink: 0 }} />
                <div style={{ flex: 1, fontFamily: F.body, fontSize: 14, color: C.brown, fontWeight: 500 }}>{item.text}</div>
                <Badge color={urgent ? C.terracotta : C.sage} small>
                  {d === 0 ? "Today" : `${d}d`}
                </Badge>
              </div>
            );
          })}
        </Card>
      )}

      <Divider label="Your Herd" />

      {/* Animal list */}
      {animals.map(a => {
        const medDue = (a.meds || []).some(m => { const d = daysUntil(m.due); return d !== null && d <= 14 && d >= 0; });
        return (
          <Card key={a.id} onClick={() => onSelect(a)} hoverable style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
            <AnimalAvatar animal={a} size={56} radius={12} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.dark, letterSpacing: "-0.01em", marginBottom: 4 }}>{a.name}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <Badge color={a.color} small>{a.breed} {a.species}</Badge>
                <Badge outline small>{a.sex}</Badge>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              {medDue && <Badge color={C.terracotta} small>Med Due</Badge>}
              {(a.calving || []).length > 0 && <Badge color={C.sage} small>{a.calving.length} birth{a.calving.length > 1 ? "s" : ""}</Badge>}
            </div>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ color: C.pebble, flexShrink: 0, marginLeft: 4 }}>
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Card>
        );
      })}

      {/* Upgrade CTA */}
      {!isPro && (
        <div
          onClick={onUpgrade}
          className="pp-card-hover"
          style={{
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.brown}08 0%, ${C.midBrown}05 100%)`,
            border: `1.5px solid ${C.parchment}`,
            borderRadius: 16,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.cream, border: `1.5px solid ${C.parchment}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <HighlandCowLogo size={28} color={C.midBrown} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: 16, color: C.dark, fontWeight: 700, marginBottom: 3 }}>Upgrade to Pro</div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.stone, lineHeight: 1.55 }}>Unlimited animals · AI assistant · Photo gallery · $9/mo</div>
          </div>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ color: C.midBrown, flexShrink: 0 }}>
            <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function PasturePal() {
  const [animals, setAnimals] = useState(SEED);
  const [view, setView] = useState("herd");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const FREE_LIMIT = 3;

  const updateAnimal = a => { setAnimals(p => p.map(x => x.id === a.id ? a : x)); setSelected(a); };
  const addAnimal    = a => { setAnimals(p => [...p, a]); setShowAdd(false); };

  const alertCount = animals.flatMap(a => [
    ...(a.meds || []).filter(m => { const d = daysUntil(m.due); return d !== null && d <= 14 && d >= 0; }),
    ...(a.reminders || []).filter(r => { const d = daysUntil(r.due); return d !== null && d <= 7 && d >= 0; }),
  ]).length;

  return (
    <div style={{ minHeight: "100vh", background: C.cream }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Header ── */}
      <header style={{
        background: C.offWhite + "F2",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.parchment}`,
        position: "sticky",
        top: 0,
        zIndex: 200,
        padding: "0 20px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          {/* Wordmark with logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.cream} 0%, ${C.parchment} 100%)`,
              border: `1.5px solid ${C.parchment}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {/* Barn icon */}
              <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Roof */}
                <path d="M13 1.5L0.5 8.5H25.5L13 1.5Z" fill={C.brown} opacity="0.85"/>
                <path d="M13 1.5L0.5 8.5H25.5L13 1.5Z" stroke={C.brown} strokeWidth="1" strokeLinejoin="round"/>
                {/* Roof ridge */}
                <line x1="13" y1="1.5" x2="13" y2="4" stroke={C.midBrown} strokeWidth="1.2" strokeLinecap="round"/>
                {/* Body */}
                <rect x="2" y="8.5" width="22" height="14" rx="1" fill={C.brown} opacity="0.10"/>
                <rect x="2" y="8.5" width="22" height="14" rx="1" stroke={C.brown} strokeWidth="1.4"/>
                {/* Loft door (top center) */}
                <path d="M10.5 8.5 Q13 5.5 15.5 8.5Z" fill={C.brown} opacity="0.4"/>
                {/* Main door arch */}
                <path d="M10 22.5 L10 16.5 Q13 13.5 16 16.5 L16 22.5" stroke={C.brown} strokeWidth="1.3" fill={C.brown} fillOpacity="0.18"/>
                {/* Left window */}
                <rect x="3.5" y="11.5" width="4.5" height="3.5" rx="0.5" fill={C.brown} opacity="0.25" stroke={C.brown} strokeWidth="1"/>
                <line x1="5.75" y1="11.5" x2="5.75" y2="15" stroke={C.brown} strokeWidth="0.7" opacity="0.5"/>
                {/* Right window */}
                <rect x="18" y="11.5" width="4.5" height="3.5" rx="0.5" fill={C.brown} opacity="0.25" stroke={C.brown} strokeWidth="1"/>
                <line x1="20.25" y1="11.5" x2="20.25" y2="15" stroke={C.brown} strokeWidth="0.7" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
                <span style={{ fontFamily: F.display, fontSize: 22, color: C.dark, fontWeight: 800, letterSpacing: "-0.03em" }}>Pasture</span>
                <span style={{ fontFamily: F.display, fontSize: 22, color: C.sage, fontWeight: 800, letterSpacing: "-0.03em" }}>Pal</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: 9, color: C.pebble, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>Small Farm · Big Heart</div>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {alertCount > 0 && (
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.terracotta, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F.body, fontSize: 11, color: C.white, fontWeight: 700 }}>{alertCount}</span>
              </div>
            )}
            {isPro
              ? <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.sagePale, border: `1.5px solid ${C.sageLight}`, borderRadius: 100, padding: "5px 12px" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }} />
                  <span style={{ fontFamily: F.body, fontSize: 11, color: C.sageDark, fontWeight: 700, letterSpacing: "0.06em" }}>PRO</span>
                </div>
              : <Btn small variant="primary" onClick={() => setShowUpgrade(true)} style={{ borderRadius: 100, padding: "7px 18px" }}>Go Pro</Btn>
            }
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 110px" }}>
        {selected ? (
          <AnimalDetail animal={selected} onUpdate={updateAnimal} onBack={() => setSelected(null)} isPro={isPro} onUpgrade={() => setShowUpgrade(true)} />
        ) : (
          <>
            {/* Primary nav */}
            <div style={{ display: "flex", background: C.white, borderRadius: 12, padding: 4, marginBottom: 28, border: `1.5px solid ${C.parchment}`, gap: 4 }}>
              {[["herd", "My Herd", "🐄"], ["ai", "AI Farm Hand", "🤖"]].map(([v, label, icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="pp-tab"
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: F.body,
                    fontSize: 13,
                    fontWeight: view === v ? 700 : 500,
                    background: view === v ? C.brown : "transparent",
                    color: view === v ? C.cream : C.stone,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: view === v ? "0 2px 8px rgba(61,43,16,0.2)" : "none",
                  }}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {view === "herd" && (
              <div className="pp-animate">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontFamily: F.display, color: C.dark, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 5 }}>{greet()}.</h2>
                    <p style={{ fontFamily: F.body, fontSize: 11, color: C.stone, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                      {isPro ? "✦ Pro · Unlimited herd" : `${animals.length} of ${FREE_LIMIT} free animals`}
                    </p>
                  </div>
                  <Btn
                    small
                    variant="outline"
                    icon="+"
                    onClick={() => { if (!isPro && animals.length >= FREE_LIMIT) { setShowUpgrade(true); return; } setShowAdd(true); }}
                  >
                    Add Animal
                  </Btn>
                </div>
                <Dashboard animals={animals} onSelect={setSelected} onUpgrade={() => setShowUpgrade(true)} isPro={isPro} />
              </div>
            )}

            {view === "ai" && (
              <div className="pp-animate">
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: F.display, color: C.dark, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 5 }}>AI Farm Hand.</h2>
                  <p style={{ fontFamily: F.body, fontSize: 11, color: C.stone, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Your 24/7 homestead advisor</p>
                </div>
                <AIChat animals={animals} isPro={isPro} onUpgrade={() => setShowUpgrade(true)} />
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Footer nav ── */}
      {!selected && (
        <footer style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          background: C.offWhite + "F0",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: `1px solid ${C.parchment}`,
          padding: "10px 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          <HighlandCowLogo size={16} color={C.pebble} />
          <span style={{ fontFamily: F.display, fontSize: 13, color: C.pebble, fontWeight: 700, letterSpacing: "-0.01em" }}>
            Pasture<span style={{ color: C.sageLight }}>Pal</span>
          </span>
          <span style={{ color: C.parchment, fontSize: 10 }}>·</span>
          <span style={{ fontFamily: F.body, fontSize: 10, color: C.pebble, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>Small Farm · Big Heart</span>
        </footer>
      )}

      {showAdd     && <AddAnimalModal onSave={addAnimal} onClose={() => setShowAdd(false)} canAdd={isPro || animals.length < FREE_LIMIT} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={() => setIsPro(true)} />}
    </div>
  );
}
