import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Looker Studio 即時報表",
  description: "透過 Google Looker Studio 即時呈現自動更新的資料視覺化",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
