import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerHub - Connect. Apply. Get Hired.",
  description: "A modern recruitment platform connecting job seekers and companies through job listings, applications, candidate profiles, and recruitment dashboards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
