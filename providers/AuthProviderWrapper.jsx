"use client";

import AuthProvider from "@/rev/AuthContext"; // <-- default export is AuthProvider

export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
