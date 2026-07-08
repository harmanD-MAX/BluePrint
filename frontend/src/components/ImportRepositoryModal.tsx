import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as signalR from "@microsoft/signalr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Terminal } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface ImportRepositoryModalProps {
  onClose: () => void;
}

export default function ImportRepositoryModal({ onClose }: ImportRepositoryModalProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [url, setUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [status, setStatus] = useState("")
  const [completedRepoId, setCompletedRepoId] = useState<string | null>(null)
  const navigate = useNavigate()

  const [importMode, setImportMode] = useState<"url" | "username">("url")
  const [userRepos, setUserRepos] = useState<any[]>([])
  const [isFetchingRepos, setIsFetchingRepos] = useState(false)

  const handleFetchUserRepos = async () => {
    const githubUsername = user?.name
    if (!githubUsername) return
    setIsFetchingRepos(true)
    setStatus("")
    try {
      const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&type=owner`)
      if (res.ok) {
        const data = await res.json()
        setUserRepos(data)
      } else {
        setUserRepos([])
        setStatus("Failed to fetch user repositories")
      }
    } catch (e) {
      setUserRepos([])
      setStatus("Error fetching repositories")
    } finally {
      setIsFetchingRepos(false)
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsImporting(true)
    setStatus("Initiating import...")
    
    try {
      const response = await fetch("http://localhost:5243/api/repositories/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: url })
      })

      if (!response.ok) throw new Error("Import failed")
      
      const data = await response.json()
      setStatus(`Connecting to live updates...`)
      
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5243/hubs/analysis")
        .withAutomaticReconnect()
        .build();

      connection.on("AnalysisProgress", (repoId: string, repoStatus: string, percentage: number, message: string) => {
        setStatus(`[${percentage}%] ${message}`);
        if (percentage >= 100) {
             connection.stop();
             setIsImporting(false);
             setCompletedRepoId(repoId);
        }
      });

      await connection.start();
      await connection.invoke("SubscribeToRepository", data.repositoryId);
      
    } catch (error) {
      console.error(error)
      setStatus("Failed to import. Is the backend running?")
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Import Repository</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start the intelligence analysis of a public GitHub repository.
          </p>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <div className="flex gap-2 p-1 bg-secondary rounded-lg">
            <button 
              type="button" 
              onClick={() => { setImportMode("url"); setUrl(""); setUserRepos([]); setStatus(""); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${importMode === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              By URL
            </button>
            <button 
              type="button" 
              onClick={() => { setImportMode("username"); setUrl(""); setStatus(""); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${importMode === "username" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              My Repositories
            </button>
          </div>

          {importMode === "url" ? (
            <div className="space-y-2">
              <Input
                id="github-url"
                placeholder="https://github.com/facebook/react"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isImporting}
                className="bg-background/50 focus:bg-background"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {userRepos.length === 0 ? (
                <div className="flex justify-center py-2">
                  <Button type="button" onClick={handleFetchUserRepos} disabled={isImporting || isFetchingRepos} variant="secondary" className="w-full">
                    {isFetchingRepos ? "Fetching..." : `Load Repositories for ${user?.name}`}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isImporting}
                  >
                    <option value="">Select a repository to import...</option>
                    {userRepos.map(r => (
                      <option key={r.id} value={r.html_url}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          
          {status && (
            <p className="text-sm text-primary text-center">{status}</p>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            {!completedRepoId ? (
              <>
                <Button variant="outline" type="button" onClick={onClose} disabled={isImporting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!url || isImporting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isImporting ? "Importing..." : "Start Analysis"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" type="button" onClick={onClose}>
                  Close
                </Button>
                <Button type="button" onClick={() => { onClose(); navigate(`/repositories?id=${completedRepoId}`) }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Breakdown
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
