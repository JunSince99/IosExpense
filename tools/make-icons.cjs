// Renders the app icons (a geometric white "한" on ink) into public/icons with headless Chromium.
// Run: node tools/make-icons.cjs  (needs Playwright with Chromium)
const {chromium}=require('playwright');
const path=require('path');
const out=path.join(__dirname,'..','public','icons');

// scale shrinks the mark toward the center (maskable icons need a safe zone)
const svg=(scale)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#15171c"/>
<g transform="translate(256 256) scale(${scale}) translate(-263 -251)" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">
 <path d="M190 146h52M164 186h104"/><circle cx="216" cy="244" r="34"/>
 <path d="M322 128v178M322 214h40"/>
 <path d="M178 318v56h176"/>
</g></svg>`;

(async()=>{
  const b=await chromium.launch();
  const jobs=[['apple-touch-icon.png',180,.92],['icon-192.png',192,.92],['icon-512.png',512,.92],['icon-maskable-512.png',512,.74],['favicon-32.png',32,1.1]];
  for(const [name,size,scale] of jobs){
    const p=await b.newPage({viewport:{width:size,height:size}});
    await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(scale)}`);
    await p.screenshot({path:path.join(out,name)});
    await p.close();
  }
  await b.close();
})();
