import { cn } from '@/lib/cn';
import { gridColumnsClass, tileSizes } from '../grid';
import ImageTile from './ImageTile';
import PendingTile from './PendingTile';
import styles from './GenerationRow.module.css';

const STAGGER_MS = 70;

export default function ResultGrid({ generation, onOpen }) {
  const { results, settings } = generation;
  const sizes = tileSizes(settings.aspectRatio, results.length);

  return (
    <div className={cn('grid gap-2 lg:gap-3', gridColumnsClass(settings.aspectRatio, results.length))}>
      {results.map((media, index) => (
        <ImageTile
          key={`${media.id}-${index}`}
          media={media}
          aspectRatio={settings.aspectRatio}
          sizes={sizes}
          label={`Open result ${index + 1} of ${results.length}`}
          onOpen={() => onOpen(index)}
          className={styles.reveal}
          style={{ animationDelay: `${index * STAGGER_MS}ms` }}
        />
      ))}
    </div>
  );
}

export function PendingGrid({ aspectRatio, count }) {
  return (
    <div className={cn('grid gap-2 lg:gap-3', gridColumnsClass(aspectRatio, count))}>
      {Array.from({ length: count }, (_, index) => (
        <PendingTile key={index} aspectRatio={aspectRatio} />
      ))}
    </div>
  );
}
