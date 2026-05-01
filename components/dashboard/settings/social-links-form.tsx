// components/dashboard/settings/social-links-form.tsx
// Social media links configuration

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socialSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
});

type SocialValues = z.infer<typeof socialSchema>;

interface SocialLinksFormProps {
  initialData: any;
}

export function SocialLinksForm({ initialData }: SocialLinksFormProps) {
  const [loading, setLoading] = useState(false);

  const socialLinks = (initialData?.socialLinks as Record<string, string>) || {};

  const form = useForm<SocialValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: socialLinks.facebook || "",
      instagram: socialLinks.instagram || "",
      twitter: socialLinks.twitter || "",
      youtube: socialLinks.youtube || "",
    },
  });

  const onSubmit = async (data: SocialValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialLinks: data }),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      toast.success("Social links updated.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg">Social Media</CardTitle>
        <CardDescription>Connect your store with your social profiles.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1877F2]" />
                      <Input {...field} placeholder="https://facebook.com/..." className="pl-9 rounded-2xl border-border/50 bg-background/50 h-11" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E4405F]" />
                      <Input {...field} placeholder="https://instagram.com/..." className="pl-9 rounded-2xl border-border/50 bg-background/50 h-11" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter (X)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                      <Input {...field} placeholder="https://twitter.com/..." className="pl-9 rounded-2xl border-border/50 bg-background/50 h-11" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF0000]" />
                      <Input {...field} placeholder="https://youtube.com/..." className="pl-9 rounded-2xl border-border/50 bg-background/50 h-11" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="rounded-full px-8 h-11 gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Social Links
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
