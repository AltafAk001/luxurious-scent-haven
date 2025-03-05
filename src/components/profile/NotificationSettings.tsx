
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useUserNotificationPreferences, 
  useUpdateUserNotificationPreferences,
  UserNotificationPreferences
} from "@/services/user.service";

export interface NotificationSettingsProps {
  initialSettings: UserNotificationPreferences;
  onSave: (settings: UserNotificationPreferences) => void;
}

export const NotificationSettings = ({ initialSettings, onSave }: NotificationSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserNotificationPreferences>(initialSettings);
  
  // React Query hooks
  const { data: userPreferences } = useUserNotificationPreferences(user?.id || "");
  const updatePreferences = useUpdateUserNotificationPreferences();
  
  // Use server data if available
  React.useEffect(() => {
    if (userPreferences) {
      setSettings(userPreferences);
    }
  }, [userPreferences]);

  const handleToggle = (key: keyof UserNotificationPreferences) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSave = async () => {
    if (user) {
      try {
        // Update preferences in Supabase
        await updatePreferences.mutateAsync({
          userId: user.id,
          preferences: settings
        });
        
        // Call the onSave prop (for local state updates if needed)
        onSave(settings);
        
        toast({
          title: "Notification Settings Updated",
          description: "Your notification preferences have been saved.",
        });
      } catch (error) {
        console.error("Error updating notification settings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update notification settings. Please try again.",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose what notifications you receive and how you receive them
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium">Types of Notifications</h3>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Order Updates</div>
              <p className="text-sm text-gray-500">Receive updates about your orders</p>
            </div>
            <Switch 
              checked={settings.order_updates} 
              onCheckedChange={() => handleToggle("order_updates")} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Promotions</div>
              <p className="text-sm text-gray-500">Receive information about deals and promotions</p>
            </div>
            <Switch 
              checked={settings.promotions} 
              onCheckedChange={() => handleToggle("promotions")} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">New Arrivals</div>
              <p className="text-sm text-gray-500">Be notified about new products</p>
            </div>
            <Switch 
              checked={settings.new_arrivals} 
              onCheckedChange={() => handleToggle("new_arrivals")} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Account Activity</div>
              <p className="text-sm text-gray-500">Receive updates about your account</p>
            </div>
            <Switch 
              checked={settings.account_activity} 
              onCheckedChange={() => handleToggle("account_activity")} 
            />
          </div>
        </div>
        
        <div className="pt-4 space-y-4">
          <h3 className="font-medium">Notification Methods</h3>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Email Notifications</div>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch 
              checked={settings.email_notifications} 
              onCheckedChange={() => handleToggle("email_notifications")} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <Switch 
              checked={settings.sms_notifications} 
              onCheckedChange={() => handleToggle("sms_notifications")} 
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          variant="dark" 
          onClick={handleSave}
          disabled={updatePreferences.isPending}
        >
          {updatePreferences.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
