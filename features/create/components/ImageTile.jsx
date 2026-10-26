import Image from 'next/image';
import { cssAspectRatio } from '@/lib/aspect';
import { cn } from '@/lib/cn';

/** A result tile. The aspect-ratio box reserves space before the image loads, so nothing shifts. */
export default function ImageTile({ media, aspectRatio, sizes, onOpen, label, className, style }) {
  return (
    <button
      type="button"
      data-tile
      onClick={onOpen}
      aria-label={label}
      style={{ aspectRatio: cssAspectRatio(aspectRatio), ...style }}
      className={cn('group relative block w-full overflow-hidden rounded-tile bg-panel-strong', className)}
    >
      <Image
        src={media.kind === 'video' ? media.poster : media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </button>
  );
}
