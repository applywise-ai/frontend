'use client';

import { Geist, Geist_Mono } from "next/font/google";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardFooter from "./components/DashboardFooter";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isDashboardPage, shouldHideNavbar } from "./utils/navigation";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GlobalNotification } from "./components/ui/GlobalNotification";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ApplicationsProvider } from "./contexts/ApplicationsContext";
import { JobsProvider } from "./contexts/JobsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ReviewApplicationModalProvider } from "./contexts/ReviewApplicationModalContext";
import { RecommenderProvider } from "./contexts/RecommenderContext";
import DynamicThemeColor from "./components/DynamicThemeColor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = shouldHideNavbar(pathname);
  const isDashboard = isDashboardPage(pathname);
  const noScrollPage = pathname === '/jobs' || pathname === '/profile';
  const [layoutLoading, setLayoutLoading] = useState(true);

  // Simulate layout loading
  useEffect(() => {
    // Short timeout to simulate initial layout loading
    const timer = setTimeout(() => {
      setLayoutLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Applywise Jobs</title>
        <link rel="icon" href="/images/logo_icon_dark.svg" />
        <link rel="shortcut icon" href="/images/logo_icon_dark.svg" />
        <link rel="apple-touch-icon" href="/images/logo_icon_dark.svg" />
        
        {/* Initial meta tags for mobile status bar - will be updated dynamically */}
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-gray-50 ${noScrollPage ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col`}
      >
        <AuthProvider>
          <NotificationProvider>
            <ProfileProvider>
              <JobsProvider>
                <ApplicationsProvider>
                  <RecommenderProvider>
                    <ReviewApplicationModalProvider>
                      <DynamicThemeColor />
                      <Navbar isLoading={layoutLoading} />
                      <GlobalNotification />
                      <main className={`${isAuthPage ? '' : 'pt-16'} ${noScrollPage ? 'flex-1 overflow-hidden' : 'flex-grow'}`}>
                        {children}
                      </main>
                      {isAuthPage || noScrollPage ? null : isDashboard ? <DashboardFooter /> : <Footer />}
                    </ReviewApplicationModalProvider>
                  </RecommenderProvider>
                </ApplicationsProvider>
              </JobsProvider>
            </ProfileProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
