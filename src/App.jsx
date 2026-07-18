import React, { useState, useRef, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ---------- Helpers ----------
const inr = (n) =>
  "Rs. " + Math.round(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const PALETTE = ["#1F3A34", "#B08A2E", "#6E8B7A", "#8C6D46", "#3E7A5D", "#B5453B", "#5A7D9A"];

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

const TABS = [
  ["dashboard", "Dashboard"],
  ["goals", "Buy a Goal"],
  ["expenses", "Expenses"],
  ["networth", "Net Worth"],
  ["score", "Health Score"],
  ["tools", "Tools"],
  ["learn", "Learn"],
  ["advisor", "Advisor"],
];

// ---------- Main App ----------
export default function FinanceAdvisor() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen w-full bg-[#F4EFE4] text-[#1F3A34] font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-ui { font-family: 'Inter', sans-serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      <header className="border-b border-[#1F3A34]/10 sticky top-0 bg-[#F4EFE4]/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1F3A34] flex items-center justify-center text-[#F4EFE4] font-serif-display text-lg">
              R
            </div>
            <div>
              <div className="font-serif-display text-lg leading-none">Nivesh</div>
              <div className="text-[11px] text-[#1F3A34]/50 tracking-wide">
                your everyday money advisor
              </div>
            </div>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-6 pb-3 flex gap-1 overflow-x-auto scrollbar-none text-sm">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                tab === key ? "bg-[#1F3A34] text-[#F4EFE4]" : "text-[#1F3A34]/70 hover:bg-[#1F3A34]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 pb-24">
        {tab === "dashboard" && <Dashboard />}
        {tab === "goals" && <GoalPlanner />}
        {tab === "expenses" && <ExpenseTracker />}
        {tab === "networth" && <NetWorthTracker />}
        {tab === "score" && <HealthScore />}
        {tab === "tools" && <Tools />}
        {tab === "learn" && <Learn />}
        {tab === "advisor" && <Advisor />}
      </main>

      <footer className="border-t border-[#1F3A34]/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-[#1F3A34]/50 flex flex-wrap gap-2 justify-between">
          <span>Nivesh is an educational tool, not a licensed financial, tax, or investment advisor.</span>
          <span>Markets carry risk. Past returns don't guarantee future ones.</span>
        </div>
      </footer>
    </div>
  );
}

// ---------- Dashboard ----------
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
          Tell me your salary. I will tell you where it should go.
        </h1>
        <p className="mt-3 text-[#1F3A34]/70 max-w-xl">
          Enter your monthly take-home pay. This uses the 50/30/20 rule, a
          simple, well-tested way to split income between needs, wants, and
          your future.
        </p>

        <Card className="mt-6 p-6 md:p-8">
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
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <AdviceCard title="Build an emergency fund first" body={`Before investing anywhere, keep ${inr(salary * 3)} to ${inr(salary * 6)} (3 to 6 months of expenses) in a savings account or liquid fund. This is your safety net if you lose income suddenly.`} />
        <AdviceCard title="Automate before you can spend it" body="Set up an auto-debit for savings on salary day, not at month-end. What you do not see, you do not spend. This one habit beats most saving tips." />
        <AdviceCard title="Audit your subscriptions" body="Most people carry three to five subscriptions they forgot about. Go through your bank statement once a month and cancel anything unused for 60+ days." />
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
        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{pct}</span>
      </div>
      <div className="font-serif-display text-2xl mt-2">{inr(value)}</div>
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
          <div className="font-serif-display text-4xl mt-2">{inr(futureValue)}</div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">You invest</div><div className="font-semibold">{inr(invested)}</div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">Growth (est.)</div><div className="font-semibold text-[#D9C27E]">{inr(gains)}</div></div>
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

function GoalPlanner() {
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
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${goal.key === g.key ? "bg-[#1F3A34] text-[#F4EFE4] border-[#1F3A34]" : "border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"}`}>
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
          <div className="font-serif-display text-4xl mt-2">{inr(requiredMonthly)}<span className="text-base font-sans-ui text-[#F4EFE4]/60"> / month</span></div>
          <div className="mt-4 inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit" style={{ backgroundColor: verdictColor, color: "#F4EFE4" }}>{verdict}</div>
          <p className="text-sm text-[#F4EFE4]/80 mt-4 leading-relaxed">{verdictBody}</p>
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

        <Card className="p-6">
          <h3 className="font-serif-display text-lg mb-4">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Total spent this month</span><span className="font-semibold">{inr(total)}</span></div>
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Income</span><span className="font-semibold">{inr(income)}</span></div>
            <div className="flex justify-between"><span className="text-[#1F3A34]/60">Savings rate</span><span className="font-semibold" style={{ color: savingsRate >= 20 ? "#3E7A5D" : "#B5453B" }}>{savingsRate.toFixed(1)}%</span></div>
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
          <div className="font-serif-display text-4xl mt-2">{inr(netWorth)}</div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">Total assets</div><div className="font-semibold">{inr(totalAssets)}</div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">Total loans</div><div className="font-semibold text-[#E0A9A3]">{inr(totalLoans)}</div></div>
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
            <Bar dataKey="value">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#1F3A34]/50">Overall score</div>
            <div className="font-serif-display text-5xl mt-1">{total}<span className="text-lg text-[#1F3A34]/40">/100</span></div>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-semibold w-fit" style={{ backgroundColor: zoneColor, color: "#F4EFE4" }}>{zone}</div>
        </div>

        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{r.label}</span>
                <span className="text-[#1F3A34]/60">{r.score.toFixed(0)}/{r.max}</span>
              </div>
              <div className="w-full h-2 bg-[#1F3A34]/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(r.score / r.max) * 100}%`, backgroundColor: r.score / r.max >= 0.8 ? "#3E7A5D" : r.score / r.max >= 0.5 ? "#B08A2E" : "#B5453B" }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowWhy(!showWhy)} className="mt-5 text-sm font-semibold text-[#B08A2E] underline">
          {showWhy ? "Hide" : "Why did I get this score?"}
        </button>
        {showWhy && (
          <div className="mt-3 space-y-2 text-sm text-[#1F3A34]/70">
            {rows.map((r) => <p key={r.label}><span className="font-semibold text-[#1F3A34]">{r.label}:</span> {r.reason}</p>)}
          </div>
        )}

        <div className="mt-6 bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60 mb-1">One concrete step</div>
          <p className="text-sm leading-relaxed">{suggestion}</p>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <h3 className="font-serif-display text-xl mb-2">Future stability projection</h3>
        <p className="text-sm text-[#1F3A34]/60 mb-4">If your current habits continue unchanged, here is a directional projection five years out. This is illustrative, not a guarantee.</p>
        <div className="flex items-center gap-6">
          <div><div className="text-xs text-[#1F3A34]/50">Today</div><div className="font-serif-display text-3xl">{total}</div></div>
          <div className="text-[#1F3A34]/30">to</div>
          <div><div className="text-xs text-[#1F3A34]/50">In 5 years</div><div className="font-serif-display text-3xl" style={{ color: futureScore >= total ? "#3E7A5D" : "#B5453B" }}>{futureScore}</div></div>
        </div>
        <Disclaimer>This projection is a simple rule-based estimate based on your current savings rate, investment habit, insurance cover, and EMI load. It is not a statistical forecast.</Disclaimer>
      </Card>
    </div>
  );
}
// ---------- Tools (calculators) ----------
function Tools() {
  const [tool, setTool] = useState("fire");
  const toolList = [
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
          <button key={k} onClick={() => setTool(k)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${tool === k ? "bg-[#1F3A34] text-[#F4EFE4] border-[#1F3A34]" : "border-[#1F3A34]/15 hover:bg-[#1F3A34]/5"}`}>{l}</button>
        ))}
      </div>
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
        <div className="font-serif-display text-3xl mt-1">{inr(fireNumber)}</div>
        <div className="text-xs text-[#F4EFE4]/50 mt-1">25 times your annual expenses (the 4% rule)</div>
        <div className="mt-5 text-xs uppercase tracking-widest text-[#F4EFE4]/60">Projected retirement age</div>
        <div className="font-serif-display text-4xl mt-1">{m < 900 ? retireAge.toFixed(0) : "50+ yrs away"}</div>
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
    const taxableIncome = Math.max(0, income - 75000);
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
    if (taxableIncome <= 1200000) tax = 0;
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
    if (taxableIncome <= 500000) tax = 0;
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
          <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">New Regime</div>
            <div className="font-serif-display text-2xl mt-1">{inr(newR.tax)}</div>
            <div className="text-xs text-[#1F3A34]/50 mt-1">Taxable: {inr(newR.taxableIncome)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Old Regime</div>
            <div className="font-serif-display text-2xl mt-1">{inr(oldR.tax)}</div>
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
        <div className="font-serif-display text-3xl mt-2">{inr(futureValue)}</div>
        <div className="mt-5 text-xs uppercase tracking-widest text-[#F4EFE4]/60">Rs.{amount.toLocaleString("en-IN")} in {years} years will feel like today's</div>
        <div className="font-serif-display text-2xl mt-1">{inr(presentValueOfFuture)}</div>
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
          <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Monthly EMI if you take the loan</div>
            <div className="font-serif-display text-2xl mt-1">{inr(emi)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#1F3A34]/10">
            <div className="text-xs text-[#1F3A34]/50">Total interest paid over the loan</div>
            <div className="font-serif-display text-2xl mt-1 text-[#B5453B]">{inr(totalInterest)}</div>
          </div>
          <div className="bg-[#1F3A34] text-[#F4EFE4] rounded-xl p-4">
            <div className="text-xs uppercase tracking-widest text-[#F4EFE4]/60">If you invested that same EMI instead</div>
            <div className="font-serif-display text-2xl mt-1">{inr(sipFutureValue)}</div>
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
          <div className="font-serif-display text-3xl mt-2">{coverage.toFixed(0)}% projected coverage</div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-[#D9C27E] rounded-full" style={{ width: `${coverage}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
            <div><div className="text-[#F4EFE4]/60 text-xs">Projected corpus</div><div className="font-semibold">{inr(projected)}</div></div>
            <div><div className="text-[#F4EFE4]/60 text-xs">To reach 100%, save</div><div className="font-semibold">{inr(requiredMonthly)}/mo</div></div>
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

function Learn() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <Eyebrow>Plain-language glossary</Eyebrow>
      <h1 className="font-serif-display text-3xl mb-6">Finance words, explained clearly</h1>
      <div className="space-y-3">
        {TOPICS.map((t, i) => (
          <Card key={i} className="overflow-hidden">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left p-5 flex items-center justify-between">
              <span className="font-serif-display text-lg">{t.title}</span>
              <span className="text-[#B08A2E] text-xl">{open === i ? "-" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-[#1F3A34]/75 leading-relaxed space-y-2">
                <p>{t.body}</p>
                <p className="text-[#1F3A34]/50 italic">{t.good}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Advisor (AI-powered chat) ----------
function Advisor() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Tell me your salary and a goal, for example: my salary is Rs. 35000 and I want to buy a bike in 3 years. I will give you a full breakdown: monthly budget, SIP suggestion, emergency fund, savings plan, risk analysis, and mistakes to avoid. You can also ask about current market news." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const suggestions = [
    "My salary is Rs. 35000 and I want to buy a bike in 3 years",
    "What's today's Nifty 50 and Sensex level?",
    "Explain index funds vs mutual funds",
    "Latest RBI repo rate news",
  ];

  async function send(text) {
    const q = text ?? input;
    if (!q.trim() || loading) return;
    const newMessages = [...messages, { role: "user", text: q }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      // NOTE: Direct frontend call. Use a proxy/backend in production to hide API key.
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY_HERE", // Replace securely
          "anthropic-version": "2023-06-01" 
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229", // Fixed invalid model string
          max_tokens: 1200,
          system:
            "You are Nivesh, a professional personal finance advisor for everyday people in India. Tone is clear, direct, and professional, never use emojis. Use INR with the 'Rs.' prefix. Use web search for anything about current market levels, prices, or news. Never give specific buy or sell stock tips; give general, educational guidance and note you are not a licensed advisor for anything that resembles individualized legal, tax, or investment advice. When the person gives a salary and a goal, structure your reply under these exact headings: Monthly Budget, SIP Suggestion, Emergency Fund, Savings Plan, Risk Analysis, Mistakes to Avoid. Keep each section to two or three sentences. For other questions, answer directly and concisely, under 150 words unless more detail is requested.",
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
    <div>
      <Eyebrow>Live, web-connected advisor</Eyebrow>
      <h1 className="font-serif-display text-3xl mb-2">Ask your advisor anything</h1>
      <p className="text-[#1F3A34]/60 mb-6 max-w-xl">Give a salary and a goal for a full structured plan, or ask about current market news.</p>

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
    </div>
  );
}