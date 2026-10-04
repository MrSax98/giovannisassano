import type { Project } from "@/types/content";

/**
 * Projects, newest first. Each entry generates a page at /projects/<slug>/.
 *
 * Writing rule: describe method and problem precisely; state an outcome only
 * when it is verifiable. Work for clients is described at the level of
 * method, never of customer.
 */
export const projects: Project[] = [
  {
    slug: "retrieval-and-data-platforms",
    title: "Retrieval systems & cloud data platforms",
    kicker: "Deloitte Next Hub",
    year: "2025–",
    context: "Work",
    summary:
      "Retrieval-augmented generation pipelines served as APIs, and the data platforms underneath them, moved to the cloud.",
    problem:
      "Enterprise knowledge lives in documents that nobody can query, and enterprise data lives in platforms built before the cloud. A language model is only as useful as the retrieval and the plumbing behind it.",
    approach: [
      "Design RAG pipelines with LangChain: ingestion, chunking, embedding, retrieval, generation, and the evaluation loop that keeps them honest.",
      "Serve them as FastAPI services, containerised with Docker so that what runs in development is what runs in production.",
      "Migrate data workloads to Azure Databricks; since autumn 2026, also work on Google Cloud with BigQuery, Vertex AI and Looker.",
    ],
    stack: ["Python", "LangChain", "FastAPI", "Docker", "Azure Databricks", "BigQuery", "Vertex AI", "Looker"],
    glyph: "rag",
    formula: "score(q, d) = ⟨φ(q), φ(d)⟩ / ‖φ(q)‖‖φ(d)‖",
  },
  {
    slug: "stochastic-modelling-trading",
    title: "Stochastic modelling & simulation for algorithmic trading",
    kicker: "Applied statistics, MSc",
    year: "2026",
    context: "Academic",
    summary:
      "A trading rule tested against an explicit model of randomness instead of the single history that happened to occur.",
    problem:
      "A backtest on one historical path is a sample of size one. To judge a strategy you need the distribution of outcomes it would have produced, which means modelling the price process itself.",
    approach: [
      "Model prices as geometric Brownian motion, derived from its stochastic differential equation through Itô calculus.",
      "Use Black–Scholes as the analytical benchmark and Monte Carlo simulation to generate families of paths.",
      "Backtest a simple moving-average crossover across simulated paths and measure PnL and maximum drawdown as distributions, not single numbers.",
      "Write the report in LaTeX, with every figure drawn in TikZ.",
    ],
    stack: ["Python", "NumPy", "Monte Carlo", "LaTeX", "TikZ"],
    glyph: "gbm",
    formula: "dSₜ = μ Sₜ dt + σ Sₜ dWₜ",
  },
  {
    slug: "rl-portfolio-allocation",
    title: "Reinforcement learning for portfolio allocation",
    kicker: "Personal research",
    year: "2026",
    context: "Personal R&D",
    summary:
      "Policy-gradient agents that learn to rebalance a portfolio as a sequence of decisions rather than a single optimisation.",
    problem:
      "Static allocation solves for one set of weights under assumptions (symmetric returns, stable estimates) that markets rarely respect. Rebalancing is sequential: each decision changes the state the next one starts from.",
    approach: [
      "Frame allocation as a sequential decision problem, with portfolio weights as actions.",
      "Train and compare PPO and A2C agents.",
      "Treat reward design as the real modelling decision, since it encodes what risk the agent is allowed to take.",
    ],
    stack: ["Python", "PPO", "A2C"],
    glyph: "rl",
    formula: "L(θ) = 𝔼[min(rₜ(θ)Âₜ, clip(rₜ(θ), 1−ε, 1+ε)Âₜ)]",
  },
  {
    slug: "multi-agent-orchestration",
    title: "Multi-agent LLM orchestration",
    kicker: "Personal research",
    year: "2026",
    context: "Personal R&D",
    summary:
      "Several language-model agents with explicit roles, coordinated to run workflows that a single prompt cannot hold.",
    problem:
      "Real workflows branch, call tools and need review. Packed into one prompt they become brittle; split across agents they become a coordination problem, with its own failure modes.",
    approach: [
      "Give each agent a narrow role and route work between them through an explicit orchestration layer.",
      "Observe how agents behave when they interact, following research on normative drift in LLM agent populations.",
    ],
    stack: ["Python", "LangChain", "LLMs"],
    glyph: "agents",
  },
  {
    slug: "bell-theorem-thesis",
    title: "Quantum states and their mathematical description",
    kicker: "BSc thesis, Mathematics",
    year: "BSc",
    context: "Research",
    summary:
      "Bell's theorem and the Aspect experiment: the point where probability stops describing ignorance and starts describing nature.",
    problem:
      "Can the randomness of quantum measurements be explained by hidden variables we simply do not see? Bell turned a philosophical question into an inequality that an experiment can violate.",
    approach: [
      "Build the Hilbert-space formalism of quantum states from the mathematical side.",
      "Derive Bell's inequality and its CHSH form under the assumptions of locality and realism.",
      "Read Aspect's experiments as the empirical test, and discuss what their violation of the bound rules out.",
    ],
    stack: ["Functional analysis", "Probability", "Quantum mechanics"],
    glyph: "bell",
    formula: "|S| ≤ 2  (local realism)   ·   |S| ≤ 2√2  (quantum)",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
