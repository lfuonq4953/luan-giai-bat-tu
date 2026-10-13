// Dựng cấu trúc lá số từ tứ trụ đã có (đọc từ văn bản) – không tự an sao theo ngày giờ sinh.
import {
  STEMS, BRANCHES, HIDDEN_STEMS, nayinOf, lifeStage, tenGod, stemYang, TenGod, ganzhiName, LIFE_STAGES, sexagenaryIndex,
} from './constants';

export type Gender = 'nam' | 'nu';
export interface GanZhi { stem: number; branch: number }

/** Dữ liệu tối thiểu cần có (đọc từ văn bản lá số hoặc nhập tay) */
export interface ChartInput {
  name?: string;
  gender: Gender;
  pillars: GanZhi[];                 // [năm, tháng, ngày, giờ?]
  solarBirth?: string;               // "04/10/2005 00:00" – chỉ để hiển thị
  lunarBirth?: string;               // "Giờ Tý, ngày 2 tháng 9, năm Ất Dậu"
  birthYear?: number;                // năm dương lịch sinh – để tính tuổi lưu niên
  luckStartAge?: number;             // tuổi khởi vận (theo lá số gốc)
  luckStartText?: string;            // "22/06/2014 (8 tuổi)"
  luckStartYear?: number;            // năm khởi vận (nếu biết)
  luck?: { stem: number; branch: number; startAge?: number; startYear?: number }[]; // đại vận đọc từ lá số gốc
  referenceYear?: number;            // năm xem
  source?: string;                   // ghi chú nguồn (vd: tuvi.vn)
}

export interface HiddenStem { stem: number; weight: number; god: TenGod }
export interface Pillar {
  key: 'year' | 'month' | 'day' | 'hour';
  label: string;
  stem: number; branch: number;
  stemGod: TenGod | 'Nhật Chủ';
  hidden: HiddenStem[];
  nayin: string;
  stage: string;      // trường sinh của nhật chủ tại chi này
  selfStage: string;  // can trụ tại chính chi của nó
  empty: boolean;     // rơi Không vong (theo trụ ngày)
}
export interface LuckPillar {
  index: number; stem: number; branch: number; startAge: number | null; startYear: number | null; endYear: number | null;
  nayin: string; stemGod: TenGod; branchGod: TenGod;
}
export interface ChartData {
  input: ChartInput;
  pillars: Pillar[];
  dayMaster: number;
  forward: boolean;
  luck: LuckPillar[];
  emptyBranches: number[];
  yearEmptyBranches: number[];
  taiYuan: GanZhi;
  mingGong: GanZhi | null;
  referenceYear: number;
  warnings: string[];
}

export function emptyOf(stem: number, branch: number): number[] {
  const idx = sexagenaryIndex(stem, branch);
  const xunStart = idx - (idx % 10);
  const sb = xunStart % 12;
  return [(sb + 10) % 12, (sb + 11) % 12];
}
export const yearPillar = (year: number): GanZhi => ({ stem: ((year - 4) % 10 + 10) % 10, branch: ((year - 4) % 12 + 12) % 12 });
export const pillarName = (p: GanZhi) => ganzhiName(p.stem, p.branch);

const LABELS: [Pillar['key'], string][] = [['year', 'Năm'], ['month', 'Tháng'], ['day', 'Ngày'], ['hour', 'Giờ']];

