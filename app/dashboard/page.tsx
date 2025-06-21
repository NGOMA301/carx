"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Car, Package, CreditCard, Activity, Users, TrendingUp, Calendar, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/dashboard-layout"
import Footer from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"

interface DashboardStats {
  totalCars: number
  totalPackages: number
  totalPayments: number
  totalUsers?: number
  recentActivities: any[]
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      const [carsRes, packagesRes, paymentsRes, activitiesRes] = await Promise.all([
        axios.get("/car"),
        axios.get("/package"),
        axios.get("/payment"),
        axios.get("/activities"),
      ])

      let usersRes = null
      if (user?.role === "admin") {
        usersRes = await axios.get("/auth/admin/users")
      }

      setStats({
        totalCars: carsRes.data.length,
        totalPackages: packagesRes.data.length,
        totalPayments: paymentsRes.data.length,
        totalUsers: usersRes?.data.length,
        recentActivities: activitiesRes.data.slice(0, 5),
      })
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="min-h-full bg-white dark:bg-black">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-black dark:text-white">
                    Welcome back, {user?.fullName || user?.username}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Here's what's happening with your car wash business today.
                  </p>
                </div>
                <Badge
                  variant={user?.role === "admin" ? "default" : "secondary"}
                  className={`text-sm ${
                    user?.role === "admin"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {user?.role === "admin" ? "Administrator" : "User"}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link href="/dashboard/cars">
                <Button className="w-full h-20 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black flex flex-col items-center justify-center space-y-2">
                  <Car className="w-6 h-6" />
                  <span className="text-sm">Manage Cars</span>
                </Button>
              </Link>
              <Link href="/dashboard/packages">
                <Button className="w-full h-20 bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black flex flex-col items-center justify-center space-y-2">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">Packages</span>
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button className="w-full h-20 bg-gray-700 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-white dark:text-black flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Services</span>
                </Button>
              </Link>
              <Link href="/dashboard/payments">
                <Button className="w-full h-20 bg-gray-600 hover:bg-gray-500 dark:bg-gray-400 dark:hover:bg-gray-500 text-white dark:text-black flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm">Payments</span>
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {statsLoading ? <LoadingSpinner size="sm" /> : stats?.totalCars || 0}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Registered vehicles</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Service Packages
                  </CardTitle>
                  <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {statsLoading ? <LoadingSpinner size="sm" /> : stats?.totalPackages || 0}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Available packages</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {statsLoading ? <LoadingSpinner size="sm" /> : stats?.totalPayments || 0}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completed transactions</p>
                </CardContent>
              </Card>

              {user?.role === "admin" && (
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {statsLoading ? <LoadingSpinner size="sm" /> : stats?.totalUsers || 0}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Registered users</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-black dark:text-white">Recent Activity</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your latest actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size="md" />
                    </div>
                  ) : stats?.recentActivities.length ? (
                    <div className="space-y-4">
                      {stats.recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                        >
                          <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm text-black dark:text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent activity</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-black dark:text-white">Quick Stats</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-black dark:text-white">Service Rating</span>
                      </div>
                      <span className="text-lg font-bold text-black dark:text-white">4.9/5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-black dark:text-white">This Month</span>
                      </div>
                      <span className="text-lg font-bold text-black dark:text-white">
                        {stats?.totalPayments || 0} services
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-black dark:text-white">Growth</span>
                      </div>
                      <span className="text-lg font-bold text-black dark:text-white">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </DashboardLayout>
    </AuthGuard>
  )
}
