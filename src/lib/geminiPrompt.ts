// Câu lệnh mẫu để người dùng gửi kèm ảnh lá số cho Gemini (hoặc AI khác), nhờ chuyển ảnh thành văn bản đúng định dạng web đọc được.
export const TUVI_VN_BATTU_URL = 'https://tuvi.vn/lap-la-so-bat-tu-tu-tru';
export const GEMINI_URL = 'https://gemini.google.com/app';

export function buildGeminiPrompt(year: number = new Date().getFullYear()): string {
  return `Chuyển ảnh lá số đính kèm thành VĂN BẢN THUẦN theo đúng mẫu bên dưới.
Yêu cầu:
- Chỉ chép lại thông tin có trong ảnh. KHÔNG luận giải, KHÔNG thêm lời bình.
- Viết tiếng Việt có dấu, giữ nguyên tên can chi và tên sao.
- Giữ nguyên các dòng tiêu đề dạng === ... === và các nhãn trước dấu hai chấm.
- Không dùng in đậm, không gạch đầu dòng, không bảng. Đặt toàn bộ kết quả trong một khối code để dễ sao chép.
- Mục nào ảnh không có thì bỏ qua cả mục đó (ví dụ không có ảnh Tử Vi thì bỏ phần LÁ SỐ TỬ VI).
- Dòng đầu tiên ghi năm xem ${year} và tuổi âm của người này trong năm ${year}.

MẪU:
(năm xem ${year}, [tuổi âm] tuổi)

=== THÔNG TIN CHUNG ===
Họ tên: [họ tên]
Giới tính: [Nam hoặc Nữ]
Dương lịch: [dd/mm/yyyy], [hh:mm]
Âm lịch: [ngày tháng năm âm lịch, giờ]
Tứ trụ: [Can Chi] (năm) - [Can Chi] (tháng) - [Can Chi] (ngày) - [Can Chi] (giờ)

=== BÁT TỰ TỨ TRỤ ===
Khởi vận: [ngày khởi vận] ([số] tuổi)
Trụ năm: [Can Chi], Nạp âm [..], Thập thần: [..], Tàng can: [..], Trường sinh: [..]
Trụ tháng: [Can Chi], Nạp âm [..], Thập thần: [..], Tàng can: [..], Trường sinh: [..]
Trụ ngày: [Can Chi], Nạp âm [..], Nhật chủ, Tàng can: [..], Trường sinh: [..]
Trụ giờ: [Can Chi], Nạp âm [..], Thập thần: [..], Tàng can: [..], Trường sinh: [..]

Đại vận (mỗi vận 10 năm):
[Can Chi] [tuổi bắt đầu]-[tuổi kết thúc] tuổi ([năm bắt đầu])
(liệt kê đủ các đại vận có trong ảnh, mỗi vận một dòng)

Lưu niên:
[Can Chi] [tuổi] tuổi ([năm])
(nếu ảnh có; thêm " - NĂM XEM" vào cuối dòng của năm ${year})

=== LÁ SỐ TỬ VI ===
Bản mệnh: [..]
Cục: [..]
1. MỆNH ([địa chi]), đại hạn [tuổi]
Chính tinh: [tên sao] ([M/V/Đ/B/H]), ...  (ghi "không có" nếu trống)
Phụ tinh: [tên sao], ...
Lưu ${year}: [các sao lưu niên nếu có]
Tràng sinh: [..]
(lặp lại cho đủ 12 cung: MỆNH, PHỤ MẪU, PHÚC ĐỨC, ĐIỀN TRẠCH, QUAN LỘC, NÔ BỘC, THIÊN DI, TẬT ÁCH, TÀI BẠCH, TỬ TỨC, PHU THÊ, HUYNH ĐỆ)`;
}
