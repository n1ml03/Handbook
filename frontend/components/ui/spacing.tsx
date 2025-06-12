import React from 'react';
import { cn } from '@/lib/utils';

interface SpacingProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionProps extends SpacingProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

// Enhanced container with optimal spacing
export const Container: React.FC<SpacingProps> = ({ children, className }) => (
  <div className={cn("viewport-optimized space-y-8", className)}>
    {children}
  </div>
);

// Card with enhanced spacing and visual hierarchy
export const Card: React.FC<SpacingProps> = ({ children, className }) => (
  <div className={cn("doax-card p-8 space-y-6", className)}>
    {children}
  </div>
);

// Compact card for dense layouts
export const CompactCard: React.FC<SpacingProps> = ({ children, className }) => (
  <div className={cn("doax-card p-6 space-y-4", className)}>
    {children}
  </div>
);

// Section with header and content
export const Section: React.FC<SectionProps> = ({ 
  children, 
  title, 
  description, 
  action, 
  className 
}) => (
  <div className={cn("space-y-6", className)}>
    {(title || description || action) && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    )}
    {children && children}
  </div>
);

// Grid with responsive spacing
export const Grid: React.FC<SpacingProps & {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}> = ({ children, className, cols = 1, gap = 'md' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gridGap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      "grid performance-grid",
      gridCols[cols],
      gridGap[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Stack with consistent vertical spacing
export const Stack: React.FC<SpacingProps & {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ children, className, spacing = 'md' }) => {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  };

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};

// Inline elements with horizontal spacing
export const Inline: React.FC<SpacingProps & {
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}> = ({ children, className, spacing = 'md', align = 'start', wrap = true }) => {
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      "flex items-center",
      spacingClasses[spacing],
      alignClasses[align],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  );
};

// Divider with proper spacing
export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("border-t border-border/50", className)} />
);

// Enhanced form group with proper spacing
export const FormGroup: React.FC<{
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, description, error, required, children, className }) => (
  <div className={cn("space-y-2", className)}>
    {label && (
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    {description && (
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    )}
    {children}
    {error && (
      <p className="text-xs text-destructive">
        {error}
      </p>
    )}
  </div>
);

// Toolbar with consistent spacing
export const Toolbar: React.FC<SpacingProps & {
  align?: 'start' | 'center' | 'end' | 'between';
}> = ({ children, className, align = 'between' }) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-xl",
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
};

// Status indicator with proper spacing
export const StatusBadge: React.FC<{
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}> = ({ status, children, className }) => {
  const statusClasses = {
    success: 'bg-green-500/10 text-green-600 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium",
      statusClasses[status],
      className
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        status === 'success' && 'bg-green-600',
        status === 'warning' && 'bg-yellow-600',
        status === 'error' && 'bg-red-600',
        status === 'info' && 'bg-blue-600'
      )} />
      {children}
    </div>
  );
};
