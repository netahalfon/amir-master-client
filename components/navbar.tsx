"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import LogoutModal from "@/components/logout-modal";
import axiosInstance, { REQUESTS } from "@/lib/axios"


const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Word Notebook", href: "/protected/word-notebook" },
  { name: "Word Practice", href: "/protected/word-practice" },
  { name: "Sentence Completion", href: "/protected/sentence-completion" },
  { name: "Rephrasing", href: "/protected/rephrasing" },
  { name: "Reading", href: "/protected/reading" },
  { name: "Simulations", href: "/protected/simulations" },
  { name: "Progress", href: "/protected/progress" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutButton = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      //setAuth
      await axiosInstance.post(REQUESTS.LOGOUT);
      setShowLogoutModal(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-950 dark:bg-blue-900">
      <div className="container flex h-16 items-center justify-between">
        {/* לוגו ושם */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/transperent_white_app_icon.png"
              alt="Logo"
              width={40}
              height={40}
              className="hidden md:block"
            />
            <span className="text-xl font-bold text-white">AmirMaster</span>
          </Link>
        </div>

        {/* תפריט למסכים גדולים */}
        <nav className="hidden lg:flex items-center gap-6">
          <>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white/80",
                  pathname === item.href ? "text-white" : "text-white/60"
                )}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogoutButton}
              className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
            >
              Log out
            </button>
          </>
        </nav>

        {/* כפתור המבורגר למסכים קטנים */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* תפריט צדדי (נפתח/נסגר) */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-blue-950 dark:bg-blue-900 flex flex-col items-start gap-4 px-6 py-4 lg:hidden shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  pathname === item.href ? "text-white" : "text-white/60"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogoutButton}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        )}

        {showLogoutModal && (
          <LogoutModal
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}

        {/* מצב כהה */}
        <div className="hidden lg:flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
