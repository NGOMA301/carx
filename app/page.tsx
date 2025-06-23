"use client"

import { Button } from "@/components/ui/button"
import { Car, Moon, Sun, ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import Footer from "@/components/footer"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
              <Car className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-semibold text-black dark:text-white">CaX</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              // Show dashboard button if user is logged in
              <Link href="/dashboard">
                <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              // Show sign in buttons if user is not logged in
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-32 pb-20 text-center">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black dark:text-white mb-8">
            Premium
            <br />
            <span className="text-gray-400 dark:text-gray-600">Car Care</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {user
              ? `Welcome back, ${user.fullName || user.username}! Ready to book your next car service?`
              : "Professional car washing services with attention to detail. Book online and experience the difference."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {user ? (
              // Show dashboard and book service buttons if user is logged in
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base"
                  >
                    <LayoutDashboard className="mr-2 w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-3 text-base"
                  >
                    Book Service
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              // Show sign up buttons if user is not logged in
              <>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base"
                  >
                    Book Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-3 text-base"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* User Status Indicator */}
          {user && (
            <div className="mb-12">
              <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Logged in as {user.role === "admin" ? "Administrator" : "User"}
                </span>
              </div>
            </div>
          )}

          {/* Car Visual */}
          <div className="relative">
            <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-20 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-center">
                <div className="w-96 h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <Car className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Professional Service</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Expert care with premium products and attention to every detail.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Quick & Efficient</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Fast service without compromising quality. In and out quickly.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Online Booking</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Schedule your appointment online and track your service status.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
