"use client"

import type React from "react"

import { useState } from "react"
import type { Activity } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const { theme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-sm font-medium">{activity.title}</p>
          <p className="text-xs text-muted-foreground">{activity.description}</p>
        </div>
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        {format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}
        {theme === "dark" ? (
          <span className="ml-2 w-2 h-2 rounded-full bg-sky-500" />
        ) : (
          <span className="ml-2 w-2 h-2 rounded-full bg-sky-700" />
        )}
      </div>
    </div>
  )
}

const ActivityList: React.FC<{ activities: Activity[] | undefined }> = ({ activities }) => {
  if (!activities) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (activities.length === 0) {
    return <div className="text-sm text-muted-foreground">No activities found.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "New user registered",
    description: "A new user has registered on the platform.",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "New order placed",
    description: "A new order has been placed.",
    createdAt: new Date(new Date().getTime() - 3600000),
  },
  {
    id: "3",
    title: "New comment received",
    description: "A new comment has been received on a post.",
    createdAt: new Date(new Date().getTime() - 7200000),
  },
  {
    id: "4",
    title: "Password reset request",
    description: "A user has requested to reset their password.",
    createdAt: new Date(new Date().getTime() - 10800000),
  },
  {
    id: "5",
    title: "New user registered",
    description: "A new user has registered on the platform.",
    createdAt: new Date(),
  },
  {
    id: "6",
    title: "New order placed",
    description: "A new order has been placed.",
    createdAt: new Date(new Date().getTime() - 3600000),
  },
  {
    id: "7",
    title: "New comment received",
    description: "A new comment has been received on a post.",
    createdAt: new Date(new Date().getTime() - 7200000),
  },
  {
    id: "8",
    title: "Password reset request",
    description: "A user has requested to reset their password.",
    createdAt: new Date(new Date().getTime() - 10800000),
  },
  {
    id: "9",
    title: "New user registered",
    description: "A new user has registered on the platform.",
    createdAt: new Date(),
  },
  {
    id: "10",
    title: "New order placed",
    description: "A new order has been placed.",
    createdAt: new Date(new Date().getTime() - 3600000),
  },
  {
    id: "11",
    title: "New comment received",
    description: "A new comment has been received on a post.",
    createdAt: new Date(new Date().getTime() - 7200000),
  },
  {
    id: "12",
    title: "Password reset request",
    description: "A user has requested to reset their password.",
    createdAt: new Date(new Date().getTime() - 10800000),
  },
]

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  import { ChevronLeft, ChevronRight } from 'lucide-react'

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const totalPages = Math.ceil(activities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivities = activities.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityList activities={currentActivities} />
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, activities.length)} of {activities.length} activities
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityPage
