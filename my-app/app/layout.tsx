import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "高级科学计算器 | Advanced Calculator",
  description: "支持标准计算、科学计算、程序员计算和微积分计算的高级计算器",
  keywords: ["calculator", "scientific", "math", "calculus", "programmer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
