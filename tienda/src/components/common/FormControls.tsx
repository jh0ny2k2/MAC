import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from 'react'
import { cx } from '../../utils/format'

export interface FormOption {
  value: string
  label: string
}

interface BaseFieldProps {
  label?: string
  hint?: string
  error?: string
}

const baseControl =
  'w-full rounded-lg border border-carbon-700 bg-carbon-900/60 text-sm text-carbon-100 placeholder:text-carbon-500 transition-colors focus:border-f1-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'

function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  children,
}: BaseFieldProps & { htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium uppercase tracking-wider text-carbon-400"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-f1-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-carbon-500">{hint}</p>
      ) : null}
    </div>
  )
}

interface FormInputProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'label' | 'id'> {
  className?: string
}

export function FormInput({
  label,
  hint,
  error,
  className,
  ...rest
}: FormInputProps) {
  const id = useId()
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id}>
      <input
        id={id}
        className={cx(
          baseControl,
          error && 'border-f1-500/70',
          'px-3.5 py-2.5',
          className,
        )}
        {...rest}
      />
    </FieldShell>
  )
}

interface FormSelectProps
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'label' | 'id'> {
  options: FormOption[]
  placeholder?: string
}

export function FormSelect({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  value,
  ...rest
}: FormSelectProps) {
  const id = useId()
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id}>
      <select
        id={id}
        value={value}
        className={cx(
          baseControl,
          error && 'border-f1-500/70',
          'px-3 py-2.5',
          !value && 'text-carbon-500',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface FormTextareaProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'label' | 'id'> {
  rows?: number
}

export function FormTextarea({
  label,
  hint,
  error,
  rows = 3,
  className,
  ...rest
}: FormTextareaProps) {
  const id = useId()
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        className={cx(
          baseControl,
          error && 'border-f1-500/70',
          'resize-y px-3.5 py-2.5',
          className,
        )}
        {...rest}
      />
    </FieldShell>
  )
}