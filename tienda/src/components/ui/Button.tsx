import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils/format'

type Variant = 'primary' | 'outline' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg'

export function buttonStyles(options: {
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
}): string {
  const { variant = 'primary', size = 'md', block, className } = options

  const variants: Record<Variant, string> = {
    primary: 'bg-f1-500 text-white hover:bg-f1-400 shadow-lg shadow-f1-500/25',
    outline: 'border border-carbon-600 text-carbon-100 hover:border-f1-500 hover:text-f1-400',
    ghost: 'text-carbon-300 hover:text-white hover:bg-carbon-800',
    dark: 'bg-white text-carbon-950 hover:bg-carbon-200',
  }

  const sizes: Record<Size, string> = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
  }

  return cx(
    'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-500/60 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    block && 'w-full',
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  children: ReactNode
}

export default function Button({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, block, className })} {...rest}>
      {children}
    </button>
  )
}