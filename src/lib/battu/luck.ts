// Chấm Đại vận – Lưu niên theo Dụng thần (Thiên Lý Mệnh Cảo – chương Vận hạn, Lưu niên)
// "Can chi lưu niên có lợi cho Dụng thần là Thiện, không lợi là Ác"; vận và năm cùng thiện thì càng tốt…
import { Element, STEMS, BRANCHES, STEM_ELEMENT, HIDDEN_STEMS, tenGod, godGroupOf, GodGroup, TenGod } from './constants';
import { isClash, isHarm, isPunish, stemCombo, isStemClash, sixCombo, TRINES, DIRECTIONAL } from './relations';

export type Rating = 'Rất tốt' | 'Tốt' | 'Bình hoà' | 'Kém' | 'Xấu';
export interface PeriodEval {
  stem: number; branch: number;
  stemGod: TenGod; branchGod: TenGod;
  stemScore: number; branchScore: number; total: number;
  rating: Rating;
  notes: string[];
  themes: string[];
}

const PALACE_OF = ['gia đình gốc, ông bà, bề trên', 'cha mẹ, anh em, môi trường công việc', 'bản thân & hôn nhân (cung phu thê)', 'con cái, cấp dưới, hậu vận'];
const POS = ['năm', 'tháng', 'ngày', 'giờ'];

export const rate = (t: number): Rating => (t >= 1.1 ? 'Rất tốt' : t >= 0.35 ? 'Tốt' : t > -0.35 ? 'Bình hoà' : t > -1.1 ? 'Kém' : 'Xấu');

const GROUP_THEME: Record<GodGroup, { good: string; bad: string }> = {
  'Tỷ Kiếp': { good: 'được bạn bè, anh em, đối tác hỗ trợ; tự tin, dám làm, có thể hợp tác lập nghiệp', bad: 'cạnh tranh, tranh giành, hao tài vì bạn bè/anh em, dễ nóng nảy, cố chấp' },
  'Thực Thương': { good: 'sáng tạo, thể hiện tài năng, học kỹ năng mới, kinh doanh bằng tay nghề/chất xám; tin vui con cái', bad: 'bốc đồng, nói nhiều hoá hại, va chạm cấp trên, thị phi; nữ mệnh chú ý chuyện chồng con' },
  'Tài': { good: 'tiền bạc hanh thông, buôn bán, đầu tư thuận; nam mệnh thuận duyên vợ/người yêu', bad: 'tài đến tài đi, ham lợi mà mệt, áp lực tiền bạc, ảnh hưởng học hành/sức khoẻ (Tài phá Ấn)' },
  'Quan Sát': { good: 'thăng tiến, được trọng dụng, có danh vị, kỷ luật; nữ mệnh thuận duyên chồng', bad: 'áp lực, tiểu nhân, kiện tụng, bệnh tật, bị quản thúc; dễ căng thẳng' },
  'Ấn': { good: 'học hành, bằng cấp, quý nhân/bề trên giúp, nhà cửa, giấy tờ thuận; tinh thần an ổn', bad: 'ỷ lại, chậm chạp, bảo thủ, cơ hội tài lộc bị cản; dễ ôm đồm lo nghĩ' },
};

export interface LuckCtx {
  dayMaster: number;
  natalStems: number[]; natalBranches: number[];
  elementScore: Record<Element, number>;
}

