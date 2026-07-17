import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Altana Demo",
  description: "Altana Demo",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Script
          id="superflowToolbarScript"
          src="https://cdn.velt.dev/lib/superflow.js?apiKey=aU1MxKP0rca2UXwKi8bl&projectId=710116242699950"
          strategy="afterInteractive"
          data-sf-platform="other-manual"
        />
      </body>
    </html>
  );
}
