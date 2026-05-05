import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BASE_URL from "../utils/api";

/* --------------------------- UTILITIES --------------------------- */
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const todayISO = () => new Date().toISOString().slice(0, 10);

const classNames = (...a) => a.filter(Boolean).join(" ");
const monthKey = (dateISO) => (dateISO || todayISO()).slice(0, 7);
const sumAmounts = (items = []) => items.reduce((acc, x) => acc + (Number(x.amount) || 0), 0);

/* --------------------------- FIELD OPTIONS --------------------------- */
const ACCOUNT_TYPES = [{ value: "bank", label: "Bank Account" }, { value: "card", label: "Credit Card" }, { value: "wallet", label: "UPI/Wallet" }];
const INCOME_TYPES = ["salary", "freelance", "business", "interest", "dividend", "rental", "other"];
const EXPENSE_CATEGORIES = ["food", "fuel", "rent", "emi", "bills", "shopping", "health", "education", "travel", "entertainment", "investment", "other"];
const SAVING_TYPES = [{ value: "mutual_fund", label: "Mutual Fund" }, { value: "gold", label: "Gold" }, { value: "fd", label: "Fixed Deposit (FD)" }, { value: "rd", label: "Recurring Deposit (RD)" }, { value: "ppf", label: "PPF" }, { value: "nps", label: "NPS" }, { value: "other", label: "Other" }];

