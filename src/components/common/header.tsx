"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  logout,
} from "@/Redex/features/authSlice";
import { AppDispatch } from "@/Redex/store/store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter(); 
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();


  const handleLogout = () => {
    dispatch(logout());
    router.push("/pages/auth/login"); 
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Notes App
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {pathname !== "/pages/auth/login" && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/pages/auth/login">Login</Link>
                </Button>
              )}
              {pathname !== "/pages/auth/register" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/pages/auth/register">Register</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
