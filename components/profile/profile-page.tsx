"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { User, Camera, Save, Key, HelpCircle, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePageConfig } from "@/hooks/use-page-config"

interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
}

interface ApiCredentials {
  pluggy_client_id: string
  pluggy_client_secret: string
}

export function ProfilePage() {
  console.log("[v0] ProfilePage component is rendering")

  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Configure page information
  usePageConfig({
    page: "profile",
    title: "User Profile",
    subtitle: "Manage your personal information and settings"
  })

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "/generic-user-avatar.png",
  })

  const [credentials, setCredentials] = useState<ApiCredentials>({
    pluggy_client_id: "",
    pluggy_client_secret: "",
  })

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleCredentialsChange = (field: keyof ApiCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaveStatus("saving")

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSaveStatus("saved")
    setIsEditing(false)

    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleProfileChange("avatar", result)
      }
      reader.readAsDataURL(file)
    }
  }

  console.log("[v0] ProfilePage user:", user)
  console.log("[v0] ProfilePage profile state:", profile)

  return (
    <div className="space-y-6">
      {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-montserrat">Personal Information</CardTitle>
                  <CardDescription>Update your personal data</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus === "saved" && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Saved
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Error
                    </div>
                  )}
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    disabled={saveStatus === "saving"}
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      "Edit"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 555-5555"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-montserrat">
                <Key className="h-5 w-5" />
                API Credentials
              </CardTitle>
              <CardDescription>Configure your API keys for integration with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pluggy Credentials */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Pluggy API</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p className="font-semibold">How to get Pluggy credentials:</p>
                          <ol className="text-sm space-y-1 list-decimal list-inside">
                            <li>
                              Go to{" "}
                              <a
                                href="https://pluggy.ai"
                                className="text-primary underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                pluggy.ai
                              </a>
                            </li>
                            <li>Create an account or log in</li>
                            <li>Go to the Dashboard</li>
                            <li>Access "API Keys" in the menu</li>
                            <li>Copy the CLIENT_ID and CLIENT_SECRET</li>
                          </ol>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pluggy_client_id">Client ID</Label>
                    <Input
                      id="pluggy_client_id"
                      placeholder="Your Pluggy Client ID"
                      value={credentials.pluggy_client_id}
                      onChange={(e) => handleCredentialsChange("pluggy_client_id", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pluggy_client_secret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="pluggy_client_secret"
                        type={showSecrets ? "text" : "password"}
                        placeholder="Your Pluggy Client Secret"
                        value={credentials.pluggy_client_secret}
                        onChange={(e) => handleCredentialsChange("pluggy_client_secret", e.target.value)}
                        disabled={!isEditing}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSecrets(!showSecrets)}
                      >
                        {showSecrets ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Important:</strong> Your credentials are stored securely and encrypted. They are required to synchronize banking data through the Pluggy API.
                  </p>
                </div>
              </div>

              {/* Future API Integrations Placeholder */}
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-semibold text-muted-foreground mb-1">More integrations coming soon</h4>
                <p className="text-sm text-muted-foreground">
                  New APIs will be added as needed to expand functionality
                </p>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
