// Thần sát thông dụng (Tam Mệnh Thông Hội, Mệnh Lý Tinh Hoa – chương Luận thần sát)
import { STEMS, BRANCHES } from './constants';

export interface ShenSha { name: string; positions: string[]; good: boolean | null; meaning: string }

const TRIAD_GROUP = (b: number) => [[8, 0, 4], [2, 6, 10], [5, 9, 1], [11, 3, 7]].findIndex((g) => g.includes(b));
// theo nhóm tam hợp: [Thân Tý Thìn, Dần Ngọ Tuất, Tị Dậu Sửu, Hợi Mão Mùi]
const YIMA = [2, 8, 11, 5];
const TAOHUA = [9, 3, 6, 0];
const HUAGAI = [4, 10, 1, 7];
const JIANGXING = [0, 6, 9, 3];
const JIESHA = [5, 11, 2, 8];
const WANGSHEN = [11, 5, 8, 2];

const TIANYI: number[][] = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]];
const WENCHANG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
const TAIJI: number[][] = [[0, 6], [0, 6], [3, 9], [3, 9], [4, 10, 1, 7], [4, 10, 1, 7], [2, 11], [2, 11], [5, 8], [5, 8]];
const LU = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
const YANGREN: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };
const JINYU = [4, 5, 7, 8, 7, 8, 10, 11, 1, 2];
const HONGYAN = [6, 6, 2, 7, 4, 4, 10, 9, 0, 8];
const TIANDE: (['s' | 'b', number])[] = [ // theo chi tháng Tý..Hợi
  ['b', 5], ['s', 6], ['s', 3], ['b', 8], ['s', 8], ['s', 7], ['b', 11], ['s', 0], ['s', 9], ['b', 2], ['s', 2], ['s', 1],
];
const YUEDE_BY_GROUP = [8, 2, 6, 0]; // Thân Tý Thìn → Nhâm; Dần Ngọ Tuất → Bính; Tị Dậu Sửu → Canh; Hợi Mão Mùi → Giáp
const HONGLUAN = [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4];

const KUIGANG = [[6, 4], [6, 10], [8, 4], [4, 10]];
const SHIE_DABAI = [[0, 4], [1, 5], [2, 8], [3, 11], [4, 10], [5, 1], [6, 4], [7, 5], [8, 8], [9, 11]];
const YINYANG_CUO = [[2, 0], [3, 1], [4, 2], [7, 3], [8, 4], [9, 5], [2, 6], [3, 7], [4, 8], [7, 9], [8, 10], [9, 11]];
const GULUAN = [[1, 5], [3, 5], [7, 11], [4, 8], [0, 2], [8, 0], [2, 6], [4, 6]];

