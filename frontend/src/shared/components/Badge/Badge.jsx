import React from 'react'
import clsx from 'clsx'
import styles from './Badge.module.css'

/**
 * Badge
 * @param {'success'|'warning'|'error'|'info'|'neutral'|'primary'} variant
 * @param {'sm'|'md'} size
 */
export default function Badge({ children, variant = 'neutral', size = 'md', className, ...props }) {
  return (
    <span
      className={clsx(styles.badge, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}
