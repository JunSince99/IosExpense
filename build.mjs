// Builds the installable web app into dist/ from src/app.html.
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { createHash } from 'node:crypto';

const src = readFileSync('src/app.html', 'utf8');
const title = (src.match(/<title>([\s\S]*?)<\/title>/) || [, '한푼'])[1];
const style = src.match(/<style>[\s\S]*?<\/style>/)[0];
const body = src
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .replace(/<meta name="claude:[^>]*>\s*/g, '')
  .replace(style, '')
  .trim();

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="${title}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1013" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=no">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px)}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;overscroll-behavior:none}
body{margin:0;-webkit-touch-callout:none}
[hidden]{display:none!important}
</style>
${style}
</head>
<body>
${body}
<script>
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
if(navigator.storage&&navigator.storage.persist){navigator.storage.persist().catch(()=>{})}
</script>
</body>
</html>
`;

const version = createHash('sha256').update(html).digest('hex').slice(0, 10);
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('public', 'dist', { recursive: true });
writeFileSync('dist/index.html', html);
writeFileSync('dist/.nojekyll', '');
writeFileSync('dist/sw.js', readFileSync('tools/sw.template.js', 'utf8').replace('__VERSION__', version));
console.log('built dist/ version', version);
