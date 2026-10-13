// Đọc văn bản lá số (định dạng "=== THÔNG TIN CHUNG === / === LÁ SỐ TỬ VI === / === BÁT TỰ TỨ TRỤ ===")
// thành dữ liệu có cấu trúc. Thuần quy tắc – không cần AI.
import type { ChartInput } from './battu/chart';
import type { Palace, Star, TuViData, Brightness } from './tuvi/types';
import { parseGanZhi, BRANCH_ALIASES } from './ganzhi';

export interface ParsedText {
  bazi: ChartInput | null;
  tuvi: TuViData | null;
  request: string;          // câu yêu cầu đầu văn bản (nếu có)
  currentAge: number | null;
  warnings: string[];
}

const norm = (s: string) => s.normalize('NFC');
const lower = (s: string) => norm(s).toLowerCase();

function field(text: string, label: string): string | undefined {
  const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, 'imu');
  const m = text.match(re);
  return m ? m[1].trim() : undefined;
}

function branchOf(word: string): number | undefined {
  return BRANCH_ALIASES[lower(word).trim()];
}

function parseStars(s: string | undefined): Star[] {
  if (!s || /^không có/i.test(s.trim())) return [];
  return s.split(/[,;]/).map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^(.+?)\s*\(([MVĐBH])\)\s*$/u);
    return m ? { name: m[1].trim(), bright: m[2] as Brightness } : { name: x.replace(/\.$/, '').trim() };
  });
}

const PALACE_NAMES: Record<string, string> = {
  'mệnh': 'Mệnh', 'phụ mẫu': 'Phụ Mẫu', 'phúc đức': 'Phúc Đức', 'điền trạch': 'Điền Trạch', 'quan lộc': 'Quan Lộc', 'nô bộc': 'Nô Bộc',
  'thiên di': 'Thiên Di', 'tật ách': 'Tật Ách', 'tài bạch': 'Tài Bạch', 'tử tức': 'Tử Tức', 'phu thê': 'Phu Thê', 'huynh đệ': 'Huynh Đệ',
};

function parseTuVi(block: string): TuViData | null {
  const palaces: Palace[] = [];
  const lines = block.split('\n');
  let cur: Palace | null = null;
  for (const raw of lines) {
    const line = norm(raw).trim();
    const h = line.match(/^(\d{1,2})\.\s*([^\(]+?)\s*\(([^)]+)\)\s*(?:,\s*đại hạn\s*(\d+))?(.*)$/iu);
    if (h && PALACE_NAMES[lower(h[2])]) {
      cur = {
        order: +h[1], name: PALACE_NAMES[lower(h[2])], branch: branchOf(h[3]) ?? -1, daiHan: h[4] ? +h[4] : null,
        isThan: /cung thân/i.test(h[5] ?? ''), major: [], minor: [], yearly: [], stage: '',
      };
      palaces.push(cur);
      continue;
    }
    if (!cur) continue;
    const kv = line.match(/^([^:]+):\s*(.*)$/u);
    if (!kv) continue;
    const key = lower(kv[1]);
    if (key.startsWith('chính tinh')) cur.major = parseStars(kv[2]);
    else if (key.startsWith('phụ tinh')) cur.minor = parseStars(kv[2]);
    else if (key.startsWith('lưu')) cur.yearly = kv[2].split(',').map((x) => x.trim()).filter(Boolean);
    else if (key.startsWith('tràng sinh') || key.startsWith('trường sinh')) cur.stage = kv[2].trim();
  }
  if (!palaces.length) return null;
  const luu = block.match(/Lưu Mệnh năm \d{4} an tại\s+(\S+)/iu);
  return {
    banMenh: field(block, 'Bản mệnh'), cuc: field(block, 'Cục'), canLuong: field(block, 'Cân lượng'),
    chuMenh: field(block, 'Chủ mệnh'), chuThan: field(block, 'Chủ thân'), laiNhan: field(block, 'Lai nhân cung'), thanCu: field(block, 'Thân cư'),
    palaces,
    tuHoa: block.match(/^\s*Tứ Hóa[^:]*:\s*(.+)$/imu)?.[1]?.trim(),
    luuMenhBranch: luu ? branchOf(luu[1].replace(/[^\p{L}]/gu, '')) : undefined,
    tuanTriet: block.match(/^.*Tuần\s*-\s*Triệt.*$/imu)?.[0]?.trim(),
  };
}

function section(text: string, name: RegExp): string {
  const parts = text.split(/^\s*===\s*(.+?)\s*===\s*$/mu);
  // parts: [trước, tiêu đề1, nội dung1, tiêu đề2, nội dung2…]
  for (let i = 1; i < parts.length; i += 2) if (name.test(parts[i])) return parts[i + 1] ?? '';
  return '';
}

