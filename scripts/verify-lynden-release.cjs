const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const project=JSON.parse(fs.readFileSync('data/lynden-bd.craft.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('data/fragments.manifest.json','utf8'));
const fragment=manifest.fragments.find(f=>f.slug==='lynden-bd');
const live=process.argv.includes('--live');
const url=live?fragment.entry.githubPagesUrl:'http://127.0.0.1:4175/lynden-bd.html';
const normalize=s=>s.replace(/^\uFEFF/,'').replaceAll('\r\n','\n');
const local=fs.readFileSync('artifacts/lynden-bd.html','utf8');
(async()=>{
 const browser=await chromium.connectOverCDP(process.argv[2]);
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage(),errors=[],views=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{
  window.microphoneRequests=0;
  if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=async()=>{window.microphoneRequests++;throw Error('Unexpected microphone request');};
 });
 try{
  const html=live?await (await page.request.get(url+'?release-check='+Date.now())).text():local;
  assert.equal(normalize(html),normalize(local),'Live HTML matches the approved project');
  const end=html.indexOf('</script>',html.indexOf('<script type="module">'));
  // Expose read-only settings and existing camera/reveal commands in this test page only.
  const instrumented=html.slice(0,end)+`\nwindow.releaseReview={config:CONFIG,fragment:FRAGMENT,pose:()=>({position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov}),finish:()=>{craftStopReveal();craftSetReveal(1);CAMSYS.autoMode=false;CONFIG.cameraSystem.idleBeforeAutoMs=1e9;},view:key=>_startTransition(_poseFromConfig(CONFIG.cameraSystem.presets[key]),200)};\n`+html.slice(end);
  await page.route(url,route=>route.fulfill({body:instrumented,contentType:'text/html'}));
  if(!live)await page.route(project.fragment.scanUrl,route=>route.fulfill({body:fs.readFileSync(process.env.LYNDEN_SCAN || 'dist/lynden-published-scan.ply'),contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}}));
  await page.goto(url);
  await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  assert.equal(await page.evaluate(()=>pointCloudMesh.geometry.attributes.position.count),fragment.sourceScan.pointCountEstimate);
  assert.deepEqual(await page.evaluate(()=>releaseReview.fragment),project.fragment);
  const config=await page.evaluate(()=>releaseReview.config);
  for(const [key,value] of Object.entries(project.config))if(key!=='loadingScreen')assert.deepEqual(config[key],value,'Saved setting: '+key);
  const initial=await page.evaluate(()=>releaseReview.pose());
  assert(initial.position.every((n,i)=>Math.abs(n-project.config.cameraPosition[i])<1e-9));
  assert(initial.target.every((n,i)=>Math.abs(n-project.config.cameraTarget[i])<1e-9));
  assert.equal(initial.fov,project.config.cameraFOV);
  assert.equal(await page.locator('#loading-credit-text .credits-line').first().textContent(),'Cheers');
  await page.locator('#loading-enter-btn').click();
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>window.__introRunning),true);
  await page.evaluate(()=>releaseReview.finish());
  async function capture(name){
   await page.waitForTimeout(600);
   const screenshot=await page.locator('canvas').first().screenshot();
   const {data,info}=await sharp(screenshot).raw().toBuffer({resolveWithObject:true});
   let lit=0;for(let i=0;i<data.length;i+=info.channels)if(data[i]+data[i+1]+data[i+2]>60)lit++;
   const coverage=lit/(info.width*info.height);assert(coverage>.01,'Nonblank view: '+name);
   await page.screenshot({path:'dist/lynden-release-'+name+'.png'});
   views.push({name,coverage,pose:await page.evaluate(()=>releaseReview.pose())});
  }
  await capture('initial');
  for(const key of Object.keys(project.config.cameraSystem.presets)){
   await page.evaluate(key=>releaseReview.view(key),key);await capture('camera-'+key);
  }
  await page.getByRole('button',{name:'Play Cheers',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#corner-strudel').getAttribute('aria-pressed')==='true',null,{timeout:90000});
  await page.waitForFunction(()=>pointCloudMaterial.uniforms.audioLevel.value>0.01,null,{timeout:30000});
  assert.equal(await page.evaluate(()=>microphoneRequests),0);
  await page.getByRole('button',{name:'Stop Cheers',exact:true}).click();
  if(live){
   await page.goto('https://memoryfragments.vercel.app/fragments/lynden-bd');
   assert.equal(await page.locator('h1').innerText(),project.fragment.title);
   assert((await page.locator('body').innerText()).includes(project.artistNote));
   assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://memoryfragments.vercel.app'+fragment.cover.url);
   assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
   assert.equal(await page.getByRole('link',{name:'Open fragment',exact:true}).getAttribute('href'),url);
   assert.equal(await page.locator('iframe').count(),0);
   const cover=await page.request.get('https://memoryfragments.vercel.app'+fragment.cover.url);
   assert.deepEqual(await cover.body(),fs.readFileSync('public'+fragment.cover.url));
   await page.waitForFunction(()=>Array.from(document.images).some(i=>i.complete&&i.naturalWidth>0));
   await page.screenshot({path:'dist/lynden-release-portal.png',fullPage:true});
   await page.goto('https://memoryfragments.vercel.app/');
   assert(!(await page.locator('body').innerText()).includes('Lynden Birthday'));
   assert(!(await (await page.request.get('https://memoryfragments.vercel.app/sitemap.xml')).text()).includes('lynden-bd'));
  }
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('dist/lynden-release-results.json',JSON.stringify({status:'passed',live,points:fragment.sourceScan.pointCountEstimate,views,errors},null,2));
  console.log('Passed: exact project settings, initial camera, four nonblank cameras, scan, reveal, music without microphone'+(live?', live HTML, cover and unlisted portal.':'.'));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
