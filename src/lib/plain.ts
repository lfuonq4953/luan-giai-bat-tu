// Lớp "lời thường": chuyển kết quả engine (vốn dùng thuật ngữ mệnh lý) thành các thẻ tóm tắt dễ hiểu cho người không học mệnh lý.
// Không tính lại gì – chỉ diễn giải kết luận đã có. Mỗi thẻ kèm "căn cứ" (why) bằng thuật ngữ để người muốn tìm hiểu đối chiếu.
import type { AnalysisResult } from './battu/analyze';
import type { PeriodEval, Rating } from './battu/luck';
import type { TuViResult, PalaceEval } from './tuvi/analyze';
import {
  STEMS, BRANCHES, STEM_ELEMENT, HIDDEN_STEMS, ELEMENTS, Element, GodGroup, GOD_GROUPS, groupElement, elementGroup, godGroupOf,
} from './battu/constants';
import { pillarName } from './battu/chart';
import { DAY_MASTER, ELEMENT_INFO } from './battu/knowledge/texts';
import { MAJOR_STARS, TU_HOA, PALACE_TOPIC } from './tuvi/knowledge';

export type Level = 'good' | 'mid' | 'bad';
export interface PlainCard { id: string; title: string; level?: Level; badge?: string; lines: string[]; tips?: { label: string; items: string[] }[]; why: string }
export interface PlainSummary { headline: string; cards: PlainCard[] }

/** Mỗi nhóm thập thần nói bằng lời thường: nó là gì trong đời sống, khi tốt thì sao, khi xấu thì sao */
export const GROUP_PLAIN: Record<GodGroup, { what: string; good: string; bad: string; persona: string; work: string }> = {
  'Tỷ Kiếp': {
    what: 'bạn bè, anh em, đồng đội và tinh thần tự lập',
    good: 'có bạn bè, anh em, đồng đội giúp sức; tự tin, dám hành động, hợp làm nhóm hoặc hợp tác',
    bad: 'dễ cạnh tranh, hao tiền vì người quen, nóng vội và cố chấp; hợp tác nên rạch ròi tiền bạc',
    persona: 'độc lập, coi trọng bạn bè, thích tự quyết',
    work: 'tự kinh doanh, làm việc nhóm, hợp tác, nghề cần sức bền và sự quyết liệt',
  },
  'Thực Thương': {
    what: 'tài năng, sự sáng tạo và cách bạn thể hiện bản thân',
    good: 'ý tưởng dồi dào, thể hiện được năng lực, học thêm kỹ năng, kiếm tiền bằng tay nghề và chất xám',
    bad: 'dễ nói thẳng mất lòng, bốc đồng, va chạm với cấp trên; nên tiết chế lời nói',
    persona: 'thích sáng tạo, thích nói ra suy nghĩ của mình, ghét gò bó',
    work: 'nghề sáng tạo, chuyên môn – kỹ thuật, làm nội dung, giảng dạy, tư vấn',
  },
  'Tài': {
    what: 'tiền bạc, cơ hội kiếm tiền và tài sản',
    good: 'kiếm tiền thuận, có cơ hội kinh doanh, đầu tư',
    bad: 'tiền vào rồi ra nhanh, áp lực chi tiêu; dễ vì tiền mà mệt, ảnh hưởng việc học hoặc sức khoẻ',
    persona: 'thực tế, nhạy với tiền bạc, chú trọng kết quả',
    work: 'kinh doanh, bán hàng, tài chính, quản lý tiền và tài sản',
  },
  'Quan Sát': {
    what: 'công việc, trách nhiệm, cấp trên, kỷ luật và danh tiếng',
    good: 'được giao việc lớn, được cấp trên tin dùng, có cơ hội thăng tiến',
    bad: 'áp lực công việc, bị soi xét, dễ gặp người gây khó dễ; chú ý giấy tờ, pháp lý và sức khoẻ',
    persona: 'có trách nhiệm, sống có nguyên tắc, coi trọng danh dự',
    work: 'tổ chức lớn, cơ quan nhà nước, quản lý, nơi có hệ thống và lộ trình rõ ràng',
  },
  'Ấn': {
    what: 'học hành, kiến thức, người lớn nâng đỡ, nhà cửa – giấy tờ',
    good: 'học hành, thi cử thuận; được người lớn, thầy cô, cấp trên nâng đỡ; nhà cửa, giấy tờ suôn sẻ',
    bad: 'dễ trì trệ, ngại thay đổi, dựa dẫm; lo nghĩ nhiều mà ít hành động',
    persona: 'ham học, suy nghĩ sâu, cần cảm giác an toàn',
    work: 'học thuật, giáo dục, nghiên cứu, y dược, văn hoá, hành chính',
  },
};

