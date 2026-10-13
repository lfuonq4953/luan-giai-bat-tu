// In toàn bộ bài luận của lá số mẫu: npm run sample  (hoặc: npx tsx scripts/sample.ts duong-dan-van-ban.txt)
import fs from 'node:fs';
import { readChartText } from '../src/lib/reading';
import { SAMPLE_TEXT } from '../src/lib/sample';
import { buildPlain } from '../src/lib/plain';

const text = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : SAMPLE_TEXT;
const r = readChartText(text);
if (r.parsed.warnings.length || r.errors.length) console.log('Cảnh báo:', [...r.parsed.warnings, ...r.errors]);
if (r.bazi) {
  const p = buildPlain(r.bazi, r.tuvi);
  console.log(`\n# TÓM TẮT DỄ HIỂU\n${p.headline}`);
  for (const c of p.cards) {
    console.log(`\n## ${c.title}${c.badge ? ` [${c.badge}]` : ''}`);
    c.lines.forEach((l) => console.log('- ' + l));
    c.tips?.forEach((t) => console.log(`  ${t.label}: ${t.items.join(' | ')}`));
    console.log(`  (căn cứ: ${c.why})`);
  }
  console.log('\n# PHÂN TÍCH CHUYÊN SÂU');
}
const all = [...(r.bazi?.sections ?? []), ...(r.tuvi?.sections ?? [])];
for (const s of all) {
  console.log(`\n## ${s.title}\n> ${s.summary}`);
  s.paragraphs.forEach((p) => console.log('- ' + p));
  s.bullets?.forEach((b) => console.log('  * ' + b));
}
