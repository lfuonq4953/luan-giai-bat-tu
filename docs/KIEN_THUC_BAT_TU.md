# Tổng hợp kiến thức Bát Tự dùng trong engine luận giải

Tài liệu này ghi lại những gì đã học từ thư mục `TaiLieu` và cách mỗi phần được chuyển thành quy tắc trong code (`src/lib/battu`).

## 1. Nguồn tài liệu và vai trò

| Tài liệu | Dùng cho |
|---|---|
| **Thiên Lý Mệnh Cảo** (Vi Thiên Lý) | Xương sống hệ quy tắc: thiên can/địa chi, nhân nguyên, 6 dạng cường–nhược mỗi hành, hỷ kỵ 4 mùa, phép lấy Bát cách theo từng can × tháng, thành/bại/thái quá/bất cập, bảng "Dụng thần Bát cách", Ngoại cách, Vận hạn, Lưu niên, Lục thân, Nữ mệnh, Phú – Quý |
| **Tử Bình Chân Thuyên** (Từ Nhạc Ngô bình chú, bản 5 cuốn + bổ sung) | Lý luận dụng thần thành bại cứu ứng, thuần tạp, cao thấp; **Bát Tự Dụng Thần Đề Yếu** (120 tiết: 10 can × 12 tháng – thường lý & biến lý); **Tử Bình Bệnh Nguyên Sinh Tử** (bản đồ tạng phủ, các dấu hiệu bệnh) |
| **Trích Thiên Tủy** (Nhậm Thiết Tiều bình chú) | Tính chất 10 can (bài phú Giáp mộc tham thiên…), ngũ dương tòng khí bất tòng thế, suy vượng, thông quan, hàn noãn táo thấp |
| **Mệnh Lý Huyền Cơ Tham Bí** | Phép định vượng suy 3 bước (nguyệt lệnh → quan hệ với chi toạ/thần nắm lệnh → sinh khắc chế hoá), thang 9 mức, "thường lý – biến lý", lý điên đảo ngũ hành; nhiều lá số có ngày sinh làm ca kiểm thử |
| **Manh phái sơ–trung–cao cấp** | Cung vị tứ trụ (tuổi, lục thân, thân thể, không gian), thập thần loại tượng & nghề nghiệp, hư thấu – thực |
| **Lục Thân cao cấp diện thụ** | Hôn nhân, cha mẹ (tham chiếu cho phần lục thân) |
| **Đổi Vận Cho Người Mệnh Khuyết** (Lý Cư Minh) | Cải vận theo hành: màu sắc, phương vị, vật phẩm, ăn uống, giờ tốt, nghề |
| **Khí thế lưu thông** | Bát tự "một mạch cùng sinh" chủ thông minh; Đào hoa, Hồng diễm |
| Mệnh Lý Tinh Hoa, Bát tự/Mệnh lý Trân bảo giảng nghĩa, DKN Bí kiếp | Thần sát, ví dụ thực chiến (tham khảo) |

## 2. Dữ liệu đầu vào

Người dùng **không nhập ngày giờ để web tự an sao** – họ dán **văn bản lá số** đã có sẵn (thông tin chung, 12 cung Tử Vi, tứ trụ Bát Tự, đại vận, lưu niên; xem `samples/la-so-mau.txt`). `src/lib/parseText.ts` đọc bằng quy tắc (không cần AI). Engine kiểm tra:
- can dương đi với chi dương (hợp lệ lục thập hoa giáp);
- can tháng theo **Ngũ hổ độn**, can giờ theo **Ngũ thử độn** (cảnh báo khi lệch);
- chiều đại vận theo **Dương nam Âm nữ thuận, Âm nam Dương nữ nghịch**.

## 3. Định vượng suy (strength.ts)

- Lực mỗi can/tàng can = trọng số vị trí × hệ số **Vượng–Tướng–Hưu–Tù–Tử** theo nguyệt lệnh × hệ số **thông căn** (can không gốc = hư phù).
- Nguyệt lệnh nặng nhất (Thiên Lý: "tối trọng là bản khí chi tháng"), chi ngày kế tiếp.
- Biến hoá: tam hội, tam hợp, bán hợp (cần chi vượng ở giữa), lục hợp hoá (cần được lệnh + can dẫn), hợp mà không hoá thì "trói", xung làm hao lực, can hợp hoá/không hoá.
- Phe trợ = Tỷ Kiếp + Ấn (+ một phần bản thân nhật chủ). Tỉ lệ trợ được quy về **9 mức** của Mệnh Lý Huyền Cơ Tham Bí: Cực nhược · Thái nhược · Thiên nhược · Trung hoà thiên nhược · Trung hoà · Trung hoà thiên vượng · Thiên vượng · Thái vượng · Cực vượng. Ngưỡng được hiệu chỉnh bằng các lá số ví dụ trong sách và phân bố trên 3.000 lá số ngẫu nhiên.
- Đồng thời báo **đắc lệnh / đắc địa / đắc thế**.

