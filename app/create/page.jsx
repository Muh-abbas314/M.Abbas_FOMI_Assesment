import { Suspense } from 'react';
import CreateWorkspace from '@/features/create/CreateWorkspace';
import { getSeedFeed } from '@/lib/mock/seed-feed';

export const metadata = { title: 'Create' };

export default function CreatePage({ searchParams }) {
  // Reading the query string is request-time work, so Cache Components wants it inside Suspense.
  return (
    <Suspense fallback={<div className="min-h-dvh bg-canvas" />}>
      <CreateRoute searchParams={searchParams} />
    </Suspense>
  );
}

async function CreateRoute({ searchParams }) {
  const { mode, fresh } = await searchParams;
  const isFresh = fresh === '1';
  return (
    <CreateWorkspace
      initialFeed={isFresh ? [] : getSeedFeed()}
      initialTab={mode === 'image' || mode === 'video' ? mode : 'home'}
      fresh={isFresh}
    />
  );
}
