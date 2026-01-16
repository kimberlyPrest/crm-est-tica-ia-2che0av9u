import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface AppButtonProps extends ButtonProps {
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'secondary'
    | 'destructive'
    | 'pill'
    | 'glass-icon'
  loading?: boolean
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant = 'default', loading, children, ...props }, ref) => {
    if (variant === 'pill') {
      return (
        <Button
          ref={ref}
          className={cn(
            'rounded-full bg-brand-lime hover:bg-brand-lime-light text-brand-slate font-semibold shadow-sm hover:scale-[1.02] transition-all duration-300',
            className,
          )}
          disabled={loading}
          {...props}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </Button>
      )
    }

    if (variant === 'glass-icon') {
      return (
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-full glass hover:bg-white/70 text-brand-slate shadow-sm transition-all duration-300',
            className,
          )}
          disabled={loading}
          {...props}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
        </Button>
      )
    }

    if (variant === 'outline') {
      return (
        <Button
          ref={ref}
          variant="outline"
          className={cn(
            'bg-transparent border-2 border-brand-slate text-brand-slate hover:bg-brand-slate/5',
            className,
          )}
          disabled={loading}
          {...props}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </Button>
      )
    }

    return (
      <Button
        ref={ref}
        variant={variant as any}
        className={cn(className)}
        disabled={loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    )
  },
)

AppButton.displayName = 'AppButton'

export { AppButton }
