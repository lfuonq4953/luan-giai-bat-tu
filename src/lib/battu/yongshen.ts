// Thủ dụng thần: Phù ức (theo bảng "Dụng thần Bát cách" – Thiên Lý Mệnh Cảo), Điều hậu (Tử Bình Chân Thuyên – Dụng thần đề yếu),
// Thông quan (Trích Thiên Tủy), và dụng thần của Ngoại cách.
import {
  Element, ELEMENTS, GodGroup, groupElement, elementGroup, generatedBy, generates, controls, controlledBy, STEMS, BRANCHES,
  seasonOfMonthBranch, STEM_ELEMENT,
} from './constants';
import { StrengthResult } from './strength';
import { PatternResult } from './pattern';

export interface YongShen {
  method: string;                 // Phù ức / Điều hậu / Thông quan / Ngoại cách
  useful: Element;                // Dụng thần
  favorable: Element[];           // Hỷ thần
  unfavorable: Element[];         // Kỵ thần
  enemy: Element[];               // Cừu thần
  idle: Element[];                // Nhàn thần
  tiaohou: { need: Element | null; reason: string } | null;
  tongguan: { element: Element; between: [Element, Element]; reason: string } | null;
  reasons: string[];
  elementScore: Record<Element, number>; // +2 dụng … −2 kỵ, đã cộng điều hậu – dùng để chấm vận
  usefulGroup: GodGroup;
  deYeuKey: { stem: number; month: number }; // để tra "Bát Tự Dụng Thần Đề Yếu"
}

export interface YongCtx { stems: number[]; branches: number[]; strength: StrengthResult; pattern: PatternResult }

const G = (g: GodGroup) => g;

