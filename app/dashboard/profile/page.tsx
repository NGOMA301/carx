"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield, Save } from "lucide-react";
import Footer from "@/components/footer";
import { AuthGuard } from "@/components/auth-guard";

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    profileImage: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        fullName: user.fullName || "",
        profileImage: null,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== "profileImage") {
          data.append(key, value as string);
        }
      });

      if (formData.profileImage) {
        data.append("profile", formData.profileImage);
      }

      await updateProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your account information
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Profile Overview</span>
                </CardTitle>
                <CardDescription>
                  Your current profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        user?.profileImage
                          ? user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `${process.env.NEXT_PUBLIC_API_URI}${user.profileImage}`
                          : "/placeholder.svg"
                      }
                      alt={user?.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.fullName || user?.username}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      @{user?.username}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant={
                          user?.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user?.role === "admin" ? (
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Administrator</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>User</span>
                          </div>
                        )}
                      </Badge>
                      {user?.email && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={
                            formData.profileImage
                              ? URL.createObjectURL(formData.profileImage)
                              : user?.profileImage
                              ? user.profileImage.startsWith("http")
                                ? user.profileImage
                                : `${process.env.NEXT_PUBLIC_API_URI}${user.profileImage}`
                              : "/placeholder.svg"
                          }
                          alt="Profile preview"
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              profileImage: e.target.files?.[0] || null,
                            })
                          }
                          disabled={actionLoading}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a new profile picture
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        required
                        disabled={actionLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={actionLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      disabled={actionLoading}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {actionLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Update Profile</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
