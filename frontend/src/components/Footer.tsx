import { FolderGit2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto py-12 relative z-10" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <FolderGit2 className="h-3 w-3 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">Blueprint</span>
        </div>
        <p className="text-sm text-neutral-600">© {new Date().getFullYear()} Blueprint Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
