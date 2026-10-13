// Kho tri thức diễn giải – tổng hợp từ bộ tài liệu trong thư mục TaiLieu:
//  Trích Thiên Tủy (Nhậm Thiết Tiều bình chú), Tử Bình Chân Thuyên (Từ Nhạc Ngô bình chú),
//  Thiên Lý Mệnh Cảo, Mệnh Lý Huyền Cơ Tham Bí, Manh phái mệnh lý (Đoàn Kiến Nghiệp),
//  Tử Bình Bệnh Nguyên Sinh Tử, Đổi Vận Cho Người Mệnh Khuyết (Lý Cư Minh), Khí thế lưu thông.
import type { Element, TenGod, Season } from '../constants';

export interface DayMasterInfo { title: string; image: string; poem: string; nature: string; strengths: string; weaknesses: string; seasonNote: Record<Season, string> }

export const DAY_MASTER: DayMasterInfo[] = [
  {
    title: 'Giáp Mộc – cây đại thụ', image: 'Dương mộc, cây cao chọc trời, rường cột.',
    poem: 'Trích Thiên Tủy: “Giáp mộc tham thiên, thoát thai yếu hoả. Xuân bất dung kim, thu bất dung thổ. Hoả sí thừa long, thuỷ đãng kỵ hổ. Địa nhuận thiên hoà, thực lập thiên cổ.”',
    nature: 'Ngay thẳng, có chí tiến thủ, trọng nghĩa, thích vươn lên và che chở người khác; làm việc có nguyên tắc, kiên định.',
    strengths: 'Tinh thần trách nhiệm, nhân hậu, có tầm nhìn dài hạn, khả năng lãnh đạo tự nhiên.',
    weaknesses: 'Cứng nhắc, khó uốn mình, tự tôn cao; khi gặp áp lực dễ gãy thay vì cong.',
    seasonNote: {
      'Xuân': 'Đầu xuân dư hàn còn, hỷ Bính hoả sưởi ấm và tiết tú; giữa xuân mộc cực vượng, cần tiết khí – mộc xuân không dung kim.',
      'Hạ': 'Mùa hạ mộc bị hoả tiết, bề ngoài tươi tốt mà bên trong rỗng – cần thuỷ tư nhuận làm gốc.',
      'Thu': 'Mùa thu mộc suy, kim vượng khắc – cần hoả chế kim, thuỷ hoá kim sinh mộc; thu không dung thổ.',
      'Đông': 'Mùa đông thuỷ lạnh mộc đông cứng – cần Bính hoả sưởi ấm (hàn mộc hướng dương), kỵ thuỷ nhiều làm mộc trôi.',
    },
  },
  {
    title: 'Ất Mộc – hoa cỏ, dây leo', image: 'Âm mộc, cây cỏ mềm mại, dây leo bám giá.',
    poem: 'Trích Thiên Tủy: “Ất mộc tuy nhu, khuê dương giải ngưu. Hoài đinh bão bính, khoá phượng thừa hầu. Hư thấp chi địa, kỵ mã diệc ưu. Đằng la hệ giáp, khả xuân khả thu.”',
    nature: 'Mềm dẻo, khéo léo, giàu thích nghi, biết nương thế; tinh tế, có óc thẩm mỹ, giỏi giao tế.',
    strengths: 'Bền bỉ, uyển chuyển, nhẫn nại, biết tận dụng hoàn cảnh và quý nhân (“dây leo bám Giáp”).',
    weaknesses: 'Dễ phụ thuộc, thiếu quyết đoán, hay lo nghĩ, có lúc tính toán thiệt hơn.',
    seasonNote: {
      'Xuân': 'Xuân như đào lý, gặp hoả thì phát vinh, gặp kim được điêu khắc.',
      'Hạ': 'Hạ như lúa mạ, rất cần thuỷ tưới nhuận, kỵ hoả táo.',
      'Thu': 'Thu như cây đồng cây quế, kim vượng cần hoả chế kim cứu mộc (hoài Đinh bão Bính).',
      'Đông': 'Đông như hoa thơm cỏ lạ, cần hoả sưởi ấm, thổ khô bồi gốc; đất hư thấp không hoả thì khó phát.',
    },
  },
  {
    title: 'Bính Hoả – mặt trời', image: 'Dương hoả, thuần dương, ánh mặt trời chiếu khắp.',
    poem: 'Trích Thiên Tủy: “Bính hoả mãnh liệt, khi sương vũ tuyết. Năng đoán canh kim, phùng tân phản khiếp. Thổ chúng thành từ, thuỷ xương hiển tiết. Hổ mã khuyển hương, giáp lai thành diệt.”',
    nature: 'Nhiệt tình, hào sảng, quang minh chính đại, thích được chú ý và lan toả năng lượng; thẳng thắn, rộng lượng.',
    strengths: 'Lạc quan, truyền cảm hứng, hào phóng, dám nghĩ dám làm.',
    weaknesses: 'Nóng vội, thích phô trương, thiếu kiên nhẫn với chi tiết; đến nhanh đi nhanh.',
    seasonNote: {
      'Xuân': 'Mẹ vượng con tướng, có mộc sinh – kỵ mộc quá nhiều làm hoả bốc; thích Nhâm thuỷ để “thuỷ hoả ký tế”.',
      'Hạ': 'Hoả đương lệnh cực vượng – cần Nhâm thuỷ chế, Canh kim phát nguồn thuỷ; kỵ thêm mộc hoả.',
      'Thu': 'Hoả tù dần, ánh chiều tà – cần Giáp mộc sinh, kỵ thổ nhiều che mờ.',
      'Đông': 'Hoả tử tuyệt, cần Giáp mộc sinh phù, thổ chế thuỷ; thuỷ nhiều mà không mộc là nguy.',
    },
  },
  {
    title: 'Đinh Hoả – ngọn đèn, ánh nến', image: 'Âm hoả, ngọn lửa ấm, đèn soi trong đêm.',
    poem: 'Trích Thiên Tủy: “Đinh hoả nhu trung, nội tính chiêu dung. Bão ất nhi hiếu, hợp nhâm nhi trung. Vượng nhi bất liệt, suy nhi bất cùng. Như hữu đích mẫu, khả thu khả đông.”',
    nature: 'Ấm áp, tinh tế, sâu sắc, giàu nội tâm; chu đáo, biết quan tâm, trực giác tốt.',
    strengths: 'Kiên trì “đèn không tắt”, có văn tài, biết lắng nghe và soi sáng người khác.',
    weaknesses: 'Đa sầu đa cảm, hay giữ trong lòng, dễ nghi ngại; khi suy yếu thì dao động.',
    seasonNote: {
      'Xuân': 'Có Giáp mộc làm “mẹ”, được Canh bổ Giáp dẫn Đinh thì đèn sáng lâu.',
      'Hạ': 'Hoả vượng, cần thuỷ điều hoà, kỵ thổ táo.',
      'Thu': 'Đinh suy, cần Giáp mộc sinh, Canh kim bổ mộc.',
      'Đông': 'Có mẹ (Giáp/Ất) thì “khả thu khả đông”; không mộc thì tắt.',
    },
  },
  {
    title: 'Mậu Thổ – núi cao, đê lớn', image: 'Dương thổ, núi non, tường thành, đê điều.',
    poem: 'Trích Thiên Tủy: “Mậu thổ cố trọng, ký trung thả chính. Tĩnh hấp động tịch, vạn vật tư mệnh. Thuỷ nhuận vật sinh, hoả táo vật bệnh. Nhược tại cấn khôn, phạ xung nghi tĩnh.”',
    nature: 'Trầm ổn, đáng tin, bao dung, giữ chữ tín; thích sự chắc chắn, bảo vệ người thân.',
    strengths: 'Vững vàng, chịu đựng tốt, điềm tĩnh, có uy tín – “vạn vật tư mệnh”.',
    weaknesses: 'Chậm thay đổi, bảo thủ, ít bộc lộ cảm xúc, có lúc cố chấp.',
    seasonNote: {
      'Xuân': 'Thổ hư bị mộc khắc – hỷ hoả sinh, thổ trợ; kỵ mộc quá vượng.',
      'Hạ': 'Thổ táo, hỷ thuỷ nhuận (thuỷ nhuận vật sinh), kỵ hoả táo (hoả táo vật bệnh).',
      'Thu': 'Con vượng mẹ suy, kim tiết khí nhiều – hỷ hoả sinh, thổ trợ.',
      'Đông': 'Ngoài lạnh trong ấm, cần Bính hoả sưởi ấm, thổ trợ; kỵ kim thuỷ lạnh lẽo.',
    },
  },
  {
    title: 'Kỷ Thổ – ruộng vườn', image: 'Âm thổ, đất ruộng màu mỡ nuôi dưỡng vạn vật.',
    poem: 'Trích Thiên Tủy: “Kỷ thổ ti thấp, trung chính súc tàng. Bất sầu mộc thịnh, bất uý thuỷ cuồng. Hoả thiểu hoả hối, kim đa kim quang. Nhược yếu vật vượng, nghi trợ nghi bang.”',
    nature: 'Khiêm nhường, chu đáo, giỏi nuôi dưỡng và chăm lo; thực tế, khéo tích luỹ.',
    strengths: 'Bao dung, đa năng, thích ứng, giỏi tổ chức việc nhỏ thành việc lớn.',
    weaknesses: 'Hay lo xa, thiếu tự tin, dễ bị ảnh hưởng bởi môi trường; đôi khi tính toán quá kỹ.',
    seasonNote: {
      'Xuân': 'Đất xuân lạnh ẩm, cần Bính hoả sưởi, Quý thuỷ nhuận; mộc vượng thì dùng Canh chế.',
      'Hạ': 'Đất khô cần Quý thuỷ nhuận, kỵ hoả táo.',
      'Thu': 'Kim nhiều tiết khí, hỷ hoả sinh, thổ trợ.',
      'Đông': 'Đất đóng băng, Bính hoả là cần kíp.',
    },
  },
  {
    title: 'Canh Kim – kiếm thép, sắt thô', image: 'Dương kim, sắt thép, binh khí, khoáng thạch.',
    poem: 'Trích Thiên Tủy: “Canh kim đái sát, cương kiện vi tối. Đắc thuỷ nhi thanh, đắc hoả nhi nhuệ. Thổ nhuận tắc sinh, thổ can tắc thuý. Năng doanh giáp huynh, thâu ư ất muội.”',
    nature: 'Cương nghị, quyết đoán, nghĩa khí, dám chịu trách nhiệm; thích hành động, ghét lề mề.',
    strengths: 'Ý chí sắt đá, kỷ luật, trọng lời hứa, xông pha giải quyết việc khó.',
    weaknesses: 'Cứng rắn, nóng tính, dễ gây xung đột, thiếu mềm mỏng.',
    seasonNote: {
      'Xuân': 'Kim tù, thể nhu – hỷ thổ sinh, kim trợ; gặp hoả thì cần tỷ trợ.',
      'Hạ': 'Kim tử, sợ hoả nung chảy – hỷ thuỷ nhuận, thổ ẩm sinh kim.',
      'Thu': 'Kim đương lệnh vượng – hỷ hoả luyện thành khí, thuỷ tiết tú (đắc thuỷ nhi thanh, đắc hoả nhi nhuệ).',
      'Đông': 'Kim hàn thuỷ lạnh – cần hoả sưởi ấm, thổ chế thuỷ.',
    },
  },
  {
    title: 'Tân Kim – châu ngọc, trang sức', image: 'Âm kim, vàng bạc, đá quý đã gọt giũa.',
    poem: 'Trích Thiên Tủy: “Tân kim nhuyễn nhược, ôn nhuận nhi thanh. Uý thổ chi điệp, nhạo thuỷ chi doanh. Năng phù xã tắc, năng cứu sinh linh. Nhiệt tắc hỷ mẫu, hàn tắc hỷ đinh.”',
    nature: 'Thanh tú, tinh tế, coi trọng thể diện và cái đẹp; sắc sảo, tự trọng, có gu.',
    strengths: 'Thông minh, cầu toàn, ăn nói khéo, có sức hút; giỏi việc cần độ chính xác.',
    weaknesses: 'Nhạy cảm, dễ tổn thương, kiêu hãnh, đôi khi kén chọn và thích được khen.',
    seasonNote: {
      'Xuân': 'Kim suy, cần thổ sinh (Kỷ), Nhâm thuỷ rửa cho sáng.',
      'Hạ': 'Sợ hoả nung, “nhiệt tắc hỷ mẫu” – cần Kỷ thổ ẩm sinh, Nhâm thuỷ.',
      'Thu': 'Kim vượng, “nhạo thuỷ chi doanh” – hỷ Nhâm thuỷ đãi cho trong sáng, sợ thổ chôn vùi (uý thổ chi điệp).',
      'Đông': '“Hàn tắc hỷ Đinh” – cần hoả sưởi ấm, Nhâm thuỷ vẫn là dụng.',
    },
  },
  {
    title: 'Nhâm Thuỷ – sông lớn, biển cả', image: 'Dương thuỷ, sông dài biển rộng, dòng chảy mạnh.',
    poem: 'Trích Thiên Tủy: “Nhâm thuỷ thông hà, năng tiết kim khí. Cương trung chi đức, chu lưu bất trệ. Thông căn thấu quý, xung thiên bôn địa. Hoá tắc hữu tình, tòng tắc tương tế.”',
    nature: 'Thông minh, linh hoạt, tầm nhìn rộng, thích tự do và khám phá; năng động, xoay xở giỏi.',
    strengths: 'Trí tuệ, khả năng thích nghi, bao quát, có sức lan toả và kết nối.',
    weaknesses: 'Thiếu ổn định, dễ buông thả, khó bị ràng buộc; vượng quá thì “xung thiên bôn địa”.',
    seasonNote: {
      'Xuân': 'Thuỷ hưu, tiết cho mộc – hỷ kim sinh, thổ làm đê.',
      'Hạ': 'Thuỷ tù, hạn khô – rất cần kim sinh, thuỷ trợ.',
      'Thu': 'Mẹ vượng con tướng, trong sáng – kỵ thổ làm đục, thuỷ nhiều cần Mậu thổ làm đê.',
      'Đông': 'Thuỷ đương lệnh – hỷ hoả sưởi ấm, mộc tiết tú, thổ ngăn tràn.',
    },
  },
  {
    title: 'Quý Thuỷ – mưa móc, sương sớm', image: 'Âm thuỷ, mưa nhẹ, sương, nước ngầm.',
    poem: 'Trích Thiên Tủy: “Quý thuỷ chí nhược, đạt ư thiên tân. Đắc long nhi vận, công hoá tư thần. Bất sầu hoả thổ, bất luận canh tân. Hợp mậu kiến hoả, hoá tượng tư chân.”',
    nature: 'Kín đáo, nhạy bén, giàu tưởng tượng, trực giác mạnh; nhẹ nhàng mà thấm sâu.',
    strengths: 'Tỉ mỉ, kiên nhẫn, mưu lược, khả năng nghiên cứu và nắm bắt tâm lý.',
    weaknesses: 'Dễ đa nghi, hay lo âu, khép kín; khi yếu thì thiếu quyết đoán.',
    seasonNote: {
      'Xuân': 'Thương quan nắm lệnh, mộc tiết khí – thủ Canh Tân sinh thuỷ, Bính sưởi ấm.',
      'Hạ': 'Thuỷ cạn – rất cần Canh Tân kim sinh nguồn.',
      'Thu': 'Kim sinh thuỷ, thuỷ trong – hỷ Đinh hoả, Giáp mộc tiết tú.',
      'Đông': 'Thuỷ vượng hàn – cần Bính Đinh sưởi ấm, Mậu thổ làm đê.',
    },
  },
];

