import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Database,
  ExternalLink,
  FileSearch,
  Filter,
  Gauge,
  GitBranch,
  History,
  Layers3,
  Lightbulb,
  MessageSquareText,
  Network,
  PackageOpen,
  PanelLeft,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { apiRequest, formatDate, formatShortDate, type AnalysisResult, type Competitor, type CompetitorEvent, type ApiDataset, type EventCategory } from "@/lib/signalforge";

type View = "Dashboard" | "Competitors" | "Market Signals" | "Ask Agent";
type AnalysisMode = "changes" | "signal" | "ask" | "brief";

type AnalysisState = {
  result: AnalysisResult & { meetingType?: string; question?: string };
  mode: AnalysisMode;
} | null;

const categoryMeta: Record<EventCategory, { color: string; icon: typeof PackageOpen }> = {
  Product: { color: "cyan", icon: PackageOpen },
  Pricing: { color: "amber", icon: Gauge },
  Hiring: { color: "violet", icon: UsersRound },
  Partnership: { color: "blue", icon: Network },
  Marketing: { color: "rose", icon: Target },
  Expansion: { color: "emerald", icon: ArrowRight },
  AI: { color: "teal", icon: BrainCircuit },
  Customer: { color: "orange", icon: BriefcaseBusiness },
};

const suggestedQuestions = [
  "What has this competitor been doing recently?",
  "What strategic pattern is emerging?",
  "Prepare me for a sales meeting with this competitor.",
];

const relativeTime = (date: string | null) => {
  if (!date) return "No activity";
  const days = Math.max(0, Math.round((Date.now() - new Date(`${date}T12:00:00`).getTime()) / 86400000));
  return days === 0 ? "Today" : `${days}d ago`;
};

