import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Bid Management System",
  description: "Manage construction bids, subcontractors, and project tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
