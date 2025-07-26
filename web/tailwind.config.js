/**
 * Tailwind CSS configuration file.
 *
 * This file tells Tailwind where to look for class names so it can
 * generate the appropriate styles. We include our source files and
 * HTML entry point. Feel free to extend the theme or add plugins
 * depending on your design requirements.
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#90cdf4',
          DEFAULT: '#4299e1',
          dark: '#2b6cb0'
        },
        secondary: {
          light: '#fbd38d',
          DEFAULT: '#f6ad55',
          dark: '#dd6b20'
        }
      }
    }
  },
  plugins: []
};