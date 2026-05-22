/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ── Allowed external image domains ─────────────────────────────────────────
    remotePatterns: [
      // Supabase Storage — handles all formats: webp, png, jpg, avif, gif
      {
        protocol: "https",
        hostname: "espqrrunhekvjsoxdfbx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Unsplash — placeholder/demo images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // LoremFlickr for 1000 unique images
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      // Allow any supabase project url pattern (future-proof)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Supported formats — add avif for extra compression, keep webp
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
