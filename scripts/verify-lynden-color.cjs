const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const origin='http://127.0.0.1:4175';
let html=fs.readFileSync('artifacts/lynden-bd.html','utf8');
const end=html.indexOf('</script>',html.indexOf('<script type="module">'));
html=html.slice(0,end)+'\nwindow.colorReview={config:CONFIG};\n'+html.slice(end);
const scan=fs.readFileSync(path.join(process.env.TEMP,'lynden-birthday.ply'));
async function metrics(buffer){
 const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
 let count=0,saturation=0,luma=0,squares=0;
 for(let i=0;i<data.length;i+=info.channels){
  const r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b);
  if(max<.08)continue;
  const y=.2126*r+.7152*g+.0722*b;
  count++;saturation+=(max-min)/max;luma+=y;squares+=y*y;
 }
 return {coverage:count/(info.width*info.height),saturation:saturation/count,luma:luma/count,contrast:Math.sqrt(squares/count-(luma/count)**2)};
}
(async()=>{
 const browser=await chromium.connectOverCDP(process.argv[2]);
 for(const context of browser.contexts())for(const page of context.pages())if(page.url()===origin+'/lynden-bd.html')await page.goto('about:blank');
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await context.route('**/Birthday_2025_pub.ply?*',route=>route.fulfill({body:scan,contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}}));
 await context.route(origin+'/lynden-bd.html',route=>route.fulfill({body:html,contentType:'text/html'}));
 try{
  await page.goto(origin+'/lynden-bd.html');await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  const config=await page.evaluate(()=>window.colorReview.config);
  assert.deepEqual(config.scanColor,{saturation:1.16,contrast:1.14});
  assert.equal(config.pointSize,.0055);assert.equal(config.introAnimation.duration,70000);
  assert.equal(config.smoothWheelZoom.enabled,false);assert.equal(config.touchNavigator.enabled,false);
  await page.evaluate(()=>{const c=window.colorReview.config;c.introAnimation.duration=1000;c.cameraSystem.idleBeforeAutoMs=1e9;c.stageSystem.enabled=false;});
  await page.locator('#loading-enter-btn').click();await page.waitForTimeout(1600);
  await page.keyboard.press('2');await page.waitForTimeout(2000);
  const baseline=await page.evaluate(()=>{const u=window.pointCloudMaterial.uniforms;u.scanSaturation.value=1;u.scanContrast.value=1;return u.scan1ColorX.value.toArray();});
  await page.waitForTimeout(200);
  const before=await page.locator('canvas').first().screenshot({path:'dist/lynden-color-before.png'});
  await page.evaluate(()=>{const u=window.pointCloudMaterial.uniforms;u.scanSaturation.value=1.16;u.scanContrast.value=1.14;});
  await page.waitForTimeout(200);
  const after=await page.locator('canvas').first().screenshot({path:'dist/lynden-color-after.png'});
  const comparison={before:await metrics(before),after:await metrics(after)};
  assert(comparison.after.coverage>.03);assert(comparison.after.saturation>comparison.before.saturation);
  assert(comparison.after.contrast>comparison.before.contrast);
  assert.deepEqual(await page.evaluate(()=>window.pointCloudMaterial.uniforms.scan1ColorX.value.toArray()),baseline);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);
  assert.equal(await page.evaluate(()=>innerWidth),390);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const mobile=await page.screenshot({path:'dist/lynden-color-phone.png'});assert((await metrics(mobile)).coverage>.03);
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('dist/lynden-color-results.json',JSON.stringify({status:'passed',comparison,errors},null,2));
  console.log(JSON.stringify({status:'passed',comparison,errors}));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
