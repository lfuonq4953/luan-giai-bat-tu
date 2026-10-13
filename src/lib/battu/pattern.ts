// Cách cục: Bát cách (Chính/Thiên Quan, Tài, Ấn, Thực, Thương, Sát) + Kiến Lộc / Dương Nhận
// và Ngoại cách (Chuyên vượng 5 cách, Tòng cách, Hoá khí cách).
// Quy tắc lấy cách & thành – bại – thái quá – bất cập theo Thiên Lý Mệnh Cảo (chương Cách cục, Ngoại cách)
// và Tử Bình Chân Thuyên (luận dụng thần thành bại cứu ứng).
import {
  STEMS, BRANCHES, HIDDEN_STEMS, STEM_ELEMENT, BRANCH_ELEMENT, Element, TenGod, GodGroup, tenGod, godGroupOf,
  groupElement, LU_BRANCH, YANGREN_BRANCH, controlledBy, seasonalState, stemYang, ELEMENTS,
} from './constants';
import { StrengthResult } from './strength';
import { stemCombo, isClash, isPunish, DIRECTIONAL, TRINES } from './relations';

export interface SpecialPattern {
  type: 'Chuyên vượng' | 'Tòng cường' | 'Tòng nhược' | 'Hoá khí';
  name: string;
  element: Element;          // hành chủ đạo của cách
  follow?: GodGroup;         // nhóm thập thần được tòng
}

export interface PatternResult {
  name: string;
  god: TenGod | 'Kiến Lộc' | 'Dương Nhận' | null;
  group: GodGroup | null;
  stem: number | null;        // can lấy làm cách
  basis: string;              // cách lấy
  special: SpecialPattern | null;
  success: string[];
  failure: string[];
  rescue: string[];
  excess: string[];
  deficiency: string[];
  verdict: 'Thành cách' | 'Thành cách có bệnh' | 'Phá cách có cứu' | 'Phá cách' | 'Ngoại cách';
  grade: 'Thượng' | 'Trung thượng' | 'Trung' | 'Trung hạ' | 'Hạ';
  purity: string; // thanh / trọc
}

// Khi bản khí chi tháng là Tỷ/Kiếp (không phải Lộc/Nhận) và không có can nào thấu: cách mặc định theo tài liệu
const DEFAULT_PICK: Record<string, number> = {
  '1-2': 4,   // Ất tháng Dần → Chính Tài (Mậu)
  '3-5': 6,   // Đinh tháng Tị → Chính Tài (Canh)
  '2-6': 5,   // Bính tháng Ngọ → Thương Quan (Kỷ)
  '5-4': 1, '5-7': 1, '5-10': 3, '5-1': 7,   // Kỷ: Thìn→Sát(Ất), Mùi→Sát(Ất), Tuất→Kiêu(Đinh), Sửu→Thực(Tân)
  '4-4': 1, '4-10': 7, '4-1': 9, '4-7': 3,   // Mậu: Thìn→Quan(Ất), Tuất→Thương(Tân), Sửu→Tài(Quý), Mùi→Ấn(Đinh)
  '7-8': 8,   // Tân tháng Thân → Thương Quan (Nhâm)
  '9-11': 0,  // Quý tháng Hợi → Thương Quan (Giáp)
};

export interface PatternContext {
  stems: number[]; branches: number[];
  strength: StrengthResult;
}

function groupShare(ctx: PatternContext): Record<GodGroup, number> {
  const dEl = ctx.strength.dayElement;
  const s = ctx.strength.scores;
  const tot = ELEMENTS.reduce((a, e) => a + s[e], 0);
  const out = {} as Record<GodGroup, number>;
  (['Tỷ Kiếp', 'Thực Thương', 'Tài', 'Quan Sát', 'Ấn'] as GodGroup[]).forEach((g) => { out[g] = s[groupElement(dEl, g)] / tot; });
  return out;
}

function transparentGods(ctx: PatternContext): TenGod[] {
  const dm = ctx.stems[2];
  return ctx.stems.filter((_, i) => i !== 2).map((s) => tenGod(dm, s));
}

