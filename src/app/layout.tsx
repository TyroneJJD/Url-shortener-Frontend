import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Url Shortener",
  description: "Acorta tus enlaces de forma rápida y sencilla",
  icons: {
    icon: "/thunder.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
