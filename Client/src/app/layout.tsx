import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import SmoothScroll from "@/components/SmoothScroll";
import { ToastProvider } from "@/components/ui/toast";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart E-Waste Admin",
  description: "Admin Dashboard for Smart E-Waste Bin System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <FavoritesProvider>
              <SmoothScroll>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </SmoothScroll>
            </FavoritesProvider>
          </ToastProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