export const SHENSHA_MEANING: Record<string, { good: boolean | null; meaning: string }> = {
  'Thiên Ất Quý Nhân': { good: true, meaning: 'Cát thần bậc nhất: gặp nạn có người giúp, được quý nhân nâng đỡ, hung hoá cát. Kỵ bị xung, rơi Không vong.' },
  'Văn Xương': { good: true, meaning: 'Thông minh, hiếu học, giỏi văn chương thi cử; gặp hung hoá cát.' },
  'Thái Cực Quý Nhân': { good: true, meaning: 'Thích nghiên cứu triết học, huyền học, tôn giáo; có phúc khí, gặp hung hoá cát.' },
  'Lộc Thần': { good: true, meaning: 'Có lộc ăn, tài nguyên, sức khoẻ và tự chủ; Lộc ở trụ giờ (Quy lộc) chủ hậu vận an nhàn.' },
  'Dương Nhận': { good: null, meaning: 'Cương mãnh, quả quyết, dám làm; thân nhược thì giúp thân, thân vượng gặp xung dễ có huyết quang, tranh đoạt, phá tài. Cần Quan Sát chế.' },
  'Kim Dư': { good: true, meaning: 'Xe vàng – chủ phúc lộc, được người phối ngẫu tốt, đời sống sung túc.' },
  'Hồng Diễm': { good: null, meaning: 'Duyên dáng, đa tình, có sức hút khác giới; dễ vướng chuyện tình cảm.' },
  'Dịch Mã': { good: null, meaning: 'Chủ di chuyển, xa nhà, xuất ngoại, thay đổi công việc; là hỷ thì đi xa phát đạt, là kỵ thì bôn ba vất vả.' },
  'Đào Hoa': { good: null, meaning: 'Hàm trì: duyên dáng, giao tế tốt, nghệ thuật; kèm Thực Thương mạnh thì dễ đa tình (theo “Khí thế lưu thông”).' },
  'Hoa Cái': { good: null, meaning: 'Thông minh, cô độc, thích nghệ thuật – tôn giáo – huyền học; gặp Không vong thiên về tu hành.' },
  'Tướng Tinh': { good: true, meaning: 'Có khí chất lãnh đạo, uy quyền, được người phục tùng.' },
  'Kiếp Sát': { good: false, meaning: 'Chủ tai hoạ bất ngờ, hao tài, tranh chấp; là hỷ dụng thì mưu lược quyết đoán.' },
  'Vong Thần': { good: false, meaning: 'Hay toan tính, dễ thất bại vì sơ suất hoặc kiện tụng; có chế hoá thì mưu trí sâu.' },
  'Thiên Đức': { good: true, meaning: 'Phúc đức trời ban, gặp dữ hoá lành, ít tai nạn.' },
  'Nguyệt Đức': { good: true, meaning: 'Phúc đức tháng, tính hiền hoà, được che chở, gặp hung giảm hung.' },
  'Cô Thần': { good: false, meaning: 'Tính độc lập, dễ cô đơn; nam mệnh kỵ ảnh hưởng hôn nhân.' },
  'Quả Tú': { good: false, meaning: 'Tình cảm lạnh, dễ xa cách; nữ mệnh kỵ ảnh hưởng hôn nhân.' },
  'Hồng Loan': { good: true, meaning: 'Hỷ sự tình duyên, cưới hỏi; lưu niên gặp dễ có chuyện vui về tình cảm.' },
  'Thiên Hỷ': { good: true, meaning: 'Chủ tin vui, hỷ sự, sinh con, cưới hỏi.' },
  'Thiên Y': { good: true, meaning: 'Có duyên với y dược, chăm sóc sức khoẻ, tâm lý, chữa lành.' },
  'Khôi Cương': { good: null, meaning: 'Ngày Khôi Cương: thông minh, quyết đoán, cứng rắn; vượng thì đại phú quý, gặp hình xung dễ thăng trầm (Mệnh Lý Tinh Hoa: giờ ngày phạm Khôi Cương nên cưới muộn).' },
  'Kim Thần': { good: null, meaning: 'Giờ Kim Thần: cứng cỏi, uy nghiêm; cần hoả chế mới thành khí.' },
  'Thập Ác Đại Bại': { good: false, meaning: 'Ngày “Lộc nhập Không vong”: tiền tài khó tụ, dễ hao do người thân; có cát thần giải thì nhẹ.' },
  'Âm Dương Sai Thác': { good: false, meaning: 'Dễ trắc trở về hôn nhân, quan hệ thông gia, tình cảm không thuận.' },
  'Cô Loan Sát': { good: false, meaning: 'Ngày Cô Loan: hôn nhân dễ lạnh nhạt, khắc khẩu, cần vun đắp nhiều.' },
  'Không Vong': { good: null, meaning: 'Chi rơi Không vong thì việc của trụ đó (lục thân, thập thần) có danh mà ít thực; hỷ thần gặp Không là giảm phúc, kỵ thần gặp Không lại giảm hung.' },
  'Thiên La Địa Võng': { good: false, meaning: 'Dễ vướng vòng ràng buộc, kiện tụng, bệnh tật kéo dài; cần cẩn trọng pháp lý.' },
};

