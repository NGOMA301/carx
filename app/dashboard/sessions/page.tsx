"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, LogOut, Shield, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Footer from "@/components/footer"

export default function SessionsPage() {
  const { sessions, fetchSessions, logoutSession, logoutAllSessions, loading } = useAuth()
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      await fetchSessions()
      setLoadingSessions(false)
    }
    loadSessions()
  }, [fetchSessions])

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("mobile") || device.toLowerCase().includes("phone")) {
      return <Smartphone className="w-5 h-5 text-blue-600" />
    }
    if (device.toLowerCase().includes("tablet")) {
      return <Tablet className="w-5 h-5 text-purple-600" />
    }
    return <Monitor className="w-5 h-5 text-green-600" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleLogoutSession = async (sessionId: string) => {
    await logoutSession(sessionId)
  }

  const handleLogoutAllSessions = async () => {
    await logoutAllSessions()
  }

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Active Sessions</h1>
              <p className="text-muted-foreground mt-2">Manage your active sessions across all devices</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={sessions.length === 0}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Logout All Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout from all sessions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices and you'll need to sign in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogoutAllSessions}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Logout All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {loadingSessions ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                <p className="text-muted-foreground text-center">You don't have any active sessions at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {sessions.map((session) => (
                <Card key={session._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(session.device)}
                        <div>
                          <CardTitle className="text-lg">{session.browser}</CardTitle>
                          <CardDescription>{session.platform}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Active</Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Logout from this session?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will immediately log out this device. You'll need to sign in again on this device.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLogoutSession(session.sessionId)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Logout
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">IP Address</p>
                          <p className="text-sm text-muted-foreground">{session.ip}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">{formatDate(session.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>User Agent:</strong> {session.userAgent}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
