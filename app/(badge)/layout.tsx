import React from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Badge numérique - TGCC Lines",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#c01c28",
};

const BadgeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
};

export default BadgeLayout;
