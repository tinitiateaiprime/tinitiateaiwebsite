import type { NextConfig } from 'next';
const nextConfig:NextConfig={
  output: 'standalone',
  async redirects(){return [
    {source:'/company',destination:'/about',permanent:true},
    {source:'/it-training',destination:'/training',permanent:true},
    {source:'/demos',destination:'/masterclasses',permanent:true},
    {source:'/academy',destination:'/masterclasses',permanent:true},
    {source:'/login',destination:'/masterclasses',permanent:true},
    {source:'/signup',destination:'/masterclasses',permanent:true},
    {source:'/checkout',destination:'/courses',permanent:true},
    {source:'/it-development/:path*',destination:'/services',permanent:true},
    {source:'/remote-consulting/:path*',destination:'/services',permanent:true},
    {source:'/it-career-guidance',destination:'/training',permanent:true},
    {source:'/basics-to-advanced-learning',destination:'/courses',permanent:true},
    {source:'/hands-on-coding-exercises',destination:'/masterclasses',permanent:true},
    {source:'/mock-interviews',destination:'/training',permanent:true},
    {source:'/resume-building',destination:'/training',permanent:true},
    {source:'/job-placement-support',destination:'/training',permanent:true},
    // Temporary until these pages are built (footer links follow the kaushik-branch site).
    {source:'/pricing',destination:'/request-callback?course=Program%20pricing',permanent:false},
    {source:'/training/:slug',destination:'/training',permanent:false},
    {source:'/work-experience-program',destination:'/training',permanent:false},
  ]},
};
export default nextConfig;
