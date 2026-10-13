'use client';
import React, { useState } from 'react';
import { splitTerms, Term as TermT, GLOSSARY } from '@/lib/glossary';

/** Một thuật ngữ có thể bấm để xem giải thích ngay bên dưới (không dùng tooltip để không tràn màn hình trên điện thoại) */
export function Term({ term, children }: { term: TermT; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`term ${open ? 'open' : ''}`} title={term.def} aria-expanded={open} onClick={() => setOpen(!open)}>{children}</button>
      {open && <span className="term-pop" role="note"><b>{term.key}:</b> {term.def}</span>}
    </>
  );
}

const renderBold = (s: string, seen: Set<string>, k: string) =>
  s.split(/(\*\*[^*]+\*\*)/g).map((t, i) => {
    const bold = t.startsWith('**') && t.endsWith('**') && t.length > 4;
    const inner = bold ? t.slice(2, -2) : t;
    const parts = splitTerms(inner, seen).map((p, j) => (typeof p === 'string' ? <React.Fragment key={j}>{p}</React.Fragment> : <Term key={j} term={p.term}>{p.text}</Term>));
    return bold ? <strong key={`${k}${i}`}>{parts}</strong> : <React.Fragment key={`${k}${i}`}>{parts}</React.Fragment>;
  });

/** Hiển thị chuỗi (hỗ trợ **đậm**), tự gắn giải thích cho lần đầu xuất hiện mỗi thuật ngữ trong phạm vi `seen` */
export function Gloss({ text, seen }: { text: string; seen?: Set<string> }) {
  return <>{renderBold(text, seen ?? new Set(), 'g')}</>;
}

/** Gắn giải thích cho một nhãn cố định (ví dụ tiêu đề cột) */
export function TermLabel({ k, children }: { k: string; children?: React.ReactNode }) {
  const t = GLOSSARY.find((x) => x.key === k);
  if (!t) return <>{children ?? k}</>;
  return <Term term={t}>{children ?? k}</Term>;
}

export function GlossaryList() {
  return (
    <dl className="glossary">
      {GLOSSARY.map((t) => (
        <div key={t.key}><dt>{t.key}{t.aliases?.length ? <span className="small"> ({t.aliases.join(', ')})</span> : null}</dt><dd>{t.def}</dd></div>
      ))}
    </dl>
  );
}
