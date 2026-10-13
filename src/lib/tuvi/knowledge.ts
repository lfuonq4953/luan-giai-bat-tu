// Tri thức Tử Vi Đẩu Số (tổng hợp từ kiến thức phổ thông về Tử Vi – thư mục TaiLieu hiện chưa có sách Tử Vi,
// nên phần này mang tính tham khảo, có thể bổ sung khi có tài liệu).

export interface MajorStar {
  element: string; tag: string; nature: string; bright: string; dark: string;
  career: string; wealth: string; love: string; health: string;
}

export const MAJOR_STARS: Record<string, MajorStar> = {
  'Tử Vi': { element: 'Thổ', tag: 'Đế tinh', nature: 'uy nghi, tự trọng, có khí chất lãnh đạo, thích được tôn trọng và làm chủ', bright: 'miếu vượng thì quyền quý, được người phò trợ', dark: 'yếu hoặc gặp sát thì cô độc, kiêu, nói nhiều làm ít', career: 'quản lý, lãnh đạo, hành chính, điều hành doanh nghiệp', wealth: 'tiền đến từ vị thế và khả năng quản trị', love: 'người phối ngẫu đoan trang, có tiếng nói; bản thân cần được nể trọng trong quan hệ', health: 'tỳ vị, tiêu hoá' },
  'Thiên Cơ': { element: 'Mộc', tag: 'Thiện tinh – mưu trí', nature: 'thông minh, nhanh nhạy, giỏi tính toán, thích suy nghĩ và kỹ thuật', bright: 'sáng thì mưu lược, tay nghề giỏi', dark: 'hãm thì lo nghĩ, hay thay đổi, thiếu kiên định', career: 'kỹ thuật, kế hoạch, tư vấn, công nghệ, y dược', wealth: 'tiền nhờ trí óc, lên xuống theo kế hoạch', love: 'thích người thông minh; tình cảm hay thay đổi, cần ổn định', health: 'gan mật, thần kinh, tay chân' },
  'Thái Dương': { element: 'Hỏa', tag: 'Quý tinh – mặt trời', nature: 'quang minh, hào phóng, nhiệt tình, hay vì người khác', bright: 'sáng thì danh tiếng, quý hiển', dark: 'hãm thì lao tâm khổ tứ, có danh mà ít lợi', career: 'công quyền, giáo dục, truyền thông, ngoại giao', wealth: 'tiền đi theo danh, rộng rãi khó giữ', love: 'với nam là sao chồng/cha; hãm thì duyên đến muộn', health: 'mắt, tim, huyết áp, đầu' },
  'Vũ Khúc': { element: 'Kim', tag: 'Tài tinh', nature: 'quyết đoán, thực tế, cứng rắn, giỏi tài chính', bright: 'sáng thì giàu có nhờ tài chính, kinh doanh', dark: 'hãm thì cô khắc, nóng nảy, tiền bị phá', career: 'tài chính, ngân hàng, kinh doanh, kỹ thuật kim khí', wealth: 'chính tài tinh – giỏi kiếm và giữ tiền', love: 'tính cứng, nên kết hôn muộn để bớt khắc', health: 'phổi, hô hấp, xương, răng' },
  'Thiên Đồng': { element: 'Thủy', tag: 'Phúc tinh', nature: 'hiền hoà, dễ chịu, lạc quan, thích hưởng thụ', bright: 'sáng thì phúc hậu, tay trắng làm nên', dark: 'hãm thì lười, thiếu chí, đời bấp bênh', career: 'dịch vụ, nghệ thuật, giáo dục, phúc lợi', wealth: 'tiền vừa đủ, càng về sau càng khá', love: 'tình cảm êm đềm, dễ mềm lòng', health: 'thận, bàng quang, tai' },
  'Liêm Trinh': { element: 'Hỏa', tag: 'Tù tinh – thứ đào hoa', nature: 'cương trực, nguyên tắc, nhiều tham vọng, tự ái cao', bright: 'sáng thì liêm chính, có quyền', dark: 'hãm thì nóng nảy, liều lĩnh, dễ thị phi, kiện tụng', career: 'pháp luật, quân đội, chính trị, kỹ thuật, kinh doanh cạnh tranh', wealth: 'tài lộc thăng trầm theo vận', love: 'đào hoa, tình cảm sóng gió', health: 'máu huyết, tim, viêm nhiễm, tai nạn' },
  'Thiên Phủ': { element: 'Thổ', tag: 'Kho lộc', nature: 'ôn hoà, chín chắn, giỏi quản lý và tích luỹ, hơi bảo thủ', bright: 'sáng thì kho đầy, an hưởng', dark: 'gặp Không Kiếp thì kho trống, giữ của khó', career: 'quản lý, tài chính, hành chính, kho vận', wealth: 'biết giữ của, tích luỹ bền', love: 'người phối ngẫu đảm đang, gia đình êm', health: 'tỳ vị' },
  'Thái Âm': { element: 'Thủy', tag: 'Phú tinh – mặt trăng', nature: 'dịu dàng, tinh tế, giàu tình cảm, có óc thẩm mỹ', bright: 'sáng thì giàu điền sản, êm ấm', dark: 'hãm thì đa sầu, bất an, tiền tài hao', career: 'tài chính, bất động sản, nghệ thuật, chăm sóc', wealth: 'điền sản, tích luỹ chậm mà chắc', love: 'với nam là sao vợ/mẹ; hãm thì duyên lận đận', health: 'thận, mắt, nội tiết' },
  'Tham Lang': { element: 'Mộc', tag: 'Đào hoa tinh', nature: 'đa tài đa nghệ, giao tế giỏi, năng động, nhiều ham muốn', bright: 'sáng thì phát đạt, giàu về hậu vận', dark: 'hãm thì tửu sắc, tham lam', career: 'kinh doanh, giải trí, ngoại giao, ẩm thực', wealth: 'nhiều tham vọng làm giàu, phát muộn', love: 'đào hoa, nhiều mối quan hệ', health: 'gan thận, bệnh do tửu sắc' },
  'Cự Môn': { element: 'Thủy', tag: 'Ám tinh – khẩu tài', nature: 'ăn nói giỏi, thích phân tích, tranh luận, hay nghi ngờ', bright: 'sáng thì nhờ khẩu tài mà thành danh', dark: 'hãm thì thị phi, khẩu thiệt', career: 'luật, giáo dục, truyền thông, bán hàng, MC', wealth: 'tiền từ lời nói, tư vấn', love: 'dễ khắc khẩu, cần nhường lời', health: 'tiêu hoá, miệng họng' },
  'Thiên Tướng': { element: 'Thủy', tag: 'Ấn tinh', nature: 'chính trực, chu đáo, thích giúp người, hợp vai trò phò tá', bright: 'sáng thì được trọng dụng, có ấn tín', dark: 'hãm thì thiếu quyết đoán, dễ bị lợi dụng', career: 'hành chính, nhân sự, tư vấn, trợ lý điều hành', wealth: 'thu nhập ổn định', love: 'hôn nhân hoà hợp, phối ngẫu tốt', health: 'da, thận, bàng quang' },
  'Thiên Lương': { element: 'Thổ', tag: 'Ấm tinh – thọ tinh', nature: 'nhân hậu, chín chắn, thích che chở, có tố chất người thầy', bright: 'sáng thì giải ách, thọ, được kính trọng', dark: 'hãm thì cô độc, gia trưởng', career: 'y tế, giáo dục, pháp luật, bảo hiểm, tôn giáo', wealth: 'không tham, tiền vừa đủ', love: 'thích người chín chắn, lớn tuổi', health: 'tỳ vị; có sao giải nên ít bệnh nặng' },
  'Thất Sát': { element: 'Kim', tag: 'Tướng tinh', nature: 'dũng mãnh, quyết đoán, độc lập, thích khai phá', bright: 'sáng thì lập công, có quyền', dark: 'hãm thì liều lĩnh, cô độc, dễ tai nạn', career: 'quân đội, khởi nghiệp, kinh doanh mạo hiểm, kỹ thuật', wealth: 'tiền đến nhanh đi nhanh', love: 'tình cảm biến động, nên muộn', health: 'phổi, xương, chấn thương' },
  'Phá Quân': { element: 'Thủy', tag: 'Hao tinh – tiên phong', nature: 'thích đổi mới, phá cũ xây mới, can đảm, khó gò bó', bright: 'sáng thì khai sáng sự nghiệp, làm lớn', dark: 'hãm thì phá tán, bất ổn, hao tổn', career: 'khởi nghiệp, cải cách, vận tải, kỹ thuật, quân sự', wealth: 'tiền ra vào lớn, khó giữ', love: 'nhiều thay đổi, cần người kiên nhẫn', health: 'thận, sinh dục, tai nạn' },
};