export const ELEMENT_PLAIN: Record<Element, string> = {
  'Mộc': 'cây cối, màu xanh lá, sự phát triển và học hỏi',
  'Hỏa': 'ánh sáng, màu đỏ – cam, sự nhiệt huyết',
  'Thổ': 'đất, màu vàng – nâu, sự ổn định',
  'Kim': 'kim loại, màu trắng – bạc, sự kỷ luật và quyết đoán',
  'Thủy': 'nước, màu đen – xanh dương, sự linh hoạt và giao lưu',
};

export const RATE_PLAIN: Record<Rating | string, string> = {
  'Rất tốt': 'rất thuận lợi', 'Tốt': 'thuận lợi', 'Bình hoà': 'bình ổn, được – mất đan xen', 'Kém': 'khá vất vả, cần thận trọng', 'Xấu': 'nhiều thử thách',
};
export const rateLevel = (r: string): Level => (r === 'Rất tốt' || r === 'Tốt' ? 'good' : r === 'Bình hoà' ? 'mid' : 'bad');

const STRENGTH_PLAIN = [
  'Bản mệnh rất yếu so với hoàn cảnh xung quanh – bạn nhạy cảm, dễ chịu ảnh hưởng của môi trường. Lá số kiểu này hợp “thuận theo dòng”: chọn đúng môi trường, đúng người dẫn dắt thì đi rất xa.',
  'Bản mệnh khá yếu – bạn tinh tế, biết lắng nghe nhưng dễ mệt khi phải gánh nhiều. Có người hỗ trợ, có nền tảng kiến thức vững thì phát huy tốt.',
  'Bản mệnh hơi yếu – bạn mềm mỏng, biết thích nghi, nhưng cần thêm sự hỗ trợ (học vấn, bạn bè, người đi trước) để tự tin hơn.',
  'Bản mệnh gần cân bằng, hơi nghiêng về yếu – khá linh hoạt; lúc thuận thì tiến nhanh, lúc khó cần dựa vào người hỗ trợ.',
  'Bản mệnh cân bằng – dễ thích nghi, ít khi quá đà; thành bại phụ thuộc nhiều vào từng giai đoạn vận.',
  'Bản mệnh gần cân bằng, hơi nghiêng về mạnh – tự tin, chủ động, chịu được áp lực ở mức vừa phải.',
  'Bản mệnh mạnh – nhiều năng lượng tự thân, tự tin, chịu được áp lực; cần “chỗ để xả” năng lượng như công việc thử thách, mục tiêu rõ ràng.',
  'Bản mệnh rất mạnh – cá tính rõ, tự quyết, không thích bị sai khiến; mặt trái là dễ cứng đầu, khó nghe góp ý.',
  'Bản mệnh cực mạnh – năng lượng dồn về một phía, ý chí rất cao, làm gì cũng muốn theo cách của mình; khéo dùng thì thành người dẫn đầu, không khéo thì dễ cô lập.',
];

