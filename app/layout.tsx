import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOAT Fitness",
  description: "The greatest fitness tracker ever built.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}