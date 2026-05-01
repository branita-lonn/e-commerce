// components/dashboard/flash-sales-client.tsx
// Client component for managing flash sales in the dashboard

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Zap, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineConfirmDelete } from "@/components/dashboard/inline-confirm-delete";
import { formatCurrency, cn } from "@/lib/utils";

const flashSaleSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  salePrice: z.coerce.number().positive("Price must be positive"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
  message: "Start time must be before end time",
  path: ["endTime"],
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
}

interface FlashSale {
  id: string;
  productId: string;
  salePrice: number;
  startTime: string | Date;
  endTime: string | Date;
  product: {
    name: string;
    price: number;
  };
}

interface FlashSalesClientProps {
  initialFlashSales: FlashSale[];
  products: Product[];
}

export function FlashSalesClient({ initialFlashSales, products }: FlashSalesClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FlashSaleFormValues>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      productId: "",
      salePrice: 0,
      startTime: "",
      endTime: "",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const onSubmit = async (values: FlashSaleFormValues) => {
    if (selectedProduct && values.salePrice >= selectedProduct.price) {
      form.setError("salePrice", { message: "Sale price must be lower than original price" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create flash sale");

      toast.success("Flash sale created successfully");
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/flash-sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete flash sale");
      toast.success("Flash sale deleted");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(message);
    }
  };

  const getStatusBadge = (startTime: string | Date, endTime: string | Date) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < now) {
      return <Badge variant="secondary" className="rounded-full">Expired</Badge>;
    }
    if (start > now) {
      return <Badge variant="outline" className="rounded-full text-blue-600 border-blue-600">Scheduled</Badge>;
    }
    return <Badge className="rounded-full bg-green-600 hover:bg-green-700">Active</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flash Sales</h2>
          <p className="text-muted-foreground font-medium">Set a limited-time price on any product.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Create Flash Sale
            </CardTitle>
            <CardDescription>
              Schedule a new discount period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-full">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl">
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({formatCurrency(p.price)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price (KES)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 500"
                          className="rounded-full"
                          {...field}
                        />
                      </FormControl>
                      {selectedProduct && (
                        <FormDescription>
                          Original: {formatCurrency(selectedProduct.price)}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Flash Sale"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-3xl">
          <CardHeader>
            <CardTitle>Existing Flash Sales</CardTitle>
            <CardDescription>
              All scheduled and past flash sales.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-xl border-t bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Original</TableHead>
                    <TableHead>Sale</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialFlashSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No flash sales found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialFlashSales.map((fs) => (
                      <TableRow key={fs.id}>
                        <TableCell className="font-medium">
                          {fs.product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground line-through">
                          {formatCurrency(fs.product.price)}
                        </TableCell>
                        <TableCell className="text-primary font-bold">
                          {formatCurrency(fs.salePrice)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(fs.startTime), "dd MMM, HH:mm")}
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(fs.endTime), "dd MMM, HH:mm")}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(fs.startTime, fs.endTime)}
                        </TableCell>
                        <TableCell className="text-right">
                          <InlineConfirmDelete onDelete={() => handleDelete(fs.id)} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
