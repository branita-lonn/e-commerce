// file: app/offline/page.tsx
// purpose: Offline fallback page for PWA

"use client";

import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 flex flex-col items-center">
        {/* Logo / Icon */}
        <div className="relative w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-background rounded-full p-1">
            <Image
              src="/icons/icon-192.png"
              alt="MiDuka"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">You're offline</h1>
          <p className="text-muted-foreground">
            Check your internet connection and try again.
          </p>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          size="lg" 
          className="rounded-full font-medium mt-8"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
