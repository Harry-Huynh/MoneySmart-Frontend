"use client";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";
import { TbNotification } from "react-icons/tb";
import { HiOutlineMail } from "react-icons/hi";
import { FiPieChart } from "react-icons/fi";
import { LuPiggyBank } from "react-icons/lu";
import { IoSparklesOutline } from "react-icons/io5";
import { NotificationSettingsToggle } from "@/components/NotificationSettingsToggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/lib/notificationSetting.actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    enableNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    budgetAlerts: true,
    savingsGoalReminders: true,
    aiInsights: true,
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      // Keep default settings if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Used to handle the changes of enableNotifications toggle
  // If enableNotifications is disabled -> disabled all other toggles
  // Else, set enableNotifications to true AND for other toggles, keep them as most recent state
  const handleDisableAllNotifications = (enabled) => {
    setSettings((prev) => {
      if (!enabled) {
        return {
          enableNotifications: false,
          pushNotifications: false,
          emailNotifications: false,
          budgetAlerts: false,
          savingsGoalReminders: false,
          aiInsights: false,
        };
      }
      return {
        ...prev,
        enableNotifications: true,
      };
    });
  };

  // This function is used to update state of each toggle
  // Provide function with the key (toggle Name) and value of toggle (check)
  // If the enableNotification is OFF -> ignore update
  // Else, because each toggle will update a different field but all of them update one settings object
  // Hence, ...prev copies all existing settings then [key]: value will update the value for key given

  const updateSettings = (key, value) => {
    setSettings((prev) => {
      if (!prev.enableNotifications) return prev;
      return { ...prev, [key]: value };
    });
  };

  async function handleSave() {
    try {
      setIsSaving(true);
      await updateNotificationSettings(settings);
      router.push("/settings");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save settings: " + error.message);
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notification settings...</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 select-none">
        <Link
          className="w-full pl-6 mb-5 inline-flex gap-2 items-center text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
          href="/settings"
        >
          <FaArrowLeftLong />
          <p className="">Account Settings</p>
        </Link>
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col gap-2">
          <div className="w-full px-8 py-6 border-b">
            <h1 className="text-2xl font-bold mb-1">Notification Settings</h1>
            <p className="text-sm text-gray-500">
              Manage how you receive alerts, updates, and financial insights
            </p>
          </div>

          <div className="border mx-8 mt-5 px-5 py-3 rounded-md">
            <h2 className="text-xl font-bold">Enable Notifications</h2>
            <p className="text-xs text-gray-500">
              Master control for all notification channels
            </p>
            <div className="w-full mt-3">
              <NotificationSettingsToggle
                icon={<FiBell className="h-5 w-5" />}
                title="Receive Alerts and Reminders"
                description="Turn on to receive all types of notifications"
                checked={settings.enableNotifications}
                onCheckedChange={handleDisableAllNotifications}
              />
            </div>
          </div>
          <div className="border mx-8 mt-5 px-5 py-3 rounded-md">
            <h2 className="text-xl font-bold">Notification Channels</h2>
            <p className="text-xs text-gray-500">
              Choose how you want to be notified
            </p>
            <div className="w-full mt-3">
              <NotificationSettingsToggle
                icon={<TbNotification className="h-5 w-5" />}
                title="Push Notifications"
                description="Receive real-time alerts on your device"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  updateSettings("pushNotifications", checked)
                }
                disabled={!settings.enableNotifications}
              />
              <NotificationSettingsToggle
                icon={<HiOutlineMail className="h-5 w-5" />}
                title="Email Notifications"
                description="Receive email notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  updateSettings("emailNotifications", checked)
                }
                disabled={!settings.enableNotifications}
              />
            </div>
          </div>
          <div className="border mx-8 m-5 px-5 py-3 rounded-md">
            <h2 className="text-xl font-bold">Notification Types</h2>
            <p className="text-xs text-gray-500">
              Granular control over what triggers a notification
            </p>
            <div className="w-full mt-3">
              <NotificationSettingsToggle
                icon={<FiPieChart className="h-5 w-5" />}
                title="Budget Warnings"
                description="Alerts when you approach your spending limits"
                checked={settings.budgetAlerts}
                onCheckedChange={(checked) =>
                  updateSettings("budgetAlerts", checked)
                }
                disabled={!settings.enableNotifications}
              />
              <NotificationSettingsToggle
                icon={<LuPiggyBank className="h-5 w-5" />}
                title="Savings Goal Reminders"
                description="Updates on your progress towards goals"
                checked={settings.savingsGoalReminders}
                onCheckedChange={(checked) =>
                  updateSettings("savingsGoalReminders", checked)
                }
                disabled={!settings.enableNotifications}
              />
              <NotificationSettingsToggle
                icon={<IoSparklesOutline className="h-5 w-5" />}
                title="AI Insights"
                description="Smart tips from our AI"
                checked={settings.aiInsights}
                onCheckedChange={(checked) =>
                  updateSettings("aiInsights", checked)
                }
                disabled={!settings.enableNotifications}
              />
            </div>
          </div>
          <div className="mx-8 mb-5 grid grid-cols-2 gap-5">
            <Link
              href={`/settings`}
              className="border rounded-sm cursor-pointer px-1 py-2 text-center font-bold hover:bg-gray-200"
            >
              Cancel
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="border rounded-sm bg-green-700 text-white font-bold cursor-pointer hover:bg-green-600">
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold text-green-700">
                    Save Current Notification Settings?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will save your new notification settings
                    preference.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isSaving}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
