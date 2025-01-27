import type { Config } from 'tailwindcss'
const { fontFamily } = require('tailwindcss/defaultTheme')

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
	],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['lato', ...fontFamily.sans],
        body: ['lato', ...fontFamily.sans],
        display: ['lato', ...fontFamily.sans],
      },
      colors: {
        'chart-1': '#211A22', 
        'chart-2': '#283762',
        'chart-3': '#BAC3E4',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // background: '#BAC3E4',
        // primary: '#AD6205',
        // active: '#AD6205',
        // foreground: '#2f437a',
        
        primary: '#2f437a',
        secondary: '#BAC3E4',
        active: '#AD6205',
        
        background: '#302E2B',
        foreground: '#262522',
 
        
        // background: '#261F27',
        // foreground: '#2E252A',

        // active: '#DC8E08',
        // // primary: '#C96E1F',
        // // primary: '#1F86C9',
        // primary: '#AD6205',
        // white: '#F6DED2',
        // black: '#211A22',


        chessBlack: '#283762',
        chessWhite: '#BAC3E4',
        // secondary: {
        //   DEFAULT: 'hsl(var(--secondary))',
        //   foreground: 'hsl(var(--secondary-foreground))',
        // },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
    // require('daisyui')
  ],
} satisfies Config

export default config
