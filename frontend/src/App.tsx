import { Routes, Route } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import RepositoryExplorerPage from "./pages/RepositoryExplorerPage"
import AuthCallbackPage from "./pages/AuthCallbackPage"
import PrivateRoute from "./components/PrivateRoute"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/repositories" element={<RepositoryExplorerPage />} />
          <Route path="/settings" element={<div className="p-4 text-foreground">Settings Page Placeholder</div>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