export function chooseYongShen(ctx: YongCtx): YongShen {
  const { stems, branches, strength, pattern } = ctx;
  const dEl = strength.dayElement;
  const el = (g: GodGroup) => groupElement(dEl, g);
  const tot = ELEMENTS.reduce((a, e) => a + strength.scores[e], 0);
  const share = (g: GodGroup) => strength.scores[el(g)] / tot;
  const mb = branches[1];
  const reasons: string[] = [];
  const presentStem = (g: GodGroup) => stems.some((s, i) => i !== 2 && STEM_ELEMENT[s] === el(g));
  const present = (g: GodGroup) => presentStem(g) || share(g) >= 0.1;
  const heaviest = (gs: GodGroup[]) => gs.slice().sort((a, b) => share(b) - share(a))[0];

  let useful: GodGroup;
  let fav: GodGroup[] = [];
  let unf: GodGroup[] = [];
  let method = 'Phù ức';
  const sp = pattern.special;

  if (sp) {
    method = `Ngoại cách – ${sp.name}`;
    if (sp.type === 'Chuyên vượng' || (sp.type === 'Tòng cường' && sp.follow === 'Tỷ Kiếp')) {
      useful = G('Tỷ Kiếp'); fav = ['Ấn', 'Thực Thương']; unf = ['Quan Sát', 'Tài'];
      reasons.push(`Khí thế chuyên vượng tụ ở nhật chủ (${dEl}) → lấy ${dEl} làm dụng; hỷ Ấn sinh, Thực Thương tiết tú; kỵ Quan Sát khắc phạt, Tài gặp Tỷ Kiếp tranh đoạt.`);
    } else if (sp.type === 'Tòng cường') {
      useful = G('Ấn'); fav = ['Tỷ Kiếp']; unf = ['Tài', 'Quan Sát', 'Thực Thương'];
      reasons.push('Tòng Cường: Ấn tinh nắm thế → dụng Ấn, hỷ Tỷ Kiếp; kỵ Tài phá Ấn, Quan Sát, Thực Thương nghịch thế.');
    } else if (sp.type === 'Tòng nhược') {
      const f = sp.follow!;
      useful = f;
      if (f === 'Tài') { fav = ['Thực Thương', 'Quan Sát']; unf = ['Tỷ Kiếp', 'Ấn']; reasons.push('Tòng Tài: dụng Tài, hỷ Thực Thương sinh Tài, gặp Quan không ngại; kỵ Tỷ Kiếp đoạt Tài, kỵ Ấn trợ thân (Thiên Lý Mệnh Cảo).'); }
      else if (f === 'Quan Sát') { fav = ['Tài']; unf = ['Ấn', 'Tỷ Kiếp', 'Thực Thương']; reasons.push('Tòng Sát: dụng Sát, hỷ Tài Sát tương sinh; kỵ Ấn tiết Sát sinh thân, Kiếp Tỷ kháng Sát, Thực Thương chế Sát.'); }
      else { fav = ['Tài', 'Tỷ Kiếp']; unf = ['Ấn', 'Quan Sát']; reasons.push('Tòng Nhi: dụng Thực Thương (tú khí), hỷ Tài lưu thông, không sợ Tỷ Kiếp; tối kỵ Ấn khắc Thực Thương, Quan Sát cũng bất lợi.'); }
    } else {
      // Hoá khí
      const hEl = sp.element;
      useful = elementGroup(dEl, hEl);
      fav = [elementGroup(dEl, generatedBy(hEl))];
      unf = [elementGroup(dEl, controlledBy(hEl))];
      reasons.push(`Hoá khí cách: dụng hoá thần ${hEl}, hỷ ${generatedBy(hEl)} sinh hoá thần; kỵ ${controlledBy(hEl)} khắc hoá thần và vận trả về bản hành nhật chủ.`);
    }
  } else {
    const strong = strength.strong;
    const g = pattern.god;
    const heavyOpp = heaviest(['Thực Thương', 'Tài', 'Quan Sát']);
    const heavySup = share('Tỷ Kiếp') >= share('Ấn') ? 'Tỷ Kiếp' : 'Ấn';
    const isGroup = (x: GodGroup) => pattern.group === x;
    if (!strong) {
      // Thân nhược: Ấn & Tỷ Kiếp là phe dụng
      if (heavyOpp === 'Tài') { useful = present('Tỷ Kiếp') || !present('Ấn') ? 'Tỷ Kiếp' : 'Ấn'; reasons.push('Thân nhược mà Tài trọng → dụng Tỷ Kiếp chế Tài giúp thân (không có Tỷ Kiếp thì dùng Ấn).'); }
      else if (heavyOpp === 'Quan Sát') { useful = 'Ấn'; reasons.push('Thân nhược, Quan Sát trùng → dụng Ấn hoá Quan Sát sinh thân (Sát Ấn tương sinh).'); }
      else { useful = 'Ấn'; reasons.push('Thân nhược, Thực Thương tiết khí nhiều → dụng Ấn chế Thực Thương, sinh thân.'); }
      if (isGroup('Tài') && heavyOpp === 'Tài' && !present('Tỷ Kiếp') && present('Quan Sát')) { useful = 'Ấn'; }
      fav = [useful === 'Ấn' ? 'Tỷ Kiếp' : 'Ấn'];
      unf = useful === 'Ấn' ? ['Tài', heavyOpp === 'Tài' ? 'Quan Sát' : heavyOpp] : ['Quan Sát', heavyOpp];
    } else {
      // Thân vượng: Thực Thương, Tài, Quan Sát là phe dụng
      if (g === 'Dương Nhận') {
        useful = present('Quan Sát') ? 'Quan Sát' : present('Thực Thương') ? 'Thực Thương' : 'Quan Sát';
        reasons.push('Dương Nhận cách thân vượng → trước lấy Quan Sát chế Nhận; không có Quan Sát thì dùng Thực Thương tiết Nhận.');
      } else if (g === 'Kiến Lộc') {
        const taiWeak = share('Tài') < 0.1 && present('Thực Thương') && share('Thực Thương') >= share('Tài');
        useful = present('Quan Sát') && present('Tài') ? 'Quan Sát' : taiWeak ? 'Thực Thương' : present('Tài') ? 'Tài' : present('Thực Thương') ? 'Thực Thương' : 'Quan Sát';
        reasons.push('Kiến Lộc cách thân vượng → cần Tài Quan để dụng; Tài Quan cùng có thì dụng Quan (Tài sinh Quan), chỉ có Tài thì dụng Tài, không có thì dùng Thực Thương tiết tú.');
        if (taiWeak) reasons.push(`Tài tinh lộ mà vô căn (chỉ ${(share('Tài') * 100).toFixed(0)}%), Thực Thương có gốc → lấy Thực Thương tiết tú làm dụng, sinh Tài làm hỷ ("thân cường Tài nhẹ, có Thực Thương sinh Tài").`);
      } else if (heavySup === 'Ấn' && share('Ấn') >= 0.25) {
        useful = 'Tài';
        reasons.push('Thân vượng do Ấn nhiều → dụng Tài phá Ấn (Thiên Lý Mệnh Cảo: "Nhật can cường, Ấn nhiều, lấy Tài làm dụng").');
      } else if (isGroup('Quan Sát')) {
        if (share('Quan Sát') >= 0.3 && pattern.god === 'Thất Sát') { useful = 'Thực Thương'; reasons.push('Thân vượng Sát cũng trọng → dụng Thực Thương chế Sát.'); }
        else { useful = 'Quan Sát'; reasons.push(`Thân vượng, ${pattern.god} làm cách, Tỷ Kiếp nhiều → lấy Quan Sát làm dụng (cách cục kiêm dụng thần).`); }
      } else if (isGroup('Tài')) {
        useful = present('Thực Thương') ? 'Thực Thương' : present('Quan Sát') ? 'Quan Sát' : 'Tài';
        reasons.push('Tài cách thân vượng, Tỷ Kiếp tranh Tài → dụng Thực Thương hoá Kiếp sinh Tài (tốt nhất), hoặc Quan Sát chế Kiếp hộ Tài.');
      } else if (isGroup('Thực Thương')) {
        useful = present('Tài') ? 'Tài' : 'Thực Thương';
        reasons.push('Thực Thương cách thân vượng → dụng Tài (Thực Thương sinh Tài); không có Tài thì dụng chính Thực Thương tiết tú.');
      } else if (isGroup('Ấn')) {
        useful = present('Quan Sát') ? 'Quan Sát' : 'Thực Thương';
        reasons.push('Ấn cách thân vượng, Tỷ Kiếp trùng trùng → có Quan Sát thì dụng Quan Sát, không có thì dụng Thực Thương.');
      } else {
        useful = present('Quan Sát') ? 'Quan Sát' : 'Thực Thương';
        reasons.push('Thân vượng → dùng Quan Sát khắc chế hoặc Thực Thương tiết khí.');
      }
      if (useful === 'Tài') { fav = ['Thực Thương', 'Quan Sát']; unf = ['Tỷ Kiếp', 'Ấn']; }
      else if (useful === 'Thực Thương') { fav = ['Tài']; unf = ['Ấn', 'Tỷ Kiếp']; }
      else { // Quan Sát
        fav = ['Tài'];
        unf = pattern.god === 'Chính Quan' || pattern.god === 'Kiến Lộc' ? ['Thực Thương', 'Tỷ Kiếp'] : ['Tỷ Kiếp', 'Ấn'];
      }
    }
    // mức trung hoà: ghi chú tính linh hoạt
    if (strength.levelIndex >= 3 && strength.levelIndex <= 5) reasons.push(`Nhật chủ ở mức ${strength.level} – gần trung hoà, dụng thần chỉ cần "nhẹ tay": giữ cân bằng, tránh vận làm lệch hẳn về một phía.`);
  }

  // Quy về ngũ hành
  const usefulEl = el(useful!);
  let favEl = [...new Set(fav.map(el))].filter((e) => e !== usefulEl);
  let unfEl = [...new Set(unf.map(el))].filter((e) => e !== usefulEl && !favEl.includes(e));
  // Cừu thần: hành sinh cho kỵ thần (nếu không phải dụng/hỷ)
  let enemy = [...new Set(unfEl.map(generatedBy))].filter((e) => e !== usefulEl && !favEl.includes(e) && !unfEl.includes(e));
  // Thân vượng: Quan Sát khắc thân vốn có ích (luyện/chế) – không xếp vào cừu thần
  if (!sp && strength.strong) enemy = enemy.filter((e) => e !== el('Quan Sát'));
  const idle = ELEMENTS.filter((e) => e !== usefulEl && !favEl.includes(e) && !unfEl.includes(e) && !enemy.includes(e));

  // Điều hậu (hàn – noãn, táo – thấp)
  let tiaohou: YongShen['tiaohou'] = null;
  const season = seasonOfMonthBranch(mb);
  const pct = (e: Element) => strength.scores[e] / tot;
  if (season === 'Đông' && pct('Hỏa') < 0.12) {
    tiaohou = { need: 'Hỏa', reason: `Sinh tháng ${BRANCHES[mb]} mùa Đông, khí hậu hàn lạnh mà Hỏa chỉ chiếm ${(pct('Hỏa') * 100).toFixed(0)}% → cần Hỏa sưởi ấm (điều hậu). Tử Bình Chân Thuyên: "kim thủy sinh mùa đông… đều kíp nên điều hoà khí hậu".` };
  } else if (season === 'Hạ' && pct('Thủy') < 0.12) {
    tiaohou = { need: 'Thủy', reason: `Sinh tháng ${BRANCHES[mb]} mùa Hạ, khí hậu viêm nhiệt mà Thủy chỉ chiếm ${(pct('Thủy') * 100).toFixed(0)}% → cần Thủy nhuận táo (điều hậu).` };
  } else if (season === 'Thu' && mb === 10 && pct('Thủy') < 0.08 && pct('Hỏa') > 0.25) {
    tiaohou = { need: 'Thủy', reason: 'Tháng Tuất táo thổ, Hỏa nhiều mà thiếu Thủy → nên có Thủy nhuận.' };
  }
  if (tiaohou && sp === null) reasons.push(tiaohou.reason);

  // Thông quan: hai hành mạnh tương khắc nhau, hành trung gian yếu
  let tongguan: YongShen['tongguan'] = null;
  for (const a of ELEMENTS) {
    const b = controls(a); // a khắc b
    if (pct(a) >= 0.27 && pct(b) >= 0.27) {
      const mid = generates(a); // a sinh mid, mid sinh b
      if (pct(mid) < 0.15) {
        tongguan = { element: mid, between: [a, b], reason: `${a} (${(pct(a) * 100).toFixed(0)}%) và ${b} (${(pct(b) * 100).toFixed(0)}%) đều mạnh, tương khắc giao chiến → cần ${mid} làm thần thông quan (${a} sinh ${mid}, ${mid} sinh ${b}).` };
        reasons.push(tongguan.reason);
        break;
      }
    }
  }

  // Điểm thiện/ác của từng hành (để chấm vận, lưu niên)
  const elementScore = {} as Record<Element, number>;
  for (const e of ELEMENTS) elementScore[e] = e === usefulEl ? 2 : favEl.includes(e) ? 1 : unfEl.includes(e) ? -2 : enemy.includes(e) ? -1 : 0;
  if (tiaohou?.need && !sp) {
    const n = tiaohou.need;
    elementScore[n] = Math.min(2, elementScore[n] + (elementScore[n] < 0 ? 1.5 : 1));
    const opp = controlledBy(n); // hành khắc thần điều hậu (Thủy khắc Hỏa…)
    elementScore[opp] = Math.max(-2, elementScore[opp] - 0.5);
    if (elementScore[n] > 0 && !favEl.includes(n) && n !== usefulEl) { favEl = [...favEl, n]; unfEl = unfEl.filter((x) => x !== n); }
  }
  if (tongguan && !sp) elementScore[tongguan.element] = Math.min(2, elementScore[tongguan.element] + 1);

  return {
    method, useful: usefulEl, favorable: favEl, unfavorable: unfEl, enemy, idle,
    tiaohou, tongguan, reasons, elementScore, usefulGroup: useful!,
    deYeuKey: { stem: stems[2], month: ((mb - 2 + 12) % 12) + 1 },
  };
}

export const describeElementList = (els: Element[]) => els.length ? els.join(', ') : '—';
export { STEMS };
