"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectWalletButton } from "./connect-wallet-button";
import { NetworkSwitcher } from "./network-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
  { href: "/", label: "Home" },
  { href: "/editor", label: "Editor" },
  { href: "/games", label: "Games" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Code className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] group-hover:drop-shadow-[0_0_12px_hsl(var(--primary))] transition-all duration-300" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
              Jeu Plaza
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-300 hover:text-primary group",
                    pathname === route.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                  {/* Active indicator */}
                  {pathname === route.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  )}
                  {/* Hover effect */}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <ConnectWalletButton />
              <NetworkSwitcher />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-border/50">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                      <Code className="h-6 w-6 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
                      <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Jeu Plaza
                      </h1>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="p-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-4 py-6 flex-1">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-card/50 hover:shadow-lg group",
                          pathname === route.href
                            ? "text-primary bg-primary/10 border border-primary/20 shadow-lg"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          pathname === route.href
                            ? "bg-primary animate-pulse"
                            : "bg-muted-foreground/30 group-hover:bg-primary/50"
                        )} />
                        {route.label}
                      </Link>
                    ))}
                  </div>

                  {/* Wallet Controls */}
                  <div className="border-t border-border/50 pt-6 space-y-4">
                    <div className="px-4">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Web3 Connection</p>
                      <div className="space-y-3">
                        <ConnectWalletButton />
                        <NetworkSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}