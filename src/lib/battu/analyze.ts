// Điểm vào duy nhất: dữ liệu lá số (tứ trụ, giới tính, đại vận) → toàn bộ luận giải Bát Tự.
import {
  STEMS, BRANCHES, STEM_ELEMENT, BRANCH_ELEMENT, ELEMENTS, Element, GodGroup, groupElement, elementGroup, godGroupOf, tenGod,
  seasonOfMonthBranch, HIDDEN_STEMS, generates, controlledBy, nayinOf, NAYIN_MEANING, TenGod, TEN_GODS, stemYang,
} from './constants';
import { buildChart, ChartInput, ChartData, LuckPillar, yearPillar, pillarName } from './chart';
import { analyzeStrength, StrengthResult } from './strength';
import { determinePattern, PatternResult } from './pattern';
import { chooseYongShen, YongShen } from './yongshen';
import { analyzeRelations, Relation, isClash, stemCombo } from './relations';
import { computeShenSha, ShenSha } from './shensha';
import { evaluatePeriod, combineYearWithLuck, PeriodEval, Rating } from './luck';
import { DAY_MASTER, TEN_GOD_INFO, ELEMENT_INFO, ELEMENT_SEASON, PALACE_MEANING, PATTERN_INFO, SOURCES } from './knowledge/texts';
import DE_YEU from './knowledge/dungThanDeYeu.json';

