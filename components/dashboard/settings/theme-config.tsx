// components/dashboard/settings/theme-config.tsx
// Theme settings: Accent Colour and Typography

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Save, Palette, Type } from "lucide-react";
import { FontChoice } from "@prisma/client";
import { cn } from "@/lib/utils";

const themeSchema = z.object({
  accentColor: z.string(),
  fontChoice: z.nativeEnum(FontChoice),
});

type ThemeValues = z.infer<typeof themeSchema>;

interface ThemeConfigProps {
  initialData: any;
}

const fonts = [
  { value: FontChoice.INTER, label: "Inter", className: "font-inter" },
  { value: FontChoice.POPPINS, label: "Poppins", className: "font-poppins" },
  { value: FontChoice.LATO, label: "Lato", className: "font-lato" },
  { value: FontChoice.NUNITO, label: "Nunito", className: "font-nunito" },
];

export function ThemeConfig({ initialData }: ThemeConfigProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ThemeValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      accentColor: initialData?.accentColor || "#3B82F6",
      fontChoice: initialData?.fontChoice || FontChoice.INTER,
    },
  });

  const onSubmit = async (data: ThemeValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      toast.success("Theme updated successfully.");
      // In a real app, we might need to refresh to apply CSS variables
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accent Colour */}
            <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Accent Colour
                </CardTitle>
                <CardDescription>Primary colour for buttons and highlights.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            {...field}
                            className="h-16 w-16 rounded-xl border-none bg-transparent cursor-pointer overflow-hidden"
                          />
                          <div className="space-y-1">
                            <span className="text-sm font-mono font-bold uppercase">{field.value}</span>
                            <p className="text-xs text-muted-foreground">Click to select a new colour</p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Typography */}
            <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Typography
                </CardTitle>
                <CardDescription>Select the primary font for your store.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="fontChoice"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {fonts.map((font) => (
                            <FormItem key={font.value}>
                              <FormControl>
                                <RadioGroupItem value={font.value} className="sr-only" />
                              </FormControl>
                              <FormLabel className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border/50 bg-background/50 cursor-pointer hover:bg-muted/50 transition-all",
                                field.value === font.value && "border-primary bg-primary/5"
                              )}>
                                <span className={cn("text-lg", font.className)}>{font.label}</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Preview</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="rounded-full px-8 h-11 gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Theme
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
