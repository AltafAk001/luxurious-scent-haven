
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  accountActivity: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface NotificationSettingsProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export const NotificationSettings = ({ initialSettings, onSave }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
  const { toast } = useToast();

  const handleToggle = (setting: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Types</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="orderUpdates" className="flex-grow">Order Updates</Label>
            <Switch 
              id="orderUpdates" 
              checked={settings.orderUpdates}
              onCheckedChange={() => handleToggle('orderUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="promotions" className="flex-grow">Promotions & Discounts</Label>
            <Switch 
              id="promotions" 
              checked={settings.promotions}
              onCheckedChange={() => handleToggle('promotions')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="newArrivals" className="flex-grow">New Arrivals</Label>
            <Switch 
              id="newArrivals" 
              checked={settings.newArrivals}
              onCheckedChange={() => handleToggle('newArrivals')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="accountActivity" className="flex-grow">Account Activity</Label>
            <Switch 
              id="accountActivity" 
              checked={settings.accountActivity}
              onCheckedChange={() => handleToggle('accountActivity')}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Channels</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="flex-grow">Email Notifications</Label>
            <Switch 
              id="emailNotifications" 
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="smsNotifications" className="flex-grow">SMS Notifications</Label>
            <Switch 
              id="smsNotifications" 
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button variant="dark" onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
};
