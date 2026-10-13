'use client';
import React, { useMemo, useState } from 'react';
import type { AnalysisResult } from '@/lib/battu/analyze';
import type { TuViResult } from '@/lib/tuvi/analyze';
import { TuViView } from './TuViView';
import { pillarName } from '@/lib/battu/chart';
import { STEMS, BRANCHES, STEM_ELEMENT, BRANCH_ELEMENT, NAYIN_MEANING, TEN_GOD_SHORT, Element } from '@/lib/battu/constants';
import { Markdown } from './Markdown';
import { PlainView } from './PlainView';
import { Gloss, TermLabel, GlossaryList } from './Gloss';
import { buildPlain, plainPeriod, RATE_PLAIN } from '@/lib/plain';

const El = ({ e, children }: { e: Element; children: React.ReactNode }) => <span className={`el-${e}`}>{children}</span>;
const rateCls = (r: string) => `rate r-${r.replace(/\s/g, '')}`;

export function ResultView({ result, tuvi, narrate, onEdit }: { result: AnalysisResult; tuvi: TuViResult | null; narrate: (() => Promise<string>) | null; onEdit: () => void }) {
  const { chart, strength, pattern, yong } = result;
  const [selLuck, setSelLuck] = useState<number>(Math.max(0, result.luck.findIndex((l) => l.current)));
  const [selYear, setSelYear] = useState<number>(Math.max(0, result.years.findIndex((y) => y.current)));
  const [ai, setAi] = useState<{ loading: boolean; text?: string; error?: string }>({ loading: false });
  const dEl = STEM_ELEMENT[chart.dayMaster];
  const pName = pattern.special ? pattern.special.name : pattern.name;
  const plain = useMemo(() => buildPlain(result, tuvi), [result, tuvi]);

  const runAI = async () => {
    if (!narrate) return;
    setAi({ loading: true });
    try { setAi({ loading: false, text: await narrate() }); }
    catch (e) { setAi({ loading: false, error: (e as Error).message }); }
  };

  const L = result.luck[selLuck];
  const Y = result.years[selYear];

  return (
    <div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', margin: 0 }}>{chart.input.name || 'Lá số'}</h2>
            <div className="muted">
              {chart.input.gender === 'nam' ? 'Càn tạo (Nam)' : 'Khôn tạo (Nữ)'}
              {chart.input.solarBirth ? ` · ${chart.input.solarBirth}` : ''}{chart.input.lunarBirth ? ` · ${chart.input.lunarBirth}` : ''}
            </div>
          </div>
          <button className="ghost" onClick={onEdit}>Sửa tứ trụ</button>
        </div>
        {chart.warnings.map((w, i) => <div key={i} className="alert warn">{w}</div>)}
        <div className="sumbar">
          <div className="stat"><div className="k"><TermLabel k="Nhật chủ" /></div><div className="v"><El e={dEl}>{STEMS[chart.dayMaster]} {dEl}</El></div><div className="s">sinh tháng {BRANCHES[chart.pillars[1].branch]}</div></div>
          <div className="stat"><div className="k"><TermLabel k="Vượng suy" /></div><div className="v">{strength.level}</div><div className="s">phe trợ {Math.round(strength.ratio * 100)}%</div></div>
          <div className="stat"><div className="k"><TermLabel k="Cách cục" /></div><div className="v" style={{ fontSize: 17 }}>{pName}</div><div className="s">{pattern.verdict} · cấp {pattern.grade}</div></div>
          <div className="stat"><div className="k"><TermLabel k="Dụng thần">Dụng</TermLabel> / <TermLabel k="Hỷ thần">Hỷ</TermLabel> / <TermLabel k="Kỵ thần">Kỵ</TermLabel></div><div className="v" style={{ fontSize: 16 }}>
            <span className={`chip el-${yong.useful}`}>Dụng {yong.useful}</span>
            {yong.favorable.map((e) => <span key={e} className={`chip el-${e}`}>Hỷ {e}</span>)}
            {yong.unfavorable.map((e) => <span key={e} className={`chip el-${e}`} style={{ opacity: .7 }}>Kỵ {e}</span>)}
          </div></div>
        </div>
      </div>

      <nav className="toc" aria-label="Mục lục">
        <a href="#de-hieu" className="toc-main">Tóm tắt dễ hiểu</a>
        <a href="#la-so">Lá số</a>
        {result.sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title.split(':')[0]}</a>)}
        <a href="#than-sat">Thần sát</a>
        {tuvi && <a href="#tu-vi">Tử Vi</a>}
        {narrate && <a href="#ai">Bài luận AI</a>}
        <a href="#thuat-ngu">Thuật ngữ</a>
      </nav>

      <PlainView plain={plain} />

      <div className="deep-head" id="chuyen-sau">
        <h2>Phân tích chuyên sâu</h2>
        <p className="muted">Phần dưới giữ nguyên thuật ngữ mệnh lý để đối chiếu với sách. Bấm vào chữ gạch chân để xem giải thích.</p>
      </div>

      <div className="grid2" id="la-so">
        <div className="card chart-wrap">
          <table className="chart">
            <thead><tr><th className="rowh"></th>{chart.pillars.map((p) => <th key={p.key}>{p.label}</th>)}</tr></thead>
            <tbody>
              <tr><th className="rowh"><TermLabel k="Thập thần" /></th>{chart.pillars.map((p) => <td key={p.key} className={p.key === 'day' ? 'day' : ''}>{p.stemGod === 'Nhật Chủ' ? '★ Nhật chủ' : p.stemGod}</td>)}</tr>
              <tr><th className="rowh"><TermLabel k="Thiên can" /></th>{chart.pillars.map((p) => <td key={p.key} className={p.key === 'day' ? 'day' : ''}><span className={`gz el-${STEM_ELEMENT[p.stem]}`}>{STEMS[p.stem]}</span><div className="small">{STEM_ELEMENT[p.stem]} {p.stem % 2 ? 'âm' : 'dương'}</div></td>)}</tr>
              <tr><th className="rowh"><TermLabel k="Địa chi" /></th>{chart.pillars.map((p) => <td key={p.key} className={p.key === 'day' ? 'day' : ''}><span className={`gz el-${BRANCH_ELEMENT[p.branch]}`}>{BRANCHES[p.branch]}</span><div className="small">{BRANCH_ELEMENT[p.branch]}{p.empty ? ' · Không vong' : ''}</div></td>)}</tr>
              <tr><th className="rowh"><TermLabel k="Tàng can" /></th>{chart.pillars.map((p) => <td key={p.key}><div className="hidden-list">{p.hidden.map((h) => <span key={h.stem}><El e={STEM_ELEMENT[h.stem]}>{STEMS[h.stem]}</El> <span className="small">{TEN_GOD_SHORT[h.god]}</span></span>)}</div></td>)}</tr>
              <tr><th className="rowh"><TermLabel k="Trường sinh" /></th>{chart.pillars.map((p) => <td key={p.key}>{p.stage}</td>)}</tr>
              <tr><th className="rowh"><TermLabel k="Nạp âm" /></th>{chart.pillars.map((p) => <td key={p.key}>{p.nayin}<div className="small">{NAYIN_MEANING[p.nayin]}</div></td>)}</tr>
            </tbody>
          </table>
          <p className="small" style={{ marginBottom: 0 }}>
            <TermLabel k="Không vong">Nhật không</TermLabel>: {chart.emptyBranches.map((b) => BRANCHES[b]).join(' – ')} · Niên không: {chart.yearEmptyBranches.map((b) => BRANCHES[b]).join(' – ')} · Thai nguyên: {pillarName(chart.taiYuan)}{chart.mingGong ? ` · Mệnh cung: ${pillarName(chart.mingGong)}` : ''}
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--serif)' }}>Lực lượng <TermLabel k="Ngũ hành">ngũ hành</TermLabel></h3>
          <div className="bars">
            {strength.elements.map((e) => (
              <div className="bar" key={e.element}>
                <El e={e.element}><strong>{e.element}</strong></El>
                <div className="track"><div className={`fill bg-${e.element}`} style={{ width: `${Math.max(2, e.percent * 100)}%` }} /></div>
                <span className="tag">{Math.round(e.percent * 100)}% · {e.state}</span>
              </div>
            ))}
          </div>
          <p className="small">Đã tính hệ số mùa (vượng tướng hưu tù tử), thông căn, hợp hoá và xung. {strength.transforms.length ? strength.transforms.join('; ') + '.' : ''}</p>
          {result.relations.length > 0 && (<>
            <h4 style={{ marginBottom: 4 }}>Hợp – xung – hình – hại</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>{result.relations.map((r, i) => <li key={i} className={r.good ? 'good' : 'bad'}>{r.label}</li>)}</ul>
          </>)}
        </div>
      </div>

      {result.sections.map((s) => { const seen = new Set<string>(); return (
        <section key={s.id} id={s.id} className="card section">
          <h3>{s.title}</h3>
          <p className="sum"><Gloss text={s.summary} seen={seen} /></p>
          {s.id === 'dai-van' ? (
            <>
              <p><Gloss text={s.paragraphs[0]} seen={seen} /></p>
              <div className="luck">
                {result.luck.slice(0, 10).map((l, i) => (
                  <button key={i} className={`cell ${l.current ? 'cur' : ''} ${i === selLuck ? 'sel' : ''}`} onClick={() => setSelLuck(i)} aria-pressed={i === selLuck}>
                    <div className="gz"><El e={STEM_ELEMENT[l.stem]}>{STEMS[l.stem]}</El> <El e={BRANCH_ELEMENT[l.branch]}>{BRANCHES[l.branch]}</El></div>
                    <div className="small">{l.startAge !== null ? `${l.startAge}–${l.startAge + 9}t` : `Vận ${l.index}`}{l.startYear ? ` · ${l.startYear}` : ''}</div>
                    <span className={rateCls(l.evaluation.rating)}>{l.evaluation.rating}</span>
                  </button>
                ))}
              </div>
              {L && (
                <div className="detail">
                  <strong>{pillarName(L)}</strong>{L.startYear ? ` (${L.startYear}–${L.endYear})` : ''}: giai đoạn {RATE_PLAIN[L.evaluation.rating]}.
                  <ul className="plines">{plainPeriod(L.evaluation, result).map((t, i) => <li key={i}>{t}</li>)}</ul>
                  <details className="why"><summary>Căn cứ chuyên môn – {L.stemGod} / {L.branchGod} · {L.nayin}</summary>
                    <ul>{[...L.evaluation.themes, ...L.evaluation.notes].map((t, i) => <li key={i}><Gloss text={t} seen={seen} /></li>)}</ul>
                  </details>
                </div>
              )}
            </>
          ) : s.id === 'luu-nien' ? (
            <>
              <div className="years">
                {result.years.map((y, i) => (
                  <button key={y.year} className={`cell ${y.current ? 'cur' : ''} ${i === selYear ? 'sel' : ''}`} onClick={() => setSelYear(i)} aria-pressed={i === selYear}>
                    <div className="small">{y.year}{y.age ? ` · ${y.age}t` : ''}</div>
                    <div className="gz"><El e={STEM_ELEMENT[y.stem]}>{STEMS[y.stem]}</El> <El e={BRANCH_ELEMENT[y.branch]}>{BRANCHES[y.branch]}</El></div>
                    <span className={rateCls(y.combined.rating)}>{y.combined.rating}</span>
                  </button>
                ))}
              </div>
              {Y && (
                <div className="detail">
                  <strong>Năm {Y.year} {pillarName(Y)}</strong>: nhìn chung {RATE_PLAIN[Y.combined.rating]}.
                  <ul className="plines">{plainPeriod(Y.evaluation, result).map((t, i) => <li key={i}>{t}</li>)}</ul>
                  <details className="why"><summary>Căn cứ chuyên môn – {Y.evaluation.stemGod} / {Y.evaluation.branchGod}</summary>
                    <p><Gloss text={Y.combined.note} seen={seen} /></p>
                    <ul>{[...Y.evaluation.themes, ...Y.evaluation.notes].map((t, i) => <li key={i}><Gloss text={t} seen={seen} /></li>)}</ul>
                  </details>
                </div>
              )}
            </>
          ) : (
            <>
              {s.paragraphs.map((p, i) => <p key={i}><Gloss text={p} seen={seen} /></p>)}
              {s.bullets && s.bullets.length > 0 && <ul>{s.bullets.map((b, i) => <li key={i}><Gloss text={b} seen={seen} /></li>)}</ul>}
            </>
          )}
          {s.source && <div className="src">Căn cứ: {s.source}</div>}
        </section>
      ); })}

      <section id="than-sat" className="card section">
        <h3><TermLabel k="Thần sát" /> nguyên cục</h3>
        <p className="sum">Thần sát chỉ là phần phụ, quyết định vẫn ở ngũ hành sinh khắc và dụng thần.</p>
        <div className="shensha">
          {result.shensha.map((x) => (
            <div className="item" key={x.name}>
              <b className={x.good === true ? 'good' : x.good === false ? 'bad' : ''}>{x.name}</b> <span className="small">– {x.positions.join(', ')}</span>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>{x.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      {tuvi && <TuViView tuvi={tuvi} />}

      {narrate && (
        <section id="ai" className="card section">
          <h3>Bài luận tổng hợp Tử Vi & Bát Tự (AI viết từ kết quả trên)</h3>
          {!ai.text && <p className="muted">AI chỉ diễn đạt lại kết luận của engine quy tắc thành bài văn liền mạch – không tự đổi dụng thần hay cách cục.</p>}
          {ai.error && <div className="alert err">{ai.error}</div>}
          {ai.text ? <div className="md"><Markdown text={ai.text} /></div> : (
            <button className="btn" onClick={runAI} disabled={ai.loading}>{ai.loading ? <><span className="spinner" /> Đang viết…</> : 'Viết bài luận'}</button>
          )}
        </section>
      )}

      <section id="thuat-ngu" className="card section">
        <h3>Giải thích thuật ngữ</h3>
        <details>
          <summary>Mở bảng thuật ngữ</summary>
          <GlossaryList />
        </details>
      </section>

      <section className="card section">
        <h3>Nguồn tài liệu</h3>
        <ul>{result.sources.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>
    </div>
  );
}
