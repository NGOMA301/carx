"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingOverlay } from "@/components/loading-spinner"
import { Users, Mail, Calendar, Shield, User } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface UserData {
  _id: string
  username: string
  email?: string
  fullName?: string
  profileImage?: string
  role: "user" | "admin"
  provider: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/auth/admin/users")
      setUsers(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage all registered users in the system</p>
        </div>

        <LoadingOverlay loading={loading}>
          {users.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">No registered users in the system yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((userData) => (
                <Card key={userData._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.username} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                          {userData.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                          {userData.fullName || userData.username}
                        </CardTitle>
                        <CardDescription>@{userData.username}</CardDescription>
                      </div>
                      <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                        {userData.role === "admin" ? (
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>User</span>
                          </div>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userData.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{userData.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge
                          variant="outline"
                          className={
                            userData.provider === "google"
                              ? "border-red-200 text-red-700"
                              : "border-blue-200 text-blue-700"
                          }
                        >
                          {userData.provider === "google" ? "Google" : "Local"}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">ID: {userData._id.slice(-6)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </LoadingOverlay>
      </div>
    </DashboardLayout>
  )
}