export interface TenGodInfo { keyword: string; positive: string; negative: string; career: string; male: string; female: string }
export const TEN_GOD_INFO: Record<TenGod, TenGodInfo> = {
  'Tỷ Kiên': { keyword: 'Bản ngã – đồng đội', positive: 'tự lập, tự tôn, kiên trì, giữ nguyên tắc, coi trọng bạn bè', negative: 'cố chấp, bảo thủ, ngang ngạnh, tự cho là đúng', career: 'tự kinh doanh, hợp tác, thể thao, huấn luyện, môi giới', male: 'anh em, bạn bè, đồng nghiệp', female: 'chị em, bạn bè' },
  'Kiếp Tài': { keyword: 'Cạnh tranh – khí phách', positive: 'dám làm, quyết liệt, giao tiếp rộng, nhiệt tình giúp bạn', negative: 'tranh đoạt, liều lĩnh, hao tài, nóng nảy, thích phô trương', career: 'kinh doanh cạnh tranh, bán hàng, đầu tư mạo hiểm, nghề cần gan dạ', male: 'anh em, đối thủ; khắc Tài (vợ)', female: 'anh chị em, bạn bè' },
  'Thực Thần': { keyword: 'Tài hoa – hưởng thụ', positive: 'hiền hoà, rộng lượng, có khiếu ăn nói, văn chương, ẩm thực; sống tự tại', negative: 'lười biếng, thích an nhàn, thiếu chí tiến thủ khi quá vượng', career: 'giáo dục, nghệ thuật, ẩm thực, tư vấn, viết lách, diễn thuyết, nghiên cứu', male: 'cấp dưới, học trò; (con gái theo phép cổ)', female: 'con cái' },
  'Thương Quan': { keyword: 'Sáng tạo – phá cách', positive: 'thông minh, tài hoa, nhanh nhạy, giỏi biểu đạt, dám đổi mới', negative: 'kiêu ngạo, nói thẳng gây mếch lòng, không tuân quy củ, khắc Quan', career: 'nghệ thuật, thiết kế, luật sư, truyền thông, kỹ thuật, kinh doanh sáng tạo', male: 'con cái (theo phép cổ), cấp dưới', female: 'con cái; khắc Quan (chồng)' },
  'Thiên Tài': { keyword: 'Tài lộc động – hào phóng', positive: 'nhạy bén tiền bạc, giao tế rộng, hào phóng, giỏi nắm cơ hội', negative: 'ham đầu cơ, tiêu xài rộng, đa tình, không ổn định', career: 'kinh doanh, buôn bán, tài chính, chứng khoán, dịch vụ, cố vấn', male: 'cha, người tình/thê thiếp', female: 'cha' },
  'Chính Tài': { keyword: 'Tài lộc chính – cần kiệm', positive: 'chăm chỉ, thực tế, giữ tiền, có trách nhiệm với gia đình', negative: 'keo kiệt, bảo thủ, ngại thay đổi; Tài quá nặng thì thiếu tiến thủ', career: 'kế toán, ngân hàng, quản lý tài sản, làm công ăn lương ổn định, bất động sản', male: 'vợ', female: 'cha (một số phái), tài sản' },
  'Thất Sát': { keyword: 'Quyền uy – áp lực', positive: 'quyết đoán, có uy, dám nhận trọng trách, mưu lược, thực quyền', negative: 'hung bạo, đa nghi, áp lực lớn, dễ gặp tiểu nhân, bệnh tật khi không chế', career: 'quân đội, công an, pháp luật, kiểm tra, chính trị, phẫu thuật, quản trị khủng hoảng', male: 'con trai (phép cổ), cấp trên khắt khe', female: 'chồng/người tình (Thiên Quan)' },
  'Chính Quan': { keyword: 'Danh dự – kỷ cương', positive: 'đoan chính, có trách nhiệm, tuân thủ pháp luật, được tín nhiệm', negative: 'rụt rè, câu nệ, sợ sai; quá vượng thì bị gò bó', career: 'công chức, hành chính, quản lý, giáo viên, thẩm phán, doanh nghiệp lớn', male: 'con gái (phép cổ), cấp trên', female: 'chồng' },
  'Thiên Ấn': { keyword: 'Trực giác – kỳ tài', positive: 'thông minh khác người, nhạy cảm, giỏi chuyên môn hẹp, huyền học, sáng chế', negative: 'cô độc, đa nghi, bỏ dở giữa chừng; “Kiêu đoạt Thực” làm hỏng phúc', career: 'y học, kỹ thuật, nghiên cứu, huyền học, tôn giáo, tâm lý, thiết kế, IT', male: 'mẹ kế, dì; thầy dạy nghề', female: 'mẹ kế, dì' },
  'Chính Ấn': { keyword: 'Học vấn – bảo hộ', positive: 'nhân hậu, có học, trọng danh dự, được quý nhân/bề trên che chở', negative: 'ỷ lại, chậm chạp, thiếu thực tế; Ấn quá vượng thì lười biếng', career: 'giáo dục, văn hoá, y tế, từ thiện, hành chính, xuất bản, nghiên cứu', male: 'mẹ', female: 'mẹ' },
};

