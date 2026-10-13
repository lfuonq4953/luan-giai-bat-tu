# Luận Giải Lá Số – Bát Tự & Tử Vi

Web nhận **văn bản lá số** (thông tin chung, 12 cung Tử Vi, tứ trụ Bát Tự, đại vận, lưu niên – như file `samples/la-so-mau.txt`) và trả về bài luận chi tiết:

- **Bát Tự** – engine quy tắc theo Tử Bình Chân Thuyên, Trích Thiên Tủy, Thiên Lý Mệnh Cảo, Mệnh Lý Huyền Cơ Tham Bí, Manh phái…: vượng suy 9 mức, cách cục (bát cách + ngoại cách), dụng/hỷ/kỵ thần, Dụng Thần Đề Yếu, tính cách, sự nghiệp – tài lộc, lục thân, sức khoẻ, đại vận, lưu niên, thần sát, cải vận.
- **Tử Vi Đẩu Số** – bàn 12 cung, chấm cung theo chính tinh (miếu/hãm) + cát/sát tinh + tứ hoá, luận Mệnh, Quan, Tài, Phu Thê, Tật Ách, gia đạo, đại hạn hiện tại, lưu Mệnh và lưu tứ hoá năm xem. *(Phần này dựa trên kiến thức phổ thông – thư mục tài liệu hiện chỉ có sách Bát Tự.)*
- **Tóm tắt dễ hiểu** – đầu trang kết quả có 9 thẻ viết bằng lời thường (bạn là người thế nào, điều giúp bạn tốt lên, công việc, tiền bạc, tình cảm, sức khoẻ, 10 năm hiện tại, năm xem, nên làm – nên tránh). Mỗi thẻ có mục “Căn cứ chuyên môn”. Trong phần chuyên sâu, thuật ngữ được gạch chân – bấm vào để xem giải thích (`src/lib/glossary.ts`); cuối trang có bảng thuật ngữ.
- **Bài luận AI (tuỳ chọn)** – nếu cấu hình `GEMINI_API_KEY` (Google Gemini) hoặc `ANTHROPIC_API_KEY` (Claude), nút "Viết bài luận" gửi kết quả engine cho AI để viết thành bài văn liền mạch (AI không được đổi kết luận của engine).

Việc đọc văn bản và luận giải chạy hoàn toàn bằng quy tắc, **không cần AI, không cần máy chủ**.

## Chạy trên máy

Cần Node.js 18.18 trở lên (khuyên dùng 20).

```bash
npm install
npm run dev          # mở http://localhost:3000
npm test             # kiểm thử engine + bộ đọc văn bản
npm run sample       # in bài luận lá số mẫu ra terminal
```

