// Luận Tử Vi Đẩu Số từ dữ liệu 12 cung (đọc từ văn bản). Phần tham khảo, bổ trợ cho Bát Tự.
import { BRANCHES, STEMS } from '../battu/constants';
import type { Palace, Star, TuViData } from './types';
import { MAJOR_STARS, MINOR_STARS, BRIGHT_NAME, TU_HOA, PALACE_TOPIC } from './knowledge';

export interface TvSection { id: string; title: string; summary: string; paragraphs: string[]; bullets?: string[]; source?: string }
export interface PalaceEval { palace: Palace; borrowed: boolean; majors: Star[]; score: number; good: string[]; bad: string[]; hoa: string[]; rating: string }
export interface TuViResult {
  data: TuViData;
  evals: PalaceEval[];
  currentDaiHan: Palace | null;
  luuMenh: Palace | null;
  sections: TvSection[];
  disclaimer: string;
}

const byName = (d: TuViData, n: string) => d.palaces.find((p) => p.name === n) ?? null;
const byBranch = (d: TuViData, b: number) => d.palaces.find((p) => p.branch === b) ?? null;
const starName = (s: Star) => `${s.name}${s.bright ? ` (${BRIGHT_NAME[s.bright]})` : ''}`;
const isTuHoa = (n: string) => /^Hóa (Lộc|Quyền|Khoa|Kỵ)$/.test(n);
const ELS = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];
const elIn = (s?: string) => { if (!s) return undefined; let best: string | undefined; let bi = Infinity; for (const e of ELS) { const i = s.indexOf(e); if (i >= 0 && i < bi) { bi = i; best = e; } } return best; };
const genOf: Record<string, string> = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
const ctlOf: Record<string, string> = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

function evalPalace(d: TuViData, p: Palace): PalaceEval {
  let majors = p.major;
  let borrowed = false;
  if (!majors.length) { const opp = byBranch(d, (p.branch + 6) % 12); if (opp?.major.length) { majors = opp.major; borrowed = true; } }
  let score = 0;
  const good: string[] = [], bad: string[] = [], hoa: string[] = [];
  majors.forEach((s) => {
    const w = borrowed ? 0.6 : 1;
    if (s.bright === 'M' || s.bright === 'V') score += 1.5 * w; else if (s.bright === 'Đ') score += 1 * w; else if (s.bright === 'H') score -= 1 * w;
  });
  p.minor.forEach((s) => {
    const k = MINOR_STARS[s.name]?.kind;
    if (isTuHoa(s.name)) { hoa.push(s.name); score += s.name === 'Hóa Kỵ' ? -1.5 : 1.2; }
    else if (k === 'cát') { good.push(s.name); score += 0.5; }
    else if (k === 'sát') { bad.push(s.name); score -= ['Kình Dương', 'Kinh Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'].includes(s.name) ? 1 : 0.35; }
  });
  const rating = score >= 3 ? 'Rất tốt' : score >= 1.2 ? 'Tốt' : score > -1 ? 'Bình hoà' : score > -2.5 ? 'Kém' : 'Xấu';
  return { palace: p, borrowed, majors, score, good, bad, hoa, rating };
}

function majorText(ev: PalaceEval, topic: keyof Pick<(typeof MAJOR_STARS)[string], 'nature' | 'career' | 'wealth' | 'love' | 'health'>): string[] {
  const out: string[] = [];
  if (!ev.majors.length) return ['Cung vô chính diệu và cung đối diện cũng trống – ảnh hưởng chủ yếu do phụ tinh và tam phương.'];
  if (ev.borrowed) out.push(`Cung ${ev.palace.name} vô chính diệu, mượn chính tinh cung xung chiếu (${BRANCHES[(ev.palace.branch + 6) % 12]}): ${ev.majors.map(starName).join(', ')} – lực yếu hơn, dễ chịu ảnh hưởng hoàn cảnh.`);
  ev.majors.forEach((s) => {
    const k = MAJOR_STARS[s.name];
    if (!k) return;
    const sharp = s.bright === 'M' || s.bright === 'V' || s.bright === 'Đ';
    out.push(`${s.name}${s.bright ? ` ${BRIGHT_NAME[s.bright].toLowerCase()} địa` : ''} (${k.tag}, ${k.element}): ${k[topic]}; ${sharp ? k.bright : s.bright === 'H' ? k.dark : k.bright + ', nhưng cần cát tinh hỗ trợ'}.`);
  });
  return out;
}

const listStars = (p: Palace, kind: 'cát' | 'sát') => p.minor.filter((s) => MINOR_STARS[s.name]?.kind === kind).map((s) => `${s.name} (${MINOR_STARS[s.name].meaning})`);

