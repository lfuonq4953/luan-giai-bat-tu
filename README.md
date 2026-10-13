# Luận Giải Lá Số – Bát Tự & Tử Vi

Web nhận **văn bản lá số** (thông tin chung, 12 cung Tử Vi, tứ trụ Bát Tự, đại vận, lưu niên) và trả về bài luận chi tiết, viết bằng lời dễ hiểu.

**Dùng thử:** https://lfuonq4953.github.io/luan-giai-bat-tu/

## Tính năng

- **Tóm tắt dễ hiểu** – 9 thẻ viết bằng lời thường ở đầu trang: bạn là người thế nào, điều giúp bạn tốt lên, công việc, tiền bạc, tình cảm, sức khoẻ, 10 năm hiện tại, năm đang xem, nên làm – nên tránh. Mỗi thẻ có mục "Căn cứ chuyên môn" để đối chiếu.
- **Bát Tự (phân tích chuyên sâu)** – engine quy tắc theo Tử Bình Chân Thuyên, Trích Thiên Tủy, Thiên Lý Mệnh Cảo, Mệnh Lý Huyền Cơ Tham Bí, Manh phái…:
  - vượng suy 9 mức, cách cục (bát cách + ngoại cách), dụng/hỷ/kỵ thần, Dụng Thần Đề Yếu;
  - tính cách, sự nghiệp – tài lộc, lục thân, sức khoẻ;
  - đại vận, lưu niên, thần sát, cải vận.
- **Tử Vi Đẩu Số** – bàn 12 cung, chấm cung theo chính tinh (miếu/hãm), cát/sát tinh và tứ hoá; đại hạn hiện tại, lưu Mệnh, lưu tứ hoá năm xem. *(Dựa trên kiến thức phổ thông, vì thư mục tài liệu hiện chỉ có sách Bát Tự.)*
- **Giải thích thuật ngữ** – các từ chuyên môn được gạch chân, bấm vào để xem nghĩa; cuối trang có bảng thuật ngữ.
- **Bài luận AI (tuỳ chọn, chỉ bản Vercel)** – có `GEMINI_API_KEY` (Google Gemini) hoặc `ANTHROPIC_API_KEY` (Claude) thì nút "Viết bài luận" sẽ nhờ AI viết lại kết quả thành bài văn liền mạch, dễ hiểu. AI không được đổi kết luận của engine.

Phần đọc văn bản và luận giải chạy hoàn toàn bằng quy tắc trên trình duyệt: **không cần AI, không cần máy chủ**, văn bản lá số không gửi đi đâu.

## Cách dùng

