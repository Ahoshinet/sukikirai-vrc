import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "好き嫌いVRC",
    template: "%s | 好き嫌いVRC",
  },
  description: "匿名でバカにするときって自分に当てはまってることを叩くよね",
  metadataBase: new URL("https://www.sukikiraivrc.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "好き嫌いVRC",
    description: "匿名でバカにするときって自分に当てはまってることを叩くよね",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "好き嫌いVRC",
    description: "匿名でバカにするときって自分に当てはまってることを叩くよね",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
