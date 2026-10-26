import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/authServer";
import { preloadAuthQuery } from "@/lib/authServer";

import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Header, WorkspaceProvider } from "../components/custom";
import { Toaster } from "@/components/ui/toast";
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
  const preloadedUserQuery = await preloadAuthQuery(api.auth.getCurrentUser);
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
              <WorkspaceProvider>
                <div className="flex flex-col min-h-svh">
                  <Header preloadedUserQuery={preloadedUserQuery} />
                  <main className="flex-1 flex flex-col">{children}</main>
                  <Footer />
                </div>
              </WorkspaceProvider>
            </ConvexClientProvider>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