## 4. Cách cục (pattern.ts)

**Bát cách** – theo Thiên Lý Mệnh Cảo:
1. Bản khí chi tháng thấu can → lấy làm cách; 2. không thấu bản khí mà thấu tàng can khác → lấy can đó (ưu tiên can có lực, không bị hợp); 3. không thấu → lấy bản khí (hoặc lệ riêng khi bản khí là Tỷ/Kiếp: Ất tháng Dần → Chính Tài, Đinh tháng Tị → Chính Tài, Bính tháng Ngọ → Thương Quan, Mậu/Kỷ tháng tứ khố…); 4. Lộc ở tháng → **Kiến Lộc**; Giáp Mão, Canh Dậu, Nhâm Tý → **Dương Nhận**.

Mỗi cách đối chiếu các danh sách **thành / bại / thái quá / bất cập** và **cứu ứng** (Tử Bình Chân Thuyên): ví dụ Thương quan kiến Quan có Ấn thì cứu, Kiêu đoạt Thực có Tài thì cứu, Quan Sát hỗn tạp… Kết quả: Thành cách / Thành cách có bệnh / Phá cách có cứu / Phá cách, kèm thanh–trọc và cấp bậc.

**Ngoại cách** (xét trước):
- **Hoá khí**: nhật can hợp can tháng/giờ, nguyệt lệnh đúng mùa hoá (Giáp Kỷ – Thìn Tuất Sửu Mùi; Ất Canh – Tị Dậu Sửu Thân; Bính Tân – Hợi Thân Tý Thìn; Đinh Nhâm – Hợi Mão Mùi Dần; Mậu Quý – Dần Ngọ Tuất Tị), không có hành khắc hoá thần, không tranh hợp, nhật chủ vô căn.
- **Chuyên vượng**: Khúc Trực, Viêm Thượng, Giá Sắc, Tòng Cách, Nhuận Hạ – đương lệnh, hội đủ cục, không có hành khắc (can bị hợp thì bỏ qua).
- **Tòng cường/Tòng vượng**: trợ ≥ 86%, không Quan Sát.
- **Tòng nhược** (Tài / Sát / Nhi / Thế): nhật chủ vô căn, không Ấn lộ (Ấn bị hợp không tính), tỉ lệ trợ rất thấp; can dương khó tòng hơn ("ngũ dương tòng khí bất tòng thế").

12/12 lá số ngoại cách ví dụ trong Thiên Lý Mệnh Cảo được nhận đúng (`npm test`).

## 5. Dụng thần (yongshen.ts)

- **Phù ức** theo bảng "Dụng thần Bát cách": thân nhược – Tài trọng dùng Tỷ Kiếp, Quan Sát/Thực Thương trọng dùng Ấn; thân vượng – Ấn nhiều dùng Tài, Tỷ Kiếp nhiều dùng Quan Sát hoặc Thực Thương, Dương Nhận ưu tiên Quan Sát, Kiến Lộc cần Tài Quan (Tài vô căn mà Thực Thương có gốc → dùng Thực Thương sinh Tài).
- **Điều hậu**: sinh mùa Đông thiếu Hoả → cần Hoả; mùa Hạ thiếu Thuỷ → cần Thuỷ.
- **Thông quan**: hai hành mạnh tương khắc, hành trung gian yếu.
- **Ngoại cách**: dụng thuận theo khí thế (tòng gì dụng nấy; chuyên vượng dụng bản khí, kỵ hành khắc).
- Xuất: Dụng – Hỷ – Kỵ – Cừu – Nhàn và điểm thiện/ác từng hành (+2…−2) để chấm vận.
- Kèm nguyên văn **Bát Tự Dụng Thần Đề Yếu** cho đúng can ngày × tháng sinh.

## 6. Đại vận – Lưu niên (luck.ts)