export function analyzeTuVi(d: TuViData, opts: { age: number | null; yearStem: number | null; referenceYear: number }): TuViResult {
  const evals = d.palaces.map((p) => evalPalace(d, p));
  const E = (n: string) => evals.find((e) => e.palace.name === n)!;
  const sections: TvSection[] = [];
  const menh = byName(d, 'Mệnh');
  const age = opts.age;
  const currentDaiHan = age !== null ? d.palaces.filter((p) => p.daiHan !== null && p.daiHan <= age && age < p.daiHan + 10)[0] ?? null : null;
  const luuMenh = d.luuMenhBranch !== undefined ? byBranch(d, d.luuMenhBranch) : null;

  // Tổng quan
  const mEl = elIn(d.banMenh), cEl = elIn(d.cuc);
  let rel = '';
  if (mEl && cEl) {
    if (mEl === cEl) rel = 'Bản mệnh và Cục đồng hành – hoà hợp, dễ phát huy.';
    else if (genOf[cEl] === mEl) rel = `Cục ${cEl} sinh Mệnh ${mEl} – được hoàn cảnh nâng đỡ, thuận lợi.`;
    else if (genOf[mEl] === cEl) rel = `Mệnh ${mEl} sinh Cục ${cEl} – phải bỏ công sức nhiều, thành quả đến từ nỗ lực.`;
    else if (ctlOf[cEl] === mEl) rel = `Cục ${cEl} khắc Mệnh ${mEl} – hoàn cảnh hay gây áp lực, đời nhiều thử thách, cần bền chí.`;
    else if (ctlOf[mEl] === cEl) rel = `Mệnh ${mEl} khắc Cục ${cEl} – chủ động chinh phục hoàn cảnh, vất vả nhưng làm chủ được.`;
  }
  const tamPhuong = menh ? [menh.branch, (menh.branch + 4) % 12, (menh.branch + 8) % 12, (menh.branch + 6) % 12].map((b) => byBranch(d, b)).filter(Boolean) as Palace[] : [];
  sections.push({
    id: 'tv-tong-quan', title: 'Tử Vi – Tổng quan',
    summary: `${d.banMenh ?? ''}${d.cuc ? ' · ' + d.cuc : ''}`,
    paragraphs: [
      rel,
      `Chủ mệnh ${d.chuMenh ?? '—'}, chủ thân ${d.chuThan ?? '—'}; Thân cư ${d.thanCu ?? '—'}; lai nhân cung ${d.laiNhan ?? '—'}${d.canLuong ? `; cân lượng ${d.canLuong}` : ''}.`,
      d.thanCu ? `Thân cư ${d.thanCu}: nửa đời sau chịu ảnh hưởng mạnh của cung này (${PALACE_TOPIC[d.thanCu.replace(/^cung\s+/i, '').replace(/\s*\(.*\)/, '')] ?? ''}).` : '',
      d.tuHoa ? `Tứ hoá năm sinh: ${d.tuHoa}` : '',
      tamPhuong.length ? `Tam phương tứ chính của Mệnh: ${tamPhuong.map((p) => `${p.name} (${BRANCHES[p.branch]}): ${p.major.map(starName).join(', ') || 'vô chính diệu'}`).join('; ')}.` : '',
    ].filter(Boolean),
    source: 'Kiến thức Tử Vi phổ thông (chưa có sách Tử Vi trong thư mục tài liệu)',
  });

  const topic = (id: string, title: string, palaceName: string, key: 'nature' | 'career' | 'wealth' | 'love' | 'health', extra: string[] = []) => {
    const ev = E(palaceName);
    if (!ev) return;
    const p = ev.palace;
    sections.push({
      id, title,
      summary: `Cung ${p.name} (${BRANCHES[p.branch]}) – ${ev.rating}`,
      paragraphs: [...majorText(ev, key), ...extra],
      bullets: [
        ...(listStars(p, 'cát').length ? [`Cát tinh: ${listStars(p, 'cát').join('; ')}`] : []),
        ...(listStars(p, 'sát').length ? [`Sát/bại tinh: ${listStars(p, 'sát').join('; ')}`] : []),
        ...(ev.hoa.length ? [`Tứ hoá tại cung: ${ev.hoa.join(', ')}`] : []),
        ...(p.yearly.length ? [`Sao lưu năm ${opts.referenceYear}: ${p.yearly.join(', ')}`] : []),
        `Tràng sinh: ${p.stage || '—'}`,
      ],
    });
  };

  const thanPalace = d.palaces.find((p) => p.isThan);
  topic('tv-menh', 'Tử Vi – Mệnh & tính cách', 'Mệnh', 'nature', thanPalace ? [`Cung Thân tại ${thanPalace.name} (${BRANCHES[thanPalace.branch]}) với ${thanPalace.major.map(starName).join(', ') || 'vô chính diệu'}: về sau càng thiên về ${PALACE_TOPIC[thanPalace.name]}.`] : []);
  topic('tv-quan', 'Tử Vi – Sự nghiệp', 'Quan Lộc', 'career');
  const dien = E('Điền Trạch');
  topic('tv-tai', 'Tử Vi – Tài chính', 'Tài Bạch', 'wealth', dien ? [`Điền Trạch (${BRANCHES[dien.palace.branch]}): ${dien.majors.map(starName).join(', ') || 'vô chính diệu'} – ${dien.rating.toLowerCase()}${dien.hoa.length ? `, có ${dien.hoa.join(', ')}` : ''}${dien.bad.length ? `, gặp ${dien.bad.join(', ')}` : ''}.`] : []);
  const flowers = d.palaces.flatMap((p) => p.minor.filter((s) => ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ', 'Thiên Diêu', 'Thiên Riêu'].includes(s.name)).map((s) => `${s.name} ở ${p.name}`));
  topic('tv-phu-the', 'Tử Vi – Tình duyên', 'Phu Thê', 'love', flowers.length ? [`Sao đào hoa trong lá số: ${flowers.join(', ')}.`] : []);
  topic('tv-tat', 'Tử Vi – Sức khoẻ', 'Tật Ách', 'health', ['Phần sức khoẻ chỉ mang tính phòng ngừa, không thay thế khám chữa bệnh.']);

  // Gia đạo ngắn gọn
  sections.push({
    id: 'tv-gia-dao', title: 'Tử Vi – Gia đạo & các mối quan hệ',
    summary: 'Phụ mẫu, Huynh đệ, Tử tức, Nô bộc, Thiên di.',
    paragraphs: ['Phụ Mẫu', 'Huynh Đệ', 'Tử Tức', 'Nô Bộc', 'Thiên Di'].map((n) => {
      const ev = E(n); if (!ev) return '';
      return `${n} (${BRANCHES[ev.palace.branch]}) – ${ev.rating}: ${ev.majors.map(starName).join(', ') || 'vô chính diệu'}${ev.borrowed ? ' (mượn xung chiếu)' : ''}${ev.good.length ? `; cát: ${ev.good.join(', ')}` : ''}${ev.bad.length ? `; sát: ${ev.bad.join(', ')}` : ''}.`;
    }).filter(Boolean),
  });

  // Vận hạn
  const van: string[] = [];
  if (currentDaiHan) {
    const ev = E(currentDaiHan.name);
    van.push(`Đại hạn hiện tại (${currentDaiHan.daiHan}–${(currentDaiHan.daiHan ?? 0) + 9} tuổi) tại cung ${currentDaiHan.name} (${BRANCHES[currentDaiHan.branch]}) – ${ev.rating}: ${ev.majors.map(starName).join(', ') || 'vô chính diệu'}${ev.borrowed ? ' (mượn xung chiếu)' : ''}. Chủ đề nổi bật của 10 năm này: ${PALACE_TOPIC[currentDaiHan.name]}.`);
    if (ev.good.length) van.push(`Cát tinh hỗ trợ đại hạn: ${ev.good.join(', ')}.`);
    if (ev.bad.length) van.push(`Sát tinh cần đề phòng trong đại hạn: ${ev.bad.join(', ')}.`);
  }
  if (luuMenh) {
    const ev = E(luuMenh.name);
    van.push(`Lưu Mệnh năm ${opts.referenceYear} an tại ${BRANCHES[luuMenh.branch]} (cung gốc ${luuMenh.name}) – ${ev.rating}: ${ev.majors.map(starName).join(', ') || 'vô chính diệu'}${ev.borrowed ? ' (mượn xung chiếu)' : ''}. Năm nay việc liên quan ${PALACE_TOPIC[luuMenh.name]} được đặt lên hàng đầu.`);
  }
  if (opts.yearStem !== null) {
    const th = TU_HOA[opts.yearStem];
    const where = (star: string) => d.palaces.find((p) => p.major.some((s) => s.name === star) || p.minor.some((s) => s.name === star));
    const lbl = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
    van.push(`Lưu tứ hoá năm ${STEMS[opts.yearStem]}: ${th.map((s, i) => { const p = where(s); return `${s} hoá ${lbl[i]}${p ? ` → cung ${p.name}` : ''}`; }).join('; ')}.`);
    const ky = where(th[3]);
    if (ky) van.push(`Lưu Hoá Kỵ rơi vào cung ${ky.name}: năm nay dễ vướng mắc, lo âu về ${PALACE_TOPIC[ky.name]}; nên thận trọng lời nói và quyết định.`);
    const loc = where(th[0]);
    if (loc) van.push(`Lưu Hoá Lộc rơi vào cung ${loc.name}: cơ hội, tài lộc đến qua ${PALACE_TOPIC[loc.name]}.`);
  }
  const ylist = d.palaces.filter((p) => p.yearly.length).map((p) => `${p.name}: ${p.yearly.join(', ')}`);
  if (ylist.length) van.push(`Sao lưu niên phân bố: ${ylist.join(' · ')}.`);
  sections.push({ id: 'tv-van-han', title: `Tử Vi – Vận hạn ${opts.referenceYear}`, summary: currentDaiHan ? `Đại hạn ${currentDaiHan.name}, lưu Mệnh ${luuMenh ? BRANCHES[luuMenh.branch] : '—'}` : 'Vận hạn theo lưu niên', paragraphs: van });

  return {
    data: d, evals, currentDaiHan, luuMenh, sections,
    disclaimer: 'Phần Tử Vi được luận theo kiến thức phổ thông (thư mục tài liệu hiện chỉ có sách Bát Tự); nên đọc như phần bổ trợ cho Bát Tự.',
  };
}