export interface ElementInfo {
  nature: string; organs: string; color: string; avoidColor: string; direction: string; numbers: string; season: string; time: string;
  careers: string; items: string; foods: string; lifestyle: string;
  excess: string; deficient: string;
}
// Cải vận theo hành – tham khảo "Đổi Vận Cho Người Mệnh Khuyết" (Lý Cư Minh) + Hà Đồ
export const ELEMENT_INFO: Record<Element, ElementInfo> = {
  'Mộc': {
    nature: 'Nhân – sinh trưởng, vươn lên, khoan dung', organs: 'gan, mật, gân, mắt, tóc, thần kinh, tứ chi',
    color: 'xanh lá, xanh lục', avoidColor: 'trắng, ánh kim (Kim khắc Mộc)', direction: 'Đông, Đông Nam', numbers: '3, 8', season: 'mùa Xuân', time: 'sáng sớm 3h–7h (giờ Dần, Mão)',
    careers: 'giáo dục, xuất bản, văn hoá, thời trang dệt may, nông lâm nghiệp, cây cảnh, đồ gỗ, giấy, dược thảo, y học cổ truyền, tư vấn phát triển',
    items: 'cây xanh trong nhà/văn phòng, đồ gỗ, sách, tranh phong cảnh rừng cây, vòng gỗ trầm', foods: 'rau xanh, trái cây tươi, các loại đậu, chè đậu xanh, củ sen, hạt',
    lifestyle: 'Sống gần cây xanh, công viên; đọc sách thường xuyên; dậy sớm đón nắng; du lịch về phía Đông; gần gũi người mệnh Mộc vượng (theo Đổi Vận Cho Người Mệnh Khuyết).',
    excess: 'Mộc quá vượng: dễ cáu gắt, cố chấp; chú ý dạ dày, tỳ vị (mộc khắc thổ), thần kinh căng thẳng.',
    deficient: 'Mộc quá nhược: dễ chóng mặt, hoa mắt, khí huyết không điều, tóc thưa; nặng thì bệnh gan mật, tổn thương chân (Bệnh nguyên – Mộc).',
  },
  'Hỏa': {
    nature: 'Lễ – nhiệt huyết, sáng suốt, lan toả', organs: 'tim, ruột non, máu huyết, mắt, lưỡi, huyết áp',
    color: 'đỏ, hồng, tím, cam', avoidColor: 'đen, xanh nước biển (Thuỷ khắc Hoả)', direction: 'Nam', numbers: '2, 7', season: 'mùa Hạ', time: 'giữa ngày 9h–13h (giờ Tị, Ngọ)',
    careers: 'năng lượng, điện – điện tử, ánh sáng, nhà hàng, truyền thông – quảng cáo, giải trí, mỹ phẩm, giáo dục truyền cảm hứng, công nghệ hiển thị',
    items: 'đèn sáng, nến, đá màu đỏ/tím (thạch anh tím), tranh mặt trời, để ánh nắng vào phòng khách', foods: 'đồ ấm nóng, thịt dê, rượu vang đỏ (vừa phải), gừng, trà ấm',
    lifestyle: 'Đón nắng buổi sáng, phòng ở nhiều ánh sáng; vận động ra mồ hôi; du lịch phương Nam; dùng đỏ – vàng – tím (theo Đổi Vận – Mệnh khuyết Hoả).',
    excess: 'Hoả quá vượng: hoả khí bốc, mất ngủ, đau đầu, huyết áp, mắt đỏ, nóng nảy.',
    deficient: 'Hoả quá nhược: dễ bệnh tim, tuần hoàn kém, chân tay lạnh, mắt kém; trung niên tràng vị không tốt (Bệnh nguyên – Hoả).',
  },
  'Thổ': {
    nature: 'Tín – ổn định, bao dung, tích luỹ', organs: 'lá lách, dạ dày, cơ bắp, da thịt, miệng',
    color: 'vàng, nâu đất, be', avoidColor: 'xanh lá (Mộc khắc Thổ)', direction: 'Trung tâm, Đông Bắc, Tây Nam', numbers: '5, 10', season: '18 ngày cuối mỗi mùa (tứ quý)', time: 'giờ Thìn, Tuất, Sửu, Mùi',
    careers: 'bất động sản, xây dựng, nông nghiệp, gốm sứ, khai khoáng, kho vận, bảo hiểm, tư vấn trung gian, quản lý hành chính',
    items: 'đồ gốm sứ, đá tự nhiên, pha lê vàng, tượng đá; nhà cửa vững chãi', foods: 'ngũ cốc, khoai, bí đỏ, ngô, đồ ngọt tự nhiên, thức ăn vàng',
    lifestyle: 'Giữ nếp sinh hoạt điều độ, ăn đúng bữa; gần gũi đất (làm vườn, gốm); ở nơi bằng phẳng vững chãi.',
    excess: 'Thổ quá vượng: đầy bụng, chậm tiêu, nặng nề, dễ hói; tính bảo thủ, chậm chạp.',
    deficient: 'Thổ quá nhược: sắc mặt vàng, ăn kém, mệt mỏi, phù thũng, rối loạn tiêu hoá, bệnh ngoài da (Bệnh nguyên – Thổ).',
  },
  'Kim': {
    nature: 'Nghĩa – quyết đoán, chính xác, kỷ luật', organs: 'phổi, ruột già, khí quản, mũi, da, xương, răng',
    color: 'trắng, bạc, vàng kim, xám ánh kim', avoidColor: 'đỏ (Hoả khắc Kim)', direction: 'Tây, Tây Bắc', numbers: '4, 9', season: 'mùa Thu', time: 'chiều 15h–19h (giờ Thân, Dậu)',
    careers: 'tài chính – ngân hàng, kim khí, cơ khí, ô tô, trang sức, công nghệ phần cứng, pháp luật, quân đội – công an, phẫu thuật',
    items: 'trang sức vàng bạc, đồng hồ kim loại, chuông/thanh la bằng đồng, gương, đồ trắng sáng', foods: 'thực phẩm màu trắng: cơm, củ cải, lê, hạnh nhân, ngó sen trắng, nấm trắng',
    lifestyle: 'Tập thở, thể dục buổi chiều; giữ không gian gọn gàng, kim loại sáng bóng; du lịch về phía Tây (theo Đổi Vận – Mệnh khuyết Kim).',
    excess: 'Kim quá vượng: dễ chấn thương do va chạm, kim khí; khô da, bí tiểu; tính cứng nhắc.',
    deficient: 'Kim quá nhược: khí hư, ho, cảm mạo, da khô, đau khớp, đường hô hấp – phổi yếu (Bệnh nguyên – Kim).',
  },
  'Thủy': {
    nature: 'Trí – linh hoạt, sâu sắc, lưu thông', organs: 'thận, bàng quang, tai, xương tuỷ, hệ sinh dục, tiết niệu',
    color: 'đen, xanh nước biển, xanh lam', avoidColor: 'vàng đất (Thổ khắc Thuỷ)', direction: 'Bắc', numbers: '1, 6', season: 'mùa Đông', time: 'tối – đêm 21h–1h (giờ Hợi, Tý)',
    careers: 'thương mại – xuất nhập khẩu, vận tải, du lịch, thuỷ sản, nước giải khát, truyền thông – IT, logistics, tư vấn, nghiên cứu',
    items: 'bể cá, đài phun nước, tranh sông nước, đồ màu xanh lam/đen, pha lê trong', foods: 'hải sản, cá, rong biển, đậu đen, nước ép, uống đủ nước',
    lifestyle: 'Sống gần sông hồ biển; bơi lội; uống đủ nước, ngủ trưa; du lịch phương Bắc; nuôi cá (theo Đổi Vận – Mệnh khuyết Thuỷ).',
    excess: 'Thuỷ quá vượng: hàn thấp, khí không thông, ho suyễn, phong thấp; tính dễ buông thả.',
    deficient: 'Thuỷ quá nhược: thận yếu, tiết niệu, xuất huyết não, cận thị (Bệnh nguyên – Thuỷ).',
  },
};