- Điểm vận = can × 40% + chi (theo tàng can) × 60%; lưu niên 50/50.
- Cộng trừ theo tương tác với nguyên cục: xung chi hỷ dụng (xấu) / xung khứ kỵ thần (giảm hung), lục hợp hoá ra hỷ/kỵ, tam hợp – tam hội thành cục, can hợp trói hỷ/kỵ thần, thiên khắc địa xung trụ ngày, phạm/xung Thái Tuế.
- Lưu niên kết hợp đại vận theo Thiên Lý Mệnh Cảo: năm thiện + vận thiện càng tốt; năm ác + vận ác càng xấu; lẫn lộn thì thiện ác cùng gặp.

## 7. Các mục luận giải

Tổng quan · Nhật chủ (bài phú Trích Thiên Tủy + ghi chú theo mùa) · Ngũ hành & vượng suy (kèm hỷ kỵ 4 mùa của Thiên Lý Mệnh Cảo) · Cách cục · Dụng thần (+ Đề Yếu) · Tính cách theo thập thần nổi trội & khí thế lưu thông · Sự nghiệp – tài lộc (luật Phú/Quý) · Lục thân (cha mẹ, anh em, hôn nhân theo giới tính, con cái, cung vị Manh phái) · Sức khoẻ (Bệnh Nguyên: hành thái quá/bất cập, Tý Mùi hại, Sửu Ngọ hại, Thân Tị, Kiêu đoạt Thực…) · Đại vận · Lưu niên · Cải vận (Đổi Vận Cho Người Mệnh Khuyết) · Thần sát.

Thần sát tính: Thiên Ất, Văn Xương, Thái Cực, Lộc, Dương Nhận, Kim Dư, Hồng Diễm, Dịch Mã, Đào Hoa, Hoa Cái, Tướng Tinh, Kiếp Sát, Vong Thần, Thiên Đức, Nguyệt Đức, Cô Thần, Quả Tú, Hồng Loan, Thiên Hỷ, Thiên Y, Khôi Cương, Kim Thần, Thập Ác Đại Bại, Âm Dương Sai Thác, Cô Loan, Không Vong, Thiên La Địa Võng.

## 8. Diễn giải bằng lời thường (plain.ts, glossary.ts)

Kết luận của engine được “dịch” sang ngôn ngữ đời thường mà không tính lại:
- Mỗi nhóm thập thần ↔ một mảng đời sống: Tỷ Kiếp = bạn bè, anh em, tự lập · Thực Thương = tài năng, sáng tạo, thể hiện · Tài = tiền bạc, tài sản (nam: vợ) · Quan Sát = công việc, cấp trên, kỷ luật (nữ: chồng) · Ấn = học hành, người nâng đỡ, nhà cửa giấy tờ.
- Dụng thần được nói thành “điều giúp bạn tốt lên nhất”, kỵ thần thành “điều nên tiết chế”; 9 mức vượng suy thành mô tả tính khí (bản mệnh mạnh/yếu).
- Đại vận/lưu niên: phần can – chi hỷ hay kỵ được nói thành “Thuận: …” / “Cần lưu ý: …”; các tương tác xung, hợp, hình, hại, Thái Tuế được chuyển thành câu đời thường.
- Mỗi thẻ giữ “căn cứ chuyên môn” để đối chiếu; thuật ngữ trong phần chuyên sâu có giải thích bấm-để-xem.

## 9. Giới hạn đã biết

- Phép định vượng suy trong sách dựa nhiều vào "cảm giác" của thầy; engine dùng mô hình định lượng nên ở vùng ranh giới (trung hoà ↔ thiên vượng/nhược) có thể khác ý một số tác giả. Các lá số ngoại cách và cực vượng/cực nhược được nhận ổn định.
- Phần **Tử Vi Đẩu Số** (`src/lib/tuvi`) dựa trên kiến thức phổ thông vì thư mục tài liệu chưa có sách Tử Vi: chấm cung theo chính tinh miếu/hãm, cát – sát tinh, tứ hoá; cung vô chính diệu mượn chính tinh cung xung chiếu; đại hạn theo tuổi, lưu Mệnh và lưu tứ hoá năm xem. Khi có sách Tử Vi có thể bổ sung vào `src/lib/tuvi/knowledge.ts`.
- Phần sức khoẻ chỉ mang tính tham khảo; không đưa ra "tin tức tử vong" dù sách có chép.
