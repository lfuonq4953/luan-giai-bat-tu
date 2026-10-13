export type Brightness = 'M' | 'V' | 'Đ' | 'B' | 'H';
export interface Star { name: string; bright?: Brightness }
export interface Palace {
  order: number;               // 1..12 theo văn bản
  name: string;                // Mệnh, Phụ Mẫu, …
  branch: number;              // 0 = Tý … 11 = Hợi
  daiHan: number | null;       // tuổi bắt đầu đại hạn
  isThan: boolean;             // cung an Thân
  major: Star[];
  minor: Star[];
  yearly: string[];            // sao lưu năm xem (L.…)
  stage: string;               // tràng sinh
}
export interface TuViData {
  banMenh?: string; cuc?: string; canLuong?: string; chuMenh?: string; chuThan?: string; laiNhan?: string; thanCu?: string;
  palaces: Palace[];
  tuHoa?: string;
  luuMenhBranch?: number;
  tuanTriet?: string;
}
