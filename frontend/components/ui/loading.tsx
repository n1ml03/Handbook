import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, FileText, Save, Upload, Download } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

// Basic loading spinner
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={cn(
      'animate-spin text-accent-cyan',
      sizeClasses[size],
      className
    )} />
  );
};

// Loading state wrapper
export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  fallback,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || (
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// Loading overlay for full-screen loading
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="bg-background border border-border rounded-xl p-8 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-center space-y-2">
            <p className="font-medium">{message}</p>
            {progress !== undefined && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
            )}
            {progress !== undefined && (
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading components
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 1, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-muted/50 rounded animate-pulse',
          i === lines - 1 && lines > 1 && 'w-3/4'
        )}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('doax-card p-6 space-y-4', className)}>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-muted/50 rounded-lg animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

// Action-specific loading buttons
export const SaveButton: React.FC<{
  isSaving: boolean;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ isSaving, onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled || isSaving}
    className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
      'bg-gradient-to-r from-accent-cyan to-accent-purple text-white',
      'hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      className
    )}
  >
    {isSaving ? (
      <>
        <LoadingSpinner size="sm" />
        Saving...
      </>
    ) : (
      <>
        <Save className="w-4 h-4" />
        {children || 'Save'}
      </>
    )}
  </button>
);

export const UploadButton: React.FC<{
  isUploading: boolean;
  onClick: () => void;
  disabled?: boolean;
  progress?: number;
  children?: React.ReactNode;
  className?: string;
}> = ({ isUploading, onClick, disabled, progress, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled || isUploading}
    className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
      'bg-gradient-to-r from-accent-pink to-accent-purple text-white',
      'hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      className
    )}
  >
    {isUploading ? (
      <>
        <LoadingSpinner size="sm" />
        {progress !== undefined ? `${Math.round(progress)}%` : 'Uploading...'}
      </>
    ) : (
      <>
        <Upload className="w-4 h-4" />
        {children || 'Upload'}
      </>
    )}
  </button>
);

export const DownloadButton: React.FC<{
  isDownloading: boolean;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ isDownloading, onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled || isDownloading}
    className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
      'border border-border bg-background hover:bg-muted/50',
      'hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      className
    )}
  >
    {isDownloading ? (
      <>
        <LoadingSpinner size="sm" />
        Downloading...
      </>
    ) : (
      <>
        <Download className="w-4 h-4" />
        {children || 'Download'}
      </>
    )}
  </button>
);

// Loading states for specific content types
export const DocumentLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6', className)}>
    <div className="doax-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-muted-foreground" />
        <SkeletonText lines={1} className="flex-1" />
      </div>
      <SkeletonText lines={4} />
    </div>
    <div className="doax-card p-8">
      <SkeletonText lines={8} />
    </div>
  </div>
);

// Inline loading indicator
export const InlineLoading: React.FC<{
  message?: string;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ message = 'Loading...', size = 'sm', className }) => (
  <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
    <LoadingSpinner size={size} />
    <span className="text-sm">{message}</span>
  </div>
);

// Pulsing dot indicator
export const PulsingDot: React.FC<{
  color?: 'cyan' | 'pink' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ color = 'cyan', size = 'md', className }) => {
  const colorClasses = {
    cyan: 'bg-accent-cyan',
    pink: 'bg-accent-pink',
    purple: 'bg-accent-purple',
    green: 'bg-green-500'
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={cn(
      'rounded-full animate-pulse',
      colorClasses[color],
      sizeClasses[size],
      className
    )} />
  );
};
