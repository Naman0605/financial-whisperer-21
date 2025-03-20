
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User, Wallet, Bell, Shield, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    currency: "INR",
    language: "en-IN",
    timeZone: "Asia/Kolkata",
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      unusualActivity: true,
      newFeatures: false
    }
  });

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleNotificationChange = (field, value) => {
    setProfileData({
      ...profileData,
      notifications: { ...profileData.notifications, [field]: value }
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved."
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
    // Navigate to home page or login page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container max-w-6xl mx-auto pt-20 px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="glass-card">
          <Tabs defaultValue="profile">
            <TabsList className="w-full max-w-md grid grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="profile">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <Button 
                      variant="outline" 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "bg-finance-teal text-white hover:bg-finance-teal/90" : ""}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profileData.firstName} 
                        onChange={(e) => handleChange('firstName', e.target.value)} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profileData.lastName} 
                        onChange={(e) => handleChange('lastName', e.target.value)} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={(e) => handleChange('email', e.target.value)} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone} 
                        onChange={(e) => handleChange('phone', e.target.value)} 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Security</h2>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        disabled={!isEditing}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        disabled={!isEditing}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">App Preferences</h2>
                    <Button 
                      variant="outline" 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "bg-finance-teal text-white hover:bg-finance-teal/90" : ""}
                    >
                      {isEditing ? "Save Changes" : "Edit Preferences"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={profileData.currency} 
                        onValueChange={(value) => handleChange('currency', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={profileData.language} 
                        onValueChange={(value) => handleChange('language', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-IN">English (India)</SelectItem>
                          <SelectItem value="hi-IN">Hindi</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <Select 
                        value={profileData.timeZone} 
                        onValueChange={(value) => handleChange('timeZone', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="timeZone">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Indian Standard Time (IST)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <Button 
                      variant="outline" 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "bg-finance-teal text-white hover:bg-finance-teal/90" : ""}
                    >
                      {isEditing ? "Save Changes" : "Edit Notifications"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          id="email-notifications"
                          checked={profileData.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                        </div>
                        <Switch 
                          id="push-notifications"
                          checked={profileData.notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch 
                          id="sms-notifications"
                          checked={profileData.notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-report">Weekly Report</Label>
                          <p className="text-sm text-muted-foreground">Receive a weekly summary of your finances</p>
                        </div>
                        <Switch 
                          id="weekly-report"
                          checked={profileData.notifications.weeklyReport}
                          onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="unusual-activity">Unusual Activity</Label>
                          <p className="text-sm text-muted-foreground">Get alerted about suspicious transactions</p>
                        </div>
                        <Switch 
                          id="unusual-activity"
                          checked={profileData.notifications.unusualActivity}
                          onCheckedChange={(checked) => handleNotificationChange('unusualActivity', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-features">New Features</Label>
                          <p className="text-sm text-muted-foreground">Learn about new features and updates</p>
                        </div>
                        <Switch 
                          id="new-features"
                          checked={profileData.notifications.newFeatures}
                          onCheckedChange={(checked) => handleNotificationChange('newFeatures', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
