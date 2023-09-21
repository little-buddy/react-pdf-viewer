module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {},
	},
	corePlugins: {
		aspectRatio: false,
		preflight: false,
	},
	// eslint-disable-next-line global-require
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
	],
};
