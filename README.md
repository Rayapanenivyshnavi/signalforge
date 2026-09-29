# SignalForge

### Hindsight-Powered Competitive Intelligence Agent

SignalForge is an AI-powered competitive intelligence agent designed to help product and strategy teams understand how competitors evolve over time.

Instead of treating competitor updates as isolated events, SignalForge remembers historical activity, connects related events, identifies emerging patterns, and generates strategic intelligence.

> **It doesn't just monitor competitors. It remembers how they evolve.**

---

## 🎯 Problem

Competitive information is scattered across news, product announcements, pricing changes, research documents, and previous observations.

A single event may not mean much by itself. However, a sequence of events over several months can reveal a significant strategic shift.

Traditional monitoring tools often show **what happened**.

SignalForge focuses on understanding:

- What changed?
- How has the competitor evolved?
- Which events are connected?
- What patterns are emerging?
- What should a product or strategy team pay attention to?

---

## 💡 Solution

SignalForge follows an agent workflow:

**Observe → Remember → Retrieve → Connect → Reason → Learn → Generate Intelligence**

The system maintains competitor-related information and uses historical context to produce more meaningful competitive insights.

---

## 🧠 Hindsight Memory

Hindsight is the persistent memory layer required for the hackathon.

SignalForge is designed to use Hindsight to retain and retrieve:

- Competitor events
- Historical observations
- Context
- Relationships between events
- Previous intelligence
- Learned patterns

This enables the agent to reason across time rather than treating every query as a completely new task.

### Memory Evolution

The prototype also demonstrates the concept of comparing an agent's understanding before and after historical memory is available.

The intended production flow is:

**New Event → Hindsight Memory → Historical Retrieval → Pattern Detection → Strategic Insight**

---

## 🚀 Key Features

### Competitor Monitoring
Track important competitor activity and market events.

### Historical Timeline
View competitor events chronologically to understand how strategies develop.

### Market Signals
Identify meaningful patterns and changes across competitor activity.

### Ask Agent
Ask natural-language questions about competitors and receive intelligence based on available context.

### Competitor Comparison
Compare activity and strategic signals across multiple competitors.

### Sales-Call Preparation
Generate useful competitor context for customer-facing conversations.

### Memory Explorer
Explore the information stored and retrieved by the memory layer.

### Intelligence Generation
Transform individual events and historical patterns into higher-level strategic insights.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      User / Team    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   SignalForge UI    │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Agent / Backend   │
                    │   Nitro API Layer   │
                    └───────┬─────┬───────┘
                            │     │
                  ┌─────────┘     └─────────┐
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │ Hindsight Memory │      │   LLM Reasoning  │
        │ Retain / Recall  │      │ Intelligence Gen │
        └────────┬─────────┘      └────────┬─────────┘
                 │                         │
                 └──────────┬──────────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Strategic Insights  │
                 └─────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Backend:** Nitro
- **AI / LLM:** LLM-based intelligence generation
- **Memory Layer:** Hindsight by Vectorize
- **Language:** TypeScript / JavaScript
- **Package Manager:** npm

---

## 📊 Example Intelligence Scenario

Consider a competitor that:

1. Launches an AI automation feature in January.
2. Changes its pricing in February.
3. Responds to another competitor's product launch in March.
4. Increases its AI-focused messaging in April.

Individually, these events may appear unrelated.

With historical memory, SignalForge can connect them and identify a broader pattern indicating a sustained strategic shift.

---

## 🖥️ Prototype

The current prototype includes:

- Competitive intelligence dashboard
- Competitor tracking
- Market signals
- Historical events
- Hindsight memory interface
- Ask Agent interface
- Sales-call preparation
- Memory evolution visualization
- Synthetic demo data

> **Note:** The current prototype includes a demo mode with synthetic data. Live Hindsight connectivity is intended to be configured for the final hackathon deployment.

---

## ⚙️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/arunboda29/signalforge.git
cd signalforge
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the development server

```bash
npm run dev
```

The application will then be available through the local development URL shown by Vite.

---

## 🔐 Environment Variables

For live integrations, configure the required environment variables:

```env
HINDSIGHT_URL=
HINDSIGHT_API_KEY=
HINDSIGHT_BANK_ID=
GROQ_API_KEY=
```

Do not commit API keys or `.env` files to the repository.

---

## 🎯 Hackathon Focus

SignalForge is built around the idea of **AI agents that learn using hindsight**.

The key differentiator is not simply generating an answer from the latest information.

It is the ability to use accumulated memory to understand:

**"What changed over time, and what does that change mean?"**

---

## 🔮 Future Improvements

- Live Hindsight deployment
- Automated competitor information ingestion
- More external data sources
- Continuous memory updates
- Advanced relationship graphs
- Automated competitive briefs
- Scheduled intelligence reports
- More sophisticated strategic pattern detection

---

## 👥 Team

Built for the **AI Agents That Learn Using Hindsight** hackathon.

### Project

**SignalForge — Hindsight-Powered Competitive Intelligence Agent**

### Repository

https://github.com/Rayapanenivyshnavi/signalforge.git