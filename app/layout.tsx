import "@mantine/core/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";

import { ColorSchemeScript } from "./color-scheme-script";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { theme } from "./theme";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Header />
          <main className="siteMain">{children}</main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
