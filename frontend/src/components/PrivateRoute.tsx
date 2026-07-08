import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import type { RootState } from "@/store/store"

export default function PrivateRoute() {
  const { token, user } = useSelector((state: RootState) => state.auth)

  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
