/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/auth/login",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_Backend_URL || "http://localhost:8000";
    const apiBase = baseUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/booking/create",
        destination: `${apiBase}/api/booking/create`,
      },
    ];
  },
};

export default nextConfig;
