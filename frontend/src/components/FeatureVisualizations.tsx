import { AlertTriangle, Pin, Link } from "lucide-react"

export function ConceptualEngineVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      <svg className="w-full max-w-full h-auto max-h-full" viewBox="0 0 750 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection Paths (Start/End carefully at the edges of rects) */}
        <path d="M155 200 L210 120" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M155 200 L210 280" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M390 120 L440 200" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M390 280 L440 200" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M560 200 L620 200" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Flowing Data Particles */}
        <circle cx="0" cy="0" r="4" fill="#3b82f6"><animateMotion dur="2s" repeatCount="indefinite" path="M155 200 L210 120" /></circle>
        <circle cx="0" cy="0" r="4" fill="#3b82f6"><animateMotion dur="2.5s" repeatCount="indefinite" path="M155 200 L210 280" /></circle>
        
        <circle cx="0" cy="0" r="4" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M390 120 L440 200" /></circle>
        <circle cx="0" cy="0" r="4" fill="#10b981"><animateMotion dur="2.5s" repeatCount="indefinite" path="M390 280 L440 200" /></circle>
        
        <circle cx="0" cy="0" r="5" fill="#a855f7" filter="drop-shadow(0 0 4px #a855f7)"><animateMotion dur="2s" repeatCount="indefinite" path="M560 200 L620 200" /></circle>

        {/* Source Code Node */}
        <g transform="translate(100, 200)">
          <rect x="-55" y="-25" width="110" height="50" rx="8" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-3" fill="#3b82f6" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GitHub</text>
          <text x="0" y="14" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">/tmp clone</text>
        </g>

        {/* AST Nodes */}
        <g transform="translate(300, 120)">
          <rect x="-90" y="-25" width="180" height="50" rx="8" fill="#171717" stroke="#10b981" strokeWidth="2" />
          <text x="0" y="-3" fill="#10b981" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Roslyn AST Parser</text>
          <text x="0" y="14" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">Hangfire Background Job</text>
        </g>
        <g transform="translate(300, 280)">
          <rect x="-90" y="-25" width="180" height="50" rx="8" fill="#171717" stroke="#10b981" strokeWidth="2" />
          <text x="0" y="-3" fill="#10b981" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Graph Engine</text>
          <text x="0" y="14" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">Cytoscape JSON Metrics</text>
        </g>

        {/* AI Engine Node (Pulsing) */}
        <g transform="translate(500, 200)">
          <rect x="-60" y="-30" width="120" height="60" rx="12" fill="none" stroke="#a855f7" strokeWidth="2">
             <animate attributeName="opacity" values="1; 0; 1" dur="2s" repeatCount="indefinite" />
             <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1" dur="2s" repeatCount="indefinite" additive="sum" />
          </rect>
          <rect x="-60" y="-30" width="120" height="60" rx="12" fill="#171717" stroke="#a855f7" strokeWidth="3" />
          <text x="0" y="-4" fill="#a855f7" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Gemini AI</text>
          <text x="0" y="15" fill="#d8b4fe" fontSize="10" fontFamily="monospace" textAnchor="middle">Semantic Vectors</text>
        </g>

        {/* Output Node */}
        <g transform="translate(660, 200)">
           <rect x="-40" y="-25" width="80" height="50" rx="8" fill="#171717" stroke="#f59e0b" strokeWidth="2" />
           <text x="0" y="-3" fill="#f59e0b" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Astra DB</text>
           <text x="0" y="14" fill="#fcd34d" fontSize="10" fontFamily="monospace" textAnchor="middle">Storage</text>
        </g>
      </svg>
    </div>
  )
}

