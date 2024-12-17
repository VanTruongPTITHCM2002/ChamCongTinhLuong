/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['localhost'], // Thêm domain 'localhost' vào đây
      },
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            localStorage: false,
          };
          
        }
        return config;
      },
      
};



export default nextConfig;
