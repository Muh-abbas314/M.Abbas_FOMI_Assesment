'use client';

import { useCallback, useMemo, useState } from 'react';
import { useHotkeys } from '@/lib/hooks/use-hotkeys';
import Board from './components/Board';
import Inspector from './components/Inspector';
import Stage from './components/Stage';
import StudioTopBar from './components/StudioTopBar';
import { selectedShot } from './state/studio-reducer';
import { useStudio } from './state/StudioProvider';
import { STUDIO_SHORTCUTS } from './studio-options';

/** Director's Board: stage (what you're looking at), inspector (the shot you're shaping), board (the whole film). */
export default function StudioWorkspace() {
  const { state, dispatch } = useStudio();
  const [playing, setPlaying] = useState(false);
  const { project } = state;
  const shot = selectedShot(state);
  const number = shot ? project.shots.indexOf(shot) + 1 : 0;

  const selectShot = useCallback(
    (shotId) => {
      dispatch({ type: 'selectShot', shotId });
      setPlaying(false);
    },
    [dispatch],
  );

  const actions = useMemo(
    () => ({
      togglePlay: () => setPlaying((value) => !value),
      prevShot: () => {
        dispatch({ type: 'selectAdjacent', delta: -1 });
        setPlaying(false);
      },
      nextShot: () => {
        dispatch({ type: 'selectAdjacent', delta: 1 });
        setPlaying(false);
      },
      moveLeft: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: -1 }),
      moveRight: () => shot && dispatch({ type: 'moveShot', shotId: shot.id, delta: 1 }),
    }),
    [dispatch, shot],
  );

  const bindings = useMemo(
    () => Object.fromEntries(STUDIO_SHORTCUTS.filter((s) => actions[s.action]).map((s) => [s.keys, actions[s.action]])),
    [actions],
  );
  useHotkeys(bindings);

  return (
    <div
      data-theme="studio"
      className="flex min-h-dvh flex-col bg-studio-bg text-studio-ink lg:grid lg:h-dvh lg:grid-cols-[1fr_340px] lg:grid-rows-[56px_minmax(0,1fr)_184px] lg:overflow-hidden 2xl:grid-cols-[1fr_380px] 2xl:grid-rows-[56px_minmax(0,1fr)_208px]"
    >
      <div className="lg:col-span-2">
        <StudioTopBar project={project} />
      </div>

      <Stage shot={shot} number={number} playing={playing} onTogglePlay={actions.togglePlay} />

      {shot && (
        <Inspector
          shot={shot}
          number={number}
          total={project.shots.length}
          onChange={(patch) => dispatch({ type: 'updateShot', shotId: shot.id, patch })}
          onMove={(delta) => dispatch({ type: 'moveShot', shotId: shot.id, delta })}
        />
      )}

      <div className="lg:col-span-2 lg:min-h-0">
        <Board shots={project.shots} selectedShotId={state.selectedShotId} onSelect={selectShot} onAdd={() => dispatch({ type: 'addShot' })} />
      </div>
    </div>
  );
}
