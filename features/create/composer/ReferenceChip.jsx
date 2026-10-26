import Image from 'next/image';
import { X } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';

/** The image or clip the next generation will build on. */
export default function ReferenceChip({ media, onRemove }) {
  return (
    <div className="flex items-center gap-2.5 rounded-card bg-surface p-1.5 pr-1">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-tile bg-panel-strong">
        <Image src={media.kind === 'video' ? media.poster : media.src} alt="" fill sizes="40px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[12px] font-medium text-ink">Reference</span>
        <span className="block truncate text-[11px] text-ink-muted">{media.alt}</span>
      </span>
      <IconButton icon={X} label="Remove reference" size={28} onClick={onRemove} tooltip={false} />
    </div>
  );
}
