import React, { useState } from "react";

// ---------- Small helpers ----------
const inr = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

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

// ---------- Main App Component ----------
export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen w-full bg-[#F4EFE4] text-[#1F3A34] font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-ui { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#1F3A34]/10 sticky top-0 bg-[#F4EFE4]/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1F3A34] flex items-center justify-center text-[#F4EFE4] font-serif-display text-lg">
              ₹
            </div>
            <div>
              <div className="font-serif-display text-lg leading-none">Nivesh</div>
              <div className="text-[11px] text-[#1F3A34]/50 tracking-wide">
                your everyday money advisor
              </div>
            </div>
          </div>
          <nav className="hidden md:flex gap-1 text-sm">
            {[
              ["dashboard", "Dashboard"],
              ["goals", "Buy a Goal"],
              ["learn", "Learn"],
              ["news", "News & Ask"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-full transition ${
                  tab === key
                    ? "bg-[#1F3A34] text-[#F4EFE4]"
                    : "text-[#1F3A34]/70 hover:bg-[#1F3A34]/5"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {tab === "dashboard" && <Dashboard />}
        {tab === "goals" && <GoalPlanner />}
        {tab === "learn" && <Learn />}
        {tab === "news" && <NewsAndAsk />}
      </main>

      <footer className="border-t border-[#1F3A34]/10 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-[#1F3A34]/50 flex flex-wrap gap-2 justify-between">
          <span>Nivesh is an educational tool, not a licensed financial advisor.</span>
          <span>Markets carry risk. Past returns don't guarantee future ones.</span>
        </div>
      </footer>
    </div>
  );
}

// ---------- Dashboard tab ----------
function Dashboard() {
  const [salary, setSalary] = useState(50000);

  const needs = salary * 0.5;
  const wants = salary * 0.3;
  const save = salary * 0.2;

  return (
    <div className="space-y-10">
      <section>
        <Eyebrow>Monthly check-in</Eyebrow>
        <h1 className="font-serif-display text-4xl md:text-5xl leading-tight max-w-2xl">
          Tell me your salary. I'll tell you where it should go.
        </h1>
        <p className="mt-3 text-[#1F3A34]/70 max-w-xl">
          Enter your monthly take-home pay. This uses the 50/30/20 rule — a
          simple, well-tested way to split income between needs, wants, and
          your future.
        </p>

        <Card className="mt-6 p-6 md:p-8">
          <label className="text-sm font-semibold text-[#1F3A34]/70">
            Monthly take-home salary
          </label>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-serif-display text-2xl">₹</span>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="w-full text-3xl font-serif-display bg-transparent border-b-2 border-[#1F3A34]/20 focus:border-[#B08A2E] outline-none py-1"
            />
          </div>
          <input
            type="range"
            min="10000"
            max="300000"
            step="1000"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full mt-4 accent-[#B08A2E]"
          />

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <SplitBlock
              label="Needs"
              sub="rent, groceries, bills, EMIs"
              value={needs}
              pct="50%"
              color="#1F3A34"
            />
            <SplitBlock
              label="Wants"
              sub="eating out, travel, hobbies"
              value={wants}
              pct="30%"
              color="#B08A2E"
            />
            <SplitBlock
              label="Save & Invest"
              sub="SIP, emergency fund, goals"
              value={save}
              pct="20%"
              color="#6E8B7A"
            />
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <AdviceCard
          title="Build an emergency fund first"
          body={`Before investing anywhere, keep ${inr(
            salary * 3
          )}–${inr(salary * 6)} (3–6 months of expenses) in a savings account or liquid fund. This is your safety net if you lose income suddenly.`}
        />
        <AdviceCard
          title="Automate before you can spend it"
          body="Set up an auto-debit for savings on salary day, not at month-end. What you don't see, you don't spend. This one habit beats most 'saving tips.'"
        />
        <AdviceCard
          title="Audit your subscriptions"
          body="Most people carry 3–5 subscriptions they forgot about. Go through your bank statement once a month and cancel anything unused for 60+ days."
        />
      </section>

      <SipCalculator />
    </div>
  );
}

function SplitBlock({ label, sub, value, pct, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {pct}
        </span>
      </div>
      <div className="font-serif-display text-2xl mt-2">{inr(value)}</div>
      <div className="text-xs text-[#1F3A34]/50 mt-1">{sub}</div>
    </div>
  );
}

function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const months = years * 12;
  const r = rate / 100 / 12;
  const futureValue =
    monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const gains = futureValue - invested;

  return (
    <section>
      <Eyebrow>Calculator</Eyebrow>
      <h2 className="font-serif-display text-2xl mb-4">
        What could your SIP grow into?
      </h2>
      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <SliderField
            label="Monthly SIP amount"
            value={monthly}
            setValue={setMonthly}
            min={500}
            max={100000}
            step={500}
            format={inr}
          />
          <SliderField
            label="Time period (years)"
            value={years}
            setValue={setYears}
            min={1}
            max={35}
            step={1}
            format={(v) => `${v} yrs`}
          />
          <SliderField
            label="Expected annual return"
            value={rate}
            setValue={setRate}
            min={4}
            max={20}
            step={0.5}
            format={(v) => `${v}%`}
          />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">
            Estimated value
          </div>
          <div className="font-serif-display text-4xl mt-2">
            {inr(futureValue)}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <div className="text-[#F4EFE4]/60 text-xs">You invest</div>
              <div className="font-semibold">{inr(invested)}</div>
            </div>
            <div>
              <div className="text-[#F4EFE4]/60 text-xs">Growth (est.)</div>
              <div className="font-semibold text-[#D9C27E]">
                {inr(gains)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
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

const GOAL_PRESETS = [
  { key: "phone", label: "Phone", icon: "📱", typical: 30000 },
  { key: "bike", label: "Bike", icon: "🏍️", typical: 100000 },
  { key: "car", label: "Car", icon: "🚗", typical: 800000 },
  { key: "land", label: "Land / Plot", icon: "🗺️", typical: 2000000 },
  { key: "home", label: "Home", icon: "🏠", typical: 5000000 },
  { key: "custom", label: "Custom", icon: "🎯", typical: 100000 },
];

function GoalPlanner() {
  const [goal, setGoal] = useState(GOAL_PRESETS[1]);
  const [price, setPrice] = useState(goal.typical);
  const [current, setCurrent] = useState(10000);
  const [months, setMonths] = useState(12);
  const [income, setIncome] = useState(50000);
  const [useLoan, setUseLoan] = useState(false);

  const amountNeeded = Math.max(price - current, 0);
  const requiredMonthly = months > 0 ? amountNeeded / months : amountNeeded;
  const safeCapacity = income * 0.2;
  const capacityRatio = safeCapacity > 0 ? requiredMonthly / safeCapacity : 0;

  const loanPrincipal = price * 0.8;
  const tenureMonths = Math.max(months, 12);
  const loanRate = 0.10 / 12;
  const emi =
    (loanPrincipal * loanRate * Math.pow(1 + loanRate, tenureMonths)) /
    (Math.pow(1 + loanRate, tenureMonths) - 1);
  const emiRatio = income > 0 ? emi / income : 0;

  let verdict, verdictColor, verdictBody;
  if (capacityRatio <= 0.8) {
    verdict = "Good to go";
    verdictColor = "#3E7A5D";
    verdictBody = `Saving ${inr(requiredMonthly)}/month comfortably fits inside your savings budget.`;
  } else if (capacityRatio <= 1.3) {
    verdict = "Doable, but tight";
    verdictColor = "#B08A2E";
    verdictBody = `Stretch the timeline or trim wants temporarily.`;
  } else {
    verdict = "Risky at this pace";
    verdictColor = "#B5453B";
    verdictBody = `Consider a longer timeline or look at loan options.`;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {GOAL_PRESETS.map((g) => (
          <button
            key={g.key}
            onClick={() => { setGoal(g); setPrice(g.typical); }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              goal.key === g.key ? "bg-[#1F3A34] text-[#F4EFE4]" : "hover:bg-[#1F3A34]/5"
            }`}
          >
            {g.icon} {g.label}
          </button>
        ))}
      </div>

      <Card className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <NumberField label="Target price" value={price} setValue={setPrice} prefix="₹" />
          <NumberField label="Savings you have" value={current} setValue={setCurrent} prefix="₹" />
          <SliderField label="Months" value={months} setValue={setMonths} min={1} max={60} step={1} format={(v) => `${v} mos`} />
          <NumberField label="Monthly income" value={income} setValue={setIncome} prefix="₹" />
        </div>
        <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-6 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest opacity-60">You need to save</div>
          <div className="font-serif-display text-4xl mt-2">{inr(requiredMonthly)}/mo</div>
          <div className="mt-4 inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit" style={{ backgroundColor: verdictColor }}>
            {verdict}
          </div>
          <p className="text-sm opacity-80 mt-4">{verdictBody}</p>
        </div>
      </Card>
    </div>
  );
}

function NumberField({ label, value, setValue, prefix }) {
  return (
    <div>
      <label className="text-sm font-semibold opacity-70">{label}</label>
      <div className="flex items-center gap-2 mt-1 border-b-2 border-[#1F3A34]/20 py-1">
        {prefix && <span className="font-serif-display">{prefix}</span>}
        <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} className="w-full bg-transparent outline-none" />
      </div>
    </div>
  );
}

function AdviceCard({ title, body }) {
  return (
    <Card className="p-5">
      <div className="font-serif-display text-lg mb-2">{title}</div>
      <p className="text-sm opacity-70">{body}</p>
    </Card>
  );
}

function Learn() {
  return (
    <Card className="p-6">
      <h3 className="font-serif-display text-xl mb-3">SIP — Systematic Investment Plan</h3>
      <p className="text-sm opacity-70">A disciplined way to invest a fixed amount regularly into mutual funds.</p>
    </Card>
  );
}

function NewsAndAsk() {
  return (
    <Card className="p-6">
      <p className="text-sm opacity-70">Interactive community Q&A and market updates coming soon!</p>
    </Card>
  );
}