export function evaluatePeriod(stem: number, branch: number, ctx: LuckCtx, kind: 'van' | 'nam'): PeriodEval {
  const sc = ctx.elementScore;
  const notes: string[] = [];
  const sEl = STEM_ELEMENT[stem];
  const stemScore = sc[sEl];
  let branchScore = 0;
  HIDDEN_STEMS[branch].forEach(([hs, w]) => { branchScore += w * sc[STEM_ELEMENT[hs]]; });
  let adj = 0;
  const dm = ctx.dayMaster;

  // Hợp – xung với nguyên cục
  ctx.natalBranches.forEach((nb, i) => {
    const nbScore = HIDDEN_STEMS[nb].reduce((a, [hs, w]) => a + w * sc[STEM_ELEMENT[hs]], 0);
    if (isClash(branch, nb)) {
      if (nbScore > 0.3) { adj -= 0.35; notes.push(`${BRANCHES[branch]} xung ${BRANCHES[nb]} (chi ${POS[i]} – hỷ dụng) → biến động bất lợi về ${PALACE_OF[i]}.`); }
      else if (nbScore < -0.3) { adj += 0.2; notes.push(`${BRANCHES[branch]} xung khứ ${BRANCHES[nb]} (chi ${POS[i]} – kỵ thần) → có thay đổi nhưng giảm cái xấu ở ${PALACE_OF[i]}.`); }
      else notes.push(`${BRANCHES[branch]} xung ${BRANCHES[nb]} (chi ${POS[i]}) → có xáo động, thay đổi liên quan ${PALACE_OF[i]}.`);
    }
    const lh = sixCombo(branch, nb);
    if (lh) { adj += sc[lh] * 0.15; notes.push(`${BRANCHES[branch]} lục hợp ${BRANCHES[nb]} (chi ${POS[i]}) hoá ${lh} – ${sc[lh] > 0 ? 'hợp thành hỷ thần, có duyên hợp tác/quý nhân' : sc[lh] < 0 ? 'hợp ra kỵ thần, dễ vướng ràng buộc' : 'chủ gắn bó, hợp tác'}.`); }
    const pu = isPunish(branch, nb);
    if (pu && pu !== 'Tự hình') { adj -= 0.1; notes.push(`${BRANCHES[branch]} hình ${BRANCHES[nb]} (chi ${POS[i]}) – chú ý thị phi, sức khoẻ, pháp lý.`); }
    if (isHarm(branch, nb) && i === 2) notes.push(`${BRANCHES[branch]} hại chi ngày ${BRANCHES[nb]} – tình cảm, sức khoẻ dễ hao tổn ngầm.`);
  });
  // Tam hợp / Tam hội thành cục cùng nguyên cục
  for (const [set, el] of [...TRINES, ...DIRECTIONAL]) {
    if (!set.includes(branch)) continue;
    const others = set.filter((b) => b !== branch);
    if (others.every((b) => ctx.natalBranches.includes(b))) {
      adj += sc[el] * 0.35;
      notes.push(`${BRANCHES[branch]} cùng nguyên cục hội đủ ${set.map((b) => BRANCHES[b]).join(' ')} thành ${el} cục – ${sc[el] > 0 ? 'cục hỷ dụng, lực tốt mạnh' : sc[el] < 0 ? 'cục kỵ thần, áp lực lớn' : 'biến hoá khí thế'}.`);
    }
  }
  // Can vận hợp/xung với can nguyên cục
  ctx.natalStems.forEach((ns, i) => {
    const he = stemCombo(stem, ns);
    if (he) {
      if (i === 2) notes.push(`${STEMS[stem]} hợp nhật chủ ${STEMS[ns]} – có duyên gắn kết, cơ hội đến tìm (nam mệnh hợp Tài, nữ mệnh hợp Quan dễ có chuyện tình cảm).`);
      else {
        const nsScore = sc[STEM_ELEMENT[ns]];
        if (nsScore > 0) { adj -= 0.2; notes.push(`${STEMS[stem]} hợp trói ${STEMS[ns]} (can ${POS[i]} – hỷ dụng) → điều tốt bị kìm giữ.`); }
        else if (nsScore < 0) { adj += 0.2; notes.push(`${STEMS[stem]} hợp trói ${STEMS[ns]} (can ${POS[i]} – kỵ thần) → hoá giải bớt cái xấu.`); }
      }
    }
    if (isStemClash(stem, ns) && i === 2 && isClash(branch, ctx.natalBranches[2])) { adj -= 0.5; notes.push('Thiên khắc địa xung với trụ ngày – năm/vận biến động lớn: sức khoẻ, hôn nhân, chỗ ở, công việc.'); }
  });
  if (branch === ctx.natalBranches[0] && kind === 'nam') notes.push('Năm bản mệnh (trùng chi năm sinh – phạm Thái Tuế): nên thận trọng, giữ ổn định.');
  if (isClash(branch, ctx.natalBranches[0]) && kind === 'nam') notes.push('Năm xung Thái Tuế (xung chi năm sinh): dễ thay đổi, di chuyển.');

  const wS = kind === 'van' ? 0.4 : 0.5;
  const total = stemScore * wS + branchScore * (1 - wS) + adj;
  const stemGod = tenGod(dm, stem);
  const branchGod = tenGod(dm, HIDDEN_STEMS[branch][0][0]);
  const themes: string[] = [];
  const gS = godGroupOf(stemGod), gB = godGroupOf(branchGod);
  themes.push(`Can ${STEMS[stem]} (${stemGod}, ${sEl}): ${stemScore > 0 ? GROUP_THEME[gS].good : stemScore < 0 ? GROUP_THEME[gS].bad : 'ảnh hưởng trung tính – ' + GROUP_THEME[gS].good}.`);
  const bEl = STEM_ELEMENT[HIDDEN_STEMS[branch][0][0]];
  themes.push(`Chi ${BRANCHES[branch]} (${branchGod}, ${bEl}): ${sc[bEl] > 0 ? GROUP_THEME[gB].good : sc[bEl] < 0 ? GROUP_THEME[gB].bad : 'trung tính – ' + GROUP_THEME[gB].good}.`);
  if (stemScore > 0 && branchScore < 0) notes.unshift('Can lợi dụng thần nhưng chi bất lợi – trong cát có hung, đầu tốt sau trở ngại.');
  if (stemScore < 0 && branchScore > 0) notes.unshift('Can bất lợi nhưng chi lợi dụng thần – cát hung lẫn lộn, gốc rễ vẫn vững.');
  return { stem, branch, stemGod, branchGod, stemScore, branchScore, total, rating: rate(total), notes, themes };
}

