// Renders the iOS launch (splash) image into public/splash with headless Chromium.
// iPhone 16 Pro, portrait: 402×874 CSS px at 3x = 1206×2622.
// Background is the app's dark-mode --bg so the launch → app hand-off has no flash.
// Run: node tools/make-splash.cjs  (needs Playwright with Chromium)
const {chromium}=require('playwright');
const path=require('path');
const BG='#0f1013';
// the app icon's three coins, cropped to the mark itself (icon viewBox 512, mark spans x 120–392, y 140–396; 6px margin keeps edges unclipped)
const mark=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="114 134 284 268" width="${124*284/272}" height="${124*268/272}">
 <circle cx="206" cy="226" r="86" fill="#3b82f6" opacity=".9"/>
 <circle cx="306" cy="226" r="86" fill="#ef7d3c" opacity=".9"/>
 <circle cx="256" cy="310" r="86" fill="#8b5cf6" opacity=".9"/>
</svg>`;
const shots=[{file:'iphone-16-pro-portrait.png',w:402,h:874,dpr:3}];
(async()=>{
  const b=await chromium.launch();
  for(const s of shots){
    const p=await b.newPage({viewport:{width:s.w,height:s.h},deviceScaleFactor:s.dpr});
    await p.setContent(`<style>html,body{margin:0;height:100%;background:${BG}}body{display:grid;place-items:center}svg{display:block}</style>${mark}`);
    await p.screenshot({path:path.join(__dirname,'..','public','splash',s.file)});
    await p.close();
  }
  await b.close();
})();
