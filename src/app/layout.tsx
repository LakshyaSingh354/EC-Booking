import '../../public/css/bootstrap.min.css';
import '../../public/css/style.css';
import '../../public/css/responsive.css';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "../components/SessionProvider";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Epitome Consulting",
    description: "Consulting services for your business",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" data-theme="light">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
            >
                {/* <Header /> */}
                <SessionProvider>
                    {children}
                </SessionProvider>
                {/* <Footer /> */}
            </body>
        </html>
    );
}