/** Hỷ kỵ của từng hành theo bốn mùa – Thiên Lý Mệnh Cảo, chương Ngũ hành */
export const ELEMENT_SEASON: Record<Element, Record<Season, string>> = {
  'Kim': {
    'Xuân': 'Kim mùa Xuân (Tù): khí chưa tận, quý ở gặp Hoả khí thì vinh; thể nhu nhược, thích Thổ ít mà được sinh; gặp hoả thì mừng có kim tỷ trợ. Kỵ thuỷ thịnh làm kim lạnh, mộc thịnh làm kim gãy.',
    'Hạ': 'Kim mùa Hạ (Tử): tính nhu, gặp thổ mỏng thì có ích, cần kim tỷ trợ; gặp thuỷ thì được nhuận. Kỵ hoả nhiều nung chảy, mộc thịnh hại thân, thổ dày chôn vùi.',
    'Thu': 'Kim mùa Thu (Vượng): gặp hoả nung luyện thành đỉnh chung; thấy thuỷ thì tú khí, tinh thần phát việt; gặp mộc thì thi hành vót gọt, trổ uy quyền. Kỵ thêm kim càng cương (cương quá thì khuyết), gặp thổ sinh tiếp lại ngu trọc.',
    'Đông': 'Kim mùa Đông (Hưu): hình thể sợ lạnh, gặp thổ chế thuỷ thì kim không lạnh; hoả thổ cùng đến làm ấm dưỡng kim càng diệu. Kỵ mộc nhiều, thuỷ thịnh làm kim chìm.',
  },
  'Mộc': {
    'Xuân': 'Mộc mùa Xuân (Vượng): dư hàn còn, thích hoả làm ấm; được thuỷ thì thông suốt; gặp thổ mỏng thì của cải phong phú. Kỵ thổ nhiều tổn lực, kim nặng thương tổn.',
    'Hạ': 'Mộc mùa Hạ (Hưu): có gốc thì lá kết, cần thuỷ thịnh làm ẩm. Kỵ hoả vượng thiêu đốt, thổ dày gặp hoạ, kim nhiều thương tàn.',
    'Thu': 'Mộc mùa Thu (Tử): khí thê lương, đầu thu hỷ thuỷ thổ tương sinh; giữa thu kim cứng có gốc để vót mộc; đến Hàn Lộ gặp hoả thì mộc đầy đủ. Kỵ thổ dày không gánh nổi Tài, sau Sương Giáng thuỷ thịnh thì mộc trôi.',
    'Đông': 'Mộc mùa Đông (Tướng): được kim nhiều lấy làm dụng, gặp hoả thì thành công, cần thổ dày bồi dưỡng. Kỵ thuỷ thịnh mất hình.',
  },
  'Thủy': {
    'Xuân': 'Thuỷ mùa Xuân (Hưu): có thổ thịnh thì không lo tràn; gặp mộc làm nên việc lớn; gặp kim được sinh; rất thích hoả tương tế. Kỵ thuỷ thịnh sụp đổ, kim nhiều hoả thịnh đều không hợp.',
    'Hạ': 'Thuỷ mùa Hạ (Tù): đang khô hạn, rất thích kim sinh, mong đồng loại bang phù. Kỵ hoả vượng khô cạn, mộc thịnh hao khí, thổ nặng bế tắc dòng chảy.',
    'Thu': 'Thuỷ mùa Thu (Tướng): mẹ vượng con tướng, ngoài sáng trong trong; gặp kim càng sáng, “hoả đa tài thịnh, mộc trọng thê vinh”. Kỵ thổ làm đục, thuỷ quá nhiều tràn lan.',
    'Đông': 'Thuỷ mùa Đông (Vượng): chuyên quyền nắm lệnh, gặp hoả thêm ấm, mộc thịnh hữu tình, gặp thổ không tràn. Kỵ kim nhiều (vô nghĩa), thổ nhiều (vô ân).',
  },
  'Hỏa': {
    'Xuân': 'Hoả mùa Xuân (Tướng): mẹ vượng con tướng; thấy kim có thể làm việc lớn; mộc ít thì được sinh phù; thuỷ vừa phải thành “thuỷ hoả ký tế”. Kỵ hoả thịnh quá khô, thổ nhiều làm tối.',
    'Hạ': 'Hoả mùa Hạ (Vượng): gặp kim thì lương thiện, được thổ thành giá sắc (cần thuỷ kèm). Kỵ thêm hoả càng nguy, gặp mộc thì bệnh hoạn.',
    'Thu': 'Hoả mùa Thu (Tù): tính dừng, hình ngưng nghỉ; trùng điệp gặp hoả mà sáng, gặp mộc được sinh. Kỵ thổ nặng che sáng, thuỷ khắc dập tắt, kim nhiều tổn hình.',
    'Đông': 'Hoả mùa Đông (Tử): hình tuyệt, có mộc sinh thì được cứu; có thổ chế thuỷ là vinh. Kỵ kim không gánh nổi Tài, thuỷ khắc gặp tai ương.',
  },
  'Thổ': {
    'Xuân': 'Thổ mùa Xuân (Tử): thế hư nhược, mừng hoả sinh phù, thổ tỷ trợ; kim chế mộc thành tường vách. Kỵ mộc thái quá, thuỷ tràn lan.',
    'Hạ': 'Thổ mùa Hạ (Tướng): thế táo khô, gặp thuỷ thịnh thì tư nhuận thành công, có thêm kim sinh thuỷ càng tốt. Kỵ hoả vượng làm cháy khét, thổ nhiều bế tắc.',
    'Thu': 'Thổ mùa Thu (Hưu): con vượng mẹ suy, không ngại hoả trọng; thích mộc thịnh chế phục thuần lương. Kỵ kim nhiều hao khí, thuỷ tràn không còn tường vách.',
    'Đông': 'Thổ mùa Đông (Tù): ngoài lạnh trong ấm; mộc ấm hoả ấm thì đông hoá xuân, thêm thổ trợ càng đẹp. Kỵ kim thuỷ hàn lạnh làm thổ đóng băng.',
  },
};

