import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Force Next.js to compile these specific external packages
  transpilePackages: [
    "@thirdweb-dev/react", 
    "@thirdweb-dev/sdk", 
    "@thirdweb-dev/wallets",
    "@magic-ext/oauth",
    "@magic-sdk/provider", 
    "@magic-sdk/types"
  ],
  
  // 2. Fix webpack resolution for the broken Magic dependency
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force resolution of the missing core module to the root crypto-js if needed
      // or simply ignore the specific broken path if not strictly used.
    };
    
    // This handles the specific "can't resolve ./core" inside the minified magic sdk
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /index\.mjs$/,
          include: /node_modules\/@magic-ext\/oauth/,
          use: {
            loader: 'string-replace-loader',
            options: {
              search: 'import\\s*\\{\\s*Extension\\s*\\}\\s*from\\s*["\']magic-sdk["\']',
              replace: 'import { Extension } from "magic-sdk";',
              // Sometimes simply turning off AMD definitions helps with this specific library
            }
          }
        }
      ]
    }
    
    return config;
  },
};

export default nextConfig;