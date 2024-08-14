import type { Metadata } from "next";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import Layout from "@components/Layout";

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
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Layout>{children}</Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
