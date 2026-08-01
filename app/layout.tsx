import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdThemeProvider } from "@/context/AntdThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T99 BarberShop - Admin Portal",
  description: "Hệ thống Quản trị & Cấu hình Website T99 Barbershop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 p-0">
        <AntdThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </AntdThemeProvider>
      </body>
    </html>
  );
}