1. **Lập lá số Bát Tự** tại https://tuvi.vn/lap-la-so-bat-tu-tu-tru (nhập họ tên, ngày giờ sinh, giới tính) → chụp màn hình toàn bộ lá số, cả phần đại vận. Có ảnh lá số Tử Vi thì chụp thêm.
2. **Đổi ảnh sang văn bản** bằng Gemini (https://gemini.google.com): gửi ảnh kèm câu lệnh mẫu (trên web có nút "Sao chép câu lệnh"; nội dung nằm ở `src/lib/geminiPrompt.ts`), rồi sao chép văn bản Gemini trả về.
3. **Dán vào web** → bấm **Luận giải**. Tứ trụ bị chép sai thì bấm **Sửa tứ trụ**.

Web tự bỏ qua định dạng Markdown Gemini hay thêm (khối code, chữ đậm, tiêu đề #, gạch đầu dòng). Mẫu văn bản đầy đủ: `samples/la-so-mau.txt`.

---

## Đưa web lên mạng

### Cách 1 – GitHub Pages từ thư mục `/docs` (đang dùng, không cần GitHub Actions)

Repo có sẵn bản web dựng sẵn: `docs/index.html` (kèm file rỗng `docs/.nojekyll`).

1. Trên GitHub: repo → **Settings → Pages → Build and deployment**.
2. **Source:** Deploy from a branch · **Branch:** `main` · **Folder:** `/docs` → **Save**.
3. Chờ 1–2 phút, web chạy tại `https://lfuonq4953.github.io/luan-giai-bat-tu/`.

> Nếu trang chỉ hiện nội dung README thì Pages vẫn đang để thư mục `/ (root)` – đổi sang `/docs`.

### Cách 2 – Vercel (đầy đủ, có bài luận AI)

1. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New… → Project** → chọn repo `luan-giai-bat-tu`.
2. Framework tự nhận là Next.js, giữ nguyên cấu hình → **Deploy**.
3. (Tuỳ chọn) Project → **Settings → Environment Variables**: thêm `GEMINI_API_KEY` (lấy miễn phí tại https://aistudio.google.com/apikey) hoặc `ANTHROPIC_API_KEY` → **Redeploy**.

Vercel tự build từ GitHub, không dùng GitHub Actions. Mỗi lần push lên `main`, Vercel tự cập nhật.

### Cách 3 – GitHub Actions (tuỳ chọn)

`.github/workflows/ci.yml` tự chạy kiểm thử + build mỗi lần push; `pages.yml` tự deploy Pages. Bản gốc của hai file nằm ở `deploy/github-workflows/`.

- Muốn dùng `pages.yml` thì Pages phải đặt **Source: GitHub Actions** (thay cho cách 1).
- Nếu tài khoản GitHub bị khoá Actions (báo lỗi *"account is locked due to a billing issue"*), các job sẽ báo lỗi ngay. Khi đó:
  - xử lý tại https://github.com/settings/billing, **hoặc**
  - tắt Actions (Settings → Actions → General → *Disable actions*) / xoá thư mục `.github/workflows` để không nhận email báo lỗi. Cách 1 và 2 vẫn chạy bình thường.

---

## Cập nhật web sau khi sửa code

```powershell
npm install              # lần đầu
npm test                 # kiểm thử engine + bộ đọc văn bản
npm run build:static     # dựng lại docs/index.html (bản GitHub Pages)
git add .
git commit -m "Mô tả thay đổi"
git push
```

Quên chạy `npm run build:static` thì GitHub Pages vẫn hiện bản cũ (Vercel thì tự build, không cần bước này).

## Chạy trên máy

Cần Node.js 18.18 trở lên (khuyên dùng 20).

```powershell
npm install
npm run dev          # mở http://localhost:3000
npm run sample       # in bài luận lá số mẫu ra terminal
```

Bật bài luận AI khi chạy trên máy: chép `.env.example` thành `.env.local`, điền `GEMINI_API_KEY` hoặc `ANTHROPIC_API_KEY`. File `.env.local` đã nằm trong `.gitignore` nên khoá API không bị đẩy lên GitHub.

| Biến | Ý nghĩa |
|---|---|
| `GEMINI_API_KEY` | Khoá Google Gemini (ưu tiên dùng nếu có) |
| `GEMINI_MODEL` | Mặc định `gemini-2.5-flash` |
| `ANTHROPIC_API_KEY` | Khoá Claude |
| `ANTHROPIC_MODEL` | Model Claude |
| `AI_PROVIDER` | Ép chọn `gemini` hoặc `anthropic` khi có cả hai khoá |

## Xử lý sự cố khi đưa lên GitHub

| Thông báo | Cách xử lý |
|---|---|
| `remote origin already exists` | Đổi địa chỉ: `git remote set-url origin https://github.com/lfuonq4953/luan-giai-bat-tu.git` |
| `Repository not found` | Repo chưa tạo trên GitHub, sai tên tài khoản/repo, hoặc máy đang đăng nhập tài khoản khác (xoá mục `git:https://github.com` trong Windows Credential Manager rồi push lại) |
| `src refspec main does not match any` | Chưa có commit: `git add .` → `git commit -m "..."` → `git push -u origin main` |
| CI báo *account is locked due to a billing issue* | Lỗi tài khoản, không phải lỗi code – xem Cách 3 ở trên |
| Pages chỉ hiện README | Đổi Pages sang thư mục `/docs` (Cách 1) |

---

## Định dạng văn bản lá số

Bộ đọc nhận:

| Mục | Dòng mẫu |
|---|---|
| Năm xem | `(năm xem 2026 Bính Ngọ, 22 tuổi)` hoặc dòng lưu niên có `- NĂM XEM` |
| Giới tính | `Giới tính: Nam, Âm Nam` |
| Tứ trụ | `Tứ trụ: Ất Dậu (năm) - Ất Dậu (tháng) - Tân Dậu (ngày) - Ất Mùi (giờ)` hoặc các dòng `Trụ năm: …` |
| Đại vận | `Quý Mùi 18-27 tuổi (2023)` |
| 12 cung Tử Vi | `1. MỆNH (Mão), đại hạn 5, …` + các dòng `Chính tinh:`, `Phụ tinh:`, `Lưu 2026:`, `Tràng sinh:` |

Thiếu phần Tử Vi thì web chỉ luận Bát Tự; thiếu đại vận thì tự suy theo trụ tháng và giới tính.

## API (bản Next.js / Vercel)

- `POST /api/analyze` – body `{ "text": "<văn bản lá số>" }` → JSON kết quả (Bát Tự + Tử Vi).
- `POST /api/narrate` – body `{ "text": "…" }` → `{ "markdown": "…" }` (cần khoá AI).
- `GET /api/narrate` → `{ "enabled": true|false }`.

## Cấu trúc mã

```
src/
  app/                  giao diện Next.js + API (analyze, narrate)
  components/           BaziApp (nhập văn bản), PlainView (tóm tắt dễ hiểu), ResultView (Bát Tự),
                        TuViView (bàn 12 cung), Gloss (thuật ngữ), ConfirmForm (sửa tứ trụ)
  lib/
    parseText.ts        đọc văn bản lá số → dữ liệu
    reading.ts          gộp Bát Tự + Tử Vi
    plain.ts            chuyển kết quả sang lời thường (thẻ tóm tắt)
    glossary.ts         từ điển thuật ngữ
    ai.ts, condense.ts  gọi Gemini/Claude và lời nhắc cho AI
    battu/              engine Bát Tự (vượng suy, cách cục, dụng thần, vận, thần sát, tri thức từ sách)
    tuvi/               tri thức & luận Tử Vi
preview/                mã dựng bản tĩnh (esbuild) → docs/index.html
docs/index.html         bản web tĩnh cho GitHub Pages
docs/KIEN_THUC_BAT_TU.md  tổng hợp kiến thức từ thư mục tài liệu
deploy/github-workflows/  bản gốc các file GitHub Actions
samples/la-so-mau.txt   văn bản lá số mẫu
```

Muốn chỉnh cách diễn đạt: lời thường ở `src/lib/plain.ts`, thuật ngữ ở `src/lib/glossary.ts`, lời luận chuyên sâu ở `src/lib/battu/knowledge/texts.ts` và `src/lib/tuvi/knowledge.ts`.

---

Kết quả mang tính tham khảo theo mệnh lý cổ; phần sức khoẻ không thay thế chẩn đoán y khoa.
