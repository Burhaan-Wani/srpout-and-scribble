/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatar.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "archive.org",
            },
        ],
    },
};

export default nextConfig;
