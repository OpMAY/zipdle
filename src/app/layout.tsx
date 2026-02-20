import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/ui/side-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Zipdle",
  description: "집들이 밴드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen">
              <SideNav />
              <main className="flex-1 xl:ml-32 pt-16 md:pt-0 transition-all duration-200 ease-in-out">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
