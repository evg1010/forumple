/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F6E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337'
        },
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar')
  ],
}

