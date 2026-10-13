// Gọi mô hình AI để viết bài luận (chỉ chạy phía server – khoá API không gửi xuống trình duyệt).
// Hỗ trợ Google Gemini (GEMINI_API_KEY) và Anthropic Claude (ANTHROPIC_API_KEY).
// Có cả hai khoá thì chọn theo AI_PROVIDER=gemini|anthropic (mặc định ưu tiên Gemini).

type Provider = 'gemini' | 'anthropic';

export function provider(): Provider | null {
  const want = (process.env.AI_PROVIDER || '').toLowerCase();
  const hasG = !!process.env.GEMINI_API_KEY, hasA = !!process.env.ANTHROPIC_API_KEY;
  if (want === 'anthropic' && hasA) return 'anthropic';
  if (want === 'gemini' && hasG) return 'gemini';
  if (hasG) return 'gemini';
  if (hasA) return 'anthropic';
  return null;
}
export const hasApiKey = () => provider() !== null;

export async function callAI(prompt: string, opts: { system?: string; maxTokens?: number } = {}): Promise<string> {
  const p = provider();
  if (p === 'gemini') return callGemini(prompt, opts);
  if (p === 'anthropic') return callClaude(prompt, opts);
  throw new Error('Chưa cấu hình GEMINI_API_KEY hoặc ANTHROPIC_API_KEY.');
}

async function callGemini(prompt: string, opts: { system?: string; maxTokens?: number }): Promise<string> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY! },
    body: JSON.stringify({
      ...(opts.system ? { systemInstruction: { parts: [{ text: opts.system }] } } : {}),
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // Gemini 2.5 tính cả phần "suy nghĩ" vào giới hạn token nên để rộng
      generationConfig: { maxOutputTokens: Math.max(8192, opts.maxTokens ?? 0), temperature: 0.7 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[] };
  const c = data.candidates?.[0];
  const text = (c?.content?.parts ?? []).filter((x) => !x.thought).map((x) => x.text ?? '').join('');
  if (!text) throw new Error(`Gemini không trả về nội dung${c?.finishReason ? ` (finishReason: ${c.finishReason})` : ''}.`);
  return text;
}

async function callClaude(prompt: string, opts: { system?: string; maxTokens?: number }): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: opts.maxTokens ?? 4000,
      ...(opts.system ? { system: opts.system } : {}),
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n');
}

export const NARRATE_SYSTEM = `Bạn là một người tư vấn mệnh lý viết tiếng Việt cho NGƯỜI BÌNH THƯỜNG – không học mệnh lý. Văn phong ấm áp, gần gũi, rõ ràng như đang nói chuyện trực tiếp, xưng "bạn".
Bạn nhận kết quả phân tích đã tính sẵn gồm: (0) TÓM TẮT DỄ HIỂU – đã chuyển sang lời thường; (1) Bát Tự – tính theo các sách Trích Thiên Tủy, Tử Bình Chân Thuyên, Thiên Lý Mệnh Cảo, Mệnh Lý Huyền Cơ Tham Bí, Manh phái; (2) Tử Vi Đẩu Số – phần bổ trợ.
CHỈ dựa vào dữ liệu đó. Không tự đổi dụng thần, cách cục, vượng suy, không bịa sao hay dữ kiện. Khi Bát Tự và Tử Vi cùng chỉ một hướng thì nhấn mạnh; khi khác nhau thì nêu cả hai và ưu tiên Bát Tự.

CÁCH VIẾT:
- Ưu tiên ý nghĩa đời thường: tính cách, công việc, tiền bạc, tình cảm, sức khoẻ, thời điểm thuận/khó, việc nên làm. Lấy phần TÓM TẮT DỄ HIỂU làm khung.
- Hạn chế thuật ngữ (nhật chủ, dụng thần, thập thần, cách cục, Thực Thương, Quan Sát, đại vận, hoá kỵ…). Nếu cần nhắc, giải thích ngay trong ngoặc bằng lời thường, ví dụ: "dụng thần (yếu tố có lợi nhất cho bạn) là Mộc".
- Không liệt kê can chi, tên sao dày đặc; mỗi đoạn tối đa 1–2 tên chuyên môn.
- Câu ngắn, đoạn ngắn (2–4 câu). Dùng gạch đầu dòng cho lời khuyên cụ thể, làm được ngay.
- Nói về thời điểm bằng năm dương lịch và độ tuổi, không dùng tên can chi làm mốc chính.
- Không tiên đoán tử vong hay bệnh hiểm nghèo; phần sức khoẻ chỉ mang tính phòng ngừa. Nhắc nhẹ rằng mệnh lý là tham khảo, nỗ lực của con người mới quyết định.

Trình bày Markdown với các tiêu đề ##: Tóm lại trong 3 câu · Tính cách · Công việc · Tiền bạc · Tình cảm · Sức khoẻ · 10 năm hiện tại · Năm đang xem · Lời khuyên. Cuối bài có mục ## Thuật ngữ đã nhắc – giải thích 1 dòng cho mỗi thuật ngữ đã dùng (nếu có).`;