export function detectSpecial(ctx: PatternContext): SpecialPattern | null {
  const { stems, branches, strength } = ctx;
  const dm = stems[2];
  const dEl = STEM_ELEMENT[dm];
  const mb = branches[1];
  const share = groupShare(ctx);

  // 1) Hoá khí cách: nhật can hợp can tháng hoặc can giờ
  const HUA_MONTHS: Record<Element, number[]> = { 'Thổ': [4, 10, 1, 7], 'Kim': [5, 9, 1, 8], 'Thủy': [11, 8, 0, 4], 'Mộc': [11, 3, 7, 2], 'Hỏa': [2, 6, 10, 5] };
  for (const idx of [1, 3]) {
    if (idx >= stems.length) continue;
    const hEl = stemCombo(dm, stems[idx]);
    if (!hEl) continue;
    // tranh hợp: có can khác giống can đối tác hoặc giống nhật can cùng tranh
    const partner = stems[idx];
    const rivals = stems.filter((s, i) => i !== idx && i !== 2 && (s === partner || s === dm)).length;
    const killer = controlledBy(hEl);
    const killerStem = stems.some((s, i) => i !== 2 && i !== idx && STEM_ELEMENT[s] === killer);
    const killerMain = branches.some((b) => STEM_ELEMENT[HIDDEN_STEMS[b][0][0]] === killer);
    const hShare = strength.scores[hEl] / ELEMENTS.reduce((a, e) => a + strength.scores[e], 0);
    if (HUA_MONTHS[hEl].includes(mb) && !killerStem && !killerMain && rivals === 0 && strength.rootScore < 0.5 && hShare >= 0.32) {
      return { type: 'Hoá khí', name: `Hoá ${hEl} cách (${STEMS[dm]} ${STEMS[partner]} hợp hoá)`, element: hEl };
    }
  }

  // 2) Chuyên vượng (Khúc Trực, Viêm Thượng, Giá Sắc, Tòng Cách, Nhuận Hạ)
  const names: Record<Element, string> = { 'Mộc': 'Khúc Trực (Nhân Thọ) cách', 'Hỏa': 'Viêm Thượng cách', 'Thổ': 'Giá Sắc cách', 'Kim': 'Tòng Cách cách', 'Thủy': 'Nhuận Hạ cách' };
  const killer = controlledBy(dEl);
  const boundStem = (i: number) => stems.some((s, j) => j !== i && Math.abs(j - i) === 1 && stemCombo(stems[i], s));
  const killerStems = stems.filter((s, i) => i !== 2 && STEM_ELEMENT[s] === killer && !boundStem(i)).length;
  const killerBranches = branches.filter((b) => BRANCH_ELEMENT[b] === killer && ![1, 4, 7, 10].includes(b)).length;
  const inSeason = seasonalState(dEl, mb) === 'Vượng';
  if (inSeason && killerStems === 0 && killerBranches === 0) {
    let formed = false;
    if (dEl === 'Thổ') {
      const earth = branches.filter((b) => [1, 4, 7, 10].includes(b)).length;
      formed = earth >= Math.min(4, branches.length) || (earth >= 3 && share['Tỷ Kiếp'] + share['Ấn'] > 0.7);
    } else {
      formed = [...DIRECTIONAL, ...TRINES].some(([set, el]) => el === dEl && set.every((b) => branches.includes(b)));
    }
    if (formed && strength.ratio >= 0.7) return { type: 'Chuyên vượng', name: names[dEl], element: dEl };
  }

  // 3) Tòng cường / Tòng vượng
  if (strength.ratio >= 0.86 && share['Quan Sát'] < 0.05) {
    const isVuong = strength.peerScore >= strength.resourceScore;
    return { type: 'Tòng cường', name: isVuong ? 'Tòng Vượng cách' : 'Tòng Cường cách', element: isVuong ? dEl : groupElement(dEl, 'Ấn'), follow: isVuong ? 'Tỷ Kiếp' : 'Ấn' };
  }

  // 4) Tòng nhược (tòng Tài / Sát / Nhi / Thế)
  const limit = stemYang(dm) ? 0.1 : 0.12; // "ngũ dương tòng khí bất tòng thế" – can dương khó tòng hơn
  const bound = (i: number) => stems.some((x, j) => j !== i && j !== 2 && Math.abs(j - i) === 1 && stemCombo(stems[i], x));
  const resStems = stems.filter((s, i) => i !== 2 && STEM_ELEMENT[s] === groupElement(dEl, 'Ấn') && !bound(i)).length;
  if (strength.ratio < limit && strength.rootScore < 0.35 && resStems === 0) {
    const cands: GodGroup[] = ['Tài', 'Quan Sát', 'Thực Thương'];
    const opp = cands.reduce((a, g) => a + share[g], 0);
    const top = cands.slice().sort((a, b) => share[b] - share[a])[0];
    if (share[top] / opp >= 0.5) {
      const nm = top === 'Tài' ? 'Tòng Tài cách' : top === 'Quan Sát' ? 'Tòng Sát cách' : 'Tòng Nhi cách';
      return { type: 'Tòng nhược', name: nm, element: groupElement(dEl, top), follow: top };
    }
    return { type: 'Tòng nhược', name: 'Tòng Thế cách (tòng theo thế mạnh Tài – Quan – Thực Thương)', element: groupElement(dEl, top), follow: top };
  }
  return null;
}

