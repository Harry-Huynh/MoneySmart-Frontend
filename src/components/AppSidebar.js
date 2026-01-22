"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { LuLayoutDashboard } from "react-icons/lu";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineSavings } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { GiWallet } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/authenticate";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transaction",
    icon: FaMoneyBillTransfer,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: GiReceiveMoney,
  },
  {
    title: "Saving Goals",
    url: "/saving-goals",
    icon: MdOutlineSavings,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: IoSettingsOutline,
  },
  {
    title: "Notifications",
    url: "/notification",
    icon: IoMdNotificationsOutline,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await removeToken();
    router.replace("/");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader className="px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <GiWallet size={32} color="#3f915f" />
          <span className="nl-4 mt-2 text-2xl font-semibold">MoneySmart</span>
        </Link>
      </SidebarHeader>
      {/* End Sidebar Header */}

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="
                      pl-6
                      py-5
                      gap-3
                      text-base
                      hover:bg-gray-200
                      data-[active=true]:pl-4
                      data-[active=true]:bg-gray-200
                      data-[active=true]:border-l-8
                  
                      data-[active=true]:border-[#3f915f]"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* End Sidebar Content */}

      {/* Footer */}
      <SidebarFooter className="pb-10 border-t border-gray border-solid">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="pl-6 py-5 gap-3 text-red-600 hover:bg-gray-200 hover:text-red-600 text-base cursor-pointer"
            >
              <IoLogOutOutline />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* End Footer */}
    </Sidebar>
  );
}
