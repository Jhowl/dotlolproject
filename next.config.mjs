/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/apps/dota2/images/team_logos/**',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/ugc/**',
      },
    ]
  }
};

export default nextConfig;
