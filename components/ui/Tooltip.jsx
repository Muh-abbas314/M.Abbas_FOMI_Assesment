import { Children, cloneElement, useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Small hover/focus tooltip.
 * By default it only repeats a visible label (hidden from screen readers, since the control already
 * has a name). Pass `describe` when the text adds information, e.g. "Coming soon".
 */
export default function Tooltip({ content, children, describe = false, placement = 'bottom', align = 'center', className }) {
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
          // Near the right edge, align="end" keeps even the invisible tooltip inside the page width.
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-float transition-opacity duration-150',
          align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2',
          'group-hover/tooltip:opacity-100 group-hover/tooltip:delay-300 group-focus-within/tooltip:opacity-100',
          placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {content}
      </span>
    </span>
  );
}
