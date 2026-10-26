import { Children, cloneElement, useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Small hover/focus tooltip.
 * By default it only repeats a visible label (hidden from screen readers, since the control already
 * has a name). Pass `describe` when the text adds information, e.g. "Coming soon".
 */
export default function Tooltip({ content, children, describe = false, placement = 'bottom', className }) {
  const id = useId();
  const child = Children.only(children);
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {describe ? cloneElement(child, { 'aria-describedby': id }) : child}
      <span
        id={id}
        role={describe ? 'tooltip' : undefined}
        aria-hidden={describe ? undefined : true}
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-float transition-opacity duration-150',
          'group-hover/tooltip:opacity-100 group-hover/tooltip:delay-300 group-focus-within/tooltip:opacity-100',
          placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {content}
      </span>
    </span>
  );
}
