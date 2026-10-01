import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  size?: 'wide' | 'content';
  className?: string;
}

export function PageContainer({ children, size = 'wide', className = '' }: PageContainerProps) {
  const width = size === 'wide' ? 'max-w-6xl' : 'max-w-3xl';
  return <div className={`mx-auto w-full ${width} px-4 sm:px-6 ${className}`}>{children}</div>;
}

interface PageSectionProps {
  children: ReactNode;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

export function PageSection({ children, id, ariaLabel, className = '' }: PageSectionProps) {
  return <section id={id} aria-label={ariaLabel} className={className}>{children}</section>;
}
