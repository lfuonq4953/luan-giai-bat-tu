// Quan hệ hợp – xung – hình – hại – phá giữa các can chi
import { STEMS, BRANCHES, Element } from './constants';

export interface Relation {
  type: 'Can hợp' | 'Can xung' | 'Lục hợp' | 'Tam hợp' | 'Bán hợp' | 'Tam hội' | 'Lục xung' | 'Tam hình' | 'Tự hình' | 'Tương hình' | 'Lục hại' | 'Lục phá';
  positions: number[];   // chỉ số trụ (0 năm, 1 tháng, 2 ngày, 3 giờ, 4+ vận/năm)
  element?: Element;     // hành hoá (nếu có)
  label: string;
  good: boolean;
}

export const STEM_COMBOS: [number, number, Element][] = [[0, 5, 'Thổ'], [1, 6, 'Kim'], [2, 7, 'Thủy'], [3, 8, 'Mộc'], [4, 9, 'Hỏa']];
export const STEM_CLASHES: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9]];
export const SIX_COMBOS: [number, number, Element][] = [[0, 1, 'Thổ'], [2, 11, 'Mộc'], [3, 10, 'Hỏa'], [4, 9, 'Kim'], [5, 8, 'Thủy'], [6, 7, 'Thổ']];
export const TRINES: [number[], Element][] = [[[8, 0, 4], 'Thủy'], [[11, 3, 7], 'Mộc'], [[2, 6, 10], 'Hỏa'], [[5, 9, 1], 'Kim']];
export const DIRECTIONAL: [number[], Element][] = [[[2, 3, 4], 'Mộc'], [[5, 6, 7], 'Hỏa'], [[8, 9, 10], 'Kim'], [[11, 0, 1], 'Thủy']];
export const SIX_CLASH: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
export const SIX_HARM: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
export const SIX_BREAK: [number, number][] = [[0, 9], [6, 3], [8, 5], [2, 11], [4, 1], [10, 7]];
export const SELF_PUNISH = [4, 6, 9, 11];

const pairIn = (list: [number, number][] | [number, number, Element][], a: number, b: number) =>
  list.find((x) => (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a));

export function stemCombo(a: number, b: number): Element | null {
  const f = pairIn(STEM_COMBOS, a, b) as [number, number, Element] | undefined;
  return f ? f[2] : null;
}
export function isStemClash(a: number, b: number) { return !!pairIn(STEM_CLASHES, a, b); }
export function sixCombo(a: number, b: number): Element | null {
  const f = pairIn(SIX_COMBOS, a, b) as [number, number, Element] | undefined;
  return f ? f[2] : null;
}
export function isClash(a: number, b: number) { return !!pairIn(SIX_CLASH, a, b); }
export function isHarm(a: number, b: number) { return !!pairIn(SIX_HARM, a, b); }
export function isBreak(a: number, b: number) { return !!pairIn(SIX_BREAK, a, b); }
export function isPunish(a: number, b: number): string | null {
  const g1 = [2, 5, 8], g2 = [1, 10, 7];
  if (a === b && SELF_PUNISH.includes(a)) return 'Tự hình';
  if (a !== b && g1.includes(a) && g1.includes(b)) return 'Dần Tị Thân (vô ân chi hình)';
  if (a !== b && g2.includes(a) && g2.includes(b)) return 'Sửu Tuất Mùi (trì thế chi hình)';
  if ((a === 0 && b === 3) || (a === 3 && b === 0)) return 'Tý Mão (vô lễ chi hình)';
  return null;
}

