import GenerationRow from './GenerationRow';

export default function Feed({ items, highlightedId, onOpen, onReuse, onCancel, onRetry }) {
  return (
    <section aria-label="Generations">
      <ol className="flex flex-col gap-4 lg:gap-5">
        {items.map((generation) => (
          <GenerationRow
            key={generation.id}
            generation={generation}
            highlighted={generation.id === highlightedId}
            onOpen={onOpen}
            onReuse={onReuse}
            onCancel={onCancel}
            onRetry={onRetry}
          />
        ))}
      </ol>
    </section>
  );
}
