// app/(store)/products/[slug]/page.tsx
// Product Detail Page — displays full product info, images, variant selection, and SEO metadata

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Heart, Share2, Copy } from "lucide-react";
import ImageGallery from "@/components/store/image-gallery";
import ProductCard from "@/components/store/product-card";
import ProductInfo from "@/components/store/product-info";
import RecentlyViewed from "@/components/store/recently-viewed";
import Script from "next/script";
import { ProductWithRelationsSerialized } from "@/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── SEO METADATA ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    prisma.storeSettings.findFirst({ select: { storeName: true } }),
  ]);

  if (!product) return {};

  const storeName = settings?.storeName ?? "MiDuka";
  const ogImage = product.images[0]?.url;
  const description =
    product.description?.substring(0, 160) ??
    `Buy ${product.name} at ${storeName}. ${formatCurrency(Number(product.price))}`;

  return {
    title: `${product.name} | ${storeName}`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { where: { isActive: true } },
        // reviews relation included but empty until Stage 6
      },
    }),
    prisma.storeSettings.findFirst({ select: { storeName: true } }),
  ]);

  if (!product) notFound();

  // Fetch related products (same category, different ID)
  const related = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  const priceNum = Number(product.price);
  const comparePriceNum = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const isOutOfStock = product.stockQuantity === 0;

  // Build JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? "",
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "KES",
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  // Serialize product for Client Component
  const serializedProduct: ProductWithRelationsSerialized = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map((v) => ({
      ...v,
      priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
    })),
  } as any;

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Store</Link>
              <span className="mx-2">›</span>
              {product.category ? (
                <>
                  <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
                    {product.category.name}
                  </Link>
                  <span className="mx-2">›</span>
                </>
              ) : null}
              <span className="text-foreground">{product.name}</span>
            </nav>

            <ProductInfo product={serializedProduct} />

            {/* Description */}
            {product.description && (
              <div className="mt-6 prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
              <span className="text-sm font-medium">Share:</span>
              <a
                href={`https://wa.me/?text=Check+out+${encodeURIComponent(product.name)}+at+${encodeURIComponent("https://example.com/products/" + product.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Share on WhatsApp"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy Link"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── RELATED PRODUCTS ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="flex flex-col gap-6 py-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={Number(p.price)}
                  compareAtPrice={p.compareAtPrice ? Number(p.compareAtPrice) : null}
                  primaryImage={p.images[0]?.url ?? null}
                  category={p.category}
                  isOnSale={p.isOnSale}
                  isFeatured={p.isFeatured}
                  createdAt={p.createdAt.toISOString()}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── REVIEWS PLACEHOLDER ──────────────────────────────────────── */}
        <section className="flex flex-col gap-6 py-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
          <div className="p-8 rounded-3xl bg-muted/50 border border-border flex flex-col items-center justify-center text-center gap-3">
            <p className="text-muted-foreground">No reviews yet.</p>
            <p className="font-medium">Be the first to review this product!</p>
          </div>
        </section>

        {/* ─── RECENTLY VIEWED ──────────────────────────────────────────── */}
        <RecentlyViewed />

        {/* Script to add to recently viewed on mount */}
        <Script id="add-to-recently-viewed" strategy="lazyOnload">
          {`
            try {
              const currentSlug = "${slug}";
              let rv = [];
              const stored = localStorage.getItem('recently_viewed');
              if (stored) {
                rv = JSON.parse(stored);
                if (!Array.isArray(rv)) rv = [];
              }
              // Remove if exists, then unshift to front
              rv = rv.filter(s => s !== currentSlug);
              rv.unshift(currentSlug);
              if (rv.length > 8) rv = rv.slice(0, 8);
              localStorage.setItem('recently_viewed', JSON.stringify(rv));
            } catch (e) { console.error('Recently viewed error', e) }
          `}
        </Script>
      </div>
    </>
  );
}
