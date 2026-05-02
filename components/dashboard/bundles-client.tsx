// components/dashboard/bundles-client.tsx
// Client component for managing product bundles in the dashboard

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Package, Plus, Trash2, Info } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InlineConfirmDelete } from "@/components/dashboard/inline-confirm-delete";
import { formatCurrency, cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const bundleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["BUY_X_GET_Y_FREE", "BUY_X_GET_PERCENT_OFF"]),
  buyQuantity: z.coerce.number().min(1, "Must buy at least 1"),
  getQuantity: z.coerce.number().optional(),
  discountPercent: z.coerce.number().optional(),
  productIds: z.array(z.string()).min(1, "Select at least 1 product"),
});

type BundleFormValues = z.infer<typeof bundleSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Bundle {
  id: string;
  name: string;
  type: "BUY_X_GET_Y_FREE" | "BUY_X_GET_PERCENT_OFF";
  buyQuantity: number;
  getQuantity: number | null;
  discountPercent: number | null;
  products: Product[];
}

interface BundlesClientProps {
  initialBundles: Bundle[];
  products: Product[];
}

export function BundlesClient({ initialBundles, products }: BundlesClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: "",
      type: "BUY_X_GET_PERCENT_OFF",
      buyQuantity: 2,
      getQuantity: undefined,
      discountPercent: 10,
      productIds: [],
    },
  });

  const selectedProductIds = form.watch("productIds");
  const selectedType = form.watch("type");

  const onSubmit = async (values: BundleFormValues) => {
    if (values.type === "BUY_X_GET_Y_FREE" && (!values.getQuantity || values.getQuantity < 1)) {
      form.setError("getQuantity", { message: "Please enter a valid free quantity" });
      return;
    }
    if (values.type === "BUY_X_GET_PERCENT_OFF" && (!values.discountPercent || values.discountPercent < 1)) {
      form.setError("discountPercent", { message: "Please enter a valid discount percent" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create bundle");

      toast.success("Bundle created successfully");
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
      const res = await fetch(`/api/dashboard/bundles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete bundle");
      toast.success("Bundle deleted");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bundle Deals</h2>
          <p className="text-muted-foreground font-medium">Encourage multi-item purchases with discounted sets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              New Bundle
            </CardTitle>
            <CardDescription>
              Select products to group together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bundle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Summer Essentials Kit" className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Bundle Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="BUY_X_GET_PERCENT_OFF" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Buy X get Y% off
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="BUY_X_GET_Y_FREE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Buy X get Y free
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buyQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buy Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} className="rounded-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedType === "BUY_X_GET_PERCENT_OFF" ? (
                    <FormField
                      control={form.control}
                      name="discountPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount %</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={100} className="rounded-full" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="getQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} className="rounded-full" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="productIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Products (min 1)</FormLabel>
                      <FormControl>
                        <ScrollArea className="h-[200px] rounded-2xl border p-4">
                          <div className="space-y-3">
                            {products.map((product) => (
                              <div key={product.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`product-${product.id}`}
                                  checked={selectedProductIds.includes(product.id)}
                                  onCheckedChange={(checked) => {
                                    const current = form.getValues("productIds");
                                    if (checked) {
                                      form.setValue("productIds", [...current, product.id]);
                                    } else {
                                      form.setValue(
                                        "productIds",
                                        current.filter((id) => id !== product.id)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`product-${product.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {product.name} ({formatCurrency(product.price)})
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Bundle Deal"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-3xl">
          <CardHeader>
            <CardTitle>Active Bundles</CardTitle>
            <CardDescription>
              Manage your current promotional sets.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-xl border-t bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bundle Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialBundles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No bundles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialBundles.map((bundle) => {
                      return (
                        <TableRow key={bundle.id}>
                          <TableCell className="font-bold">
                            {bundle.name}
                          </TableCell>
                          <TableCell>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {bundle.products.map(p => (
                                <li key={p.id}>• {p.name}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="text-primary font-bold">
                            {bundle.type === "BUY_X_GET_Y_FREE" 
                              ? `Buy ${bundle.buyQuantity}, Get ${bundle.getQuantity} Free`
                              : `Buy ${bundle.buyQuantity}, Get ${bundle.discountPercent}% Off`}
                          </TableCell>
                          <TableCell className="text-right">
                            <InlineConfirmDelete onDelete={() => handleDelete(bundle.id)} />
                          </TableCell>
                        </TableRow>
                      );
                    })
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