/** Phân tích toàn bộ quan hệ giữa danh sách can và chi (theo vị trí) */
export function analyzeRelations(stems: number[], branches: number[], names: string[]): Relation[] {
  const out: Relation[] = [];
  const n = stems.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const e = stemCombo(stems[i], stems[j]);
    if (e) out.push({ type: 'Can hợp', positions: [i, j], element: e, good: true, label: `${STEMS[stems[i]]} (${names[i]}) – ${STEMS[stems[j]]} (${names[j]}) hợp hoá ${e}` });
    if (isStemClash(stems[i], stems[j])) out.push({ type: 'Can xung', positions: [i, j], good: false, label: `${STEMS[stems[i]]} (${names[i]}) – ${STEMS[stems[j]]} (${names[j]}) tương xung` });
  }
  const bn = branches.length;
  // Tam hội / Tam hợp
  for (const [set, el] of DIRECTIONAL) {
    const pos = set.map((b) => branches.indexOf(b));
    if (pos.every((p) => p >= 0)) out.push({ type: 'Tam hội', positions: pos, element: el, good: true, label: `${set.map((b) => BRANCHES[b]).join(' ')} tam hội ${el} cục` });
  }
  for (const [set, el] of TRINES) {
    const pos = set.map((b) => branches.indexOf(b));
    if (pos.every((p) => p >= 0)) out.push({ type: 'Tam hợp', positions: pos, element: el, good: true, label: `${set.map((b) => BRANCHES[b]).join(' ')} tam hợp ${el} cục` });
    else {
      // bán hợp: phải có chi Vượng (giữa)
      const [a, mid, c] = set;
      const pm = branches.indexOf(mid);
      if (pm >= 0) {
        const pa = branches.indexOf(a), pc = branches.indexOf(c);
        if (pa >= 0) out.push({ type: 'Bán hợp', positions: [pa, pm], element: el, good: true, label: `${BRANCHES[a]} ${BRANCHES[mid]} bán hợp ${el}` });
        if (pc >= 0) out.push({ type: 'Bán hợp', positions: [pm, pc], element: el, good: true, label: `${BRANCHES[mid]} ${BRANCHES[c]} bán hợp ${el}` });
      }
    }
  }
  for (let i = 0; i < bn; i++) for (let j = i + 1; j < bn; j++) {
    const a = branches[i], b = branches[j];
    const lh = sixCombo(a, b);
    if (lh) out.push({ type: 'Lục hợp', positions: [i, j], element: lh, good: true, label: `${BRANCHES[a]} (${names[i]}) – ${BRANCHES[b]} (${names[j]}) lục hợp ${lh}` });
    if (isClash(a, b)) out.push({ type: 'Lục xung', positions: [i, j], good: false, label: `${BRANCHES[a]} (${names[i]}) – ${BRANCHES[b]} (${names[j]}) lục xung` });
    const pu = isPunish(a, b);
    if (pu) out.push({ type: pu === 'Tự hình' ? 'Tự hình' : 'Tương hình', positions: [i, j], good: false, label: `${BRANCHES[a]} (${names[i]}) – ${BRANCHES[b]} (${names[j]}) ${pu === 'Tự hình' ? 'tự hình' : 'tương hình – ' + pu}` });
    if (isHarm(a, b)) out.push({ type: 'Lục hại', positions: [i, j], good: false, label: `${BRANCHES[a]} (${names[i]}) – ${BRANCHES[b]} (${names[j]}) tương hại` });
    if (isBreak(a, b)) out.push({ type: 'Lục phá', positions: [i, j], good: false, label: `${BRANCHES[a]} (${names[i]}) – ${BRANCHES[b]} (${names[j]}) tương phá` });
  }
  // Gộp tự hình cùng một chi thành một dòng
  const selfP = out.filter((r) => r.type === 'Tự hình');
  const merged: Relation[] = [];
  for (const b of SELF_PUNISH) {
    const pos = branches.map((x, i) => (x === b ? i : -1)).filter((i) => i >= 0);
    if (pos.length >= 2) merged.push({ type: 'Tự hình', positions: pos, good: false, label: `${pos.map((i) => `${BRANCHES[b]} (${names[i]})`).join(' – ')} tự hình` });
  }
  if (selfP.length) { for (const r of selfP) out.splice(out.indexOf(r), 1); out.push(...merged); }
  // Tam hình đủ bộ
  const full1 = [2, 5, 8].every((b) => branches.includes(b));
  const full2 = [1, 10, 7].every((b) => branches.includes(b));
  if (full1) out.push({ type: 'Tam hình', positions: [2, 5, 8].map((b) => branches.indexOf(b)), good: false, label: 'Dần Tị Thân đủ bộ tam hình (vô ân)' });
  if (full2) out.push({ type: 'Tam hình', positions: [1, 10, 7].map((b) => branches.indexOf(b)), good: false, label: 'Sửu Tuất Mùi đủ bộ tam hình (trì thế)' });
  return out;
}
