'use client';
import { useEffect, useMemo, useState } from 'react';
import { BaziApp, AppApi } from '@/components/BaziApp';
import type { ChartInput } from '@/lib/battu/chart';

export default function Page() {
  const [aiEnabled, setAiEnabled] = useState(false);
  useEffect(() => {
    fetch('/api/narrate').then((r) => r.json()).then((d) => setAiEnabled(!!d.enabled)).catch(() => setAiEnabled(false));
  }, []);

  const api: AppApi = useMemo(() => ({
    narrate: aiEnabled ? async (text: string, override: ChartInput | null) => {
      const res = await fetch('/api/narrate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, override }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      return data.markdown as string;
    } : null,
  }), [aiEnabled]);

  return <BaziApp api={api} />;
}
