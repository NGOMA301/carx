"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingOverlay } from "@/components/loading-spinner"
import {
  ArrowLeft,
  User,
  Car,
  Package,
  CreditCard,
  Activity,
  Shield,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
} from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"

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

interface CarData {
  _id: string
  plateNumber: string
  carType?: string
  carSize?: string
  driverName?: string
  phoneNumber?: string
  image?: string
  createdAt: string
}

interface PackageData {
  _id: string
  packageNumber: string
  packageName: string
  packageDescription: string
  packagePrice: number
  createdAt: string
}

interface ServiceData {
  _id: string
  recordNumber: string
  serviceDate: string
  car: CarData
  package: PackageData
  createdAt: string
}

interface PaymentData {
  _id: string
  paymentNumber: string
  amountPaid: number
  paymentDate: string
  paymentMethod?: string
  status?: string
  servicePackage: ServiceData
  createdAt: string
}

interface SessionData {
  _id: string
  sessionId: string
  ip?: string
  location?: string
  userAgent?: string
  device?: string
  platform?: string
  browser?: string
  createdAt: string
  lastActive: string
}

interface UserDetails {
  user: UserData
  cars: CarData[]
  packages: PackageData[]
  services: ServiceData[]
  payments: PaymentData[]
  sessions: SessionData[]
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchUserDetails()
  }, [user, router, userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/auth/users/${userId}/details`)
      setUserDetails(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch user details",
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
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Comprehensive view of user information and activities
            </p>
          </div>

          <LoadingOverlay loading={loading}>
            {userDetails && (
              <div className="space-y-6">
                {/* User Profile Card */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={
                              userDetails.user.profileImage
                                ? userDetails.user.profileImage.startsWith("http")
                                  ? userDetails.user.profileImage
                                  : `${process.env.NEXT_PUBLIC_API_URI}${userDetails.user.profileImage}`
                                : "/placeholder.svg"
                            }
                            alt={userDetails.user.username}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-2xl font-bold">
                            {userDetails.user.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          {userDetails.user.fullName || userDetails.user.username}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                          @{userDetails.user.username}
                        </CardDescription>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={userDetails.user.role === "admin" ? "default" : "secondary"}
                            className={
                              userDetails.user.role === "admin"
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }
                          >
                            {userDetails.user.role === "admin" ? (
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
                          <Badge
                            variant="outline"
                            className={
                              userDetails.user.provider === "google"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }
                          >
                            {userDetails.user.provider === "google" ? "Google" : "Local"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userDetails.user.email && (
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                              Email
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {userDetails.user.email}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                            Joined
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(userDetails.user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                            User ID
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                            {userDetails.user._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs for detailed information */}
                <Tabs defaultValue="cars" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
                    <TabsTrigger
                      value="cars"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-neutral-800"
                    >
                      <Car className="w-4 h-4" />
                      <span className="hidden sm:inline">Cars</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {userDetails.cars.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="packages"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-neutral-800"
                    >
                      <Package className="w-4 h-4" />
                      <span className="hidden sm:inline">Packages</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {userDetails.packages.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="services"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-neutral-800"
                    >
                      <Activity className="w-4 h-4" />
                      <span className="hidden sm:inline">Services</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {userDetails.services.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="payments"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-neutral-800"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Payments</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {userDetails.payments.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="sessions"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:text-neutral-800"
                    >
                      <Monitor className="w-4 h-4" />
                      <span className="hidden sm:inline">Sessions</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {userDetails.sessions.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* Cars Tab */}
                  <TabsContent value="cars" className="space-y-4">
                    {userDetails.cars.length === 0 ? (
                      <Card className="border border-gray-200 dark:border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Car className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No cars registered
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center max-w-sm">
                            This user hasn't registered any cars yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userDetails.cars.map((car) => (
                          <Card
                            key={car._id}
                            className="group border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
                          >
                            <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                              {car.image ? (
                                <img
                                  src={
                                    car.image.startsWith("http")
                                      ? car.image
                                      : `${process.env.NEXT_PUBLIC_API_URI}${car.image}`
                                  }
                                  alt={`${car.plateNumber} - ${car.carType || "Car"}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                                    <Car className="w-8 h-8 text-gray-400" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <Badge variant="secondary" className="bg-white/90 text-gray-900 border-0 shadow-sm">
                                  {car.plateNumber}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <span className="text-lg font-semibold">{car.plateNumber}</span>
                                {car.carType && (
                                  <Badge variant="outline" className="text-xs">
                                    {car.carType}
                                  </Badge>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                {car.carSize && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                      Size
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{car.carSize}</p>
                                  </div>
                                )}
                                {car.driverName && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                      Driver
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {car.driverName}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {car.phoneNumber && (
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                  <Phone className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">{car.phoneNumber}</span>
                                </div>
                              )}
                              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Added{" "}
                                  {new Date(car.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Packages Tab */}
                  <TabsContent value="packages" className="space-y-4">
                    {userDetails.packages.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <Package className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No packages created
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center">
                            This user hasn't created any packages yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userDetails.packages.map((pkg) => (
                          <Card key={pkg._id} className="border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Package className="w-5 h-5 text-purple-600" />
                                  <span>{pkg.packageName}</span>
                                </div>
                                <Badge variant="outline">${pkg.packagePrice}</Badge>
                              </CardTitle>
                              <CardDescription>#{pkg.packageNumber}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{pkg.packageDescription}</p>
                              <p className="text-xs text-gray-500">
                                Created {new Date(pkg.createdAt).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Services Tab */}
                  <TabsContent value="services" className="space-y-4">
                    {userDetails.services.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <Activity className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No services recorded
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center">
                            This user hasn't used any services yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {userDetails.services.map((service) => (
                          <Card key={service._id} className="border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Activity className="w-5 h-5 text-green-600" />
                                  <span>Service #{service.recordNumber}</span>
                                </div>
                                <Badge variant="outline">{new Date(service.serviceDate).toLocaleDateString()}</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Car Details</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.car.plateNumber}</p>
                                  {service.car.carType && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{service.car.carType}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Package Details</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {service.package.packageName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    ${service.package.packagePrice}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Payments Tab */}
                  <TabsContent value="payments" className="space-y-4">
                    {userDetails.payments.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payments made</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center">
                            This user hasn't made any payments yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {userDetails.payments.map((payment) => (
                          <Card key={payment._id} className="border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="w-5 h-5 text-blue-600" />
                                  <span>Payment #{payment.paymentNumber}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-green-600">
                                    ${payment.amountPaid}
                                  </Badge>
                                  {payment.status && (
                                    <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                                      {payment.status}
                                    </Badge>
                                  )}
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Payment Date</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                  </p>
                                </div>
                                {payment.paymentMethod && (
                                  <div>
                                    <p className="text-sm font-medium">Method</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{payment.paymentMethod}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">Service</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    #{payment.servicePackage.recordNumber}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Sessions Tab */}
                  <TabsContent value="sessions" className="space-y-4">
                    {userDetails.sessions.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <Monitor className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No active sessions
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center">
                            This user has no recorded sessions
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {userDetails.sessions.map((session) => (
                          <Card key={session._id} className="border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {session.device === "mobile" ? (
                                    <Smartphone className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-blue-600" />
                                  )}
                                  <span>Session {session.sessionId.slice(-8)}</span>
                                </div>
                                <Badge variant="outline">{new Date(session.lastActive).toLocaleDateString()}</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {session.ip && (
                                  <div>
                                    <p className="text-sm font-medium">IP Address</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{session.ip}</p>
                                  </div>
                                )}
                                {session.location && (
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium">Location</p>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">{session.location}</p>
                                    </div>
                                  </div>
                                )}
                                {session.platform && (
                                  <div>
                                    <p className="text-sm font-medium">Platform</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{session.platform}</p>
                                  </div>
                                )}
                                {session.browser && (
                                  <div className="flex items-start space-x-2">
                                    <Globe className="w-4 h-4 text-green-600 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium">Browser</p>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">{session.browser}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Created: {new Date(session.createdAt).toLocaleString()}</span>
                                  <span>Last Active: {new Date(session.lastActive).toLocaleString()}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </LoadingOverlay>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