export function computeShenSha(stems: number[], branches: number[], posNames: string[], dayIdx = 2, monthIdx = 1, yearIdx = 0, emptyBranches: number[] = []): ShenSha[] {
  const res = new Map<string, Set<string>>();
  const add = (name: string, pos: string) => { if (!res.has(name)) res.set(name, new Set()); res.get(name)!.add(pos); };
  const dm = stems[dayIdx];
  const ys = stems[yearIdx];
  const yb = branches[yearIdx], db = branches[dayIdx], mb = branches[monthIdx];
  branches.forEach((b, i) => {
    const pos = `${posNames[i]} (${BRANCHES[b]})`;
    if (TIANYI[dm].includes(b) || TIANYI[ys].includes(b)) add('Thiên Ất Quý Nhân', pos);
    if (WENCHANG[dm] === b || WENCHANG[ys] === b) add('Văn Xương', pos);
    if (TAIJI[dm].includes(b)) add('Thái Cực Quý Nhân', pos);
    if (LU[dm] === b) add('Lộc Thần', pos);
    if (YANGREN[dm] === b) add('Dương Nhận', pos);
    if (JINYU[dm] === b) add('Kim Dư', pos);
    if (HONGYAN[dm] === b) add('Hồng Diễm', pos);
    if (i !== yearIdx || true) {
      for (const base of [yb, db]) {
        const g = TRIAD_GROUP(base);
        if (b === YIMA[g] && b !== base) add('Dịch Mã', pos);
        if (b === TAOHUA[g] && b !== base) add('Đào Hoa', pos);
        if (b === HUAGAI[g]) add('Hoa Cái', pos);
        if (b === JIANGXING[g]) add('Tướng Tinh', pos);
        if (b === JIESHA[g]) add('Kiếp Sát', pos);
        if (b === WANGSHEN[g]) add('Vong Thần', pos);
      }
    }
    const td = TIANDE[mb];
    if (td[0] === 'b' && td[1] === b) add('Thiên Đức', pos);
    const yg = TRIAD_GROUP(yb);
    const gu = [[2, 10], [5, 1], [8, 4], [11, 7]][[11, 0, 1].includes(yb) ? 0 : [2, 3, 4].includes(yb) ? 1 : [5, 6, 7].includes(yb) ? 2 : 3];
    void yg;
    if (b === gu[0] && i !== yearIdx) add('Cô Thần', pos);
    if (b === gu[1] && i !== yearIdx) add('Quả Tú', pos);
    if (HONGLUAN[yb] === b && i !== yearIdx) add('Hồng Loan', pos);
    if ((HONGLUAN[yb] + 6) % 12 === b && i !== yearIdx) add('Thiên Hỷ', pos);
    if ((mb + 11) % 12 === b && i !== monthIdx) add('Thiên Y', pos);
    if (emptyBranches.includes(b) && i !== dayIdx) add('Không Vong', pos);
  });
  stems.forEach((s, i) => {
    const pos = `${posNames[i]} (${STEMS[s]})`;
    const td = TIANDE[mb];
    if (td[0] === 's' && td[1] === s) add('Thiên Đức', pos);
    if (YUEDE_BY_GROUP[TRIAD_GROUP(mb)] === s) add('Nguyệt Đức', pos);
  });
  const dayPair = [stems[dayIdx], branches[dayIdx]];
  const eq = (p: number[]) => p[0] === dayPair[0] && p[1] === dayPair[1];
  if (KUIGANG.some(eq)) add('Khôi Cương', `${posNames[dayIdx]} (trụ ngày)`);
  if (SHIE_DABAI.some(eq)) add('Thập Ác Đại Bại', `${posNames[dayIdx]} (trụ ngày)`);
  if (YINYANG_CUO.some(eq)) add('Âm Dương Sai Thác', `${posNames[dayIdx]} (trụ ngày)`);
  if (GULUAN.some(eq)) add('Cô Loan Sát', `${posNames[dayIdx]} (trụ ngày)`);
  if (stems.length > 3 && (dm === 0 || dm === 5)) {
    const hs = stems[3], hb = branches[3];
    if ((hs === 1 && hb === 1) || (hs === 5 && hb === 5) || (hs === 9 && hb === 9)) add('Kim Thần', `${posNames[3]} (trụ giờ)`);
  }
  const hasTL = branches.includes(10) && branches.includes(11);
  const hasDW = branches.includes(4) && branches.includes(5);
  if (hasTL) add('Thiên La Địa Võng', 'Tuất – Hợi (Thiên La)');
  if (hasDW) add('Thiên La Địa Võng', 'Thìn – Tị (Địa Võng)');

  const order = Object.keys(SHENSHA_MEANING);
  return [...res.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([name, pos]) => ({ name, positions: [...pos], good: SHENSHA_MEANING[name]?.good ?? null, meaning: SHENSHA_MEANING[name]?.meaning ?? '' }));
}