const uniq = <T,>(a: T[]) => [...new Set(a)];
const firstItems = (s: string, n: number) => s.split(',').map((x) => x.trim()).filter(Boolean).slice(0, n).join(', ');
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Diễn giải một giai đoạn (đại vận / lưu niên) bằng lời thường */
export function plainPeriod(ev: PeriodEval, b: AnalysisResult): string[] {
  const sc = b.yong.elementScore;
  const out: string[] = [];
  const gS = godGroupOf(ev.stemGod);
  const bEl = STEM_ELEMENT[HIDDEN_STEMS[ev.branch][0][0]];
  const gB = godGroupOf(ev.branchGod);
  const say = (g: GodGroup, s: number) => (s > 0 ? `Thuận: ${GROUP_PLAIN[g].good}` : s < 0 ? `Cần lưu ý: ${GROUP_PLAIN[g].bad}` : `Chủ đề ${GROUP_PLAIN[g].what} nổi lên, tốt xấu tuỳ cách bạn xử lý`);
  out.push(`${say(gS, ev.stemScore)}.`);
  if (gB !== gS || Math.sign(sc[bEl]) !== Math.sign(ev.stemScore)) out.push(`${say(gB, sc[bEl])}.`);
  for (const n of ev.notes) {
    let t = '';
    if (/Can lợi dụng thần nhưng chi bất lợi/.test(n)) t = 'Giai đoạn đầu thuận, về sau dễ gặp trở ngại – nên tranh thủ lúc đầu.';
    else if (/Can bất lợi nhưng chi lợi/.test(n)) t = 'Giai đoạn đầu vất vả, về sau vững dần.';
    else if (/Thiên khắc địa xung/.test(n)) t = 'Có biến động lớn (công việc, chỗ ở, các mối quan hệ, sức khoẻ) – nên giữ ổn định, tránh quyết định vội.';
    else if (/phạm Thái Tuế/.test(n)) t = 'Năm tuổi (trùng con giáp năm sinh): nên thận trọng, giữ ổn định.';
    else if (/xung Thái Tuế/.test(n)) t = 'Năm xung tuổi: dễ có thay đổi, đi lại, chuyển chỗ.';
    else if (/xung khứ/.test(n)) { const m = n.match(/ở (.+)\.$/); t = `Có thay đổi, nhưng là thay đổi gỡ bớt khó khăn${m ? ` (liên quan ${m[1]})` : ''}.`; }
    else if (/xung .*hỷ dụng/.test(n)) { const m = n.match(/về (.+)\.$/); t = `Có xáo trộn bất lợi${m ? ` liên quan ${m[1]}` : ''} – nên chuẩn bị trước.`; }
    else if (/ xung /.test(n)) { const m = n.match(/liên quan (.+)\.$/); t = `Có thay đổi${m ? ` liên quan ${m[1]}` : ''}.`; }
    else if (/hợp nhật chủ/.test(n)) t = 'Có duyên gắn kết mới: cơ hội tự tìm đến, dễ có chuyện tình cảm.';
    else if (/hợp trói .*hỷ dụng/.test(n)) t = 'Một số điều tốt bị kìm lại, tiến độ chậm hơn mong muốn.';
    else if (/hợp trói .*kỵ thần/.test(n)) t = 'Một số rắc rối được hoá giải.';
    else if (/lục hợp.*hỷ thần/.test(n)) t = 'Có quý nhân, cơ hội hợp tác tốt.';
    else if (/lục hợp.*kỵ thần/.test(n)) t = 'Dễ vướng vào ràng buộc, cam kết không như ý.';
    else if (/lục hợp/.test(n)) t = 'Có sự gắn bó, hợp tác mới.';
    else if (/cục hỷ dụng/.test(n)) t = 'Nhiều yếu tố tốt cộng hưởng, lực đẩy mạnh.';
    else if (/cục kỵ thần/.test(n)) t = 'Áp lực dồn lại – nên giảm tham vọng, giữ sức.';
    else if (/ hình /.test(n)) t = 'Chú ý thị phi, giấy tờ pháp lý và sức khoẻ.';
    else if (/hại chi ngày/.test(n)) t = 'Tình cảm và sức khoẻ dễ hao tổn ngầm – quan tâm người bên cạnh nhiều hơn.';
    if (t) out.push(t);
  }
  return uniq(out);
}

