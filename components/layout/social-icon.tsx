"use client";

import { useEffect, useState } from "react";
import {
  Apple,
  AtSign,
  Bell,
  BookOpen,
  Camera,
  ExternalLink,
  Globe,
  Headphones,
  Heart,
  Link,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Newspaper,
  Phone,
  Podcast,
  Radio,
  Rss,
  Send,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Signal,
  Smartphone,
  Star,
  Store,
  Tv,
  Video,
  type LucideIcon,
} from "lucide-react";

/**
 * Renders a footer social/menu icon from an admin-typed Lucide icon name.
 *
 * The footer used to `import * as LucideIcons` to resolve arbitrary names,
 * which shipped all ~1,900 icons (≈150 KB gzipped) to every storefront page.
 * Now:
 *  - common names resolve from the static imports below (no extra JS);
 *  - brand names resolve straight to the generic Link glyph — lucide-react has
 *    no brand icons, so that is exactly what the full-library lookup returned;
 *  - any other name lazily loads the full icon set once and renders the same
 *    icon as before (the Link glyph shows until that chunk arrives).
 */
const COMMON_ICONS: Record<string, LucideIcon> = {
  Apple,
  AtSign,
  Bell,
  BookOpen,
  Camera,
  ExternalLink,
  Globe,
  Headphones,
  Heart,
  Link,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Newspaper,
  Phone,
  Podcast,
  Radio,
  Rss,
  Send,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Signal,
  Smartphone,
  Star,
  Store,
  Tv,
  Video,
};

// Brand names admins typically enter. None of these is exported by the
// installed lucide-react (it ships no brand icons), so the old lookup always
// fell back to Link for them — resolve that without loading the library.
// If lucide-react is ever upgraded, re-check this list against its exports.
const BRAND_NAMES_WITHOUT_ICON = new Set([
  "Amazon", "Android", "Behance", "Bluesky", "Discord", "Dribbble", "Etsy",
  "Facebook", "Flickr", "Github", "GitHub", "Gitlab", "GitLab", "Google",
  "Instagram", "Line", "Linkedin", "LinkedIn", "Mastodon", "Medium",
  "Messenger", "Patreon", "Paypal", "PayPal", "Pinterest", "Quora", "Reddit",
  "Skype", "Snapchat", "Soundcloud", "SoundCloud", "Spotify", "Telegram",
  "Threads", "Tiktok", "TikTok", "Tumblr", "Twitch", "Twitter", "Viber",
  "Vimeo", "Wechat", "WeChat", "Whatsapp", "WhatsApp", "Youtube", "YouTube",
]);

export function SocialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const known = COMMON_ICONS[name];
  const needsLookup = !!name && !known && !BRAND_NAMES_WITHOUT_ICON.has(name);
  const [looked, setLooked] = useState<{ name: string; Icon: LucideIcon | null } | null>(null);

  useEffect(() => {
    if (!needsLookup) return;
    let live = true;
    void import("lucide-react").then((lucide) => {
      const Icon = (lucide as unknown as Record<string, LucideIcon | undefined>)[name];
      if (live) setLooked({ name, Icon: Icon ?? null });
    });
    return () => {
      live = false;
    };
  }, [name, needsLookup]);

  const Icon =
    known ?? (looked?.name === name ? looked.Icon : null) ?? Link;
  return <Icon className={className} />;
}
