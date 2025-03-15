
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserNotificationPreferences } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  initialSettings: UserNotificationPreferences;
  onSave: (settings: UserNotificationPreferences) => void;
}

export const NotificationSettings = ({ initialSettings, onSave }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<UserNotificationPreferences>(initialSettings);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Settings Saved",
      description: "Your notification settings have been updated.",
    });
  };

  const handleChange = (key: keyof UserNotificationPreferences, value: boolean) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Notification Preferences</h2>
        
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Order Updates</div>
              <div className="text-sm text-gray-500">Receive notifications about your orders</div>
            </div>
            <Switch 
              checked={settings.order_updates} 
              onCheckedChange={(checked) => handleChange('order_updates', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Promotions</div>
              <div className="text-sm text-gray-500">Receive notifications about sales and promotions</div>
            </div>
            <Switch 
              checked={settings.promotions} 
              onCheckedChange={(checked) => handleChange('promotions', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Arrivals</div>
              <div className="text-sm text-gray-500">Get updates when new products are available</div>
            </div>
            <Switch 
              checked={settings.new_arrivals} 
              onCheckedChange={(checked) => handleChange('new_arrivals', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Account Activity</div>
              <div className="text-sm text-gray-500">Get notified about important account activities</div>
            </div>
            <Switch 
              checked={settings.account_activity} 
              onCheckedChange={(checked) => handleChange('account_activity', checked)} 
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Communication Channels</h2>
        
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications via email</div>
            </div>
            <Switch 
              checked={settings.email_notifications} 
              onCheckedChange={(checked) => handleChange('email_notifications', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications via SMS</div>
            </div>
            <Switch 
              checked={settings.sms_notifications} 
              onCheckedChange={(checked) => handleChange('sms_notifications', checked)} 
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button variant="dark" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};
