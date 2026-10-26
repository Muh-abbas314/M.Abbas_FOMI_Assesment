'use client';

import { useCallback, useMemo, useState } from 'react';
import { useHotkeys } from '@/lib/hooks/use-hotkeys';
import Board from './components/Board';
import Inspector from './components/Inspector';
import Stage from './components/Stage';
import StudioTopBar from './components/StudioTopBar';
import TakesStack from './components/TakesStack';
import { selectedShot } from './state/studio-reducer';
import { useStudio } from './state/StudioProvider';
import { STUDIO_SHORTCUTS } from './studio-options';

/** Director's Board: stage (what you're looking at), inspector (the shot you're shaping), board (the whole film). */
export default function StudioWorkspace() {
  const { state, dispatch, generateTake, retryTake, cancelTake, chooseTake } = useStudio();
  const [playing, setPlaying] = useState(false);
  const [stageMode, setStageMode] = useState('shot'); // 'shot' | 'compare'
  const { project } = state;
  const shot = selectedShot(state);
  const number = shot ? project.shots.indexOf(shot) + 1 : 0;

  const selectShot = useCallback(
    (shotId) => {
      dispatch({ type: 'selectShot', shotId });
      setPlaying(false);
      setStageMode('shot');
    },
    [dispatch],
  );

  const actions = useMemo(() => {
    const choose = (n) => () => {
      const take = shot?.takes[n - 1];
      if (take) chooseTake(shot.id, take.id);
    };
    const step = (delta) => () => {
      dispatch({ type: 'selectAdjacent', delta });
      setPlaying(false);
      setStageMode('shot');
    };
    return {
      togglePlay: () => setPlaying((value) => !value),
      prevShot: step(-1),
      nextShot: step(1),
      moveLeft: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: -1 }),
      moveRight: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: 1 }),
      chooseTake1: choose(1),
      chooseTake2: choose(2),
      chooseTake3: choose(3),
      chooseTake4: choose(4),
      generateTake: () => shot && generateTake(shot.id),
    };
  }, [dispatch, shot, chooseTake, generateTake]);

  const bindings = useMemo(
    () => Object.fromEntries(STUDIO_SHORTCUTS.filter((s) => actions[s.action]).map((s) => [s.keys, actions[s.action]])),
    [actions],
  );
  useHotkeys(bindings, { enabled: stageMode !== 'compare' });

  return (
    <div
      data-theme="studio"
      className="flex min-h-dvh flex-col bg-studio-bg text-studio-ink lg:grid lg:h-dvh lg:grid-cols-[1fr_340px] lg:grid-rows-[56px_minmax(0,1fr)_184px] lg:overflow-hidden 2xl:grid-cols-[1fr_380px] 2xl:grid-rows-[56px_minmax(0,1fr)_208px]"
    >
      <div className="lg:col-span-2">
        <StudioTopBar project={project} />
      </div>

      <Stage
        mode={stageMode}
        shot={shot}
        number={number}
        playing={playing}
        onTogglePlay={actions.togglePlay}
        onKeep={(takeId) => {
          chooseTake(shot.id, takeId);
          setStageMode('shot');
        }}
        onCloseCompare={() => setStageMode('shot')}
      />

      {shot && (
        <Inspector
          shot={shot}
          number={number}
          total={project.shots.length}
          credits={project.credits}
          onChange={(patch) => dispatch({ type: 'updateShot', shotId: shot.id, patch })}
          onMove={(delta) => dispatch({ type: 'moveShot', shotId: shot.id, delta })}
          onGenerate={generateTake}
        >
          <TakesStack
            shot={shot}
            onChoose={(takeId) => chooseTake(shot.id, takeId)}
            onCompare={() => {
              setPlaying(false);
              setStageMode('compare');
            }}
            onCancel={(takeId) => cancelTake(shot.id, takeId)}
            onRetry={() => retryTake(shot.id)}
          />
        </Inspector>
      )}

      <div className="lg:col-span-2 lg:min-h-0">
        <Board shots={project.shots} selectedShotId={state.selectedShotId} onSelect={selectShot} onAdd={() => dispatch({ type: 'addShot' })} />
      </div>
    </div>
  );
}
