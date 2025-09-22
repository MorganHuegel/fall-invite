import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },

    reactStrictMode: false,

    images: {
        dangerouslyAllowSVG: true,
    },

    async redirects() {
        return [
            {
                source: "/",
                destination: "/invite",
                permanent: true,
            },
        ];
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