export function DependencyGraphVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <svg className="w-full max-w-full h-auto max-h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Adjusted connecting paths avoiding bounding boxes */}
        {/* Blueprint.Api (300, 80) -> UI (150, 200), Modules (450, 200), DB (300, 250) */}
        <path d="M 230 105 L 180 175 M 370 105 L 420 175 M 300 105 L 300 225" stroke="#262626" strokeWidth="2" />
        {/* Frontend (150, 200) -> DB (300, 250) */}
        <path d="M 210 215 L 240 235" stroke="#262626" strokeWidth="2" />
        {/* Modules (450, 200) -> DB (300, 250), Core (220, 340), Infra (380, 340) */}
        <path d="M 390 215 L 360 235 M 430 225 L 380 315 M 410 225 L 280 315" stroke="#262626" strokeWidth="2" />
        {/* Infra (380, 340) -> DB (300, 250) */}
        <path d="M 350 315 L 330 275" stroke="#262626" strokeWidth="2" />

        {/* Animated pulses along edges */}
        <circle cx="0" cy="0" r="4" fill="#3b82f6"><animateMotion dur="2s" repeatCount="indefinite" path="M 230 105 L 180 175" /></circle>
        <circle cx="0" cy="0" r="4" fill="#10b981"><animateMotion dur="3s" repeatCount="indefinite" path="M 370 105 L 420 175" /></circle>
        <circle cx="0" cy="0" r="4" fill="#a855f7"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 430 225 L 380 315" /></circle>
        <circle cx="0" cy="0" r="4" fill="#ef4444"><animateMotion dur="2s" repeatCount="indefinite" path="M 410 225 L 280 315" /></circle>
        <circle cx="0" cy="0" r="4" fill="#06b6d4"><animateMotion dur="3.5s" repeatCount="indefinite" path="M 300 105 L 300 225" /></circle>

        {/* Node: Blueprint.Api */}
        <g transform="translate(300, 80)">
          <rect x="-70" y="-25" width="140" height="50" rx="8" fill="none" stroke="#3b82f6" strokeWidth="1"><animate attributeName="opacity" values="1; 0; 1" dur="3s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="scale" values="1; 1.2; 1" dur="3s" repeatCount="indefinite" additive="sum"/></rect>
          <rect x="-70" y="-25" width="140" height="50" rx="8" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="4" fill="#d4d4d4" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Blueprint.Api</text>
        </g>

        {/* Node: Frontend (Vite) */}
        <g transform="translate(150, 200)">
          <rect x="-60" y="-25" width="120" height="50" rx="8" fill="#171717" stroke="#10b981" strokeWidth="2" />
          <text x="0" y="-3" fill="#d4d4d4" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">React SPA</text>
          <text x="0" y="14" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">Cytoscape UI</text>
        </g>

        {/* Node: Blueprint.Modules */}
        <g transform="translate(450, 200)">
          <rect x="-60" y="-25" width="120" height="50" rx="8" fill="#171717" stroke="#a855f7" strokeWidth="2" />
          <text x="0" y="-3" fill="#d4d4d4" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Modules</text>
          <text x="0" y="14" fill="#d8b4fe" fontSize="10" fontFamily="monospace" textAnchor="middle">AnalysisJob</text>
        </g>

        {/* Node: SQLite / AstraDB */}
        <g transform="translate(300, 250)">
          <rect x="-60" y="-25" width="120" height="50" rx="8" fill="#171717" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="4" fill="#f87171" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Database</text>
        </g>

        {/* Node: Blueprint.Core */}
        <g transform="translate(220, 340)">
          <rect x="-60" y="-25" width="120" height="50" rx="8" fill="#171717" stroke="#737373" strokeWidth="2" />
          <text x="0" y="4" fill="#d4d4d4" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Core (I)</text>
        </g>

        {/* Node: Blueprint.Infrastructure */}
        <g transform="translate(380, 340)">
          <rect x="-70" y="-25" width="140" height="50" rx="8" fill="#171717" stroke="#737373" strokeWidth="2" />
          <text x="0" y="4" fill="#d4d4d4" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Infrastructure</text>
        </g>
      </svg>
    </div>
  )
}

