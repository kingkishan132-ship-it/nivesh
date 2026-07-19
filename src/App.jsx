import React, { useState, useRef, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ---------- Helpers ----------
const inr = (n) =>
  "Rs. " + Math.round(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const PALETTE = ["#1F3A34", "#B08A2E", "#6E8B7A", "#8C6D46", "#3E7A5D", "#B5453B", "#5A7D9A"];

const LAST_UPDATED = "19 Jul 2026";

// Tailwind's arbitrary-value utility classes compile to literal class names
// (e.g. bg-[#F4EFE4]). Rather than retrofitting dark: variants across every
// element, we override the exact compiled selectors under a `.dark` root
// class, using String.raw so backslash escapes reach the stylesheet as-is.
const DARK_MODE_CSS = String.raw`
  .dark.bg-\[\#F4EFE4\] { background-color: #101613 !important; }
  .dark.text-\[\#1F3A34\] { color: #ECE7D8 !important; }
  .dark .bg-\[\#F4EFE4\] { background-color: #101613 !important; }
  .dark .bg-\[\#F4EFE4\]\/95 { background-color: rgba(16,22,19,0.95) !important; }
  .dark .bg-\[\#FBF8F1\] { background-color: #1B2521 !important; }
  .dark .bg-white { background-color: #212C27 !important; }
  .dark .bg-\[\#1F3A34\] { background-color: #0B100E !important; }
  .dark .bg-\[\#1F3A34\]\/5 { background-color: rgba(236,231,216,0.05) !important; }
  .dark .bg-\[\#1F3A34\]\/10 { background-color: rgba(236,231,216,0.08) !important; }
  .dark .bg-\[\#1F3A34\]\/20 { background-color: rgba(236,231,216,0.15) !important; }
  .dark .bg-\[\#B5453B\]\/10 { background-color: rgba(229,119,108,0.15) !important; }
  .dark .bg-\[\#B08A2E\] { background-color: #C79A3A !important; }
  .dark .text-\[\#1F3A34\] { color: #ECE7D8 !important; }
  .dark .text-\[\#1F3A34\]\/30 { color: rgba(236,231,216,0.3) !important; }
  .dark .text-\[\#1F3A34\]\/40 { color: rgba(236,231,216,0.4) !important; }
  .dark .text-\[\#1F3A34\]\/50 { color: rgba(236,231,216,0.5) !important; }
  .dark .text-\[\#1F3A34\]\/60 { color: rgba(236,231,216,0.6) !important; }
  .dark .text-\[\#1F3A34\]\/70 { color: rgba(236,231,216,0.7) !important; }
  .dark .text-\[\#1F3A34\]\/75 { color: rgba(236,231,216,0.75) !important; }
  .dark .text-\[\#1F3A34\]\/80 { color: rgba(236,231,216,0.8) !important; }
  .dark .text-\[\#B08A2E\] { color: #D8B25C !important; }
  .dark .text-\[\#B5453B\] { color: #E5776C !important; }
  .dark .border-\[\#1F3A34\] { border-color: #ECE7D8 !important; }
  .dark .border-\[\#1F3A34\]\/10 { border-color: rgba(236,231,216,0.12) !important; }
  .dark .border-\[\#1F3A34\]\/15 { border-color: rgba(236,231,216,0.15) !important; }
  .dark .border-\[\#1F3A34\]\/20 { border-color: rgba(236,231,216,0.2) !important; }
  .dark .border-\[\#B08A2E\] { border-color: #D8B25C !important; }
  .dark .border-\[\#B5453B\]\/30 { border-color: rgba(229,119,108,0.3) !important; }
  .dark .hover\:bg-\[\#1F3A34\]\/5:hover { background-color: rgba(236,231,216,0.05) !important; }
  .dark .hover\:bg-\[\#1F3A34\]\/10:hover { background-color: rgba(236,231,216,0.1) !important; }
  .dark .hover\:text-\[\#B5453B\]:hover { color: #E5776C !important; }
  .dark .focus\:border-\[\#B08A2E\]:focus { border-color: #D8B25C !important; }
  .dark .focus-within\:border-\[\#B08A2E\]:focus-within { border-color: #D8B25C !important; }
  .dark input, .dark select, .dark textarea { color: #ECE7D8; }
  .dark ::placeholder { color: rgba(236,231,216,0.35); }
`;

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-[#FBF8F1] border border-[#1F3A34]/10 rounded-2xl shadow-[0_2px_20px_rgba(31,58,52,0.06)] ${className}`}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[#B08A2E] font-semibold mb-2">
    <span className="w-4 h-px bg-[#B08A2E]" />
    {children}
  </div>
);

const Disclaimer = ({ children }) => (
  <p className="text-xs text-[#1F3A34]/50 mt-3 leading-relaxed border-t border-[#1F3A34]/10 pt-3">
    {children}
  </p>
);

// ---------- Animation helpers ----------
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const rafRef = useRef();
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

function AnimatedNumber({ value, format = (n) => Math.round(n).toString() }) {
  const animated = useCountUp(value);
  return <>{format(animated)}</>;
}

function RadialScore({ value, max = 100, size = 168, stroke = 14, color = "#3E7A5D", sublabel }) {
  const animated = useCountUp(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, animated / max));
  const offset = circumference * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1F3A3416" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className="font-serif-display text-4xl leading-none">{Math.round(animated)}</div>
        {sublabel && <div className="text-[10px] uppercase tracking-widest text-[#1F3A34]/50 mt-1">{sublabel}</div>}
      </div>
    </div>
  );
}

function StepBadge({ n, color = "#1F3A34" }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

function InfographicRow({ n, color, title, body, action, onClick }) {
  return (
    <div className="flex items-stretch animate-fade-up" style={{ animationDelay: `${n * 100}ms` }}>
      <div className="relative flex items-center justify-center w-16 shrink-0">
        <div
          className="w-14 h-14 rounded-full bg-[#FBF8F1] border-2 flex items-center justify-center font-serif-display text-lg z-10"
          style={{ borderColor: color, color }}
        >
          {String(n).padStart(2, "0")}
        </div>
        <div className="absolute top-1/2 left-[52px] w-4 h-0.5" style={{ backgroundColor: color }} />
      </div>
      <button
        onClick={onClick}
        className="hover-lift press-scale flex-1 text-left -ml-1 pl-8 pr-14 py-5 text-white"
        style={{
          background: `linear-gradient(120deg, ${color}, ${color}D9)`,
          clipPath: "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)",
        }}
      >
        <div className="font-serif-display text-lg mb-1">{title}</div>
        <p className="text-sm text-white/85 leading-relaxed">{body}</p>
        <span className="inline-block mt-2 text-xs font-semibold text-white underline underline-offset-2">{action} &rarr;</span>
      </button>
    </div>
  );
}

function AiInsightCard() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchInsight() {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 150,
            system:
              "You are Nivesh's insight generator. Never use emojis. Reply with exactly one short, practical, general personal-finance tip relevant to someone in India, under 30 words, one plain sentence, no heading and no preamble. Rotate the topic across saving, investing, debt, insurance, taxes, and budgeting rather than always picking the same one.",
            messages: [{ role: "user", content: "Give me one fresh financial tip." }],
          }),
        });
        const data = await response.json();
        const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join(" ").trim();
        if (!cancelled) setInsight(text || "Most people underestimate how much small subscriptions add up. Review your bank statement once a month.");
      } catch (e) {
        if (!cancelled) setInsight("Most people underestimate how much small subscriptions add up. Review your bank statement once a month.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchInsight();
    return () => { cancelled = true; };
  }, []);

  return (
    <Card className="hover-lift p-5 flex items-start gap-4 animate-fade-up">
      <div className="w-10 h-10 rounded-full bg-[#1F3A34] flex items-center justify-center text-[#F4EFE4] font-serif-display text-sm shrink-0">AI</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-[#B08A2E] font-semibold mb-1">Today's insight</div>
        <p className="text-sm text-[#1F3A34]/80 leading-relaxed">{loading ? "Thinking of something useful for you..." : insight}</p>
      </div>
    </Card>
  );
}

function NumberField({ label, value, setValue, prefix, suffix }) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#1F3A34]/70">{label}</label>
      <div className="flex items-center gap-2 mt-1 border-b-2 border-[#1F3A34]/20 focus-within:border-[#B08A2E] py-1">
        {prefix && <span className="font-serif-display text-lg">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
          className="w-full text-xl font-serif-display bg-transparent outline-none"
        />
        {suffix && <span className="text-sm text-[#1F3A34]/50">{suffix}</span>}
      </div>
    </div>
  );
}

