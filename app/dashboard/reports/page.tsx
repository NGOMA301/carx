"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Calendar, TrendingUp, TrendingDown, DollarSign, Package, Users, Download, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DailyReport {
  date: string
  totalRevenue: number
  totalServices: number
  totalCars: number
  newCustomers: number
  popularPackage: string
  revenueChange: number
  servicesChange: number
}

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("7")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [selectedPeriod])

  const fetchReports = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API call
      const mockReports: DailyReport[] = Array.from({ length: Number.parseInt(selectedPeriod) }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          date: date.toISOString().split("T")[0],
          totalRevenue: Math.floor(Math.random() * 5000) + 1000,
          totalServices: Math.floor(Math.random() * 50) + 10,
          totalCars: Math.floor(Math.random() * 30) + 5,
          newCustomers: Math.floor(Math.random() * 10) + 1,
          popularPackage: ["Premium Wash", "Basic Wash", "Deluxe Detail"][Math.floor(Math.random() * 3)],
          revenueChange: (Math.random() - 0.5) * 20,
          servicesChange: (Math.random() - 0.5) * 30,
        }
      })

      setReports(mockReports)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setGenerating(true)
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create and download a mock PDF report
      const reportData =
        `Daily Report - ${new Date().toLocaleDateString()}\n\n` +
        reports
          .map(
            (report) =>
              `Date: ${report.date}\n` +
              `Revenue: $${report.totalRevenue}\n` +
              `Services: ${report.totalServices}\n` +
              `Cars: ${report.totalCars}\n` +
              `New Customers: ${report.newCustomers}\n` +
              `Popular Package: ${report.popularPackage}\n\n`,
          )
          .join("")

      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `daily-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setGenerating(false)
    }
  }

  const totalRevenue = reports.reduce((sum, report) => sum + report.totalRevenue, 0)
  const totalServices = reports.reduce((sum, report) => sum + report.totalServices, 0)
  const avgRevenueChange = reports.reduce((sum, report) => sum + report.revenueChange, 0) / reports.length

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Daily Reports</h1>
            <p className="text-muted-foreground mt-2">Track your business performance and generate detailed reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchReports} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={generateReport} disabled={generating} className="bg-primary hover:bg-primary/90">
              {generating ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              {generating ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? <LoadingSpinner size="sm" /> : totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {avgRevenueChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                )}
                <span className={avgRevenueChange > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(avgRevenueChange).toFixed(1)}%
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? <LoadingSpinner size="sm" /> : totalServices}
              </div>
              <p className="text-xs text-muted-foreground">Services completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average per Day</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? <LoadingSpinner size="sm" /> : Math.round(totalServices / Number.parseInt(selectedPeriod))}
              </div>
              <p className="text-xs text-muted-foreground">Services per day</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? <LoadingSpinner size="sm" /> : reports.reduce((sum, r) => sum + r.newCustomers, 0)}
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Reports Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Daily Breakdown</span>
            </CardTitle>
            <CardDescription>Detailed daily performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Services</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cars</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">New Customers</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Popular Package</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-foreground font-medium">
                          ${report.totalRevenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-foreground">{report.totalServices}</td>
                        <td className="py-3 px-4 text-foreground">{report.totalCars}</td>
                        <td className="py-3 px-4 text-foreground">{report.newCustomers}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{report.popularPackage}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {report.revenueChange > 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                            )}
                            <span className={report.revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                              {Math.abs(report.revenueChange).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
