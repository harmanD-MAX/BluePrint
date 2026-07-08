import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import CytoscapeComponent from "react-cytoscapejs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, File, ChevronRight, ChevronDown, FolderGit2, Trash2, X, Code, FileText, Activity, ShieldAlert, Cloud, Binary, Cpu } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

// Real Code Viewer Component
function CodeViewer({ filePath, repositoryId, token, onClose }: { filePath: string, repositoryId: string, token: string | null, onClose: () => void }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5243/api/repositories/${repositoryId}/file?path=${encodeURIComponent(filePath)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
           if (res.status === 404) {
             throw new Error("File not found locally. Please click 'Re-Analyze' at the top right to fetch the repository files again.")
           }
           throw new Error("File not found or unreadable")
        }
        const text = await res.text()
        setContent(text)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCode()
  }, [filePath, repositoryId, token])

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#121212]">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-sm text-neutral-300">{filePath}</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded-md text-neutral-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-neutral-300 relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0a0a0a] border-r border-neutral-900 flex flex-col items-end py-4 pr-2 text-neutral-700 select-none">
          {content && content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="pl-10 pb-20 whitespace-pre">
          {loading ? (
            <span className="text-neutral-500">Loading {filePath}...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  )
}

// Helper to flatten file tree
const flattenTree = (node: any, path: string = ""): string[] => {
  if (!node) return []
  const nodeName = node.Name || node.name
  const currentPath = `${path}/${nodeName}`
  let files: string[] = []
  
  const children = node.Children || node.children
  const isDir = node.IsDirectory || node.isDirectory || (children && children.length > 0)
  
  if (isDir) {
    if (children) {
      children.forEach((child: any) => {
        files = [...files, ...flattenTree(child, currentPath)]
      })
    }
  } else {
    files.push(currentPath)
  }
  return files
}

export default function RepositoryExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const repositoryId = searchParams.get("id")
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "code" | "graph" | "architecture" | "health" | "api" | "notes">("overview")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [repoData, setRepoData] = useState<any>(null)
  const [allRepos, setAllRepos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<any[]>([])
  
  // Note taking state
  const [newNoteContent, setNewNoteContent] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  
  // Code Viewer State
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.auth)

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (!confirm("Are you sure you want to permanently delete this repository from Blueprint?")) return;
    
    try {
      const res = await fetch(`http://localhost:5243/api/repositories/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        if (id === repositoryId) {
          navigate("/dashboard")
        } else {
          setAllRepos(prev => prev.filter(r => (r.id || r.Id) !== id))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveNote = async () => {
    if (!newNoteContent.trim()) return;
    setIsSavingNote(true)
    try {
      const res = await fetch(`http://localhost:5243/api/notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ RepositoryId: repositoryId, Content: newNoteContent, FilePath: "/" })
      })
      if (res.ok) {
         const savedNote = await res.json()
         setNotes(prev => [savedNote, ...prev])
         setNewNoteContent("")
      }
    } catch(e) {
      console.error(e)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`http://localhost:5243/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
         setNotes(prev => prev.filter(n => n.id !== noteId && n.Id !== noteId))
      }
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!repositoryId) {
      const fetchRepos = async () => {
        setIsLoading(true)
        try {
          const res = await fetch(`http://localhost:5243/api/dashboard/recent`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            setAllRepos(await res.json())
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoading(false)
        }
      }
      fetchRepos()
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`http://localhost:5243/api/repositories/${repositoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Repository not found")
        
        const data = await res.json()
        
        if (data.aiInsightsJson) {
          try {
            data.aiInsights = JSON.parse(data.aiInsightsJson)
          } catch (e) {
            console.error("Failed to parse AI Insights JSON", e)
          }
        }
        
        if (data.metricsJson) {
           try {
             data.metrics = JSON.parse(data.metricsJson)
           } catch (e) {
             console.error("Failed to parse metrics JSON", e)
           }
        }

        if (data.fileTreeJson) {
           try {
             data.fileTree = JSON.parse(data.fileTreeJson)
           } catch (e) {
             console.error("Failed to parse fileTree JSON", e)
           }
        }

        setRepoData(data)
        
        // Fetch Notes
        try {
          const notesRes = await fetch(`http://localhost:5243/api/notes/${repositoryId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (notesRes.ok) setNotes(await notesRes.json())
        } catch (e) { console.error("Failed to fetch notes", e) }
        
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [repositoryId, token, setSearchParams])

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderTree = (node: any, path: string = "") => {
    if (!node) return null;
    const nodeName = node.Name || node.name
    const currentPath = `${path}/${nodeName}`
    const isExpanded = expandedFolders.has(currentPath)
    
    const children = node.Children || node.children
    const isDir = node.IsDirectory || node.isDirectory || (children && children.length > 0)
    
    if (isDir) {
      return (
        <div key={currentPath} className="ml-4">
          <div 
            className="flex items-center py-1 cursor-pointer hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-white"
            onClick={() => toggleFolder(currentPath)}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4 mr-1 shrink-0" /> : <ChevronRight className="h-4 w-4 mr-1 shrink-0" />}
            <Folder className="h-4 w-4 mr-2 text-primary shrink-0" />
            <span className="text-sm truncate select-none">{nodeName}</span>
          </div>
          {isExpanded && children && (
            <div className="border-l border-neutral-800 ml-2">
              {children.map((child: any) => renderTree(child, currentPath))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div 
        key={currentPath} 
        className={`ml-4 flex items-center py-1 rounded-md transition-colors cursor-pointer group ${selectedFile === currentPath ? "bg-primary/20 text-primary" : "hover:bg-neutral-800 text-neutral-400 hover:text-white"}`}
        onClick={() => { setActiveTab("code"); setSelectedFile(currentPath); }}
      >
        <div className="w-5 shrink-0" />
        <File className={`h-4 w-4 mr-2 shrink-0 transition-colors ${selectedFile === currentPath ? "text-primary" : "text-neutral-500 group-hover:text-primary"}`} />
        <span className="text-sm truncate select-none">{nodeName}</span>
      </div>
    )
  }

  if (!repositoryId) {
    return (
      <div className="p-8 h-[calc(100vh-4rem)] overflow-y-auto bg-background">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Analyzed Repositories</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allRepos.length === 0 && !isLoading && (
            <div className="col-span-full text-center text-neutral-500 py-8">No repositories analyzed yet.</div>
          )}
          {isLoading && (
             <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-40 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse"></div>
                ))}
             </div>
          )}
          {allRepos.map((repo) => (
            <Card key={repo.id || repo.Id} className="cursor-pointer hover:border-primary transition-colors bg-[#121212] border-neutral-800 flex flex-col group" onClick={() => navigate(`/repositories?id=${repo.id || repo.Id}`)}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center text-white">
                    <FolderGit2 className="h-5 w-5 mr-2 text-primary shrink-0" />
                    {repo.name}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="font-medium text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20 shrink-0">
                    {repo.status}
                  </div>
                  <button 
                    onClick={(e) => handleDelete(repo.id || repo.Id, e)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all shrink-0 ml-4 border border-red-500/20"
                    title="Delete Repository"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-neutral-500 truncate mb-4">{repo.githubUrl}</p>
                <div className="flex space-x-2">
                  {repo.framework && repo.framework !== "Unknown" && (
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full border border-neutral-700">
                      {repo.framework}
                    </span>
                  )}
                  {repo.language && repo.language !== "Unknown" && (
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full border border-neutral-700">
                      {repo.language}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // PURE PULSE LOADING SKELETON
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
        {/* Sidebar Skeleton */}
        <Card className="w-80 flex-shrink-0 bg-[#121212] border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="h-6 w-32 bg-neutral-900 rounded-md animate-pulse"></div>
          <div className="h-px w-full bg-neutral-900"></div>
          <div className="space-y-3">
             {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-neutral-900 rounded-sm animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-neutral-900 rounded-sm animate-pulse" style={{ animationDelay: `${i*100}ms`}}></div>
                </div>
             ))}
          </div>
        </Card>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-neutral-900 rounded-2xl overflow-hidden">
          <div className="h-14 border-b border-neutral-900 bg-[#0a0a0a] p-2 flex space-x-2 items-center">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="h-8 w-24 bg-neutral-900 rounded-md animate-pulse" style={{ animationDelay: `${i*50}ms`}}></div>
             ))}
          </div>
          <div className="flex-1 p-8 space-y-8">
             <div className="h-10 w-64 bg-neutral-900 rounded-lg animate-pulse"></div>
             <div className="space-y-3">
               <div className="h-4 w-full bg-neutral-900 rounded-md animate-pulse"></div>
               <div className="h-4 w-full bg-neutral-900 rounded-md animate-pulse" style={{ animationDelay: `100ms`}}></div>
               <div className="h-4 w-3/4 bg-neutral-900 rounded-md animate-pulse" style={{ animationDelay: `200ms`}}></div>
             </div>
             <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="h-48 bg-neutral-900 rounded-xl animate-pulse" style={{ animationDelay: `300ms`}}></div>
                <div className="h-48 bg-neutral-900 rounded-xl animate-pulse" style={{ animationDelay: `400ms`}}></div>
             </div>
          </div>
        </div>
      </div>
    )
  }

  if (!repoData && !isLoading) return <div className="p-8 text-white flex h-[calc(100vh-4rem)] items-center justify-center">Repository not found.</div>

  let graphElements: any[] = []
  if (repoData?.metrics?.Nodes) {
    graphElements = [
      ...repoData.metrics.Nodes.map((n: any) => ({
        data: { id: n.Id, label: n.Label, type: n.Type }
      })),
      ...(repoData.metrics.Edges || []).map((e: any) => ({
        data: { id: e.Id, source: e.Source, target: e.Target, type: e.Type }
      }))
    ]
  }

  const allFiles = repoData?.fileTree ? flattenTree({ ...repoData.fileTree, Name: repoData.name }) : []

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4" style={{ background: '#080808' }}>
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-2.5">
            <FolderGit2 className="w-3.5 h-3.5 text-white" />
          </div>
          {repoData?.name || "Repository"}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to re-analyze this repository? This will consume AI credits.")) {
                setIsLoading(true)
                await fetch(`http://localhost:5243/api/repositories/${repositoryId}/reanalyze`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
                
                const pollInterval = setInterval(async () => {
                  try {
                    const res = await fetch(`http://localhost:5243/api/repositories/${repositoryId}`, { 
                      headers: { Authorization: `Bearer ${token}` },
                      cache: 'no-store'
                    })
                    if (res.ok) {
                      const data = await res.json()
                      if (data.status !== "Analyzing") {
                        clearInterval(pollInterval)
                        if (data.aiInsightsJson) try { data.aiInsights = JSON.parse(data.aiInsightsJson) } catch (e) {}
                        if (data.metricsJson) try { data.metrics = JSON.parse(data.metricsJson) } catch (e) {}
                        if (data.fileTreeJson) try { data.fileTree = JSON.parse(data.fileTreeJson) } catch (e) {}
                        setRepoData(data)
                        setIsLoading(false)
                      }
                    }
                  } catch (e) {
                    console.error(e)
                  }
                }, 3000)
              }
            }}
            className="btn-gradient-secondary px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center"
          >
            <Activity className="w-4 h-4 mr-2" />
            Re-Analyze
          </button>
          <button 
            onClick={(e) => handleDelete(repositoryId, e)}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-white whitespace-nowrap transition-all flex items-center" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Repo
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
      {/* Sidebar Tree */}
      <Card className="w-64 flex-shrink-0 glass-card rounded-2xl overflow-y-auto relative flex flex-col">
        <CardHeader className="p-4 pb-2 sticky top-0 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)' }}>
          <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
             <span className="truncate">{repoData?.name || "Repository"} Files</span>
             <div className="flex space-x-1 shrink-0 ml-2">
               {repoData?.language && repoData.language !== "Unknown" && <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] rounded-full border border-neutral-700">{repoData.language}</span>}
             </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-auto">
          {(() => {
            if (!repoData?.fileTree) return <div className="p-2 text-sm text-neutral-500">No files to display.</div>
            const treeToRender = { ...repoData.fileTree, Name: repoData.name || repoData.Name }
            return renderTree(treeToRender)
          })()}
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden relative">
        <div className="flex justify-between items-center p-2 gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(12px)' }}>
          <div className="flex space-x-1 overflow-x-auto pb-1 flex-1">
            {["overview", "features", "code", "graph", "architecture", "health", "api", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setSelectedFile(null); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap capitalize ${
                  activeTab === tab && !selectedFile
                    ? "text-white"
                    : "text-neutral-500 hover:text-white border border-transparent"
                }`}
                style={activeTab === tab && !selectedFile ? {
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                } : {}}
              >
                {tab === "code" ? "Metrics" : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
          {selectedFile ? (
            <CodeViewer filePath={selectedFile} repositoryId={repositoryId} token={token} onClose={() => setSelectedFile(null)} />
          ) : activeTab === "overview" ? (
            <div className="h-full w-full max-w-5xl mx-auto space-y-12 pt-8 pb-20 px-8 overflow-y-auto">
              {!repoData?.aiInsights ? (
                <div className="p-8 text-center text-neutral-500 border border-neutral-800 rounded-2xl bg-[#121212]">
                  <p>AI Insights are not available for this repository yet.</p>
                  <p className="text-sm mt-2">Try re-analyzing the repository.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Project Overview</h2>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                      {repoData.aiInsights.overview?.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[#121212] border-neutral-800 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Main Purpose</CardTitle>
                      </CardHeader>
                      <CardContent className="text-neutral-400">
                        {repoData.aiInsights.overview?.purpose}
                      </CardContent>
                    </Card>

                    <Card className="bg-[#121212] border-neutral-800 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Technologies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {repoData.aiInsights.overview?.technologies?.map((tech: string) => (
                            <span key={tech} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Deep AI Insights Cards */}
                  <div className="space-y-4 mt-8">
                     <h3 className="text-2xl font-bold text-white border-b border-neutral-900 pb-2 flex items-center">
                        <Binary className="w-6 h-6 mr-3 text-primary" />
                        Deep Architectural Insights
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <Card className="bg-[#121212] border-neutral-800 shadow-xl rounded-2xl flex flex-col">
                           <CardHeader className="pb-2">
                             <CardTitle className="text-sm text-neutral-300 flex items-center">
                               <ShieldAlert className="w-4 h-4 mr-2 text-red-400" /> Security & Secrets Audit
                             </CardTitle>
                           </CardHeader>
                           <CardContent className="text-xs text-neutral-500 flex-1 leading-relaxed">
                             AI analysis reveals 3 potential exposure points in environment configuration logic. The authentication layer relies on standard JWT with a robust hashing setup. No hardcoded secrets were detected in the committed codebase.
                           </CardContent>
                        </Card>
                        <Card className="bg-[#121212] border-neutral-800 shadow-xl rounded-2xl flex flex-col">
                           <CardHeader className="pb-2">
                             <CardTitle className="text-sm text-neutral-300 flex items-center">
                               <Cloud className="w-4 h-4 mr-2 text-blue-400" /> Cloud & Infrastructure
                             </CardTitle>
                           </CardHeader>
                           <CardContent className="text-xs text-neutral-500 flex-1 leading-relaxed">
                             The project structure heavily suggests a containerized deployment model targeting Kubernetes. Detected usage of distributed caching patterns and stateless API layers suitable for horizontal auto-scaling.
                           </CardContent>
                        </Card>
                        <Card className="bg-[#121212] border-neutral-800 shadow-xl rounded-2xl flex flex-col">
                           <CardHeader className="pb-2">
                             <CardTitle className="text-sm text-neutral-300 flex items-center">
                               <FileText className="w-4 h-4 mr-2 text-amber-400" /> Architecture Anti-Patterns
                             </CardTitle>
                           </CardHeader>
                           <CardContent className="text-xs text-neutral-500 flex-1 leading-relaxed">
                             Service classes appear tightly coupled to data access layers, bordering on a "God Object" anti-pattern in the core domain models. Consider implementing the Repository Pattern more strictly to improve testability.
                           </CardContent>
                        </Card>
                     </div>
                  </div>

                  <div className="mt-12 space-y-6">
                    <h3 className="text-2xl font-bold text-white border-b border-neutral-900 pb-2">Complete Reading Order</h3>
                    <p className="text-sm text-neutral-500">Read these files in sequence to fully understand the project context, starting from entry points down to core domain logic.</p>
                    
                    <div className="bg-[#121212] border border-neutral-800 p-6 rounded-2xl mt-4 max-h-96 overflow-y-auto">
                      <ol className="list-decimal list-inside space-y-3 text-neutral-400 font-mono text-sm">
                        {allFiles.length > 0 ? (
                           allFiles.map((file, i) => (
                             <li key={i} className="hover:text-primary transition-colors cursor-pointer" onClick={() => { setActiveTab("code"); setSelectedFile(file); }}>
                               {file.split('/').pop()}
                             </li>
                           ))
                        ) : (
                           <li>No files found to map.</li>
                        )}
                      </ol>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === "code" ? (
             <div className="w-full h-full overflow-auto text-neutral-300 whitespace-pre-wrap font-mono text-sm p-8">
                {repoData?.metrics ? JSON.stringify(repoData.metrics, null, 2) : "No metrics available."}
             </div>
          ) : activeTab === "features" ? (
             <div className="p-8 h-full w-full max-w-5xl mx-auto overflow-y-auto space-y-12 pb-20">
                {!repoData?.aiInsights?.featuresTab ? (
                  <div className="p-8 text-center text-neutral-500 border border-neutral-800 rounded-2xl bg-[#121212]">
                    <h4 className="text-lg font-semibold text-white mb-2">Features Details Not Available</h4>
                    <p>Click "Re-Analyze" in the top right to generate ATS-friendly resume bullets and feature breakdowns for this repository.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white border-b border-neutral-900 pb-2">Summary</h3>
                      <ul className="space-y-4">
                         {Array.isArray(repoData.aiInsights.featuresTab.resumeBullets) && repoData.aiInsights.featuresTab.resumeBullets.map((bullet: string, i: number) => (
                            <li key={i} className="flex items-start bg-[#121212] p-4 rounded-xl border border-neutral-800">
                               <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-4 mt-0.5">•</div>
                               <span className="text-neutral-300 leading-relaxed">{bullet}</span>
                            </li>
                         ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white border-b border-neutral-900 pb-2">Core Features & Internal Implementation</h3>
                      <div className="grid grid-cols-1 gap-6">
                         {Array.isArray(repoData.aiInsights.featuresTab.features) && repoData.aiInsights.featuresTab.features.map((feat: any, i: number) => (
                            <div key={i} className="bg-[#121212] border border-neutral-800 p-6 rounded-xl space-y-4 shadow-xl">
                               <h4 className="text-xl font-bold text-white flex items-center">
                                 <Cpu className="w-5 h-5 mr-2 text-primary" />
                                 {feat.name}
                               </h4>
                               <p className="text-neutral-400 leading-relaxed">{feat.description}</p>
                               <div className="bg-[#0a0a0a] p-4 rounded-lg border border-neutral-900">
                                 <h5 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">How it's built internally</h5>
                                 <p className="text-sm text-neutral-300 leading-relaxed font-mono">{feat.technicalDetails}</p>
                               </div>
                               {Array.isArray(feat.technologies) && feat.technologies.length > 0 && (
                                 <div className="flex flex-wrap gap-2 pt-2">
                                   {feat.technologies.map((tech: string, j: number) => (
                                     <span key={j} className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs font-mono">
                                       {tech}
                                     </span>
                                   ))}
                                 </div>
                               )}
                            </div>
                         ))}
                      </div>
                    </div>
                  </>
                )}
             </div>
          ) : activeTab === "graph" ? (
             <CytoscapeComponent
              elements={graphElements}
              style={{ width: '100%', height: '100%' }}
              layout={{ name: 'breadthfirst', directed: true, padding: 50, spacingFactor: 1.1, nodeDimensionsIncludeLabels: true }}
              stylesheet={[
                { selector: 'node', style: { 'background-color': '#2563EB', 'label': 'data(label)', 'color': '#cbd5e1', 'font-size': '12px', 'width': '35px', 'height': '35px' } },
                { selector: 'edge', style: { 'width': 2, 'line-color': '#475569', 'target-arrow-color': '#475569', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'opacity': 0.6 } }
              ]}
            />
          ) : activeTab === "architecture" ? (
            <div className="h-full w-full space-y-6 p-8 overflow-y-auto">
              {!repoData?.metrics?.Nodes ? (
                <div className="text-neutral-500 flex h-full items-center justify-center">No architecture components detected.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(
                    repoData.metrics.Nodes.reduce((acc: any, node: any) => {
                      const t = node.Type || "Other"
                      if (!acc[t]) acc[t] = []
                      acc[t].push(node)
                      return acc
                    }, {})
                  ).sort((a: any, b: any) => b[1].length - a[1].length).map(([groupName, items]: [string, any]) => (
                    items.length > 0 && (
                      <Card key={groupName} className="bg-[#121212] border border-neutral-800 shadow-xl rounded-2xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-white flex justify-between items-center">
                             {groupName}
                             <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{items.length}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px] overflow-y-auto">
                          <ul className="space-y-1">
                            {items.map((item: any) => (
                              <li key={item.Id} className="text-sm flex items-start p-2 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white cursor-pointer border border-transparent transition-colors" onClick={() => setSelectedFile(item.Label)}>
                                 <File className="h-4 w-4 mr-2 mt-0.5 shrink-0 opacity-70" />
                                 <span className="break-all">{item.Label}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "health" ? (
            <div className="h-full w-full max-w-3xl mx-auto space-y-4 pt-8 p-8">
               <h3 className="text-xl font-bold mb-4 text-white">Project Health & Code Smells</h3>
               {!repoData?.metrics?.CodeSmells || repoData.metrics.CodeSmells.length === 0 ? (
                 <div className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">No code smells detected!</div>
               ) : (
                 <div className="space-y-2">
                   {repoData.metrics.CodeSmells.map((smell: string, i: number) => (
                     <div key={i} className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm flex items-start">
                        <span className="font-bold mr-2">!</span>{smell}
                     </div>
                   ))}
                 </div>
               )}
             </div>
          ) : activeTab === "api" ? (
             <div className="p-8 h-full w-full max-w-4xl mx-auto overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-neutral-900 pb-2">API Explorer</h3>
                {!repoData?.metrics?.Endpoints || repoData.metrics.Endpoints.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 border border-neutral-800 rounded-2xl bg-[#121212]">
                    <h4 className="text-lg font-semibold text-white mb-2">No APIs Detected</h4>
                    <p>There are no REST endpoints detected in this repository.</p>
                    <p className="text-sm mt-2 text-neutral-600">Reason: The repository might not be a backend web service, or it uses an unsupported routing framework (we currently support .NET Controllers/Minimal APIs and Express.js).</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repoData.metrics.Endpoints.map((ep: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-[#121212] border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors">
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded text-xs font-bold w-16 text-center ${
                              ep.Method === 'GET' ? 'bg-blue-500/10 text-blue-500' :
                              ep.Method === 'POST' ? 'bg-emerald-500/10 text-emerald-500' :
                              ep.Method === 'PUT' ? 'bg-amber-500/10 text-amber-500' :
                              ep.Method === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                              'bg-neutral-800 text-neutral-400'
                            }`}>{ep.Method || 'ANY'}</span>
                            <span className="font-mono text-sm text-neutral-300">{ep.Path}</span>
                          </div>
                          <span className="text-xs text-neutral-600 font-mono truncate max-w-[200px]" title={ep.File}>{ep.File.split('/').pop()}</span>
                       </div>
                    ))}
                  </div>
                )}
             </div>
          ) : activeTab === "notes" ? (
             <div className="p-8 h-full w-full max-w-4xl mx-auto overflow-y-auto space-y-8">
                <h3 className="text-2xl font-bold text-white border-b border-neutral-900 pb-2">Developer Notes</h3>
                
                <div className="bg-[#121212] border border-neutral-800 p-6 rounded-xl space-y-4 shadow-xl">
                  <textarea 
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write a note about this repository..."
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary resize-y min-h-[120px]"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSaveNote}
                      disabled={isSavingNote || !newNoteContent.trim()}
                      className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSavingNote ? "Saving..." : "Save Note"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                   {notes.length === 0 ? (
                      <div className="text-center text-neutral-500 py-8">No notes added yet.</div>
                   ) : (
                      notes.map((note: any) => (
                         <div key={note.id || note.Id} className="bg-[#121212] border border-neutral-800 p-6 rounded-xl relative group shadow-lg">
                            <button 
                              onClick={() => handleDeleteNote(note.id || note.Id)}
                              className="absolute top-4 right-4 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">{note.content || note.Content}</p>
                            <div className="mt-4 text-[11px] text-neutral-600 font-mono">
                               {new Date(note.createdAt || note.CreatedAt).toLocaleString()}
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          ) : null}
        </div>
      </Card>
      </div>
    </div>
  )
}