/* --------------------------- MAIN PAGE COMPONENT --------------------------- */
export default function MoneyTrackerPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("accounts");
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ accounts: [], income: [], expenses: [], savings: [] });

  const token = localStorage.getItem("auth_token");
  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    "x-auth-token": token,
  }), [token]);

  const fetchAllData = async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const [accountsRes, incomesRes, expensesRes, savingsRes] = await Promise.all([
        fetch(`${BASE_URL}/accounts`, { headers }),
        fetch(`${BASE_URL}/incomes`, { headers }),
        fetch(`${BASE_URL}/expenses`, { headers }),
        fetch(`${BASE_URL}/savings`, { headers }),
      ]);
      const accounts = await accountsRes.json();
      const incomes = await incomesRes.json();
      const expenses = await expensesRes.json();
      const savings = await savingsRes.json();
      setState({ accounts, income: incomes, expenses, savings });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchAllData();
    }
  }, [user, token]);

  const currentMonth = monthKey(todayISO());
  const monthIncome = useMemo(() => sumAmounts(state.income.filter(i => monthKey(i.date) === currentMonth)), [state.income, currentMonth]);
  const monthExpenses = useMemo(() => sumAmounts(state.expenses.filter(e => monthKey(e.date) === currentMonth)), [state.expenses, currentMonth]);
  const totalSavings = useMemo(() => sumAmounts(state.savings), [state.savings]);
  const totalAccountBalance = useMemo(() => state.accounts.reduce((a, x) => a + (Number(x.balance) || 0), 0), [state.accounts]);

  if (loading) {
    return <div className="max-w-[1200px] mx-auto px-4 py-10 text-center">Loading your financial data...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Money Tracker</h1>
        <p className="text-sm text-slate-600 mt-1">Your personal finance dashboard, securely backed up.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Total Balance" value={INR.format(totalAccountBalance)} sub="Across all accounts" />
        <Stat label="This Month Income" value={INR.format(monthIncome)} sub={currentMonth} />
        <Stat label="This Month Expenses" value={INR.format(monthExpenses)} sub={currentMonth} />
        <Stat label="Total Savings" value={INR.format(totalSavings)} sub="MF, Gold, FD/RD, etc." />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {[{ id: "accounts", label: "Accounts" }, { id: "income", label: "Income" }, { id: "expenses", label: "Expenses" }, { id: "savings", label: "Savings" }, { id: "insights", label: "Insights" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={classNames("px-3 py-2 text-sm rounded-lg border", tab === t.id ? "border-[#00A7A7] text-[#00A7A7] bg-[#E8F6F6]" : "border-slate-200 text-slate-700 hover:border-slate-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "accounts" && <AccountsSection state={state} headers={headers} fetchAllData={fetchAllData} />}
      {tab === "income" && <IncomeSection state={state} headers={headers} fetchAllData={fetchAllData} />}
      {tab === "expenses" && <ExpensesSection state={state} headers={headers} fetchAllData={fetchAllData} />}
      {tab === "savings" && <SavingsSection state={state} headers={headers} fetchAllData={fetchAllData} />}
      {tab === "insights" && <InsightsSection state={state} />}
    </div>
  );
}

/* --------------------------- HELPER COMPONENTS (THE MISSING CODE) --------------------------- */

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

function Empty({ title, body, action }) {
  return (
    <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">
      <div className="text-sm font-medium text-slate-700">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{body}</div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

function SectionCard({ title, children, right }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function InlineInput({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-600">{label}</span>
      <input
        {...props}
        className="px-3 py-2 rounded-lg border text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
      />
    </label>
  );
}

function InlineSelect({ label, children, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-600">{label}</span>
      <select
        {...props}
        className="px-3 py-2 rounded-lg border text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
      >
        {children}
      </select>
    </label>
  );
}

function Row({ left, right, muted }) {
  return (
    <div className={classNames("flex items-center justify-between py-2", muted && "opacity-80")}>
      <div className="text-sm text-slate-700">{left}</div>
      <div className="text-sm font-medium text-slate-900">{right}</div>
    </div>
  );
}

function accountName(accounts, id) {
  const a = accounts.find(x => x._id === id);
  return a ? (a.name || a.institution || "Account") : "Account";
}


/* --------------------------- SECTION COMPONENTS --------------------------- */

function AccountsSection({ state, headers, fetchAllData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState({ type: "bank", name: "", institution: "", numberMasked: "", balance: "" });

  const handleEditClick = (account) => {
    setCurrentItem(account);
    setForm({
      type: account.type,
      name: account.name,
      institution: account.institution || "",
      numberMasked: account.numberMasked || "",
      balance: account.balance,
    });
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setForm({ type: "bank", name: "", institution: "", numberMasked: "", balance: "" });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEditing) {
      setForm({ type: "bank", name: "", institution: "", numberMasked: "", balance: "" }); // Reset form after adding
    }
    const url = isEditing ? `${BASE_URL}/accounts/${currentItem._id}` : `${BASE_URL}/accounts`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (res.ok) {
        await fetchAllData();
        handleCloseModal();
      }
    } catch (err) { console.error(err); }
  }

  async function removeAccount(id) {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const res = await fetch(`${BASE_URL}/accounts/${id}`, { method: "DELETE", headers });
        if (res.ok) await fetchAllData();
      } catch (err) { console.error(err); }
    }
  }

  return (
    <>
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InlineSelect label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>{ACCOUNT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</InlineSelect>
              <InlineInput label="Display Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              <InlineInput label="Institution" value={form.institution} onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))} />
              <InlineInput label="Number (masked)" value={form.numberMasked} onChange={(e) => setForm(f => ({ ...f, numberMasked: e.target.value }))} />
              <InlineInput label="Current Balance (INR)" type="number" value={form.balance} onChange={(e) => setForm(f => ({ ...f, balance: e.target.value }))} />
              <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#00A7A7] text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* YAHAN PAR 'right' PROP KO WAPAS ADD KIYA GAYA HAI */}
        <SectionCard title="Add Account" right={<span className="text-xs text-slate-500">Bank, Card, or UPI/Wallet</span>}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InlineSelect label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>{ACCOUNT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</InlineSelect>
            <InlineInput label="Display Name" placeholder="HDFC Salary" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <InlineInput label="Institution" placeholder="HDFC / SBI" value={form.institution} onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))} />
            <InlineInput label="Number (masked)" placeholder="XXXX 1234" value={form.numberMasked} onChange={(e) => setForm(f => ({ ...f, numberMasked: e.target.value }))} />
            <InlineInput label="Current Balance (INR)" type="number" step="0.01" placeholder="50000" value={form.balance} onChange={(e) => setForm(f => ({ ...f, balance: e.target.value }))} />
            <div className="sm:col-span-2 flex justify-end"><button type="submit" className="px-4 py-2 rounded-lg bg-[#00A7A7] text-white hover:bg-[#009090] text-sm">Add Account</button></div>
          </form>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard title="Accounts">
            {state.accounts.length === 0 ? <Empty title="No accounts yet" body="Add an account to get started." /> : (
              <div className="divide-y divide-slate-100">
                {state.accounts.map(a => (
                  <div key={a._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{a.name || a.institution} <span className="ml-2 text-xs text-slate-500">({a.type})</span></div>
                      <div className="text-xs text-slate-500">{a.institution} {a.numberMasked ? `• ${a.numberMasked}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{INR.format(Number(a.balance) || 0)}</div>
                      <button className="px-2 py-1 text-xs rounded-md border border-slate-200 hover:border-slate-300" onClick={() => handleEditClick(a)}>Edit</button>
                      <button className="px-2 py-1 text-xs rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => removeAccount(a._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function IncomeSection({ state, headers, fetchAllData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState({ sourceType: "salary", title: "", amount: "", date: todayISO(), accountId: "", note: "" });

  async function addIncome(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/incomes`, { method: "POST", headers, body: JSON.stringify(form) });
      if (res.ok) {
        await fetchAllData();
        setForm({ sourceType: "salary", title: "", amount: "", date: todayISO(), accountId: "", note: "" });
      }
    } catch (err) { console.error(err); }
  }

  async function removeIncome(id) {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await fetch(`${BASE_URL}/incomes/${id}`, { method: "DELETE", headers });
        if (res.ok) await fetchAllData();
      } catch (err) { console.error(err); }
    }
  }

  const incomeByType = useMemo(() => {
    const m = new Map();
    state.income.forEach(i => m.set(i.sourceType, (m.get(i.sourceType) || 0) + (Number(i.amount) || 0)));
    return m;
  }, [state.income]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="Add Income">
        <form onSubmit={addIncome} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InlineSelect label="Source Type" value={form.sourceType} onChange={e => setForm(f => ({ ...f, sourceType: e.target.value }))}>{INCOME_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</InlineSelect>
          <InlineInput label="Title" placeholder="August Salary" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <InlineInput label="Amount (INR)" type="number" step="0.01" placeholder="75000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <InlineInput label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <InlineSelect label="Account (optional)" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}><option value="">—</option>{state.accounts.map(a => <option key={a._id} value={a._id}>{a.name || a.institution}</option>)}</InlineSelect>
          <InlineInput label="Note" placeholder="PF, bonus split, etc." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <div className="sm:col-span-2 flex justify-end"><button className="px-4 py-2 rounded-lg bg-[#00A7A7] text-white hover:bg-[#009090] text-sm">Add Income</button></div>
        </form>
      </SectionCard>
      <div className="lg:col-span-2">
        <SectionCard title="Income History" right={<div className="text-xs text-slate-500">Total: {INR.format(sumAmounts(state.income))}</div>}>
          {state.income.length === 0 ? <Empty title="No income records" body="Add your first income to see totals." /> : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">{Array.from(incomeByType.entries()).map(([k, v]) => (<Row key={k} left={<span className="capitalize">{k}</span>} right={INR.format(v)} />))}</div>
              <div className="divide-y divide-slate-100">
                {state.income.map(i => (
                  <div key={i._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{i.title || i.sourceType}</div>
                      <div className="text-xs text-slate-500">{i.date ? new Date(i.date).toLocaleDateString() : 'N/A'} {i.accountId ? `• ${accountName(state.accounts, i.accountId)}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-emerald-700">+ {INR.format(Number(i.amount) || 0)}</div>
                      <button className="px-2 py-1 text-xs rounded-md border border-slate-200 hover:border-slate-300" onClick={() => removeIncome(i._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function ExpensesSection({ state, headers, fetchAllData }) {
  const [form, setForm] = useState({ category: "food", title: "", amount: "", date: todayISO(), accountId: "", paymentMethod: "UPI", note: "" });

  async function addExpense(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/expenses`, { method: "POST", headers, body: JSON.stringify(form) });
      if (res.ok) {
        await fetchAllData();
        setForm({ category: "food", title: "", amount: "", date: todayISO(), accountId: "", paymentMethod: "UPI", note: "" });
      }
    } catch (err) { console.error(err); }
  }

  async function removeExpense(id) {
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE", headers });
      if (res.ok) await fetchAllData();
    } catch (err) { console.error(err); }
  }

  const expensesByCat = useMemo(() => {
    const m = new Map();
    state.expenses.forEach(e => m.set(e.category, (m.get(e.category) || 0) + (Number(e.amount) || 0)));
    return m;
  }, [state.expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="Add Expense">
        <form onSubmit={addExpense} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InlineSelect label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}</InlineSelect>
          <InlineInput label="Title" placeholder="Zomato / Ola Bill" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <InlineInput label="Amount (INR)" type="number" step="0.01" placeholder="499" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <InlineInput label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <InlineSelect label="Paid From Account" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}><option value="">—</option>{state.accounts.map(a => <option key={a._id} value={a._id}>{a.name || a.institution}</option>)}</InlineSelect>
          <InlineInput label="Payment Method" placeholder="UPI / Card / Cash" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} />
          <InlineInput label="Note" placeholder="Split with friends?" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <div className="sm:col-span-2 flex justify-end"><button className="px-4 py-2 rounded-lg bg-[#00A7A7] text-white hover:bg-[#009090] text-sm">Add Expense</button></div>
        </form>
      </SectionCard>
      <div className="lg:col-span-2">
        <SectionCard title="Expenses History" right={<div className="text-xs text-slate-500">Total: {INR.format(sumAmounts(state.expenses))}</div>}>
          {state.expenses.length === 0 ? <Empty title="No expenses yet" body="Add expenses to see category-wise breakdowns." /> : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">{Array.from(expensesByCat.entries()).map(([k, v]) => (<Row key={k} left={<span className="uppercase">{k}</span>} right={INR.format(v)} />))}</div>
              <div className="divide-y divide-slate-100">
                {state.expenses.map(e => (
                  <div key={e._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{e.title || e.category}</div>
                      <div className="text-xs text-slate-500">{e.date ? new Date(e.date).toLocaleDateString() : 'N/A'} {e.accountId ? `• ${accountName(state.accounts, e.accountId)} • ${e.paymentMethod}` : `• ${e.paymentMethod}`}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-rose-700">- {INR.format(Number(e.amount) || 0)}</div>
                      <button className="px-2 py-1 text-xs rounded-md border border-slate-200 hover:border-slate-300" onClick={() => removeExpense(e._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function SavingsSection({ state, headers, fetchAllData }) {
  const [form, setForm] = useState({ type: "mutual_fund", title: "", amount: "", date: todayISO(), accountId: "", platform: "", note: "" });

  async function addSaving(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/savings`, { method: "POST", headers, body: JSON.stringify(form) });
      if (res.ok) {
        await fetchAllData();
        setForm({ type: "mutual_fund", title: "", amount: "", date: todayISO(), accountId: "", platform: "", note: "" });
      }
    } catch (err) { console.error(err); }
  }

  async function removeSaving(id) {
    try {
      const res = await fetch(`${BASE_URL}/savings/${id}`, { method: "DELETE", headers });
      if (res.ok) await fetchAllData();
    } catch (err) { console.error(err); }
  }

  const byType = useMemo(() => {
    const m = new Map();
    state.savings.forEach(e => m.set(e.type, (m.get(e.type) || 0) + (Number(e.amount) || 0)));
    return m;
  }, [state.savings]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="Add Saving/Investment">
        <form onSubmit={addSaving} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InlineSelect label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>{SAVING_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</InlineSelect>
          <InlineInput label="Title" placeholder="SIP in Axis Bluechip" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <InlineInput label="Amount (INR)" type="number" step="0.01" placeholder="2500" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <InlineInput label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <InlineSelect label="Paid From Account" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}><option value="">—</option>{state.accounts.map(a => <option key={a._id} value={a._id}>{a.name || a.institution}</option>)}</InlineSelect>
          <InlineInput label="Platform/Broker" placeholder="Groww, Zerodha Coin" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} />
          <InlineInput label="Note" placeholder="SIP date, goal name" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <div className="sm:col-span-2 flex justify-end"><button className="px-4 py-2 rounded-lg bg-[#00A7A7] text-white hover:bg-[#009090] text-sm">Add</button></div>
        </form>
      </SectionCard>
      <div className="lg:col-span-2">
        <SectionCard title="Savings & Investments" right={<div className="text-xs text-slate-500">Total: {INR.format(sumAmounts(state.savings))}</div>}>
          {state.savings.length === 0 ? <Empty title="No savings recorded" body="Add your MFs, Gold, FDs to track your investments." /> : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">{Array.from(byType.entries()).map(([k, v]) => (<Row key={k} left={<span className="capitalize">{k.replace("_", " ")}</span>} right={INR.format(v)} />))}</div>
              <div className="divide-y divide-slate-100">
                {state.savings.map(s => (
                  <div key={s._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{s.title || s.type}</div>
                      <div className="text-xs text-slate-500">{s.date ? new Date(s.date).toLocaleDateString() : 'N/A'} {s.accountId ? `• ${accountName(state.accounts, s.accountId)}` : ""} {s.platform ? `• ${s.platform}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{INR.format(Number(s.amount) || 0)}</div>
                      <button className="px-2 py-1 text-xs rounded-md border border-slate-200 hover:border-slate-300" onClick={() => removeSaving(s._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function InsightsSection({ state }) {
  const byMonth = useMemo(() => {
    const months = {};
    [...state.income, ...state.expenses].forEach(item => {
      const k = monthKey(item.date);
      months[k] = months[k] || { income: 0, expenses: 0 };
      if (item.sourceType) { // It's an income
        months[k].income += Number(item.amount) || 0;
      } else { // It's an expense
        months[k].expenses += Number(item.amount) || 0;
      }
    });
    Object.keys(months).forEach(k => (months[k].net = months[k].income - months[k].expenses));
    return months;
  }, [state.income, state.expenses]);

  const catBreakdown = useMemo(() => {
    const m = new Map();
    state.expenses.forEach(e => m.set(e.category, (m.get(e.category) || 0) + (Number(e.amount) || 0)));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [state.expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SectionCard title="Monthly Overview">
        {Object.keys(byMonth).length === 0 ? <Empty title="No data yet" body="Add income and expenses to see trends." /> : (
          <div className="space-y-2">
            {Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).map(([m, v]) => (
              <Row key={m} left={<span className="text-sm">{m}</span>} right={
                <span className="text-sm">
                  <span className="text-emerald-700">{INR.format(v.income)}</span> / <span className="text-rose-700">{INR.format(v.expenses)}</span>
                  <span className={classNames("ml-2 font-semibold", v.net >= 0 ? "text-emerald-700" : "text-rose-700")}>{v.net >= 0 ? "▲" : "▼"} {INR.format(v.net)}</span>
                </span>
              } />
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Top Expense Categories">
        {catBreakdown.length === 0 ? <Empty title="No expenses yet" body="Your category breakdown will appear here." /> : (
          <div className="space-y-2">
            {catBreakdown.map(([cat, amt]) => (<Row key={cat} left={<span className="uppercase">{cat}</span>} right={INR.format(amt)} />))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
