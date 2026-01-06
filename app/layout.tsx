"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/main.scss";
import { Header } from "./components/layout/header/header";
import { useState, useEffect } from "react";
import logo from "../public/assets/logo-light.png";
import { ScrollToTop } from "./components/UI/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface-50`}>
        {isLoading ? (
          <div className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}>
            <div className="splash-content">
              <div className="logo-wrapper">
                <img
                  src="/assets/logo-light.png"
                  alt="Logo Tiệm Len"
                  className="logo-img"
                />
              </div>
              <div className="loading-container">
                <p className="shop-name text-accent-600">
                  Tiệm Len Handmade
                </p>
                <div className="progress-bar">
                  <div className="progress-fill bg-accent-600"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Header />
            <main className="mt-[10%] py-5">
              {children}
            </main>
            <ScrollToTop />
          </>
        )}
      </body>
    </html>
  );
}