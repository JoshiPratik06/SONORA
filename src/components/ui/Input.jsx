import { useId } from 'react'

export const fieldClass =
  'min-h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none sm:text-sm'

export default function Input({ label, error, hideLabel = false, className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mb-1 block text-sm text-slate-300'}>
        {label}
      </label>
      <input
        id={id}
        className={fieldClass}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
