/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com"],
        remotePatterns: [
            {
                protocol: 'https',
                //hostname: 'my-blob-store.public.blob.vercel-storage.com',
                hostname: 'cyh6gxiflxb6gfzh.public.blob.vercel-storage.com',
                port: '',
            },
        ]
    }
};

export default nextConfig;
