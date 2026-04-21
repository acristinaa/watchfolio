"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Film, LayoutDashboard, List, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  user: User;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: List },
  { href: "/search", label: "Search", icon: Film },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-xl">
            <span>Watchfolio</span>
          </Link>

          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                    aria-current={pathname === href ? "page" : undefined}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
            aria-label="Sign out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:block">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