export function buildChart(input: ChartInput): ChartData {
  const warnings: string[] = [];
  const ps = input.pillars.slice(0, 4);
  if (ps.length < 3) throw new Error('Cần ít nhất trụ năm, tháng, ngày.');
  for (const p of ps) if (sexagenaryIndex(p.stem, p.branch) < 0) throw new Error(`Can chi không hợp lệ: ${STEMS[p.stem]} ${BRANCHES[p.branch]} (can dương phải đi với chi dương).`);
  const [y, m, d] = ps;
  // Kiểm tra quy tắc Ngũ hổ độn (can tháng theo can năm) và Ngũ thử độn (can giờ theo can ngày)
  const expMonthStem = ((y.stem % 5) * 2 + 2 + ((m.branch - 2 + 12) % 12)) % 10;
  if (expMonthStem !== m.stem) warnings.push(`Can tháng ${STEMS[m.stem]} không khớp quy tắc Ngũ hổ độn (năm ${STEMS[y.stem]} tháng ${BRANCHES[m.branch]} phải là ${STEMS[expMonthStem]}). Hãy kiểm tra lại lá số gốc.`);
  if (ps[3]) {
    const expHourStem = ((d.stem % 5) * 2 + ps[3].branch) % 10;
    if (expHourStem !== ps[3].stem) warnings.push(`Can giờ ${STEMS[ps[3].stem]} không khớp quy tắc Ngũ thử độn (ngày ${STEMS[d.stem]} giờ ${BRANCHES[ps[3].branch]} thường là ${STEMS[expHourStem]}; có thể lá số dùng giờ Tý muộn).`);
  }
  const dm = d.stem;
  const empty = emptyOf(d.stem, d.branch);
  const pillars: Pillar[] = ps.map((p, i) => ({
    key: LABELS[i][0], label: LABELS[i][1], stem: p.stem, branch: p.branch,
    stemGod: i === 2 ? 'Nhật Chủ' : tenGod(dm, p.stem),
    hidden: HIDDEN_STEMS[p.branch].map(([hs, w]) => ({ stem: hs, weight: w, god: tenGod(dm, hs) })),
    nayin: nayinOf(p.stem, p.branch),
    stage: LIFE_STAGES[lifeStage(dm, p.branch)],
    selfStage: LIFE_STAGES[lifeStage(p.stem, p.branch)],
    empty: i !== 2 && empty.includes(p.branch),
  }));

  // Đại vận: ưu tiên dữ liệu trên lá số gốc; nếu thiếu thì suy từ trụ tháng (Dương nam/Âm nữ thuận, ngược lại nghịch)
  const forward = (stemYang(y.stem) && input.gender === 'nam') || (!stemYang(y.stem) && input.gender === 'nu');
  const birthYear = input.birthYear ?? null;
  let luck: LuckPillar[] = [];
  const startAge0 = input.luck?.[0]?.startAge ?? input.luckStartAge ?? null;
  const startYear0 = input.luck?.[0]?.startYear ?? input.luckStartYear ?? (birthYear !== null && startAge0 !== null ? birthYear + startAge0 : null);
  for (let i = 1; i <= 10; i++) {
    const fromImg = input.luck?.[i - 1];
    const stem = fromImg?.stem ?? ((m.stem + (forward ? i : -i)) % 10 + 10) % 10;
    const branch = fromImg?.branch ?? ((m.branch + (forward ? i : -i)) % 12 + 12) % 12;
    const startAge = fromImg?.startAge ?? (startAge0 !== null ? startAge0 + (i - 1) * 10 : null);
    const startYear = fromImg?.startYear ?? (startYear0 !== null ? startYear0 + (i - 1) * 10 : null);
    luck.push({
      index: i, stem, branch, startAge, startYear, endYear: startYear !== null ? startYear + 9 : null,
      nayin: nayinOf(stem, branch), stemGod: tenGod(dm, stem), branchGod: tenGod(dm, HIDDEN_STEMS[branch][0][0]),
    });
  }
  if (input.luck?.length) {
    const exp = ((m.stem + (forward ? 1 : -1)) % 10 + 10) % 10;
    if (input.luck[0].stem !== exp) warnings.push(`Đại vận đầu tiên trên lá số (${pillarName(input.luck[0])}) khác chiều ${forward ? 'thuận' : 'nghịch'} theo giới tính – kiểm tra lại giới tính.`);
  }
  luck = luck.filter((l) => !Number.isNaN(l.stem));

  const taiYuan = { stem: (m.stem + 1) % 10, branch: (m.branch + 3) % 12 };
  let mingGong: GanZhi | null = null;
  if (ps[3]) {
    const mNum = ((m.branch - 2 + 12) % 12) + 1;
    const hNum = ((ps[3].branch - 2 + 12) % 12) + 1;
    const off = mNum + hNum;
    const mg = (off >= 14 ? 26 : 14) - off;
    mingGong = { stem: ((y.stem % 5) * 2 + 2 + (mg - 1)) % 10, branch: (mg + 1) % 12 };
  }
  return {
    input, pillars, dayMaster: dm, forward, luck,
    emptyBranches: empty, yearEmptyBranches: emptyOf(y.stem, y.branch),
    taiYuan, mingGong,
    referenceYear: input.referenceYear ?? new Date().getFullYear(),
    warnings,
  };
}