export function parseChartText(input: string): ParsedText {
  const text = norm(input).replace(/\r/g, '');
  const warnings: string[] = [];
  const hasSections = /===/.test(text);
  const general = hasSections ? section(text, /THÔNG TIN/i) : text;
  const tuviBlock = hasSections ? section(text, /TỬ VI/i) : '';
  const baziBlock = hasSections ? section(text, /BÁT TỰ|TỨ TRỤ/i) : text;
  const all = text;

  const request = hasSections ? text.split(/^\s*===/mu)[0].trim() : '';

  // ---- Năm xem & tuổi
  let referenceYear: number | undefined;
  let currentAge: number | null = null;
  const nx = all.match(/năm xem\s*:?\s*(\d{4})/iu);
  if (nx) referenceYear = +nx[1];
  const ag = all.match(/năm xem[^)\n]*?(\d{1,3})\s*tuổi/iu);
  if (ag) currentAge = +ag[1];
  const lnMark = all.match(/^\s*\S+\s+\S+\s+(\d{1,3})\s*tuổi\s*\((\d{4})\)\s*-\s*NĂM XEM/imu);
  if (lnMark) { referenceYear ??= +lnMark[2]; currentAge ??= +lnMark[1]; }

  // ---- Giới tính
  const gt = lower(field(general, 'Giới tính') ?? field(all, 'Giới tính') ?? '');
  const gender = /nữ|khôn/.test(gt) ? 'nu' : /nam|càn/.test(gt) ? 'nam' : undefined;
  if (!gender) warnings.push('Không thấy giới tính – mặc định Nam. Hãy sửa nếu sai.');

  // ---- Tứ trụ
  let pillars: ({ stem: number; branch: number } | null)[] = [null, null, null, null];
  const tt = field(general, 'Tứ trụ') ?? field(all, 'Tứ trụ');
  if (tt) {
    const segs = tt.split(/\s+-\s+|,|\|/);
    segs.forEach((seg) => {
      const gz = parseGanZhi(seg);
      if (!gz) return;
      const l = lower(seg);
      const idx = l.includes('năm') ? 0 : l.includes('tháng') ? 1 : l.includes('ngày') ? 2 : l.includes('giờ') ? 3 : pillars.findIndex((p) => p === null);
      if (idx >= 0) pillars[idx] = gz;
    });
  }
  (['năm', 'tháng', 'ngày', 'giờ'] as const).forEach((k, i) => {
    if (pillars[i]) return;
    const v = field(baziBlock, `Trụ ${k}`);
    if (v) pillars[i] = parseGanZhi(v.split(',')[0]);
  });
  if (!pillars[0] || !pillars[1] || !pillars[2]) warnings.push('Không đọc đủ tứ trụ (năm, tháng, ngày) – hãy kiểm tra dòng "Tứ trụ:".');
  if (!pillars[3]) pillars = pillars.slice(0, 3);

  // ---- Ngày sinh
  const solar = field(general, 'Dương lịch');
  const lunar = field(general, 'Âm lịch');
  const birthYear = solar?.match(/\b(1[89]\d{2}|20\d{2})\b/)?.[1];

  // ---- Đại vận
  const luck: NonNullable<ChartInput['luck']> = [];
  const luckRe = /^\s*(\S+\s+\S+)\s+(\d{1,3})\s*-\s*\d{1,3}\s*tuổi\s*\((\d{4})\)/gimu;
  let m: RegExpExecArray | null;
  while ((m = luckRe.exec(baziBlock))) {
    const gz = parseGanZhi(m[1]);
    if (gz) luck.push({ ...gz, startAge: +m[2], startYear: +m[3] });
  }
  const ks = field(baziBlock, 'Khởi vận');

  const bazi: ChartInput | null = pillars.length >= 3 && pillars.slice(0, 3).every(Boolean) ? {
    name: field(general, 'Họ tên') ?? field(all, 'Họ tên'),
    gender: (gender ?? 'nam') as 'nam' | 'nu',
    pillars: pillars as { stem: number; branch: number }[],
    solarBirth: solar, lunarBirth: lunar,
    birthYear: birthYear ? +birthYear : undefined,
    luckStartText: ks,
    luckStartAge: luck[0]?.startAge ?? (ks?.match(/\((\d+)\s*tuổi\)/)?.[1] ? +ks!.match(/\((\d+)\s*tuổi\)/)![1] : undefined),
    luck: luck.length ? luck : undefined,
    referenceYear: referenceYear ?? new Date().getFullYear(),
    source: 'Văn bản lá số',
  } : null;

  const tuvi = tuviBlock ? parseTuVi(tuviBlock) : null;
  if (tuviBlock && (!tuvi || tuvi.palaces.length < 12)) warnings.push(`Phần Tử Vi chỉ đọc được ${tuvi?.palaces.length ?? 0}/12 cung.`);

  return { bazi, tuvi, request, currentAge, warnings };
}
