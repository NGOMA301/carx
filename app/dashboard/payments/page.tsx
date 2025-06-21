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
import { CreditCard, Plus, Trash2, Download, Hash, RefreshCw, Car, Package } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Footer from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"

interface PaymentData {
  _id: string
  paymentNumber: string
  amountPaid: number
  paymentDate: string
  paymentMethod: string
  status: string
  servicePackage: {
    _id: string
    recordNumber: string
    car: {
      plateNumber: string
      carType: string
    }
    package: {
      packageName: string
      packagePrice: number
    }
  }
  createdAt: string
}

interface ServiceData {
  _id: string
  recordNumber: string
  car: {
    plateNumber: string
    carType: string
  }
  package: {
    packageName: string
    packagePrice: number
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    paymentNumber: "",
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "",
    status: "",
    servicePackage: "",
  })
  const { toast } = useToast()
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const generatePaymentNumber = () => {
    // Generate Rwandan-style payment number: PAY-YYYY-XXXX
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    return `PAY-${year}-${random}`
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [paymentsRes, servicesRes] = await Promise.all([axios.get("/payment"), axios.get("/service-package")])
      setPayments(paymentsRes.data)
      setServices(servicesRes.data)
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
      const data = {
        ...formData,
        amountPaid: Number.parseFloat(formData.amountPaid),
      }

      await axios.post("/payment", data)
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      })

      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record payment",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (paymentId: string) => {
    setActionLoading(true)
    try {
      await axios.delete(`/payment/${paymentId}`)
      toast({
        title: "Success",
        description: "Payment deleted successfully",
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete payment",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      setGeneratingInvoice(paymentId)
      // Simulate invoice generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await axios.get(`/payment/${paymentId}/invoice`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `invoice_${paymentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to download invoice",
        variant: "destructive",
      })
    } finally {
      setGeneratingInvoice(null)
    }
  }

  const resetForm = () => {
    const now = new Date()
    const dateString = now.toISOString().split("T")[0]
    setFormData({
      paymentNumber: generatePaymentNumber(),
      amountPaid: "",
      paymentDate: dateString,
      paymentMethod: "",
      status: "completed",
      servicePackage: "",
    })
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AuthGuard requireAuth>
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Track and manage payment records</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                onClick={openAddDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>Create a new payment record for a service</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentNumber">Payment Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="paymentNumber"
                      value={formData.paymentNumber}
                      onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                      required
                      disabled={actionLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, paymentNumber: generatePaymentNumber() })}
                      disabled={actionLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servicePackage">Service Record</Label>
                  <Select
                    value={formData.servicePackage}
                    onValueChange={(value) => {
                      const selectedService = services.find((s) => s._id === value)
                      setFormData({
                        ...formData,
                        servicePackage: value,
                        amountPaid: selectedService?.package.packagePrice.toString() || "",
                      })
                    }}
                    disabled={actionLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service record" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {service?.car?.plateNumber} - {service?.package?.packageName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {service?.recordNumber} - {service.package?.packagePrice?.toLocaleString()} RWF
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountPaid">Amount Paid (RWF)</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                      required
                      disabled={actionLoading}
                      min="0"
                      step="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      required
                      disabled={actionLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      disabled={actionLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      disabled={actionLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Recording...</span>
                      </div>
                    ) : (
                      "Record Payment"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <LoadingOverlay loading={loading}>
          {payments.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payments recorded</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Start by recording your first payment
                </p>
                <Button
                  onClick={openAddDialog}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record First Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.map((payment) => (
                <Card key={payment._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        {payment.servicePackage?.car?.plateNumber || "N/A"}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadInvoice(payment._id)}
                          disabled={generatingInvoice === payment._id}
                        >
                          {generatingInvoice === payment._id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
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
                              <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this payment record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(payment._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription>Paid on {new Date(payment.paymentDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{payment.paymentNumber}</span>
                      </div>
                      {payment.servicePackage && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Car className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {payment.servicePackage.car?.carType || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {payment.servicePackage.package?.packageName || "N/A"}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        {getStatusBadge(payment.status)}
                        <span className="text-lg font-bold text-green-600">
                          {payment.amountPaid.toLocaleString()} RWF
                        </span>
                      </div>
                      {payment.paymentMethod && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          via {payment.paymentMethod.replace("_", " ")}
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
    </AuthGuard>

  )
}
