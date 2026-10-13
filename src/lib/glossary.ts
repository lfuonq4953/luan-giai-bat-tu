// Từ điển thuật ngữ mệnh lý bằng lời thường – dùng cho chức năng "bấm vào thuật ngữ để xem giải thích".
export interface Term { key: string; aliases?: string[]; def: string; exact?: boolean /* chỉ khớp đúng chữ hoa/thường */ }

export const GLOSSARY: Term[] = [
  // ---- Bát Tự: nền tảng
  { key: 'Bát Tự', def: 'Môn xem mệnh dựa trên 8 chữ (4 cặp can – chi) của năm, tháng, ngày, giờ sinh.' },
  { key: 'Tứ trụ', def: '4 cột năm – tháng – ngày – giờ sinh; mỗi cột gồm 1 thiên can (ở trên) và 1 địa chi (ở dưới).' },
  { key: 'Thiên can', def: '10 ký hiệu Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý – mỗi can thuộc một hành. Can thể hiện mặt bên ngoài, dễ thấy.' },
  { key: 'Địa chi', def: '12 con giáp Tý, Sửu, Dần… Hợi. Chi thể hiện mặt bên trong, gốc rễ, và chứa các “can ẩn”.' },
  { key: 'Nhật chủ', aliases: ['Nhật can'], def: 'Can của ngày sinh – đại diện cho chính bạn. Mọi yếu tố khác trong lá số được xét theo quan hệ với nó.' },
  { key: 'Ngũ hành', def: '5 yếu tố Kim, Mộc, Thủy, Hỏa, Thổ – sinh nhau (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc) và khắc nhau (Mộc khắc Thổ, Thổ khắc Thủy…).' },
  { key: 'Vượng suy', def: 'Mức mạnh – yếu của bản mệnh (nhật chủ) so với các yếu tố còn lại trong lá số.' },
  { key: 'Thân vượng', aliases: ['thiên vượng', 'thái vượng', 'cực vượng'], def: 'Bản mệnh mạnh: nhiều năng lượng tự thân. Cần “xả” bớt (công việc, tiền bạc, thử thách) để cân bằng.' },
  { key: 'Thân nhược', aliases: ['thiên nhược', 'thái nhược', 'cực nhược'], def: 'Bản mệnh yếu: dễ chịu tác động. Cần được “bồi” thêm (học vấn, người hỗ trợ, bạn bè) để cân bằng.' },
  { key: 'Trung hòa', aliases: ['Trung hoà'], def: 'Bản mệnh cân bằng, không quá mạnh cũng không quá yếu.' },
  { key: 'Phe trợ', def: 'Những yếu tố giúp bản mệnh mạnh lên: cùng hành với nhật chủ (bạn bè) và hành sinh ra nhật chủ (người nâng đỡ).' },
  { key: 'Nguyệt lệnh', aliases: ['đắc lệnh', 'thất lệnh'], def: 'Chi của tháng sinh – quyết định mùa sinh, ảnh hưởng mạnh nhất đến việc bản mệnh mạnh hay yếu. “Đắc lệnh” = sinh đúng mùa của mình.' },
  { key: 'Thông căn', aliases: ['đắc địa', 'đắc thế'], def: 'Can có “rễ” ở địa chi (cùng hành) nên vững; không có rễ thì yếu, dễ bị lay động.' },
  { key: 'Tàng can', def: 'Các can ẩn bên trong mỗi địa chi – ảnh hưởng ngầm, ít lộ ra ngoài.' },

  // ---- Dụng thần
  { key: 'Dụng thần', def: 'Yếu tố có lợi nhất cho lá số, giúp cân bằng. Thời điểm hoặc môi trường mang yếu tố này thường thuận lợi.' },
  { key: 'Hỷ thần', def: 'Yếu tố hỗ trợ dụng thần – cũng mang lại điều tốt.' },
  { key: 'Kỵ thần', def: 'Yếu tố làm lá số mất cân bằng – gặp nhiều thường trắc trở.' },
  { key: 'Cừu thần', def: 'Yếu tố tiếp sức cho kỵ thần – nên hạn chế.' },
  { key: 'Nhàn thần', def: 'Yếu tố trung tính, ảnh hưởng không đáng kể.' },
  { key: 'Hỷ dụng', def: 'Gọi chung dụng thần và hỷ thần – những yếu tố có lợi.' },
  { key: 'Phù ức', def: 'Cách chọn dụng thần: mạnh thì làm bớt, yếu thì bồi thêm cho cân bằng.' },
  { key: 'Điều hậu', def: 'Cân bằng nóng – lạnh: sinh mùa đông cần “hơi ấm” (Hỏa), sinh mùa hè cần “nước mát” (Thủy).' },
  { key: 'Thông quan', def: 'Dùng một hành trung gian để hoà giải hai hành đang xung khắc mạnh.' },

  // ---- Cách cục
  { key: 'Cách cục', def: 'Kiểu cấu trúc chính của lá số (như “bộ khung”), cho biết hướng phát triển nổi bật và cách đánh giá cao thấp.' },
  { key: 'Ngoại cách', aliases: ['Tòng cách'], def: 'Lá số đặc biệt, khí thế dồn hẳn về một phía; thuận theo xu hướng mạnh đó thì tốt, đi ngược thì xấu.' },
  { key: 'Kiến Lộc', def: 'Cách cục khi tháng sinh là “lộc” của nhật chủ: bản thân có gốc vững, tự lập, thường cần tiền bạc – công việc để cân bằng.' },
  { key: 'Dương Nhận', def: 'Cách cục khi tháng sinh làm nhật chủ quá cứng mạnh: quyết liệt, gan dạ, cần kỷ luật để kiềm chế.' },
  { key: 'Thành cách', def: 'Cấu trúc lá số đạt chuẩn, các yếu tố phối hợp tốt.' },
  { key: 'Phá cách', def: 'Cấu trúc lá số bị phá hỏng một phần – cần vận tốt hoặc yếu tố “cứu” để bù lại.' },
  { key: 'Cứu ứng', def: 'Yếu tố khác trong lá số khắc phục điểm hỏng của cách cục.' },

  // ---- Thập thần
  { key: 'Thập thần', def: '10 mối quan hệ giữa nhật chủ và các can khác, tượng trưng cho bạn bè, tài năng, tiền bạc, công việc, học vấn…' },
  { key: 'Tỷ Kiếp', aliases: ['Tỷ Kiên', 'Kiếp Tài'], exact: true, def: 'Cùng hành với bạn: bạn bè, anh em, đồng nghiệp ngang hàng, sự tự lập – và cả đối thủ cạnh tranh.' },
  { key: 'Thực Thương', aliases: ['Thực Thần', 'Thương Quan'], exact: true, def: 'Hành do bạn sinh ra: tài năng, sự sáng tạo, lời nói, cách thể hiện bản thân; với nữ còn là con cái.' },
  { key: 'Tài tinh', aliases: ['Chính Tài', 'Thiên Tài'], exact: true, def: 'Hành do bạn khắc: tiền bạc, tài sản; với nam còn là vợ/người yêu, với cả hai giới còn là cha.' },
  { key: 'Quan Sát', aliases: ['Chính Quan', 'Thất Sát', 'Quan tinh'], exact: true, def: 'Hành khắc bạn: công việc, cấp trên, kỷ luật, áp lực, danh tiếng; với nữ còn là chồng/người yêu.' },
  { key: 'Ấn', aliases: ['Chính Ấn', 'Thiên Ấn', 'Kiêu', 'Ấn tinh'], exact: true, def: 'Hành sinh ra bạn: học vấn, mẹ, người nâng đỡ, nhà cửa, giấy tờ.' },

  // ---- Vận
  { key: 'Đại vận', def: 'Chu kỳ 10 năm của cuộc đời. Mỗi đại vận mang một cặp can – chi, tốt hay xấu tuỳ có hợp dụng thần không.' },
  { key: 'Lưu niên', def: 'Ảnh hưởng riêng của từng năm, xét cùng với đại vận đang đi.' },
  { key: 'Thái Tuế', def: 'Con giáp của năm hiện tại. “Phạm Thái Tuế” = năm tuổi; “xung Thái Tuế” = năm đối tuổi.' },
  { key: 'Khởi vận', def: 'Thời điểm bắt đầu đại vận đầu tiên.' },

  // ---- Quan hệ chi
  { key: 'Lục hợp', aliases: ['Tam hợp', 'Tam hội', 'bán hợp'], def: 'Các địa chi kết hợp với nhau – tượng gắn bó, hợp tác; có khi “hoá” thành một hành khác.' },
  { key: 'Tương xung', aliases: ['xung khứ'], def: 'Hai địa chi đối diện nhau (như Tý – Ngọ) – tượng va chạm, thay đổi, di chuyển.' },
  { key: 'Tương hình', aliases: ['Tự hình', 'tam hình'], def: 'Quan hệ “hình phạt” giữa các chi – tượng thị phi, kiện tụng, tổn thương.' },
  { key: 'Tương hại', def: 'Quan hệ làm hại ngầm giữa hai chi – tượng hao tổn âm thầm.' },
  { key: 'Thiên khắc địa xung', def: 'Can khắc can, chi xung chi cùng lúc – biến động mạnh.' },

  // ---- Khác
  { key: 'Nạp âm', def: 'Tên gọi hình tượng của mỗi cặp can – chi (ví dụ “Tuyền Trung Thủy” = nước trong suối), dùng để tham khảo thêm.' },
  { key: 'Trường sinh', aliases: ['Tràng sinh'], def: '12 giai đoạn như vòng đời (Trường sinh, Mộc dục, Quan đới, Lâm quan, Đế vượng, Suy, Bệnh, Tử, Mộ, Tuyệt, Thai, Dưỡng) cho biết sức mạnh tại mỗi chi.' },
  { key: 'Không vong', aliases: ['Nhật không', 'Niên không'], def: 'Hai chi “trống” theo trụ ngày/năm – điều gì rơi vào đó thường kém thực chất, khó nắm giữ.' },
  { key: 'Thần sát', def: 'Các “sao” phụ trong Bát Tự (Thiên Ất, Đào Hoa, Dịch Mã…) – chỉ bổ sung chi tiết, không quyết định tốt xấu.' },
  { key: 'Thai nguyên', def: 'Cặp can chi của tháng thụ thai (ước tính) – tham khảo.' },
  { key: 'Mệnh cung', def: 'Cung mệnh tính theo tháng và giờ sinh trong Bát Tự – tham khảo.' },
  { key: 'Càn tạo', def: 'Lá số nam.' },
  { key: 'Khôn tạo', def: 'Lá số nữ.' },

  // ---- Tử Vi
  { key: 'Tử Vi', aliases: ['Tử Vi Đẩu Số'], exact: true, def: 'Môn xem mệnh bằng cách an các sao vào 12 cung (Mệnh, Tài, Quan, Phu Thê…). Trong web này dùng làm phần bổ trợ cho Bát Tự.' },
  { key: 'Chính tinh', def: '14 sao chính (Tử Vi, Thiên Phủ, Thái Dương…) – quyết định tính chất chính của mỗi cung.' },
  { key: 'Phụ tinh', aliases: ['Cát tinh', 'Sát tinh', 'Bại tinh'], def: 'Các sao phụ: cát tinh mang điều tốt, sát/bại tinh mang trở ngại.' },
  { key: 'Tứ hoá', aliases: ['Tứ hóa', 'lưu tứ hoá', 'Lưu tứ hoá'], def: '4 biến hoá theo can năm: Hoá Lộc (tiền, cơ hội), Hoá Quyền (quyền lực), Hoá Khoa (danh tiếng, học hành), Hoá Kỵ (vướng mắc, lo âu).' },
  { key: 'Hóa Kỵ', aliases: ['Hoá Kỵ'], def: 'Biến hoá mang vướng mắc, lo âu, thị phi ở cung nó rơi vào.' },
  { key: 'Hóa Lộc', aliases: ['Hoá Lộc'], def: 'Biến hoá mang tiền bạc, cơ hội đến cung nó rơi vào.' },
  { key: 'Đại hạn', def: 'Chu kỳ 10 năm trong Tử Vi, ứng với một cung trên lá số.' },
  { key: 'Lưu Mệnh', def: 'Cung Mệnh của riêng năm đang xem.' },
  { key: 'Vô chính diệu', def: 'Cung không có sao chính – phải mượn sao của cung đối diện nên lực yếu hơn.' },
  { key: 'Miếu', aliases: ['miếu địa', 'vượng địa'], def: 'Sao ở vị trí sáng, phát huy mặt tốt.' },
  { key: 'Hãm', aliases: ['hãm địa'], def: 'Sao ở vị trí tối, dễ lộ mặt xấu.' },
  { key: 'Tam phương tứ chính', def: 'Cung đang xét cùng 3 cung chiếu tới nó (2 cung tam hợp và cung đối diện) – được xem chung.' },
  { key: 'Cung Thân', aliases: ['Thân cư'], def: 'Cung cho biết nửa đời sau bạn thiên về điều gì.' },
  { key: 'Bản mệnh', def: 'Mệnh nạp âm theo năm sinh (ví dụ Tuyền Trung Thủy).' },
  { key: 'Cục', exact: true, def: 'Hành của lá số Tử Vi (Thủy nhị cục, Mộc tam cục…) – xét cùng bản mệnh để biết hoàn cảnh nâng đỡ hay gây áp lực.' },
];

