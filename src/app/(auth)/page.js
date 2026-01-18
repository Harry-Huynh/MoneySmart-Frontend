import Image from "next/image";
import { GiWallet } from "react-icons/gi";
import { BiSolidBadgeDollar } from "react-icons/bi";
import MessageCard from "../../components/MessageCard";
import { IoShieldCheckmark } from "react-icons/io5";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-8 lg:px-40 max-w-screen mx-auto">
      {/* Header Section */}
      <div className="flex w-full pt-2 items-center justify-between">
        {/* Logo */}
        <Logo />
      </div>

      <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-5">
        {/* Hero Section */}
        <div className="mt-10 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            MoneySmart: Your AI-Powered Financial Companion
          </h2>

          <p className="text-base sm:text-lg mb-8">
            Track your expenses, manage your budget, and get personalized
            financial insights powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start font-semibold">
            <Link
              href="/signup"
              className="bg-[#4f915f] text-white px-6 py-3 rounded-md hover:bg-[#214a2b] transition pointer-cursor"
            >
              Sign Up
            </Link>

            <Link
              href="/login"
              className="shadow-200 bg-white px-8 py-3 rounded-md hover:bg-gray-100 transition pointer-cursor"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="w-full h-full">
          <Image
            src="/phoneScreen.png"
            alt="Phone Screen"
            width={1000}
            height={1000}
          />
        </div>
      </div>

      <div className="flex lg:flex-row flex-col items-center justify-center space-x-5 mb-10">
        <MessageCard
          title="Track Your Income & Expenses"
          subtitle="Easily monitor your income and expenses with our intuitive dashboard."
        >
          <GiWallet size={48} color="#4f915f" />
        </MessageCard>

        <MessageCard
          title="Set Budgets & Goals"
          subtitle="Create and manage budgets and goals to keep your finances on track."
        >
          <BiSolidBadgeDollar size={48} color="#4f915f" />
        </MessageCard>

        <MessageCard
          title="Stay Secure & Private"
          subtitle="Your data is encrypted and protected with top-notch security measures."
        >
          <IoShieldCheckmark size={48} color="#4f915f" />
        </MessageCard>
      </div>
    </main>
  );
}
