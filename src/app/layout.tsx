import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "../components/SessionProvider";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

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
		<html lang="en">
			
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Navbar className="top-1" />
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
