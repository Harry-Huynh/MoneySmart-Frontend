"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSave } from "react-icons/fi";
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
          className="w-full justify-between rounded-xl"
        >
          <span className="truncate">{current?.text ?? label}</span>
          <span className="text-gray-400">▾</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[320px]">
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

export default function AccountSettingsEditPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Read values from query params
  const initialName = sp.get("name") ?? "Emma Lynne";
  const initialEmail = sp.get("email") ?? "emma.lynne@gmail.com";
  const initialLang = sp.get("lang") ?? "fr";
  const initialCurrency = sp.get("currency") ?? "usd";
  const initialDateFormat = sp.get("dateFormat") ?? "mm-dd-yyyy";

  // Editable fields
  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState(initialLang);
  const [currency, setCurrency] = useState(initialCurrency);
  const [dateFormat, setDateFormat] = useState(initialDateFormat);

  const profile = { email: initialEmail };

  const currencyOptions = [
    { value: "usd", text: "$USD - US Dollar" },
    { value: "eur", text: "€EUR - Euro" },
    { value: "gbp", text: "£GBP - British Pound" },
    { value: "cad", text: "$CAD - Canadian Dollar" },
    { value: "aud", text: "$AUD - Australian Dollar" },
  ];

  const languageOptions = [
    { value: "en", text: "English" },
    { value: "fr", text: "French" },
  ];

  const dateFormatOptions = [
    { value: "mm-dd-yyyy", text: "MM-DD-YYYY (12/31/2025)" },
    { value: "yyyy-mm-dd", text: "YYYY-MM-DD (2025-12-31)" },
    { value: "dd-mm-yyyy", text: "DD-MM-YYYY (31-12-2025)" },
  ];

  const onCancel = () => {
    router.push("/settings/account");
  };

  const onSave = () => {
    // UI-only: redirect back with updated query params
    const params = new URLSearchParams({
      name,
      email: profile.email,
      lang: language,
      currency,
      dateFormat,
    });

    router.push(`/settings/account?${params.toString()}`);
  };

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mb-5">
        <Link
          href="/settings/account"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
        >
          ← Account Settings
        </Link>
      </div>

      <div className="mx-auto w-full max-w-5xl">
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
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="h-11 w-full sm:flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center text-sm text-gray-700">
                    {profile.email}
                    </div>

                    <Link
                    href="/settings/account/change-email"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                    Change Email
                    </Link>
                </div>
            </Row>

            <Row label="Password">
                <div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center text-sm text-gray-700">
                    ************
                </div>
            </Row>


            <Row label="Language">
              <RadioDropdown
                label="Language"
                value={language}
                onValueChange={setLanguage}
                options={languageOptions}
              />
            </Row>

            <Row label="Currency">
              <RadioDropdown
                label="Currency"
                value={currency}
                onValueChange={setCurrency}
                options={currencyOptions}
              />
            </Row>

            <Row label="Date Format">
              <RadioDropdown
                label="Date Format"
                value={dateFormat}
                onValueChange={setDateFormat}
                options={dateFormatOptions}
              />
            </Row>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-xl"
                onClick={onCancel}
            >
                Cancel
            </Button>

            <Button
                type="button"
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={onSave}
            >
                <FiSave className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
