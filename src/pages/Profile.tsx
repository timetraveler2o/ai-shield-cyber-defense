import { User, Settings, Shield, LogOut, Bell, Mail, UserPlus, AlertTriangle, CheckCircle, Clock, Calendar, Briefcase, MapPin, Phone, AtSign, Badge } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  getOfficerProfile,
  saveOfficerProfile,
} from "@/utils/localStorageUtils";

export default function Profile() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);

  useEffect(() => {
    // Load officer profile from local storage on component mount
    const profile = getOfficerProfile();
    setName(profile.name || "");
    setBadgeNumber(profile.badgeNumber || "");
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
    setNotificationsEnabled(profile.notificationsEnabled !== false); // Default to true
    setIsTwoFactorAuthEnabled(profile.isTwoFactorAuthEnabled || false); // Default to false
  }, []);

  const handleSaveProfile = () => {
    // Save officer profile to local storage
    const profile = {
      name,
      badgeNumber,
      email,
      phone,
      address,
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
      <Card className="max-w-2xl mx-auto bg-cyber-dark border-cyber-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <User className="mr-2 h-5 w-5 inline-block align-middle" />
            Officer Profile
          </CardTitle>
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
              <Label htmlFor="badgeNumber">Badge Number</Label>
              <Input
                id="badgeNumber"
                placeholder="Badge Number"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
          <Button onClick={handleSaveProfile} className="w-full bg-cyber-primary hover:bg-cyber-primary/80">
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
