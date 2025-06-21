"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Package, Plus, Edit, Trash2, DollarSign, Hash, RefreshCw } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface PackageData {
  _id: string
  packageNumber: string
  packageName: string
  packageDescription: string
  packagePrice: number
  createdAt: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null)
  const [formData, setFormData] = useState({
    packageNumber: "",
    packageName: "",
    packageDescription: "",
    packagePrice: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPackages()
  }, [])

  const generatePackageNumber = () => {
    // Generate Rwandan-style package number: PKG-YYYY-XXXX
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    return `PKG-${year}-${random}`
  }

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/package")
      setPackages(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch packages",
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
      const data = {
        ...formData,
        packagePrice: Number.parseFloat(formData.packagePrice),
      }

      if (editingPackage) {
        await axios.put(`/package/${editingPackage._id}`, data)
        toast({
          title: "Success",
          description: "Package updated successfully",
        })
      } else {
        await axios.post("/package", data)
        toast({
          title: "Success",
          description: "Package created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchPackages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save package",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (packageId: string) => {
    setActionLoading(true)
    try {
      await axios.delete(`/package/${packageId}`)
      toast({
        title: "Success",
        description: "Package deleted successfully",
      })
      fetchPackages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete package",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      packageNumber: generatePackageNumber(),
      packageName: "",
      packageDescription: "",
      packagePrice: "",
    })
    setEditingPackage(null)
  }

  const openEditDialog = (pkg: PackageData) => {
    setEditingPackage(pkg)
    setFormData({
      packageNumber: pkg.packageNumber,
      packageName: pkg.packageName,
      packageDescription: pkg.packageDescription,
      packagePrice: pkg.packagePrice.toString(),
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Packages</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your car wash service packages</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={openAddDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
                <DialogDescription>
                  {editingPackage ? "Update package information" : "Create a new service package"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageNumber">Package Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="packageNumber"
                      value={formData.packageNumber}
                      onChange={(e) => setFormData({ ...formData, packageNumber: e.target.value })}
                      required
                      disabled={actionLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, packageNumber: generatePackageNumber() })}
                      disabled={actionLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name</Label>
                  <Input
                    id="packageName"
                    value={formData.packageName}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    required
                    disabled={actionLoading}
                    placeholder="e.g., Premium Wash"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packageDescription">Description</Label>
                  <Textarea
                    id="packageDescription"
                    value={formData.packageDescription}
                    onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
                    required
                    disabled={actionLoading}
                    placeholder="Describe what's included in this package..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packagePrice">Price (RWF)</Label>
                  <Input
                    id="packagePrice"
                    type="number"
                    value={formData.packagePrice}
                    onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                    required
                    disabled={actionLoading}
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>{editingPackage ? "Updating..." : "Creating..."}</span>
                      </div>
                    ) : editingPackage ? (
                      "Update Package"
                    ) : (
                      "Create Package"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <LoadingOverlay loading={loading}>
          {packages.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No packages created</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Create your first service package to get started
                </p>
                <Button
                  onClick={openAddDialog}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        {pkg.packageName}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(pkg)} disabled={actionLoading}>
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
                              <AlertDialogTitle>Delete Package</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this package? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pkg._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription>Created on {new Date(pkg.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{pkg.packageNumber}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {pkg.packageDescription}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {pkg.packagePrice.toLocaleString()} RWF
                          </span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          Active
                        </Badge>
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
