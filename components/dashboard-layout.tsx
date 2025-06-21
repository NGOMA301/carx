"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Car,
  Package,
  CreditCard,
  Activity,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Home,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Cars", href: "/dashboard/cars", icon: Car },
  { name: "Packages", href: "/dashboard/packages", icon: Package },
  { name: "Services", href: "/dashboard/services", icon: Calendar },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Reports", href: "/dashboard/reports", icon: TrendingUp },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
]

const adminNavigation = [{ name: "Users", href: "/dashboard/admin/users", icon: Users }]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, sessions } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allNavigation = user?.role === "admin" ? [...navigation, ...adminNavigation] : navigation

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black shadow-xl border-r border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-black dark:text-white">CaX</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {allNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-black dark:bg-gray-900 dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-black dark:text-white">CaX</span>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-4">
            <ul className="space-y-2">
              {allNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-black dark:bg-gray-900 dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          {/* Navigation breadcrumb */}
          <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
            <nav className="hidden md:flex items-center space-x-4 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Dashboard
              </Link>
              {pathname !== "/dashboard" && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-gray-900 dark:text-white capitalize">
                    {pathname.split("/").pop()?.replace("-", " ")}
                  </span>
                </>
              )}
            </nav>
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user?.profileImage
                            ? user.profileImage.startsWith("http")
                              ? user.profileImage
                              : `${process.env.NEXT_PUBLIC_API_URI}${user.profileImage}`
                            : "/placeholder.svg"
                        }
                        alt={user?.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          className={`text-xs ${
                            user?.role === "admin"
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user?.role === "admin" ? "Admin" : "User"}
                        </Badge>
                        {user?.provider === "google" && (
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                          >
                            Google
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/sessions">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Sessions ({sessions?.length || 0})</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/activity">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>Activity Log</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
