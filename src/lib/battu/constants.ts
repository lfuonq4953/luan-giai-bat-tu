// Hằng số nền tảng của Bát Tự (Tứ Trụ / Tử Bình)
// Nguồn: Thiên Lý Mệnh Cảo (chương Thiên can, Địa chi, Nhân nguyên), Tử Bình Chân Thuyên (chương 1–3)

export type Element = 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy';
export const ELEMENTS: Element[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

export const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export const STEMS_HAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const ZODIAC = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];

export const STEM_ELEMENT: Element[] = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
export const BRANCH_ELEMENT: Element[] = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
export const stemYang = (s: number) => s % 2 === 0;
export const branchYang = (b: number) => b % 2 === 0;

/** Ngũ hành: index trong ELEMENTS. sinh: i -> (i+1)%5 ; khắc: i -> (i+2)%5 */
export const elIdx = (e: Element) => ELEMENTS.indexOf(e);
export const generates = (e: Element): Element => ELEMENTS[(elIdx(e) + 1) % 5];
export const generatedBy = (e: Element): Element => ELEMENTS[(elIdx(e) + 4) % 5];
export const controls = (e: Element): Element => ELEMENTS[(elIdx(e) + 2) % 5];
export const controlledBy = (e: Element): Element => ELEMENTS[(elIdx(e) + 3) % 5];

/** Tàng can (Nhân nguyên): [can, tỉ trọng]. Bản khí đứng đầu. */
export const HIDDEN_STEMS: [number, number][][] = [
  [[9, 1.0]],                       // Tý: Quý
  [[5, 0.6], [9, 0.3], [7, 0.1]],   // Sửu: Kỷ Quý Tân
  [[0, 0.6], [2, 0.3], [4, 0.1]],   // Dần: Giáp Bính Mậu
  [[1, 1.0]],                       // Mão: Ất
  [[4, 0.6], [1, 0.3], [9, 0.1]],   // Thìn: Mậu Ất Quý
  [[2, 0.6], [4, 0.3], [6, 0.1]],   // Tị: Bính Mậu Canh
  [[3, 0.7], [5, 0.3]],             // Ngọ: Đinh Kỷ
  [[5, 0.6], [3, 0.3], [1, 0.1]],   // Mùi: Kỷ Đinh Ất
  [[6, 0.6], [8, 0.3], [4, 0.1]],   // Thân: Canh Nhâm Mậu
  [[7, 1.0]],                       // Dậu: Tân
  [[4, 0.6], [7, 0.3], [3, 0.1]],   // Tuất: Mậu Tân Đinh
  [[8, 0.7], [0, 0.3]],             // Hợi: Nhâm Giáp
];

/** Nhân nguyên tư lệnh (số ngày kể từ tiết) – dùng để biết can nào "dụng sự" trong tháng */
export const COMMANDER_DAYS: [number, number][][] = [
  [[8, 10], [9, 20]],              // Tý: Nhâm 10, Quý 20
  [[9, 9], [7, 3], [5, 18]],       // Sửu: Quý 9, Tân 3, Kỷ 18
  [[4, 7], [2, 7], [0, 16]],       // Dần: Mậu 7, Bính 7, Giáp 16
  [[0, 10], [1, 20]],              // Mão: Giáp 10, Ất 20
  [[1, 9], [9, 3], [4, 18]],       // Thìn: Ất 9, Quý 3, Mậu 18
  [[4, 5], [6, 9], [2, 16]],       // Tị: Mậu 5, Canh 9, Bính 16
  [[2, 10], [5, 9], [3, 11]],      // Ngọ: Bính 10, Kỷ 9, Đinh 11
  [[3, 9], [1, 3], [5, 18]],       // Mùi: Đinh 9, Ất 3, Kỷ 18
  [[5, 7], [4, 3], [8, 3], [6, 17]], // Thân: Kỷ 7, Mậu 3, Nhâm 3, Canh 17
  [[6, 10], [7, 20]],              // Dậu: Canh 10, Tân 20
  [[7, 9], [3, 3], [4, 18]],       // Tuất: Tân 9, Đinh 3, Mậu 18
  [[4, 7], [0, 5], [8, 18]],       // Hợi: Mậu 7, Giáp 5, Nhâm 18
];

/** Vòng Trường sinh 12 cung */
export const LIFE_STAGES = ['Trường sinh', 'Mộc dục', 'Quan đới', 'Lâm quan', 'Đế vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
// chi Trường sinh của từng can (dương thuận, âm nghịch)
const CHANGSHENG_START = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];
export function lifeStage(stem: number, branch: number): number {
  const start = CHANGSHENG_START[stem];
  return stemYang(stem) ? (branch - start + 12) % 12 : (start - branch + 12) % 12;
}
/** Điểm sinh khí theo vòng trường sinh (dùng cho thông căn) */
export const LIFE_STAGE_STRENGTH = [0.8, 0.6, 0.7, 1.0, 1.0, 0.5, 0.35, 0.25, 0.45, 0.15, 0.2, 0.35];

