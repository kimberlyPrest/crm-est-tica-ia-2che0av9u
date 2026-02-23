import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  size?: 'md' | 'lg'
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  size = 'lg',
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass',
        size === 'lg' ? 'rounded-[2rem] p-8' : 'rounded-[1.75rem] p-6',
        hoverEffect && 'glass-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}
