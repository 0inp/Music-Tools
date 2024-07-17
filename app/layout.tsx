import type { Metadata } from "next";
import Layout from "@/components/Layout";
// import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Music Tools",
  description: "A few music tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
