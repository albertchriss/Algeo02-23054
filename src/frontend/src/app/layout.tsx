import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"], // Use subsets appropriate for your language support
  weight: ["400", "700"], // Add weights you need (e.g., 400 for regular, 700 for bold)
});

export const metadata: Metadata = {
  title: "Micin Kriuk",
  description: "An Image Retrieval and Music Information Retrieval Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-abu-abu">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full min-h-screen">{children}</main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
