import React from 'react';

/** Trình hiển thị Markdown tối giản (tiêu đề, đậm, nghiêng, danh sách, đoạn) – đủ cho bài luận AI */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  const inline = (s: string, k: number) => s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((t, i) =>
    t.startsWith('**') ? <strong key={`${k}-${i}`}>{t.slice(2, -2)}</strong> : t.startsWith('*') && t.length > 2 ? <em key={`${k}-${i}`}>{t.slice(1, -1)}</em> : <React.Fragment key={`${k}-${i}`}>{t}</React.Fragment>);
  const flush = () => {
    if (para.length) { out.push(<p key={`p${out.length}`}>{inline(para.join(' '), out.length)}</p>); para = []; }
    if (list.length) { out.push(<ul key={`u${out.length}`}>{list.map((l, i) => <li key={i}>{inline(l, i)}</li>)}</ul>); list = []; }
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flush(); continue; }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flush(); const lvl = h[1].length; out.push(lvl <= 2 ? <h2 key={`h${out.length}`}>{h[2]}</h2> : <h3 key={`h${out.length}`}>{h[2]}</h3>); continue; }
    const li = l.match(/^([-*•]|\d+\.)\s+(.*)$/);
    if (li) { if (para.length) { const p = para; para = []; out.push(<p key={`p${out.length}`}>{inline(p.join(' '), out.length)}</p>); } list.push(li[2]); continue; }
    if (list.length) flush();
    para.push(l);
  }
  flush();
  return <>{out}</>;
}
