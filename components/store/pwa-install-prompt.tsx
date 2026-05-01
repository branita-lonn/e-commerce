// components/store/pwa-install-prompt.tsx
// Custom PWA install prompt — shows a bottom bar on mobile

"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if user has dismissed it recently (7 days)
      const lastDismissed = localStorage.getItem("pwa-dismissed-at");
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      
      if (!lastDismissed || parseInt(lastDismissed) < sevenDaysAgo) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the PWA install");
    } else {
      console.log("User dismissed the PWA install");
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-dismissed-at", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card border-2 border-primary/20 shadow-2xl rounded-3xl p-4 md:p-6 flex items-center justify-between gap-4 max-w-lg mx-auto backdrop-blur-md bg-card/95">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-sm">Install MiDuka App</p>
            <p className="text-xs text-muted-foreground">
              Add to your home screen for a faster shopping experience.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleInstall}
            className="rounded-2xl text-xs h-9 px-4 shadow-md"
          >
            Install
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
