// POST { text } → toàn bộ kết quả luận giải (JSON). Dùng khi muốn gọi từ ứng dụng khác.
import { NextResponse } from 'next/server';
import { parseChartText } from '@/lib/parseText';
import { readFromParsed } from '@/lib/reading';
import type { ChartInput } from '@/lib/battu/chart';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; override?: ChartInput };
    if (!body?.text?.trim()) return NextResponse.json({ error: 'Thiếu văn bản lá số (trường "text").' }, { status: 400 });
    const r = readFromParsed(parseChartText(body.text), body.override ?? undefined);
    if (!r.bazi) return NextResponse.json({ error: r.errors.join(' ') || 'Không đọc được tứ trụ.' }, { status: 422 });
    return NextResponse.json(r);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