/** Nạp âm 30 cặp */
export const NAYIN = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phúc Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];
export const NAYIN_MEANING: Record<string, string> = {
  'Hải Trung Kim': 'vàng trong biển', 'Lư Trung Hỏa': 'lửa trong lò', 'Đại Lâm Mộc': 'gỗ rừng già',
  'Lộ Bàng Thổ': 'đất ven đường', 'Kiếm Phong Kim': 'vàng mũi kiếm', 'Sơn Đầu Hỏa': 'lửa trên núi',
  'Giản Hạ Thủy': 'nước khe suối', 'Thành Đầu Thổ': 'đất đầu thành', 'Bạch Lạp Kim': 'vàng chân đèn',
  'Dương Liễu Mộc': 'gỗ dương liễu', 'Tuyền Trung Thủy': 'nước giữa suối', 'Ốc Thượng Thổ': 'đất mái nhà',
  'Tích Lịch Hỏa': 'lửa sấm sét', 'Tùng Bách Mộc': 'gỗ tùng bách', 'Trường Lưu Thủy': 'nước chảy dài',
  'Sa Trung Kim': 'vàng trong cát', 'Sơn Hạ Hỏa': 'lửa dưới núi', 'Bình Địa Mộc': 'cây đồng bằng',
  'Bích Thượng Thổ': 'đất trên vách', 'Kim Bạch Kim': 'vàng bạch kim', 'Phúc Đăng Hỏa': 'lửa đèn dầu',
  'Thiên Hà Thủy': 'nước sông trời', 'Đại Dịch Thổ': 'đất bãi lớn', 'Thoa Xuyến Kim': 'vàng trang sức',
  'Tang Đố Mộc': 'gỗ cây dâu', 'Đại Khê Thủy': 'nước khe lớn', 'Sa Trung Thổ': 'đất trong cát',
  'Thiên Thượng Hỏa': 'lửa trên trời', 'Thạch Lựu Mộc': 'gỗ thạch lựu', 'Đại Hải Thủy': 'nước biển lớn',
};
export const nayinOf = (stem: number, branch: number) => NAYIN[Math.floor(sexagenaryIndex(stem, branch) / 2)];
export const nayinElement = (name: string): Element => {
  for (const e of ELEMENTS) if (name.endsWith(e)) return e;
  return 'Thổ';
};

/** Chỉ số Lục thập hoa giáp (0 = Giáp Tý) */
export function sexagenaryIndex(stem: number, branch: number): number {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i;
  return -1;
}
export const ganzhiName = (stem: number, branch: number) => `${STEMS[stem]} ${BRANCHES[branch]}`;

