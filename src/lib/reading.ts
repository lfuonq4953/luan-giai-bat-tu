// Luận giải trọn gói từ văn bản lá số: Bát Tự (engine theo sách) + Tử Vi (bổ trợ)
import { parseChartText, ParsedText } from './parseText';
import { analyze, AnalysisResult } from './battu/analyze';
import { analyzeTuVi, TuViResult } from './tuvi/analyze';
import type { ChartInput } from './battu/chart';
import type { TuViData } from './tuvi/types';

export interface Reading {
  parsed: ParsedText;
  bazi: AnalysisResult | null;
  tuvi: TuViResult | null;
  errors: string[];
}

export function readFromParsed(parsed: ParsedText, override?: ChartInput): Reading {
  const errors: string[] = [];
  const baziInput = override ?? parsed.bazi;
  let bazi: AnalysisResult | null = null;
  if (baziInput) {
    try { bazi = analyze(baziInput); } catch (e) { errors.push((e as Error).message); }
  } else errors.push('Không đọc được tứ trụ Bát Tự từ văn bản.');
  const ref = baziInput?.referenceYear ?? new Date().getFullYear();
  const age = parsed.currentAge ?? (baziInput?.birthYear ? ref - baziInput.birthYear + 1 : null);
  let tuvi: TuViResult | null = null;
  if (parsed.tuvi) tuvi = analyzeTuVi(parsed.tuvi as TuViData, { age, yearStem: ((ref - 4) % 10 + 10) % 10, referenceYear: ref });
  return { parsed, bazi, tuvi, errors };
}

export function readChartText(text: string): Reading {
  return readFromParsed(parseChartText(text));
}
