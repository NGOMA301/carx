"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "@/components/loading-spinner";
import {
  Activity,
  Car,
  Package,
  CreditCard,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { AuthGuard } from "@/components/auth-guard";

interface ActivityData {
  _id: string;
  action: string;
  resourceType: string;
  message: string;
  createdAt: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/activities");
      setActivities(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (resourceType: string, action: string) => {
    switch (resourceType) {
      case "car":
        return <Car className="w-4 h-4 text-blue-600" />;
      case "package":
        return <Package className="w-4 h-4 text-purple-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case "servicePackage":
        return <Calendar className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Created
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Updated
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Deleted
          </Badge>
        );
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activity Log
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track all your recent actions and changes
            </p>
          </div>

          <LoadingOverlay loading={loading}>
            {activities.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Activity className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No activity yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Your actions will appear here as you use the system
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Recent Activities</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest actions and system changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentActivities.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getActivityIcon(
                            activity.resourceType,
                            activity.action
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getActionBadge(activity.action)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </LoadingOverlay>
          {/* Pagination */}
          {activities.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm hidden md:block text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, activities.length)} of {activities.length}{" "}
                activities
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
