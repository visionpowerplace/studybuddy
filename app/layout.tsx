
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Buddy — Patient AI Tutor",
  description: "Explain any topic in 3 layers: Simple Analogy, Core Explanation, Quick Quiz. Feynman technique + active recall.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FFFEF8] text-zinc-900">{children}</body>
    </html>
  );
}
