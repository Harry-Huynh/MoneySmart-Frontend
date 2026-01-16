import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    //   <body>{children}</body>
    // </html>
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full min-h-svh">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
