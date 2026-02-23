import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chitti AI - AI Voice Sales Assistant",
  description:
    "AI voice assistant that answers your calls, qualifies leads, and tells you exactly what each caller is willing to pay.",
  keywords: [
    "AI",
    "voice assistant",
    "sales",
    "lead qualification",
    "call answering",
  ],
  openGraph: {
    title: "Chitti AI - Every missed call is a missed deal",
    description:
      "AI voice assistant that catches calls and qualifies leads for service businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
