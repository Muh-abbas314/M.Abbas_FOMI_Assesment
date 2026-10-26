'use client';

import { useCallback, useMemo, useState } from 'react';
import { CircleHelp, PencilLine } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import Sheet from '@/components/ui/Sheet';
import { useHotkeys } from '@/lib/hooks/use-hotkeys';
import { buildTimeline } from './playback/timeline';
import { useBoardPlayback } from './playback/use-board-playback';
import { isActiveStatus } from '@/lib/job-status';
import Button from '@/components/ui/Button';
import Announcer from './components/Announcer';
import Board from './components/Board';
import Inspector from './components/Inspector';
import QueueButton from './components/QueueButton';
import RenderFinalDialog from './components/RenderFinalDialog';
import RenderQueue from './components/RenderQueue';
import ShortcutsOverlay from './components/ShortcutsOverlay';
import Stage from './components/Stage';
import StudioTopBar from './components/StudioTopBar';
import TakesStack from './components/TakesStack';
import { finalCost } from './cost';
import { selectedShot, selectQueue } from './state/studio-reducer';
import { useStudio } from './state/StudioProvider';
import { STUDIO_SHORTCUTS } from './studio-options';

/** Director's Board: stage (what you're looking at), inspector (the shot you're shaping), board (the whole film). */
export default function StudioWorkspace() {
  const { state, dispatch, generateTake, retryTake, cancelTake, chooseTake, renderFinal, cancelRender } = useStudio();
  const [playing, setPlaying] = useState(false);
  const [stageMode, setStageMode] = useState('shot'); // 'shot' | 'board' | 'compare'
  const [queueOpen, setQueueOpen] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const queue = useMemo(() => selectQueue(state), [state]);
  const activeCount = queue.filter((entry) => isActiveStatus(entry.status)).length;
  const { project } = state;
  const shot = selectedShot(state);
  const number = shot ? project.shots.indexOf(shot) + 1 : 0;
  const timeline = useMemo(() => buildTimeline(project.shots), [project.shots]);
  const playback = useBoardPlayback(timeline);
  const { pause: pauseBoard, seek: seekBoard } = playback;

  const changeStageMode = useCallback(
    (mode) => {
      setStageMode(mode);
      setPlaying(false);
      if (mode !== 'board') pauseBoard();
    },
    [pauseBoard],
  );

  const selectShot = useCallback(
    (shotId) => {
      dispatch({ type: 'selectShot', shotId });
      setPlaying(false);
      // In Board view, picking a card jumps the playhead to that shot.
      if (stageMode === 'board') {
        const segment = timeline.find((s) => s.shotId === shotId);
        if (segment) seekBoard(segment.start);
      } else {
        setStageMode('shot');
      }
    },
    [dispatch, stageMode, timeline, seekBoard],
  );

  const actions = useMemo(() => {
    const choose = (n) => () => {
      const take = shot?.takes[n - 1];
      if (take) chooseTake(shot.id, take.id);
    };
    const step = (delta) => () => {
      dispatch({ type: 'selectAdjacent', delta });
      setPlaying(false);
    };
    const shuttle = (key) => () => {
      if (stageMode !== 'board') changeStageMode('board');
      playback.shuttle(key);
    };
    return {
      togglePlay: () => (stageMode === 'board' ? playback.toggle() : setPlaying((value) => !value)),
      shuttleBack: shuttle('j'),
      shuttlePause: shuttle('k'),
      shuttleForward: shuttle('l'),
      prevShot: step(-1),
      nextShot: step(1),
      moveLeft: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: -1 }),
      moveRight: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: 1 }),
      chooseTake1: choose(1),
      chooseTake2: choose(2),
      chooseTake3: choose(3),
      chooseTake4: choose(4),
      generateTake: () => shot && generateTake(shot.id),
      toggleShortcuts: () => setShortcutsOpen((open) => !open),
    };
  }, [dispatch, shot, chooseTake, generateTake, stageMode, changeStageMode, playback]);

  const cancelEntry = useCallback(
    (entry) => (entry.kind === 'final' ? cancelRender(entry.renderId) : cancelTake(entry.shotId, entry.takeId)),
    [cancelRender, cancelTake],
  );

  // "Watch" a finished final: the mock's final film is the assembled board, played from the top.
  const watchFinal = useCallback(() => {
    setQueueOpen(false);
    setStageMode('board');
    setPlaying(false);
    playback.seek(0);
    playback.play();
  }, [playback]);

  const jumpToShot = useCallback(
    (n) => {
      const target = project.shots[n - 1];
      if (target) selectShot(target.id);
      setFinalOpen(false);
    },
    [project.shots, selectShot],
  );

  const bindings = useMemo(
    () => Object.fromEntries(STUDIO_SHORTCUTS.filter((s) => actions[s.action]).map((s) => [s.keys, actions[s.action]])),
    [actions],
  );
  // Dialogs and compare own the keyboard while they're open.
  useHotkeys(bindings, { enabled: stageMode !== 'compare' && !finalOpen && !shortcutsOpen && !editSheetOpen });

  const takesFor = (target) => (
    <TakesStack
      shot={target}
      onChoose={(takeId) => chooseTake(target.id, takeId)}
      onCompare={() => {
        setEditSheetOpen(false);
        changeStageMode('compare');
      }}
      onCancel={(takeId) => cancelTake(target.id, takeId)}
      onRetry={() => retryTake(target.id)}
    />
  );

  const inspectorProps = shot && {
    shot,
    number,
    total: project.shots.length,
    credits: project.credits,
    onChange: (patch) => dispatch({ type: 'updateShot', shotId: shot.id, patch }),
    onMove: (delta) => dispatch({ type: 'moveShot', shotId: shot.id, delta }),
    onGenerate: generateTake,
  };

  return (
    <div
      data-theme="studio"
      className="flex min-h-dvh flex-col bg-studio-bg text-studio-ink lg:grid lg:h-dvh lg:grid-cols-[1fr_340px] lg:grid-rows-[56px_minmax(0,1fr)_184px] lg:overflow-hidden 2xl:grid-cols-[1fr_380px] 2xl:grid-rows-[56px_minmax(0,1fr)_208px]"
    >
      <div className="lg:col-span-2">
        <StudioTopBar project={project}>
          <QueueButton activeCount={activeCount} open={queueOpen} onClick={() => setQueueOpen((open) => !open)} />
          {/* Visibility lives on wrappers: a `hidden` class on Button would fight its own `inline-flex`. */}
          <span className="hidden md:inline-flex">
            <Button variant="studio" size="sm" onClick={() => setFinalOpen(true)}>
              {`Render final · ${finalCost(project.shots)} cr`}
            </Button>
          </span>
          <span className="hidden md:inline-flex">
            <IconButton icon={CircleHelp} label="Keyboard shortcuts" tone="studio" size={32} tooltipAlign="end" onClick={() => setShortcutsOpen(true)} />
          </span>
        </StudioTopBar>
      </div>

      <Stage
        mode={stageMode}
        onModeChange={changeStageMode}
        timeline={timeline}
        playback={playback}
        shot={shot}
        number={number}
        playing={playing}
        onTogglePlay={actions.togglePlay}
        onKeep={(takeId) => {
          chooseTake(shot.id, takeId);
          setStageMode('shot');
        }}
        onCloseCompare={() => setStageMode('shot')}
        headerAction={
          shot && (
            <span className="hidden md:inline-flex lg:hidden">
              <Button variant="studio-ghost" size="sm" className="border border-studio-line" onClick={() => setEditSheetOpen(true)}>
                <PencilLine aria-hidden size={14} strokeWidth={1.75} />
                Edit shot
              </Button>
            </span>
          )
        }
      />

      {shot && (
        <Inspector {...inspectorProps} variant="panel">
          <p data-testid="studio-review" className="rounded-tile border border-studio-line bg-studio-bg p-3 text-[12px] leading-relaxed text-studio-ink-muted md:hidden">
            Shot editing is designed for larger screens — review and pick takes here.
          </p>
          {takesFor(shot)}
        </Inspector>
      )}

      <Sheet open={editSheetOpen && Boolean(shot)} onClose={() => setEditSheetOpen(false)} title={`Edit shot ${number}`} tone="studio">
        {shot && <Inspector {...inspectorProps}>{takesFor(shot)}</Inspector>}
      </Sheet>
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <div className="lg:col-span-2 lg:min-h-0">
        <Board shots={project.shots} selectedShotId={state.selectedShotId} onSelect={selectShot} onAdd={() => dispatch({ type: 'addShot' })} />
      </div>

      <RenderQueue open={queueOpen} entries={queue} onClose={() => setQueueOpen(false)} onCancel={cancelEntry} onWatch={watchFinal} />
      <RenderFinalDialog
        open={finalOpen}
        shots={project.shots}
        credits={project.credits}
        onClose={() => setFinalOpen(false)}
        onJumpToShot={jumpToShot}
        onConfirm={() => {
          renderFinal();
          setFinalOpen(false);
        }}
      />
      <Announcer entries={queue} />
    </div>
  );
}
