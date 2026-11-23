/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old slug from when the project was still in progress.
      {
        source: "/work/a-star-algorithm-pathfinding-in-progress",
        destination: "/work/a-star-pathfinding",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
