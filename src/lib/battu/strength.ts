// Đo lực lượng ngũ hành & vượng suy nhật chủ
// Nguyên lý (Mệnh Lý Huyền Cơ Tham Bí – "Làm sao nắm chắc vượng suy"; Thiên Lý Mệnh Cảo – "Cường, Nhược"):
//  1) xem nhật can ở nguyệt lệnh trạng thái nào (đắc lệnh); 2) quan hệ với chi toạ & thần nắm lệnh (đắc địa);
//  3) vận dụng sinh khắc chế hoá (hợp, hội, xung) để ra "thực tế vượng suy".
import {
  Element, ELEMENTS, STEM_ELEMENT, HIDDEN_STEMS, seasonalState, SEASON_FACTOR, SeasonState, lifeStage,
  LIFE_STAGES, generatedBy, STEMS, BRANCHES, BRANCH_ELEMENT,
} from './constants';
import { stemCombo, sixCombo, isClash, TRINES, DIRECTIONAL } from './relations';

export interface Contribution { source: string; element: Element; value: number; note?: string }
export interface ElementState { element: Element; score: number; percent: number; state: SeasonState; level: 'Cực vượng' | 'Vượng' | 'Trung bình' | 'Nhược' | 'Rất nhược' | 'Khuyết' }

export type StrengthLevel = 'Cực nhược' | 'Thái nhược' | 'Thiên nhược' | 'Trung hòa thiên nhược' | 'Trung hòa' | 'Trung hòa thiên vượng' | 'Thiên vượng' | 'Thái vượng' | 'Cực vượng';
export const STRENGTH_LEVELS: StrengthLevel[] = ['Cực nhược', 'Thái nhược', 'Thiên nhược', 'Trung hòa thiên nhược', 'Trung hòa', 'Trung hòa thiên vượng', 'Thiên vượng', 'Thái vượng', 'Cực vượng'];

export interface StrengthResult {
  scores: Record<Element, number>;
  elements: ElementState[];
  contributions: Contribution[];
  transforms: string[];
  dayElement: Element;
  support: number; oppose: number; ratio: number;
  level: StrengthLevel; levelIndex: number; // 0..8
  strong: boolean; // ≥ Trung hòa thiên vượng
  deLing: boolean; deDi: boolean; deShi: boolean;
  deLingNote: string; deDiNote: string; deShiNote: string;
  rootScore: number; // lực gốc rễ của nhật chủ trong địa chi
  resourceScore: number; peerScore: number;
}

export const STRENGTH_PARAMS = {
  stemW: [0.9, 1.15, 0, 0.95],
  branchW: [0.9, 2.6, 1.9, 1.0],
  season: 0.25,      // biên độ hệ số vượng/tướng/hưu/tù/tử
  rootMin: 0.4,      // can không gốc còn bao nhiêu lực
  selfW: 0.8,        // tính bản thân nhật chủ vào phe trợ
  lingBonus: 0,      // cộng thêm khi nhật chủ đắc lệnh
  resW: 0.85,        // tỉ trọng Ấn trong phe trợ
};
const P = STRENGTH_PARAMS;
const SF = (st: SeasonState) => ({ 'Vượng': 1 + P.season, 'Tướng': 1 + P.season * 0.45, 'Hưu': 1 - P.season * 0.25, 'Tù': 1 - P.season * 0.5, 'Tử': 1 - P.season * 0.75 })[st];
const POS_NAMES = ['năm', 'tháng', 'ngày', 'giờ'];