export function TechnicalDebtVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Debt Density Map */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #ef4444 0%, transparent 50%)' }}></div>
      
      <svg className="w-full max-w-full h-auto max-h-full" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Architecture Layers */}
        <text x="120" y="50" fill="#525252" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="2">FRONTEND</text>
        <text x="350" y="50" fill="#525252" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="2">BACKEND API</text>
        <text x="580" y="50" fill="#525252" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="2">PERSISTENCE</text>

        <path d="M 235 60 L 235 360" stroke="#171717" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 465 60 L 465 360" stroke="#171717" strokeWidth="2" strokeDasharray="4 4" />

        {/* Connections (Starting/Ending at rect edges) */}
        {/* DashboardPage (120, 120, w=160) -> RepositoriesController (350, 120, w=200) */}
        <path d="M 200 120 L 250 120" stroke="#262626" strokeWidth="2" />
        {/* LoginPage (120, 220, w=160) -> RepositoriesController (350, 120) */}
        <path d="M 200 220 L 280 145" stroke="#262626" strokeWidth="2" />
        {/* RepositoriesController (350, 120, w=200) -> AstraDB (580, 170, w=140) */}
        <path d="M 450 120 L 510 160" stroke="#262626" strokeWidth="2" />
        
        {/* High Debt Connections */}
        {/* RepositoriesController (350, 120) -> RepositoryAnalysisJob (350, 220) */}
        <path d="M 350 145 L 350 195" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" className="animate-pulse" />
        {/* RepositoryAnalysisJob (350, 220, w=220) -> AstraDB (580, 170) */}
        <path d="M 460 210 L 510 180" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" className="animate-pulse" />
        {/* RepositoryAnalysisJob (350, 220) -> SQLite/Disk (580, 270) */}
        <path d="M 460 230 L 510 260" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" className="animate-pulse" />

        {/* Flowing Traffic */}
        <circle cx="0" cy="0" r="3" fill="#3b82f6"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 120 L 250 120" /></circle>
        <circle cx="0" cy="0" r="3" fill="#3b82f6"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 200 220 L 280 145" /></circle>
        <circle cx="0" cy="0" r="3" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 450 120 L 510 160" /></circle>

        {/* Bottleneck / Debt Traffic */}
        <circle cx="0" cy="0" r="5" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)"><animateMotion dur="4s" repeatCount="indefinite" path="M 350 145 L 350 195" /></circle>
        <circle cx="0" cy="0" r="4" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)"><animateMotion dur="3s" repeatCount="indefinite" path="M 460 210 L 510 180" /></circle>
        <circle cx="0" cy="0" r="4" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)"><animateMotion dur="3.5s" repeatCount="indefinite" path="M 460 230 L 510 260" /></circle>

        {/* Healthy Nodes */}
        <g transform="translate(120, 120)">
           <rect x="-80" y="-25" width="160" height="50" rx="4" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
           <text x="0" y="4" fill="#3b82f6" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DashboardPage.tsx</text>
        </g>
        <g transform="translate(120, 220)">
           <rect x="-80" y="-25" width="160" height="50" rx="4" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
           <text x="0" y="4" fill="#3b82f6" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LoginPage.tsx</text>
        </g>
        <g transform="translate(350, 120)">
           <rect x="-100" y="-25" width="200" height="50" rx="4" fill="#171717" stroke="#10b981" strokeWidth="2" />
           <text x="0" y="4" fill="#10b981" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RepositoriesController</text>
        </g>
        
        {/* High Debt Node (God Object) */}
        <g transform="translate(350, 220)">
           <rect x="-110" y="-30" width="220" height="60" rx="4" fill="#2a0a0a" stroke="#ef4444" strokeWidth="3" />
           <text x="0" y="-3" fill="#ef4444" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RepositoryAnalysisJob.cs</text>
           <text x="0" y="14" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">AST Parsing Bottleneck</text>
           
           {/* Warning Ping Removed */}
        </g>

        {/* Legacy / Duplicated Code Node */}
        <g transform="translate(350, 320)">
           <rect x="-90" y="-25" width="180" height="50" rx="4" fill="#1f1209" stroke="#f59e0b" strokeWidth="2" />
           <text x="0" y="-2" fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">IParserService</text>
           <text x="0" y="14" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">⚠️ High Coupling</text>
        </g>

        {/* Data Nodes */}
        <g transform="translate(580, 170)">
           <rect x="-70" y="-25" width="140" height="50" rx="8" fill="#171717" stroke="#8b5cf6" strokeWidth="2" />
           <text x="0" y="4" fill="#8b5cf6" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Astra DB</text>
        </g>
        <g transform="translate(580, 270)">
           <rect x="-70" y="-25" width="140" height="50" rx="8" fill="#2a0a0a" stroke="#ef4444" strokeWidth="2" />
           <text x="0" y="-2" fill="#ef4444" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SQLite (/tmp)</text>
           <text x="0" y="14" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle">I/O Wait</text>
        </g>
      </svg>
    </div>
  )
}

