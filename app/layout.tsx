import type { Metadata } from "next";
import "../styles/globals.css";
import Provider from "@/hooks/auth";

export const metadata: Metadata = {
  title: "Lines - tgcc ",
  description: "Lines is a collaborative tool for human resources management, designed to streamline employee administration, attendance tracking, and workforce coordination ",
  icons:'/logo.svg',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