interface Compiled { re: RegExp; map: Map<string, Term> }
let compiled: Compiled | null = null;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function glossaryMatcher(): Compiled {
  if (compiled) return compiled;
  const map = new Map<string, Term>();
  for (const t of GLOSSARY) {
    for (const a of [t.key, ...(t.aliases ?? [])]) {
      const vars = t.exact ? [a] : [a, a.toLowerCase(), capFirst(a.toLowerCase())];
      for (const v of vars) if (!map.has(v)) map.set(v, t);
    }
  }
  const keys = [...map.keys()].sort((a, b) => b.length - a.length).map(esc);
  // Ranh giới chữ dựa trên \p{L} (chữ cái mọi ngôn ngữ) – \b không hiểu dấu tiếng Việt
  const re = new RegExp(`(^|[^\\p{L}])(${keys.join('|')})(?![\\p{L}])`, 'gu');
  compiled = { re, map };
  return compiled;
}

export type GlossPiece = string | { text: string; term: Term };

/** Tách chuỗi thành các mảnh, đánh dấu lần xuất hiện ĐẦU TIÊN của mỗi thuật ngữ (theo tập `seen` dùng chung) */
export function splitTerms(text: string, seen: Set<string>): GlossPiece[] {
  const { re, map } = glossaryMatcher();
  const out: GlossPiece[] = [];
  let last = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const start = m.index + m[1].length;
    const word = m[2];
    const term = map.get(word);
    if (!term || seen.has(term.key)) continue;
    seen.add(term.key);
    if (start > last) out.push(text.slice(last, start));
    out.push({ text: word, term });
    last = start + word.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
