# Workflow GitHub Actions

Hai file trong thư mục này cần nằm ở `.github/workflows/` của repo:

- `ci.yml` – kiểm thử, kiểm tra kiểu, build mỗi lần push.
- `pages.yml` – đưa bản tĩnh lên GitHub Pages.

Cách đơn giản nhất: tạo thư mục `.github\workflows` trong thư mục dự án rồi chép 2 file vào, sau đó commit/push như bình thường.
Hoặc trên GitHub: Add file → Create new file → gõ tên `.github/workflows/ci.yml` → dán nội dung.
