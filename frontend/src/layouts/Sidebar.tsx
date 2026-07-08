import { NavLink, useSearchParams, useLocation } from "react-router-dom"
import { Home, FolderGit2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function Sidebar() {
  const [recentRepos, setRecentRepos] = useState<any[]>([])
  const { token } = useSelector((state: RootState) => state.auth)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentRepoId = searchParams.get("id")

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('http://localhost:5243/api/dashboard/recent', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) setRecentRepos(await res.json())
      } catch (e) {
        console.error(e)
      }
    }
    fetchRecent()
  }, [token])

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col" style={{
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      <div className="flex h-16 items-center px-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <NavLink to="/" className="flex items-center">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <FolderGit2 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="ml-2.5 text-lg font-bold text-white tracking-tight">Blueprint</span>
        </NavLink>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-6">
          <ul role="list" className="-mx-2 space-y-1">
            {mainLinks.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all ${
                      isActive
                        ? "text-white border border-white/[0.08]"
                        : "text-neutral-500 hover:text-white border border-transparent"
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    background: 'rgba(255, 255, 255, 0.05)',
                  } : {}}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div>
             <div className="text-xs font-semibold leading-6 text-neutral-600 uppercase tracking-wider mb-2 px-1">
               Repositories
             </div>
             <ul role="list" className="-mx-2 space-y-1">
               {recentRepos.length === 0 ? (
                 <li className="px-3 py-2 text-sm text-neutral-600 italic">No repositories yet.</li>
               ) : (
                 recentRepos.map((r) => (
                   <li key={r.id || r.Id}>
                     <NavLink
                       to={`/repositories?id=${r.id || r.Id}`}
                       className={() =>
                         `group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all ${
                           location.pathname === "/repositories" && currentRepoId === (r.id || r.Id)
                             ? "text-orange-400 border border-orange-500/20"
                             : "text-neutral-500 hover:text-white border border-transparent"
                         }`
                       }
                       style={() => location.pathname === "/repositories" && currentRepoId === (r.id || r.Id) ? {
                         background: 'rgba(255, 107, 53, 0.08)',
                       } : {}}
                     >
                       <FolderGit2 className="h-4 w-4 shrink-0 mt-1" aria-hidden="true" />
                       <span className="truncate">{r.name || r.Name}</span>
                     </NavLink>
                   </li>
                 ))
               )}
             </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
