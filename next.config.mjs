/** @type {import('next').NextConfig} */
const nextConfig = {
  // If your embedded sites are HTTP-only and you host this portal on HTTPS,
  // browsers may block "mixed content" in the iframe.
  // Ideally host everything on the same scheme, or keep this portal on HTTP in LAN.
  reactStrictMode: true
};

export default nextConfig;
