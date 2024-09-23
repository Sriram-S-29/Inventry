// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'gradient-blue-purple': '0 4px 12px rgba(0, 0, 255, 0.5), 0 8px 20px rgba(128, 0, 128, 0.3)',
        'gradient-red-orange': '0 4px 12px rgba(255, 0, 0, 0.5), 0 8px 20px rgba(255, 165, 0, 0.3)',
        'gradient-green-yellow': '0 4px 12px rgba(0, 255, 0, 0.5), 0 8px 20px rgba(255, 255, 0, 0.3)',
        'gradient-pink-blue': '0 4px 12px rgba(255, 105, 180, 0.5), 0 8px 20px rgba(0, 0, 255, 0.3)',
        'gradient-purple-teal': '0 4px 12px rgba(128, 0, 128, 0.5), 0 8px 20px rgba(0, 128, 128, 0.3)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        sizeExtent: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(0.5rem)' },
          '100%': { transform: 'translateX(3rem)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out',
        fadeInDown: 'fadeInDown 0.5s ease-out',
        fadeInLeft: 'fadeInLeft 0.5s ease-out',
        fadeInRight: 'fadeInRight 0.5s ease-out',
        zoomIn: 'zoomIn 0.5s ease-out',
        zoomOut: 'zoomOut 0.5s ease-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        slideInDown: 'slideInDown 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        sizeExtent: 'sizeExtent 5.5s ease-out',
      },
    },
  },
  plugins: [],
}