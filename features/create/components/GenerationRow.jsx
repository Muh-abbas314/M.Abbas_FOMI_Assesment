import PromptCard from './PromptCard';
import ResultGrid from './ResultGrid';

export default function GenerationRow({ generation, onOpen }) {
  return (
    <li
      id={`gen-${generation.id}`}
      className="grid scroll-mt-[calc(var(--topbar-h)+var(--history-h)+24px)] items-start gap-3 xl:grid-cols-[240px_1fr] 2xl:grid-cols-[280px_1fr]"
    >
      <PromptCard generation={generation} />
      <ResultGrid generation={generation} onOpen={(index) => onOpen(generation.id, index)} />
    </li>
  );
}
