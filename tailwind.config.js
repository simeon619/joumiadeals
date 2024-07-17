/** @type {import('tailwindcss').Config} */
export const darkMode = ['class'];
export const content = [
	'./pages/**/*.{ts,tsx}',
	'./components/**/*.{ts,tsx}',
	'./app/**/*.{ts,tsx}',
	'./src/**/*.{ts,tsx}',
];
export const prefix = '';
export const theme = {
	container: {
		center: true,
		padding: '2rem',
		screens: {
			'2xl': '1400px',
		},
	},
	extend: {
		colors: {
			border: 'hsl(var(--border))',
			primary: 'rgb(101 163 13)',
			filt : "#1D3A8A",
			// primary: '#115570',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			firstColor: '#115570',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			// primary: {
			// 	DEFAULT: 'hsl(var(--primary))',
			// 	foreground: 'hsl(var(--primary-foreground))',
			// },
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))',
			},
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
		width: {
			app: '1040px',
		},
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
			bebasneue: ['BebasNeue', 'sans-serif'],
			poppins: ['Poppins', 'sans-serif'],
			gamjaflower: ['GamjaFlower', 'cursive'],
			BlackOpsOne: ['BlackOpsOne', 'cursive'],
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
		},
		gridTemplateColumns: {
			16: 'repeat(16, minmax(0, 1fr))',
			footer: '200px minmax(900px, 1fr) 100px',
		},
		gridColumnStart: {
			13: '13',
			14: '14',
			15: '15',
			16: '16',
			17: '17',
		},
		gridColumnEnd: {
			13: '13',
			14: '14',
			15: '15',
			16: '16',
			17: '17',
		},
		zIndex: {
			1: '1',
			2: '2',
			3: '3',
			4: '4',
			5: '5',
			6: '6',
			7: '7',
			8: '8',
			9: '9',
			10: '10',
			20: '20',
			25: '25',
			30: '30',
			40: '40',
			50: '50',
			60: '60',
			70: '70',
			80: '80',
			90: '90',
			99: '99',
			100: '100'
		},
		invert: {
			0: '0',
			5: '.05',
			10: '.1',
			15: '.15',
			20: '.2',
			25: '.25',
			30: '.3',
			35: '.35',
			40: '.4',
			45: '.45',
			50: '.5',
			55: '.55',
			60: '.6',
			65: '.65',
			70: '.7',
			75: '.75',
			80: '.8',
			85: '.85',
			90: '.9',
			95: '.95',
			100: '1',
		  }

	},
};
// eslint-disable-next-line no-undef
export const plugins = [require('tailwindcss-animate'), require('tailwind-scrollbar')];
