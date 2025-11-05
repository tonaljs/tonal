import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renzo's Sound Studio - Learn Music Theory",
  description: "Interactive music theory lessons with audio examples and engaging quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
