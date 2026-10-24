import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ['better-sqlite3'],
  reactStrictMode: true,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/manage/elantheadmin/waitlist',
        destination: '/manage.elantheadmin.waitlist',
      },
    ];
  },
};

export default nextConfig;
