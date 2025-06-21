"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  username: string
  email?: string
  fullName?: string
  profileImage?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: FormData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
axios.defaults.withCredentials = true

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/me")
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      await axios.post("/auth/login", { username, password })
      await checkAuth()
      router.push("/dashboard")
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
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await axios.put("/auth/edit-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUser(response.data.user)
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
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
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
