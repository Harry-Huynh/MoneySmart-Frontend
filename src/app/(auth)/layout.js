import { isAuthenticated } from "@/lib/authenticate";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
