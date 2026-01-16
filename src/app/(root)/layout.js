import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CustomerTrigger from "@/components/CustomerTrigger";

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full min-h-svh">
        {/* <SidebarTrigger className="lg:hidden" /> */}
        <CustomerTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
