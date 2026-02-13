import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CustomerTrigger from "@/components/CustomerTrigger";
import { Toaster } from "sonner";

export default async function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full min-h-svh">
        <CustomerTrigger />
        {children}
      </main>
      <Toaster
        position="top-right"
        closeButton={true}
        richColors={true}
        duration={5000}
      />
    </SidebarProvider>
  );
}
