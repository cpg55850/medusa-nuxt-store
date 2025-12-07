import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{js,ts,vue}',
        './components/**/*.{js,ts,vue}',
        './pages/**/*.{js,ts,vue}',
        './layouts/**/*.{js,ts,vue}',
        './plugins/**/*.{js,ts}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config