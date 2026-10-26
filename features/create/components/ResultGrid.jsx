import { cn } from '@/lib/cn';
import { gridColumnsClass, tileSizes } from '../grid';
import ImageTile from './ImageTile';

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
        />
      ))}
    </div>
  );
}
