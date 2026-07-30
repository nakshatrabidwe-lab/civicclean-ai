import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Input.module.css'

/**
 * Input
 * @param {string}  label       – visible label text
 * @param {string}  hint        – helper text below the field
 * @param {string}  error       – error message (turns border red)
 * @param {node}    leftIcon    – icon rendered inside left edge
 * @param {node}    rightIcon   – icon rendered inside right edge
 * @param {'sm'|'md'|'lg'} size
 */
const Input = forwardRef(function Input(
  { label, hint, error, leftIcon, rightIcon, size = 'md', className, id, ...props },
  ref
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={clsx(styles.inputWrap, error && styles.hasError)}>
        {leftIcon  && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={clsx(styles.input, styles[size], leftIcon && styles.withLeft, rightIcon && styles.withRight)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>

      {error && <p id={`${inputId}-err`}  className={styles.error}>{error}</p>}
      {hint && !error && <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>}
    </div>
  )
})

export default Input
