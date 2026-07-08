import { useEffect, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Code2, AlertTriangle, Network, Activity, Plus } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Button } from "@/components/ui/button"
import ImportRepositoryModal from "@/components/ImportRepositoryModal"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentRepos, setRecentRepos] = useState<any[]>([])
  const { user, token } = useSelector((state: RootState) => state.auth)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5243/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (statsRes.ok) setStats(await statsRes.json())

      const recentRes = await fetch('http://localhost:5243/api/dashboard/recent', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (recentRes.ok) setRecentRepos(await recentRes.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const chartData = useMemo(() => {
    const countsByDate: Record<string, number> = {}
    recentRepos.forEach(r => {
      const d = new Date(r.analyzedAt || r.AnalyzedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      countsByDate[d] = (countsByDate[d] || 0) + 1
    })
    

    return Object.keys(countsByDate).reverse().map(date => ({
      name: date,
      Analyzed: countsByDate[date]
    }))
  }, [recentRepos])

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700 h-full overflow-y-auto" style={{ background: '#080808' }}>
      {isImportModalOpen && <ImportRepositoryModal onClose={() => {
        setIsImportModalOpen(false)
        fetchData()
      }} />}
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-500">
            Intelligence Overview
          </h1>
          <p className="text-neutral-500 text-lg">Aggregate metrics across all parsed codebases.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome back, {user?.name}</span>
          <Button onClick={() => setIsImportModalOpen(true)} className="btn-gradient-primary rounded-xl shadow-lg transition-all text-white">
            <Plus className="mr-2 h-4 w-4" />
            Import Repository
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Analyzed Repositories", icon: Database, value: stats?.totalAnalyzed || 0, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { title: "Total Lines of Code", icon: Code2, value: (stats?.totalLinesOfCode || 0).toLocaleString(), color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { title: "Technical Debt (Smells)", icon: AlertTriangle, value: stats?.totalCodeSmells || 0, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { title: "API Endpoints Discovered", icon: Network, value: stats?.totalEndpoints || 0, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map((item, idx) => (
          <Card key={idx} className="glass-card rounded-2xl shadow-xl">
            <CardContent className="p-6 pt-8">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-4xl font-bold text-foreground">{item.value}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 glass-card rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">System Activity</h2>
        </div>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalyzed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(var(--primary), 1)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="rgba(var(--primary), 1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '15px 5px 15px 5px' }} />
                <Area type="monotone" dataKey="Analyzed" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalyzed)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full border border-dashed border-white/10 rounded-xl bg-black/20 text-lg text-muted-foreground">
              No activity recorded yet. Import your first repository!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
