// GET → { enabled } ; POST { text, override? } → { markdown } bài luận do AI (Gemini hoặc Claude) viết dựa trên kết quả engine
import { NextResponse } from 'next/server';
import { callAI, hasApiKey, NARRATE_SYSTEM } from '@/lib/ai';
import { parseChartText } from '@/lib/parseText';
import { readFromParsed } from '@/lib/reading';
import type { ChartInput } from '@/lib/battu/chart';
import { condenseForAI } from '@/lib/condense';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ enabled: hasApiKey() });
}

export async function POST(req: Request) {
  if (!hasApiKey()) return NextResponse.json({ error: 'Máy chủ chưa cấu hình GEMINI_API_KEY (hoặc ANTHROPIC_API_KEY) – phần bài luận AI đang tắt.' }, { status: 503 });
  try {
    const body = (await req.json()) as { text?: string; override?: ChartInput | null };
    const text = (body.text ?? '').slice(0, 20000);
    const parsed = parseChartText(text);
    const r = readFromParsed(parsed, body.override ?? undefined);
    if (!r.bazi) return NextResponse.json({ error: 'Không đọc được tứ trụ.' }, { status: 422 });
    const request = parsed.request || 'Hãy luận giải chi tiết lá số.';
    const md = await callAI(`Yêu cầu của người xem: ${request}\n\nKẾT QUẢ PHÂN TÍCH (engine):\n${condenseForAI(r)}\n\nHãy viết bài luận hoàn chỉnh, dễ hiểu cho người không học mệnh lý.`, { system: NARRATE_SYSTEM, maxTokens: 4000 });
    return NextResponse.json({ markdown: md });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
