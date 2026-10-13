'use client';
import React from 'react';
import type { PlainSummary } from '@/lib/plain';
import { Gloss } from './Gloss';

const rateCls = (r: string) => `rate r-${r.replace(/\s/g, '')}`;

export function PlainView({ plain }: { plain: PlainSummary }) {
  return (
    <section id="de-hieu" className="section">
      <div className="card plain-head">
        <div className="eyebrow">Tóm tắt dễ hiểu</div>
        <p className="plain-lead">{plain.headline}</p>
        <p className="small" style={{ margin: 0 }}>Viết bằng lời thường. Mỗi thẻ có mục “Căn cứ chuyên môn” để đối chiếu; phần phân tích chuyên sâu ở bên dưới (bấm vào chữ gạch chân để xem giải thích thuật ngữ).</p>
      </div>
      <div className="plain-grid">
        {plain.cards.map((c) => (
          <article key={c.id} id={c.id} className={`card pcard ${c.level ? 'lv-' + c.level : ''}`}>
            <header>
              <h3>{c.title}</h3>
              {c.badge && (/^(Rất tốt|Tốt|Bình hoà|Kém|Xấu)$/.test(c.badge) ? <span className={rateCls(c.badge)}>{c.badge}</span> : <span className="chip">{c.badge}</span>)}
            </header>
            <ul className="plines">{c.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
            {c.tips && (
              <div className="ptips">
                {c.tips.filter((t) => t.items.length).map((t) => (
                  <div key={t.label}>
                    <div className="ptl">{t.label}</div>
                    <ul>{t.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            <details className="why">
              <summary>Căn cứ chuyên môn</summary>
              <p><Gloss text={c.why} /></p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
