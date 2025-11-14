/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app/**/*.{js,jsx,ts,tsx}',
    './App.tsx',
    './main.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir LT Std', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        bebas: ['Bebas Neue', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        avenir: ['Avenir LT Std', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'sas': {
          // Official Singapore American School Brand Colors
          // Primary Colors
          red: {
            50: '#fef2f3',
            100: '#fde3e5',
            200: '#fcc7cc',
            300: '#f99ca5',
            400: '#f56474',
            500: '#eb3549',
            600: '#a0192a', // Official SAS Red (Pantone 187 C)
            700: '#8a1624',
            800: '#6f1420',
            900: '#58111a',
          },
          blue: {
            50: '#f0f3f9',
            100: '#dce3f0',
            200: '#bccce4',
            300: '#8fa9d1',
            400: '#5d80ba',
            500: '#3b61a3',
            600: '#1a2d58', // Official SAS Blue (Pantone 2757 C)
            700: '#16244a',
            800: '#121d3d',
            900: '#0e1830',
          },
          yellow: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fee68a',
            300: '#fed34d',
            400: '#fabc00', // Official Eagle Yellow (Pantone 3514 C)
            500: '#e5af00',
            600: '#ca9a00',
            700: '#a57f00',
            800: '#856500',
            900: '#6b5200',
          },
          // Division Colors
          elementary: {
            DEFAULT: '#228ec2', // Elementary School (Pantone 7689 C)
            light: '#5badd4',
            dark: '#1b6f9a',
          },
          'middle-school': {
            DEFAULT: '#a0192a', // Middle School uses SAS Red
            light: '#c73a4a',
            dark: '#7f1422',
          },
          'high-school': {
            DEFAULT: '#1a2d58', // High School uses SAS Blue
            light: '#384d7a',
            dark: '#141f3d',
          },
          // Legacy Navy (keep for backward compatibility, but use blue going forward)
          navy: {
            50: '#f0f3f9',
            100: '#dce3f0',
            200: '#bccce4',
            300: '#8fa9d1',
            400: '#5d80ba',
            500: '#3b61a3',
            600: '#1a2d58', // Same as SAS Blue
            700: '#16244a',
            800: '#121d3d',
            900: '#0e1830',
          },
          // Accent Colors (extended palette from brand guidelines)
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#009754', // Official Green (Pantone 340 C)
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#c42384', // Official Purple (Pantone 240 C)
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#ee7103', // Official Orange (Pantone 716 C)
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d8dadb', // Official Light Gray (Pantone 427 C)
            400: '#9ca3af',
            500: '#6d6f72', // Official Admin Gray (Pantone 424 C)
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          }
        }
      },
      backgroundColor: {
        'sas-background': '#fafbfc',
        'sas-background-alt': '#f8fafc',
      },
      backgroundImage: {
        'sas-gradient': 'linear-gradient(135deg, #1a2d58 0%, #a0192a 100%)', // Official SAS Blue to Red
        'sas-hero': "url('https://resources.finalsite.net/images/f_auto,q_auto/v1750142054/sas/rwcc7srqzco0i28f9lwo/2018HighSchoolSpiritSCOTTAWOODWARD_DSC0313final_website.jpg')",
      }
    },
  },
  plugins: [],
}
