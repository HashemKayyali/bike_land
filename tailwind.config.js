/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just-In-Time compiler
  content: [
    "./index.html",
    "./**/*.{html,js,ts}",             // ملفاتك
    "./src/**/*.{html,js,ts}",         // لو عندك src
    "./node_modules/preline/dist/*.js" // مهم لـ Preline
  ],
  safelist: [
    // تدرجات الخلفية
    'from-emerald-400',
    'to-cyan-400',
    'from-neutral-900/95',
    'via-neutral-900/85',
    'to-neutral-900/95',

    // شفافية
    'bg-white/5',
    'bg-white/10',
    'bg-black/75',

    // الحدود والتأثيرات
    'border-white/10',
    'backdrop-blur',
    'backdrop-blur-2xl',
    'backdrop-saturate-150',
    'ring-white/10',

    // النصوص
    'text-white/70',
    'text-white',
    'text-emerald-400',

    // الظلال
    'shadow-lg',
    'shadow-[0_8px_24px_rgba(0,0,0,.45)]',
    'shadow-[0_18px_48px_-12px_rgba(0,0,0,.92),0_8px_28px_-10px_rgba(0,0,0,.78)]',

    // أحجام ونسب تستعملها
    'h-10','h-px','h-12','w-[80%]','max-w-screen-xl','max-w-2xl'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('preline/plugin') // ضروري عشان تشتغل مكونات Preline
  ]
};
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './**/*.{html,js}',          // يشمل سكربتاتك الداخلية
    './src/**/*.{html,js}',      // لو عندك ملفات إضافية
  ],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // arbitrary utilities + variants اللي عندك
    'w-[80%]','h-[3px]','size-4',
    'md:w-[95%]','md:justify-self-start','md:justify-self-end',
    'backdrop-blur','backdrop-blur-sm','backdrop-blur-2xl',
    'aspect-video',
    'ring-1','ring-white/10','ring-emerald-500/30',
    'data-[active=true]:text-emerald-300',
    'data-[active=true]:after:w-full'
  ]
}
