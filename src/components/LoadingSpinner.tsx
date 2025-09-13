import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
  'data-testid'?: string;
}

/**
 * Loading spinner component with customizable size and color
 */
export function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  className = '',
  text = 'Chargement...',
  'data-testid': dataTestId = 'loading-spinner',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`loading-spinner loading-spinner--${size} loading-spinner--${color} ${className}`}
      role="status"
      aria-label="Chargement en cours"
      data-testid={dataTestId}
    >
      <div className="loading-spinner__circle" />
      <span className="loading-spinner__text">{text}</span>
    </div>
  );
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay({
  text = 'Chargement...',
  'data-testid': dataTestId = 'loading-overlay',
}: {
  text?: string;
  'data-testid'?: string;
}) {
  return (
    <div className="loading-overlay" data-testid={dataTestId}>
      <div className="loading-overlay__content">
        <LoadingSpinner size="large" data-testid="loading-spinner" />
        <p className="loading-overlay__message">{text}</p>
      </div>
    </div>
  );
}

/**
 * Inline loader for small spaces
 */
export function InlineLoader({
  size = 'small',
  'data-testid': dataTestId = 'inline-loader',
}: {
  size?: 'small' | 'medium' | 'large';
  'data-testid'?: string;
}) {
  return (
    <LoadingSpinner
      size={size}
      className="inline-loader"
      data-testid={dataTestId}
      text=""
    />
  );
}
