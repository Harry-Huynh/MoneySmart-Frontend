import React from "react";
import { Switch } from "@/components/ui/switch";

export function NotificationSettingsToggle({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}) {
  return (
    <div className="w-full flex gap-4 py-3 border-b items-center last:border-b-0">
      <div>{icon}</div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300 hover:cursor-pointer"
      ></Switch>
    </div>
  );
}
