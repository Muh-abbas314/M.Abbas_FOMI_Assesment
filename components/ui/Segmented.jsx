'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

const KEY_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const TONES = {
  light: {
    track: 'bg-surface',
    thumb: 'bg-panel-strong shadow-[0_1px_2px_rgb(23_23_23/0.06)]',
    on: 'text-ink',
    off: 'text-ink-muted hover:text-ink',
    chipOn: 'border-accent-ink bg-surface text-ink',
    chipOff: 'border-line text-ink-muted hover:border-ink/20 hover:text-ink',
  },
  studio: {
    track: 'bg-studio-bg',
    thumb: 'bg-studio-raised',
    on: 'text-studio-ink',
    off: 'text-studio-ink-muted hover:text-studio-ink',
    chipOn: 'border-studio-accent bg-studio-raised text-studio-ink',
    chipOff: 'border-studio-line text-studio-ink-muted hover:text-studio-ink',
  },
};

/**
 * Single-choice control built as an ARIA radio group: one tab stop, arrow keys move and select.
 * `variant="track"` is the sliding pill switch; `variant="chips"` wraps onto several lines.
 */
export default function Segmented({ label, options, value, onChange, variant = 'track', tone = 'light', size = 'md', className }) {
  const refs = useRef([]);
  const index = options.findIndex((o) => o.value === value);
  const t = TONES[tone];

  function select(next) {
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  function onKeyDown(event) {
    const last = options.length - 1;
    const from = Math.max(index, 0);
    let next = null;
    if (event.key in KEY_STEPS) next = (from + KEY_STEPS[event.key] + options.length) % options.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
  }

  if (variant === 'chips') {
    return (
      <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className={cn('flex flex-wrap gap-1.5', className)}>
        {options.map((option, i) => {
          const checked = i === index;
          return (
            <button
              key={option.value}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (index < 0 && i === 0) ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cn(
                'h-8 rounded-full border px-3 text-[12px] transition-[color,border-color,background-color,transform] duration-150 active:scale-[0.97]',
                checked ? t.chipOn : t.chipOff,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      style={{ '--count': options.length, '--index': Math.max(index, 0) }}
      className={cn('relative grid auto-cols-fr grid-flow-col rounded-full p-1', t.track, className)}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 left-1 w-[calc((100%-8px)/var(--count))] translate-x-[calc(var(--index)*100%)] rounded-full transition-transform duration-200 ease-[var(--ease-out-soft)]',
          t.thumb,
          index < 0 && 'opacity-0',
        )}
      />
      {options.map((option, i) => {
        const checked = i === index;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (index < 0 && i === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors duration-150',
              size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-8 px-3 text-[12px]',
              checked ? t.on : t.off,
            )}
          >
            {Icon && <Icon aria-hidden size={14} strokeWidth={1.75} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
