"use client";

/**
 * /wishlist — customer's saved items.
 *
 * Three render states:
 *   1. Not logged in            → "Sign in to view your wishlist" + CTA
 *   2. Logged in but empty list → "No saved items yet" + browse CTA
 *   3. Logged in with items     → grid of cards with remove buttons
 */

import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client/react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  CLEAR_WISHLIST,
  GET_MY_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "@/lib/graphql/wishlist";
import {
  ClearWishlistData,
  MyWishlistData,
  RemoveFromWishlistData,
} from "@/types/wishlist.types";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils/currency";

export default function WishlistPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const { data, loading, error } = useQuery<MyWishlistData>(GET_MY_WISHLIST, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const [removeFromWishlist, { loading: removing }] =
    useMutation<RemoveFromWishlistData>(REMOVE_FROM_WISHLIST, {
      refetchQueries: [{ query: GET_MY_WISHLIST }],
      onError: (err) => toast.error(`Could not remove: ${err.message}`),
    });

  const [clearWishlist, { loading: clearing }] =
    useMutation<ClearWishlistData>(CLEAR_WISHLIST, {
      refetchQueries: [{ query: GET_MY_WISHLIST }],
      onCompleted: () => toast.success("Wishlist cleared"),
      onError: (err) => toast.error(`Could not clear: ${err.message}`),
    });

  if (!isAuthed) {
    return <SignedOutView />;
  }

  if (loading && !data) {
    return <LoadingSkeleton />;
  }

  // The customer-only guard returns ForbiddenException for non-customer
  // users (admin/seller). Surface that as a friendly message instead of
  // a blank screen.
  if (error && !data) {
    return (
      <CenteredEmpty
        title="Wishlist unavailable"
        body={
          error.message.includes("customer")
            ? "Wishlists are only available on customer accounts. Sign in with a customer account to use this page."
            : error.message
        }
      />
    );
  }

  const items = data?.myWishlist?.items ?? [];

  if (items.length === 0) {
    return <EmptyView />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-5 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <button
          type="button"
          onClick={() => clearWishlist()}
          disabled={clearing}
          className="text-sm text-foreground/60 hover:text-destructive transition disabled:opacity-60"
        >
          {clearing ? "Clearing..." : "Clear all"}
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it) => {
          const product = it.product;
          if (!product) return null;
          const primary =
            product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
          const onSale =
            product.compareAtPrice != null &&
            Number(product.compareAtPrice) > Number(product.price);
          return (
            <article
              key={it.id}
              className="group relative rounded-lg border bg-card overflow-hidden flex flex-col"
            >
              <Link
                href={`/product/${product.slug}`}
                className="relative aspect-square bg-muted overflow-hidden block"
              >
                {primary ? (
                  <Image
                    src={primary.imageUrl}
                    alt={primary.altText ?? product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
                )}
              </Link>

              <div className="p-4 flex-1 flex flex-col">
                {product.category?.name && (
                  <div className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold">
                    {product.category.name}
                  </div>
                )}
                <Link href={`/product/${product.slug}`} className="mt-1 block">
                  <h3 className="text-sm font-semibold tracking-tight line-clamp-2 hover:underline">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-base font-semibold ${
                        onSale ? "text-sale" : "text-foreground"
                      }`}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {onSale && product.compareAtPrice != null && (
                      <span className="text-xs text-foreground/40 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist({
                        variables: { input: { productId: product.id } },
                      })
                    }
                    disabled={removing}
                    aria-label="Remove from wishlist"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-foreground/60 hover:text-destructive hover:border-destructive transition disabled:opacity-60"
                  >
                    {removing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SignedOutView() {
  return (
    <CenteredEmpty
      title="Sign in to view your wishlist"
      body="Save the products you love and pick up where you left off across devices."
      cta={{ href: "/login?next=/wishlist", label: "Sign in" }}
      secondaryCta={{ href: "/register", label: "Create an account" }}
    />
  );
}

function EmptyView() {
  return (
    <CenteredEmpty
      title="Your wishlist is empty"
      body="Tap the heart on any product to save it for later."
      cta={{ href: "/shop", label: "Browse the shop" }}
    />
  );
}

function CenteredEmpty({
  title,
  body,
  cta,
  secondaryCta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <Heart className="mx-auto h-10 w-10 text-foreground/30" />
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60">{body}</p>
      {(cta || secondaryCta) && (
        <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
            >
              {cta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold text-foreground/80 hover:border-foreground/40 transition"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