/** Thập thần */
export type TenGod = 'Tỷ Kiên' | 'Kiếp Tài' | 'Thực Thần' | 'Thương Quan' | 'Thiên Tài' | 'Chính Tài' | 'Thất Sát' | 'Chính Quan' | 'Thiên Ấn' | 'Chính Ấn';
export const TEN_GODS: TenGod[] = ['Tỷ Kiên', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Thiên Tài', 'Chính Tài', 'Thất Sát', 'Chính Quan', 'Thiên Ấn', 'Chính Ấn'];
export const TEN_GOD_SHORT: Record<TenGod, string> = {
  'Tỷ Kiên': 'Tỷ', 'Kiếp Tài': 'Kiếp', 'Thực Thần': 'Thực', 'Thương Quan': 'Thương', 'Thiên Tài': 'T.Tài',
  'Chính Tài': 'C.Tài', 'Thất Sát': 'Sát', 'Chính Quan': 'Quan', 'Thiên Ấn': 'Kiêu', 'Chính Ấn': 'Ấn',
};
export type GodGroup = 'Tỷ Kiếp' | 'Thực Thương' | 'Tài' | 'Quan Sát' | 'Ấn';
export const GOD_GROUPS: GodGroup[] = ['Tỷ Kiếp', 'Thực Thương', 'Tài', 'Quan Sát', 'Ấn'];
export function tenGod(dayStem: number, other: number): TenGod {
  const d = elIdx(STEM_ELEMENT[dayStem]);
  const o = elIdx(STEM_ELEMENT[other]);
  const rel = (o - d + 5) % 5; // 0 cùng, 1 ta sinh, 2 ta khắc, 3 khắc ta, 4 sinh ta
  const same = stemYang(dayStem) === stemYang(other);
  switch (rel) {
    case 0: return same ? 'Tỷ Kiên' : 'Kiếp Tài';
    case 1: return same ? 'Thực Thần' : 'Thương Quan';
    case 2: return same ? 'Thiên Tài' : 'Chính Tài';
    case 3: return same ? 'Thất Sát' : 'Chính Quan';
    default: return same ? 'Thiên Ấn' : 'Chính Ấn';
  }
}
export function godGroupOf(g: TenGod): GodGroup {
  const i = TEN_GODS.indexOf(g);
  return GOD_GROUPS[Math.floor(i / 2)];
}
/** Ngũ hành tương ứng nhóm thập thần của nhật chủ */
export function groupElement(dayEl: Element, g: GodGroup): Element {
  const k = GOD_GROUPS.indexOf(g); // 0 cùng,1 ta sinh,2 ta khắc,3 khắc ta,4 sinh ta
  return ELEMENTS[(elIdx(dayEl) + k) % 5];
}
export function elementGroup(dayEl: Element, e: Element): GodGroup {
  return GOD_GROUPS[(elIdx(e) - elIdx(dayEl) + 5) % 5];
}

/** Mùa theo chi tháng */
export type Season = 'Xuân' | 'Hạ' | 'Thu' | 'Đông';
export function seasonOfMonthBranch(b: number): Season {
  if (b === 2 || b === 3 || b === 4) return 'Xuân';
  if (b === 5 || b === 6 || b === 7) return 'Hạ';
  if (b === 8 || b === 9 || b === 10) return 'Thu';
  return 'Đông';
}

/** Vượng – Tướng – Hưu – Tù – Tử theo chi tháng */
export type SeasonState = 'Vượng' | 'Tướng' | 'Hưu' | 'Tù' | 'Tử';
export function seasonalState(el: Element, monthBranch: number): SeasonState {
  // Hành đương lệnh: Dần Mão Mộc; Tị Ngọ Hỏa; Thân Dậu Kim; Hợi Tý Thủy; Thìn Tuất Sửu Mùi Thổ
  const ruling: Element = [1, 4, 7, 10].includes(monthBranch) ? 'Thổ' : BRANCH_ELEMENT[monthBranch];
  const rel = (elIdx(el) - elIdx(ruling) + 5) % 5;
  // cùng = Vượng; được hành lệnh sinh = Tướng; sinh hành lệnh = Hưu; khắc hành lệnh = Tù; bị khắc = Tử
  return (['Vượng', 'Tướng', 'Tử', 'Tù', 'Hưu'] as SeasonState[])[rel];
}
export const SEASON_FACTOR: Record<SeasonState, number> = { 'Vượng': 1.35, 'Tướng': 1.15, 'Hưu': 0.92, 'Tù': 0.82, 'Tử': 0.72 };

/** Lộc (Lâm quan) và Dương nhận theo can */
export const LU_BRANCH = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
export const YANGREN_BRANCH: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };

/** Màu ngũ hành dùng cho giao diện */
export const ELEMENT_COLOR: Record<Element, string> = {
  'Mộc': '#2f8f4e', 'Hỏa': '#c8372d', 'Thổ': '#a8742a', 'Kim': '#7a808a', 'Thủy': '#2563a8',
};

export const SOLAR_TERMS = [
  'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng', 'Hạ Chí', 'Tiểu Thử', 'Đại Thử',
  'Lập Thu', 'Xử Thử', 'Bạch Lộ', 'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
  'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập',
]; // index k ứng với kinh độ mặt trời 15*k độ
/** 12 "Tiết" mở đầu tháng (chi Dần..Sửu) và kinh độ mặt trời */
export const MONTH_JIE = [
  { branch: 2, name: 'Lập Xuân', lon: 315 }, { branch: 3, name: 'Kinh Trập', lon: 345 },
  { branch: 4, name: 'Thanh Minh', lon: 15 }, { branch: 5, name: 'Lập Hạ', lon: 45 },
  { branch: 6, name: 'Mang Chủng', lon: 75 }, { branch: 7, name: 'Tiểu Thử', lon: 105 },
  { branch: 8, name: 'Lập Thu', lon: 135 }, { branch: 9, name: 'Bạch Lộ', lon: 165 },
  { branch: 10, name: 'Hàn Lộ', lon: 195 }, { branch: 11, name: 'Lập Đông', lon: 225 },
  { branch: 0, name: 'Đại Tuyết', lon: 255 }, { branch: 1, name: 'Tiểu Hàn', lon: 285 },
];

export const HOUR_NAMES = ['Tý (23–1h)', 'Sửu (1–3h)', 'Dần (3–5h)', 'Mão (5–7h)', 'Thìn (7–9h)', 'Tị (9–11h)', 'Ngọ (11–13h)', 'Mùi (13–15h)', 'Thân (15–17h)', 'Dậu (17–19h)', 'Tuất (19–21h)', 'Hợi (21–23h)'];
