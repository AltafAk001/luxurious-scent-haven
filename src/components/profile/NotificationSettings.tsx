
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageCircle } from "lucide-react";

export interface UserNotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  accountActivity: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface NotificationSettingsProps {
  initialSettings: UserNotificationPreferences;
  onSave: (settings: UserNotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  initialSettings, 
  onSave 
}) => {
  const [settings, setSettings] = React.useState<UserNotificationPreferences>(initialSettings);

  const handleToggle = (key: keyof UserNotificationPreferences) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
        <p className="text-gray-500 text-sm mb-6">
          Manage what notifications you receive from Nigedum
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Bell size={18} />
              <span>Push Notifications</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Order Updates</div>
                  <div className="text-sm text-gray-500">Receive updates about your orders</div>
                </div>
                <Switch 
                  checked={settings.orderUpdates} 
                  onCheckedChange={() => handleToggle('orderUpdates')} 
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Promotions & Offers</div>
                  <div className="text-sm text-gray-500">Get notified about special deals and offers</div>
                </div>
                <Switch 
                  checked={settings.promotions} 
                  onCheckedChange={() => handleToggle('promotions')} 
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">New Arrivals</div>
                  <div className="text-sm text-gray-500">Be the first to know about new products</div>
                </div>
                <Switch 
                  checked={settings.newArrivals} 
                  onCheckedChange={() => handleToggle('newArrivals')} 
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Account Activity</div>
                  <div className="text-sm text-gray-500">Get notified about account security and updates</div>
                </div>
                <Switch 
                  checked={settings.accountActivity} 
                  onCheckedChange={() => handleToggle('accountActivity')} 
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Mail size={18} />
              <span>Email Notifications</span>
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive notifications via email</div>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={() => handleToggle('emailNotifications')} 
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle size={18} />
              <span>SMS Notifications</span>
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-500">Receive notifications via SMS</div>
              </div>
              <Switch 
                checked={settings.smsNotifications} 
                onCheckedChange={() => handleToggle('smsNotifications')} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} variant="dark">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
