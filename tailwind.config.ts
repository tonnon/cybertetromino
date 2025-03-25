
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cyber: {
					purple: '#8B5CF6',
					pink: '#D946EF',
					blue: '#0EA5E9',
					green: '#10B981',
					red: '#EF4444',
					orange: '#F97316',
					yellow: '#FACC15',
				},
			},
			fontFamily: {
				cyber: ['Orbitron', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1) blur(0px)'
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(1.2) blur(1px)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.9)', opacity: '0' }
				},
				'glow': {
					'0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
					'50%': { filter: 'drop-shadow(0 0 15px currentColor)' }
				},
				'tetris-fall': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'line-clear': {
					'0%': { transform: 'scaleX(1)', opacity: '1' },
					'50%': { transform: 'scaleX(1.1)', opacity: '0.7', filter: 'brightness(2)' },
					'100%': { transform: 'scaleX(0)', opacity: '0' }
				},
				'rotate-tetromino': {
					'0%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(90deg)' },
					'100%': { transform: 'rotate(0deg)' }
				},
				'particle-explosion': {
					'0%': { transform: 'translate(0, 0)', opacity: '1' },
					'100%': { transform: 'translate(var(--x), var(--y))', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'slide-in': 'slide-in 0.5s ease-out forwards',
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'fade-out': 'fade-out 0.3s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'scale-out': 'scale-out 0.3s ease-out forwards',
				'glow': 'glow 2s ease-in-out infinite',
				'tetris-fall': 'tetris-fall 0.5s ease-out forwards',
				'line-clear': 'line-clear 0.5s ease-out forwards',
				'rotate-tetromino': 'rotate-tetromino 0.3s ease-out forwards',
				'particle-explosion': 'particle-explosion 1s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