export type MinorKind = 'cát' | 'sát' | 'hoá' | 'trung';
export const MINOR_STARS: Record<string, { kind: MinorKind; meaning: string }> = {
  'Văn Xương': { kind: 'cát', meaning: 'học vấn, văn chương, thi cử' },
  'Văn Khúc': { kind: 'cát', meaning: 'tài năng, ăn nói, nghệ thuật' },
  'Tả Phù': { kind: 'cát', meaning: 'được người trợ lực' },
  'Hữu Bật': { kind: 'cát', meaning: 'được người trợ lực, khéo léo' },
  'Thiên Khôi': { kind: 'cát', meaning: 'quý nhân nam, cơ hội đỗ đạt' },
  'Thiên Việt': { kind: 'cát', meaning: 'quý nhân nữ, cơ hội bất ngờ' },
  'Lộc Tồn': { kind: 'cát', meaning: 'tài lộc, tích luỹ (hơi bảo thủ)' },
  'Thiên Mã': { kind: 'trung', meaning: 'di chuyển, thay đổi, năng động' },
  'Kình Dương': { kind: 'sát', meaning: 'cương mãnh, tranh đấu, dao kéo' },
  'Kinh Dương': { kind: 'sát', meaning: 'cương mãnh, tranh đấu, dao kéo' },
  'Đà La': { kind: 'sát', meaning: 'trì trệ, vướng mắc, ngấm ngầm' },
  'Hỏa Tinh': { kind: 'sát', meaning: 'nóng vội, bột phát, hoả hoạn' },
  'Linh Tinh': { kind: 'sát', meaning: 'nóng nảy ngầm, bất ngờ' },
  'Địa Không': { kind: 'sát', meaning: 'hư không, mất mát, ý tưởng lạ' },
  'Địa Kiếp': { kind: 'sát', meaning: 'hao tán, tai hoạ bất ngờ' },
  'Hóa Lộc': { kind: 'hoá', meaning: 'tiền tài, cơ hội, thuận lợi' },
  'Hóa Quyền': { kind: 'hoá', meaning: 'quyền lực, chủ động, uy tín' },
  'Hóa Khoa': { kind: 'hoá', meaning: 'danh tiếng, học vấn, giải ách' },
  'Hóa Kỵ': { kind: 'hoá', meaning: 'trắc trở, ám muội, lo âu' },
  'Đào Hoa': { kind: 'trung', meaning: 'duyên dáng, tình duyên' },
  'Hồng Loan': { kind: 'trung', meaning: 'tình duyên, cưới hỏi' },
  'Thiên Hỷ': { kind: 'cát', meaning: 'hỷ sự, tin vui' },
  'Thiên Diêu': { kind: 'trung', meaning: 'đa tình, đam mê, nghệ thuật' },
  'Thiên Riêu': { kind: 'trung', meaning: 'đa tình, đam mê, nghệ thuật' },
  'Thiên Hình': { kind: 'sát', meaning: 'kỷ luật, pháp lý, phẫu thuật' },
  'Cô Thần': { kind: 'sát', meaning: 'cô đơn, độc lập' },
  'Quả Tú': { kind: 'sát', meaning: 'cô quạnh, ít chia sẻ' },
  'Thiên Khốc': { kind: 'sát', meaning: 'buồn phiền, lo âu' },
  'Thiên Hư': { kind: 'sát', meaning: 'hư hao, trống trải' },
  'Tang Môn': { kind: 'sát', meaning: 'tang chế, buồn' },
  'Bạch Hổ': { kind: 'sát', meaning: 'tai nạn, huyết quang (cũng là uy dũng)' },
  'Điếu Khách': { kind: 'sát', meaning: 'thị phi, buồn bã' },
  'Tuế Phá': { kind: 'sát', meaning: 'phá cách, tranh cãi' },
  'Thái Tuế': { kind: 'trung', meaning: 'lý lẽ, khẩu thiệt' },
  'Quan Phủ': { kind: 'sát', meaning: 'giấy tờ pháp lý, kiện cáo' },
  'Quan Phù': { kind: 'sát', meaning: 'giấy tờ pháp lý, kiện cáo' },
  'Phá Toái': { kind: 'sát', meaning: 'đổ vỡ, hao tổn' },
  'Đại Hao': { kind: 'sát', meaning: 'hao tài lớn' },
  'Tiểu Hao': { kind: 'sát', meaning: 'hao tài nhỏ, tiêu xài' },
  'Thiên Quan': { kind: 'cát', meaning: 'quý nhân, phúc' },
  'Thiên Phúc': { kind: 'cát', meaning: 'phúc lộc, quý nhân' },
  'Thiên Đức': { kind: 'cát', meaning: 'phúc đức, giải ách' },
  'Nguyệt Đức': { kind: 'cát', meaning: 'phúc đức, giải ách' },
  'Long Đức': { kind: 'cát', meaning: 'phúc đức, giải ách' },
  'Phúc Đức': { kind: 'cát', meaning: 'phúc đức, giải ách' },
  'Thiên Giải': { kind: 'cát', meaning: 'giải trừ tai ách' },
  'Địa Giải': { kind: 'cát', meaning: 'giải trừ tai ách' },
  'Giải Thần': { kind: 'cát', meaning: 'giải trừ tai ách' },
  'Ân Quang': { kind: 'cát', meaning: 'ân huệ, được giúp đỡ' },
  'Thiên Quý': { kind: 'cát', meaning: 'ân huệ, quý nhân' },
  'Tam Thai': { kind: 'cát', meaning: 'địa vị, thăng tiến' },
  'Bát Tọa': { kind: 'cát', meaning: 'địa vị, thăng tiến' },
  'Long Trì': { kind: 'cát', meaning: 'tài hoa, khoa danh' },
  'Phượng Các': { kind: 'cát', meaning: 'tài hoa, mỹ thuật' },
  'Thai Phụ': { kind: 'cát', meaning: 'danh vị, được nâng đỡ' },
  'Phong Cáo': { kind: 'cát', meaning: 'danh vị, bằng khen' },
  'Quốc Ấn': { kind: 'cát', meaning: 'ấn tín, chức vụ' },
  'Hoa Cái': { kind: 'trung', meaning: 'nghệ thuật, tôn giáo, cao ngạo' },
  'Thiên Y': { kind: 'cát', meaning: 'y dược, chữa lành' },
  'Thiên Trù': { kind: 'cát', meaning: 'ăn uống, bếp núc' },
  'Văn Tinh': { kind: 'cát', meaning: 'văn chương' },
  'Thiên Tài': { kind: 'cát', meaning: 'tài năng riêng' },
  'Thiên Thọ': { kind: 'cát', meaning: 'thọ, điềm đạm' },
  'Lưu Hà': { kind: 'sát', meaning: 'huyết quang, sông nước' },
  'Kiếp Sát': { kind: 'sát', meaning: 'tai hoạ bất ngờ' },
  'Phi Liêm': { kind: 'sát', meaning: 'nhanh nhẹn, thị phi' },
  'Phục Binh': { kind: 'sát', meaning: 'ám hại, bị cản trở ngầm' },
  'Bệnh Phù': { kind: 'sát', meaning: 'bệnh tật' },
  'Thiên La': { kind: 'sát', meaning: 'vướng mắc, ràng buộc' },
  'Địa Võng': { kind: 'sát', meaning: 'vướng mắc, ràng buộc' },
  'Thiên Sứ': { kind: 'sát', meaning: 'tai ương ngắn hạn' },
  'Thiên Thương': { kind: 'sát', meaning: 'tổn thương, hao' },
  'Thiên Không': { kind: 'sát', meaning: 'hư không, mất mát' },
  'Bác Sỹ': { kind: 'cát', meaning: 'thông minh, học rộng' },
  'Lực Sỹ': { kind: 'trung', meaning: 'sức lực, quyền' },
  'Thanh Long': { kind: 'cát', meaning: 'hỷ sự, may mắn' },
  'Hỷ Thần': { kind: 'cát', meaning: 'tin vui' },
  'Tấu Thư': { kind: 'cát', meaning: 'văn thư, khéo ăn nói' },
  'Tướng Quân': { kind: 'trung', meaning: 'uy dũng, nóng' },
  'Trực Phù': { kind: 'sát', meaning: 'thị phi' },
  'Tử Phù': { kind: 'sát', meaning: 'buồn phiền' },
  'Đường Phù': { kind: 'cát', meaning: 'nhà cửa, đất đai' },
  'Đẩu Quân': { kind: 'trung', meaning: 'nghiêm khắc, cô độc' },
  'Thiếu Dương': { kind: 'cát', meaning: 'vui vẻ, thông minh' },
  'Thiếu Âm': { kind: 'cát', meaning: 'hiền hoà' },
};

