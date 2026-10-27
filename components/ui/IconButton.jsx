import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import Tooltip from './Tooltip';

/** Icon-only button. `label` is its accessible name and its tooltip. */
const IconButton = forwardRef(function IconButton(
  { label, icon: Icon, className, tooltip = true, tooltipAlign = 'center', tone = 'light', size = 36, type = 'button', ...props },
  ref,
) {
  const button = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      style={{ width: size, height: size }}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'studio'
          ? 'text-studio-ink-muted hover:bg-studio-raised hover:text-studio-ink'
          : 'text-ink-muted hover:bg-panel-strong hover:text-ink',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden size={Math.round(size * 0.5)} strokeWidth={1.75} />
    </button>
  );
  return tooltip ? (
    <Tooltip content={label} align={tooltipAlign}>
      {button}
    </Tooltip>
  ) : (
    button
  );
});

export default IconButton;