export function buildPlain(b: AnalysisResult, tv: TuViResult | null): PlainSummary {
  const { chart, strength, pattern, yong } = b;
  const dm = chart.dayMaster;
  const dEl = STEM_ELEMENT[dm];
  const sc = yong.elementScore;
  const isMale = chart.input.gender === 'nam';
  const tot = ELEMENTS.reduce((a, e) => a + strength.scores[e], 0) || 1;
  const share = (g: GodGroup) => strength.scores[groupElement(dEl, g)] / tot;
  const stems = chart.pillars.map((p) => p.stem);
  const has = (g: GodGroup) => stems.some((s, i) => i !== 2 && STEM_ELEMENT[s] === groupElement(dEl, g)) || share(g) >= 0.1;
  const gOf = (e: Element) => elementGroup(dEl, e);
  const goodEls = uniq([yong.useful, ...yong.favorable]);
  const goodGroups = uniq(goodEls.map(gOf));
  const badGroups = uniq(yong.unfavorable.map(gOf));
  const usefulG = yong.usefulGroup;
  const ref = chart.referenceYear;
  const DMI = DAY_MASTER[dm];
  const pName = pattern.special ? pattern.special.name : pattern.name;
  const E = (n: string): PalaceEval | undefined => tv?.evals.find((e) => e.palace.name === n);
  const starsOf = (ev?: PalaceEval) => (ev?.majors ?? []).map((s) => s.name).filter((n) => MAJOR_STARS[n]);
  const tvLine = (palace: string, label: string, key: 'nature' | 'career' | 'wealth' | 'love' | 'health') => {
    const ev = E(palace);
    if (!ev) return null;
    const st = starsOf(ev);
    const desc = st.slice(0, 2).map((n) => MAJOR_STARS[n][key]).join('; ');
    return `Tử Vi xem ${label}: ${RATE_PLAIN[ev.rating] ?? ev.rating.toLowerCase()}${st.length ? ` (sao ${st.join(', ')}${ev.borrowed ? ', mượn từ cung đối diện' : ''})` : ''}${desc ? (key === 'health' ? ` – bộ phận nên để ý: ${desc}` : ` – ${desc}`) : ''}.`;
  };
  const cards: PlainCard[] = [];

  // 1. Bạn là người thế nào
  const topGroup = GOD_GROUPS.filter((g) => g !== 'Tỷ Kiếp' || share(g) >= 0.25).sort((a, c) => share(c) - share(a))[0];
  const menh = E('Mệnh');
  const menhStars = starsOf(menh);
  cards.push({
    id: 'pl-ban-than', title: 'Bạn là người thế nào',
    badge: `${STEMS[dm]} ${dEl}`,
    lines: [
      `Hình ảnh của bạn: ${DMI.title.split('–')[1]?.trim() ?? DMI.title}. ${DMI.nature}`,
      `Điểm mạnh: ${DMI.strengths}`,
      `Cần lưu ý: ${DMI.weaknesses}`,
      STRENGTH_PLAIN[strength.levelIndex] ?? '',
      topGroup ? `Nét nổi bật trong cách sống: ${GROUP_PLAIN[topGroup].persona}.` : '',
      menhStars.length ? `Theo Tử Vi (sao ${menhStars.join(', ')} ở cung Mệnh): ${menhStars.slice(0, 2).map((n) => MAJOR_STARS[n].nature).join('; ')}.` : '',
    ].filter(Boolean),
    why: `Nhật chủ ${STEMS[dm]} ${dEl} sinh tháng ${BRANCHES[chart.pillars[1].branch]}; vượng suy: ${strength.level} (phe trợ ${Math.round(strength.ratio * 100)}%); nhóm thập thần mạnh nhất: ${topGroup}.`,
  });

  // 2. Chìa khoá may mắn
  cards.push({
    id: 'pl-chia-khoa', title: 'Điều giúp bạn tốt lên',
    level: 'good',
    lines: [
      `Điều mang lại may mắn nhiều nhất cho bạn là ${GROUP_PLAIN[usefulG].what}. Khi cuộc sống có nhiều yếu tố này, mọi việc thường suôn sẻ hơn.`,
      goodGroups.filter((g) => g !== usefulG).length ? `Cũng có lợi: ${goodGroups.filter((g) => g !== usefulG).map((g) => GROUP_PLAIN[g].what).join('; ')}.` : '',
      badGroups.length ? `Điều nên tiết chế: ${badGroups.map((g) => GROUP_PLAIN[g].what).join('; ')} – có quá nhiều thì dễ mất cân bằng.` : '',
      `Về ngũ hành: hợp ${goodEls.map((e) => `${e} (${ELEMENT_PLAIN[e]})`).join(', ')}${yong.unfavorable.length ? `; kém hợp ${yong.unfavorable.join(', ')}` : ''}.`,
    ].filter(Boolean),
    why: `Dụng thần ${yong.useful} (${usefulG}), hỷ thần ${yong.favorable.join(', ') || '—'}, kỵ thần ${yong.unfavorable.join(', ') || '—'} – phương pháp ${yong.method}; cách cục ${pName}.`,
  });

  // 3. Công việc
  const careerEls = goodEls.slice(0, 2);
  const work: string[] = [
    `Hướng phát triển hợp nhất: ${GROUP_PLAIN[usefulG].work}.`,
    `Lĩnh vực hợp: ${careerEls.map((e) => firstItems(ELEMENT_INFO[e].careers, 6)).join('; ')}.`,
  ];
  if (goodEls.includes(groupElement(dEl, 'Quan Sát'))) work.push('Hợp môi trường có tổ chức, có lộ trình thăng tiến rõ ràng; được giao trách nhiệm là lúc bạn toả sáng.');
  else if (yong.unfavorable.includes(groupElement(dEl, 'Quan Sát'))) work.push('Môi trường quá gò bó, nhiều áp lực từ cấp trên dễ làm bạn mệt – nên chọn nơi được tự chủ hoặc tự làm chủ.');
  if (goodEls.includes(groupElement(dEl, 'Thực Thương'))) work.push('Bạn kiếm được nhiều hơn khi làm việc bằng chuyên môn, tay nghề riêng thay vì việc lặp đi lặp lại.');
  const tq = tvLine('Quan Lộc', 'sự nghiệp', 'career');
  if (tq) work.push(tq);
  cards.push({ id: 'pl-cong-viec', title: 'Công việc hợp với bạn', lines: work, why: `Dụng thần thuộc nhóm ${usefulG}; ngành nghề theo hành ${careerEls.join(', ')}; cách cục ${pName} (${pattern.verdict.toLowerCase()}).` });

  // 4. Tiền bạc
  const money: string[] = [];
  const taiEl = groupElement(dEl, 'Tài');
  if (goodEls.includes(taiEl)) money.push('Tiền bạc là điểm sáng: càng chủ động kiếm tiền, kinh doanh thì càng thuận; những giai đoạn gặp yếu tố tiền bạc là lúc “phát”.');
  else if (yong.unfavorable.includes(taiEl)) money.push('Tiền bạc nên giữ ở mức vừa sức – tham nhiều dễ mệt và hao. Thu nhập ổn định hợp hơn đầu cơ, lướt sóng.');
  if (strength.strong && share('Tài') < 0.08 && share('Tỷ Kiếp') >= 0.35) money.push('Dễ hao tiền vì bạn bè, anh em hoặc chia chác khi làm chung – nên rạch ròi, có giấy tờ.');
  else if (badGroups.includes('Tỷ Kiếp') && share('Tỷ Kiếp') >= 0.4) money.push('Bạn bè, người quen nhiều nhưng chuyện tiền bạc với họ nên rạch ròi: hạn chế cho vay, góp vốn chung khi chưa có thoả thuận rõ.');
  if (!strength.strong && share('Tài') >= 0.3) money.push('Cơ hội tiền bạc nhiều nhưng sức gánh có hạn – hợp làm công hoặc hợp tác hơn là ôm việc lớn một mình.');
  if (share('Thực Thương') >= 0.2 && has('Tài')) money.push('Cách kiếm tiền tốt nhất là bằng tay nghề, chất xám, sự sáng tạo.');
  if (strength.strong && !has('Tài') && has('Thực Thương')) money.push('Tiềm năng kiếm tiền còn ẩn – sẽ bật lên khi bước vào giai đoạn thuận về tiền bạc.');
  if (!money.length) money.push('Tài chính ở mức trung bình, lên xuống theo từng giai đoạn – nên có kế hoạch tiết kiệm đều đặn.');
  const tt = tvLine('Tài Bạch', 'tiền bạc', 'wealth');
  if (tt) money.push(tt);
  cards.push({ id: 'pl-tien-bac', title: 'Tiền bạc', level: goodEls.includes(taiEl) ? 'good' : yong.unfavorable.includes(taiEl) ? 'bad' : 'mid', lines: money, why: `Tài tinh (${taiEl}) là ${goodEls.includes(taiEl) ? 'hỷ dụng' : yong.unfavorable.includes(taiEl) ? 'kỵ thần' : 'nhàn thần'}; tỷ trọng Tài ${Math.round(share('Tài') * 100)}%, Tỷ Kiếp ${Math.round(share('Tỷ Kiếp') * 100)}%; ${strength.strong ? 'thân vượng' : 'thân nhược'}.` });

  // 5. Tình cảm
  const spouseG: GodGroup = isMale ? 'Tài' : 'Quan Sát';
  const spEl = groupElement(dEl, spouseG);
  const love: string[] = [];
  if (sc[spEl] > 0) love.push(`Chuyện tình cảm có lợi cho bạn: người ${isMale ? 'vợ' : 'chồng'} thường là chỗ dựa, giúp bạn tốt lên.`);
  else if (sc[spEl] < 0) love.push('Tình cảm dễ kèm áp lực – nên chọn người ôn hoà, biết tôn trọng không gian riêng của nhau.');
  const dayBr = chart.pillars[2].branch;
  const dayMain = STEM_ELEMENT[HIDDEN_STEMS[dayBr][0][0]];
  love.push(sc[dayMain] > 0 ? 'Cung hôn nhân thuận – về lâu dài gia đình êm ấm, người bạn đời có năng lực.' : sc[dayMain] < 0 ? 'Cung hôn nhân chưa thuận – người bạn đời ít giúp được việc lớn, cần vun đắp nhiều; kết hôn muộn một chút thường bền hơn.' : 'Cung hôn nhân ở mức bình thường – hạnh phúc phụ thuộc nhiều vào sự vun đắp của hai người.');
  if (b.relations.some((r) => !r.good && /xung/i.test(r.label) && r.label.includes(BRANCHES[dayBr]))) love.push('Hôn nhân dễ có giai đoạn xa cách hoặc biến động – cần giữ liên lạc, nhường nhịn.');
  if (isMale && share('Tài') < 0.1 && share('Tỷ Kiếp') >= 0.3) love.push('Dễ có “người thứ ba” cạnh tranh trong tình cảm – nên rõ ràng, chủ động.');
  const loveYears = b.years.filter((y) => y.year >= ref && (godGroupOf(y.evaluation.stemGod) === spouseG || y.evaluation.notes.some((n) => /hợp nhật chủ/.test(n)))).map((y) => y.year).slice(0, 4);
  if (loveYears.length) love.push(`Những năm dễ có duyên hoặc tiến triển tình cảm: ${loveYears.join(', ')}.`);
  const tl = tvLine('Phu Thê', 'tình duyên', 'love');
  if (tl) love.push(tl);
  const loveScore = Math.sign(sc[spEl]) + Math.sign(sc[dayMain]);
  cards.push({ id: 'pl-tinh-cam', title: 'Tình cảm – hôn nhân', level: loveScore >= 2 ? 'good' : loveScore <= -2 ? 'bad' : 'mid', lines: love, why: `${isMale ? 'Nam lấy Tài' : 'Nữ lấy Quan Sát'} làm sao phối ngẫu (${spEl}, ${sc[spEl] > 0 ? 'hỷ dụng' : sc[spEl] < 0 ? 'kỵ' : 'trung tính'}); chi ngày ${BRANCHES[dayBr]} là cung phu thê.` });

  // 6. Sức khoẻ
  const health: string[] = [];
  strength.elements.forEach((e) => {
    if (e.level === 'Cực vượng') health.push(`Nên để ý: ${ELEMENT_INFO[e.element].organs} (yếu tố ${e.element} quá mạnh trong lá số).`);
    if (e.level === 'Khuyết' || e.level === 'Rất nhược') health.push(`Nên bồi bổ, kiểm tra định kỳ: ${ELEMENT_INFO[e.element].organs} (yếu tố ${e.element} quá ít).`);
  });
  if (!health.length) health.push('Ngũ hành tương đối cân bằng, không có điểm yếu nổi bật – giữ nếp sinh hoạt điều độ là đủ.');
  const th = tvLine('Tật Ách', 'sức khoẻ', 'health');
  if (th) health.push(th);
  health.push('Đây chỉ là gợi ý phòng ngừa, không thay thế khám bệnh.');
  cards.push({ id: 'pl-suc-khoe', title: 'Sức khoẻ', lines: health, why: `Theo hành thái quá/bất cập: ${strength.elements.map((e) => `${e.element} ${Math.round(e.percent * 100)}%`).join(', ')} (Tử Bình Bệnh Nguyên).` });

  // 7. Giai đoạn 10 năm hiện tại
  const curIdx = b.luck.findIndex((l) => l.current);
  const cur = curIdx >= 0 ? b.luck[curIdx] : null;
  if (cur) {
    const next = b.luck[curIdx + 1];
    const lines = [
      `Từ ${cur.startYear} đến ${cur.endYear}${cur.startAge !== null ? ` (${cur.startAge}–${cur.startAge + 9} tuổi)` : ''}: giai đoạn ${RATE_PLAIN[cur.evaluation.rating]}.`,
      ...plainPeriod(cur.evaluation, b),
    ];
    if (next) lines.push(`Giai đoạn kế tiếp (${next.startYear}–${next.endYear}): ${RATE_PLAIN[next.evaluation.rating]}.`);
    const dh = tv?.currentDaiHan ? E(tv.currentDaiHan.name) : undefined;
    if (dh) lines.push(`Tử Vi: 10 năm này xoay quanh chuyện ${PALACE_TOPIC[dh.palace.name] ?? dh.palace.name.toLowerCase()} – ${RATE_PLAIN[dh.rating] ?? dh.rating.toLowerCase()}.`);
    cards.push({ id: 'pl-giai-doan', title: 'Giai đoạn 10 năm hiện tại', level: rateLevel(cur.evaluation.rating), badge: cur.evaluation.rating, lines, why: `Đại vận ${pillarName(cur)} – can ${cur.stemGod}, chi ${cur.branchGod}; chấm theo dụng thần ${yong.useful}.` });
  }

  // 8. Năm xem
  const Y = b.years.find((y) => y.current);
  if (Y) {
    const lines = [`Năm ${Y.year} (${pillarName(Y)}${Y.age ? `, ${Y.age} tuổi` : ''}) nhìn chung ${RATE_PLAIN[Y.combined.rating]}.`, ...plainPeriod(Y.evaluation, b)];
    if (tv) {
      const ys = ((ref - 4) % 10 + 10) % 10;
      const where = (star: string) => tv.data.palaces.find((p) => p.major.some((s) => s.name === star) || p.minor.some((s) => s.name === star));
      const loc = where(TU_HOA[ys][0]), ky = where(TU_HOA[ys][3]);
      if (loc) lines.push(`Tử Vi: cơ hội, tài lộc năm nay đến qua chuyện ${PALACE_TOPIC[loc.name]}.`);
      if (ky) lines.push(`Tử Vi: điều dễ khiến bạn lo nghĩ năm nay là ${PALACE_TOPIC[ky.name]} – nên thận trọng lời nói và quyết định.`);
    }
    const future = b.years.filter((y) => y.year > ref);
    const goodY = future.filter((y) => rateLevel(y.combined.rating) === 'good').map((y) => y.year);
    const badY = future.filter((y) => rateLevel(y.combined.rating) === 'bad').map((y) => y.year);
    if (goodY.length) lines.push(`Những năm thuận lợi phía trước: ${goodY.join(', ')}.`);
    if (badY.length) lines.push(`Những năm nên chậm lại, giữ ổn định: ${badY.join(', ')}.`);
    cards.push({ id: 'pl-nam-xem', title: `Năm ${Y.year}`, level: rateLevel(Y.combined.rating), badge: Y.combined.rating, lines, why: `Lưu niên ${pillarName(Y)} – can ${Y.evaluation.stemGod}, chi ${Y.evaluation.branchGod}; kết hợp đại vận: ${Y.combined.note}` });
  }

  // 9. Nên làm – nên tránh
  const I = ELEMENT_INFO[yong.useful];
  const I2 = yong.favorable[0] ? ELEMENT_INFO[yong.favorable[0]] : null;
  cards.push({
    id: 'pl-loi-khuyen', title: 'Nên làm – nên tránh',
    lines: [`Ưu tiên bổ sung yếu tố ${yong.useful}${yong.favorable[0] ? ` và ${yong.favorable[0]}` : ''} vào cuộc sống hằng ngày.`],
    tips: [
      { label: 'Nên', items: uniq([
        `Màu sắc hợp: ${firstItems(I.color, 3)}${I2 ? `, ${firstItems(I2.color, 2)}` : ''}`,
        `Hướng tốt: ${I.direction}`,
        `Vật dụng: ${firstItems(I.items, 3)}`,
        ...goodGroups.slice(0, 2).map((g) => `Chủ động tìm đến ${GROUP_PLAIN[g].what}`),
      ]) },
      { label: 'Nên tránh', items: [
        ...(yong.unfavorable.length ? [`Dùng quá nhiều màu ${yong.unfavorable.map((e) => firstItems(ELEMENT_INFO[e].color, 1)).join(', ')} làm chủ đạo`] : []),
        ...badGroups.slice(0, 2).map((g) => cap(GROUP_PLAIN[g].bad.split(';')[0])),
      ] },
    ],
    why: `Cải vận theo dụng thần ${yong.useful}${yong.favorable.length ? `, hỷ thần ${yong.favorable.join(', ')}` : ''} – Đổi Vận Cho Người Mệnh Khuyết (Lý Cư Minh).`,
  });

  const SHORT: Record<string, string> = { 'Rất tốt': 'rất thuận', 'Tốt': 'thuận lợi', 'Bình hoà': 'bình ổn', 'Kém': 'khá vất vả', 'Xấu': 'nhiều thử thách' };
  let when = '';
  if (cur && Y && cur.evaluation.rating === Y.combined.rating) when = `10 năm hiện tại và năm ${Y.year} đều ${SHORT[Y.combined.rating]}`;
  else when = [cur ? `10 năm hiện tại ${SHORT[cur.evaluation.rating]}` : '', Y ? `năm ${Y.year} ${SHORT[Y.combined.rating]}` : ''].filter(Boolean).join(', ');
  const headline = `${chart.input.name ? chart.input.name + ' – ' : ''}${STRENGTH_PLAIN[strength.levelIndex]?.split('–')[0].trim()}. Điều giúp bạn tốt lên nhất là ${GROUP_PLAIN[usefulG].what}.${when ? ` ${cap(when)}.` : ''}`;
  return { headline, cards };
}

/** Văn bản thuần của phần tóm tắt – gửi kèm cho AI */
export function plainToText(p: PlainSummary): string {
  return [p.headline, ...p.cards.map((c) => `${c.title}: ${c.lines.join(' ')}${c.tips ? ' ' + c.tips.map((t) => `${t.label}: ${t.items.join('; ')}.`).join(' ') : ''}`)].join('\n');
}