const InsightPill = ({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "cyan" | "violet" | "amber" }) => (
  <div className={`insight-pill ${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const StatusDot = ({ active }: { active: boolean }) => <span className={`status-dot ${active ? "active" : "idle"}`} />;

const AppMark = () => (
  <div className="app-mark" aria-hidden="true">
    <span className="mark-orbit orbit-one" />
    <span className="mark-orbit orbit-two" />
    <span className="mark-core"><Sparkles size={15} /></span>
  </div>
);

const CategoryIcon = ({ category }: { category: EventCategory }) => {
  const Icon = categoryMeta[category].icon;
  return <span className={`category-icon ${categoryMeta[category].color}`}><Icon size={15} /></span>;
};

const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="error-state">
    <div className="error-illustration"><AlertTriangle size={22} /></div>
    <div>
      <strong>Intelligence layer needs attention</strong>
      <p>{message}</p>
      {onRetry && <button className="text-button" onClick={onRetry}>Retry connection <RefreshCw size={13} /></button>}
    </div>
  </div>
);

const EvidenceList = ({ evidence, emptyLabel = "Evidence will appear after a live Hindsight or Synthetic Demo Data analysis." }: { evidence: CompetitorEvent[]; emptyLabel?: string }) => (
  <div className="evidence-list">
    {evidence.length === 0 ? <div className="empty-evidence"><FileSearch size={17} /><span>{emptyLabel}</span></div> : evidence.map((event) => (
      <div className="evidence-row" key={event.id}>
        <div className="evidence-check"><Check size={13} /></div>
        <div className="evidence-copy">
          <div className="evidence-row-top"><span>{formatDate(event.date)}</span><span>{event.category}</span></div>
          <strong>{event.title}</strong>
          <p>{event.description}</p>
        </div>
        <span className="evidence-weight">{event.importance}/5</span>
      </div>
    ))}
  </div>
);

const AnalysisCard = ({ analysis, onClear }: { analysis: AnalysisState; onClear: () => void }) => {
  if (!analysis) return null;
  const { result, mode } = analysis;
  return (
    <section className="analysis-card panel panel-glow">
      <div className="analysis-head">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> {result.source === "synthetic-demo" ? "Synthetic Demo Data · local demo" : `Hindsight ${mode === "signal" || mode === "brief" ? "Reflect" : "Recall"}`}</div>
          <h2>{result.analysis.headline}</h2>
          {result.demoNotice && <span className="data-badge">Synthetic Demo Data · not live Hindsight</span>}
        </div>
        <button className="icon-button" onClick={onClear} aria-label="Close analysis"><X size={17} /></button>
      </div>
      <div className="analysis-grid">
        <div className="analysis-main">
          <div className="answer-block"><span className="label observed">Observed facts</span><p>{result.analysis.answer}</p></div>
          <div className="signal-block"><span className="label inferred">Inferred signal</span><p>{result.analysis.inferredSignal}</p></div>
          <div className="why-block"><span className="label">Why this matters</span><p>{result.analysis.whyItMatters}</p></div>
          {result.analysis.recommendedTopics?.length > 0 && <div className="topic-list"><span className="label">Suggested discussion points</span><div>{result.analysis.recommendedTopics.map((topic) => <span className="topic-chip" key={topic}>{topic}</span>)}</div></div>}
        </div>
        <div className="evidence-panel">
          <div className="evidence-heading"><div><span className="label">{result.source === "synthetic-demo" ? "Supporting synthetic events" : "Supporting memory"}</span><strong>{result.evidence.length} event{result.evidence.length === 1 ? "" : "s"} used</strong></div><span className={`confidence ${result.analysis.confidence}`}>{result.analysis.confidence} confidence</span></div>
          <EvidenceList evidence={result.evidence} emptyLabel={result.source === "synthetic-demo" ? "No synthetic evidence matched this question." : undefined} />
        </div>
      </div>
    </section>
  );
};

const CompetitorCard = ({ competitor, selected, onSelect }: { competitor: Competitor; selected: boolean; onSelect: () => void }) => {
  const accent = competitor.competitor === "AcmeCRM" ? "cyan" : competitor.competitor === "SalesFlow" ? "violet" : "amber";
  return (
    <button className={`competitor-card ${selected ? "selected" : ""} ${accent}`} onClick={onSelect}>
      <div className="competitor-card-top"><span className="company-glyph">{competitor.competitor.slice(0, 2).toUpperCase()}</span><span className="card-arrow"><ArrowRight size={15} /></span></div>
      <h3>{competitor.competitor}</h3>
      <p>{competitor.eventCount} remembered events · {relativeTime(competitor.lastActivity)}</p>
      <div className="mini-activity"><span className="mini-line"><i /><i /><i /><i /><i /></span><span>Activity pulse</span></div>
    </button>
  );
};

const Timeline = ({ events }: { events: CompetitorEvent[] }) => {
  const [category, setCategory] = useState<EventCategory | "All">("All");
  const categories = ["All", ...Array.from(new Set(events.map((event) => event.category)))] as (EventCategory | "All")[];
  const filtered = events.filter((event) => category === "All" || event.category === category).slice().reverse();
  return (
    <div className="timeline-wrap">
      <div className="timeline-tools">
        <div className="section-heading"><div><div className="eyebrow"><History size={13} /> Six-month memory</div><h2>Competitor timeline</h2></div><span className="data-badge">Synthetic Demo Data</span></div>
        <div className="filter-row"><Filter size={14} />{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="timeline">
        {filtered.map((event, index) => (
          <div className="timeline-item" key={event.id}>
            <div className="timeline-rail"><span className="timeline-dot" /><span className="timeline-line" /></div>
            <div className="timeline-date"><strong>{formatShortDate(event.date)}</strong><span>{new Date(`${event.date}T12:00:00`).getFullYear()}</span></div>
            <div className="event-card">
              <div className="event-card-head"><div className="event-tag"><CategoryIcon category={event.category} />{event.category}</div><span className={`importance importance-${event.importance}`}>Importance {event.importance}/5</span></div>
              <h3>{event.title}</h3><p>{event.description}</p>
              <div className="event-meta"><span><Database size={12} /> {event.sourceType}</span><span>{index < 4 ? "Recent" : "Synthetic event"}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SignalChain = ({ analysis, onRun }: { analysis: AnalysisState; onRun: () => void }) => (
  <section className="signal-section panel">
    <div className="section-heading"><div><div className="eyebrow"><GitBranch size={13} /> Pattern analysis</div><h2>Competitive Signal Chain</h2><p>Connect multiple memories into a pattern. Conclusions are inferred, never stored as events.</p></div><button className="secondary-button" onClick={onRun}><Lightbulb size={15} /> Why does this matter?</button></div>
    {analysis?.result.analysis.inferredSignal ? <div className="signal-result"><div className="chain-label">{analysis.result.source === "synthetic-demo" ? "Synthetic Demo Data · inferred signal" : "Hindsight reflection · inferred signal"}</div><div className="chain-flow"><span className="chain-node">{analysis.result.evidence[0]?.title || "Historical event"}</span><ArrowRight /><span className="chain-node">{analysis.result.evidence[1]?.title || "Pattern event"}</span><ArrowRight /><span className="chain-node focus">{analysis.result.analysis.inferredSignal}</span></div><div className="chain-note"><Sparkles size={15} /><span>{analysis.result.source === "synthetic-demo" ? "Derived from the existing Synthetic Demo Data event set. No live Hindsight memories were used." : `Derived from ${analysis.result.evidence.length} supporting memories. Expand evidence in the analysis above to inspect every step.`}</span></div></div> : <div className="signal-empty"><div className="signal-orbit"><GitBranch size={22} /></div><div><strong>Awaiting a strategic reflection</strong><p>Run the strategic analysis to connect activity across the last six months.</p></div></div>}
  </section>
);

const BriefPanel = ({ competitor, onGenerate, loading }: { competitor: Competitor; onGenerate: (meetingType: string, question: string) => void; loading: boolean }) => {
  const [meetingType, setMeetingType] = useState("Discovery call");
  const [question, setQuestion] = useState("");
  return (
    <section className="brief-panel panel panel-violet">
      <div><div className="eyebrow"><BriefcaseBusiness size={13} /> Meeting intelligence</div><h2>Prepare Me for a Sales Call</h2><p>Generate an evidence-backed briefing from live Hindsight or clearly labeled Synthetic Demo Data.</p></div>
      <div className="brief-form"><label>Competitor<select value={competitor.competitor} disabled><option>{competitor.competitor}</option></select></label><label>Meeting type<select value={meetingType} onChange={(event) => setMeetingType(event.target.value)}><option>Discovery call</option><option>Competitive renewal</option><option>Executive briefing</option></select></label><label className="full-label">Optional question<input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What should I probe in this conversation?" /></label><button className="primary-button" onClick={() => onGenerate(meetingType, question)} disabled={loading}><Sparkles size={15} />{loading ? "Building brief…" : "Generate briefing"}</button></div>
    </section>
  );
};

const Index = () => {
  const [data, setData] = useState<ApiDataset | null>(null);
  const [selectedName, setSelectedName] = useState("AcmeCRM");
  const [view, setView] = useState<View>("Dashboard");
  const [analysis, setAnalysis] = useState<AnalysisState>(null);
  const [loading, setLoading] = useState<AnalysisMode | null>(null);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [showBrief, setShowBrief] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  const loadData = async () => {
    try {
      setError("");
      setData(await apiRequest<ApiDataset>("/api/competitors"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load competitor data.");
    }
  };

  useEffect(() => { void loadData(); }, []);

  const competitors = data?.competitors ?? [];
  const selected = competitors.find((item) => item.competitor === selectedName) ?? competitors[0];
  const totalSignals = competitors.reduce((total, competitor) => total + (competitor.competitor === "AcmeCRM" ? 4 : competitor.competitor === "SalesFlow" ? 3 : 4), 0);
  const recentEvents = useMemo(() => selected?.events.slice(-3).reverse() ?? [], [selected]);

  const runAnalysis = async (question: string, mode: AnalysisMode) => {
    if (!selected) return;
    setLoading(mode); setError("");
    try {
      const result = await apiRequest<AnalysisResult>("/api/insights", { method: "POST", body: JSON.stringify({ competitor: selected.competitor, question, mode }) });
      setAnalysis({ result, mode }); setInteractionCount((count) => count + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The intelligence services are unavailable.");
    } finally { setLoading(null); }
  };

  const generateBrief = async (meetingType: string, question: string) => {
    if (!selected) return;
    setLoading("brief"); setError("");
    try {
      const result = await apiRequest<AnalysisResult & { meetingType: string; question: string }>("/api/brief", { method: "POST", body: JSON.stringify({ competitor: selected.competitor, meetingType, question }) });
      setAnalysis({ result, mode: "brief" }); setInteractionCount((count) => count + 1); setShowBrief(false); setView("Competitors");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to generate the sales meeting brief."); } finally { setLoading(null); }
  };

  const seedMemory = async () => {
    setSeedLoading(true); setError("");
    try {
      const result = await apiRequest<{ demoMode?: boolean; message?: string }>("/api/memory/seed", { method: "POST" });
      setError(result.demoMode ? result.message || "Demo mode active: Synthetic Demo Data is available locally." : "Synthetic events retained in Hindsight. You can now run a recall or reflection.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to prepare the competitor dataset."); }
    finally { setSeedLoading(false); }
  };

  const navigate = (next: View) => { setView(next); if (next !== "Ask Agent") setAnalysis(null); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><AppMark /><div><strong>SignalForge</strong><span>Competitive intelligence</span></div></div>
        <div className="workspace-switcher"><span className="workspace-avatar">SF</span><div><strong>Revenue strategy</strong><span>Prototype workspace</span></div><ChevronDown size={14} /></div>
        <nav className="main-nav" aria-label="Primary navigation">{(["Dashboard", "Competitors", "Market Signals", "Ask Agent"] as View[]).map((item) => { const icons = { Dashboard: Gauge, Competitors: Target, "Market Signals": GitBranch, "Ask Agent": MessageSquareText }; const Icon = icons[item]; return <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}><Icon size={17} /><span>{item}</span>{item === "Market Signals" && <span className="nav-count">{totalSignals}</span>}</button>; })}</nav>
        <div className="sidebar-section"><span className="sidebar-label">Tracked competitors</span>{competitors.map((competitor) => <button className={`tracked-competitor ${selected?.competitor === competitor.competitor ? "active" : ""}`} key={competitor.competitor} onClick={() => { setSelectedName(competitor.competitor); setView("Competitors"); }}><span className={`tracked-dot ${competitor.competitor === "AcmeCRM" ? "cyan" : competitor.competitor === "SalesFlow" ? "violet" : "amber"}`} />{competitor.competitor}<span>{competitor.eventCount}</span></button>)}</div>
        <div className="sidebar-bottom"><div className="memory-mini"><div className="memory-mini-top"><span><Database size={13} /> Memory layer</span><StatusDot active={Boolean(data?.memory.configured)} /></div><strong>{data?.memory.configured ? "Connected" : "Setup required"}</strong><span>{data?.memory.provider || "Hindsight"} · {data?.memory.bankId || "signalforge-demo"}</span></div><button className="side-link"><Settings2 size={15} /> Workspace settings</button><button className="side-link"><CircleHelp size={15} /> Help & feedback</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="mobile-brand"><AppMark /><strong>SignalForge</strong></div><div className="breadcrumb"><span>Revenue strategy</span><ArrowRight size={13} /><strong>{view}</strong></div><div className="topbar-actions"><button className="top-icon"><Search size={17} /></button><button className="top-icon"><Command size={17} /></button><span className="user-avatar">JR</span></div></header>
        <div className="content-wrap">
          {error && <div className={`notice ${error.includes("retained") || error.includes("Demo mode active") ? "success" : ""}`}><div><AlertTriangle size={16} /><span>{error}</span></div><button onClick={() => setError("")}><X size={15} /></button></div>}
          {view === "Dashboard" && <>
            <div className="page-intro"><div><div className="eyebrow">Thursday, February 19, 2026 <span className="eyebrow-dot" /> Synthetic Demo Data</div><h1>Know the move<br /><em>before the meeting.</em></h1><p>SignalForge turns competitor activity into evidence-backed intelligence your team can act on.</p></div><button className="primary-button" onClick={() => setShowBrief(true)}><BriefcaseBusiness size={16} /> Prepare a sales call</button></div>
            <div className="metric-grid"><div className="metric-card"><span className="metric-icon cyan"><Target size={16} /></span><div><span>Total competitors</span><strong>{competitors.length || "—"}</strong></div><small>3 tracked</small></div><div className="metric-card"><span className="metric-icon violet"><Database size={16} /></span><div><span>Remembered events</span><strong>{data?.totalEvents || "—"}</strong></div><small>6 month window</small></div><div className="metric-card"><span className="metric-icon amber"><Zap size={16} /></span><div><span>Active signals</span><strong>{totalSignals || "—"}</strong></div><small>Inferred, not stored</small></div><div className="metric-card"><span className="metric-icon emerald"><Activity size={16} /></span><div><span>Memory growth</span><strong>{interactionCount || "Ready"}</strong></div><small>{interactionCount ? "Hindsight analyses" : "Awaiting first recall"}</small></div></div>
            {!data && !error && <div className="loading-state"><RefreshCw className="spin" size={18} /> Loading synthetic competitor memory…</div>}
            {data && !data.memory.configured && <div className="setup-banner"><div className="setup-icon"><Database size={19} /></div><div><strong>Demo mode active · live Hindsight is unavailable</strong><p>Synthetic Demo Data powers the timeline, What Changed?, signal chains, evidence, and sales briefs. Live Hindsight is not being claimed.</p></div><button className="secondary-button" onClick={seedMemory} disabled={seedLoading}><Database size={14} />{seedLoading ? "Checking…" : "Check Hindsight"}</button></div>}
            <div className="dashboard-grid"><section className="panel focus-panel"><div className="section-heading"><div><div className="eyebrow"><Target size={13} /> Priority watch</div><h2>Choose a competitor</h2></div><button className="quiet-button" onClick={() => navigate("Competitors")}>View all <ArrowRight size={14} /></button></div><div className="competitor-grid">{competitors.map((competitor) => <CompetitorCard competitor={competitor} selected={selected?.competitor === competitor.competitor} onSelect={() => { setSelectedName(competitor.competitor); setView("Competitors"); }} key={competitor.competitor} />)}</div></section><section className="panel memory-panel"><div className="section-heading"><div><div className="eyebrow"><BrainCircuit size={13} /> Hindsight layer</div><h2>Memory Evolution</h2></div><span className="live-badge"><StatusDot active={Boolean(data?.memory.configured)} /> {data?.memory.configured ? "Live" : "Offline"}</span></div><div className="evolution-list"><div className="evolution-step active"><span className="evolution-number">01</span><div><strong>Event-level recall</strong><p>Retain each competitor move with date, source, and importance.</p></div><Check size={15} /></div><div className="evolution-step"><span className="evolution-number">05</span><div><strong>Recurring activity</strong><p>Recall starts grouping repeated hiring, pricing, or messaging shifts.</p></div><History size={15} /></div><div className="evolution-step"><span className="evolution-number">20</span><div><strong>Strategic pattern</strong><p>Reflect connects multiple memories into an evidence-backed signal.</p></div><GitBranch size={15} /></div></div><div className="memory-footer"><span><Layers3 size={14} /> Accumulated context compounds</span><span>{data?.totalEvents ?? 0} memories in dataset</span></div></section></div>
            <section className="panel recent-panel"><div className="section-heading"><div><div className="eyebrow"><Clock3 size={13} /> Recent synthetic activity</div><h2>Recent competitor activity</h2></div><button className="quiet-button" onClick={() => navigate("Competitors")}>Open timeline <ArrowRight size={14} /></button></div><div className="recent-table"><div className="table-head"><span>Competitor</span><span>Event</span><span>Category</span><span>When</span></div>{competitors.flatMap((competitor) => competitor.recentActivity.slice(-1)).map((event) => <button className="table-row" key={event.id} onClick={() => { setSelectedName(event.competitor); setView("Competitors"); }}><span className="table-company"><span className="company-dot" />{event.competitor}</span><span>{event.title}</span><span><CategoryIcon category={event.category} /> {event.category}</span><span>{relativeTime(event.date)}</span></button>)}</div></section>
          </>}

          {view === "Competitors" && selected && <>
            <div className="page-intro compact"><div><div className="eyebrow"><Target size={13} /> Competitor intelligence <span className="eyebrow-dot" /> {selected.eventCount} retained events</div><h1>{selected.competitor}<em> / six-month view</em></h1><p>Observed activity is separated from inferred signals so your team knows what is known—and what to ask next.</p></div><div className="intro-actions"><button className="secondary-button" onClick={() => setShowBrief(true)}><BriefcaseBusiness size={15} /> Prepare me for a sales call</button><button className="primary-button" onClick={() => void runAnalysis(`What has ${selected.competitor} changed recently? Identify the most significant recent changes and connect each to earlier memories where relevant.`, "changes")} disabled={loading === "changes"}><Sparkles size={15} /> {loading === "changes" ? "Recalling…" : "What Changed?"}</button></div></div>
            <div className="competitor-switcher">{competitors.map((competitor) => <button key={competitor.competitor} className={selected.competitor === competitor.competitor ? "active" : ""} onClick={() => { setSelectedName(competitor.competitor); setAnalysis(null); }}><span className={`tracked-dot ${competitor.competitor === "AcmeCRM" ? "cyan" : competitor.competitor === "SalesFlow" ? "violet" : "amber"}`} />{competitor.competitor}<small>{competitor.eventCount} events</small></button>)}</div>
            <AnalysisCard analysis={analysis} onClear={() => setAnalysis(null)} />
            <div className="stat-strip"><InsightPill label="Last activity" value={formatDate(selected.lastActivity || "2026-02-19")} tone="cyan" /><InsightPill label="Activity rhythm" value="4.0 / month" tone="violet" /><InsightPill label="High importance" value={`${selected.events.filter((event) => event.importance >= 4).length} events`} tone="amber" /><InsightPill label="Memory status" value={data?.memory.configured ? "Recall ready" : "Setup required"} /></div>
            <Timeline events={selected.events} />
            <SignalChain analysis={analysis?.mode === "signal" || analysis?.mode === "brief" ? analysis : null} onRun={() => void runAnalysis(`What strategic pattern is emerging for ${selected.competitor}? Connect the strongest historical events into one inferred signal and explain why it matters.`, "signal")} />
            {showBrief && <BriefPanel competitor={selected} onGenerate={generateBrief} loading={loading === "brief"} />}
          </>}

          {view === "Market Signals" && selected && <><div className="page-intro compact"><div><div className="eyebrow"><GitBranch size={13} /> Cross-event reasoning</div><h1>Market <em>signals</em></h1><p>Signals use live recalled events when available, or the clearly labeled Synthetic Demo Data event set. No strategic conclusion is stored as an event.</p></div><button className="primary-button" onClick={() => void runAnalysis(`What strategic pattern is emerging for ${selected.competitor}? Connect the strongest historical events into one inferred signal and explain why it matters.`, "signal")} disabled={loading === "signal"}><GitBranch size={15} /> {loading === "signal" ? "Reflecting…" : "Run signal reflection"}</button></div><div className="signal-hero"><div className="signal-hero-art"><span /><span /><span /><span /><GitBranch size={28} /></div><div><div className="eyebrow">Selected watch · {selected.competitor}</div><h2>From scattered events to a strategic read.</h2><p>Live Hindsight Recall and Reflect connect relevant memories when available; demo mode uses only the labeled synthetic event set.</p><div className="signal-legend"><span><i className="legend-dot observed-dot" />Observed fact</span><span><i className="legend-dot inferred-dot" />Inferred signal</span><span><i className="legend-dot evidence-dot" />Supporting evidence</span></div></div></div><AnalysisCard analysis={analysis?.mode === "signal" || analysis?.mode === "brief" ? analysis : null} onClear={() => setAnalysis(null)} /><SignalChain analysis={analysis?.mode === "signal" || analysis?.mode === "brief" ? analysis : null} onRun={() => void runAnalysis(`What strategic pattern is emerging for ${selected.competitor}? Connect the strongest historical events into one inferred signal and explain why it matters.`, "signal")} /></>}

          {view === "Ask Agent" && selected && <><div className="page-intro compact"><div><div className="eyebrow"><MessageSquareText size={13} /> Hindsight agent</div><h1>Ask the <em>memory.</em></h1><p>This is not a generic chatbot. Responses use live Hindsight when available, or clearly labeled Synthetic Demo Data when it is offline.</p></div><div className="agent-status"><StatusDot active={Boolean(data?.memory.configured)} /><span>{data?.memory.configured ? "Hindsight available" : "Demo mode active"}</span></div></div><div className="agent-layout"><section className="agent-console panel"><div className="console-top"><div><span className="label">Current context</span><strong>{selected.competitor} · six-month memory</strong></div><span className="recall-chip"><Database size={13} /> Recall first</span></div>{analysis?.mode === "ask" ? <div className="chat-answer"><div className="message-avatar"><Sparkles size={15} /></div><div className="message-body"><span className="message-meta">{analysis.result.source === "synthetic-demo" ? "SignalForge · Synthetic Demo Data" : "SignalForge · Hindsight Recall"}</span><h3>{analysis.result.analysis.headline}</h3><p>{analysis.result.analysis.answer}</p><div className="chat-signal"><span className="label inferred">Inferred signal</span><p>{analysis.result.analysis.inferredSignal}</p></div><details><summary><FileSearch size={14} /> View {analysis.result.evidence.length} evidence memories</summary><EvidenceList evidence={analysis.result.evidence} /></details></div></div> : <div className="chat-empty"><div className="chat-orb"><BrainCircuit size={28} /></div><h2>What do you want to know before the meeting?</h2><p>Ask about recent moves, six-month patterns, or why an activity shift matters.</p></div>}<div className="suggestion-row">{suggestedQuestions.map((question) => <button key={question} onClick={() => setChatInput(question)}>{question}</button>)}</div><div className="chat-composer"><textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (chatInput.trim()) void runAnalysis(chatInput, "ask"); } }} placeholder="Ask about competitor activity…" /><button onClick={() => { if (chatInput.trim()) void runAnalysis(chatInput, "ask"); }} disabled={loading === "ask" || !chatInput.trim()} aria-label="Ask agent">{loading === "ask" ? <RefreshCw className="spin" size={17} /> : <Send size={17} />}</button></div><span className="composer-hint">Press Enter to send · Responses are grounded in Hindsight memories or Synthetic Demo Data</span></section><aside className="agent-aside panel"><div className="eyebrow"><Filter size={13} /> Evidence panel</div><h2>Context boundary</h2><p>The agent uses recalled Hindsight memories when available, or clearly labeled Synthetic Demo Data in demo mode.</p><div className="context-flow"><div><span>01</span><strong>Your question</strong></div><ArrowRight size={15} /><div><span>02</span><strong>Recall or demo events</strong></div><ArrowRight size={15} /><div><span>03</span><strong>Evidence analysis</strong></div></div><div className="aside-divider" /><span className="label">Try asking</span><button className="aside-prompt" onClick={() => setChatInput("Why does this matter for an enterprise prospect?")}>Why does this matter for an enterprise prospect?<ArrowRight size={14} /></button><button className="aside-prompt" onClick={() => setChatInput("What changed in the last 90 days?")}>What changed in the last 90 days?<ArrowRight size={14} /></button></aside></div></>}
        </div>
      </main>
      {showBrief && view === "Dashboard" && selected && <div className="modal-backdrop" onClick={() => setShowBrief(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowBrief(false)}><X size={17} /></button><BriefPanel competitor={selected} onGenerate={generateBrief} loading={loading === "brief"} /></div></div>}
    </div>
  );
};

export default Index;