export function SemanticSearchVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <svg className="w-full max-w-full h-auto max-h-full" viewBox="0 0 750 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Vector Grid Background */}
        <g stroke="#171717" strokeWidth="1">
          {Array.from({ length: 15 }).map((_, i) => (
             <path key={`h${i}`} d={`M 0 ${i * 30} L 750 ${i * 30}`} />
          ))}
          {Array.from({ length: 25 }).map((_, i) => (
             <path key={`v${i}`} d={`M ${i * 30} 0 L ${i * 30} 400`} />
          ))}
        </g>

        {/* Search Query Node (Center) */}
        <g transform="translate(375, 200)">
          <circle cx="0" cy="0" r="50" fill="#121212" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-10" fill="#3b82f6" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Query</text>
          <text x="0" y="10" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">"ast parser"</text>
          <text x="0" y="26" fill="#1e3a8a" fontSize="9" fontFamily="monospace" textAnchor="middle">[0.8, -0.2...]</text>
          
          <circle cx="0" cy="0" r="70" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#3b82f6" strokeWidth="1">
            <animate attributeName="r" values="50; 100; 50" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1; 0; 1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Searching Rays (Avoiding the rect boxes) */}
        {/* Center: 375,200 (r=50). Top-Left: 140,80 (w=160, h=50 -> 60 to 220, 55 to 105). Edge hits around 220, 105 */}
        <path d="M 335 165 L 220 105" stroke="#262626" strokeWidth="2" />
        
        {/* Top-Right: 610,80 (w=180, h=50 -> 520 to 700, 55 to 105). Edge hits around 520, 105 */}
        <path d="M 415 165 L 520 105" stroke="#262626" strokeWidth="2" />
        
        {/* Bottom-Left: 140,320 (w=160, h=50 -> 60 to 220, 295 to 345). Edge hits around 220, 295 */}
        <path d="M 335 235 L 220 295" stroke="#262626" strokeWidth="2" />
        
        {/* The Matched Ray (Bottom-Right: 610,320 (w=220, h=60 -> 500 to 720, 290 to 350). Edge hits around 500, 290 */}
        <path d="M 415 235 L 500 290" stroke="#10b981" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />

        {/* Ray Particles */}
        <circle cx="0" cy="0" r="4" fill="#525252"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 335 165 L 220 105" /></circle>
        <circle cx="0" cy="0" r="4" fill="#525252"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 415 165 L 520 105" /></circle>
        <circle cx="0" cy="0" r="4" fill="#525252"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 335 235 L 220 295" /></circle>
        <circle cx="0" cy="0" r="6" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)"><animateMotion dur="1s" repeatCount="indefinite" path="M 415 235 L 500 290" /></circle>

        {/* Unmatched Code Fragments */}
        <g transform="translate(140, 80)">
           <rect x="-80" y="-25" width="160" height="50" rx="6" fill="#121212" stroke="#525252" strokeWidth="2" />
           <text x="0" y="-3" fill="#737373" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CodeViewer.tsx</text>
           <text x="0" y="14" fill="#404040" fontSize="10" fontFamily="monospace" textAnchor="middle">Sim: 0.12</text>
        </g>
        <g transform="translate(610, 80)">
           <rect x="-90" y="-25" width="180" height="50" rx="6" fill="#121212" stroke="#525252" strokeWidth="2" />
           <text x="0" y="-3" fill="#737373" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RepoDbService.cs</text>
           <text x="0" y="14" fill="#404040" fontSize="10" fontFamily="monospace" textAnchor="middle">Sim: 0.45</text>
        </g>
        <g transform="translate(140, 320)">
           <rect x="-80" y="-25" width="160" height="50" rx="6" fill="#121212" stroke="#525252" strokeWidth="2" />
           <text x="0" y="-3" fill="#737373" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Dashboard.tsx</text>
           <text x="0" y="14" fill="#404040" fontSize="10" fontFamily="monospace" textAnchor="middle">Sim: 0.22</text>
        </g>

        {/* Matched Node */}
        <g transform="translate(610, 320)">
          <rect x="-110" y="-30" width="220" height="60" rx="6" fill="#062f21" stroke="#10b981" strokeWidth="3" />
          
          <rect x="-120" y="-40" width="240" height="80" rx="8" fill="none" stroke="#10b981" strokeWidth="1">
             <animate attributeName="opacity" values="1; 0; 1" dur="1.5s" repeatCount="indefinite" />
             <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1" dur="1.5s" repeatCount="indefinite" additive="sum" />
          </rect>

          <text x="0" y="-4" fill="#10b981" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ParserService.cs</text>
          <text x="0" y="14" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">98% Match (AST Engine)</text>
        </g>
      </svg>
    </div>
  )
}

