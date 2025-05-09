
import { User, Settings, Shield, LogOut, Bell, Mail, UserPlus, AlertTriangle, CheckCircle, Clock, Calendar, Briefcase, MapPin, Phone, AtSign, Badge } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  getOfficerProfile,
  saveOfficerProfile,
} from "@/utils/localStorageUtils";

export function Profile() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);

  useEffect(() => {
    // Load officer profile from local storage on component mount
    const profile = getOfficerProfile();
    setName(profile.name || "");
    setBadgeId(profile.badgeId || "");
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
    setDepartment(profile.department || "");
    setLocation(profile.location || "");
    // These properties might not exist in the OfficerProfile type, but we'll add them
    setNotificationsEnabled(profile.notificationsEnabled !== false); // Default to true
    setIsTwoFactorAuthEnabled(profile.isTwoFactorAuthEnabled || false); // Default to false
  }, []);

  const handleSaveProfile = () => {
    // Save officer profile to local storage
    const profile = {
      name,
      badgeId,
      email,
      phone,
      department,
      location,
      joinedDate: getOfficerProfile().joinedDate, // Keep existing joined date
      notificationsEnabled,
      isTwoFactorAuthEnabled,
    };
    saveOfficerProfile(profile);

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            <User className="mr-2 h-5 w-5 inline-block align-middle" />
            Officer Profile
          </CardTitle>
          <ThemeToggle />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badgeId">Badge Number</Label>
              <Input
                id="badgeId"
                placeholder="Badge Number"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex items-center justify-between">
              <Label htmlFor="notifications">Notifications</Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={(checked) => setNotificationsEnabled(checked)}
              />
            </div>
            <div className="space-y-2 flex items-center justify-between">
              <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
              <Switch
                id="twoFactorAuth"
                checked={isTwoFactorAuthEnabled}
                onCheckedChange={(checked) => setIsTwoFactorAuthEnabled(checked)}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile} className="w-full bg-primary hover:bg-primary/80">
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
