/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '2rem',
        lg: '2.5rem',
        xl: '3rem',
      },
    },
    extend: {
      colors: {
        // Matched from reference screenshots
        cream: {
          DEFAULT: '#F7EBD3',   // warm cream section background
          light: '#FBF3E3',
          deep: '#F0DFB8',
        },
        ink: {
          DEFAULT: '#1A1A70',   // near-black text / bold headings
          soft: '#3D3D73',
        },
        gold: {
          DEFAULT: '#B4791A',   // "LORE" gold / accent headings
          dark: '#8C5E14',
        },
        olive: {
          DEFAULT: '#4C6B3E',   // green accent text ("We've spent years making")
          deep: '#20301C',      // dark green pill / card bg
        },
        coral: {
          DEFAULT: '#E8735C',   // pink/coral gradient + marquee text
          light: '#F2A98F',
        },
        utility: {
          DEFAULT: '#15155A',   // black utility top bar
        },
      },
      fontFamily: {
        display: ['"Archivo"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1440px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        marqueeSlow: 'marquee 45s linear infinite',
      },
      borderRadius: {
        blob: '48% 52% 40% 60% / 55% 45% 55% 45%',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
