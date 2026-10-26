import StudioWorkspace from '@/features/studio/StudioWorkspace';
import { StudioProvider } from '@/features/studio/state/StudioProvider';
import { getSeedProject } from '@/lib/mock/seed-project';

export const metadata = { title: 'Studio' };

export default function StudioPage() {
  return (
    <StudioProvider initialProject={getSeedProject()}>
      <StudioWorkspace />
    </StudioProvider>
  );
}
