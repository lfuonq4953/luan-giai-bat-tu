// Gọi Claude Messages API qua fetch (chỉ dùng phía server – không lộ API key ra trình duyệt).
const API_URL = 'https://api.anthropic.com/v1/messages';

export const hasApiKey = () => !!process.env.ANTHROPIC_API_KEY;
export const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

type Block =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

export async function callClaude(content: Block[], opts: { system?: string; maxTokens?: number } = {}): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('Chưa cấu hình ANTHROPIC_API_KEY trong file .env.local');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL(),
      max_tokens: opts.maxTokens ?? 2000,
      ...(opts.system ? { system: opts.system } : {}),
      messages: [{ role: 'user', content }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude API lỗi ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n');
}

export const NARRATE_SYSTEM = `Bạn là một thầy luận mệnh viết tiếng Việt, văn phong mạch lạc, ấm áp, tôn trọng người xem.
Bạn nhận kết quả phân tích đã tính sẵn gồm: (1) Bát Tự – tính theo các sách Trích Thiên Tủy, Tử Bình Chân Thuyên, Thiên Lý Mệnh Cảo, Mệnh Lý Huyền Cơ Tham Bí, Manh phái; (2) Tử Vi Đẩu Số – phần bổ trợ.
CHỈ dựa vào dữ liệu đó. Không tự đổi dụng thần, cách cục, vượng suy, không bịa sao hay dữ kiện. Khi Bát Tự và Tử Vi cùng chỉ một hướng thì nhấn mạnh; khi khác nhau thì nêu cả hai và ưu tiên Bát Tự.
Không tiên đoán tử vong hay bệnh hiểm nghèo; phần sức khoẻ chỉ mang tính phòng ngừa. Nhắc nhẹ rằng mệnh lý là tham khảo, nỗ lực của con người mới quyết định.
Trình bày Markdown với các tiêu đề ##: Tổng quan · Tính cách · Sự nghiệp · Tài chính · Tình duyên · Sức khoẻ · Đại vận hiện tại · Vận hạn năm xem · Lời khuyên.`;
