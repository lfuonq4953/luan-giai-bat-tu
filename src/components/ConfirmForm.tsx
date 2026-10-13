'use client';
import React from 'react';
import { STEMS, BRANCHES } from '@/lib/battu/constants';
import type { ChartInput, Gender } from '@/lib/battu/chart';

export interface Draft {
  name: string; gender: Gender;
  pillars: { stem: number; branch: number }[]; // -1 = chưa có
  hasHour: boolean;
  solarBirth: string; lunarBirth: string;
  birthYear: string; luckStartAge: string; luckStartYear: string; luckStartText: string;
  referenceYear: string;
  luck: ChartInput['luck'];
}

export function draftFromInput(i: Omit<Partial<ChartInput>, 'pillars'> & { pillars: ({ stem: number; branch: number } | null)[] }): Draft {
  const ps = [0, 1, 2, 3].map((k) => i.pillars?.[k] ?? { stem: -1, branch: -1 });
  return {
    name: i.name ?? '', gender: i.gender ?? 'nam', pillars: ps, hasHour: !(i.pillars && i.pillars.length >= 3 && !i.pillars[3] && i.pillars[0]),
    solarBirth: i.solarBirth ?? '', lunarBirth: i.lunarBirth ?? '',
    birthYear: i.birthYear ? String(i.birthYear) : '',
    luckStartAge: i.luckStartAge !== undefined ? String(i.luckStartAge) : i.luck?.[0]?.startAge !== undefined ? String(i.luck[0].startAge) : '',
    luckStartYear: i.luck?.[0]?.startYear !== undefined ? String(i.luck[0].startYear) : '',
    luckStartText: i.luckStartText ?? '',
    referenceYear: String(i.referenceYear ?? new Date().getFullYear()),
    luck: i.luck,
  };
}

export function inputFromDraft(d: Draft): ChartInput | string {
  const use = d.hasHour ? d.pillars : d.pillars.slice(0, 3);
  for (const [k, p] of use.entries()) {
    if (p.stem < 0 || p.branch < 0) return `Thiếu can/chi trụ ${['năm', 'tháng', 'ngày', 'giờ'][k]}.`;
    if (p.stem % 2 !== p.branch % 2) return `Trụ ${['năm', 'tháng', 'ngày', 'giờ'][k]} không hợp lệ: ${STEMS[p.stem]} ${BRANCHES[p.branch]} (can dương phải đi với chi dương).`;
  }
  const n = (s: string) => (s.trim() && !Number.isNaN(+s) ? +s : undefined);
  const startAge = n(d.luckStartAge), startYear = n(d.luckStartYear);
  let luck = d.luck;
  // nếu người dùng sửa tuổi/năm khởi vận thì tính lại mốc cho cả chuỗi
  if (luck && luck.length && (startAge !== undefined || startYear !== undefined)) {
    luck = luck.map((l, i) => ({ ...l, startAge: startAge !== undefined ? startAge + i * 10 : l.startAge, startYear: startYear !== undefined ? startYear + i * 10 : l.startYear }));
  }
  return {
    name: d.name.trim() || undefined, gender: d.gender, pillars: use,
    solarBirth: d.solarBirth || undefined, lunarBirth: d.lunarBirth || undefined,
    birthYear: n(d.birthYear), luckStartAge: startAge, luckStartYear: startYear, luckStartText: d.luckStartText || undefined,
    luck: luck && luck.length ? luck : undefined,
    referenceYear: n(d.referenceYear),
  };
}

const LABELS = ['Trụ năm', 'Trụ tháng', 'Trụ ngày', 'Trụ giờ'];

export function ConfirmForm({ draft, setDraft, warnings, onSubmit, onCancel }: {
  draft: Draft; setDraft: (d: Draft) => void; warnings: string[]; onSubmit: () => void; onCancel: () => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  const setP = (i: number, field: 'stem' | 'branch', v: number) => {
    const ps = draft.pillars.map((p, k) => (k === i ? { ...p, [field]: v } : p));
    setDraft({ ...draft, pillars: ps });
  };
  return (
    <section className="card" style={{ marginTop: 8 }}>
      <h2 style={{ fontFamily: 'var(--serif)', margin: '0 0 6px' }}>Tứ trụ Bát Tự</h2>
      <p className="muted" style={{ marginTop: 0 }}>Sửa nếu văn bản ghi sai hoặc thiếu. Phần Tử Vi vẫn lấy từ văn bản.</p>
      {warnings.map((w, i) => <div key={i} className="alert warn">{w}</div>)}
      <div className="form-grid">
        <label className="f" htmlFor="f-name">Họ tên<input id="f-name" value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="(không bắt buộc)" /></label>
        <label className="f" htmlFor="f-gender">Giới tính
          <select id="f-gender" value={draft.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
            <option value="nam">Nam (Càn tạo)</option><option value="nu">Nữ (Khôn tạo)</option>
          </select>
        </label>
        <label className="f" htmlFor="f-birth">Năm sinh (dương lịch)<input id="f-birth" inputMode="numeric" value={draft.birthYear} onChange={(e) => set('birthYear', e.target.value)} placeholder="vd 2005" /></label>
        <label className="f" htmlFor="f-ref">Năm xem<input id="f-ref" inputMode="numeric" value={draft.referenceYear} onChange={(e) => set('referenceYear', e.target.value)} /></label>
      </div>
      <div className="pillar-inputs">
        {draft.pillars.map((p, i) => (
          <div className="pillar-input" key={i} style={{ opacity: i === 3 && !draft.hasHour ? 0.45 : 1 }}>
            <h4>{LABELS[i]}{i === 2 ? ' (Nhật chủ)' : ''}</h4>
            <select id={`f-stem-${i}`} aria-label={`Can ${LABELS[i]}`} value={p.stem} onChange={(e) => setP(i, 'stem', +e.target.value)} disabled={i === 3 && !draft.hasHour}>
              <option value={-1}>– Can –</option>
              {STEMS.map((s, k) => <option key={s} value={k}>{s}</option>)}
            </select>
            <select id={`f-branch-${i}`} aria-label={`Chi ${LABELS[i]}`} value={p.branch} onChange={(e) => setP(i, 'branch', +e.target.value)} disabled={i === 3 && !draft.hasHour}>
              <option value={-1}>– Chi –</option>
              {BRANCHES.map((b, k) => <option key={b} value={k} disabled={p.stem >= 0 && p.stem % 2 !== k % 2}>{b}</option>)}
            </select>
          </div>
        ))}
      </div>
      <label className="row muted" style={{ marginBottom: 10 }} htmlFor="f-nohour">
        <input id="f-nohour" type="checkbox" checked={!draft.hasHour} onChange={(e) => set('hasHour', !e.target.checked)} /> Không rõ giờ sinh (luận theo 3 trụ)
      </label>
      <div className="form-grid">
        <label className="f" htmlFor="f-lage">Tuổi khởi đại vận<input id="f-lage" inputMode="numeric" value={draft.luckStartAge} onChange={(e) => set('luckStartAge', e.target.value)} placeholder="vd 8" /></label>
        <label className="f" htmlFor="f-lyear">Năm khởi đại vận<input id="f-lyear" inputMode="numeric" value={draft.luckStartYear} onChange={(e) => set('luckStartYear', e.target.value)} placeholder="vd 2013" /></label>
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={onSubmit}>Luận giải lại</button>
        <button className="ghost" onClick={onCancel}>Huỷ</button>
      </div>
    </section>
  );
}