export function determinePattern(ctx: PatternContext): PatternResult {
  const { stems, branches, strength } = ctx;
  const dm = stems[2];
  const mb = branches[1];
  const share = groupShare(ctx);
  const tGods = transparentGods(ctx);
  const has = (g: TenGod) => tGods.includes(g);
  const hasGroup = (g: GodGroup) => tGods.some((x) => godGroupOf(x) === g);
  const present = (g: GodGroup) => hasGroup(g) || share[g] >= 0.12;
  const strong = strength.strong;
  const weak = strength.levelIndex <= 3;
  const monthHurt = branches.some((b, i) => i !== 1 && (isClash(b, mb) || (isPunish(b, mb) && isPunish(b, mb) !== 'Tự hình')));

  const special = detectSpecial(ctx);
  const res: PatternResult = {
    name: '', god: null, group: null, stem: null, basis: '', special,
    success: [], failure: [], rescue: [], excess: [], deficiency: [], verdict: 'Thành cách', grade: 'Trung', purity: '',
  };

  // --- Bát cách / Lộc / Nhận
  const hidden = HIDDEN_STEMS[mb].map(([s, w]) => ({ s, w, g: tenGod(dm, s) }));
  const main = hidden[0];
  let pick: { s: number; g: TenGod } | null = null;
  if (LU_BRANCH[dm] === mb) {
    res.god = 'Kiến Lộc'; res.name = dm === 5 ? 'Kiến Lộc (Nguyệt Kiếp) cách' : 'Kiến Lộc cách';
    res.basis = `Chi tháng ${BRANCHES[mb]} là Lộc của ${STEMS[dm]} – không vào Bát cách, xét theo Kiến Lộc.`;
  } else if ([0, 6, 8].includes(dm) && YANGREN_BRANCH[dm] === mb) {
    res.god = 'Dương Nhận'; res.name = 'Dương Nhận cách';
    res.basis = `Chi tháng ${BRANCHES[mb]} là Dương Nhận (Kiếp Nhận) của ${STEMS[dm]}.`;
  } else {
    const cands = hidden.filter((h) => !['Tỷ Kiên', 'Kiếp Tài'].includes(h.g));
    const others = stems.filter((_, i) => i !== 2);
    const thau = cands.filter((h) => others.includes(h.s));
    if (thau.length) {
      // ưu tiên bản khí; nếu không, can có lực & không bị hợp
      const sorted = thau.slice().sort((a, b) => {
        if (a.s === main.s) return -1; if (b.s === main.s) return 1;
        const boundA = stems.some((x, i) => i !== 2 && stemCombo(a.s, x)) ? 1 : 0;
        const boundB = stems.some((x, i) => i !== 2 && stemCombo(b.s, x)) ? 1 : 0;
        return boundA - boundB || b.w - a.w;
      });
      pick = { s: sorted[0].s, g: sorted[0].g };
      res.basis = `${sorted[0].s === main.s ? 'Bản khí' : 'Nhân nguyên'} ${STEMS[pick.s]} trong chi tháng ${BRANCHES[mb]} thấu lên can → lấy ${pick.g} làm cách.`;
    } else {
      const key = `${dm}-${mb}`;
      if (DEFAULT_PICK[key] !== undefined) {
        const s = DEFAULT_PICK[key];
        pick = { s, g: tenGod(dm, s) };
        res.basis = `Bản khí chi tháng là Tỷ/Kiếp, không can nào thấu → theo lệ lấy ${STEMS[s]} (${pick.g}) trong ${BRANCHES[mb]} làm cách.`;
      } else {
        pick = { s: main.s, g: main.g };
        res.basis = `Không can nào thấu → lấy bản khí ${STEMS[main.s]} của chi tháng ${BRANCHES[mb]} (${main.g}) làm cách.`;
      }
    }
    res.stem = pick.s; res.god = pick.g; res.group = godGroupOf(pick.g);
    const nm: Record<TenGod, string> = {
      'Chính Quan': 'Chính Quan cách', 'Thất Sát': 'Thất Sát cách', 'Chính Tài': 'Chính Tài cách', 'Thiên Tài': 'Thiên Tài cách',
      'Chính Ấn': 'Chính Ấn cách', 'Thiên Ấn': 'Thiên Ấn cách', 'Thực Thần': 'Thực Thần cách', 'Thương Quan': 'Thương Quan cách',
      'Tỷ Kiên': 'Kiến Lộc cách', 'Kiếp Tài': 'Nguyệt Kiếp cách',
    };
    res.name = nm[pick.g];
  }

  // --- Thành / bại / thái quá / bất cập
  const S = res.success, F = res.failure, R = res.rescue, X = res.excess, D = res.deficiency;
  const g = res.god;
  if (g === 'Chính Quan') {
    if (strong && present('Tài')) S.push('Nhật chủ cường, có Tài sinh Quan.');
    if (weak && share['Quan Sát'] >= 0.2 && present('Ấn')) S.push('Thân nhược Quan cường, có Ấn hoá Quan sinh thân.');
    if (!has('Thất Sát')) S.push('Chính Quan không bị Thất Sát hỗn tạp (thanh).');
    if (has('Thương Quan')) { if (present('Ấn')) R.push('Gặp Thương Quan nhưng có Ấn chế Thương hộ Quan.'); else F.push('Gặp Thương Quan mà không có Ấn (Thương quan kiến Quan).'); }
    if (has('Thất Sát')) F.push('Quan Sát hỗn tạp.');
    if (monthHurt) F.push('Nguyệt lệnh (cung Quan) bị hình xung.');
    if (share['Quan Sát'] >= 0.3 && weak) X.push('Quan tinh đắc lệnh lại nhiều, nhật chủ suy không gánh nổi.');
    if (weak && share['Quan Sát'] >= 0.22 && share['Tài'] >= 0.2) X.push('Quan cường thân nhược, lại nhiều Tài sinh Quan.');
    if (strong && share['Quan Sát'] < 0.15 && !present('Tài')) D.push('Thân cường hơn Quan, không có Tài sinh Quan.');
    if (strong && (share['Ấn'] >= 0.25 || share['Thực Thương'] >= 0.25)) D.push('Thân cường, Ấn nhiều tiết Quan hoặc Thực Thương khắc Quan.');
  } else if (g === 'Chính Tài' || g === 'Thiên Tài') {
    if (strong && share['Tài'] >= 0.2 && present('Quan Sát')) S.push('Thân cường Tài cường, lại gặp Quan tinh (Tài vượng sinh Quan).');
    if (weak && share['Tài'] >= 0.25 && (present('Ấn') || present('Tỷ Kiếp'))) S.push('Thân nhược Tài cường, có Ấn Tỷ hộ thân.');
    if (strong && share['Tài'] < 0.2 && present('Thực Thương')) S.push('Thân cường Tài nhẹ, có Thực Thương sinh Tài.');
    if (strong && share['Tài'] < 0.15 && share['Tỷ Kiếp'] >= 0.25) { if (present('Quan Sát') || present('Thực Thương')) R.push('Tỷ Kiếp nặng nhưng có Quan Sát chế Kiếp hoặc Thực Thương hoá Kiếp sinh Tài.'); else F.push('Thân cường Tài khinh, Tỷ Kiếp lại nặng (quần kiếp tranh tài).'); }
    if (weak && share['Quan Sát'] >= 0.25 && share['Tài'] >= 0.2) F.push('Thân nhược Sát nặng, Tài lại sinh Sát.');
    if (monthHurt) F.push('Nguyệt lệnh (Tài) bị hình xung.');
    if (weak && share['Tài'] >= 0.35) X.push('Tài đắc lệnh lại nhiều, nhật chủ không gánh nổi (tài đa thân nhược).');
    if (weak && share['Tài'] >= 0.25 && share['Thực Thương'] >= 0.2) X.push('Tài vượng thân nhược lại nhiều Thực Thương tiết thân sinh Tài.');
    if (strong && share['Tỷ Kiếp'] >= 0.3) D.push('Thân cường lại gặp nhiều Tỷ Kiếp Lộc Nhận.');
    if (!present('Thực Thương') && (share['Tỷ Kiếp'] + share['Ấn']) >= 0.45) D.push('Tài không có Thực Thương sinh mà Kiếp Ấn lại nhiều.');
  } else if (g === 'Chính Ấn' || g === 'Thiên Ấn') {
    if (strong && share['Ấn'] < 0.25 && present('Quan Sát')) S.push('Thân cường Ấn nhẹ, gặp Quan Sát sinh Ấn.');
    if (strong && share['Ấn'] >= 0.25 && present('Thực Thương')) S.push('Thân cường Ấn cường, có Thực Thương tiết tú.');
    if (strong && share['Ấn'] >= 0.3 && has('Chính Tài') || (strong && share['Ấn'] >= 0.3 && has('Thiên Tài'))) S.push('Ấn nhiều, Tài thấu ra tổn bớt Ấn (Tài phá Ấn đúng chỗ).');
    if (weak && share['Ấn'] < 0.2 && share['Tài'] >= 0.2) { if (present('Tỷ Kiếp')) R.push('Tài phá Ấn nhưng có Tỷ Kiếp chế Tài cứu Ấn.'); else F.push('Thân nhược Ấn nhẹ lại gặp Tài phá Ấn.'); }
    if (weak && share['Ấn'] >= 0.35 && share['Quan Sát'] >= 0.25) F.push('Thân nhược, Ấn quá nặng mà Quan Sát lại nhiều.');
    if (monthHurt) F.push('Nguyệt lệnh (Ấn) bị hình xung.');
    if (share['Ấn'] >= 0.4 && share['Tài'] < 0.1) X.push('Ấn trọng đắc lệnh, Tài nhẹ không chế được (mẫu từ diệt tử).');
    if (share['Ấn'] + share['Tỷ Kiếp'] >= 0.7) X.push('Ấn và Tỷ Kiếp đều cường, Thực Thương Tài Quan nhẹ mà ít.');
    if (share['Tài'] >= 0.3 && !present('Quan Sát')) D.push('Tài nặng mà không có Quan tinh thông quan.');
    if (share['Tỷ Kiếp'] >= 0.3) D.push('Nhiều Tỷ Kiếp Lộc Nhận.');
  } else if (g === 'Thực Thần') {
    if (strong && share['Thực Thương'] >= 0.18 && present('Tài')) S.push('Thân cường Thực cường, gặp Tài (Thực thần sinh Tài).');
    if (strong && has('Thất Sát') && !hasGroup('Tài')) S.push('Thân cường, Sát nổi, Thực thần chế Sát mà không gặp Tài (Thực chế Sát).');
    if (strong && share['Thực Thương'] >= 0.3 && present('Ấn')) S.push('Thân cường, Thực tiết khí thái quá, có Ấn hộ thân.');
    if (has('Thiên Ấn')) { if (present('Tài')) R.push('Gặp Kiêu thần nhưng có Tài chế Kiêu hộ Thực.'); else F.push('Kiêu thần đoạt Thực (Thực gặp Thiên Ấn).'); }
    if (weak && present('Tài') && has('Thất Sát')) F.push('Thân nhược, Thực sinh Tài mà Sát lại lộ.');
    if (monthHurt) F.push('Nguyệt lệnh (Thực thần) bị hình xung.');
    if (share['Thực Thương'] >= 0.35 && weak && !present('Ấn')) X.push('Thực Thương quá nặng, nhật chủ quá nhẹ mà không có Ấn.');
    if (share['Ấn'] >= 0.3 && weak) D.push('Ấn trọng thân khinh, Thực bị chế.');
    if (weak && share['Tài'] + share['Quan Sát'] >= 0.45) D.push('Thân nhược mà Tài Quan quá nhiều.');
  } else if (g === 'Thất Sát') {
    if (strong) S.push('Thân cường đủ sức gánh Sát.');
    if (strong && present('Thực Thương')) S.push('Thân cường Sát nổi, có Thực Thương chế Sát.');
    if (weak && present('Ấn')) S.push('Thân nhược Sát vượng, có Ấn hoá Sát sinh thân (Sát Ấn tương sinh).');
    if (Math.abs(strength.ratio - 0.5) < 0.08 && !has('Chính Quan')) S.push('Thân Sát lưỡng đình, không Quan Sát hỗn tạp.');
    if (monthHurt) F.push('Nguyệt lệnh (Sát) bị hình xung.');
    if (weak) { if (present('Ấn') || present('Thực Thương')) R.push('Thân nhược nhưng có Ấn hoá Sát hoặc Thực Thương chế Sát.'); else F.push('Nhật can nhược, Sát không chế không hoá (Sát công thân).'); }
    if (present('Tài') && !present('Thực Thương') && !present('Ấn')) F.push('Tài sinh Sát mà không có chế.');
    if (weak && share['Quan Sát'] >= 0.35 && !present('Thực Thương')) X.push('Sát thái trọng, thân thái khinh, không gặp Thực Thương.');
    if (weak && share['Tài'] >= 0.25) X.push('Tài đa thân nhược, Sát lại được Tài sinh.');
    if (share['Thực Thương'] >= 0.3 && !present('Tài')) D.push('Thực nặng chế Sát quá mức mà không có Tài.');
    if (strong && share['Ấn'] >= 0.3) D.push('Thân cường Ấn cường, Sát bị tiết hết.');
  } else if (g === 'Thương Quan') {
    if (strong && present('Tài')) S.push('Thân cường, Thương Quan sinh Tài.');
    if (weak && present('Ấn')) S.push('Thân nhược Thương Quan tiết khí, có Ấn hộ thân (Thương quan bội Ấn).');
    if (weak && has('Thất Sát') && hasGroup('Ấn')) S.push('Thân nhược, Thương vượng mà Sát Ấn song thấu.');
    if (strong && share['Quan Sát'] >= 0.25) S.push('Thân cường Sát trọng, Thương Quan giá Sát.');
    if (has('Chính Quan')) { if (present('Ấn') || present('Tài')) R.push('Thương gặp Quan nhưng có Ấn chế Thương hoặc Tài thông quan.'); else F.push('Thương Quan kiến Quan, vi hoạ bách đoan.'); }
    if (weak && share['Tài'] >= 0.3) F.push('Thân nhược lại nhiều Tài.');
    if (strong && share['Thực Thương'] < 0.15 && share['Ấn'] >= 0.3) F.push('Thân cường, Thương Quan nhẹ mà nhiều Ấn.');
    if (monthHurt) F.push('Nguyệt lệnh (Thương Quan) bị hình xung.');
  } else if (g === 'Kiến Lộc' || g === 'Tỷ Kiên') {
    if (present('Tài') && present('Quan Sát')) S.push('Lộc cách có Tài Quan – Tài sinh Quan, quý.');
    else if (present('Quan Sát')) S.push('Lộc cách dụng Quan Sát chế Tỷ Kiếp.');
    else if (present('Thực Thương') && present('Tài')) S.push('Lộc cách dụng Thực Thương sinh Tài.');
    else if (present('Tài')) S.push('Lộc cách gặp Tài tinh – có chỗ dụng (Tài cần Thực Thương sinh mới bền).');
    else if (present('Thực Thương')) S.push('Lộc cách có Thực Thương tiết tú.');
    if (!present('Tài') && !present('Quan Sát') && !present('Thực Thương')) F.push('Lộc cách không có Tài Quan Thực Thương để dụng.');
    if (share['Tỷ Kiếp'] >= 0.35 && !present('Quan Sát')) D.push('Tỷ Kiếp trùng trùng, không Quan Sát chế.');
    if (monthHurt) F.push('Lộc bị xung (lộc xung) – dễ bôn ba, tổn tài.');
  } else if (g === 'Dương Nhận' || g === 'Kiếp Tài') {
    if (present('Quan Sát')) S.push('Dương Nhận có Quan Sát chế phục – Nhận Sát tương tế, chủ uy quyền.');
    else if (present('Thực Thương')) S.push('Không Quan Sát, dùng Thực Thương tiết Nhận sinh Tài.');
    if (!present('Quan Sát') && !present('Thực Thương')) F.push('Dương Nhận không có Quan Sát chế, cũng không Thực Thương tiết.');
    if (has('Thất Sát') && share['Thực Thương'] >= 0.25) F.push('Sát chế Nhận lại bị Thực Thương khắc mất.');
    if (monthHurt) F.push('Nhận bị xung (Nhận xung) – dễ có biến cố, huyết quang.');
  }

  if (special) {
    S.length = 0; F.length = 0; R.length = 0; X.length = 0; D.length = 0;
    const sp = special;
    if (sp.type === 'Chuyên vượng') {
      S.push(`Nhật chủ đương lệnh, địa chi hội thành cục ${sp.element}, không có hành khắc phá – khí thế chuyên nhất.`);
      D.push(`Kỵ nhất vận gặp ${controlledBy(sp.element)} (phá cách); hỷ ${sp.element}, Ấn và Thực Thương tiết tú.`);
    } else if (sp.type === 'Tòng cường') {
      S.push('Toàn cục Tỷ Kiếp – Ấn chiếm tuyệt đại đa số, không có Quan Sát chế – thuận theo vượng thế.');
      D.push('Kỵ vận Quan Sát nghịch thế vượng; Tài vận gặp Tỷ Kiếp tranh đoạt cũng bất lợi.');
    } else if (sp.type === 'Tòng nhược') {
      S.push(`Nhật chủ vô căn, không Ấn sinh, thế ${sp.follow} áp đảo – bỏ mình theo thế mạnh (tòng).`);
      D.push('Kỵ nhất vận Ấn, Tỷ Kiếp giúp thân (thân có gốc thì tòng mà không tòng – giả tòng, phá cách).');
    } else {
      S.push(`Nhật can hợp hoá thành ${sp.element}, nguyệt lệnh trợ hoá thần, không có hành khắc hoá thần.`);
      D.push(`Kỵ vận khắc hoá thần (${controlledBy(sp.element)}) hoặc vận trả nhật chủ về bản hành.`);
    }
    res.verdict = 'Ngoại cách';
    res.basis = `${res.basis} Tuy nhiên toàn cục khí thế nghiêng hẳn về một phía → luận theo ngoại cách: ${special.name}.`;
  } else if (F.length === 0) res.verdict = X.length || D.length ? 'Thành cách có bệnh' : 'Thành cách';
  else res.verdict = R.length ? 'Phá cách có cứu' : 'Phá cách';

  // Thanh – trọc: số nhóm thập thần lộ can, có hỗn tạp?
  const mixed = (has('Chính Quan') && has('Thất Sát')) || (has('Thương Quan') && has('Chính Quan')) || (has('Thực Thần') && has('Thiên Ấn'));
  const clashes = branches.filter((b, i) => branches.some((c, j) => j > i && isClash(b, c))).length;
  res.purity = mixed ? 'Trọc – có thần hỗn tạp/khắc chiến' : clashes >= 2 ? 'Hơi trọc – địa chi xung chiến nhiều' : 'Thanh – các thần ít tranh chiến';

  const scoreG = (res.verdict === 'Thành cách' ? 2 : res.verdict === 'Thành cách có bệnh' ? 1 : res.verdict === 'Phá cách có cứu' ? 0 : res.verdict === 'Ngoại cách' ? 2 : -1)
    + (mixed ? -1 : 0) + (clashes >= 2 ? -0.5 : 0) + (S.length >= 2 ? 0.5 : 0);
  res.grade = scoreG >= 2.5 ? 'Thượng' : scoreG >= 1.5 ? 'Trung thượng' : scoreG >= 0.5 ? 'Trung' : scoreG >= -0.5 ? 'Trung hạ' : 'Hạ';
  return res;
}
