"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay, LoadingSpinner } from "@/components/loading-spinner"
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
import { Car, Plus, Edit, Trash2, Phone, User, RefreshCw } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { generateRwandanPlateNumber } from "@/utils/plate-generator"

interface CarData {
  _id: string
  plateNumber: string
  carType: string
  carSize: string
  driverName: string
  phoneNumber: string
  image?: string
  createdAt: string
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<CarData | null>(null)
  const [formData, setFormData] = useState({
    plateNumber: "",
    carType: "",
    carSize: "",
    driverName: "",
    phoneNumber: "",
    image: null as File | null,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/car")
      setCars(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch cars",
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
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value)
        }
      })

      if (editingCar) {
        await axios.put(`/car/${editingCar._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast({
          title: "Success",
          description: "Car updated successfully",
        })
      } else {
        await axios.post("/car", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast({
          title: "Success",
          description: "Car added successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchCars()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save car",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (carId: string) => {
    setActionLoading(true)
    try {
      await axios.delete(`/car/${carId}`)
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
      fetchCars()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete car",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      plateNumber: generateRwandanPlateNumber(),
      carType: "",
      carSize: "",
      driverName: "",
      phoneNumber: "",
      image: null,
    })
    setEditingCar(null)
  }

  const openEditDialog = (car: CarData) => {
    setEditingCar(car)
    setFormData({
      plateNumber: car.plateNumber,
      carType: car.carType,
      carSize: car.carSize,
      driverName: car.driverName,
      phoneNumber: car.phoneNumber,
      image: null,
    })
    setDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cars Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your registered vehicles</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
                <DialogDescription>
                  {editingCar ? "Update car information" : "Add a new car to your fleet"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="plateNumber"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                      required
                      disabled={actionLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, plateNumber: generateRwandanPlateNumber() })}
                      disabled={actionLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carType">Car Type</Label>
                    <Input
                      id="carType"
                      value={formData.carType}
                      onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                      disabled={actionLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carSize">Car Size</Label>
                    <Input
                      id="carSize"
                      value={formData.carSize}
                      onChange={(e) => setFormData({ ...formData, carSize: e.target.value })}
                      disabled={actionLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input
                    id="driverName"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    disabled={actionLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={actionLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Car Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    disabled={actionLoading}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>{editingCar ? "Updating..." : "Adding..."}</span>
                      </div>
                    ) : editingCar ? (
                      "Update Car"
                    ) : (
                      "Add Car"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <LoadingOverlay loading={loading}>
          {cars.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Car className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No cars registered</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Start by adding your first car to the system
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Car
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Card key={car._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        {car.plateNumber}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(car)} disabled={actionLoading}>
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
                              <AlertDialogTitle>Delete Car</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this car? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(car._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription>Registered on {new Date(car.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {car.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${car.image}`}
                          alt={car.plateNumber}
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {car.carType && (
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{car.carType}</span>
                          {car.carSize && (
                            <Badge variant="secondary" className="text-xs">
                              {car.carSize}
                            </Badge>
                          )}
                        </div>
                      )}
                      {car.driverName && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{car.driverName}</span>
                        </div>
                      )}
                      {car.phoneNumber && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{car.phoneNumber}</span>
                        </div>
                      )}
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
