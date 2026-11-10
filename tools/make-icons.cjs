// Renders the app icons (three overlapping coins in category colors on white) into public/icons.
// Run: node tools/make-icons.cjs  (needs Playwright with Chromium)
const {chromium}=require('playwright');
const path=require('path');
const out=path.join(__dirname,'..','public','icons');

// scale shrinks the mark toward the center (maskable icons need a safe zone)
const svg=(scale)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#ffffff"/>
<g transform="translate(256 256) scale(${scale}) translate(-256 -268)">
 <circle cx="206" cy="226" r="86" fill="#3b82f6" opacity=".9"/>
 <circle cx="306" cy="226" r="86" fill="#ef7d3c" opacity=".9"/>
 <circle cx="256" cy="310" r="86" fill="#8b5cf6" opacity=".9"/>
</g></svg>`;

(async()=>{
  const b=await chromium.launch();
  const jobs=[['apple-touch-icon.png',180,1],['icon-192.png',192,1],['icon-512.png',512,1],['icon-maskable-512.png',512,.8],['favicon-32.png',32,1.2]];
  for(const [name,size,scale] of jobs){
    const p=await b.newPage({viewport:{width:size,height:size}});
    await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(scale)}`);
    await p.screenshot({path:path.join(out,name)});
    await p.close();
  }
  await b.close();
})();
