import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Provider from "@/hooks/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tgcc workspace",
  description: "tgcc workspace all-in-one ",
  icons:'/icon.svg',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SessionProvider =  await getServerSession(authOptions)
  return (
    <html lang="en">
     
      <body
        className={inter.className}
      >
        <Provider session={SessionProvider}>
        {children}
        </Provider>
        
      </body>
    </html>
  );
}
