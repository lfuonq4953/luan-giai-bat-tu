// Chuẩn hoá tên can chi tiếng Việt (có dấu, viết hoa/thường, Tị/Tỵ, Mão/Mẹo…)
import { STEMS, BRANCHES } from './battu/constants';

export const STEM_ALIASES: Record<string, number> = { 'giáp': 0, 'ất': 1, 'bính': 2, 'đinh': 3, 'mậu': 4, 'kỷ': 5, 'kỉ': 5, 'canh': 6, 'tân': 7, 'nhâm': 8, 'quý': 9, 'quí': 9 };
export const BRANCH_ALIASES: Record<string, number> = {
  'tý': 0, 'tí': 0, 'sửu': 1, 'dần': 2, 'mão': 3, 'mẹo': 3, 'thìn': 4, 'tị': 5, 'tỵ': 5, 'ngọ': 6, 'mùi': 7, 'thân': 8, 'dậu': 9, 'tuất': 10, 'hợi': 11,
};

export function parseGanZhi(text: unknown): { stem: number; branch: number } | null {
  if (typeof text !== 'string') return null;
  const words = text.normalize('NFC').toLowerCase().replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  let stem = -1, branch = -1;
  for (const w of words) {
    if (stem < 0 && STEM_ALIASES[w] !== undefined) { stem = STEM_ALIASES[w]; continue; }
    if (stem >= 0 && branch < 0 && BRANCH_ALIASES[w] !== undefined) { branch = BRANCH_ALIASES[w]; break; }
  }
  if (stem < 0 || branch < 0 || stem % 2 !== branch % 2) return null;
  return { stem, branch };
}
export const ganZhiText = (p: { stem: number; branch: number } | null) => (p ? `${STEMS[p.stem]} ${BRANCHES[p.branch]}` : '');