export const PALACE_MEANING = [
  { pillar: 'Trụ năm', age: '1–18 tuổi', people: 'tổ tiên, ông bà, cha mẹ, người ngoài, bề trên', body: 'chân, giò, tứ chi', place: 'phương xa, nơi gốc gác' },
  { pillar: 'Trụ tháng', age: '18–35 tuổi', people: 'cha mẹ, anh chị em, đồng học, đồng nghiệp, lãnh đạo', body: 'gáy, vai, lưng', place: 'quê quán, sản nghiệp tổ tiên, đơn vị công tác' },
  { pillar: 'Trụ ngày', age: '35–55 tuổi', people: 'bản thân (can) & vợ/chồng (chi – cung phu thê)', body: 'ngũ tạng lục phủ, tim, não', place: 'nhà ở hiện tại, phòng ngủ, tài sản riêng' },
  { pillar: 'Trụ giờ', age: 'sau 55 tuổi', people: 'con cái, học trò, cấp dưới, bạn trẻ', body: 'đầu, mặt, tay, mắt, miệng, cơ quan bài tiết', place: 'cửa nhà, xe cộ, quần áo, đồ dùng' },
];

export const PATTERN_INFO: Record<string, string> = {
  'Chính Quan cách': 'Người đoan chính, trọng danh dự, hợp con đường công quyền – tổ chức. Quý ở Quan thanh (không Sát hỗn), có Tài sinh, Ấn hộ; sợ Thương Quan phá, hình xung.',
  'Thất Sát cách': 'Có khí phách, chí lớn, hợp nghề cần quyền lực – kỷ luật. Sát cần chế (Thực thần) hoặc hoá (Ấn); có chế hoá thì “Sát biến thành quyền”, không chế thì Sát công thân.',
  'Chính Tài cách': 'Thực tế, cần mẫn, giữ của; giàu nhờ tích luỹ đều đặn. Thân cường gánh được Tài là phúc; sợ Tỷ Kiếp tranh đoạt.',
  'Thiên Tài cách': 'Nhạy bén, hào phóng, giỏi nắm thời cơ – tài đến từ kinh doanh, đầu tư. Thân vượng Tài vượng thì đại phú; thân nhược thì tài nhiều mà khó giữ.',
  'Chính Ấn cách': 'Học vấn, nhân hậu, được che chở; hợp giáo dục – văn hoá – hành chính. Ấn khinh hỷ Quan Sát sinh; Ấn trọng hỷ Tài chế; sợ Tài phá Ấn khi thân nhược.',
  'Thiên Ấn cách': 'Thông minh độc đáo, giỏi chuyên môn đặc thù, huyền học, y thuật, kỹ thuật. Sợ Kiêu đoạt Thực; có Tài chế Kiêu thì thành.',
  'Thực Thần cách': 'Tài hoa, phúc hậu, sống an nhàn hưởng thụ; Thực sinh Tài là phú, Thực chế Sát là quý. Sợ Kiêu thần đoạt Thực.',
  'Thương Quan cách': 'Thông minh, sáng tạo, giỏi biểu đạt, khó chịu gò bó. Thương quan sinh Tài thì phú, Thương quan bội Ấn thì quý; kỵ Thương quan kiến Quan.',
  'Kiến Lộc cách': 'Lộc ở nguyệt lệnh – thân có gốc vững, tự lập thân, ít nhờ tổ nghiệp. Cần Tài Quan để dụng (Lộc kiếp dụng Quan/Tài); không có Tài Quan thì bôn ba.',
  'Kiến Lộc (Nguyệt Kiếp) cách': 'Nguyệt kiếp – thân vượng tự lập, cần Tài Quan hoặc Thực Thương để dụng; Tỷ Kiếp nhiều dễ hao tài.',
  'Nguyệt Kiếp cách': 'Kiếp tài nắm lệnh – cạnh tranh mạnh, cần Quan Sát chế Kiếp hoặc Thực Thương hoá Kiếp.',
  'Dương Nhận cách': 'Cương mãnh, dám làm, hợp võ chức – quyền lực. Nhận cần Sát chế (Nhận Sát tương tế) mới thành đại khí; không chế thì dễ hung hiểm, phá tài.',
};

