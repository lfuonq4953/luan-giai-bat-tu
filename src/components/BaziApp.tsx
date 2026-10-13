'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ChartInput } from '@/lib/battu/chart';
import { readFromParsed, Reading } from '@/lib/reading';
import { parseChartText } from '@/lib/parseText';
import { SAMPLE_TEXT } from '@/lib/sample';
import { ConfirmForm, Draft, draftFromInput, inputFromDraft } from './ConfirmForm';
import { ResultView } from './ResultView';

/** Bản Next.js truyền hàm gọi /api/narrate; bản tĩnh (GitHub Pages) để null */
export interface AppApi {
  narrate: ((text: string, override: ChartInput | null) => Promise<string>) | null;
  note?: string;
}

type Stage = 'input' | 'edit' | 'result';
const DRAFT_KEY = 'laso-text';

export function BaziApp({ api }: { api: AppApi }) {
  const [stage, setStage] = useState<Stage>('input');
  const [text, setText] = useState('');
  const [reading, setReading] = useState<Reading | null>(null);
  const [override, setOverride] = useState<ChartInput | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { try { const t = localStorage.getItem(DRAFT_KEY); if (t) setText(t); } catch { /* bỏ qua */ } }, []);
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, text); } catch { /* bỏ qua */ } }, [text]);

  const run = (t: string, ov: ChartInput | null = null) => {
    setError(null);
    if (!t.trim()) { setError('Hãy dán văn bản lá số vào ô bên dưới.'); return; }
    const parsed = parseChartText(t);
    if (!parsed.bazi && !ov) {
      setError('Không tìm thấy tứ trụ trong văn bản. Cần có dòng dạng "Tứ trụ: Ất Dậu (năm) - Ất Dậu (tháng) - Tân Dậu (ngày) - Ất Mùi (giờ)" hoặc các dòng "Trụ năm: …". Bạn cũng có thể nhập tứ trụ thủ công.');
      setDraft(draftFromInput({ gender: 'nam', pillars: [], referenceYear: new Date().getFullYear() }));
      setStage('edit');
      return;
    }
    const r = readFromParsed(parsed, ov ?? undefined);
    setReading(r); setOverride(ov);
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadFile = async (f: File) => { setText(await f.text()); };
  const reset = () => { setStage('input'); setReading(null); setOverride(null); setError(null); };

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <div className="seal" aria-hidden="true">命盤</div>
          <div>
            <h1>Luận Giải Lá Số</h1>
            <p>Bát Tự theo Tử Bình · Tử Vi Đẩu Số bổ trợ</p>
          </div>
        </div>
        {stage !== 'input' && <button className="ghost" onClick={reset}>Lá số khác</button>}
      </header>

      {error && <div className="alert err" role="alert">{error}</div>}

      {stage === 'input' && (
        <section className="hero">
          <div className="card">
            <div className="eyebrow">Tử Vi · Bát Tự</div>
            <h2>Dán văn bản lá số, nhận bài luận chi tiết</h2>
            <p className="lead">Sao chép phần mô tả lá số (thông tin chung, 12 cung Tử Vi, tứ trụ Bát Tự, đại vận, lưu niên) rồi dán vào ô bên phải. Web tự đọc và luận: tính cách, sự nghiệp, tài chính, tình duyên, sức khoẻ, đại vận và năm xem.</p>
            <ol className="steps">
              <li><b>1</b><span>Dán văn bản hoặc mở file .txt.</span></li>
              <li><b>2</b><span>Bấm “Luận giải”. Có thể sửa tứ trụ nếu văn bản ghi sai.</span></li>
              <li><b>3</b><span>Đọc từng mục, bấm vào từng đại vận, từng năm để xem chi tiết.</span></li>
            </ol>
            <p className="fmt" style={{ marginTop: 16 }}>Tối thiểu cần dòng <code>Giới tính: Nam</code> và <code>Tứ trụ: Ất Dậu (năm) - Ất Dậu (tháng) - Tân Dậu (ngày) - Ất Mùi (giờ)</code>. Phần <code>=== LÁ SỐ TỬ VI ===</code> và danh sách đại vận giúp bài luận đầy đủ hơn.</p>
            {api.note && <p className="muted">{api.note}</p>}
          </div>
          <div className="card">
            <label htmlFor="chart-text" className="muted" style={{ display: 'block', marginBottom: 6 }}>Văn bản lá số</label>
            <textarea id="chart-text" className="paste" value={text} onChange={(e) => setText(e.target.value)} placeholder={'=== THÔNG TIN CHUNG ===\nHọ tên: …\nGiới tính: Nam\nTứ trụ: … (năm) - … (tháng) - … (ngày) - … (giờ)\n…'} spellCheck={false} />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => run(text)}>Luận giải</button>
              <button className="btn secondary" onClick={() => { setText(SAMPLE_TEXT); run(SAMPLE_TEXT); }}>Xem lá số mẫu</button>
              <button className="ghost" onClick={() => fileRef.current?.click()}>Mở file .txt</button>
              <input ref={fileRef} id="chart-file" type="file" accept=".txt,text/plain" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ''; }} />
              {text && <button className="ghost" onClick={() => setText('')}>Xoá</button>}
            </div>
          </div>
        </section>
      )}

      {stage === 'edit' && draft && (
        <ConfirmForm
          draft={draft} setDraft={setDraft}
          warnings={reading ? reading.parsed.warnings : []}
          onCancel={reading ? () => setStage('result') : reset}
          onSubmit={() => { const r = inputFromDraft(draft); if (typeof r === 'string') setError(r); else run(text || ' ', r); }}
        />
      )}

      {stage === 'result' && reading && (
        <>
          {[...reading.parsed.warnings, ...reading.errors].map((w, i) => <div key={i} className="alert warn">{w}</div>)}
          {reading.bazi ? (
            <ResultView
              result={reading.bazi} tuvi={reading.tuvi}
              narrate={api.narrate ? () => api.narrate!(text, override) : null}
              onEdit={() => { setDraft(draftFromInput(reading.bazi!.chart.input)); setStage('edit'); }}
            />
          ) : <div className="alert err">Không luận được phần Bát Tự.</div>}
        </>
      )}

      <footer className="footer">
        Bát Tự luận theo quy tắc trong Tử Bình Chân Thuyên, Trích Thiên Tủy, Thiên Lý Mệnh Cảo…; Tử Vi luận theo kiến thức phổ thông. Kết quả mang tính tham khảo.
      </footer>
    </div>
  );
}
