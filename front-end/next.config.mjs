/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
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
};

export default nextConfig;
