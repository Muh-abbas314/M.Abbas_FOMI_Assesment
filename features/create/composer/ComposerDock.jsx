'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Segmented from '@/components/ui/Segmented';
import Sheet from '@/components/ui/Sheet';
import AdvancedFields from './AdvancedFields';
import { MODE_OPTIONS } from './Composer';
import ComposerSettings from './ComposerSettings';
import GenerateButton from './GenerateButton';
import PromptField from './PromptField';
import ReferenceChip from './ReferenceChip';
import StylePicker from './StylePicker';
import { canGenerate, toCreateBody } from './composer-state';

/**
 * The composer below `lg`: a prompt bar pinned to the bottom, where thumbs reach.
 * Phones get prompt + Generate with everything else in a sheet; tablets show the selects inline.
 * Shares state with the rail composer, so resizing never loses a draft.
 */
export default function ComposerDock({ state, dispatch, onGenerate, onModeChange, isSubmitting = false, promptRef }) {
  const [sheet, setSheet] = useState(null); // null | 'settings' | 'more'
  const ready = canGenerate(state) && !isSubmitting;
  const settings = state[state.mode];
  const setSetting = (key, value) => dispatch({ type: 'setSetting', key, value });
  const changeMode = onModeChange ?? ((mode) => dispatch({ type: 'setMode', mode }));

  function submit() {
    if (ready) onGenerate(toCreateBody(state));
  }

  return (
    <div
      data-testid="composer-dock"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:inset-x-4 md:bottom-4 md:mx-auto md:max-w-[720px] md:rounded-panel md:border md:shadow-float lg:hidden"
    >
      <form
        aria-label="Composer"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex flex-col gap-2 p-2.5 md:p-3"
      >
        {state.reference && <ReferenceChip media={state.reference} onRemove={() => dispatch({ type: 'setReference', media: null })} />}

        <div className="flex items-end gap-2">
          <span className="md:hidden">
            <IconButton icon={SlidersHorizontal} label="Settings" size={40} tooltip={false} onClick={() => setSheet('settings')} className="bg-panel" />
          </span>
          <PromptField
            value={state.prompt}
            onChange={(prompt) => dispatch({ type: 'setPrompt', prompt })}
            onSubmitShortcut={submit}
            textareaRef={promptRef}
            compact
            className="min-w-0 flex-1"
          >
            <GenerateButton disabled={!ready} busy={isSubmitting} iconOnly="mobile" />
          </PromptField>
        </div>

        <div className="hidden flex-wrap items-center gap-1.5 md:flex">
          <Segmented label="Mode" options={MODE_OPTIONS} value={state.mode} onChange={changeMode} size="sm" />
          <ComposerSettings mode={state.mode} settings={settings} onChange={setSetting} className="flex flex-wrap gap-1.5" />
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSheet('more')}>
            More
          </Button>
        </div>
      </form>

      <Sheet open={sheet !== null} title={sheet === 'more' ? 'More settings' : 'Settings'} onClose={() => setSheet(null)}>
        <div className="flex flex-col gap-4 pt-1">
          {sheet === 'settings' && (
            <>
              <Segmented label="Mode" options={MODE_OPTIONS} value={state.mode} onChange={changeMode} />
              <ComposerSettings mode={state.mode} settings={settings} onChange={setSetting} />
            </>
          )}
          <Accordion title="Advanced">
            <AdvancedFields settings={settings} onChange={setSetting} />
          </Accordion>
          <Accordion title="Styles" defaultOpen>
            <StylePicker value={settings.style} onChange={(style) => setSetting('style', style)} />
          </Accordion>
        </div>
      </Sheet>
    </div>
  );
}
