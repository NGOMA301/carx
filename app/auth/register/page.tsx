"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Car, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { initializeGoogleAuth, signInWithGoogle } from "@/lib/google-auth"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, googleLogin, loading } = useAuth()

  useEffect(() => {
    initializeGoogleAuth().catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      await register(username, password)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const accessToken = await signInWithGoogle()
      await googleLogin(accessToken)
    } catch (err: any) {
      setError(err.message || "Google login failed")
    }
  }

  const passwordStrength = password.length >= 6 ? "strong" : password.length >= 3 ? "medium" : "weak"

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <Car className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="text-xl font-semibold text-black dark:text-white">CaX</span>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Create account</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Join CaX for premium car care</p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-300 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white bg-white dark:bg-black"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white bg-white dark:bg-black pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center space-x-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordStrength === "strong"
                        ? "bg-gray-800 dark:bg-gray-200"
                        : passwordStrength === "medium"
                          ? "bg-gray-500"
                          : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <span
                    className={`${
                      passwordStrength === "strong"
                        ? "text-gray-800 dark:text-gray-200"
                        : passwordStrength === "medium"
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white bg-white dark:bg-black pr-10"
                  placeholder="Confirm your password"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 bg-white dark:bg-black"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-black dark:text-white hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