function SliderField({ label, value, setValue, min, max, step, format }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-[#1F3A34]/70">{label}</span>
        <span className="font-serif-display">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-[#B08A2E]"
      />
    </div>
  );
}

function ToggleField({ label, value, setValue }) {
  return (
    <button
      onClick={() => setValue(!value)}
      className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#1F3A34]/10"
    >
      <span className="text-sm font-semibold text-[#1F3A34]/80">{label}</span>
      <span
        className={`w-11 h-6 rounded-full relative transition ${value ? "bg-[#3E7A5D]" : "bg-[#1F3A34]/20"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? "left-5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function AdvisorNudge({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#1F3A34]/5 hover:bg-[#1F3A34]/10 border border-[#1F3A34]/10 rounded-xl p-4 flex items-center justify-between transition"
    >
      <span className="text-sm text-[#1F3A34]/80">{text}</span>
      <span className="text-xs font-semibold text-[#B08A2E] whitespace-nowrap ml-3">Ask the Advisor &rarr;</span>
    </button>
  );
}

const TABS = [
  ["advisor", "Advisor"],
  ["decision", "Should I?"],
  ["score", "Health Score"],
  ["goals", "Goal Planner"],
  ["statement", "Statement"],
  ["expenses", "Expenses"],
  ["networth", "Net Worth"],
  ["tools", "Tools"],
  ["habits", "Habits"],
  ["learn", "Learn"],
  ["about", "About"],
];

// ---------- Main App ----------
export default function FinanceAdvisor() {
  const [tab, setTab] = useState("advisor");
  const [advisorQuery, setAdvisorQuery] = useState(null);
  const [decisionQuestion, setDecisionQuestion] = useState(null);
  const [toolsInitial, setToolsInitial] = useState("fire");
  const [dark, setDark] = useState(false);

  const goAsk = (q) => { setAdvisorQuery(q); setTab("advisor"); };
  const goDecide = (q) => { setDecisionQuestion(q); setTab("decision"); };
  const goToTool = (key) => { setToolsInitial(key); setTab("tools"); };

  return (
    <div className={`min-h-screen w-full bg-[#F4EFE4] text-[#1F3A34] font-[Inter] ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-ui { font-family: 'Inter', sans-serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(31,58,52,0.14); }
        .score-bar-fill { transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
        .accordion-body { overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease; }
        .press-scale { transition: transform 0.15s ease; }
        .press-scale:active { transform: scale(0.96); }
        @media print {
          .no-print { display: none !important; }
          body, .min-h-screen { background: #fff !important; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
      `}</style>
      <style>{DARK_MODE_CSS}</style>

      <header className="no-print border-b border-[#1F3A34]/10 sticky top-0 bg-[#F4EFE4]/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1F3A34] flex items-center justify-center text-[#F4EFE4] font-serif-display text-lg">
              R
            </div>
            <div>
              <div className="font-serif-display text-lg leading-none">Nivesh</div>
              <div className="text-[11px] text-[#1F3A34]/50 tracking-wide">
                your AI financial decision companion
              </div>
            </div>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-6 pb-3 flex gap-1 overflow-x-auto scrollbar-none text-sm">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`tab-underline press-scale px-4 py-2 rounded-full whitespace-nowrap ${
                tab === key ? "bg-[#1F3A34] text-[#F4EFE4]" : "text-[#1F3A34]/70 hover:bg-[#1F3A34]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 pb-24">
        {tab === "advisor" && (
          <Advisor
            pendingQuery={advisorQuery}
            onConsumeQuery={() => setAdvisorQuery(null)}
            goDecide={goDecide}
            goToScore={() => setTab("score")}
            goToStatement={() => setTab("statement")}
            goToGoals={() => setTab("goals")}
            goToTool={goToTool}
          />
        )}
        {tab === "decision" && <DecisionEngine pendingQuestion={decisionQuestion} onConsumeQuestion={() => setDecisionQuestion(null)} />}
        {tab === "score" && <HealthScore />}
        {tab === "goals" && <GoalPlanner goDecide={goDecide} />}
        {tab === "statement" && <StatementAnalyzer />}
        {tab === "expenses" && <ExpenseTracker />}
        {tab === "networth" && <NetWorthTracker />}
        {tab === "tools" && <Tools initialTool={toolsInitial} />}
        {tab === "habits" && <Habits />}
        {tab === "learn" && <Learn />}
        {tab === "about" && <AboutPages />}
      </main>

      <footer className="no-print border-t border-[#1F3A34]/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-[#1F3A34]/50 flex flex-wrap gap-2 justify-between">
          <span>Nivesh is an educational tool, not a licensed financial, tax, or investment advisor.</span>
          <span>Markets carry risk. Past returns don't guarantee future ones.</span>
        </div>
      </footer>
    </div>
  );
}

// ---------- Dashboard ----------
function SplitBlock({ label, sub, value, pct, color }) {
  return (
    <div className="hover-lift bg-white rounded-xl p-4 border border-[#1F3A34]/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{pct}</span>
      </div>
      <div className="font-serif-display text-2xl mt-2"><AnimatedNumber value={value} format={inr} /></div>
      <div className="text-xs text-[#1F3A34]/50 mt-1">{sub}</div>
    </div>
  );
}

function AdviceCard({ title, body }) {
  return (
    <Card className="p-5">
      <div className="font-serif-display text-lg mb-2">{title}</div>
      <p className="text-sm text-[#1F3A34]/70 leading-relaxed">{body}</p>
    </Card>
  );
}

function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const months = years * 12;
  const r = rate / 100 / 12;
  const futureValue = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const gains = futureValue - invested;

  return (
    <section>
      <Eyebrow>Calculator</Eyebrow>
      <h2 className="font-serif-display text-2xl mb-4">What could your SIP grow into?</h2>
      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <SliderField label="Monthly SIP amount" value={monthly} setValue={setMonthly} min={500} max={100000} step={500} format={inr} />
          <SliderField label="Time period (years)" value={years} setValue={setYears} min={1} max={35} step={1} format={(v) => `${v} yrs`} />
          <SliderField label="Expected annual return" value={rate} setValue={setRate} min={4} max={20} step={0.5} format={(v) => `${v}%`} />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">Estimated value</div>
          <div className="font-serif-display text-4xl mt-2"><AnimatedNumber value={futureValue} format={inr} /></div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">You invest</div><div className="font-semibold"><AnimatedNumber value={invested} format={inr} /></div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">Growth (est.)</div><div className="font-semibold text-[#D9C27E]"><AnimatedNumber value={gains} format={inr} /></div></div>
          </div>
          <p className="text-xs text-[#F4EFE4]/50 mt-4">Estimate only, assumes a constant return, which real markets do not give.</p>
        </div>
      </Card>
    </section>
  );
}

// ---------- Goal Planner ----------
const GOAL_PRESETS = [
  { key: "phone", label: "Phone", typical: 30000 },
  { key: "bike", label: "Bike", typical: 100000 },
  { key: "car", label: "Car", typical: 800000 },
  { key: "land", label: "Land / Plot", typical: 2000000 },
  { key: "home", label: "Home", typical: 5000000 },
  { key: "custom", label: "Custom", typical: 100000 },
];

function GoalPlanner({ goDecide }) {
  const [goal, setGoal] = useState(GOAL_PRESETS[1]);
  const [price, setPrice] = useState(goal.typical);
  const [current, setCurrent] = useState(10000);
  const [months, setMonths] = useState(12);
  const [income, setIncome] = useState(50000);
  const [useLoan, setUseLoan] = useState(false);

  const pickGoal = (g) => { setGoal(g); setPrice(g.typical); };
  const amountNeeded = Math.max(price - current, 0);
  const requiredMonthly = months > 0 ? amountNeeded / months : amountNeeded;
  const safeCapacity = income * 0.2;
  const capacityRatio = safeCapacity > 0 ? requiredMonthly / safeCapacity : 0;

  const askAiAboutGoal = () => {
    if (!goDecide) return;
    goDecide(
      `I am planning to buy a ${goal.label.toLowerCase()} priced at Rs. ${price}. I already have Rs. ${current} saved, my monthly income is Rs. ${income}, and I want to do this within ${months} months. Is this goal realistic, how much should I invest monthly, and what is the risk?`
    );
  };

  const loanPrincipal = price * 0.8;
  const tenureMonths = Math.max(months, 12);
  const loanRate = 0.10 / 12;
  const emi = (loanPrincipal * loanRate * Math.pow(1 + loanRate, tenureMonths)) / (Math.pow(1 + loanRate, tenureMonths) - 1);
  const emiRatio = income > 0 ? emi / income : 0;

  let verdict, verdictColor, verdictBody;
  if (capacityRatio <= 0.8) {
    verdict = "Good to go"; verdictColor = "#3E7A5D";
    verdictBody = `Saving ${inr(requiredMonthly)} per month comfortably fits inside your recommended savings budget. This is a safe goal at your current income.`;
  } else if (capacityRatio <= 1.3) {
    verdict = "Doable, but tight"; verdictColor = "#B08A2E";
    verdictBody = `You will need to save ${inr(requiredMonthly)} per month, a bit above your usual 20% savings capacity. Either stretch the timeline, trim wants spending temporarily, or lower the target price.`;
  } else {
    verdict = "Risky at this pace"; verdictColor = "#B5453B";
    verdictBody = `${inr(requiredMonthly)} per month is well beyond a safe savings pace for your income. Consider a longer timeline, a smaller or used option, or, for a big-ticket item, a loan instead of saving it all upfront.`;
  }
  const showLoanOption = ["bike", "car", "land", "home"].includes(goal.key);

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Goal planner</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Want to buy something? Let us plan it properly.</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">Pick what you are saving for, and I will tell you the monthly amount you need, and whether it is a safe move for your income.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {GOAL_PRESETS.map((g) => (
          <button key={g.key} onClick={() => pickGoal(g)}
            className={`press-scale px-4 py-2 rounded-full text-sm font-medium border transition ${goal.key === g.key ? "bg-[#1F3A34] text-[#F4EFE4] border-[#1F3A34]" : "border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"}`}>
            {g.label}
          </button>
        ))}
      </div>
      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <NumberField label="Target price" value={price} setValue={setPrice} prefix="Rs." />
          <NumberField label="Savings you already have" value={current} setValue={setCurrent} prefix="Rs." />
          <SliderField label="Time you want to take" value={months} setValue={setMonths} min={1} max={60} step={1} format={(v) => `${v} months`} />
          <NumberField label="Your monthly income" value={income} setValue={setIncome} prefix="Rs." />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">You need to save</div>
          <div className="font-serif-display text-4xl mt-2"><AnimatedNumber value={requiredMonthly} format={inr} /><span className="text-base font-sans-ui text-[#F4EFE4]/60"> / month</span></div>
          <div className="mt-4 inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit transition-colors duration-500" style={{ backgroundColor: verdictColor, color: "#F4EFE4" }}>{verdict}</div>
          <p className="text-sm text-[#F4EFE4]/80 mt-4 leading-relaxed">{verdictBody}</p>
          {goDecide && (
            <button onClick={askAiAboutGoal} className="press-scale mt-4 text-sm font-semibold text-[#D9C27E] text-left w-fit underline">
              Ask the AI if this is realistic &rarr;
            </button>
          )}
        </div>
      </Card>
      {showLoanOption && (
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-display text-xl">Or, buy on loan instead of saving it all?</h3>
            <button onClick={() => setUseLoan(!useLoan)} className="text-sm px-3 py-1.5 rounded-full border border-[#1F3A34]/15 hover:bg-[#1F3A34]/5">{useLoan ? "Hide" : "Show"} estimate</button>
          </div>
          {useLoan && (
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10"><div className="text-[#1F3A34]/50 text-xs">Assumed down payment (20%)</div><div className="font-serif-display text-xl mt-1">{inr(price * 0.2)}</div></div>
              <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10"><div className="text-[#1F3A34]/50 text-xs">Estimated EMI (~10% interest)</div><div className="font-serif-display text-xl mt-1">{inr(emi)}/mo</div></div>
              <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10"><div className="text-[#1F3A34]/50 text-xs">EMI as % of income</div><div className="font-serif-display text-xl mt-1" style={{ color: emiRatio > 0.4 ? "#B5453B" : "#3E7A5D" }}>{(emiRatio * 100).toFixed(0)}%</div></div>
              <p className="sm:col-span-3 text-xs text-[#1F3A34]/50 mt-1">Lenders generally consider EMIs safe up to about 40% of monthly income. Real loan rates vary by lender and credit score.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
// ---------- Expense Tracker ----------
function ExpenseTracker() {
  const [income, setIncome] = useState(50000);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([
    { id: 1, category: "Food", amount: 4200 },
    { id: 2, category: "Travel", amount: 1800 },
    { id: 3, category: "Rent", amount: 15000 },
    { id: 4, category: "Shopping", amount: 2500 },
  ]);

  const categories = ["Food", "Travel", "Rent", "Shopping", "Bills", "Entertainment", "Health", "Other"];

  const addEntry = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    setEntries([...entries, { id: Date.now(), category, amount: amt }]);
    setAmount("");
  };

  const removeEntry = (id) => setEntries(entries.filter((e) => e.id !== id));

  const total = entries.reduce((s, e) => s + e.amount, 0);
  const byCategory = categories
    .map((c) => ({ name: c, value: entries.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) }))
    .filter((c) => c.value > 0);

  const savingsRate = income > 0 ? ((income - total) / income) * 100 : 0;
  const overBudget = total > income * 0.8;

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Expense tracker</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Where is your money actually going?</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">Add every expense as it happens. The breakdown below updates automatically.</p>
      </div>

      <Card className="p-6 grid sm:grid-cols-2 gap-6">
        <NumberField label="Monthly income" value={income} setValue={setIncome} prefix="Rs." />
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-1">
            <label className="text-sm font-semibold text-[#1F3A34]/70">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 border-b-2 border-[#1F3A34]/20 bg-transparent py-2 outline-none text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-1">
            <label className="text-sm font-semibold text-[#1F3A34]/70">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full mt-1 border-b-2 border-[#1F3A34]/20 bg-transparent py-2 outline-none text-sm" />
          </div>
          <button onClick={addEntry} className="bg-[#1F3A34] text-[#F4EFE4] rounded-lg py-2 text-sm font-semibold h-fit">Add</button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-serif-display text-lg mb-4">Spending by category</h3>
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(d) => d.name}>
                  {byCategory.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => inr(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-[#1F3A34]/50">Add an expense to see the chart.</p>}
        </Card>

        <Card className="hover-lift p-6">
          <h3 className="font-serif-display text-lg mb-4">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Total spent this month</span><span className="font-semibold"><AnimatedNumber value={total} format={inr} /></span></div>
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Income</span><span className="font-semibold">{inr(income)}</span></div>
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Savings rate</span><span className="font-semibold" style={{ color: savingsRate >= 20 ? "#3E7A5D" : "#B5453B" }}><AnimatedNumber value={savingsRate} format={(n) => `${n.toFixed(1)}%`} /></span></div>
          </div>
          {overBudget && (
            <div className="mt-4 bg-[#B5453B]/10 border border-[#B5453B]/30 rounded-lg p-3 text-sm text-[#B5453B]">
              Warning: your spending has crossed 80% of your income this month. Review your wants category first.
            </div>
          )}
          <div className="mt-5 max-h-48 overflow-y-auto space-y-2">
            {entries.slice().reverse().map((e) => (
              <div key={e.id} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-[#1F3A34]/10 text-sm">
                <span>{e.category}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{inr(e.amount)}</span>
                  <button onClick={() => removeEntry(e.id)} className="text-[#1F3A34]/40 hover:text-[#B5453B] text-xs">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- Net Worth Tracker ----------
function NetWorthTracker() {
  const [values, setValues] = useState({
    Cash: 15000, Bank: 60000, FD: 100000, Gold: 50000,
    Stocks: 30000, "Mutual Funds": 80000, Crypto: 10000, Loans: 120000,
  });

  const setField = (k, v) => setValues({ ...values, [k]: v });
  const assetKeys = ["Cash", "Bank", "FD", "Gold", "Stocks", "Mutual Funds", "Crypto"];
  const totalAssets = assetKeys.reduce((s, k) => s + (values[k] || 0), 0);
  const totalLoans = values["Loans"] || 0;
  const netWorth = totalAssets - totalLoans;

  const chartData = [...assetKeys.map((k) => ({ name: k, value: values[k] || 0 })), { name: "Loans", value: -(values["Loans"] || 0) }];

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Net worth</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Everything you own, minus everything you owe.</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">Enter your current balances. This is a snapshot, update it monthly to track your progress.</p>
      </div>

      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {assetKeys.map((k) => (
            <NumberField key={k} label={k} value={values[k]} setValue={(v) => setField(k, v)} prefix="Rs." />
          ))}
          <NumberField label="Loans (total outstanding)" value={values["Loans"]} setValue={(v) => setField("Loans", v)} prefix="Rs." />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">Net worth</div>
          <div className="font-serif-display text-4xl mt-2"><AnimatedNumber value={netWorth} format={inr} /></div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">Total assets</div><div className="font-semibold"><AnimatedNumber value={totalAssets} format={inr} /></div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">Total loans</div><div className="font-semibold text-[#E0A9A3]"><AnimatedNumber value={totalLoans} format={inr} /></div></div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-serif-display text-lg mb-4">Breakdown</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F3A3420" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => inr(v)} />
            <Bar dataKey="value" isAnimationActive={true} animationDuration={900} animationEasing="ease-out">
              {chartData.map((d, i) => <Cell key={i} fill={d.value < 0 ? "#B5453B" : PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ---------- Financial Health Score ----------
function HealthScore() {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(35000);
  const [emergencyFund, setEmergencyFund] = useState(60000);
  const [sip, setSip] = useState(4000);
  const [emi, setEmi] = useState(8000);
  const [healthInsurance, setHealthInsurance] = useState(false);
  const [lifeInsurance, setLifeInsurance] = useState(false);
  const [hasGoals, setHasGoals] = useState(true);
  const [showWhy, setShowWhy] = useState(false);

  const monthsCovered = expenses > 0 ? emergencyFund / expenses : 0;
  const efScore = Math.max(0, Math.min(20, (monthsCovered / 6) * 20));

  const savingsRate = income > 0 ? (income - expenses) / income : 0;
  const savingsScore = Math.max(0, Math.min(20, (savingsRate / 0.2) * 20));

  const sipRatio = income > 0 ? sip / income : 0;
  const investScore = Math.max(0, Math.min(20, (sipRatio / 0.1) * 20));

  const emiRatio = income > 0 ? emi / income : 0;
  let debtScore;
  if (emiRatio <= 0.2) debtScore = 20;
  else if (emiRatio >= 0.5) debtScore = 0;
  else debtScore = 20 * (1 - (emiRatio - 0.2) / 0.3);

  const insuranceScore = (healthInsurance ? 5 : 0) + (lifeInsurance ? 5 : 0);
  const goalScore = hasGoals ? 10 : 0;

  const total = Math.round(efScore + savingsScore + investScore + debtScore + insuranceScore + goalScore);

  let zone, zoneColor;
  if (total <= 40) { zone = "Risk Zone"; zoneColor = "#B5453B"; }
  else if (total <= 60) { zone = "Improving"; zoneColor = "#C9772E"; }
  else if (total <= 80) { zone = "Stable"; zoneColor = "#B08A2E"; }
  else { zone = "Financially Healthy"; zoneColor = "#3E7A5D"; }

  // Future stability projection: same inputs projected forward on current habits
  let futureAdjust = 0;
  if (savingsRate >= 0.2) futureAdjust += 8; else if (savingsRate < 0.1) futureAdjust -= 8;
  if (sipRatio >= 0.1) futureAdjust += 5; else if (sip === 0) futureAdjust -= 5;
  if (healthInsurance && lifeInsurance) futureAdjust += 3; else if (!healthInsurance && !lifeInsurance) futureAdjust -= 5;
  if (emiRatio > 0.4) futureAdjust -= 8;
  const futureScore = Math.max(0, Math.min(100, Math.round(total + futureAdjust)));

  const rows = [
    { label: "Emergency Fund", score: efScore, max: 20, reason: monthsCovered >= 6 ? `You have ${monthsCovered.toFixed(1)} months of expenses saved, which meets the 6-month target.` : `You have ${monthsCovered.toFixed(1)} months of expenses saved. Target is 6 months, so ${(20 - efScore).toFixed(0)} points are missing.` },
    { label: "Savings Rate", score: savingsScore, max: 20, reason: `You are saving ${(savingsRate * 100).toFixed(0)}% of income. Target is 20% for a full score.` },
    { label: "Investment Habit", score: investScore, max: 20, reason: sip > 0 ? `Your SIP is ${(sipRatio * 100).toFixed(1)}% of income. Target is 10% for a full score.` : "No regular investment (SIP) detected." },
    { label: "Debt Health", score: debtScore, max: 20, reason: `Your EMI is ${(emiRatio * 100).toFixed(0)}% of income. Safe zone is under 20%; above 50% scores zero.` },
    { label: "Insurance", score: insuranceScore, max: 10, reason: `Health insurance: ${healthInsurance ? "yes" : "missing"}. Life insurance: ${lifeInsurance ? "yes" : "missing"}.` },
    { label: "Goal Planning", score: goalScore, max: 10, reason: hasGoals ? "You have clearly defined financial goals." : "No financial goals defined yet." },
  ];

  // one concrete, computed suggestion
  let suggestion = "";
  if (efScore < 20) {
    const needed = Math.max(0, expenses * 6 - emergencyFund);
    suggestion = `Add ${inr(needed)} more to your emergency fund to reach the full 6-month target and gain up to ${(20 - efScore).toFixed(0)} points.`;
  } else if (investScore < 20) {
    const neededSip = Math.max(0, income * 0.1 - sip);
    suggestion = `Increase your SIP by ${inr(neededSip)} per month to reach 10% of income and gain up to ${(20 - investScore).toFixed(0)} points.`;
  } else if (insuranceScore < 10) {
    suggestion = "Adding the missing insurance cover would recover the remaining points in that category.";
  } else {
    suggestion = "You are close to full marks across categories. Keep habits consistent and revisit this score every few months.";
  }

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Financial health score</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">A CIBIL-style score, for your whole financial life.</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">Enter your numbers honestly. Every point below is calculated from a clear rule, nothing here is random.</p>
      </div>

      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <NumberField label="Monthly income" value={income} setValue={setIncome} prefix="Rs." />
        <NumberField label="Monthly expenses" value={expenses} setValue={setExpenses} prefix="Rs." />
        <NumberField label="Emergency fund saved" value={emergencyFund} setValue={setEmergencyFund} prefix="Rs." />
        <NumberField label="Monthly SIP / investment" value={sip} setValue={setSip} prefix="Rs." />
        <NumberField label="Monthly EMI / debt payment" value={emi} setValue={setEmi} prefix="Rs." />
        <div className="space-y-3">
          <ToggleField label="Have health insurance" value={healthInsurance} setValue={setHealthInsurance} />
          <ToggleField label="Have life insurance" value={lifeInsurance} setValue={setLifeInsurance} />
          <ToggleField label="Have defined financial goals" value={hasGoals} setValue={setHasGoals} />
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <RadialScore value={total} color={zoneColor} sublabel="/ 100" />
            <div className="px-4 py-2 rounded-full text-sm font-semibold w-fit transition-colors duration-500" style={{ backgroundColor: zoneColor, color: "#F4EFE4" }}>{zone}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#1F3A34]/50 mb-1 text-center sm:text-left">Category breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={rows} dataKey="max" nameKey="label" innerRadius={48} outerRadius={80} paddingAngle={3} isAnimationActive animationDuration={900} animationEasing="ease-out">
                  {rows.map((r, i) => (
                    <Cell key={i} fill={r.score / r.max >= 0.8 ? "#3E7A5D" : r.score / r.max >= 0.5 ? "#B08A2E" : "#B5453B"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, entry) => [`${entry.payload.score.toFixed(0)}/${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1 text-xs">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.score / r.max >= 0.8 ? "#3E7A5D" : r.score / r.max >= 0.5 ? "#B08A2E" : "#B5453B" }} />
                  <span className="text-[#1F3A34]/70 truncate">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {rows.map((r, i) => (
            <div key={r.label} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{r.label}</span>
                <span className="text-[#1F3A34]/60">{r.score.toFixed(0)}/{r.max}</span>
              </div>
              <div className="w-full h-2 bg-[#1F3A34]/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full score-bar-fill" style={{ width: `${(r.score / r.max) * 100}%`, backgroundColor: r.score / r.max >= 0.8 ? "#3E7A5D" : r.score / r.max >= 0.5 ? "#B08A2E" : "#B5453B" }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowWhy(!showWhy)} className="press-scale mt-5 text-sm font-semibold text-[#B08A2E] underline">
          {showWhy ? "Hide" : "Why did I get this score?"}
        </button>
        <div className="accordion-body" style={{ maxHeight: showWhy ? "600px" : "0px", opacity: showWhy ? 1 : 0 }}>
          <div className="mt-3 space-y-2 text-sm text-[#1F3A34]/70">
            {rows.map((r) => <p key={r.label}><span className="font-semibold text-[#1F3A34]">{r.label}:</span> {r.reason}</p>)}
          </div>
        </div>

        <div className="mt-6 bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60 mb-1">One concrete step</div>
          <p className="text-sm leading-relaxed">{suggestion}</p>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <h3 className="font-serif-display text-xl mb-2">Future stability projection</h3>
        <p className="text-sm text-[#1F3A34]/60 mb-4">If your current habits continue unchanged, here is a directional projection five years out. This is illustrative, not a guarantee.</p>
        <div className="flex items-center gap-6">
          <div><div className="text-xs text-[#1F3A34]/50">Today</div><div className="font-serif-display text-3xl"><AnimatedNumber value={total} /></div></div>
          <div className="text-[#1F3A34]/30">to</div>
          <div><div className="text-xs text-[#1F3A34]/50">In 5 years</div><div className="font-serif-display text-3xl" style={{ color: futureScore >= total ? "#3E7A5D" : "#B5453B" }}><AnimatedNumber value={futureScore} /></div></div>
        </div>
        <Disclaimer>This projection is a simple rule-based estimate based on your current savings rate, investment habit, insurance cover, and EMI load. It is not a statistical forecast.</Disclaimer>
      </Card>
    </div>
  );
}
// ---------- Tools (calculators) ----------
function Tools({ initialTool }) {
  const [tool, setTool] = useState(initialTool || "fire");

  useEffect(() => {
    if (initialTool) setTool(initialTool);
  }, [initialTool]);

  const toolList = [
    ["savevsinvest", "Save or Invest?"],
    ["fire", "FIRE Calculator"],
    ["tax", "Tax Calculator"],
    ["inflation", "Inflation Calculator"],
    ["emisip", "EMI vs SIP"],
    ["compare", "Investment Comparison"],
    ["salary", "Salary Growth"],
    ["goal", "Goal Coverage"],
  ];
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Tools</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Calculators for the big decisions.</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {toolList.map(([k, l]) => (
          <button key={k} onClick={() => setTool(k)} className={`press-scale px-4 py-2 rounded-full text-sm font-medium border transition ${tool === k ? "bg-[#1F3A34] text-[#F4EFE4] border-[#1F3A34]" : "border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"}`}>{l}</button>
        ))}
      </div>
      {tool === "savevsinvest" && <SaveVsInvest />}
      {tool === "fire" && <FireCalculator />}
      {tool === "tax" && <TaxCalculator />}
      {tool === "inflation" && <InflationCalculator />}
      {tool === "emisip" && <EmiVsSip />}
      {tool === "compare" && <InvestmentComparison />}
      {tool === "salary" && <SalaryGrowth />}
      {tool === "goal" && <GoalCoverage />}
    </div>
  );
}

function SaveVsInvest() {
  const [goalName, setGoalName] = useState("Car");
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [years, setYears] = useState(3);
  const [saveRate, setSaveRate] = useState(4);
  const [sipRate, setSipRate] = useState(12);

  const months = years * 12;
  const fvOf = (rate) => {
    const r = rate / 100 / 12;
    return monthlyAmount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  };
  const fvSave = fvOf(saveRate);
  const fvSip = fvOf(sipRate);
  const difference = fvSip - fvSave;

  let recommendation, reason, color;
  if (years < 3) {
    recommendation = "Prioritize saving, not investing";
    color = "#5A7D9A";
    reason = `With less than 3 years to your ${goalName || "goal"}, a market dip right before you need the money could leave you short. A savings account, recurring deposit, or short-term FD protects what you have already built.`;
  } else if (years <= 7) {
    recommendation = "A mix of both fits best";
    color = "#B08A2E";
    reason = `Between 3 and 7 years, splitting the amount, part into a SIP and part into FD or a debt fund, balances growth against protection. Consider shifting more into safer options as the date gets closer.`;
  } else {
    recommendation = "A SIP is likely the better fit";
    color = "#3E7A5D";
    reason = `With ${years} years to go, you have enough runway to ride out short-term market swings. Equity SIPs have historically outpaced plain savings over periods this long, though the path will have ups and downs.`;
  }

  const chartData = [
    { name: "Plain Savings / FD", value: Math.round(fvSave), color: "#5A7D9A" },
    { name: "SIP (Equity Fund)", value: Math.round(fvSip), color: "#3E7A5D" },
  ];

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#1F3A34]/70">What are you saving for</label>
            <input value={goalName} onChange={(e) => setGoalName(e.target.value)} className="w-full mt-1 border-b-2 border-[#1F3A34]/20 bg-transparent py-2 outline-none" />
          </div>
          <NumberField label="Amount you can set aside monthly" value={monthlyAmount} setValue={setMonthlyAmount} prefix="Rs." />
          <SliderField label="Time until you need it" value={years} setValue={setYears} min={1} max={20} step={1} format={(v) => `${v} yrs`} />
          <SliderField label="Plain savings / FD rate" value={saveRate} setValue={setSaveRate} min={2} max={8} step={0.5} format={(v) => `${v}%`} />
          <SliderField label="Expected SIP return" value={sipRate} setValue={setSipRate} min={6} max={16} step={0.5} format={(v) => `${v}%`} />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F3A3420" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => inr(v)} />
            <Bar dataKey="value" isAnimationActive animationDuration={900}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6">
        <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">Our suggestion for this goal</div>
        <div className="px-3 py-1.5 mt-2 rounded-full text-sm font-semibold w-fit" style={{ backgroundColor: color, color: "#F4EFE4" }}>{recommendation}</div>
        <p className="text-sm leading-relaxed mt-3 text-[#F4EFE4]/90">{reason}</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-t border-white/10 pt-4">
          <div><div className="text-[#F4EFE4]/60 text-xs">Plain savings gives you</div><div className="font-semibold"><AnimatedNumber value={fvSave} format={inr} /></div></div>
          <div><div className="text-[#F4EFE4]/60 text-xs">SIP could give you</div><div className="font-semibold text-[#D9C27E]"><AnimatedNumber value={fvSip} format={inr} /></div></div>
        </div>
      </div>
      <Disclaimer>This weighs a standard risk-versus-timeline rule of thumb, not a personalized recommendation. SIP returns are not guaranteed and can be negative over short periods; savings and FD returns are steadier but historically lower over long periods.</Disclaimer>
    </Card>
  );
}

function FireCalculator() {
  const [age, setAge] = useState(28);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
  const [currentSavings, setCurrentSavings] = useState(200000);
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [rate, setRate] = useState(11);

  const annualExpenses = monthlyExpenses * 12;
  const fireNumber = annualExpenses * 25;
  const r = rate / 100 / 12;

  let corpus = currentSavings;
  let m = 0;
  while (corpus < fireNumber && m < 900) {
    corpus = corpus * (1 + r) + monthlyInvest;
    m++;
  }
  const retireAge = age + m / 12;

  return (
    <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <NumberField label="Current age" value={age} setValue={setAge} />
        <NumberField label="Monthly expenses" value={monthlyExpenses} setValue={setMonthlyExpenses} prefix="Rs." />
        <NumberField label="Current savings and investments" value={currentSavings} setValue={setCurrentSavings} prefix="Rs." />
        <NumberField label="Monthly investment" value={monthlyInvest} setValue={setMonthlyInvest} prefix="Rs." />
        <SliderField label="Expected annual return" value={rate} setValue={setRate} min={4} max={16} step={0.5} format={(v) => `${v}%`} />
      </div>
      <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
        <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">Your FIRE number</div>
        <div className="font-serif-display text-3xl mt-1"><AnimatedNumber value={fireNumber} format={inr} /></div>
        <div className="text-xs text-[#F4EFE4]/50 mt-1">25 times your annual expenses (the 4% rule)</div>
        <div className="mt-5 text-xs uppercase tracking-widest text-[#F4EFE4]/60">Projected retirement age</div>
        <div className="font-serif-display text-4xl mt-1">{m < 900 ? <AnimatedNumber value={retireAge} format={(n) => Math.round(n).toString()} /> : "50+ yrs away"}</div>
        <Disclaimer>Assumes constant returns and expenses, which real life will not give you exactly. Use as a directional guide.</Disclaimer>
      </div>
    </Card>
  );
}

function TaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState(900000);
  const [section80C, setSection80C] = useState(100000);
  const [hra, setHra] = useState(0);

  const calcNewRegime = (income) => {
    const taxableIncome = Math.max(0, income - 75000); // standard deduction
    const slabs = [
      [400000, 0], [400000, 0.05], [400000, 0.10], [400000, 0.15], [400000, 0.20], [400000, 0.25], [Infinity, 0.30],
    ];
    let remaining = taxableIncome;
    let tax = 0;
    for (const [width, rate] of slabs) {
      const amt = Math.min(remaining, width);
      tax += amt * rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    if (taxableIncome <= 1200000) tax = 0; // section 87A enhanced rebate
    return { taxableIncome, tax: Math.round(tax) };
  };

  const calcOldRegime = (income) => {
    const deductions = Math.min(section80C, 150000) + Math.min(hra, income * 0.4) + 50000;
    const taxableIncome = Math.max(0, income - deductions);
    const slabs = [[250000, 0], [250000, 0.05], [500000, 0.20], [Infinity, 0.30]];
    let remaining = taxableIncome;
    let tax = 0;
    for (const [width, rate] of slabs) {
      const amt = Math.min(remaining, width);
      tax += amt * rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    if (taxableIncome <= 500000) tax = 0; // section 87A basic rebate
    return { taxableIncome, tax: Math.round(tax) };
  };

  const newR = calcNewRegime(annualIncome);
  const oldR = calcOldRegime(annualIncome);
  const better = newR.tax <= oldR.tax ? "New Regime" : "Old Regime";

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <NumberField label="Annual income (gross)" value={annualIncome} setValue={setAnnualIncome} prefix="Rs." />
          <NumberField label="Section 80C investments (old regime only)" value={section80C} setValue={setSection80C} prefix="Rs." />
          <NumberField label="HRA claimed (old regime only)" value={hra} setValue={setHra} prefix="Rs." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="hover-lift bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">New Regime</div>
            <div className="font-serif-display text-2xl mt-1"><AnimatedNumber value={newR.tax} format={inr} /></div>
            <div className="text-xs text-[#1F3A34]/50 mt-1">Taxable: {inr(newR.taxableIncome)}</div>
          </div>
          <div className="hover-lift bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Old Regime</div>
            <div className="font-serif-display text-2xl mt-1"><AnimatedNumber value={oldR.tax} format={inr} /></div>
            <div className="text-xs text-[#1F3A34]/50 mt-1">Taxable: {inr(oldR.taxableIncome)}</div>
          </div>
          <div className="col-span-2 bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">Lower tax for you</div>
            <div className="font-serif-display text-xl mt-1">{better}</div>
          </div>
        </div>
      </div>
      <Disclaimer>This is a simplified, approximate estimate for education only, using illustrative slab structures. It excludes cess, surcharge, and several deduction types. Confirm your actual liability with a qualified tax professional or the official income tax portal.</Disclaimer>
    </Card>
  );
}

function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const presentValueOfFuture = amount / Math.pow(1 + rate / 100, years);

  return (
    <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <NumberField label="Amount today" value={amount} setValue={setAmount} prefix="Rs." />
        <SliderField label="Number of years" value={years} setValue={setYears} min={1} max={40} step={1} format={(v) => `${v} yrs`} />
        <SliderField label="Assumed inflation rate" value={rate} setValue={setRate} min={2} max={12} step={0.5} format={(v) => `${v}%`} />
      </div>
      <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
        <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">To buy the same things in {years} years, you will need</div>
        <div className="font-serif-display text-3xl mt-2"><AnimatedNumber value={futureValue} format={inr} /></div>
        <div className="mt-5 text-xs uppercase tracking-widest text-[#F4EFE4]/60">Rs.{amount.toLocaleString("en-IN")} in {years} years will feel like today's</div>
        <div className="font-serif-display text-2xl mt-1"><AnimatedNumber value={presentValueOfFuture} format={inr} /></div>
        <Disclaimer>Assumes a constant inflation rate over the entire period.</Disclaimer>
      </div>
    </Card>
  );
}

function EmiVsSip() {
  const [price, setPrice] = useState(150000);
  const [years, setYears] = useState(3);
  const [loanRate, setLoanRate] = useState(11);
  const [sipRate, setSipRate] = useState(12);

  const months = years * 12;
  const r = loanRate / 100 / 12;
  const emi = (price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = emi * months;
  const totalInterest = totalPaid - price;

  const sr = sipRate / 100 / 12;
  const sipFutureValue = emi * ((Math.pow(1 + sr, months) - 1) / sr) * (1 + sr);

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <NumberField label="Item price" value={price} setValue={setPrice} prefix="Rs." />
          <SliderField label="Loan tenure" value={years} setValue={setYears} min={1} max={7} step={1} format={(v) => `${v} yrs`} />
          <SliderField label="Loan interest rate" value={loanRate} setValue={setLoanRate} min={6} max={20} step={0.5} format={(v) => `${v}%`} />
          <SliderField label="Alternative SIP return" value={sipRate} setValue={setSipRate} min={4} max={16} step={0.5} format={(v) => `${v}%`} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="hover-lift bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Monthly EMI if you take the loan</div>
            <div className="font-serif-display text-2xl mt-1"><AnimatedNumber value={emi} format={inr} /></div>
          </div>
          <div className="hover-lift bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Total interest paid over the loan</div>
            <div className="font-serif-display text-2xl mt-1 text-[#B5453B]"><AnimatedNumber value={totalInterest} format={inr} /></div>
          </div>
          <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-4">
            <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">If you invested that same EMI instead</div>
            <div className="font-serif-display text-2xl mt-1"><AnimatedNumber value={sipFutureValue} format={inr} /></div>
            <div className="text-xs text-[#F4EFE4]/50 mt-1">value after {years} years</div>
          </div>
        </div>
      </div>
      <Disclaimer>This compares the cost of borrowing against the opportunity cost of investing instead. It ignores that you would not have the item itself if you chose to invest, and it assumes constant rates.</Disclaimer>
    </Card>
  );
}

function InvestmentComparison() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const assumptions = [
    { name: "FD", rate: 6.5, color: "#5A7D9A" },
    { name: "SIP (Equity Fund)", rate: 12, color: "#1F3A34" },
    { name: "Gold", rate: 8, color: "#B08A2E" },
    { name: "Stocks (long-term avg)", rate: 14, color: "#B5453B" },
  ];
  const months = years * 12;
  const data = assumptions.map((a) => {
    const r = a.rate / 100 / 12;
    const fv = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    return { name: a.name, value: Math.round(fv), color: a.color };
  });

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <NumberField label="Monthly investment" value={monthly} setValue={setMonthly} prefix="Rs." />
        <SliderField label="Time period" value={years} setValue={setYears} min={1} max={30} step={1} format={(v) => `${v} yrs`} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F3A3420" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => inr(v)} />
          <Bar dataKey="value">{data.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
      <Disclaimer>Returns shown are long-term historical averages used for illustration only. Stocks and equity funds carry meaningfully higher year-to-year volatility than FDs or gold, and actual future returns are not guaranteed for any asset class.</Disclaimer>
    </Card>
  );
}

function SalaryGrowth() {
  const [currentSalary, setCurrentSalary] = useState(40000);
  const [growth, setGrowth] = useState(10);
  const [years, setYears] = useState(10);

  const data = [];
  for (let y = 0; y <= years; y++) {
    data.push({ year: `Yr ${y}`, salary: Math.round(currentSalary * Math.pow(1 + growth / 100, y)) });
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <NumberField label="Current monthly salary" value={currentSalary} setValue={setCurrentSalary} prefix="Rs." />
        <SliderField label="Expected annual growth" value={growth} setValue={setGrowth} min={2} max={20} step={0.5} format={(v) => `${v}%`} />
        <SliderField label="Projection period" value={years} setValue={setYears} min={1} max={25} step={1} format={(v) => `${v} yrs`} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F3A3420" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => inr(v)} />
          <Line type="monotone" dataKey="salary" stroke="#1F3A34" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <Disclaimer>Assumes steady, uninterrupted growth at the rate you set, which real careers rarely follow exactly.</Disclaimer>
    </Card>
  );
}

function GoalCoverage() {
  const [goalName, setGoalName] = useState("Home down payment");
  const [goalAmount, setGoalAmount] = useState(2000000);
  const [years, setYears] = useState(8);
  const [monthlySaving, setMonthlySaving] = useState(15000);
  const [rate, setRate] = useState(11);

  const months = years * 12;
  const r = rate / 100 / 12;
  const projected = monthlySaving * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const coverage = goalAmount > 0 ? Math.min(100, (projected / goalAmount) * 100) : 0;
  const requiredMonthly = goalAmount > 0 ? (goalAmount / (((Math.pow(1 + r, months) - 1) / r) * (1 + r))) : 0;

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#1F3A34]/70">Goal name</label>
            <input value={goalName} onChange={(e) => setGoalName(e.target.value)} className="w-full mt-1 border-b-2 border-[#1F3A34]/20 bg-transparent py-2 outline-none" />
          </div>
          <NumberField label="Goal amount" value={goalAmount} setValue={setGoalAmount} prefix="Rs." />
          <SliderField label="Time to goal" value={years} setValue={setYears} min={1} max={30} step={1} format={(v) => `${v} yrs`} />
          <NumberField label="Current monthly saving toward this goal" value={monthlySaving} setValue={setMonthlySaving} prefix="Rs." />
          <SliderField label="Expected annual return" value={rate} setValue={setRate} min={4} max={16} step={0.5} format={(v) => `${v}%`} />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">{goalName || "Your goal"}</div>
          <div className="font-serif-display text-3xl mt-2"><AnimatedNumber value={coverage} format={(n) => `${n.toFixed(0)}%`} /> projected coverage</div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-[#D9C27E] rounded-full score-bar-fill" style={{ width: `${coverage}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">Projected corpus</div><div className="font-semibold"><AnimatedNumber value={projected} format={inr} /></div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">To reach 100%, save</div><div className="font-semibold"><AnimatedNumber value={requiredMonthly} format={inr} />/mo</div></div>
          </div>
          <Disclaimer>This is a deterministic projection based on the numbers you entered, not a statistical probability. Real returns vary year to year.</Disclaimer>
        </div>
      </div>
    </Card>
  );
}

// ---------- Learn ----------
const TOPICS = [
  { title: "SIP - Systematic Investment Plan", body: "A SIP is a standing instruction: a fixed amount is taken from your bank account every month and put into a mutual fund. You do not need a lump sum, and you do not need to time the market. Over years, it builds the habit of investing and smooths out the ups and downs of the market, a process called rupee cost averaging.", good: "Good for: long-term goals, beginners, people who want discipline without effort." },
  { title: "Mutual Fund", body: "A mutual fund pools money from thousands of investors and a professional fund manager invests it in stocks, bonds, or both, depending on the fund's category. You own units of the fund, and the unit price moves with the value of what it holds.", good: "Good for: people who want market returns without researching individual companies." },
  { title: "Trading (Stock Trading)", body: "Trading means buying and selling stocks or other assets over short periods to profit from price movement. It needs constant attention, quick decisions, and a real risk of losing capital fast. Most retail traders underperform simply staying invested in a broad index fund.", good: "Caution: only trade with money you can afford to lose, and only after learning risk management." },
  { title: "ETF (Exchange Traded Fund)", body: "An ETF is similar to a mutual fund, but its units trade on the stock exchange throughout the day like a regular stock. Most ETFs simply track an index, so costs are usually lower than actively managed mutual funds.", good: "Good for: low-cost, passive, index-based investing." },
  { title: "Emergency Fund", body: "Money set aside purely for the unexpected: job loss, medical bills, urgent repairs. It should sit somewhere safe and easy to access, like a savings account or a liquid mutual fund, not in stocks.", good: "Target: 3 to 6 months of your essential monthly expenses." },
  { title: "Credit Score", body: "A three-digit number, 300 to 900 in India via CIBIL, that tells lenders how reliable you are with debt. It is built from repayment history, credit usage, and loan mix.", good: "Fix it by paying every EMI and credit card bill on time, and not maxing out your credit limit." },
  { title: "Inflation", body: "The slow rise in prices over time, which quietly reduces what your money can buy. Letting money sit idle in cash is a hidden loss; investments need to beat inflation to actually grow your wealth.", good: "Rule of thumb: your investments should target returns above the inflation rate." },
  { title: "Gold as an Investment", body: "Gold tends to hold value over long periods and often moves differently from stocks, which is why it is used for diversification. It typically returns less than equities over long horizons but can cushion a portfolio during market stress.", good: "Good for: a small diversification slice, not as your main growth investment." },
  { title: "Bonds", body: "A bond is essentially a loan you give to a government or company, which pays you fixed interest and returns your principal at maturity. Bonds are generally lower risk and lower return than stocks.", good: "Good for: stability and predictable income, especially closer to a goal deadline." },
  { title: "PPF (Public Provident Fund)", body: "A government-backed, long-term savings scheme with a 15-year lock-in, tax-free interest, and tax deduction on contributions under Section 80C. Interest rates are set quarterly by the government.", good: "Good for: safe, tax-efficient, very long-term savings." },
  { title: "NPS (National Pension System)", body: "A retirement-focused investment scheme that invests in a mix of equity, corporate bonds, and government securities. Withdrawals before retirement are restricted, and at retirement, part of the corpus must buy an annuity.", good: "Good for: disciplined, tax-efficient retirement savings." },
  { title: "Health and Life Insurance", body: "Health insurance covers medical costs so a hospital bill does not wipe out your savings. Life insurance, specifically term insurance, replaces your income for dependents if you pass away. Neither is an investment; both exist purely to transfer risk away from you.", good: "Get term life insurance if others depend on your income; get health insurance regardless." },
];

// ---------- Habits ----------
const HABITS = [
  { title: "Build a budget you'll actually keep", body: "A rigid spreadsheet fails the first time life throws a surprise expense. List your fixed costs, then decide the rest by priority rather than by rule. A flexible plan beats a perfect one you abandon in a month." },
  { title: "Track spending before trying to fix it", body: "You cannot manage what you cannot see. Log every expense for a few weeks and patterns show up on their own, forgotten subscriptions, impulse buys, categories quietly creeping up. Review it weekly, not once a year." },
  { title: "Build an emergency fund before anything else", body: "Most households would struggle to absorb a sudden large expense without borrowing. Start with whatever you can, even a small fixed amount each week, and treat it like a bill you owe yourself." },
  { title: "Pay yourself first", body: "Move money to savings the moment you're paid, before spending gets a chance to claim it. Automate the transfer so saving is the default, not a decision you have to make every month." },
  { title: "Resist lifestyle inflation", body: "A raise tempts you to spend more, but holding your lifestyle steady after a bump in income, and redirecting the difference into savings or debt payoff, is what actually moves your net worth." },
  { title: "Check your credit score on a schedule", body: "Your CIBIL score shapes the interest rate you're offered on every future loan. Checking it regularly catches errors early and shows you which habits are helping or hurting." },
  { title: "Attack high-interest debt first", body: "Credit card interest in India often runs well above 30% a year. At that rate, the balance can grow faster than you can pay it down. Send extra payments to the highest-interest debt before anything else." },
  { title: "Set specific goals, not vague ones", body: "\"Save more\" rarely works. \"Save Rs. 3 lakh for a down payment by 2029\" gives every rupee a job and makes daily spending decisions easier." },
  { title: "Start retirement savings as early as possible", body: "Time does more work than the size of your contribution. Money invested in your twenties has decades to compound; the same amount started a decade later has far less runway at the same return." },
  { title: "Audit your spending on a fixed schedule", body: "A monthly look through your statements catches the subscription you forgot to cancel, the grocery bill that quietly crept up, and the recurring charge that increased without notice." },
  { title: "Keep learning as your finances change", body: "What worked in your twenties won't fit your forties. Revisit the basics periodically, tax rules change, new instruments appear, and your own goals shift." },
  { title: "Let tools do the routine work", body: "Expense trackers, subscription finders, and automated transfers remove the friction that makes good habits hard to keep. The right tool is the one simple enough that you'll actually keep using it." },
  { title: "Plan for costs that aren't monthly but aren't emergencies", body: "Insurance renewals, festival spending, annual subscriptions, none of these are surprises, so none of them should eat into your emergency fund. Set aside a little each month for them instead." },
  { title: "Revisit your plan when life changes", body: "A promotion, a new dependent, a move to a new city, any of these should trigger a fresh look at your budget and goals, not just a mental note to adjust later." },
  { title: "Don't figure it out entirely alone", body: "Reading, a good podcast, or a conversation with a professional can shortcut years of trial and error. Asking for help is a sign of financial maturity, not a lack of it." },
];

function HabitCard({ n, title, body, color }) {
  return (
    <div
      className="hover-lift animate-fade-up relative bg-[#FBF8F1] border border-[#1F3A34]/10 rounded-2xl shadow-[0_2px_20px_rgba(31,58,52,0.06)] p-6 pt-9 overflow-hidden"
      style={{ animationDelay: `${n * 45}ms` }}
    >
      <div
        className="absolute -top-5 -right-5 w-20 h-20 rounded-full flex items-end justify-start text-white font-serif-display text-sm"
        style={{ backgroundColor: color }}
      >
        <span className="mb-4 ml-4">{String(n).padStart(2, "0")}</span>
      </div>
      <div className="font-serif-display text-lg mb-2 pr-6">{title}</div>
      <p className="text-sm text-[#1F3A34]/70 leading-relaxed">{body}</p>
    </div>
  );
}

function Habits() {
  return (
    <div>
      <Eyebrow>Fifteen habits</Eyebrow>
      <h1 className="font-serif-display text-3xl mb-2">The habits that actually build wealth</h1>
      <p className="text-[#1F3A34]/60 mb-6 max-w-xl">None of these need a large income to start. They need consistency more than size.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {HABITS.map((h, i) => (
          <HabitCard key={h.title} n={i + 1} title={h.title} body={h.body} color={PALETTE[i % PALETTE.length]} />
        ))}
      </div>
    </div>
  );
}

function Learn() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <Eyebrow>Plain-language glossary</Eyebrow>
      <h1 className="font-serif-display text-3xl mb-6">Finance words, explained clearly</h1>
      <div className="space-y-4">
        {TOPICS.map((t, i) => {
          const color = PALETTE[i % PALETTE.length];
          return (
            <div key={i} className="bg-[#FBF8F1] border border-[#1F3A34]/10 rounded-2xl shadow-[0_2px_20px_rgba(31,58,52,0.06)] hover-lift animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="press-scale w-full flex items-stretch text-left">
                <div className="relative flex items-center justify-center w-16 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#FBF8F1] border-2 flex items-center justify-center font-serif-display text-sm z-10" style={{ borderColor: color, color }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute top-1/2 left-[46px] w-4 h-0.5" style={{ backgroundColor: color }} />
                </div>
                <div
                  className="flex-1 flex items-center justify-between -ml-1 pl-6 pr-6 py-4 text-white rounded-r-2xl"
                  style={{ background: `linear-gradient(120deg, ${color}, ${color}D9)`, clipPath: "polygon(0 0, 97% 0, 100% 50%, 97% 100%, 0 100%)" }}
                >
                  <span className="font-serif-display text-lg">{t.title}</span>
                  <span className="text-xl transition-transform duration-300 shrink-0 ml-3" style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </div>
              </button>
              <div className="accordion-body" style={{ maxHeight: open === i ? "400px" : "0px", opacity: open === i ? 1 : 0 }}>
                <div className="px-5 pt-4 pb-5 pl-[4.5rem] text-sm text-[#1F3A34]/75 leading-relaxed space-y-2">
                  <p>{t.body}</p>
                  <p className="text-[#1F3A34]/50 italic">{t.good}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Advisor (AI-powered chat) ----------
function Advisor({ pendingQuery, onConsumeQuery, goDecide, goToScore, goToStatement, goToGoals, goToTool }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Tell me your salary and a goal, for example: my salary is Rs. 35000 and I want to buy a bike in 3 years. I will give you a full breakdown: monthly budget, SIP suggestion, emergency fund, savings plan, risk analysis, and mistakes to avoid. You can also ask about current market news." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [salary, setSalary] = useState(50000);
  const bottomRef = useRef(null);
  const needs = salary * 0.5;
  const wants = salary * 0.3;
  const save = salary * 0.2;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (pendingQuery) {
      send(pendingQuery);
      onConsumeQuery && onConsumeQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  const suggestions = [
    "My salary is Rs. 35000 and I want to buy a bike in 3 years",
    "What's today's Nifty 50 and Sensex level?",
    "Explain index funds vs mutual funds",
    "Latest RBI repo rate news",
  ];

  const features = [
    { title: "Should I do this?", body: "Describe a purchase, loan, or investment move. Get a reasoned answer, not a generic tip.", action: "Ask a decision", onClick: () => goDecide && goDecide("") },
    { title: "Save or invest for a goal?", body: "Tell me a goal, like a car or a trip, and get a clear comparison: keep it in savings, or put it into a SIP.", action: "Compare my options", onClick: () => goToTool && goToTool("savevsinvest") },
    { title: "Financial Health Score", body: "A transparent score out of 100 across six categories, with the exact reasoning behind every point.", action: "Check my score", onClick: goToScore },
    { title: "Statement Analyzer", body: "Paste or upload your transactions and get a real spending, subscription, and mistakes report.", action: "Analyze a statement", onClick: goToStatement },
    { title: "Smart Goal Planner", body: "Plan a home, bike, or any goal with a clear monthly target and an honest verdict on whether it is realistic.", action: "Plan a goal", onClick: goToGoals },
  ];

  async function send(text) {
    const q = text ?? input;
    if (!q.trim() || loading) return;
    const newMessages = [...messages, { role: "user", text: q }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system:
            "You are Nivesh, a professional personal finance advisor for everyday people in India. Tone is clear, direct, and professional, never use emojis. Use INR with the 'Rs.' prefix. Use web search for anything about current market levels, prices, or news. Never give specific buy or sell stock tips; give general, educational guidance and note you are not a licensed advisor for anything that resembles individualized legal, tax, or investment advice. When the person gives a salary and a goal, structure your reply under these exact headings: Monthly Budget, SIP Suggestion, Emergency Fund, Savings Plan, Risk Analysis, Mistakes to Avoid. When the person asks whether to save or invest toward a goal, weigh the timeline explicitly: under 3 years favors safety (savings, FD, debt fund), 3 to 7 years favors a mix, over 7 years favors equity SIP, and say so plainly. Keep each section to two or three sentences. For other questions, answer directly and concisely, under 150 words unless more detail is requested.",
          messages: [{ role: "user", content: q }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      const data = await response.json();
      const text2 = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMessages([...newMessages, { role: "assistant", text: text2 || "Sorry, I could not find an answer to that." }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", text: "Something went wrong reaching the advisor. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <Eyebrow>Live, web-connected advisor</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Ask your advisor anything</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">Give a salary and a goal for a full structured plan, or ask about current market news.</p>
      </div>

      <AiInsightCard />

      <Card className="p-0 overflow-hidden">
        <div className="h-[440px] overflow-y-auto p-5 space-y-4 bg-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-[#1F3A34] text-[#F4EFE4]" : "bg-[#F4EFE4] text-[#1F3A34]"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-[#F4EFE4] rounded-2xl px-4 py-3 text-sm text-[#1F3A34]/50">Preparing your answer...</div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-[#1F3A34]/10 p-3 flex flex-wrap gap-2 bg-[#FBF8F1]">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-[#1F3A34]/15 hover:bg-[#1F3A34]/5">{s}</button>
          ))}
        </div>
        <div className="p-3 border-t border-[#1F3A34]/10 flex gap-2 bg-[#FBF8F1]">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about your money..." className="flex-1 rounded-full px-4 py-2 border border-[#1F3A34]/15 outline-none focus:border-[#B08A2E] text-sm bg-white" />
          <button onClick={() => send()} disabled={loading} className="px-5 py-2 rounded-full bg-[#1F3A34] text-[#F4EFE4] text-sm font-semibold disabled:opacity-50">Ask</button>
        </div>
      </Card>

      <section>
        <Eyebrow>Go deeper</Eyebrow>
        <div className="space-y-5">
          {features.map((f, i) => (
            <InfographicRow
              key={f.title}
              n={i + 1}
              color={PALETTE[i % PALETTE.length]}
              title={f.title}
              body={f.body}
              action={f.action}
              onClick={f.onClick}
            />
          ))}
        </div>
      </section>

      <section>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="press-scale text-sm font-semibold text-[#1F3A34]/60 underline"
        >
          {showCalculator ? "Hide the quick budget calculator" : "Prefer to calculate it yourself? Open the quick budget calculator"}
        </button>
        {showCalculator && (
          <div className="mt-5 space-y-10">
            <Card className="p-6 md:p-8">
              <label className="text-sm font-semibold text-[#1F3A34]/70">Monthly take-home salary</label>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-serif-display text-2xl">Rs.</span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value) || 0)}
                  className="w-full text-3xl font-serif-display bg-transparent border-b-2 border-[#1F3A34]/20 focus:border-[#B08A2E] outline-none py-1"
                />
              </div>
              <input
                type="range" min="10000" max="300000" step="1000" value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full mt-4 accent-[#B08A2E]"
              />
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <SplitBlock label="Needs" sub="rent, groceries, bills, EMIs" value={needs} pct="50%" color="#1F3A34" />
                <SplitBlock label="Wants" sub="eating out, travel, hobbies" value={wants} pct="30%" color="#B08A2E" />
                <SplitBlock label="Save and Invest" sub="SIP, emergency fund, goals" value={save} pct="20%" color="#6E8B7A" />
              </div>
            </Card>
            <SipCalculator />
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Decision Engine: "Should I do this?" ----------
function DecisionEngine({ pendingQuestion, onConsumeQuestion }) {
  const [question, setQuestion] = useState("");
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(30000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [savings, setSavings] = useState(50000);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (pendingQuestion) {
      setQuestion(pendingQuestion);
      onConsumeQuestion && onConsumeQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion]);

  const examples = [
    "Should I buy an iPhone 17 for Rs. 80000?",
    "Should I take a Rs. 10 lakh home loan?",
    "Should I switch my SIP into stocks?",
    "Should I take a personal loan for a wedding?",
  ];

  async function ask(q) {
    const query = q ?? question;
    if (!query.trim() || loading) return;
    setLoading(true);
    const userTurn = { role: "user", text: query };
    setMessages((m) => [...m, userTurn]);
    setQuestion("");
    try {
      const context = `Context about the person: monthly income Rs. ${income}, monthly expenses Rs. ${expenses}, existing monthly EMI or debt payments Rs. ${existingEmi}, current savings and investments Rs. ${savings}.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system:
            "You are Nivesh's decision engine, a professional financial reasoning assistant for people in India. Never use emojis. Use INR with the 'Rs.' prefix. You are given a person's financial context and a decision they are considering (a purchase, a loan, an investment move). Reply using exactly these five headings: Affordability, EMI Impact, Better Alternative, Long-Term Effect, Financial Score Impact. Be concrete and use the numbers given rather than generic advice. Be honest even when the answer is 'this is a bad idea right now' or 'this is fine'. State assumptions plainly if information is missing. This is educational guidance, not individualized financial advice, and you should say so briefly if the decision is a large or irreversible one (e.g. a large loan). Use web search only if the question needs a current price or market fact.",
          messages: [{ role: "user", content: `${context}\n\nDecision: ${query}` }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      const data = await response.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMessages((m) => [...m, { role: "assistant", text: text || "Could not analyze that, try rephrasing the decision." }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Decision engine</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Should I do this?</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">
          Describe a purchase, loan, or investment move you are considering. This is not a calculator,
          it reasons through affordability, EMI impact, alternatives, long-term effect, and the impact on your financial health score.
        </p>
      </div>

      <Card className="p-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <NumberField label="Monthly income" value={income} setValue={setIncome} prefix="Rs." />
        <NumberField label="Monthly expenses" value={expenses} setValue={setExpenses} prefix="Rs." />
        <NumberField label="Existing EMI / debt" value={existingEmi} setValue={setExistingEmi} prefix="Rs." />
        <NumberField label="Current savings" value={savings} setValue={setSavings} prefix="Rs." />
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="min-h-[200px] max-h-[440px] overflow-y-auto p-5 space-y-4 bg-white">
          {messages.length === 0 && (
            <p className="text-sm text-[#1F3A34]/50">Fill in your numbers above, then ask a decision below. Try one of the examples.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-[#1F3A34] text-[#F4EFE4]" : "bg-[#F4EFE4] text-[#1F3A34]"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-[#F4EFE4] rounded-2xl px-4 py-3 text-sm text-[#1F3A34]/50">Analyzing your decision...</div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-[#1F3A34]/10 p-3 flex flex-wrap gap-2 bg-[#FBF8F1]">
          {examples.map((s) => <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-1.5 rounded-full border border-[#1F3A34]/15 hover:bg-[#1F3A34]/5">{s}</button>)}
        </div>
        <div className="p-3 border-t border-[#1F3A34]/10 flex gap-2 bg-[#FBF8F1]">
          <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Should I..." className="flex-1 rounded-full px-4 py-2 border border-[#1F3A34]/15 outline-none focus:border-[#B08A2E] text-sm bg-white" />
          <button onClick={() => ask()} disabled={loading} className="px-5 py-2 rounded-full bg-[#1F3A34] text-[#F4EFE4] text-sm font-semibold disabled:opacity-50">Analyze</button>
        </div>
      </Card>
      <Disclaimer>This tool gives educational, general-purpose reasoning based on the numbers you provide. It is not individualized financial, legal, or tax advice. For large or irreversible decisions, confirm with a licensed professional.</Disclaimer>
    </div>
  );
}
// ---------- Bank Statement Analyzer ----------
function StatementAnalyzer() {
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      setResult("PDF files cannot be read directly here. Please open the statement, select and copy the transaction text, and paste it into the box below, or export/upload a CSV or TXT file instead.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setRaw(String(ev.target.result || ""));
    reader.readAsText(file);
  }

  async function analyze() {
    if (!raw.trim() || loading) return;
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system:
            "You are Nivesh's statement analyzer, a professional financial assistant for people in India. Never use emojis. You are given raw pasted bank or card statement text or CSV rows. Extract what you reasonably can and produce a report with exactly these headings: Spending By Category, Recurring Subscriptions Found, Likely Financial Mistakes, Savings Estimate, Monthly Summary. If the text is too unclear or incomplete to extract real transactions, say so plainly instead of inventing numbers. Do not fabricate transactions that are not in the text.",
          messages: [{ role: "user", content: `Statement data:\n${raw.slice(0, 12000)}` }],
        }),
      });
      const data = await response.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setResult(text || "Could not analyze this statement. Try pasting cleaner transaction text.");
    } catch (e) {
      setResult("Something went wrong analyzing the statement. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Statement analyzer</Eyebrow>
        <h1 className="font-serif-display text-3xl mb-2">Paste your statement, get a real report.</h1>
        <p className="text-[#1F3A34]/60 max-w-xl">
          Upload a CSV or TXT export of your transactions, or paste the transaction lines directly. Scanned PDFs are not supported here; copy the text out first.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-[#1F3A34]/70">Upload CSV or TXT (optional)</label>
          <input type="file" accept=".csv,.txt,text/plain,text/csv,application/pdf" onChange={handleFile} className="block w-full mt-2 text-sm" />
          {fileName && <p className="text-xs text-[#1F3A34]/50 mt-1">Loaded: {fileName}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-[#1F3A34]/70">Or paste transaction text</label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            placeholder="01/07/2026  SWIGGY BANGALORE  -450.00&#10;02/07/2026  NETFLIX SUBSCRIPTION  -649.00&#10;03/07/2026  SALARY CREDIT  +50000.00"
            className="w-full mt-2 border border-[#1F3A34]/15 rounded-lg p-3 text-sm font-mono bg-white outline-none focus:border-[#B08A2E]"
          />
        </div>
        <button onClick={analyze} disabled={loading} className="px-5 py-2 rounded-full bg-[#1F3A34] text-[#F4EFE4] text-sm font-semibold disabled:opacity-50">
          {loading ? "Analyzing..." : "Analyze statement"}
        </button>
      </Card>

      {result && (
        <Card className="p-6">
          <h3 className="font-serif-display text-lg mb-3">Report</h3>
          <p className="text-sm text-[#1F3A34]/80 leading-relaxed whitespace-pre-wrap">{result}</p>
        </Card>
      )}
      <Disclaimer>Nothing you paste or upload here is stored after you close this tab; it is sent only to generate this report. Review the output against your actual statement before relying on it.</Disclaimer>
    </div>
  );
}

// ---------- About, Privacy, How It Works, Contact, FAQ ----------
function AboutPages() {
  const [section, setSection] = useState("about");
  const sections = [
    ["about", "About"],
    ["privacy", "Privacy"],
    ["how", "How It Works"],
    ["faq", "FAQ"],
    ["contact", "Contact"],
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sections.map(([k, l]) => (
          <button key={k} onClick={() => setSection(k)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${section === k ? "bg-[#1F3A34] text-[#F4EFE4] border-[#1F3A34]" : "border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"}`}>{l}</button>
        ))}
      </div>

      {section === "about" && (
        <Card className="p-6 md:p-8 space-y-4">
          <h1 className="font-serif-display text-3xl">About Nivesh</h1>
          <p className="text-sm text-[#1F3A34]/70 leading-relaxed">
            Nivesh is an AI-assisted financial companion for people who want practical, plain-language help
            with everyday money decisions, not just another set of calculators.
          </p>
          <div>
            <h3 className="font-semibold text-sm mb-1">Mission</h3>
            <p className="text-sm text-[#1F3A34]/70 leading-relaxed">Make sound financial reasoning available to anyone, in plain language, regardless of their starting knowledge.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Vision</h3>
            <p className="text-sm text-[#1F3A34]/70 leading-relaxed">A place where a person can ask "should I do this?" about money and get a clear, honest, numbers-based answer instead of generic advice.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Why we built this</h3>
            <p className="text-sm text-[#1F3A34]/70 leading-relaxed">Most people do not have easy access to a financial advisor. Nivesh does not replace one, especially for large or complex decisions, but it can help with the everyday questions that come up constantly.</p>
          </div>
        </Card>
      )}

      {section === "privacy" && (
        <Card className="p-6 md:p-8 space-y-4">
          <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-5 font-serif-display text-lg">
            Your financial data stays in your session. We never sell or share your data.
          </div>
          <h2 className="font-serif-display text-2xl">Privacy</h2>
          <ul className="text-sm text-[#1F3A34]/70 leading-relaxed list-disc pl-5 space-y-2">
            <li>Numbers you type into calculators stay in your browser tab and are not saved anywhere once you close it.</li>
            <li>Questions sent to the Advisor, Decision Engine, or Statement Analyzer are sent only to generate that specific answer.</li>
            <li>Statement text you paste or upload is used only to produce the report shown to you; it is not stored by Nivesh afterward.</li>
            <li>We do not sell or share your financial information with third parties.</li>
            <li>Do not paste sensitive identifiers such as full card numbers, CVV, or passwords into any field.</li>
          </ul>
        </Card>
      )}

      {section === "how" && (
        <Card className="p-6 md:p-8 space-y-5">
          <h2 className="font-serif-display text-2xl">How the calculators work</h2>
          <div>
            <h3 className="font-semibold text-sm">50/30/20 Budget Split</h3>
            <p className="text-sm text-[#1F3A34]/70">Needs = 50% of income, Wants = 30%, Savings = 20%. A widely used personal finance guideline, not a legal or tax rule.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">SIP Future Value</h3>
            <p className="text-sm text-[#1F3A34]/70">Standard future value of an annuity due formula: FV = P x [((1+r)^n - 1) / r] x (1+r), where P is the monthly amount, r is the monthly rate, and n is the number of months.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">EMI</h3>
            <p className="text-sm text-[#1F3A34]/70">Standard reducing-balance EMI formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1], where P is principal, r is the monthly interest rate, n is the number of months.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Financial Health Score</h3>
            <p className="text-sm text-[#1F3A34]/70">Six weighted categories (Emergency Fund, Savings Rate, Investment Habit, Debt Health, Insurance, Goal Planning) scored against fixed thresholds explained inside the Health Score tab itself, under "Why did I get this score?"</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Tax Calculator</h3>
            <p className="text-sm text-[#1F3A34]/70">Uses simplified illustrative slab structures for the old and new income tax regimes. It excludes cess, surcharge, and several deduction types, and is for education only.</p>
          </div>
          <Disclaimer>
            For authoritative, current information, refer to the Reserve Bank of India (rbi.org.in), the Securities and Exchange Board of India (sebi.gov.in), and the Income Tax Department (incometax.gov.in).
          </Disclaimer>
        </Card>
      )}

      {section === "faq" && (
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="font-serif-display text-2xl mb-2">Frequently asked questions</h2>
          {[
            ["Is Nivesh a licensed financial advisor?", "No. Nivesh is an educational tool. For individualized legal, tax, or investment advice, consult a licensed professional."],
            ["Is my data saved anywhere?", "No. Everything you enter lives only in your current browser session and is not stored on a server."],
            ["Are the AI Advisor's answers guaranteed correct?", "No. It gives general, educational guidance based on the numbers and questions you provide, and it can be wrong, especially about current market data. Verify anything important."],
            ["Can it read scanned PDF statements?", "Not directly. Copy the transaction text out of the PDF, or export a CSV or TXT file, and paste or upload that instead."],
            ["Why does the Tax Calculator give an approximate number?", "Real tax calculations depend on many personal details, cess, surcharge, and current-year rules. This tool is a simplified estimate, not a filing-ready figure."],
          ].map(([q, a], i) => (
            <div key={i}>
              <h3 className="font-semibold text-sm">{q}</h3>
              <p className="text-sm text-[#1F3A34]/70">{a}</p>
            </div>
          ))}
        </Card>
      )}

      {section === "contact" && (
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="font-serif-display text-2xl">Contact</h2>
          <p className="text-sm text-[#1F3A34]/70">Replace these with your own details before publishing.</p>
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">Email: </span>your-email@example.com</div>
            <div><span className="font-semibold">Feedback: </span>use the same email with the subject line "Nivesh Feedback"</div>
            <div><span className="font-semibold">Bug report: </span>use the same email with the subject line "Nivesh Bug"</div>
          </div>
        </Card>
      )}
    </div>
  );
}
