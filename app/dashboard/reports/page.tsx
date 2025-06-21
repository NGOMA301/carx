"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { TrendingUp, TrendingDown, DollarSign, Car, Users, Calendar, Download, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DailyReport {
  date: string
  revenue: number
  services: number
  customers: number
  revenueChange: number
  servicesChange: number
  customersChange: number
}

interface ReportSummary {
  totalRevenue: number
  totalServices: number
  totalCustomers: number
  averageRevenue: number
  revenueGrowth: number
  servicesGrowth: number
  customersGrowth: number
}

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([])
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [period, setPeriod] = useState("7")
  const { toast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [period])

  const fetchReports = async () => {
    try {
      setLoading(true)
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockReports: DailyReport[] = Array.from({ length: Number.parseInt(period) }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          date: date.toISOString().split("T")[0],
          revenue: Math.floor(Math.random() * 50000) + 10000,
          services: Math.floor(Math.random() * 20) + 5,
          customers: Math.floor(Math.random() * 15) + 3,
          revenueChange: (Math.random() - 0.5) * 20,
          servicesChange: (Math.random() - 0.5) * 10,
          customersChange: (Math.random() - 0.5) * 8,
        }
      }).reverse()

      const totalRevenue = mockReports.reduce((sum, report) => sum + report.revenue, 0)
      const totalServices = mockReports.reduce((sum, report) => sum + report.services, 0)
      const totalCustomers = mockReports.reduce((sum, report) => sum + report.customers, 0)

      const mockSummary: ReportSummary = {
        totalRevenue,
        totalServices,
        totalCustomers,
        averageRevenue: totalRevenue / mockReports.length,
        revenueGrowth: 12.5,
        servicesGrowth: 8.3,
        customersGrowth: 15.2,
      }

      setReports(mockReports)
      setSummary(mockSummary)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setGeneratingReport(true)
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reportData =
        `DAILY REPORT - ${period} DAYS\n\n` +
        `Total Revenue: ${summary?.totalRevenue.toLocaleString()} RWF\n` +
        `Total Services: ${summary?.totalServices}\n` +
        `Total Customers: ${summary?.totalCustomers}\n` +
        `Average Daily Revenue: ${summary?.averageRevenue.toLocaleString()} RWF\n\n` +
        `DAILY BREAKDOWN:\n` +
        reports
          .map(
            (report) =>
              `${report.date}: ${report.revenue.toLocaleString()} RWF, ${report.services} services, ${report.customers} customers`,
          )
          .join("\n")

      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `daily-report-${period}-days.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Report generated and downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setGeneratingReport(false)
    }
  }

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Daily Reports</h1>
            <p className="text-muted-foreground mt-2">Track your business performance over time</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={generateReport}
              disabled={generatingReport || loading}
              className="bg-primary hover:bg-primary/90"
            >
              {generatingReport ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">{summary?.totalRevenue.toLocaleString()} RWF</p>
                      <div className="flex items-center mt-2">
                        {getTrendIcon(summary?.revenueGrowth || 0)}
                        <span className={`text-sm ml-1 ${getTrendColor(summary?.revenueGrowth || 0)}`}>
                          {Math.abs(summary?.revenueGrowth || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                      <p className="text-2xl font-bold">{summary?.totalServices}</p>
                      <div className="flex items-center mt-2">
                        {getTrendIcon(summary?.servicesGrowth || 0)}
                        <span className={`text-sm ml-1 ${getTrendColor(summary?.servicesGrowth || 0)}`}>
                          {Math.abs(summary?.servicesGrowth || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold">{summary?.totalCustomers}</p>
                      <div className="flex items-center mt-2">
                        {getTrendIcon(summary?.customersGrowth || 0)}
                        <span className={`text-sm ml-1 ${getTrendColor(summary?.customersGrowth || 0)}`}>
                          {Math.abs(summary?.customersGrowth || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Daily Breakdown</span>
                </CardTitle>
                <CardDescription>Performance metrics for the last {period} days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium">{new Date(report.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.services} services • {report.customers} customers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">{report.revenue.toLocaleString()} RWF</p>
                          <div className="flex items-center justify-end">
                            {getTrendIcon(report.revenueChange)}
                            <span className={`text-sm ml-1 ${getTrendColor(report.revenueChange)}`}>
                              {Math.abs(report.revenueChange).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
