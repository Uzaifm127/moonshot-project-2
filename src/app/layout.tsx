import "@/styles/globals.css";

import { type Metadata } from "next";
import Header from "@/components/header";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moonshot Project",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <TRPCReactProvider>
          <Header />
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
