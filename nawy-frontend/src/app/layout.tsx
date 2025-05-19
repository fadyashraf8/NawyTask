import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Navbar from "../Components/Navbar/Navbar";
import ToastProvider from "@/Components/ToastProvider/ToastProvider";

export const metadata: Metadata = {
  title: "Nawy Apartments",
  description: "Apartment listing application",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
    
          <Navbar />
          {children}
        <ToastProvider/>
      </body>
    </html>
  );
}