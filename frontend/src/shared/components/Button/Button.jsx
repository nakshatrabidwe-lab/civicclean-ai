import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

/**
 * Button
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading  – shows a spinner, disables click
 * @param {boolean} fullWidth
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      <span className={loading ? styles.hiddenText : undefined}>{children}</span>
    </button>
  )
}
