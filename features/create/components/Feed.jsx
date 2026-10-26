import GenerationRow from './GenerationRow';

export default function Feed({ items, onOpen }) {
  return (
    <section aria-label="Generations">
      <ol className="flex flex-col gap-4 lg:gap-5">
        {items.map((generation) => (
          <GenerationRow key={generation.id} generation={generation} onOpen={onOpen} />
        ))}
      </ol>
    </section>
  );
}
