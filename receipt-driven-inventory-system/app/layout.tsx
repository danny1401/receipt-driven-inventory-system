import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";
import { getToken } from "@/lib/authServer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Receipt-Driven Inventory System",
  description:
    "Turn supplier receipts into live inventory. AI reads every line item, flags anything uncertain, and keeps your stock counts current.",
  icons: {
    icon: "/convex.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <Toaster>
            <ConvexClientProvider initialToken={token}>
              <div className="flex flex-col min-h-svh">
                {children}
              </div>
            </ConvexClientProvider>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
