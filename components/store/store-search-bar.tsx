// components/store/store-search-bar.tsx
// Client component — expandable search bar for StoreHeader (mobile expand + desktop)

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StoreSearchBar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString().trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setMobileOpen(false);
    }
  }

  return (
    <>
      {/* Desktop search bar — centre column */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center flex-1 max-w-sm mx-4"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="desktop-search"
            name="q"
            type="search"
            placeholder="Search products…"
            className="pl-9 rounded-full bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </form>

      {/* Mobile: icon that reveals full-width search bar */}
      <Button
        id="mobile-search-toggle"
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full"
        aria-label="Open search"
        onClick={() => {
          setMobileOpen(true);
          setTimeout(() => document.getElementById("mobile-search-input")?.focus(), 50);
        }}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Mobile expanded search overlay */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-20 flex items-center gap-2 bg-card border-b border-border px-4 h-16 md:hidden transition-all duration-200",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="mobile-search-input"
              name="q"
              type="search"
              placeholder="Search products…"
              className="pl-9 rounded-full bg-muted border-0 focus-visible:ring-1"
            />
          </div>
        </form>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full flex-shrink-0"
          aria-label="Close search"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
