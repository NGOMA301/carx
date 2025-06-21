"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  username: string
  email?: string
  fullName?: string
  profileImage?: string
  role: "user" | "admin"
  provider?: string
}

interface Session {
  _id: string
  sessionId: string
  ip: string
  location: string
  userAgent: string
  device: string
  platform: string
  browser: string
  createdAt: string
  lastActivity: string
}

interface AuthContextType {
  user: User | null
  sessions: Session[]
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  logout: () => Promise<void>
  logoutSession: (sessionId: string) => Promise<void>
  logoutAllSessions: () => Promise<void>
  updateProfile: (data: FormData) => Promise<void>
  fetchSessions: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
axios.defaults.withCredentials = true

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/me")
      setUser(response.data)
      await fetchSessions()
    } catch (error) {
      setUser(null)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await axios.get("/auth/sessions")
      setSessions(response.data)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    }
  }

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      await axios.post("/auth/login", { username, password })
      await checkAuth()
      router.push("/dashboard")
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string) => {
    setLoading(true)
    try {
      await axios.post("/auth/register", { username, password })
      await checkAuth()
      router.push("/dashboard")
      toast({
        title: "Success",
        description: "Account created successfully",
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (credential: string) => {
    setLoading(true)
    try {
      await axios.post("/auth/login/google", { credential })
      await checkAuth()
      router.push("/dashboard")
      toast({
        title: "Success",
        description: "Logged in with Google successfully",
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await axios.post("/auth/logout")
      setUser(null)
      setSessions([])
      router.push("/")
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const logoutSession = async (sessionId: string) => {
    try {
      await axios.delete(`/auth/sessions/${sessionId}`)
      await fetchSessions()
      toast({
        title: "Success",
        description: "Logged out from session successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to logout from session",
        variant: "destructive",
      })
    }
  }

  const logoutAllSessions = async () => {
    try {
      await axios.delete("/auth/sessions-all")
      setUser(null)
      setSessions([])
      router.push("/")
      toast({
        title: "Success",
        description: "Logged out from all sessions",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to logout from all sessions",
        variant: "destructive",
      })
    }
  }

  const updateProfile = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await axios.put("/auth/edit-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUser(response.data.user)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sessions,
        loading,
        login,
        register,
        googleLogin,
        logout,
        logoutSession,
        logoutAllSessions,
        updateProfile,
        fetchSessions,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
