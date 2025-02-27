"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthProvider baseUrl="http://localhost:3000" basePath="/next/api/auth">{children}</NextAuthProvider>;
}