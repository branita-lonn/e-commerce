"use client";

// components/store/product-card.tsx
// Reusable product card for all storefront product grids — rounded-4xl design

import Link from "next/link";

import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProductCardProps } from "@/types";

function isNewProduct(createdAt: string | Date): boolean {
  const created =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return created > cutoff;
}

export default function ProductCard({
  slug,
  name,
  price,
  compareAtPrice,
  primaryImage,
  isOnSale = false,
  stockQuantity = 0,
  createdAt,
  rating = 0,
  reviewCount = 0,
  priority = false,
}: ProductCardProps) {
  const isNew = isNewProduct(createdAt);
  const isOutOfStock = stockQuantity === 0;
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/products/${slug}`}
      className="group relative flex flex-col rounded-4xl bg-card p-3 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/40 hover:border-primary/20"
    >
      {/* Image */}
      <div className="relative rounded-3xl aspect-[4/3] overflow-hidden bg-muted mb-3 flex-shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && discount !== null && (
            <Badge variant="destructive" className="text-xs font-bold px-2 py-0.5">
              -{discount}%
            </Badge>
          )}
          {isNew && !isOnSale && (
            <Badge className="text-xs font-bold px-2 py-0.5">New</Badge>
          )}
        </div>

        {/* Wishlist button — wired in Stage 5 */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-border/50"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="font-semibold text-sm text-foreground line-clamp-1 leading-tight">
          {name}
        </p>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={cn(
              "font-bold text-foreground text-sm",
              isOnSale && "text-destructive"
            )}
          >
            {formatCurrency(price)}
          </span>
          {compareAtPrice !== null &&
            compareAtPrice !== undefined &&
            compareAtPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(compareAtPrice)}
              </span>
            )}
        </div>

        {/* Stars */}
        {(reviewCount > 0 || rating > 0) && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {isOutOfStock && (
          <span className="text-xs text-destructive font-medium">
            Out of Stock
          </span>
        )}
      </div>
    </Link>
  );
}
