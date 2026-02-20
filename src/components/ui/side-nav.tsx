"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Music,
  Calendar,
  Menu,
  X,
  Lightbulb,
  ListMusic,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const links = [
  { name: "대시보드", href: "/", icon: Home },
  { name: "멤버 관리", href: "/members", icon: Users },
  { name: "합주곡", href: "/repertoire", icon: Music },
  { name: "일정", href: "/schedule", icon: Calendar },
  { name: "셋리스트", href: "/setlists", icon: ListMusic },
  { name: "곡 추천", href: "/ideas", icon: Lightbulb },
  { name: "게시판", href: "/board", icon: ClipboardList },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-primary hover:bg-muted rounded-md transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold text-primary tracking-widest">
            ZIPDLE
          </span>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
          },
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-border relative">
          <h1 className="text-2xl font-bold text-primary tracking-widest">
            ZIPDLE
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 p-2 text-primary md:hidden hover:bg-muted rounded-md transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-8 overflow-y-auto">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)} // Close menu on click (mobile)
                className={clsx(
                  "relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-300 mb-1 z-10",
                  {
                    "text-primary-foreground shadow-sm": isActive,
                    "text-foreground hover:bg-muted hover:text-foreground":
                      !isActive,
                  },
                )}
              >
                {/* Background active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <LinkIcon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between px-3 py-3">
            {status === "loading" ? (
              <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
            ) : session ? (
              <div className="flex items-center gap-3 w-full">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                    {session.user?.name?.[0] || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <Link
                    href="/profile"
                    className="font-medium text-foreground truncate text-sm hover:underline hover:text-primary transition-colors block w-full text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    {session.user?.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link
                      href="/profile"
                      className="text-[11px] text-muted-foreground hover:text-primary transition-colors text-left"
                      onClick={() => setIsOpen(false)}
                    >
                      내 정보
                    </Link>
                    <span className="text-muted-foreground text-[10px]">•</span>
                    <button
                      onClick={() => signOut()}
                      className="text-[11px] text-muted-foreground hover:text-destructive transition-colors text-left"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => signIn("kakao")}
                  className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-black/85 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  카카오 로그인
                </button>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
