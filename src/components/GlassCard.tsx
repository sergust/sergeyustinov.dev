'use client';

import React from 'react';
import Image from 'next/image';
import { Glass, GlassProps } from '@/components/Glass';
import { cn } from '@/lib/utils';

interface GlassCardProps
  extends Omit<GlassProps, 'variant' | 'hover' | 'children'> {
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  heroImage?: string;
  heroAlt?: string;
  href?: string;
  variant?: 'default' | 'featured' | 'minimal';
  onClick?: () => void;
  children?: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      title,
      excerpt,
      author,
      date,
      readTime,
      tags = [],
      heroImage,
      heroAlt,
      href,
      variant = 'default',
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isClickable = href || onClick;

    const cardVariants = {
      default: 'glass-enhanced',
      featured: 'glass-enhanced border-2 border-blog-link/20',
      minimal: 'glass-light',
    };

    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    };

    const CardWrapper = ({
      children: cardChildren,
    }: {
      children: React.ReactNode;
    }) => (
      <Glass
        ref={ref}
        variant="enhanced"
        hover
        className={cn(
          'group overflow-hidden transition-all duration-300',
          cardVariants[variant],
          isClickable && 'cursor-pointer',
          'hover:shadow-blog-link/10 hover:shadow-2xl',
          'hover:border-blog-link/30',
          'hover:bg-blog-surface-hover',
          className
        )}
        onClick={isClickable ? handleClick : undefined}
        {...props}
      >
        {cardChildren}
      </Glass>
    );

    return (
      <CardWrapper>
        <article className="h-full">
          {/* Hero Image */}
          {heroImage && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={heroImage}
                alt={heroAlt || title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className={cn('p-6', variant === 'featured' && 'p-8')}>
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blog-code-bg text-blog-text-secondary hover:bg-blog-link/10 hover:text-blog-link rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="bg-blog-code-bg text-blog-text-muted rounded-full px-3 py-1 text-xs font-medium">
                    +{tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                'text-blog-heading group-hover:text-blog-link mb-3 leading-tight font-bold transition-colors',
                variant === 'featured' ? 'text-2xl' : 'text-xl'
              )}
            >
              {title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-blog-text-secondary mb-4 line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            )}

            {/* Custom children content */}
            {children}

            {/* Meta information */}
            <div className="text-blog-text-muted mt-auto flex flex-wrap items-center gap-4 text-sm">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="bg-blog-code-bg flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-blog-text-secondary text-xs font-medium">
                      {author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{author}</span>
                </div>
              )}

              {date && (
                <time
                  dateTime={date}
                  className="hover:text-blog-text-secondary transition-colors"
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              )}

              {readTime && (
                <span className="hover:text-blog-text-secondary flex items-center gap-1 transition-colors">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {readTime}
                </span>
              )}
            </div>
          </div>
        </article>
      </CardWrapper>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
export type { GlassCardProps };
