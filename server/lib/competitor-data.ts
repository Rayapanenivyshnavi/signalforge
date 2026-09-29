export type EventCategory =
  | "Product"
  | "Pricing"
  | "Hiring"
  | "Partnership"
  | "Marketing"
  | "Expansion"
  | "AI"
  | "Customer";

export type CompetitorEvent = {
  id: string;
  competitor: string;
  date: string;
  category: EventCategory;
  title: string;
  description: string;
  sourceType: string;
  importance: 1 | 2 | 3 | 4 | 5;
};

const event = (
  id: string,
  competitor: string,
  date: string,
  category: EventCategory,
  title: string,
  description: string,
  sourceType: string,
  importance: 1 | 2 | 3 | 4 | 5,
): CompetitorEvent => ({ id, competitor, date, category, title, description, sourceType, importance });

export const competitors = ["AcmeCRM", "SalesFlow", "CloudDesk"] as const;

export const competitorEvents: CompetitorEvent[] = [
  event("acme-01", "AcmeCRM", "2025-08-05", "Product", "Territory planner released", "AcmeCRM added account territory planning with shared ownership and manager approval workflows.", "Product changelog", 3),
  event("acme-02", "AcmeCRM", "2025-08-18", "Hiring", "Four ML engineers joined the data platform team", "New roles cluster around ranking, lead scoring, and feature infrastructure rather than general application engineering.", "Careers page", 4),
  event("acme-03", "AcmeCRM", "2025-09-02", "Marketing", "Revenue intelligence narrative introduced", "Website language shifted from pipeline management toward forecasting confidence and rep productivity.", "Website messaging", 3),
  event("acme-04", "AcmeCRM", "2025-09-14", "Partnership", "Snowflake connector partnership announced", "A new connector positions AcmeCRM data for warehouse-native reporting and governed analytics.", "Partner announcement", 3),
  event("acme-05", "AcmeCRM", "2025-09-25", "AI", "AI Labs research page launched", "AcmeCRM opened a research page focused on assistive workflows, next-best actions, and natural-language account summaries.", "Company blog", 4),
  event("acme-06", "AcmeCRM", "2025-10-03", "Product", "Forecast workspace entered beta", "The forecast workspace combines rollups, deal inspection, and manager review in one executive view.", "Release notes", 4),
  event("acme-07", "AcmeCRM", "2025-10-16", "Pricing", "Professional plan packaging changed", "The Professional tier now gates advanced forecasting and introduces a per-seat usage band for automation.", "Pricing page", 5),
  event("acme-08", "AcmeCRM", "2025-10-28", "Hiring", "Enterprise account executives added in New York and London", "Openings favor seven-plus-year sellers with experience in complex multi-region buying committees.", "Careers page", 4),
  event("acme-09", "AcmeCRM", "2025-11-06", "AI", "AI Sales Assistant launched", "The assistant drafts follow-ups, summarizes account activity, and suggests next actions from CRM context.", "Product announcement", 5),
  event("acme-10", "AcmeCRM", "2025-11-12", "Customer", "Top-tier customers invited to assistant pilot", "A small group of strategic accounts received early access with dedicated enablement sessions.", "Customer newsletter", 3),
  event("acme-11", "AcmeCRM", "2025-11-19", "Marketing", "Executive briefing campaign targets RevOps", "New campaign materials lead with forecast accuracy, governance, and cross-functional revenue visibility.", "Campaign library", 4),
  event("acme-12", "AcmeCRM", "2025-11-29", "Expansion", "Enterprise onboarding team expanded", "AcmeCRM added implementation and solutions architect capacity for global rollouts.", "Hiring page", 4),
  event("acme-13", "AcmeCRM", "2025-12-04", "Partnership", "Deloitte alliance expanded", "The alliance now includes packaged migration services and executive change-management support.", "Partner announcement", 4),
  event("acme-14", "AcmeCRM", "2025-12-11", "Product", "Governance controls added to AI assistant", "Admins can now review generated actions, set data boundaries, and audit assistant activity.", "Release notes", 5),
  event("acme-15", "AcmeCRM", "2025-12-18", "Pricing", "Enterprise package adds AI usage allowance", "AI assistant usage is now described as an included allowance with expansion pricing for high-volume teams.", "Pricing page", 4),
  event("acme-16", "AcmeCRM", "2025-12-22", "Hiring", "Solutions consultants hired for regulated industries", "Roles emphasize security reviews, procurement navigation, and value engineering for financial services.", "Careers page", 4),
  event("acme-17", "AcmeCRM", "2026-01-05", "Marketing", "Customer proof shifts to global sales teams", "New case studies emphasize multi-region forecasting, governance, and enterprise adoption.", "Case study library", 3),
  event("acme-18", "AcmeCRM", "2026-01-10", "AI", "Account risk summaries added", "The assistant now flags stalled deals and composes risk summaries for weekly leadership reviews.", "Release notes", 4),
  event("acme-19", "AcmeCRM", "2026-01-15", "Expansion", "EMEA enterprise sales pod announced", "AcmeCRM formed a regional pod spanning sales, solutions, and customer success for larger accounts.", "Company announcement", 5),
  event("acme-20", "AcmeCRM", "2026-01-21", "Customer", "AI adoption benchmark shared with customers", "A customer webinar connected assistant adoption with forecast hygiene and manager inspection habits.", "Customer webinar", 3),
  event("acme-21", "AcmeCRM", "2026-01-27", "Product", "Executive signal digest released", "Leaders can subscribe to a weekly digest of pipeline movement, risk, and assistant-generated recommendations.", "Product changelog", 4),
  event("acme-22", "AcmeCRM", "2026-02-02", "Hiring", "VP of enterprise AI sales role opened", "The new role combines strategic account leadership with AI transformation selling experience.", "Careers page", 5),
  event("acme-23", "AcmeCRM", "2026-02-08", "Marketing", "AI operating system positioning appears", "Messaging now frames AcmeCRM as the operating layer for AI-assisted revenue teams.", "Homepage messaging", 5),
  event("acme-24", "AcmeCRM", "2026-02-13", "Expansion", "Global enterprise summit announced", "AcmeCRM will host a customer summit focused on governed AI adoption across complex revenue organizations.", "Event announcement", 3),

  event("sales-01", "SalesFlow", "2025-08-04", "Pricing", "Starter tier price reduced", "SalesFlow lowered the entry price and made core sequences available to smaller teams.", "Pricing page", 3),
  event("sales-02", "SalesFlow", "2025-08-13", "Product", "Sequence builder simplified", "The sequence builder received a faster setup flow with templates for first-time outbound teams.", "Release notes", 3),
  event("sales-03", "SalesFlow", "2025-08-27", "Marketing", "Outbound for founders campaign launched", "Campaigns emphasize quick setup, personal tone, and pipeline generation without operations support.", "Campaign library", 3),
  event("sales-04", "SalesFlow", "2025-09-06", "Partnership", "HubSpot marketplace bundle introduced", "SalesFlow partnered on a lightweight CRM bundle aimed at teams moving off spreadsheets.", "Marketplace listing", 3),
  event("sales-05", "SalesFlow", "2025-09-16", "Hiring", "SMB account executives added", "Hiring favors high-velocity sellers and player-coaches for North American commercial segments.", "Careers page", 3),
  event("sales-06", "SalesFlow", "2025-09-29", "AI", "Message coach beta announced", "A writing coach scores outbound messages for clarity, personalization, and likely objection handling.", "Product blog", 4),
  event("sales-07", "SalesFlow", "2025-10-07", "Customer", "Self-serve trial extended to 21 days", "Prospects now have more time to activate their first sequence before entering a sales-assisted motion.", "Product update", 3),
  event("sales-08", "SalesFlow", "2025-10-18", "Marketing", "Speed-to-pipeline benchmark published", "SalesFlow content focuses on time to first meeting and repeatable outbound playbooks.", "Research report", 3),
  event("sales-09", "SalesFlow", "2025-10-26", "Product", "Mobile approvals added", "Managers can approve messages and monitor sequence health from a mobile companion.", "Release notes", 3),
  event("sales-10", "SalesFlow", "2025-11-03", "Expansion", "Australia and Canada local pricing", "Localized pricing and billing were added for emerging English-speaking markets.", "Pricing page", 3),
  event("sales-11", "SalesFlow", "2025-11-14", "Partnership", "Freelancer marketplace integration", "A marketplace integration connects independent sellers and fractional sales teams to outbound workflows.", "Partner announcement", 3),
  event("sales-12", "SalesFlow", "2025-11-22", "AI", "Reply suggestions available to all plans", "AI-generated reply suggestions moved from beta into the standard sequence composer.", "Release notes", 4),
  event("sales-13", "SalesFlow", "2025-12-01", "Pricing", "Usage-based contact bands added", "Pricing now scales with active contacts, keeping the base subscription low while monetizing volume.", "Pricing page", 4),
  event("sales-14", "SalesFlow", "2025-12-09", "Hiring", "Lifecycle marketing team expanded", "New roles focus on onboarding, activation, and converting trial users into paid teams.", "Careers page", 3),
  event("sales-15", "SalesFlow", "2025-12-16", "Customer", "Template community launched", "Customers can publish and remix outbound playbooks inside a public template community.", "Community announcement", 3),
  event("sales-16", "SalesFlow", "2025-12-23", "Product", "One-click CRM setup released", "New users can connect a CRM and launch a guided first sequence without implementation support.", "Product changelog", 4),
  event("sales-17", "SalesFlow", "2026-01-04", "Marketing", "Category language shifts to pipeline autopilot", "The homepage leans into automation for small teams rather than enterprise sales orchestration.", "Homepage messaging", 4),
  event("sales-18", "SalesFlow", "2026-01-09", "Expansion", "UK and Ireland sales pod formed", "A small regional pod was created to support local demand while preserving the self-serve motion.", "Company announcement", 3),
  event("sales-19", "SalesFlow", "2026-01-16", "AI", "Personalization tokens expanded", "The composer now uses firmographic and website signals to vary outbound messages at scale.", "Release notes", 4),
  event("sales-20", "SalesFlow", "2026-01-23", "Customer", "First-campaign activation program introduced", "New customers receive a seven-day checklist and office hours for launching their first campaign.", "Customer program", 3),
  event("sales-21", "SalesFlow", "2026-01-30", "Hiring", "Customer education roles opened", "SalesFlow is investing in workshops and content for lean teams adopting outbound for the first time.", "Careers page", 3),
  event("sales-22", "SalesFlow", "2026-02-04", "Pricing", "Annual starter discount increased", "The company increased annual savings for teams willing to commit before reaching volume bands.", "Pricing page", 3),
  event("sales-23", "SalesFlow", "2026-02-10", "Partnership", "Agency enablement program announced", "Agencies can manage multiple client workspaces with a shared services package.", "Partner page", 4),
  event("sales-24", "SalesFlow", "2026-02-14", "Product", "Outbound health score released", "Teams receive a simple score for deliverability, reply rates, and sequence consistency.", "Product changelog", 4),

  event("cloud-01", "CloudDesk", "2025-08-07", "Product", "Shared workspace permissions released", "CloudDesk added granular guest, project, and workspace permissions for distributed teams.", "Release notes", 3),
  event("cloud-02", "CloudDesk", "2025-08-21", "Partnership", "Atlassian migration partnership announced", "A partner program packages migration from legacy project trackers into CloudDesk workspaces.", "Partner announcement", 4),
  event("cloud-03", "CloudDesk", "2025-09-03", "Expansion", "German data region opened", "A new EU region supports local residency requirements for larger European customers.", "Infrastructure update", 4),
  event("cloud-04", "CloudDesk", "2025-09-11", "Hiring", "Security and compliance hiring increases", "Open roles span security engineering, trust operations, and enterprise compliance readiness.", "Careers page", 4),
  event("cloud-05", "CloudDesk", "2025-09-20", "Marketing", "Work management platform message introduced", "CloudDesk broadened its message from project tracking to a connected work management platform.", "Website messaging", 3),
  event("cloud-06", "CloudDesk", "2025-10-02", "Customer", "Admin console redesign previewed", "Enterprise admins received an early look at centralized policy, audit, and provisioning controls.", "Customer webinar", 3),
  event("cloud-07", "CloudDesk", "2025-10-14", "Pricing", "Business plan adds governance package", "Advanced audit logs and retention controls moved into a higher governance package.", "Pricing page", 4),
  event("cloud-08", "CloudDesk", "2025-10-25", "Product", "Portfolio view launched", "Leaders can compare initiatives, dependencies, and investment status across workspaces.", "Product announcement", 4),
  event("cloud-09", "CloudDesk", "2025-11-02", "Hiring", "Solutions architects hired for regulated accounts", "New roles focus on security reviews, procurement, and enterprise architecture workshops.", "Careers page", 4),
  event("cloud-10", "CloudDesk", "2025-11-10", "Partnership", "Okta provisioning integration expanded", "The integration adds automated lifecycle management and audit-friendly access controls.", "Integration update", 4),
  event("cloud-11", "CloudDesk", "2025-11-18", "Product", "AI project summaries entered beta", "AI summaries turn project updates into risks, decisions, and suggested follow-ups.", "Product blog", 5),
  event("cloud-12", "CloudDesk", "2025-11-27", "Marketing", "Trust center becomes a campaign centerpiece", "Marketing now leads enterprise conversations with certifications, controls, and admin transparency.", "Trust center", 4),
  event("cloud-13", "CloudDesk", "2025-12-05", "Customer", "Enterprise governance roundtable hosted", "Security and operations leaders were invited to discuss policy rollout across large workspaces.", "Customer event", 4),
  event("cloud-14", "CloudDesk", "2025-12-12", "Expansion", "Japan market launch announced", "CloudDesk opened localized support and partner coverage for Japan-based enterprise teams.", "Company announcement", 4),
  event("cloud-15", "CloudDesk", "2025-12-19", "AI", "AI risk detection added", "Project summaries now flag schedule risk, blocked dependencies, and unresolved ownership.", "Release notes", 5),
  event("cloud-16", "CloudDesk", "2025-12-28", "Pricing", "Enterprise controls bundled", "Retention, advanced provisioning, and AI governance are presented as a single enterprise package.", "Pricing page", 5),
  event("cloud-17", "CloudDesk", "2026-01-06", "Hiring", "Trust and AI product leaders appointed", "Leadership additions span enterprise trust and responsible AI product strategy.", "Company announcement", 5),
  event("cloud-18", "CloudDesk", "2026-01-13", "Product", "Responsible AI controls released", "Admins can configure summary visibility, review generated risk flags, and export AI audit trails.", "Release notes", 5),
  event("cloud-19", "CloudDesk", "2026-01-19", "Partnership", "ServiceNow integration pilot", "A pilot connects CloudDesk project work with service operations for larger IT organizations.", "Partner announcement", 4),
  event("cloud-20", "CloudDesk", "2026-01-26", "Marketing", "Enterprise transformation campaign launched", "New messaging emphasizes cross-functional operating rhythm, governance, and measurable delivery.", "Campaign library", 4),
  event("cloud-21", "CloudDesk", "2026-02-01", "Expansion", "APAC enterprise team formed", "A regional sales and solutions team was formed to support complex multi-workspace deployments.", "Careers page", 4),
  event("cloud-22", "CloudDesk", "2026-02-07", "Customer", "AI governance guide published", "A practical guide helps admins roll out AI summaries with review policies and audit checkpoints.", "Resource center", 4),
  event("cloud-23", "CloudDesk", "2026-02-11", "Product", "Cross-workspace dependency graph released", "Leaders can trace dependencies and risks across portfolios, teams, and regions.", "Product changelog", 5),
  event("cloud-24", "CloudDesk", "2026-02-15", "Pricing", "Global enterprise contract options added", "CloudDesk added annual global terms and procurement support for multi-region customers.", "Pricing page", 4),
];

export const eventsFor = (competitor: string) => competitorEvents.filter((item) => item.competitor === competitor);

export const competitorSummary = (competitor: string) => {
  const events = eventsFor(competitor);
  return {
    competitor,
    eventCount: events.length,
    lastActivity: events.at(-1)?.date ?? null,
    recentActivity: events.slice(-3),
  };
};
