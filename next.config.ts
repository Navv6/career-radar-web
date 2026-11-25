import type { NextConfig } from 'next';
const config: NextConfig = { output:'export', basePath:'/career-radar-web', trailingSlash:true, images:{unoptimized:true}, productionBrowserSourceMaps:false };
export default config;