export interface Section { id: string; title: string; summary: string; paragraphs: string[]; bullets?: string[]; source?: string }
export interface LuckRow extends LuckPillar { evaluation: PeriodEval; current: boolean }
export interface YearRow { year: number; stem: number; branch: number; age: number | null; evaluation: PeriodEval; combined: { total: number; rating: Rating; note: string }; luckIndex: number | null; current: boolean }
export interface AnalysisResult {
  chart: ChartData;
  strength: StrengthResult;
  pattern: PatternResult;
  yong: YongShen;
  relations: Relation[];
  shensha: ShenSha[];
  luck: LuckRow[];
  years: YearRow[];
  deYeu: { thuongLy: string; bienLy: string[]; viDu: string[] } | null;
  godCounts: Record<GodGroup, number>;
  sections: Section[];
  sources: string[];
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const POS = ['năm', 'tháng', 'ngày', 'giờ'];

export function analyze(input: ChartInput): AnalysisResult {
  const chart = buildChart(input);
  const stems = chart.pillars.map((p) => p.stem);
  const branches = chart.pillars.map((p) => p.branch);
  const dm = chart.dayMaster;
  const dEl = STEM_ELEMENT[dm];
  const mb = branches[1];
  const season = seasonOfMonthBranch(mb);
  const isMale = input.gender === 'nam';

  const strength = analyzeStrength(stems, branches);
  const pattern = determinePattern({ stems, branches, strength });
  const yong = chooseYongShen({ stems, branches, strength, pattern });
  const names = chart.pillars.map((p) => p.label.toLowerCase());
  const relations = analyzeRelations(stems, branches, names);
  const shensha = computeShenSha(stems, branches, chart.pillars.map((p) => `Trụ ${p.label.toLowerCase()}`), 2, 1, 0, chart.emptyBranches);

  const tot = ELEMENTS.reduce((a, e) => a + strength.scores[e], 0);
  const share = (g: GodGroup) => strength.scores[groupElement(dEl, g)] / tot;
  const sc = yong.elementScore;
  const godCounts = { 'Tỷ Kiếp': 0, 'Thực Thương': 0, 'Tài': 0, 'Quan Sát': 0, 'Ấn': 0 } as Record<GodGroup, number>;
  chart.pillars.forEach((p, i) => {
    if (i !== 2) godCounts[godGroupOf(p.stemGod as TenGod)] += 1;
    godCounts[godGroupOf(p.hidden[0].god)] += 1;
  });

  // ---- Đại vận & lưu niên
  const ctxL = { dayMaster: dm, natalStems: stems, natalBranches: branches, elementScore: sc };
  const ref = chart.referenceYear;
  const luck: LuckRow[] = chart.luck.map((l) => ({
    ...l, evaluation: evaluatePeriod(l.stem, l.branch, ctxL, 'van'),
    current: l.startYear !== null && l.endYear !== null && ref >= l.startYear && ref <= l.endYear,
  }));
  const years: YearRow[] = [];
  for (let y = ref - 1; y <= ref + 10; y++) {
    const yp = yearPillar(y);
    const li = luck.findIndex((l) => l.startYear !== null && y >= l.startYear && y <= (l.endYear ?? 0));
    const ev = evaluatePeriod(yp.stem, yp.branch, ctxL, 'nam');
    const comb = combineYearWithLuck(ev, li >= 0 ? luck[li].evaluation : null);
    years.push({ year: y, ...yp, age: input.birthYear ? y - input.birthYear + 1 : null, evaluation: ev, combined: comb, luckIndex: li >= 0 ? li : null, current: y === ref });
  }

  // ---- Dụng thần đề yếu
  const dy = (DE_YEU as Record<string, Record<string, { thuongLy: string; bienLy: string[]; viDu: string[] }>>)[STEMS[dm]]?.[String(yong.deYeuKey.month)] ?? null;

  // ================== CÁC MỤC LUẬN GIẢI ==================
  const sections: Section[] = [];
  const DMI = DAY_MASTER[dm];
  const elDesc = (e: Element) => `${e} (${elementGroup(dEl, e)})`;
  const listEl = (a: Element[]) => (a.length ? a.map(elDesc).join(', ') : '—');

  // 1. Tổng quan
  const pName = pattern.special ? pattern.special.name : pattern.name;
  sections.push({
    id: 'tong-quan', title: 'Tổng quan mệnh cục',
    summary: `${isMale ? 'Càn' : 'Khôn'} tạo ${chart.pillars.map((p) => pillarName(p)).join(' · ')} – nhật chủ ${STEMS[dm]} ${dEl} sinh tháng ${BRANCHES[mb]} (${season}), ${strength.level.toLowerCase()}, ${pName}; dụng thần ${yong.useful}.`,
    paragraphs: [
      `Nhật chủ ${STEMS[dm]} ${dEl} – ${DMI.title}. ${DMI.image} Sinh vào tháng ${BRANCHES[mb]} mùa ${season}, ${strength.deLingNote.split(': ')[1]}.`,
      `Tổng hợp lực lượng ngũ hành, phe trợ thân (Ấn + Tỷ Kiếp) chiếm ${pct(strength.ratio)} → nhật chủ ở mức **${strength.level}**. Mệnh cục lấy **${pName}**${pattern.special ? '' : ` (${pattern.verdict.toLowerCase()})`}, cấp bậc ước lượng: ${pattern.grade}.`,
      `Dụng thần: **${yong.useful}**; hỷ thần: ${listEl(yong.favorable)}; kỵ thần: ${listEl(yong.unfavorable)}${yong.enemy.length ? `; cừu thần: ${listEl(yong.enemy)}` : ''}.`,
      ...(chart.warnings.length ? [`Lưu ý dữ liệu: ${chart.warnings.join(' ')}`] : []),
    ],
  });

  // 2. Nhật chủ & tính cách gốc
  sections.push({
    id: 'nhat-chu', title: `Nhật chủ ${STEMS[dm]} ${dEl}`,
    summary: DMI.nature,
    paragraphs: [DMI.poem, `Bản tính: ${DMI.nature}`, `Ưu điểm: ${DMI.strengths}`, `Điểm cần lưu ý: ${DMI.weaknesses}`, `Theo mùa sinh (${season}): ${DMI.seasonNote[season]}`],
    source: 'Trích Thiên Tủy – Thiên can; Thiên Lý Mệnh Cảo',
  });

  // 3. Ngũ hành & vượng suy
  const strongEls = strength.elements.filter((e) => e.level === 'Cực vượng' || e.level === 'Vượng').map((e) => e.element);
  const weakEls = strength.elements.filter((e) => e.level === 'Khuyết' || e.level === 'Rất nhược').map((e) => e.element);
  sections.push({
    id: 'vuong-suy', title: 'Ngũ hành & vượng suy',
    summary: `${strength.level} – trợ ${pct(strength.ratio)} / khắc tiết hao ${pct(1 - strength.ratio)}.`,
    paragraphs: [
      `Phân bố ngũ hành (đã tính hệ số mùa, thông căn, hợp – xung): ${strength.elements.map((e) => `${e.element} ${pct(e.percent)} (${e.state})`).join(', ')}.`,
      `${strongEls.length ? `Hành vượng: ${strongEls.join(', ')}. ` : ''}${weakEls.length ? `Hành khuyết/rất yếu: ${weakEls.join(', ')}.` : 'Không có hành nào bị khuyết hẳn.'}`,
      `Ba bước định vượng suy (Mệnh Lý Huyền Cơ Tham Bí): ① ${strength.deLingNote}. ② ${strength.deDiNote}. ③ ${strength.deShiNote}.`,
      ...(strength.transforms.length ? [`Biến hoá trong cục: ${strength.transforms.join('; ')}.`] : []),
      `Hỷ kỵ của ${dEl} mùa ${season} (Thiên Lý Mệnh Cảo): ${ELEMENT_SEASON[dEl][season]}`,
      strength.levelIndex >= 7 || strength.levelIndex <= 1
        ? 'Mức thái/cực thuộc “biến lý” vượng suy: thái vượng hỷ tiết thuận, cực vượng lại nên thuận theo (sinh phù); thái nhược có gốc khó tòng, cực nhược thì nên tòng (Nhâm Thiết Tiều – Lý điên đảo ngũ hành).'
        : 'Mức thiên vượng/thiên nhược/trung hoà thuộc “thường lý”: vượng thì nên tiết nên khắc, suy thì hỷ bang hỷ trợ.',
    ],
    source: 'Mệnh Lý Huyền Cơ Tham Bí – Làm sao nắm chắc vượng suy; Thiên Lý Mệnh Cảo – Cường nhược',
  });

  // 4. Cách cục
  sections.push({
    id: 'cach-cuc', title: `Cách cục: ${pName}`,
    summary: `${pattern.verdict} – cấp ${pattern.grade}. ${pattern.purity}.`,
    paragraphs: [
      pattern.basis,
      PATTERN_INFO[pattern.name] ?? '',
      ...(pattern.special ? [`Ngoại cách: khí thế toàn cục dồn về ${pattern.special.element}${pattern.special.follow ? ` (nhóm ${pattern.special.follow})` : ''}. Ngoại cách thành thì tượng “tinh hoa” – tòng Quan thì quý, tòng Tài thì phú, tòng Nhi thì phúc (Mệnh Lý Huyền Cơ Tham Bí).`] : []),
    ].filter(Boolean),
    bullets: [
      ...pattern.success.map((s) => `✔ Thành: ${s}`),
      ...pattern.rescue.map((s) => `↺ Cứu ứng: ${s}`),
      ...pattern.failure.map((s) => `✘ Bại: ${s}`),
      ...pattern.excess.map((s) => `▲ Thái quá: ${s}`),
      ...pattern.deficiency.map((s) => `▼ Bất cập: ${s}`),
    ],
    source: 'Thiên Lý Mệnh Cảo – Bát cách, Ngoại cách; Tử Bình Chân Thuyên – Dụng thần thành bại cứu ứng',
  });

  // 5. Dụng thần
  sections.push({
    id: 'dung-than', title: 'Dụng thần – Hỷ thần – Kỵ thần',
    summary: `Dụng ${yong.useful} · Hỷ ${yong.favorable.join(', ') || '—'} · Kỵ ${yong.unfavorable.join(', ') || '—'}`,
    paragraphs: [
      `Phương pháp: ${yong.method}.`,
      ...yong.reasons,
      `Dụng thần ${yong.useful} là ${elementGroup(dEl, yong.useful)} của nhật chủ. Vận/năm gặp ${[yong.useful, ...yong.favorable].join(', ')} thường thuận lợi; gặp ${yong.unfavorable.join(', ') || '—'} thì trắc trở.`,
      ...(dy ? [`Bát Tự Dụng Thần Đề Yếu – ${STEMS[dm]} sinh tháng ${yong.deYeuKey.month} âm (${BRANCHES[mb]}), thường lý: ${dy.thuongLy}`] : []),
    ],
    bullets: dy?.bienLy.map((b) => `Biến lý: ${b}`),
    source: 'Thiên Lý Mệnh Cảo – Dụng thần Bát cách; Tử Bình Chân Thuyên – Bát Tự Dụng Thần Đề Yếu',
  });

  // 6. Tính cách theo thập thần
  const groupsSorted = (Object.keys(godCounts) as GodGroup[]).sort((a, b) => share(b) - share(a));
  const topGods: TenGod[] = [];
  chart.pillars.forEach((p, i) => { if (i !== 2) topGods.push(p.stemGod as TenGod); });
  const godFreq = TEN_GODS.map((g) => ({ g, n: topGods.filter((x) => x === g).length + chart.pillars.filter((p) => p.hidden[0].god === g).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const persona: string[] = [];
  godFreq.slice(0, 3).forEach(({ g, n }) => {
    const info = TEN_GOD_INFO[g];
    const good = sc[groupElement(dEl, godGroupOf(g))] >= 0;
    persona.push(`${g} xuất hiện ${n} lần (${info.keyword}): ${good ? `là hỷ dụng → phát huy mặt tốt: ${info.positive}` : `là kỵ thần → dễ lộ mặt hạn chế: ${info.negative}; mặt tích cực: ${info.positive}`}.`);
  });
  const flow = flowChain(stems, branches);
  sections.push({
    id: 'tinh-cach', title: 'Tính cách & tâm tính',
    summary: `Nổi bật: ${godFreq.slice(0, 3).map((x) => x.g).join(', ')}.`,
    paragraphs: [
      ...persona,
      `Nhóm lực mạnh nhất trong cục: ${groupsSorted.slice(0, 2).map((g) => `${g} (${pct(share(g))})`).join(', ')}; yếu nhất: ${groupsSorted.slice(-1).map((g) => `${g} (${pct(share(g))})`).join('')}.`,
      'Thiên can đại biểu quan niệm, biểu hiện bên ngoài; địa chi đại biểu thế giới nội tâm (Manh phái – cung vị).',
      ...(flow ? [flow] : []),
    ],
    source: 'Manh phái – Thập thần loại tượng; Khí thế lưu thông',
  });

  // 7. Sự nghiệp & tài lộc
  const careers: string[] = [];
  careers.push(`Ngành nghề hợp hành dụng/hỷ (${[yong.useful, ...yong.favorable].join(', ')}): ${[yong.useful, ...yong.favorable].map((e) => ELEMENT_INFO[e].careers).join('; ')}.`);
  const usefulGod = elementGroup(dEl, yong.useful);
  const godCareer: Record<GodGroup, TenGod> = { 'Tỷ Kiếp': 'Tỷ Kiên', 'Thực Thương': stemYang(dm) ? 'Thực Thần' : 'Thực Thần', 'Tài': 'Chính Tài', 'Quan Sát': 'Chính Quan', 'Ấn': 'Chính Ấn' };
  careers.push(`Dụng thần thuộc nhóm ${usefulGod} → hướng phát triển: ${TEN_GOD_INFO[godCareer[usefulGod]].career}.`);
  const fu = wealthChecks(strength, share, yong, pattern, stems, dEl);
  const gui = rankChecks(strength, share, yong, pattern, stems, dm);
  sections.push({
    id: 'su-nghiep', title: 'Sự nghiệp, công danh & tài lộc',
    summary: `${fu.length ? 'Có dấu hiệu phú' : 'Tài lộc trung bình'}${gui.length ? ', có tượng quý (công danh)' : ''}.`,
    paragraphs: careers,
    bullets: [...fu.map((x) => `Phú: ${x}`), ...gui.map((x) => `Quý: ${x}`)],
    source: 'Thiên Lý Mệnh Cảo – Phú, Quý; Manh phái – Thập thần loại tượng',
  });

  // 8. Lục thân
  sections.push({ id: 'luc-than', title: 'Lục thân: cha mẹ, anh em, hôn nhân, con cái', summary: 'Theo thập thần và cung vị.', paragraphs: sixRelatives(chart, strength, share, yong, isMale, stems, branches, dEl), source: 'Thiên Lý Mệnh Cảo – Lục thân, Nữ mệnh; Lục Thân cao cấp diện thụ; Manh phái – cung vị' });

  // 9. Sức khoẻ
  sections.push({ id: 'suc-khoe', title: 'Sức khoẻ', summary: 'Theo ngũ hành thái quá/bất cập và hình xung.', paragraphs: healthNotes(strength, stems, branches, dm), source: 'Tử Bình Bệnh Nguyên Sinh Tử' });

  // 10. Đại vận
  const cur = luck.find((l) => l.current);
  sections.push({
    id: 'dai-van', title: 'Đại vận',
    summary: cur ? `Đang ở vận ${pillarName(cur)} (${cur.startYear}–${cur.endYear}): ${cur.evaluation.rating}.` : `Đại vận ${chart.forward ? 'thuận' : 'nghịch'} hành.`,
    paragraphs: [
      `${isMale ? 'Nam' : 'Nữ'}, năm can ${stemYang(stems[0]) ? 'dương' : 'âm'} → đại vận ${chart.forward ? 'thuận' : 'nghịch'} hành${input.luckStartText ? `; khởi vận: ${input.luckStartText}` : ''}. Mỗi vận 10 năm, chấm theo dụng thần: can trọng 40%, chi trọng 60% (vận trọng địa chi).`,
      ...luck.slice(0, 9).map((l) => `${pillarName(l)}${l.startYear ? ` (${l.startYear}–${l.endYear}${l.startAge !== null ? `, ${l.startAge}–${l.startAge + 9} tuổi` : ''})` : ''} – ${l.evaluation.rating}${l.current ? ' ← hiện tại' : ''}: ${l.evaluation.themes.join(' ')}${l.evaluation.notes.length ? ' ' + l.evaluation.notes.join(' ') : ''}`),
    ],
    source: 'Thiên Lý Mệnh Cảo – Vận hạn',
  });

  // 11. Lưu niên
  sections.push({
    id: 'luu-nien', title: 'Lưu niên',
    summary: (() => { const y = years.find((x) => x.current)!; return `Năm ${y.year} ${pillarName(y)}: ${y.combined.rating}.`; })(),
    paragraphs: years.map((y) => `${y.year} ${pillarName(y)}${y.age ? ` (${y.age} tuổi)` : ''} – ${y.combined.rating}. ${y.combined.note} ${y.evaluation.themes[0]} ${y.evaluation.notes.slice(0, 2).join(' ')}`),
    source: 'Thiên Lý Mệnh Cảo – Lưu niên; quan hệ Lưu niên – Đại vận',
  });

  // 12. Cải vận
  const imp = [yong.useful, ...yong.favorable.filter((e) => e !== yong.useful)].slice(0, 2);
  sections.push({
    id: 'cai-van', title: 'Cải vận theo dụng thần',
    summary: `Bổ sung ${imp.join(' & ')}; hạn chế ${yong.unfavorable.join(', ') || '—'}.`,
    paragraphs: imp.flatMap((e) => {
      const I = ELEMENT_INFO[e];
      return [`Hành ${e} (${I.nature}): màu ${I.color}; hướng ${I.direction}; số ${I.numbers}; thời điểm tốt ${I.time}; vật phẩm: ${I.items}; ăn uống: ${I.foods}. ${I.lifestyle}`];
    }).concat(yong.unfavorable.length ? [`Hạn chế lạm dụng hành ${yong.unfavorable.join(', ')}: tránh màu ${yong.unfavorable.map((e) => ELEMENT_INFO[e].color.split(',')[0]).join(', ')} làm chủ đạo.`] : []),
    source: 'Đổi Vận Cho Người Mệnh Khuyết – Lý Cư Minh; Hà Đồ ngũ hành',
  });

  return {
    chart, strength, pattern, yong, relations, shensha, luck, years, deYeu: dy, godCounts, sections, sources: SOURCES,
  };
}

// ---------- Khí thế lưu thông: chuỗi tương sinh liên tiếp ----------
function flowChain(stems: number[], branches: number[]): string | null {
  const seq: Element[] = [];
  for (let i = 0; i < branches.length; i++) seq.push(BRANCH_ELEMENT[branches[i]]);
  const els = [...new Set([...stems.map((s) => STEM_ELEMENT[s]), ...seq])];
  // tìm chuỗi sinh dài nhất trong tập hành có mặt
  let best: Element[] = [];
  for (const start of els) {
    const chain = [start];
    let cur = start;
    while (els.includes(generates(cur)) && !chain.includes(generates(cur))) { cur = generates(cur); chain.push(cur); }
    if (chain.length > best.length) best = chain;
  }
  if (best.length >= 4) return `Khí thế lưu thông: ngũ hành nối nhau tương sinh ${best.join(' → ')} – bát tự “một mạch cùng sinh” chủ đầu óc linh hoạt, học nhanh; kỵ vận cắt đứt dòng khí (Khí thế lưu thông).`;
  if (best.length === 5) return null;
  return null;
}

function wealthChecks(st: StrengthResult, share: (g: GodGroup) => number, y: YongShen, p: PatternResult, stems: number[], dEl: Element): string[] {
  const out: string[] = [];
  const has = (g: GodGroup) => stems.some((s, i) => i !== 2 && elementGroup(dEl, STEM_ELEMENT[s]) === g) || share(g) >= 0.12;
  if (has('Tài') && has('Quan Sát') && st.strong) out.push('Tài tinh sinh Quan, Quan bảo vệ Tài – cục phú quý tương liên.');
  if (y.unfavorable.includes(groupElement(dEl, 'Ấn')) && has('Tài')) out.push('Ấn là kỵ thần mà có Tài phá Ấn – tự lập làm giàu.');
  if (share('Thực Thương') >= 0.2 && has('Tài')) out.push('Thực Thương nặng gặp Tài lưu thông – kiếm tiền bằng tài năng, chất xám.');
  if (st.strong && share('Tài') >= 0.18 && (has('Thực Thương') || has('Quan Sát'))) out.push('Thân vượng Tài vượng, có Thực Thương hoặc Quan Sát – mệnh giàu có.');
  if (!st.strong && share('Tài') >= 0.3 && has('Tỷ Kiếp')) out.push('Thân nhược Tài nặng nhưng có Tỷ Kiếp giúp thân – vẫn gánh được tài.');
  if (st.strong && !has('Tài') && has('Thực Thương')) out.push('Thân vượng, có Thực Thương mà Tài ẩn – tiềm năng tài lộc, cần vận Tài kích hoạt.');
  if (y.usefulGroup === 'Tài') out.push('Dụng thần là Tài – cả đời gắn với tiền bạc, kinh doanh; vận Tài là vận phát.');
  if (st.strong && share('Tài') < 0.08 && share('Tỷ Kiếp') >= 0.35) out.push('⚠ Thân vượng Tỷ Kiếp nhiều mà Tài nhẹ – dễ quần kiếp tranh tài, cẩn trọng hợp tác chia tiền.');
  if (!st.strong && share('Tài') >= 0.35 && !has('Tỷ Kiếp')) out.push('⚠ Tài đa thân nhược – “phú ốc bần nhân”, nên làm công/hợp tác hơn là tự ôm việc lớn.');
  void p;
  return out;
}

function rankChecks(st: StrengthResult, share: (g: GodGroup) => number, y: YongShen, p: PatternResult, stems: number[], dm: number): string[] {
  const out: string[] = [];
  const gods = stems.filter((_, i) => i !== 2).map((s) => tenGod(dm, s));
  const hasG = (g: TenGod) => gods.includes(g);
  if (st.strong && share('Quan Sát') >= 0.15 && share('Ấn') >= 0.1) out.push('Quan vượng thân vượng, có Ấn hộ Quan – có tượng công danh, địa vị.');
  if (hasG('Thất Sát') && share('Ấn') >= 0.12 && !st.strong) out.push('Sát Ấn tương sinh – quý hiển, hợp môi trường quyền lực/tổ chức.');
  if (hasG('Thất Sát') && (hasG('Thực Thần')) && st.strong) out.push('Thực thần chế Sát – có quyền, giỏi xử lý khủng hoảng.');
  if (hasG('Thương Quan') && share('Ấn') >= 0.15 && !st.strong) out.push('Thương quan bội Ấn – học vấn tài hoa thành danh.');
  if (y.usefulGroup === 'Quan Sát') out.push('Dụng thần là Quan Sát – hợp con đường tổ chức, quản lý; vận Quan là vận thăng tiến.');
  if (hasG('Chính Quan') && hasG('Thất Sát')) out.push('⚠ Quan Sát hỗn tạp – công việc dễ thay đổi, cần chuyên nhất một hướng.');
  if (hasG('Thương Quan') && hasG('Chính Quan')) out.push('⚠ Thương quan kiến Quan – dễ va chạm cấp trên, thị phi pháp lý.');
  void p;
  return out;
}

function sixRelatives(chart: ChartData, st: StrengthResult, share: (g: GodGroup) => number, y: YongShen, isMale: boolean, stems: number[], branches: number[], dEl: Element): string[] {
  const out: string[] = [];
  const sc = y.elementScore;
  const elOf = (g: GodGroup) => groupElement(dEl, g);
  const has = (g: GodGroup) => stems.some((s, i) => i !== 2 && STEM_ELEMENT[s] === elOf(g)) || share(g) >= 0.1;
  const dayBranch = branches[2];
  const dayMainEl = STEM_ELEMENT[HIDDEN_STEMS[dayBranch][0][0]];
  const dayGood = sc[dayMainEl] > 0, dayBad = sc[dayMainEl] < 0;
  const dayClashed = branches.some((b, i) => i !== 2 && isClash(b, dayBranch));

  // Cha mẹ
  const pm: string[] = [];
  if (sc[elOf('Ấn')] > 0) pm.push('Ấn tinh là hỷ dụng – được cha mẹ, bề trên che chở, nâng đỡ học hành.');
  if (sc[elOf('Ấn')] < 0 && share('Ấn') >= 0.25) pm.push('Ấn trọng mà là kỵ thần – dễ được bao bọc quá mức hoặc chịu ảnh hưởng nặng từ gia đình; nên tự lập sớm.');
  const monthStemGood = sc[STEM_ELEMENT[stems[1]]] > 0, yearStemGood = sc[STEM_ELEMENT[stems[0]]] > 0;
  pm.push(monthStemGood || yearStemGood ? 'Can năm/tháng là hỷ dụng – gốc gác gia đình hỗ trợ tốt thời thanh thiếu niên.' : 'Can năm/tháng là kỵ – cha mẹ ít trợ lực, tuổi trẻ nhiều tự bươn chải.');
  if (!st.strong && share('Tài') >= 0.3 && share('Ấn') < 0.12) pm.push('Ấn suy mà Tài nhiều – sức khoẻ mẹ cần chú ý, duyên với mẹ dễ mỏng.');
  if (isClash(branches[0], branches[1])) pm.push('Chi năm – tháng xung: gia đình gốc có biến động, có thể rời quê lập nghiệp sớm.');
  out.push(`Cha mẹ: ${pm.join(' ')}`);

  // Anh em
  const ae: string[] = [];
  if (sc[elOf('Tỷ Kiếp')] > 0) ae.push('Tỷ Kiếp là hỷ dụng – anh em bạn bè có lực, hợp tác thuận.');
  else if (share('Tỷ Kiếp') >= 0.3) ae.push('Tỷ Kiếp vượng mà là kỵ thần – anh em bạn bè đông nhưng dễ tranh giành, hao tài vì người thân; nên rạch ròi tiền bạc.');
  else ae.push('Tỷ Kiếp không nổi bật – anh em mỗi người một hướng, chủ yếu tự lực.');
  out.push(`Anh em: ${ae.join(' ')}`);

  // Hôn nhân
  const hn: string[] = [];
  if (isMale) {
    if (y.usefulGroup === 'Tài') hn.push('Dụng thần là Tài tinh – vợ đẹp người, có phúc, giúp chồng.');
    if (st.strong && !has('Tài')) hn.push('Thân vượng mà không có Tài tinh – duyên vợ đến muộn, cần chủ động.');
    if (share('Tài') < 0.1 && share('Tỷ Kiếp') >= 0.3 && !has('Quan Sát')) hn.push('Tài nhẹ, Tỷ Kiếp nhiều, không Quan chế – dễ có cạnh tranh trong tình cảm, hôn nhân cần vun đắp.');
    if (!st.strong && share('Tài') >= 0.3 && !has('Tỷ Kiếp')) hn.push('Tài nặng thân nhược – áp lực từ phía vợ/gia đình vợ, nên cân bằng vai trò.');
    const taiStems = stems.filter((s, i) => i !== 2 && STEM_ELEMENT[s] === elOf('Tài'));
    if (taiStems.length >= 2) hn.push('Tài tinh lộ nhiều – duyên khác giới phong phú, cần chuyên nhất.');
  } else {
    const gods = stems.filter((_, i) => i !== 2).map((s) => tenGod(stems[2], s));
    if (y.usefulGroup === 'Quan Sát') hn.push('Dụng thần là Quan Sát (phu tinh) – chồng có năng lực, được nhờ chồng.');
    if (gods.includes('Chính Quan') && gods.includes('Thất Sát')) hn.push('Quan Sát hỗn tạp – tình duyên phức tạp, dễ có hơn một mối quan hệ quan trọng.');
    if (share('Thực Thương') >= 0.28 && share('Quan Sát') < 0.12 && !has('Tài')) hn.push('Thương Quan mạnh mà Quan nhẹ, không Tài thông quan – dễ khắc phu, nên kết hôn muộn và mềm mỏng.');
    if (share('Tỷ Kiếp') >= 0.3 && !has('Quan Sát')) hn.push('Tỷ Kiếp vượng không có Quan – độc lập mạnh, hôn nhân dễ lạnh nhạt.');
    if (st.strong && !has('Quan Sát')) hn.push('Thân vượng không thấy phu tinh – duyên chồng đến muộn.');
  }
  hn.push(dayGood ? `Chi ngày ${BRANCHES[dayBranch]} (cung phu thê) là hỷ dụng – người phối ngẫu có lực, trung niên ổn định.` : dayBad ? `Chi ngày ${BRANCHES[dayBranch]} (cung phu thê) là kỵ thần – vợ/chồng ít trợ lực hoặc tính khí khác biệt, cần nhường nhịn.` : `Chi ngày ${BRANCHES[dayBranch]} trung tính.`);
  if (dayClashed) hn.push('Cung phu thê bị xung – hôn nhân dễ biến động, xa cách; năm/vận xung chi ngày cần giữ gìn.');
  out.push(`Hôn nhân: ${hn.join(' ')}`);

  // Con cái
  const cc: string[] = [];
  if (st.strong && share('Ấn') < 0.15 && has('Thực Thương')) cc.push('Thân vượng, Ấn nhẹ, có Thực Thương – đường con cái thuận, con nhiều.');
  if (st.strong && share('Ấn') >= 0.3 && share('Thực Thương') < 0.1) cc.push('Thân vượng Ấn trọng, Thực Thương nhẹ – con ít hoặc muộn.');
  if (!st.strong && share('Thực Thương') >= 0.28 && has('Ấn')) cc.push('Thân nhược Thực Thương nặng nhưng có Ấn – vẫn có con, cần chăm sóc sức khoẻ.');
  if (sc[elOf('Thực Thương')] > 0) cc.push('Thực Thương là hỷ dụng – con cái tốt, có lực đỡ.');
  const els = (e: Element) => st.scores[e] / ELEMENTS.reduce((a, x) => a + st.scores[x], 0);
  if (els('Hỏa') > 0.4 && els('Thủy') < 0.06) cc.push('Hoả viêm thổ táo – đường con cái muộn (Thiên Lý Mệnh Cảo).');
  if (els('Thủy') > 0.4 && els('Hỏa') < 0.06) cc.push('Kim hàn thuỷ lãnh/thuỷ phiếm – đường con cái muộn, cần điều hậu.');
  if (chart.pillars[3]) cc.push(sc[STEM_ELEMENT[stems[3]]] > 0 ? 'Can giờ là hỷ dụng – con cái hiếu thuận, hậu vận được nhờ.' : 'Can giờ là kỵ – con cái tự lập, hậu vận nên tự lo.');
  if (!cc.length) cc.push('Đường con cái ở mức bình thường.');
  out.push(`Con cái: ${cc.join(' ')}`);
  out.push(`Cung vị (Manh phái): ${PALACE_MEANING.map((p) => `${p.pillar} – ${p.people}`).join('; ')}.`);
  return out;
}

function healthNotes(st: StrengthResult, stems: number[], branches: number[], dm: number): string[] {
  const out: string[] = [];
  st.elements.forEach((e) => {
    if (e.level === 'Cực vượng') out.push(`${e.element} thái quá (${pct(e.percent)}): ${ELEMENT_INFO[e.element].excess}`);
    if (e.level === 'Khuyết' || e.level === 'Rất nhược') out.push(`${e.element} bất cập (${pct(e.percent)}): ${ELEMENT_INFO[e.element].deficient}`);
  });
  const hasB = (b: number) => branches.includes(b);
  const hasS = (s: number) => stems.includes(s);
  if (hasB(0) && hasB(7)) out.push('Tý – Mùi tương hại: tỳ vị (lá lách, dạ dày) dễ có bệnh.');
  if (hasB(1) && hasB(6)) out.push('Sửu – Ngọ tương hại: bệnh tật lâu ngày ở vùng bụng, dạ dày.');
  if (hasB(4) && hasB(3)) out.push('Thìn – Mão cùng có: chú ý đau lưng, bàn chân.');
  if (hasB(1) && hasB(10) && hasB(7)) out.push('Sửu Tuất Mùi tam hình: tứ chi dễ có bệnh lâu khỏi.');
  if (hasB(8) && hasB(5)) out.push('Thân – Tị: chú ý tay chân, khớp vai, viêm khớp.');
  if ((hasS(6) || hasS(7)) && (hasS(2) || hasS(3))) out.push('Thiên can có Canh/Tân cùng Bính/Đinh: dễ cận thị, mắt kém; Bính Đinh khắc Canh Tân còn liên quan ruột, hô hấp.');
  const gods = stems.filter((_, i) => i !== 2).map((s) => tenGod(dm, s));
  if (gods.includes('Thiên Ấn') && (gods.includes('Thực Thần') || branches.some((b) => tenGod(dm, HIDDEN_STEMS[b][0][0]) === 'Thực Thần'))) out.push('Kiêu thần đoạt Thực: tiêu hoá kém, ăn uống thất thường.');
  if (!out.length) out.push('Ngũ hành tương đối quân bình – không có điểm bệnh nổi bật; giữ cân bằng theo dụng thần.');
  out.push(`Cơ quan theo hành nhật chủ (${STEM_ELEMENT[dm]}): ${ELEMENT_INFO[STEM_ELEMENT[dm]].organs}.`);
  out.push('Lưu ý: thông tin mang tính tham khảo theo mệnh lý cổ, không thay thế chẩn đoán y khoa.');
  return out;
}

export { STEMS, BRANCHES, nayinOf, NAYIN_MEANING, controlledBy, stemCombo };
