'use client';

import { Image as ImageIcon, Video } from 'lucide-react';
import Accordion from '@/components/ui/Accordion';
import Segmented from '@/components/ui/Segmented';
import { cn } from '@/lib/cn';
import AdvancedFields from './AdvancedFields';
import ComposerSettings from './ComposerSettings';
import GenerateButton from './GenerateButton';
import PromptField from './PromptField';
import ReferenceChip from './ReferenceChip';
import StylePicker from './StylePicker';
import { canGenerate, toCreateBody } from './composer-state';

export const MODE_OPTIONS = [
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video },
];

/** The left-rail composer from the mockup. State lives in the workspace so other surfaces can share it. */
export default function Composer({ state, dispatch, onGenerate, onModeChange, isSubmitting = false, promptRef, className }) {
  const ready = canGenerate(state) && !isSubmitting;
  const settings = state[state.mode];
  const setSetting = (key, value) => dispatch({ type: 'setSetting', key, value });

  function submit() {
    if (ready) onGenerate(toCreateBody(state));
  }

  return (
    <form
      aria-label="Composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn('flex flex-col gap-3 rounded-panel bg-panel p-3', className)}
    >
      <Segmented
        label="Mode"
        options={MODE_OPTIONS}
        value={state.mode}
        onChange={onModeChange ?? ((mode) => dispatch({ type: 'setMode', mode }))}
      />

      {state.reference && <ReferenceChip media={state.reference} onRemove={() => dispatch({ type: 'setReference', media: null })} />}

      <PromptField
        value={state.prompt}
        onChange={(prompt) => dispatch({ type: 'setPrompt', prompt })}
        onSubmitShortcut={submit}
        textareaRef={promptRef}
      >
        <GenerateButton disabled={!ready} busy={isSubmitting} />
      </PromptField>

      <ComposerSettings mode={state.mode} settings={settings} onChange={setSetting} />

      <Accordion title="Advanced">
        <AdvancedFields settings={settings} onChange={setSetting} />
      </Accordion>
      <Accordion title="Styles">
        <StylePicker value={settings.style} onChange={(style) => setSetting('style', style)} />
      </Accordion>
    </form>
  );
}
