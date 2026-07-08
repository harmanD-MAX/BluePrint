import { Button } from "@/components/ui/button"
import { Terminal, FolderGit2 } from "lucide-react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "@/store/store"

export default function LoginPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5243/api/auth/github"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-orange" style={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px' }} />
      
      <div className="glass-card relative z-10 w-full max-w-sm rounded-2xl p-10 shadow-2xl">
        <div className="mb-8 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-2">
            <FolderGit2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Blueprint</span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-4">Sign In</h1>
          <p className="text-sm text-neutral-500">Access your repository intelligence.</p>
        </div>

        <div className="grid gap-6">
          <button
            type="button"
            className="btn-gradient-primary w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center"
            onClick={handleGithubLogin}
          >
            <Terminal className="mr-2 h-5 w-5" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
