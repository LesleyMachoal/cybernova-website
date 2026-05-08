import { cn } from '@/utils/cn';

export function Button({ variant = 'primary', className, children, type = 'button', ...props }) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    small: 'btn-small',
    large: 'btn-large',
  };

  return (
    <button type={type} className={cn('btn', variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}
