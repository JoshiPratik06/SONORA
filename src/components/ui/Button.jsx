const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-500',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
}

export default function Button({ variant = 'primary', icon = false, className = '', ...props }) {
  const size = icon ? 'size-10 shrink-0' : 'min-h-10 px-4'
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-35 ${size} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
