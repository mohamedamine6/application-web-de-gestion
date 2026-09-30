import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}
