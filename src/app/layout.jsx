import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Match Statistics Analyzer: Analyze Average Match Duration, Total Matches, and Score | dotlol.jhowl.com",
  description: "Discover in-depth match statistics, including average duration, total matches, and score across intervals. Explore data analyses and insights to enhance your understanding of match performance and trends at dotlol.jhowl.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
