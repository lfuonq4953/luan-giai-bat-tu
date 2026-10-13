import type { Reading } from './reading';
import { pillarName } from './battu/chart';
import { buildPlain, plainToText } from './plain';

/** Rút gọn kết quả engine thành văn bản để AI viết lời luận */
export function condenseForAI(r: Reading): string {
  const lines: string[] = [];
  const b = r.bazi;
  if (b) {
    const c = b.chart;
    lines.push(`Họ tên: ${c.input.name ?? '(không rõ)'} – ${c.input.gender === 'nam' ? 'Nam (Càn tạo)' : 'Nữ (Khôn tạo)'}`);
    if (c.input.solarBirth) lines.push(`Ngày sinh: ${c.input.solarBirth}${c.input.lunarBirth ? ' – ' + c.input.lunarBirth : ''}`);
    lines.push(`Năm xem: ${c.referenceYear}${r.parsed.currentAge ? ` (${r.parsed.currentAge} tuổi)` : ''}`);
    lines.push(`\n## TÓM TẮT DỄ HIỂU (đã chuyển sang lời thường – dùng làm khung bài viết)\n${plainToText(buildPlain(b, r.tuvi))}`);
    lines.push(`\n## BÁT TỰ\nTứ trụ: ${c.pillars.map((p) => `${p.label} ${pillarName(p)} (${p.stemGod}; tàng ${p.hidden.map((h) => h.god).join('/')}; ${p.nayin})`).join(' | ')}`);
    for (const s of b.sections) {
      lines.push(`\n### ${s.title}\nTóm tắt: ${s.summary}`);
      s.paragraphs.forEach((p) => lines.push(`- ${p.replace(/\*\*/g, '')}`));
      s.bullets?.forEach((x) => lines.push(`  • ${x}`));
    }
    lines.push(`\nThần sát: ${b.shensha.map((x) => `${x.name} (${x.positions.join(', ')})`).join('; ')}`);
    lines.push(`Hợp xung hình hại: ${b.relations.map((x) => x.label).join('; ') || 'không đáng kể'}`);
  }
  if (r.tuvi) {
    lines.push(`\n## TỬ VI (phần bổ trợ, luận theo kiến thức phổ thông)`);
    for (const s of r.tuvi.sections) {
      lines.push(`\n### ${s.title}\nTóm tắt: ${s.summary}`);
      s.paragraphs.forEach((p) => lines.push(`- ${p}`));
      s.bullets?.forEach((x) => lines.push(`  • ${x}`));
    }
  }
  return lines.join('\n');
}