Muốn bật bài luận AI: chép `.env.example` thành `.env.local` và điền `GEMINI_API_KEY` (lấy miễn phí tại https://aistudio.google.com/apikey) hoặc `ANTHROPIC_API_KEY`.

## Đưa lên GitHub

**Cách 1 – GitHub Desktop (không cần dòng lệnh):** File → Add local repository → chọn thư mục này → "create a repository" → Publish repository.

**Cách 2 – dòng lệnh:**

```bash
git init
git add .
git commit -m "Luận giải lá số Bát Tự & Tử Vi"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/luan-giai-la-so.git
git push -u origin main
```

`.gitignore` đã loại `node_modules`, `.next`, `.env.local` (khoá API không bao giờ bị đẩy lên GitHub).

**Trước khi push lần đầu:** tạo thư mục `.github/workflows` và chép 2 file `ci.yml`, `pages.yml` từ `deploy/github-workflows/` vào (công cụ ghi file không được phép tạo thẳng thư mục `.github`). Khi đó mỗi lần push, GitHub Actions tự chạy kiểm thử, kiểm tra kiểu và build.

## Chạy web online

### Phương án A – Vercel (đầy đủ, có bài luận AI)

1. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New… → Project** → chọn repo.
2. Framework tự nhận là Next.js, giữ nguyên cấu hình → **Deploy**.
3. (Tuỳ chọn) Project → Settings → **Environment Variables**: thêm `GEMINI_API_KEY` (hoặc `ANTHROPIC_API_KEY`; đổi model bằng `GEMINI_MODEL` / `ANTHROPIC_MODEL`) → Redeploy.

Mỗi lần push lên `main`, Vercel tự triển khai lại.

### Phương án B0 – GitHub Pages không cần GitHub Actions (đơn giản nhất)

Repo đã có sẵn bản web tĩnh dựng sẵn ở `docs/index.html` (kèm `docs/.nojekyll`).
1. Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
2. Branch: `main`, thư mục: **`/docs`** → Save.
3. Sau khoảng 1 phút web chạy tại `https://<tai-khoan>.github.io/<ten-repo>/`.

Khi sửa code, chạy `npm run build:static` để cập nhật lại `docs/index.html` rồi commit + push.

### Phương án B – GitHub Pages (miễn phí, bản tĩnh, không có bài luận AI)

1. Trên GitHub: repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push lên `main` (hoặc vào tab Actions → "Deploy GitHub Pages" → Run workflow).
3. Web chạy tại `https://<tai-khoan>.github.io/<ten-repo>/`. Toàn bộ phân tích chạy trên trình duyệt người xem, văn bản không gửi đi đâu.

## API

`POST /api/analyze` – body `{ "text": "<văn bản lá số>" }` → JSON kết quả (Bát Tự + Tử Vi).
`POST /api/narrate` – body `{ "text": "…" }` → `{ "markdown": "…" }` (cần GEMINI_API_KEY hoặc ANTHROPIC_API_KEY). `GET /api/narrate` → `{ "enabled": true|false }`.

## Định dạng văn bản

Xem `samples/la-so-mau.txt`. Bộ đọc nhận:

| Mục | Dòng mẫu |
|---|---|
| Năm xem | `(năm xem 2026 Bính Ngọ, 22 tuổi)` hoặc dòng lưu niên có `- NĂM XEM` |
| Giới tính | `Giới tính: Nam, Âm Nam` |
| Tứ trụ | `Tứ trụ: Ất Dậu (năm) - Ất Dậu (tháng) - Tân Dậu (ngày) - Ất Mùi (giờ)` hoặc các dòng `Trụ năm: …` |
| Đại vận | `Quý Mùi 18-27 tuổi (2023)` |
| 12 cung Tử Vi | `1. MỆNH (Mão), đại hạn 5, …` + các dòng `Chính tinh:`, `Phụ tinh:`, `Lưu 2026:`, `Tràng sinh:` |

Thiếu phần Tử Vi thì web chỉ luận Bát Tự; thiếu đại vận thì tự suy theo trụ tháng và giới tính. Tứ trụ đọc sai có thể sửa bằng nút "Sửa tứ trụ".

## Cấu trúc mã

```
src/
  app/                  giao diện Next.js + API (analyze, narrate)
  components/           BaziApp (nhập văn bản), PlainView (tóm tắt dễ hiểu), ResultView (Bát Tự), TuViView (bàn 12 cung), Gloss (thuật ngữ), ConfirmForm
  lib/
    parseText.ts        đọc văn bản lá số → dữ liệu
    reading.ts          gộp Bát Tự + Tử Vi
    plain.ts            chuyển kết quả sang lời thường (thẻ tóm tắt dễ hiểu)
    glossary.ts         từ điển thuật ngữ bấm-để-xem
    battu/              engine Bát Tự (vượng suy, cách cục, dụng thần, vận, thần sát, tri thức từ sách)
    tuvi/               tri thức & luận Tử Vi
preview/                bản tĩnh cho GitHub Pages (build bằng esbuild)
docs/KIEN_THUC_BAT_TU.md  tổng hợp kiến thức từ thư mục tài liệu
samples/la-so-mau.txt   văn bản lá số mẫu
```

Kết quả mang tính tham khảo theo mệnh lý cổ.