export function DeveloperNotesVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] p-8">
      <div className="w-full max-w-2xl bg-[#121212] rounded-xl border border-neutral-800 p-8 flex space-x-8 shadow-2xl relative overflow-hidden">
        {/* Tree */}
        <div className="flex-1 space-y-4 font-mono text-[13px] text-neutral-400">
           <div className="flex items-center space-x-2 text-neutral-300"><span className="text-neutral-500">📁</span><span>backend</span></div>
           <div className="flex items-center space-x-2 pl-4 text-neutral-300"><span className="text-neutral-500">📁</span><span>Blueprint.Api</span></div>
           <div className="flex items-center space-x-2 pl-8 text-neutral-300"><span className="text-neutral-500">📄</span><span>RepositoriesController.cs</span></div>
           <div className="flex items-center space-x-2 pl-4 text-neutral-300"><span className="text-neutral-500">📁</span><span>Blueprint.Modules</span></div>
           <div className="flex items-center space-x-2 pl-8 text-white bg-primary/10 border border-primary/30 rounded px-2 py-2 relative">
             <span className="text-primary animate-pulse">📄</span><span>RepositoryAnalysisJob.cs</span>
             {/* Pin Line */}
             <div className="absolute -right-8 top-1/2 w-8 h-[2px] bg-emerald-500"></div>
           </div>
        </div>
        
        {/* Note Pin */}
        <div className="w-64 bg-[#171717] rounded-lg border border-emerald-500/50 p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: "forwards" }}>
           <div className="flex items-center space-x-2 mb-3">
              <Pin className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Performance Note</span>
           </div>
           <p className="text-[12px] text-neutral-400 leading-relaxed">
             This Hangfire job can consume significant memory when parsing large repositories due to Roslyn AST overhead. Ensure worker processes are scaled correctly.
           </p>
           <div className="mt-4 flex items-center space-x-2">
             <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] flex items-center justify-center text-white font-bold">A</div>
             <span className="text-[11px] text-neutral-500">Pinned by Alice</span>
           </div>
        </div>
      </div>
    </div>
  )
}

