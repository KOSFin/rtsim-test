import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './FormField.module.css'

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string
  label: string
  invalid?: boolean
  attachedBottom?: boolean
  endAdornment?: ReactNode
}

export function FormField({
  label,
  id,
  invalid,
  attachedBottom,
  endAdornment,
  ...inputProps
}: FormFieldProps) {
  const controlClassName = [
    styles.control,
    attachedBottom ? styles.controlAttachedBottom : '',
    invalid ? styles.controlError : '',
    endAdornment ? styles.controlWithAdornment : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={styles.field} htmlFor={id}>
      <span className={controlClassName}>
        <input
          id={id}
          className={styles.input}
          aria-invalid={Boolean(invalid)}
          placeholder=" "
          {...inputProps}
        />
        <span className={styles.floatingLabel}>{label}</span>
        {endAdornment ? <span className={styles.adornment}>{endAdornment}</span> : null}
      </span>
    </label>
  )
}
