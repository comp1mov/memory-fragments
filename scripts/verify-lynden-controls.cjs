const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const baseline=process.argv.includes('--baseline');
const project=JSON.parse(fs.readFileSync('data/lynden-bd.craft.json','utf8'));
const source=baseline?'../../.publish-point-of-view-fresh/MemoryFragments/lynden-bd.html':'artifacts/lynden-bd.html';
let html=fs.readFileSync(source,'utf8');
const start=html.indexOf('<script type="module">'),end=html.indexOf('</script>',start);
html=html.slice(0,end)+`\nwindow.lyndenReview={
  config:CONFIG,
  state:()=>({distance:camera.position.distanceTo(controls.target),position:camera.position.toArray(),target:controls.target.toArray(),intro:!!window.__introRunning,music:musicPlaying,audio:audioState.enabled,transition:CAMSYS.inTransition}),
  startTour:()=>{CAMSYS.autoMode=true;_startTransition(_poseFromConfig(CONFIG.cameraSystem.presets['1']),5000);},
};\n`+html.slice(end);
const scan=fs.readFileSync(process.env.LYNDEN_SCAN || 'dist/lynden-published-scan.ply');
(async()=>{
 const browser=await chromium.connectOverCDP(process.argv[2]);
 const context=await browser.newContext({viewport:{width:1024,height:1366},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*Birthday_2025_pub.ply?*',route=>route.fulfill({body:scan,contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}}));
 await context.route('http://127.0.0.1:4175/lynden-bd.html',route=>route.fulfill({body:html,contentType:'text/html'}));
 const state=()=>page.evaluate(()=>window.lyndenReview.state());
 try{
  await page.goto('http://127.0.0.1:4175/lynden-bd.html');
  await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  assert.equal(await page.locator('#loading-scan-title').textContent(),'Lynden Birthday');
  await page.locator('#loading-enter-btn').tap();
  await page.waitForTimeout(1500);
  const cdp=await context.newCDPSession(page);
  async function touch(type,points){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y],id)=>({x,y,id,radiusX:5,radiusY:5,force:1}))});}
  const initial=await state();
  await touch('touchStart',[[470,680],[554,680]]);
  for(let i=1;i<=12;i++){await touch('touchMove',[[470-i*7,680],[554+i*7,680]]);await page.waitForTimeout(20);}
  const during=await state();await touch('touchEnd',[]);await page.waitForTimeout(1200);
  const after=await state();
  const report={baseline,initial:initial.distance,during:during.distance,after:after.distance};
  console.log(JSON.stringify(report));
  if(baseline){console.log(JSON.stringify(report));return;}
  assert(after.distance<initial.distance*.65,'Pinch must retain the new zoom');
  await page.waitForTimeout(600);
  assert(Math.abs((await state()).distance-after.distance)<.02,'Camera must retain its settled zoom');
  await touch('touchStart',[[500,680]]);
  for(let i=1;i<=10;i++)await touch('touchMove',[[500+i*9,680-i*3]]);
  await touch('touchEnd',[]);await page.waitForTimeout(500);
  assert.notDeepEqual((await state()).position,after.position,'One-finger orbit');
  const beforePan=await state();
  await touch('touchStart',[[450,650],[550,650]]);
  for(let i=1;i<=10;i++)await touch('touchMove',[[450+i*5,650],[550+i*5,650]]);
  await touch('touchEnd',[]);await page.waitForTimeout(500);
  assert.notDeepEqual((await state()).target,beforePan.target,'Two-finger pan');
  assert.equal(await page.locator('#touch-nav').isVisible(),false);
  assert.equal(await page.locator('#corner-music').count(),0);
  assert.equal(await page.locator('#corner-strudel').textContent(),'@');
  assert.equal(await page.evaluate(()=>window.pointCloudMaterial.uniforms.pointSize.value),project.config.pointSize);
  const colors=await page.evaluate(()=>['scan1ColorX','scan1ColorY','scan1ColorZ','flicker2Color','flicker3Color','scan2Color'].map(k=>window.pointCloudMaterial.uniforms[k].value.toArray()));
  assert(colors.every(([r,g,b])=>r>g&&g>b),'All sweeps must use warm orange hues');
  assert.equal(await page.evaluate(()=>window.lyndenReview.config.introAnimation.duration),70000);
  assert.equal((await state()).intro,true);
  await page.getByRole('button',{name:'Play Cheers',exact:true}).tap();
  await page.waitForFunction(()=>window.lyndenReview.state().music&&window.lyndenReview.state().audio,null,{timeout:90000});
  assert.equal(await page.locator('#strudel-panel').isVisible(),false);
  await page.waitForTimeout(5000);
  await page.getByRole('button',{name:'Stop Cheers',exact:true}).tap();
  await page.waitForFunction(()=>!window.lyndenReview.state().music&&!window.lyndenReview.state().audio);
  await page.waitForFunction(()=>!window.lyndenReview.state().intro,null,{timeout:80000});
  await page.screenshot({path:'dist/lynden-ipad-controls.png'});
  const image=await page.locator('canvas').first().screenshot();
  const {data,info}=await sharp(image).raw().toBuffer({resolveWithObject:true});
  let lit=0;for(let i=0;i<data.length;i+=info.channels)if(data[i]+data[i+1]+data[i+2]>60)lit++;
  report.canvasCoverage=lit/(info.width*info.height);assert(report.canvasCoverage>.03);
  await page.evaluate(()=>window.lyndenReview.startTour());await page.waitForTimeout(300);
  assert.equal((await state()).transition,true);
  const tourPose=await state();
  await touch('touchStart',[[500,680]]);
  assert.equal((await state()).transition,false,'First touch interrupts the tour');
  for(let i=1;i<=8;i++)await touch('touchMove',[[500+i*8,680]]);
  await touch('touchEnd',[]);await page.waitForTimeout(400);
  assert.notDeepEqual((await state()).position,tourPose.position,'The same gesture controls the camera');
  await page.setViewportSize({width:390,height:844});await page.reload();
  await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  assert.equal(await page.evaluate(()=>innerWidth),390,'Phone layout must use the device width');
  await page.evaluate(()=>window.lyndenReview.config.introAnimation.duration=1000);
  await page.locator('#loading-enter-btn').tap();await page.waitForTimeout(1800);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const boxes=await page.locator('#corner-strudel,#corner-audio-reactive,#corner-help').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}}));
  assert(boxes.every(r=>r.w>=44&&r.h>=44));
  await page.screenshot({path:'dist/lynden-phone-controls.png'});
  await page.setViewportSize({width:1440,height:900});await page.reload();
  await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  await page.evaluate(()=>window.lyndenReview.config.introAnimation.duration=1000);
  await page.locator('#loading-enter-btn').click();await page.waitForTimeout(1800);
  await page.mouse.move(700,400);const beforeWheel=await state();await page.mouse.wheel(0,-200);await page.waitForTimeout(1000);
  assert((await state()).distance<beforeWheel.distance,'Native wheel zoom');
  await page.screenshot({path:'dist/lynden-desktop-controls.png'});
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('dist/lynden-controls-results.json',JSON.stringify({...report,colors,errors,status:'passed'},null,2));
  console.log('Passed: iPad pinch, orbit, pan; native wheel; single music button; warm sweeps; 70-second intro; phone/desktop canvas. '+JSON.stringify(report));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