export const STAGE_MEANING: Record<string, string> = {
  'Trường sinh': 'khởi đầu, nảy sinh – sinh khí dồi dào', 'Mộc dục': 'vừa sinh ra, non nớt – dễ thay đổi, đào hoa', 'Quan đới': 'dần mạnh lên, trưởng thành',
  'Lâm quan': 'trưởng thành, tự lập (Lộc)', 'Đế vượng': 'thịnh cực', 'Suy': 'bắt đầu giảm', 'Bệnh': 'khốn đốn', 'Tử': 'suy tàn', 'Mộ': 'thu tàng, cất giữ',
  'Tuyệt': 'khí tận', 'Thai': 'khí bắt đầu kết thai', 'Dưỡng': 'đang nuôi mầm',
};

export const SOURCES = [
  'Trích Thiên Tủy (Kinh Đạo) – Nhậm Thiết Tiều bình chú',
  'Tử Bình Chân Thuyên – Từ Nhạc Ngô bình chú (kèm Bát Tự Dụng Thần Đề Yếu, Tử Bình Bệnh Nguyên)',
  'Thiên Lý Mệnh Cảo – Vi Thiên Lý',
  'Mệnh Lý Huyền Cơ Tham Bí',
  'Manh phái sơ – trung – cao cấp mệnh lý học',
  'Lục Thân cao cấp diện thụ',
  'Đổi Vận Cho Người Mệnh Khuyết (Xuân Hạ, Thu Đông) – Lý Cư Minh',
  'Khí thế lưu thông',
];
