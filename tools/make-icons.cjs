// Renders the app icons into public/icons with headless Chromium.
const {chromium}=require('playwright');
const path=require('path');
const out=path.join(__dirname,'..','public','icons');
const svg=(pad)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#15171c"/>
<g transform="translate(256 256) scale(${pad})">
<circle r="150" fill="#ffffff"/>
<path d="M0 -62V62M-62 0H62" stroke="#15171c" stroke-width="30" stroke-linecap="round"/>
</g></svg>`;
(async()=>{
  const b=await chromium.launch();
  const jobs=[['apple-touch-icon.png',180,1],['icon-192.png',192,1],['icon-512.png',512,1],['icon-maskable-512.png',512,.78],['favicon-32.png',32,1.15]];
  for(const [name,size,pad] of jobs){
    const p=await b.newPage({viewport:{width:size,height:size}});
    await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(pad)}`);
    await p.screenshot({path:path.join(out,name)});
    await p.close();
  }
  await b.close();
})();
