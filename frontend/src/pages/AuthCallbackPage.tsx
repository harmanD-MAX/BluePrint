import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/authSlice"

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = searchParams.get("token")
    const user = searchParams.get("user")
    const avatarUrl = searchParams.get("avatar") || undefined

    if (token && user) {
      dispatch(
        setCredentials({
          user: { id: user, email: `${user}@github.com`, name: user, avatarUrl },
          token: token,
        })
      )
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }, [searchParams, navigate, dispatch])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-muted-foreground">Authenticating...</div>
    </div>
  )
}
