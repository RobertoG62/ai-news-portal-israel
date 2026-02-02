import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchAllNews();

  if (!data) {
    return NextResponse.json({ error: 'No stories found' }, { status: 500 });
  }

  return NextResponse.json(data);
}
