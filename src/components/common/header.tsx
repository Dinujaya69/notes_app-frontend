"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/Redex/features/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Notes App
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline">
                Welcome, {user?.username || "User"}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/notes">My Notes</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/logout">Logout</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {pathname !== "/login" && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/pages/auth/login">Login</Link>
                </Button>
              )}
              {pathname !== "/register" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
