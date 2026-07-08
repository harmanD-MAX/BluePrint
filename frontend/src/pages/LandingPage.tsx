import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FolderGit2, ArrowRight, GitBranch, Cpu, Database, Activity, CheckCircle2, ChevronDown, Search, StickyNote, Cloud, Shield, Zap, Eye } from "lucide-react"
import Footer from "@/components/Footer"
import {
  ConceptualEngineVisualization,
  DependencyGraphVisualization,
  TechnicalDebtVisualization,
  SemanticSearchVisualization,
  DeveloperNotesVisualization,
  ApiDiscoveryVisualization,
  SystemActivityVisualization,
  ArchitecturalInsightsVisualization
} from "@/components/FeatureVisualizations"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden flex flex-col selection:bg-orange-500/30 selection:text-white">

      {/* Sticky Glassmorphic Navbar */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <FolderGit2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Blueprint</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="text-sm text-neutral-400 hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-40 pb-28 max-w-5xl mx-auto w-full">
        {/* Background glow */}
        <div className="glow-orange" style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10">
          <div className="section-badge mb-8">
            <Zap className="w-3 h-3 mr-2" />
            AI-Powered Codebase Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight text-white leading-[1.05] mb-8">
            Decode any codebase.{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            A professional intelligence platform that builds interactive architectural diagrams, maps deep dependency graphs, and audits technical debt for your GitHub repositories — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
              className="btn-gradient-primary px-8 py-4 rounded-full text-base flex items-center group"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Analyzing Free"}
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="btn-gradient-secondary px-8 py-4 rounded-full text-base flex items-center"
            >
              <Eye className="mr-2 h-4 w-4" />
              See How It Works
            </a>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="py-28 relative">
        <div className="glow-blue" style={{ top: '100px', right: '-200px' }} />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 mx-auto">Features</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Everything you need to understand<br />any codebase
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Powerful AI analysis, beautiful visualizations, and deep insights — all in one platform.</p>
          </div>

          {/* Main 2x2 Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Feature 1: AI Intelligence */}
            <div className="glass-card rounded-2xl p-8 group relative overflow-hidden">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4 border border-orange-500/20">
                  <Cpu className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">One-Shot AI Intelligence</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  No configuration files. Point at any GitHub repository and our Gemini 3.1 integration generates a complete semantic understanding instantly.
                </p>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <ConceptualEngineVisualization />
              </div>
            </div>

            {/* Feature 2: Dependency Mapping */}
            <div className="glass-card rounded-2xl p-8 group relative overflow-hidden">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-4 border border-blue-500/20">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Deep Dependency Mapping</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  We parse ASTs and import statements to render interactive Cytoscape graphs. Understand how components intertwine without manual tracing.
                </p>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <DependencyGraphVisualization />
              </div>
            </div>

            {/* Feature 3: Technical Debt */}
            <div className="glass-card rounded-2xl p-8 group relative overflow-hidden">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-4 border border-amber-500/20">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Technical Debt Auditing</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Automatically identify code smells, deprecated APIs, and architectural anti-patterns. Continuous audit for code quality and structure.
                </p>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <TechnicalDebtVisualization />
              </div>
            </div>

            {/* Feature 4: Semantic Search */}
            <div className="glass-card rounded-2xl p-8 group relative overflow-hidden">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <Search className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Semantic Code Search</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Find exactly what you need using natural language. We embed your codebase with vector models for conceptual search instead of regex.
                </p>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <SemanticSearchVisualization />
              </div>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 border border-purple-500/20">
                <StickyNote className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Team Knowledge Notes</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Pin notes, security warnings, and architecture decisions onto specific files.</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mb-3 border border-pink-500/20">
                <Cloud className="w-4 h-4 text-pink-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Automated API Discovery</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Auto-scan routers and controllers to discover all endpoints instantly.</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 border border-cyan-500/20">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Real-Time Activity Pulse</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Background monitoring keeps knowledge graphs and metrics always up to date.</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 border border-indigo-500/20">
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Deep Architectural Insights</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Uncover anti-patterns, security vulnerabilities, and cloud infrastructure footprints.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28 relative">
        <div className="glow-purple" style={{ bottom: '50px', left: '-100px' }} />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 mx-auto">How It Works</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">The exact pipeline</h2>
            <p className="text-lg text-neutral-500">From GitHub URL to complete architectural intelligence in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-orange-500/30 via-purple-500/30 to-blue-500/30 -translate-y-1/2 z-0" />

            {[
              { icon: GitBranch, title: "Git Ingestion", desc: "Repository cloned into a secure, isolated /tmp environment using native Git.", color: "orange", step: "01" },
              { icon: Cpu, title: "AST Parsing", desc: "C# backend extracts syntax trees to build a structural model of your codebase.", color: "emerald", step: "02" },
              { icon: Activity, title: "AI Vectorization", desc: "Google Gemini AI analyzes metrics to generate deep architectural insights.", color: "purple", step: "03" },
              { icon: Database, title: "Persistence", desc: "Complex JSON graphs and AI insights stored in the database for instant retrieval.", color: "blue", step: "04" },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex flex-col items-center text-center relative z-10">
                <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3">{item.step}</div>
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-4 border border-${item.color}-500/20`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Highlights Section */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 mx-auto">Under The Hood</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Built for performance</h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Enterprise-grade infrastructure powering every analysis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-8 hover:border-orange-500/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-3">Hangfire Job Queues</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                We use Hangfire to enqueue <code className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded text-xs">IRepositoryAnalysisJob</code> tasks in the background. Your frontend never blocks while parsing thousands of files.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Distributed queuing</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Automatic retries</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> In-memory fallback</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-blue-500/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-3">Cytoscape Graph Engine</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                We map C# Roslyn syntax nodes into Cytoscape data objects. Controllers, Services, and Repositories are strictly typed, allowing interactive directed graphs at 60fps.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> WebGL accelerated</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Breadthfirst layout</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Custom node styling</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-purple-500/20 transition-all">
              <h3 className="text-lg font-bold text-white mb-3">Gemini AI Analysis</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                AST analysis yields massive JSON documents. Google Gemini processes <code className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded text-xs">MetricsJson</code> payloads to deliver deep architectural insights with zero latency.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> High-throughput JSON</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Serverless scaling</li>
                <li className="flex items-center text-sm text-neutral-500"><CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" /> Structured AI output</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 relative border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="text-xs font-bold text-neutral-600 uppercase tracking-[0.2em] mb-10">Built with the best</div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-50">
            <span className="text-2xl font-bold text-white font-mono">.NET 10</span>
            <span className="text-2xl font-bold text-blue-400 tracking-tight">React</span>
            <span className="text-2xl font-bold text-teal-400 font-mono">TailwindCSS</span>
            <span className="text-2xl font-bold text-emerald-500">Hangfire</span>
            <span className="text-2xl font-bold text-yellow-500 tracking-tighter">Cytoscape.js</span>
            <span className="text-2xl font-bold text-indigo-400">Gemini AI</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 max-w-3xl mx-auto px-6 md:px-8 w-full">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">FAQ</div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {[
            { q: "Is my code secure?", a: "Yes. Your code is cloned into a highly isolated /tmp directory, parsed in memory, and immediately deleted after metrics are extracted. We only store the abstract syntax tree metrics, never your proprietary source code." },
            { q: "What languages are supported?", a: "Blueprint currently has native AST parsing for C# (.NET) and TypeScript/JavaScript (React/Node). Support for Python and Go is coming next quarter." },
            { q: "Does this replace traditional documentation?", a: "No, it augments it. Blueprint ensures that your structural documentation is always 100% in sync with your actual codebase, reducing the burden on engineers to write manual architecture diagrams." },
            { q: "How long does analysis take?", a: "A typical microservice (100-300 files) takes under 15 seconds to parse and vectorize. Massive monoliths can take up to 2 minutes, which is handled gracefully by our Hangfire background queue." }
          ].map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-5 flex justify-between items-center text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-semibold text-white text-[15px]">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-neutral-400 text-sm leading-relaxed border-t border-white/[0.06] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="glow-orange" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px' }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Simple enough to explore.{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Powerful enough to ship.
            </span>
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">Join developers who use Blueprint to understand, document, and ship code faster than ever.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
