"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Car, Calendar, Download, BarChart3, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface DailyReportItem {
  plateNumber: string | null
  plateNumberStatus: string
  packageName: string | null
  packageStatus: string
  packageDescription: string | null
  amountPaid: number
  paymentDate: string
}

interface DailyReportResponse {
  date: string
  count: number
  data: DailyReportItem[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<DailyReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  useEffect(() => {
    fetchDailyReport()
  }, [selectedDate])

  const fetchDailyReport = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/payment/report/daily?date=${selectedDate}`)
      setReport(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch daily report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setGeneratingReport(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!report) {
        toast({
          title: "Error",
          description: "No report data to generate",
          variant: "destructive",
        })
        return
      }

      const reportData =
        `DAILY REPORT - ${selectedDate}\n\n` +
        `Total Transactions: ${report.count}\n` +
        `Total Revenue: ${report.data.reduce((sum, item) => sum + item.amountPaid, 0).toLocaleString()} RWF\n\n` +
        `TRANSACTION DETAILS:\n` +
        `${"=".repeat(80)}\n` +
        report.data
          .map(
            (item, index) =>
              `${index + 1}. ${item.plateNumber || "N/A"} | ${item.packageName || "N/A"} | ${item.amountPaid.toLocaleString()} RWF\n` +
              `   Date: ${new Date(item.paymentDate).toLocaleString()}\n` +
              `   Car Status: ${item.plateNumberStatus}\n` +
              `   Package Status: ${item.packageStatus}\n` +
              `   Description: ${item.packageDescription || "N/A"}\n`,
          )
          .join("\n")

      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `daily-report-${selectedDate}.txt`
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

  const totalRevenue = report?.data.reduce((sum, item) => sum + item.amountPaid, 0) || 0
  const validTransactions =
    report?.data.filter((item) => item.plateNumberStatus === "OK" && item.packageStatus === "OK").length || 0
  const issueTransactions = (report?.count || 0) - validTransactions

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">Daily Reports</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                View detailed daily transaction reports
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="date" className="text-sm text-gray-700 dark:text-gray-300">
                  Date:
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-40 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white bg-white dark:bg-black"
                />
              </div>

              <Button
                onClick={generateReport}
                disabled={generatingReport || loading || !report}
                className="w-full sm:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
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
                <Card
                  key={i}
                  className="animate-pulse border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                >
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : report ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {totalRevenue.toLocaleString()} RWF
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {report.count} transaction{report.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valid Transactions</p>
                        <p className="text-2xl font-bold text-black dark:text-white">{validTransactions}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">No issues detected</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Found</p>
                        <p className="text-2xl font-bold text-orange-600">{issueTransactions}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Missing records</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions List */}
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-black dark:text-white">
                      Transaction Details - {new Date(selectedDate).toLocaleDateString()}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Detailed breakdown of all transactions for the selected date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.count === 0 ? (
                    <Alert>
                      <Calendar className="w-4 h-4" />
                      <AlertDescription>No transactions found for the selected date.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {report.data.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                        >
                          <div className="flex items-center space-x-4">
                            <Car className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-black dark:text-white">
                                  {item.plateNumber || "Unknown Plate"}
                                </p>
                                <Badge
                                  variant={item.plateNumberStatus === "OK" ? "default" : "destructive"}
                                  className={`text-xs ${
                                    item.plateNumberStatus === "OK"
                                      ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                      : ""
                                  }`}
                                >
                                  {item.plateNumberStatus === "OK" ? "Valid" : "Missing"}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.packageName || "Unknown Package"}
                                </p>
                                <Badge
                                  variant={item.packageStatus === "OK" ? "default" : "destructive"}
                                  className={`text-xs ${
                                    item.packageStatus === "OK"
                                      ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                      : ""
                                  }`}
                                >
                                  {item.packageStatus === "OK" ? "Valid" : "Missing"}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(item.paymentDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-black dark:text-white">
                              {item.amountPaid.toLocaleString()} RWF
                            </p>
                            {item.packageDescription && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-32 truncate">
                                {item.packageDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>Failed to load report data. Please try again.</AlertDescription>
            </Alert>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
