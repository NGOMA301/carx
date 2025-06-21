"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay, LoadingSpinner } from "@/components/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Calendar, Plus, Edit, Trash2, Car, Package, Hash, RefreshCw, User } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface ServiceData {
  _id: string
  recordNumber: string
  serviceDate: string
  car: {
    _id: string
    plateNumber: string
    carType: string
    driverName: string
  }
  package: {
    _id: string
    packageName: string
    packagePrice: number
  }
  user: {
    _id: string
    username: string
  }
  createdAt: string
}

interface CarData {
  _id: string
  plateNumber: string
  carType: string
  driverName: string
}

interface PackageData {
  _id: string
  packageName: string
  packagePrice: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [cars, setCars] = useState<CarData[]>([])
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceData | null>(null)
  const [formData, setFormData] = useState({
    recordNumber: "",
    serviceDate: "",
    car: "",
    package: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const generateRecordNumber = () => {
    // Generate Rwandan-style service record number: SRV-YYYY-XXXX
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    return `SRV-${year}-${random}`
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, carsRes, packagesRes] = await Promise.all([
        axios.get("/service-package"),
        axios.get("/car"),
        axios.get("/package"),
      ])
      setServices(servicesRes.data)
      setCars(carsRes.data)
      setPackages(packagesRes.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)

    try {
      if (editingService) {
        await axios.put(`/service-package/${editingService._id}`, formData)
        toast({
          title: "Success",
          description: "Service record updated successfully",
        })
      } else {
        await axios.post("/service-package", formData)
        toast({
          title: "Success",
          description: "Service record created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save service record",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    setActionLoading(true)
    try {
      await axios.delete(`/service-package/${serviceId}`)
      toast({
        title: "Success",
        description: "Service record deleted successfully",
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete service record",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    const now = new Date()
    const dateString = now.toISOString().split("T")[0]
    setFormData({
      recordNumber: generateRecordNumber(),
      serviceDate: dateString,
      car: "",
      package: "",
    })
    setEditingService(null)
  }

  const openEditDialog = (service: ServiceData) => {
    setEditingService(service)
    setFormData({
      recordNumber: service.recordNumber,
      serviceDate: new Date(service.serviceDate).toISOString().split("T")[0],
      car: service.car._id,
      package: service.package._id,
    })
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Records</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage car wash service appointments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={openAddDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingService ? "Edit Service Record" : "Create New Service"}</DialogTitle>
                <DialogDescription>
                  {editingService ? "Update service record information" : "Create a new service appointment"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recordNumber">Record Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="recordNumber"
                      value={formData.recordNumber}
                      onChange={(e) => setFormData({ ...formData, recordNumber: e.target.value })}
                      required
                      disabled={actionLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, recordNumber: generateRecordNumber() })}
                      disabled={actionLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Service Date</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                    required
                    disabled={actionLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="car">Select Car</Label>
                  <Select
                    value={formData.car}
                    onValueChange={(value) => setFormData({ ...formData, car: value })}
                    disabled={actionLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a car" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map((car) => (
                        <SelectItem key={car._id} value={car._id}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{car.plateNumber}</span>
                            <span className="text-sm text-gray-500">
                              {car.carType} - {car.driverName}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package">Select Package</Label>
                  <Select
                    value={formData.package}
                    onValueChange={(value) => setFormData({ ...formData, package: value })}
                    disabled={actionLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg._id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{pkg.packageName}</span>
                            <span className="text-sm text-green-600 ml-2">{pkg.packagePrice.toLocaleString()} RWF</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>{editingService ? "Updating..." : "Creating..."}</span>
                      </div>
                    ) : editingService ? (
                      "Update Service"
                    ) : (
                      "Create Service"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <LoadingOverlay loading={loading}>
          {services.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No service records</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Create your first service appointment to get started
                </p>
                <Button
                  onClick={openAddDialog}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        {service.car.plateNumber}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(service)}
                          disabled={actionLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              disabled={actionLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Service Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this service record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(service._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription>Service on {new Date(service.serviceDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{service.recordNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {service.car.carType} - {service.car.driverName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{service.package.packageName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">By {service.user.username}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Completed
                        </Badge>
                        <span className="text-lg font-bold text-green-600">
                          {service.package.packagePrice.toLocaleString()} RWF
                        </span>
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
