// Bản tĩnh (GitHub Pages / xem thử): toàn bộ luận giải chạy trên trình duyệt; không có bài luận AI.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BaziApp, AppApi } from '../src/components/BaziApp';

const api: AppApi = {
  narrate: null,
  note: 'Bản tĩnh: mọi phân tích chạy ngay trên trình duyệt, văn bản không gửi đi đâu. Bài luận viết bằng AI chỉ có ở bản chạy trên máy chủ (Vercel) có API key.',
};
createRoot(document.getElementById('root')!).render(<BaziApp api={api} />);
