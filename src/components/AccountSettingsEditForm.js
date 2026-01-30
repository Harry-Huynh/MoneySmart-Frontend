"use client";

import { useMemo, useState } from "react";
import { FiSave } from "react-icons/fi";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b last:border-b-0">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function RadioDropdown({ label, value, onValueChange, options }) {
  const current = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-xl cursor-pointer"
        >
          <span className="truncate">{current?.text ?? label}</span>
          <span className="text-gray-400">▾</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[340px]">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.text}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AccountSettingsEditForm() {
  // UI-only dummy values
  const [name, setName] = useState("John Wick");
  const email = "john.wick@myseneca.ca";

  // Keep Date Format
  const [dateFormat, setDateFormat] = useState("mm-dd-yyyy");

  const dateFormatOptions = [
    { value: "mm-dd-yyyy", text: "MM-DD-YYYY (12/31/2025)" },
    { value: "yyyy-mm-dd", text: "YYYY-MM-DD (2025-12-31)" },
    { value: "dd-mm-yyyy", text: "DD-MM-YYYY (31-12-2025)" },
  ];

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          Edit Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your information and preferences below
        </p>
      </div>

      <div className="px-6 py-2">
        <Row label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl"
            placeholder="Enter your name"
          />
        </Row>

        <Row label="Email">
          <div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center text-sm text-gray-700">
            {email}
          </div>
        </Row>

        <Row label="Date Format">
          <RadioDropdown
            label="Date Format"
            value={dateFormat}
            onValueChange={setDateFormat}
            options={dateFormatOptions}
          />
        </Row>
      </div>

      {/* Buttons inside card + cursor-pointer */}
      <div className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
          <Link
            href="/settings/account"
            className="h-12 w-full rounded-2xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition cursor-pointer flex items-center justify-center"
          >
            Cancel
          </Link>

          <Link
            href="/settings/account"
            className="h-12 w-full rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition cursor-pointer inline-flex items-center justify-center"
            >
            <span className="inline-flex items-center gap-2">
                <FiSave className="h-4 w-4" />
                Save Changes
            </span>
            </Link>
        </div>
      </div>
    </div>
  );
}
