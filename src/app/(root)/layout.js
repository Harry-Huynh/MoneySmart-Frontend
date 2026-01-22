import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CustomerTrigger from "@/components/CustomerTrigger";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/authenticate";

export default async function RootLayout({ children }) {
  const authenticated = await isAuthenticated();

  // if (!authenticated) {
  //   redirect("/");
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full min-h-svh">
        <CustomerTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