export const BRIGHT_NAME: Record<string, string> = { 'M': 'Miếu', 'V': 'Vượng', 'Đ': 'Đắc', 'B': 'Bình hoà', 'H': 'Hãm' };

/** Tứ hoá theo can năm: [Lộc, Quyền, Khoa, Kỵ] */
export const TU_HOA: string[][] = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],       // Ất
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], // Bính
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],        // Đinh
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],        // Mậu
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],    // Kỷ
  ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],     // Canh
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],      // Tân
  ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],          // Nhâm
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],         // Quý
];

export const PALACE_TOPIC: Record<string, string> = {
  'Mệnh': 'bản thân, tính cách, tiềm năng', 'Phụ Mẫu': 'cha mẹ, bề trên, giấy tờ', 'Phúc Đức': 'phúc phần, tinh thần, dòng họ',
  'Điền Trạch': 'nhà cửa, đất đai, tài sản cố định', 'Quan Lộc': 'sự nghiệp, công việc', 'Nô Bộc': 'bạn bè, cộng sự, cấp dưới',
  'Thiên Di': 'ra ngoài, xã hội, đi xa', 'Tật Ách': 'sức khoẻ, tai ách', 'Tài Bạch': 'tiền bạc, thu nhập',
  'Tử Tức': 'con cái, học trò', 'Phu Thê': 'hôn nhân, người phối ngẫu', 'Huynh Đệ': 'anh chị em, người ngang hàng',
};
