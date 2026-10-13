// Đóng gói bản xem thử thành 1 trang HTML: React tải từ cdnjs (UMD), phần còn lại inline.
// Chạy: node preview/build.mjs   (TEST=1 để nhúng React từ node_modules, dùng khi kiểm thử offline)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { build } = await import(process.env.ESBUILD_PATH || 'esbuild');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const globals = {
  name: 'react-globals',
  setup(b) {
    b.onResolve({ filter: /^react(-dom\/client|\/jsx-runtime)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({
      contents: a.path === 'react' ? 'module.exports = window.React' : a.path === 'react-dom/client' ? 'module.exports = window.ReactDOM' : 'module.exports = {}',
      loader: 'js',
    }));
  },
};
const TEST = process.env.TEST === '1';
const res = await build({
  entryPoints: [`${root}/preview/main.tsx`], bundle: true, minify: true, format: 'iife', write: false,
  jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
  nodePaths: process.env.EXTRA_NODE_PATH ? [process.env.EXTRA_NODE_PATH] : [], define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.json': 'json' }, alias: { '@': `${root}/src` },
  plugins: TEST ? [] : [globals], target: ['es2020'], logLevel: 'warning',
});
const js = res.outputFiles[0].text;
const css = fs.readFileSync(`${root}/src/app/globals.css`, 'utf8');
const head = `<title>Luận Giải Lá Số</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Noto+Serif:wght@600;700&display=swap" rel="stylesheet">
<style>${css}</style>`;
const scripts = TEST ? `<script>${js.replace(/<\/script/g, '<\\/script')}</script>` : `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js.replace(/<\/script/g, '<\\/script')}</script>`;
fs.mkdirSync(`${root}/preview/dist`, { recursive: true });
if (!TEST) fs.writeFileSync(`${root}/preview/dist/bat-tu-luan-giai.html`, `${head}\n<div id="root"></div>\n${scripts}`);
const page = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body><div id="root"></div>${scripts}</body></html>`;
fs.writeFileSync(`${root}/preview/dist/${TEST ? 'test' : 'index'}.html`, page);
// Bản cho GitHub Pages kiểu "Deploy from a branch" (thư mục /docs) – không cần GitHub Actions
if (!TEST) { fs.writeFileSync(`${root}/docs/index.html`, page); fs.writeFileSync(`${root}/docs/.nojekyll`, ''); }
console.log('bundle KB', Math.round(js.length / 1024));
