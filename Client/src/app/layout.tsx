import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import SmoothScroll from "@/components/SmoothScroll";
import { ToastProvider } from "@/components/ui/toast";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AuthProvider from "@/components/AuthProvider";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { VoiceProvider } from "@/contexts/VoiceContext";

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
  title: "Punarchakra | Smart E-Waste Management",
  description: "AI-powered e-waste management platform. Turn your old tech into new possibilities.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
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
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <FavoritesProvider>
                <VoiceProvider>
                  <SmoothScroll>
                    <LayoutWrapper>
                      {children}
                    </LayoutWrapper>
                    <OfflineBanner />
                    <VoiceAssistant />
                  </SmoothScroll>
                </VoiceProvider>
              </FavoritesProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

