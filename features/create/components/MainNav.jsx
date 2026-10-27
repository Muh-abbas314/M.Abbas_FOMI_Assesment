'use client';

import Link from 'next/link';
import { Folder, House, Image as ImageIcon, PenLine, Video } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import styles from './MainNav.module.css';

export const NAV_TABS = [
  { id: 'home', label: 'Home', icon: House, href: '/create' },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'edit', label: 'Edit', icon: PenLine, disabled: true },
  { id: 'studio', label: 'Studio', icon: Folder, href: '/studio', description: "Director's Board" },
];

const itemClass =
  'grid h-10 w-10 place-items-center rounded-full text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-panel active:scale-[0.94] min-[375px]:w-11 sm:w-14 lg:h-11 lg:w-[72px]';

/** The five-tab switcher from the mockup. Home/Image/Video work; the rest explain why they don't yet. */
export default function MainNav({ active, onSelectTab }) {
  const activeIndex = NAV_TABS.findIndex((tab) => tab.id === active);

  return (
    <nav aria-label="Main" className="flex flex-col items-center gap-1.5">
      <div
        className={styles.track}
        style={{ '--active-index': Math.max(0, activeIndex), '--tab-count': NAV_TABS.length }}
        aria-hidden
      >
        <span className={styles.thumb} data-hidden={activeIndex < 0} />
      </div>
      <ul className="flex">
        {NAV_TABS.map(({ id, label, icon: Icon, href, disabled, description }) => {
          const current = id === active ? 'page' : undefined;
          const icon = <Icon aria-hidden size={20} strokeWidth={1.75} />;

          if (disabled) {
            return (
              <li key={id}>
                <Tooltip content="Coming soon" describe>
                  <button type="button" aria-label={label} aria-disabled="true" className={cn(itemClass, 'cursor-not-allowed text-ink/35 hover:bg-transparent active:scale-100')}>
                    {icon}
                  </button>
                </Tooltip>
              </li>
            );
          }

          return (
            <li key={id}>
              <Tooltip content={description ?? label} describe={Boolean(description)}>
                {href ? (
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={current}
                    className={itemClass}
                    onClick={(event) => {
                      // Home stays on this page (no reload); other links navigate normally.
                      if (id !== 'home' || event.metaKey || event.ctrlKey || event.shiftKey) return;
                      event.preventDefault();
                      onSelectTab(id);
                    }}
                  >
                    {icon}
                  </Link>
                ) : (
                  <button type="button" aria-label={label} aria-current={current} className={itemClass} onClick={() => onSelectTab(id)}>
                    {icon}
                  </button>
                )}
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