export function ApiDiscoveryVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] p-8">
      <div className="w-full max-w-xl space-y-5">
        {/* Scanning Header */}
        <div className="flex justify-end items-center bg-[#121212] border border-neutral-800 rounded-lg p-4">
           <span className="text-[13px] font-mono text-primary bg-primary/10 px-3 py-1.5 rounded">3 ENDPOINTS DISCOVERED</span>
        </div>

        {/* Endpoints */}
        <div className="bg-[#121212] border border-neutral-800 rounded-lg overflow-hidden flex flex-col relative">

           <div className="p-4 border-b border-neutral-800/50 flex items-center justify-between hover:bg-neutral-900 transition-colors bg-neutral-900/50">
              <div className="flex items-center space-x-4">
                 <span className="text-[12px] font-bold text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded w-16 text-center">POST</span>
                 <span className="text-[14px] font-mono text-white">/api/repositories/import</span>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-[12px] text-neutral-500">Starts Hangfire Job</span>
                 <Link className="w-4 h-4 text-primary" />
              </div>
           </div>
           
           <div className="p-4 border-b border-neutral-800/50 flex items-center justify-between hover:bg-neutral-900 transition-colors">
              <div className="flex items-center space-x-4">
                 <span className="text-[12px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded w-16 text-center">GET</span>
                 <span className="text-[14px] font-mono text-white">/api/repositories/{"{id}"}</span>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-[12px] text-neutral-500">Fetches JSON graph</span>
                 <Link className="w-4 h-4 text-neutral-600" />
              </div>
           </div>

           <div className="p-4 flex items-center justify-between hover:bg-neutral-900 transition-colors">
              <div className="flex items-center space-x-4">
                 <span className="text-[12px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded w-16 text-center">GET</span>
                 <span className="text-[14px] font-mono text-white">/api/repositories/{"{id}"}/file</span>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-[12px] text-neutral-500">Streams raw code</span>
                 <Link className="w-4 h-4 text-neutral-600" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export function SystemActivityVisualization() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] p-8">
      <div className="w-full max-w-xl bg-[#121212] border border-neutral-800 rounded-xl p-8 relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
               <h4 className="text-white text-[15px] font-bold">Hangfire Queue Activity</h4>
               <p className="text-[12px] text-neutral-500 font-mono mt-1">AST Parsing & Vectorization</p>
            </div>
            <div className="text-right">
               <span className="text-3xl font-bold text-emerald-400">14ms</span>
               <p className="text-[11px] text-emerald-500/50 font-mono">AVG JOB LATENCY</p>
            </div>
         </div>

         {/* Chart SVG */}
         <div className="h-40 w-full relative z-10">
           <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
             <defs>
               <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                 <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
               </linearGradient>
             </defs>
             <path d="M0,100 L0,50 L50,70 L100,40 L150,60 L200,20 L250,45 L300,30 L350,80 L400,40 L450,50 L500,20 L500,100 Z" fill="url(#chartGrad)">
             </path>
             <path d="M0,50 L50,70 L100,40 L150,60 L200,20 L250,45 L300,30 L350,80 L400,40 L450,50 L500,20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" className="animate-pulse" />
             
             {/* Moving tracker dot */}
             <circle r="5" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)">
                <animateMotion dur="4s" repeatCount="indefinite" path="M0,50 L50,70 L100,40 L150,60 L200,20 L250,45 L300,30 L350,80 L400,40 L450,50 L500,20" />
             </circle>
           </svg>
         </div>
      </div>
    </div>
  )
}

export function ArchitecturalInsightsVisualization() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a] p-8 space-y-6">
      <div className="w-full max-w-2xl bg-[#121212] border border-red-900/50 rounded-xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.1)] opacity-0 animate-fade-in-up" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
         <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-[15px] font-bold text-red-400">AST Memory Warning</span>
         </div>
         <p className="text-[13px] text-neutral-400">AST Node limit exceeded in <span className="text-red-300 font-mono bg-red-900/30 px-1.5 py-0.5 rounded">RepositoryAnalysisJob.cs</span>. Memory spike detected during parsing of 45k LOC.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#121212] border border-blue-900/50 rounded-xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] opacity-0 animate-fade-in-up translate-x-4" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
         <div className="flex items-center space-x-3 mb-2">
            <Pin className="w-5 h-5 text-blue-500" />
            <span className="text-[15px] font-bold text-blue-400">Database Optimization</span>
         </div>
         <p className="text-[13px] text-neutral-400">Detected excessive I/O wait in <span className="text-blue-300 font-mono bg-blue-900/30 px-1.5 py-0.5 rounded">RepositoryDbService.cs</span>. Consider batching SQLite writes.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#121212] border border-amber-900/50 rounded-xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)] opacity-0 animate-fade-in-up -translate-x-4" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
         <div className="flex items-center space-x-3 mb-2">
            <Link className="w-5 h-5 text-amber-500" />
            <span className="text-[15px] font-bold text-amber-400">High Coupling Detected</span>
         </div>
         <p className="text-[13px] text-neutral-400">Service logic is tightly coupled in <span className="text-amber-300 font-mono bg-amber-900/30 px-1.5 py-0.5 rounded">AiAnalysisService.cs</span>. Recommend introducing an abstraction layer.</p>
      </div>
    </div>
  )
}
