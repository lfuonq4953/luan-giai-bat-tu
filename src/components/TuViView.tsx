'use client';
import React from 'react';
import { BRANCHES } from '@/lib/battu/constants';
import type { TuViResult, PalaceEval } from '@/lib/tuvi/analyze';
import { MAJOR_STARS, MINOR_STARS } from '@/lib/tuvi/knowledge';
import { Gloss, TermLabel } from './Gloss';

// Vị trí 12 cung trên bàn lá số truyền thống (hàng, cột) – Tị ở góc trên trái, Dần ở góc dưới trái
const POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4], 9: [2, 4], 10: [3, 4], 11: [4, 4], 0: [4, 3], 1: [4, 2], 2: [4, 1], 3: [3, 1], 4: [2, 1],
};
const rateCls = (r: string) => `rate r-${r.replace(/\s/g, '')}`;

function Cell({ ev, cur, luu }: { ev: PalaceEval; cur: boolean; luu: boolean }) {
  const p = ev.palace;
  const [r, c] = POS[p.branch] ?? [1, 1];
  const shown = p.minor.filter((s) => MINOR_STARS[s.name]?.kind !== 'trung' || /Hóa|Mã|Đào|Hồng/.test(s.name));
  return (
    <div className={`tv-cell ${cur ? 'tv-cur' : ''}`} style={{ gridRow: r, gridColumn: c }}>
      <div className="tv-head">
        <strong>{p.name}{p.isThan ? ' · Thân' : ''}</strong>
        <span className="small">{BRANCHES[p.branch]}{p.daiHan !== null ? ` · ${p.daiHan}` : ''}</span>
      </div>
      <div className="tv-major">
        {p.major.length ? p.major.map((s) => (
          <span key={s.name} className={`el-${MAJOR_STARS[s.name]?.element ?? 'Thổ'}`}>{s.name}{s.bright ? <sup>{s.bright}</sup> : null}</span>
        )) : <span className="small">Vô chính diệu</span>}
      </div>
      <div className="tv-minor">
        {shown.map((s) => {
          const k = MINOR_STARS[s.name]?.kind;
          return <span key={s.name} className={k === 'cát' ? 'good' : k === 'sát' ? 'bad' : k === 'hoá' ? 'tv-hoa' : ''}>{s.name}</span>;
        })}
      </div>
      {p.yearly.length > 0 && <div className="tv-yearly">{p.yearly.join(', ')}</div>}
      <div className="tv-foot">
        <span className={rateCls(ev.rating)}>{ev.rating}</span>
        {cur && <span className="tv-tag">Đại hạn</span>}
        {luu && <span className="tv-tag tv-tag-luu">Lưu Mệnh</span>}
      </div>
    </div>
  );
}

export function TuViView({ tuvi }: { tuvi: TuViResult }) {
  const d = tuvi.data;
  return (
    <>
      <section id="tu-vi" className="card section">
        <h3>Lá số Tử Vi</h3>
        <p className="sum">{tuvi.disclaimer}</p>
        <div className="tv-board">
          {tuvi.evals.map((ev) => (
            <Cell key={ev.palace.name} ev={ev} cur={tuvi.currentDaiHan?.name === ev.palace.name} luu={tuvi.luuMenh?.name === ev.palace.name} />
          ))}
          <div className="tv-center">
            <div className="eyebrow">Thiên bàn</div>
            <dl>
              {d.banMenh && <><dt>Bản mệnh</dt><dd>{d.banMenh}</dd></>}
              {d.cuc && <><dt>Cục</dt><dd>{d.cuc}</dd></>}
              {d.chuMenh && <><dt>Chủ mệnh</dt><dd>{d.chuMenh}</dd></>}
              {d.chuThan && <><dt>Chủ thân</dt><dd>{d.chuThan}</dd></>}
              {d.thanCu && <><dt>Thân cư</dt><dd>{d.thanCu}</dd></>}
              {d.canLuong && <><dt>Cân lượng</dt><dd>{d.canLuong}</dd></>}
            </dl>
            {d.tuHoa && <p className="small" style={{ margin: '8px 0 0' }}>{d.tuHoa}</p>}
          </div>
        </div>
        <p className="small">Chữ nhỏ: <span className="good">xanh</span> <TermLabel k="Phụ tinh">cát tinh</TermLabel> · <span className="bad">đỏ</span> sát/bại tinh · <span className="tv-hoa">gạch chân</span> <TermLabel k="Tứ hoá">tứ hoá</TermLabel>. Chỉ số trên <TermLabel k="Chính tinh">chính tinh</TermLabel>: M <TermLabel k="Miếu">miếu</TermLabel>, V vượng, Đ đắc (đều là sáng), B bình, H <TermLabel k="Hãm">hãm</TermLabel> (tối). Cung <TermLabel k="Vô chính diệu">vô chính diệu</TermLabel> được chấm theo chính tinh cung đối diện.</p>
      </section>
      {tuvi.sections.map((s) => { const seen = new Set<string>(); return (
        <section key={s.id} id={s.id} className="card section">
          <h3>{s.title}</h3>
          <p className="sum"><Gloss text={s.summary} seen={seen} /></p>
          {s.paragraphs.map((p, i) => <p key={i}><Gloss text={p} seen={seen} /></p>)}
          {s.bullets && s.bullets.length > 0 && <ul>{s.bullets.map((b, i) => <li key={i}><Gloss text={b} seen={seen} /></li>)}</ul>}
          {s.source && <div className="src">Căn cứ: {s.source}</div>}
        </section>
      ); })}
    </>
  );
}