/** Kết hợp lưu niên với đại vận (Thiên Lý Mệnh Cảo – Quan hệ giữa Lưu niên và Đại vận) */
export function combineYearWithLuck(year: PeriodEval, luck: PeriodEval | null): { total: number; rating: Rating; note: string } {
  if (!luck) return { total: year.total, rating: year.rating, note: '' };
  const total = year.total * 0.65 + luck.total * 0.35;
  const yG = year.total >= 0.35, yB = year.total <= -0.35, lG = luck.total >= 0.35, lB = luck.total <= -0.35;
  let note = '';
  if (yG && lG) note = 'Lưu niên thiện, đại vận cũng thiện → càng tốt.';
  else if (yG && lB) note = 'Lưu niên thiện nhưng đại vận ác → thiện ác đều gặp, tốt mà chưa trọn.';
  else if (yB && lB) note = 'Lưu niên ác, đại vận cũng ác → càng phải thận trọng.';
  else if (yB && lG) note = 'Lưu niên ác nhưng đại vận thiện → có xấu nhưng được vận đỡ, hung giảm.';
  else if (!lG && !lB) note = yG ? 'Đại vận trung tính, lưu niên thuận – nắm cơ hội trong năm.' : yB ? 'Đại vận trung tính, lưu niên bất lợi – thận trọng, giữ ổn định.' : 'Vận và năm đều trung bình – giữ nhịp, tích luỹ.';
  else note = lG ? 'Đại vận thiện đỡ cho năm trung bình.' : 'Đại vận kém, năm trung bình – không nên mạo hiểm.';
  return { total, rating: rate(total), note };
}
