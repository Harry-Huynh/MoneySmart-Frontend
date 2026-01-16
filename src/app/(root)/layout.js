import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CustomerTrigger from "@/components/CustomerTrigger";

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        {/* <SidebarTrigger className="lg:hidden" /> */}
        <CustomerTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
