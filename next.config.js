// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
		return [
			{
				source: "/reson/:path*",
				destination:
					"https://resonapi.uarl.in/:path*",
					// "http://localhost:4000/:path*",
			},
		];
	},
}

module.exports = nextConfig
