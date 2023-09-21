module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	corePlugins: {
		aspectRatio: false,
	},
	// eslint-disable-next-line global-require
	plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/typography')],
};
