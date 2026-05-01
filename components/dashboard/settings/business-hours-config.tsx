// components/dashboard/settings/business-hours-config.tsx
// Interface to set and manage store operational hours.

"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2, Clock } from "lucide-react";

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    open: string;
    close: string;
  };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface BusinessHoursConfigProps {
  initialData: any;
}

export function BusinessHoursConfig({ initialData }: BusinessHoursConfigProps) {
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState<BusinessHours>(initialData?.businessHours || {
    Monday: { isOpen: true, open: "08:00", close: "18:00" },
    Tuesday: { isOpen: true, open: "08:00", close: "18:00" },
    Wednesday: { isOpen: true, open: "08:00", close: "18:00" },
    Thursday: { isOpen: true, open: "08:00", close: "18:00" },
    Friday: { isOpen: true, open: "08:00", close: "18:00" },
    Saturday: { isOpen: true, open: "09:00", close: "15:00" },
    Sunday: { isOpen: false, open: "00:00", close: "00:00" },
  });

  const toggleDay = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const updateTime = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessHours: hours }),
      });

      if (!response.ok) throw new Error("Failed to update hours");

      toast.success("Business hours updated.");
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl">Business Hours</CardTitle>
        <CardDescription>Configure when your store is active and open for orders.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {DAYS.map(day => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/50 gap-4">
              <div className="flex items-center gap-4 min-w-[140px]">
                <Switch 
                  id={`open-${day}`} 
                  checked={hours[day]?.isOpen} 
                  onCheckedChange={() => toggleDay(day)}
                />
                <Label htmlFor={`open-${day}`} className="font-bold text-sm">{day}</Label>
              </div>

              {hours[day]?.isOpen ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input 
                      type="time" 
                      value={hours[day].open}
                      onChange={(e) => updateTime(day, 'open', e.target.value)}
                      className="h-9 w-32 pl-8 rounded-xl border-border/50 bg-background/50" 
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">to</span>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input 
                      type="time" 
                      value={hours[day].close}
                      onChange={(e) => updateTime(day, 'close', e.target.value)}
                      className="h-9 w-32 pl-8 rounded-xl border-border/50 bg-background/50" 
                    />
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider italic">Closed all day</span>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button onClick={onSave} disabled={loading} className="rounded-full px-8 h-11 gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Hours
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
