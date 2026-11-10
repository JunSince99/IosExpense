// Renders the app icons (gold won coin on ink) into public/icons with headless Chromium.
// Run: node tools/make-icons.cjs  (needs Playwright with Chromium)
const {chromium}=require('playwright');
const path=require('path');
const out=path.join(__dirname,'..','public','icons');

// scale shrinks the coin toward the center (maskable icons need a safe zone)
const svg=(scale)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262a34"/><stop offset="1" stop-color="#0e0f13"/></linearGradient>
 <linearGradient id="face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset=".5" stop-color="#f7bd45"/><stop offset="1" stop-color="#e3951f"/></linearGradient>
 <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c9"/><stop offset=".5" stop-color="#f0a935"/><stop offset="1" stop-color="#b8670f"/></linearGradient>
</defs>
<rect width="512" height="512" fill="url(#bg)"/>
<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
 <ellipse cx="256" cy="408" rx="120" ry="18" fill="#000" opacity=".4"/>
 <circle cx="256" cy="250" r="148" fill="url(#rim)"/>
 <circle cx="256" cy="250" r="130" fill="url(#face)"/>
 <circle cx="256" cy="250" r="110" fill="none" stroke="#b9700f" stroke-opacity=".35" stroke-width="4"/>
 <g stroke="#83500b" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" fill="none">
  <path d="M204 196l26 112 26-80 26 80 26-112"/><path d="M190 242h132M196 268h120"/>
 </g>
 <path d="M170 196a110 110 0 0 1 64-62" stroke="#fff" stroke-opacity=".55" stroke-width="10" stroke-linecap="round" fill="none"/>
</g></svg>`;

(async()=>{
  const b=await chromium.launch();
  const jobs=[['apple-touch-icon.png',180,1],['icon-192.png',192,1],['icon-512.png',512,1],['icon-maskable-512.png',512,.8],['favicon-32.png',32,1.25]];
  for(const [name,size,scale] of jobs){
    const p=await b.newPage({viewport:{width:size,height:size}});
    await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(scale)}`);
    await p.screenshot({path:path.join(out,name)});
    await p.close();
  }
  await b.close();
})();
