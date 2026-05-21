/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ── Supabase Storage (product images uploaded by admins) ──────────────────
      {
        protocol: "https",
        hostname: "espqrrunhekvjsoxdfbx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // ── Unsplash (placeholder/demo images) ────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
