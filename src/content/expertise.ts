import type { ExpertiseEdge, ExpertiseNode } from "@/types/content";

/**
 * The expertise graph. Coordinates live in a 100 x 62 box; clusters read
 * left to right: mathematics → statistics → learning → engineering.
 * Edges mean "this one is used to do that one", not mere co-occurrence.
 */
export const clusters = {
  math: { label: "Mathematics", shape: "circle" },
  stats: { label: "Statistics", shape: "square" },
  ml: { label: "Learning", shape: "diamond" },
  eng: { label: "Engineering", shape: "triangle" },
} as const;

export const nodes: ExpertiseNode[] = [
  {
    id: "mathematics",
    label: "Mathematics",
    cluster: "math",
    x: 8,
    y: 30,
    detail:
      "Analysis, linear algebra, mathematical physics. A bachelor's thesis on quantum states, Bell's theorem and the Aspect experiment.",
  },
  {
    id: "probability",
    label: "Probability",
    cluster: "math",
    x: 24,
    y: 14,
    detail: "Random variables as the default language. Stochastic processes, Brownian motion, SDEs and Itô calculus.",
  },
  {
    id: "optimization",
    label: "Optimization",
    cluster: "math",
    x: 24,
    y: 48,
    detail:
      "Linear and integer programming, duality, KKT and Fritz John conditions, gradient and Newton methods. Models written in AMPL.",
    tools: ["AMPL"],
  },
  {
    id: "quant",
    label: "Quantitative finance",
    cluster: "math",
    x: 38,
    y: 4,
    detail:
      "Geometric Brownian motion, Black–Scholes, Bollinger bands, backtesting with PnL and drawdown, online moments with Welford's algorithm.",
  },
  {
    id: "inference",
    label: "Inference",
    cluster: "stats",
    x: 44,
    y: 24,
    detail:
      "Estimation and testing, statistical decision theory, and causal inference: the step from what correlates to what would happen if.",
    tools: ["R"],
  },
  {
    id: "forecasting",
    label: "Forecasting",
    cluster: "stats",
    x: 58,
    y: 10,
    detail:
      "Time series and predictive methods, studied formally at Sapienza and used whenever someone asks what next quarter looks like.",
  },
  {
    id: "analysis",
    label: "Data analysis",
    cluster: "stats",
    x: 56,
    y: 38,
    detail:
      "Exploratory analysis, data mining and classification, ensembles. Dashboards in Looker when the answer has to travel.",
    tools: ["Looker", "R", "SQL"],
  },
  {
    id: "ml",
    label: "Machine learning",
    cluster: "ml",
    x: 44,
    y: 54,
    detail:
      "Random forests and gradient boosting, CNNs, autoencoders, RNNs, transfer learning with pretrained backbones.",
    tools: ["Python", "Keras"],
  },
  {
    id: "rl",
    label: "Reinforcement learning",
    cluster: "ml",
    x: 30,
    y: 60,
    detail:
      "Policy-gradient agents (PPO, A2C) for sequential allocation problems, where every decision changes the next state.",
  },
  {
    id: "genai",
    label: "LLMs & retrieval",
    cluster: "ml",
    x: 68,
    y: 56,
    detail:
      "Retrieval-augmented generation pipelines and multi-agent orchestration, with a research interest in how agents drift from their norms.",
    tools: ["LangChain", "Vertex AI"],
  },
  {
    id: "dataeng",
    label: "Data engineering",
    cluster: "eng",
    x: 82,
    y: 40,
    detail:
      "Platform migrations to Azure Databricks, warehousing on BigQuery, containerised services. The plumbing that decides whether a model ever leaves a notebook.",
    tools: ["Databricks", "BigQuery", "Docker"],
  },
  {
    id: "programming",
    label: "Python · R · SQL",
    cluster: "eng",
    x: 92,
    y: 18,
    detail:
      "Python first, R and SQL daily. FastAPI for services, Docker for shipping them, LaTeX and TikZ when the result is a document.",
    tools: ["Python", "R", "SQL", "FastAPI"],
  },
];

export const edges: ExpertiseEdge[] = [
  ["mathematics", "probability"],
  ["mathematics", "optimization"],
  ["probability", "quant"],
  ["probability", "inference"],
  ["probability", "rl"],
  ["optimization", "ml"],
  ["optimization", "rl"],
  ["quant", "forecasting"],
  ["inference", "forecasting"],
  ["inference", "analysis"],
  ["analysis", "ml"],
  ["ml", "rl"],
  ["ml", "genai"],
  ["genai", "dataeng"],
  ["analysis", "dataeng"],
  ["dataeng", "programming"],
  ["forecasting", "programming"],
];

/** Flat stack list, for the ticker under the graph and for JSON-LD. */
export const stack = [
  "Python",
  "R",
  "SQL",
  "LangChain",
  "FastAPI",
  "Docker",
  "Azure Databricks",
  "BigQuery",
  "Vertex AI",
  "Looker",
  "AMPL",
  "LaTeX / TikZ",
];
