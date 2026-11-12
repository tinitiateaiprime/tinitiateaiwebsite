import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': ['./.kilo/**/*', './.phase1-local/**/*', './.integration-private/**/*', './.academy-private/**/*', './.phase2-local/**/*', './.staging-private/**/*', './vendor/**/*'],
  },
  async redirects() {
    return [
      { source: '/it-training', destination: '/training', permanent: true },
      { source: '/training/it-training', destination: '/training', permanent: true },
      { source: '/training/online-training', destination: '/online-training', permanent: true },
      { source: '/training/new-batches', destination: '/new-batches', permanent: true },
      { source: '/it-development/:path*', destination: '/services', permanent: true },
      { source: '/remote-consulting/:path*', destination: '/services', permanent: true },
      { source: '/about', destination: '/company', permanent: true },
      ...['it-career-guidance', 'mock-interviews', 'resume-building', 'job-placement-support'].map(path => ({ source: `/${path}`, destination: '/job-assistance', permanent: true })),
      { source: '/basics-to-advanced-learning', destination: '/training/beginner-training', permanent: true },
      { source: '/hands-on-coding-exercises', destination: '/real-time-projects', permanent: true },
    ]
  },
  allowedDevOrigins: ['192.168.29.46'],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