export function analyzeStrength(stems: number[], branches: number[]): StrengthResult {
  const n = stems.length;
  const mb = branches[1];
  const dm = stems[2];
  const dEl = STEM_ELEMENT[dm];
  const contributions: Contribution[] = [];
  const transforms: string[] = [];

  // --- Hệ số biến đổi cho chi (xung, hợp) và can (hợp)
  const branchKeep = branches.map(() => 1);          // phần giữ nguyên hành gốc
  const branchConv: { el: Element; frac: number }[][] = branches.map(() => []);
  const stemKeep = stems.map(() => 1);
  const stemConv: { el: Element; frac: number }[] = stems.map(() => ({ el: 'Thổ' as Element, frac: 0 }));

  const supported = (el: Element) => ['Vượng', 'Tướng'].includes(seasonalState(el, mb));

  // Tam hội, Tam hợp
  const usedInBig = new Set<number>();
  for (const [set, el] of DIRECTIONAL) {
    const pos = set.map((b) => branches.indexOf(b));
    if (pos.every((p) => p >= 0)) {
      const frac = supported(el) || set.includes(mb) ? 0.75 : 0.55;
      pos.forEach((p) => { branchConv[p].push({ el, frac }); usedInBig.add(p); });
      transforms.push(`${set.map((b) => BRANCHES[b]).join(' ')} tam hội ${el} cục – chuyển ~${Math.round(frac * 100)}% lực các chi sang ${el}`);
    }
  }
  for (const [set, el] of TRINES) {
    const pos = set.map((b) => branches.indexOf(b));
    if (pos.every((p) => p >= 0)) {
      const frac = supported(el) || set.includes(mb) ? 0.65 : 0.45;
      pos.forEach((p) => { if (!usedInBig.has(p)) branchConv[p].push({ el, frac }); usedInBig.add(p); });
      transforms.push(`${set.map((b) => BRANCHES[b]).join(' ')} tam hợp ${el} cục – chuyển ~${Math.round(frac * 100)}% lực sang ${el}`);
    } else {
      const [a, mid, c] = set;
      const pm = branches.indexOf(mid);
      if (pm < 0) continue;
      for (const other of [a, c]) {
        const po = branches.indexOf(other);
        if (po < 0 || usedInBig.has(po) || usedInBig.has(pm)) continue;
        const adjacent = Math.abs(po - pm) === 1;
        const frac = (supported(el) || [mid, other].includes(mb) ? 0.3 : 0.15) * (adjacent ? 1 : 0.6);
        if (BRANCH_ELEMENT[other] !== el) branchConv[po].push({ el, frac });
        transforms.push(`${BRANCHES[mid]} – ${BRANCHES[other]} bán hợp ${el}${adjacent ? '' : ' (cách trụ, lực nhẹ)'}`);
      }
    }
  }
  // Lục hợp & xung giữa các chi kề nhau / bất kỳ
  for (let i = 0; i < branches.length; i++) for (let j = i + 1; j < branches.length; j++) {
    const a = branches[i], b = branches[j];
    const adjacent = j - i === 1;
    const el = sixCombo(a, b);
    if (el && !usedInBig.has(i) && !usedInBig.has(j)) {
      const hasTransparent = stems.some((s, k) => k !== 2 && STEM_ELEMENT[s] === el);
      if (adjacent && supported(el) && hasTransparent) {
        [i, j].forEach((p) => { if (BRANCH_ELEMENT[branches[p]] !== el) branchConv[p].push({ el, frac: 0.4 }); });
        transforms.push(`${BRANCHES[a]} ${BRANCHES[b]} lục hợp hoá ${el} (được lệnh, có can dẫn)`);
      } else if (adjacent) {
        [i, j].forEach((p) => { branchKeep[p] *= p === 1 ? 0.92 : 0.85; });
        transforms.push(`${BRANCHES[a]} ${BRANCHES[b]} lục hợp nhưng không hoá – hai chi bị trói, giảm lực`);
      }
    }
    if (isClash(a, b)) {
      const k = adjacent ? 1 : 0.6;
      [i, j].forEach((p) => { branchKeep[p] *= 1 - (p === 1 ? 0.1 : 0.22) * k; });
      transforms.push(`${BRANCHES[a]} ${BRANCHES[b]} xung – ${adjacent ? 'kề nhau, xung mạnh' : 'cách trụ, xung nhẹ'}, hai chi hao lực`);
    }
  }
  // Can hợp (không tính nhật can – nhật can hợp xét riêng ở Hoá khí cách)
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (i === 2 || j === 2 || j - i !== 1) continue;
    const el = stemCombo(stems[i], stems[j]);
    if (!el) continue;
    if (supported(el)) {
      [i, j].forEach((p) => { if (STEM_ELEMENT[stems[p]] !== el) stemConv[p] = { el, frac: 0.5 }; });
      transforms.push(`${STEMS[stems[i]]} ${STEMS[stems[j]]} hợp hoá ${el} (được nguyệt lệnh)`);
    } else {
      [i, j].forEach((p) => { stemKeep[p] *= 0.75; });
      transforms.push(`${STEMS[stems[i]]} ${STEMS[stems[j]]} hợp mà không hoá – hai can bị trói (hợp bán)`);
    }
  }

  // --- Lực gốc của mỗi hành trong địa chi (để tính thông căn của can)
  const convOf = (i: number) => Math.min(0.85, branchConv[i].reduce((a, c) => a + c.frac, 0));
  const rootOf = (el: Element) => {
    let r = 0;
    branches.forEach((b, i) => {
      HIDDEN_STEMS[b].forEach(([hs, w]) => { if (STEM_ELEMENT[hs] === el) r += w * (i === 1 ? 1.5 : 1) * branchKeep[i] * (1 - convOf(i)); });
      branchConv[i].forEach((c) => { if (c.el === el) r += c.frac * (i === 1 ? 1.5 : 1) * branchKeep[i]; });
    });
    return r;
  };

  const scores: Record<Element, number> = { 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Kim': 0, 'Thủy': 0 };
  const addC = (source: string, el: Element, v: number, note?: string) => { scores[el] += v; contributions.push({ source, element: el, value: v, note }); };

  // Can
  stems.forEach((s, i) => {
    if (i === 2) return;
    const el = STEM_ELEMENT[s];
    const sf = SF(seasonalState(el, mb));
    const root = rootOf(el);
    const rootF = P.rootMin + (1 - P.rootMin) * Math.min(1, root / 0.7);
    const base = P.stemW[i] * sf * rootF;
    const keep = stemKeep[i] * (1 - stemConv[i].frac);
    addC(`Can ${POS_NAMES[i]} ${STEMS[s]}`, el, base * keep, root < 0.1 ? 'hư phù (không gốc)' : undefined);
    if (stemConv[i].frac > 0) addC(`Can ${POS_NAMES[i]} ${STEMS[s]} (hoá)`, stemConv[i].el, base * stemKeep[i] * stemConv[i].frac * SF(seasonalState(stemConv[i].el, mb)) / sf);
  });
  // Chi (qua tàng can)
  branches.forEach((b, i) => {
    const conv = branchConv[i];
    const rawFrac = conv.reduce((a, c) => a + c.frac, 0);
    const convFrac = Math.min(0.85, rawFrac);
    const convScale = rawFrac > 0 ? convFrac / rawFrac : 0;
    const w = P.branchW[i] * branchKeep[i];
    HIDDEN_STEMS[b].forEach(([hs, hw]) => {
      const el = STEM_ELEMENT[hs];
      const sf = SF(seasonalState(el, mb));
      addC(`Chi ${POS_NAMES[i]} ${BRANCHES[b]} – tàng ${STEMS[hs]}`, el, w * hw * sf * (1 - convFrac));
    });
    conv.forEach((c) => {
      const sf = SF(seasonalState(c.el, mb));
      addC(`Chi ${POS_NAMES[i]} ${BRANCHES[b]} (hợp hoá)`, c.el, w * c.frac * convScale * sf);
    });
  });

  // Nhật chủ tự thân (để hiển thị phân bố – không tính vào support)
  const dmSelf = 1.0 * SF(seasonalState(dEl, mb));
  const scoresDisplay = { ...scores };
  scoresDisplay[dEl] += dmSelf;

  const resEl = generatedBy(dEl);
  const peer = scores[dEl];
  const res = scores[resEl];
  const total = ELEMENTS.reduce((a, e) => a + scores[e], 0);
  const selfV = P.selfW * SF(seasonalState(dEl, mb));
  const st0 = seasonalState(dEl, mb);
  const ling = (st0 === 'Vượng' || st0 === 'Tướng') ? P.lingBonus : -P.lingBonus * 0.5;
  const support = peer + res * P.resW + selfV;
  const oppose = total - peer - res;
  const ratio = Math.min(1, Math.max(0, support / Math.max(support + oppose, 1e-6) + ling));

  // Đắc lệnh – đắc địa – đắc thế
  const st = seasonalState(dEl, mb);
  const deLing = st === 'Vượng' || st === 'Tướng';
  const stageNames = branches.map((b) => LIFE_STAGES[lifeStage(dm, b)]);
  const goodStages = ['Trường sinh', 'Quan đới', 'Lâm quan', 'Đế vượng'];
  const rootScore = rootOf(dEl);
  const deDi = branches.some((b, i) => i !== 1 && goodStages.includes(stageNames[i])) || rootScore >= 0.9;
  const helperStems = stems.filter((s, i) => i !== 2 && (STEM_ELEMENT[s] === dEl || STEM_ELEMENT[s] === resEl)).length;
  const deShi = helperStems >= 2 || ratio >= 0.5;

  // Quy về 9 mức (ngưỡng hiệu chỉnh theo các lá số ví dụ trong tài liệu)
  const T = [0.12, 0.18, 0.3, 0.37, 0.45, 0.53, 0.68, 0.84];
  let li = 0;
  while (li < T.length && ratio >= T[li]) li++;
  const level = STRENGTH_LEVELS[li];

  const totalDisp = ELEMENTS.reduce((a, e) => a + scoresDisplay[e], 0);
  const elements: ElementState[] = ELEMENTS.map((e) => {
    const pct = scoresDisplay[e] / totalDisp;
    const lv: ElementState['level'] = scoresDisplay[e] < 0.05 ? 'Khuyết' : pct >= 0.38 ? 'Cực vượng' : pct >= 0.26 ? 'Vượng' : pct >= 0.14 ? 'Trung bình' : pct >= 0.07 ? 'Nhược' : 'Rất nhược';
    return { element: e, score: scoresDisplay[e], percent: pct, state: seasonalState(e, mb), level: lv };
  });

  return {
    scores: scoresDisplay, elements, contributions, transforms: [...new Set(transforms)], dayElement: dEl,
    support, oppose, ratio, level, levelIndex: li, strong: li >= 5,
    deLing, deDi, deShi,
    deLingNote: `Nhật chủ ${STEMS[dm]} (${dEl}) sinh tháng ${BRANCHES[mb]}: ${st}${deLing ? ' → đắc lệnh' : ' → thất lệnh'}`,
    deDiNote: `Nhật chủ tại các chi: ${branches.map((b, i) => `${BRANCHES[b]}·${stageNames[i]}`).join(', ')}${deDi ? ' → có gốc (đắc địa)' : ' → gốc yếu (thất địa)'}`,
    deShiNote: `Can trợ giúp (Ấn/Tỷ) lộ ra: ${helperStems}${deShi ? ' → đắc thế' : ' → thất thế'}`,
    rootScore, resourceScore: res, peerScore: peer,
  };
}
