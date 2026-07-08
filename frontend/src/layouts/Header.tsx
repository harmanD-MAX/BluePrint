import { User, Search, Menu, Command, FolderGit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { logout } from "@/store/authSlice"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state: RootState) => state.auth)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }
      try {
        const res = await fetch(`http://localhost:5243/api/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          setSearchResults(await res.json())
        }
      } catch (e) {
        console.error(e)
      }
    }
    const delay = setTimeout(fetchSearch, 300)
    return () => clearTimeout(delay)
  }, [searchQuery, token])

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 shadow-sm" style={{ background: 'rgba(8, 8, 8, 0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Button variant="ghost" size="icon" className="md:hidden ml-4 my-auto text-primary hover:bg-white/10">
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 justify-between px-4 md:px-6">
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <Input
                id="search"
                name="search"
                className="block w-full rounded-xl py-1.5 pl-10 pr-3 text-white placeholder:text-neutral-600 sm:text-sm sm:leading-6 focus:ring-1 focus:ring-orange-500/50"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                placeholder="Search repositories, files, or endpoints..."
                type="search"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
              
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50" style={{ background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                  {searchResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border-b border-border hover:bg-secondary cursor-pointer flex items-center space-x-3"
                      onClick={() => {
                        navigate(`/repositories?id=${result.repoId || result.RepoId}`)
                        setSearchQuery("")
                        setShowSearch(false)
                      }}
                    >
                      <Command className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{result.repoName || result.RepoName}</div>
                        <div className="text-xs text-muted-foreground">{result.type || result.Type} Match: {result.match || result.Match}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
                <User className="h-5 w-5 text-orange-400" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border border-border">
              <DropdownMenuLabel>My Account ({user?.name})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-500/10" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
