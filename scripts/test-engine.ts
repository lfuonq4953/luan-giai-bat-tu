// Kiểm thử: npm test
//  1) engine Bát Tự với các lá số ví dụ trong sách (Thiên Lý Mệnh Cảo – Ngoại cách, Mệnh Lý Huyền Cơ Tham Bí…)
//  2) bộ đọc văn bản lá số mẫu (samples/la-so-mau.txt)
import { analyze } from '../src/lib/battu/analyze';
import { parseGanZhi } from '../src/lib/ganzhi';
import { readChartText } from '../src/lib/reading';
import { SAMPLE_TEXT } from '../src/lib/sample';

const run = (t: string) => analyze({ gender: 'nam', pillars: t.split('/').map((x) => parseGanZhi(x)!), referenceYear: 2026 });
type R = ReturnType<typeof run>;
const cases: [string, (r: R) => boolean, string][] = [
  ['Canh Tuất/Ất Dậu/Bính Thân/Kỷ Sửu', (r) => r.pattern.special?.name === 'Tòng Tài cách', 'Tòng Tài'],
  ['Mậu Thân/Tân Dậu/Đinh Tị/Tân Sửu', (r) => r.pattern.special?.name === 'Tòng Tài cách', 'Tòng Tài'],
  ['Mậu Tuất/Tân Dậu/Ất Dậu/Ất Dậu', (r) => r.pattern.special?.name === 'Tòng Sát cách', 'Tòng Sát'],
  ['Đinh Mão/Nhâm Dần/Quý Mão/Bính Thìn', (r) => r.pattern.special?.name === 'Tòng Nhi cách', 'Tòng Nhi'],
  ['Quý Mão/Ất Mão/Giáp Dần/Ất Hợi', (r) => r.pattern.special?.name === 'Tòng Vượng cách', 'Tòng Vượng'],
  ['Nhâm Dần/Quý Mão/Giáp Thìn/Giáp Tý', (r) => r.pattern.special?.name.startsWith('Khúc Trực') ?? false, 'Khúc Trực'],
  ['Đinh Tị/Bính Ngọ/Bính Dần/Ất Mùi', (r) => r.pattern.special?.name === 'Viêm Thượng cách', 'Viêm Thượng'],
  ['Bính Tuất/Giáp Ngọ/Đinh Mão/Nhâm Dần', (r) => r.pattern.special?.name === 'Viêm Thượng cách', 'Viêm Thượng (Nhâm bị hợp)'],
  ['Mậu Tuất/Kỷ Mùi/Mậu Thìn/Quý Sửu', (r) => r.pattern.special?.name === 'Giá Sắc cách', 'Giá Sắc'],
  ['Mậu Thân/Tân Dậu/Canh Tuất/Ất Dậu', (r) => r.pattern.special?.name === 'Tòng Cách cách', 'Tòng Cách'],
  ['Nhâm Thân/Nhâm Tý/Nhâm Thìn/Canh Tý', (r) => r.pattern.special?.name === 'Nhuận Hạ cách', 'Nhuận Hạ'],
  ['Giáp Tuất/Đinh Mão/Nhâm Dần/Giáp Thìn', (r) => r.pattern.special?.type === 'Hoá khí', 'Hoá Mộc'],
  ['Nhâm Thìn/Mậu Thân/Mậu Thân/Đinh Tị', (r) => !r.strength.strong, 'Mậu thân nhược (MLHCTB)'],
  ['Mậu Thân/Canh Thân/Giáp Ngọ/Canh Ngọ', (r) => r.strength.levelIndex <= 1 && !r.pattern.special, 'Giáp cực nhược, dương can không tòng'],
  ['Giáp Dần/Đinh Mão/Giáp Tý/Giáp Tý', (r) => r.strength.levelIndex >= 7, 'Giáp tối cường'],
];
let ok = 0, total = 0;
const check = (pass: boolean, label: string, extra = '') => { total++; if (pass) ok++; console.log(`${pass ? '✓' : '✗'} ${label}${extra ? ' – ' + extra : ''}`); };
for (const [t, f, label] of cases) { const r = run(t); check(f(r), label.padEnd(36), `${t} → ${r.strength.level}, ${r.pattern.special?.name ?? r.pattern.name}, dụng ${r.yong.useful}`); }

const s = readChartText(SAMPLE_TEXT);
check(!!s.bazi && s.bazi.chart.pillars.map((p) => `${p.stem}-${p.branch}`).join(',') === '1-9,1-9,7-9,1-7', 'Văn bản mẫu: đọc đúng tứ trụ Ất Dậu – Ất Dậu – Tân Dậu – Ất Mùi');
check(s.bazi?.chart.mingGong?.stem === 5 && s.bazi?.chart.mingGong?.branch === 1, 'Văn bản mẫu: Mệnh cung Kỷ Sửu khớp lá số gốc');
check(s.bazi?.luck.find((l) => l.current)?.startYear === 2023, 'Văn bản mẫu: đại vận hiện tại Quý Mùi (2023)');
check(s.tuvi?.data.palaces.length === 12, 'Văn bản mẫu: đọc đủ 12 cung Tử Vi');
check(s.tuvi?.currentDaiHan?.name === 'Huynh Đệ' && s.tuvi?.luuMenh?.name === 'Phụ Mẫu', 'Văn bản mẫu: đại hạn Huynh Đệ (15–24), lưu Mệnh tại Thìn');
check(s.parsed.warnings.length === 0 && s.errors.length === 0, 'Văn bản mẫu: không có cảnh báo');
console.log(`\n${ok}/${total} ca đạt`);
process.exitCode = ok === total ? 0 : 1;
