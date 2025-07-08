import React from 'react';
import { cn } from '@/lib/utils';

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'enhanced' | 'subtle';
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg';
  border?: boolean;
  as?: React.ElementType;
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      children,
      className,
      variant = 'enhanced',
      hover = false,
      blur = 'md',
      rounded = 'lg',
      shadow = 'md',
      border = true,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative overflow-hidden';

    const variantClasses = {
      light: 'glass-light',
      dark: 'glass-dark',
      enhanced: 'glass-enhanced',
      subtle: 'bg-background/5 backdrop-blur-sm border-border/5',
    };

    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    const shadowClasses = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    const hoverClasses = hover
      ? 'glass-hover transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1'
      : '';

    const borderClasses = border
      ? 'border border-white/10 dark:border-white/5'
      : '';

    const combinedClasses = cn(
      baseClasses,
      variantClasses[variant],
      blurClasses[blur],
      roundedClasses[rounded],
      shadowClasses[shadow],
      borderClasses,
      hoverClasses,
      className
    );

    const ElementType = Component as React.ElementType;

    return (
      <ElementType ref={ref} className={combinedClasses} {...props}>
        {children}
      </ElementType>
    );
  }
);

Glass.displayName = 'Glass';

export { Glass };
export type { GlassProps };
