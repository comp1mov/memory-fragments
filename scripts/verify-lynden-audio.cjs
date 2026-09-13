const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let html=fs.readFileSync('artifacts/lynden-bd.html','utf8');
const end=html.indexOf('</script>',html.indexOf('<script type="module">'));
html=html.slice(0,end)+`\nwindow.audioReview={config:CONFIG,state:()=>({music:musicPlaying,enabled:audioState.enabled,source:audioState.source,pending:audioState.pendingSource})};\n`+html.slice(end);
const scan=fs.readFileSync(path.join(process.env.TEMP,'lynden-birthday.ply'));
const publishedScan=fs.readFileSync(process.env.LYNDEN_SCAN || 'dist/lynden-published-scan.ply');
(async()=>{
 const browser=await chromium.connectOverCDP(process.argv[2]);
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{
  // Synthetic input only: this test never opens a physical microphone.
  const OriginalContext=window.AudioContext;
  const test=window.audioTest={mode:'success',calls:0,streams:[],contexts:[],speakerConnections:0};
  window.AudioContext=class extends OriginalContext{constructor(...args){super(...args);test.contexts.push(this);}};
  const connect=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(destination,...args){if(destination===this.context.destination)test.speakerConnections++;return connect.call(this,destination,...args);};
  async function signal(){
   const ctx=new OriginalContext(),osc=ctx.createOscillator(),out=ctx.createMediaStreamDestination();
   osc.frequency.value=180;osc.connect(out);osc.start();await ctx.resume();
   for(const track of out.stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{stop();if(ctx.state!=='closed')void ctx.close().catch(()=>{});};}
   test.streams.push(out.stream);return out.stream;
  }
  navigator.mediaDevices.getUserMedia=async()=>{
   test.calls++;
   if(test.mode==='denied')throw new DOMException('Permission denied','NotAllowedError');
   const stream=await signal();
   if(test.mode==='pending')return new Promise(resolve=>{test.resolve=()=>resolve(stream);});
   return stream;
  };
 });
 await context.route('**/Birthday_2025_pub.ply?*',route=>route.fulfill({body:scan,contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}}));
 await context.route('**/Lynden_Birthday_2025_pub.ply?*',route=>route.fulfill({body:publishedScan,contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}}));
 await context.route('http://127.0.0.1:4175/lynden-bd.html',route=>route.fulfill({body:html,contentType:'text/html'}));
 const state=()=>page.evaluate(()=>window.audioReview.state());
 async function expectSource(source){await page.waitForFunction(source=>window.audioReview.state().source===source,source,{timeout:90000});}
 async function noTracks(){await page.waitForFunction(()=>audioTest.streams.every(s=>s.getTracks().every(t=>t.readyState==='ended')));}
 try{
  await page.goto('http://127.0.0.1:4175/lynden-bd.html');await page.locator('#loading-enter-btn.ready').waitFor({timeout:90000});
  assert.equal(await page.evaluate(()=>audioTest.calls),0);
  await page.evaluate(()=>{audioReview.config.introAnimation.duration=1000;audioReview.config.cameraSystem.idleBeforeAutoMs=1e9;});
  const settings=await page.evaluate(()=>JSON.stringify(audioReview.config));
  await page.locator('#loading-enter-btn').tap();await page.waitForTimeout(1500);
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).tap();await expectSource('mic');
  assert.equal((await state()).music,false);assert.equal(await page.evaluate(()=>audioTest.speakerConnections),0);
  assert.equal(await page.evaluate(()=>typeof window.strudel),'undefined');
  await page.waitForFunction(()=>window.pointCloudMaterial.uniforms.audioLevel.value>0.01);
  await page.getByRole('button',{name:'Disable microphone reaction',exact:true}).tap();await expectSource(null);await noTracks();
  await page.waitForFunction(()=>audioTest.contexts.every(c=>c.state==='closed'));
  await page.evaluate(()=>audioTest.mode='denied');
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).tap();
  await page.waitForFunction(()=>document.querySelector('#music-status').textContent==='Microphone permission denied');
  assert.equal((await state()).enabled,false);assert.equal((await state()).music,false);
  await page.evaluate(()=>audioTest.mode='pending');
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).tap();
  await page.waitForFunction(()=>typeof audioTest.resolve==='function');
  await page.getByRole('button',{name:'Cancel microphone request',exact:true}).tap();
  await page.waitForFunction(()=>audioTest.contexts.every(c=>c.state==='closed'));
  await page.evaluate(()=>{audioTest.resolve();audioTest.resolve=null;});await noTracks();assert.equal((await state()).enabled,false);
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).tap();await page.waitForFunction(()=>typeof audioTest.resolve==='function');
  const calls=await page.evaluate(()=>audioTest.calls);
  await page.getByRole('button',{name:'Play Cheers',exact:true}).tap();
  await page.evaluate(()=>{audioTest.resolve();audioTest.mode='success';});
  await expectSource('strudel');await noTracks();assert.equal((await state()).music,true);
  assert.equal(await page.evaluate(()=>audioTest.calls),calls,'Play must not request the microphone');
  await page.waitForFunction(()=>window.pointCloudMaterial.uniforms.audioLevel.value>0.01);
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).tap();await expectSource('mic');assert.equal((await state()).music,false);
  await page.screenshot({path:'dist/lynden-microphone-mode.png'});
  await page.getByRole('button',{name:'Play Cheers',exact:true}).tap();await expectSource('strudel');await noTracks();
  await page.getByRole('button',{name:'Stop Cheers',exact:true}).tap();await expectSource(null);
  assert.equal((await state()).music,false);assert.equal(await page.evaluate(()=>window.pointCloudMaterial.uniforms.audioLevel.value),0);
  assert.equal(await page.evaluate(()=>JSON.stringify(audioReview.config)),settings,'Audio mode must not change project settings');
  await page.goto('http://127.0.0.1:4176/');
  await page.waitForFunction(()=>document.querySelector('#engine').contentWindow.craftEngine?.ready&&document.querySelector('#boot').hidden,null,{timeout:90000});
  const frame=page.frames().find(f=>f.url().includes('/engine.html'));
  const project=await frame.evaluate(()=>JSON.stringify(window.craftEngine.snapshot().config));
  await page.getByRole('button',{name:'Enable microphone reaction',exact:true}).click();
  await frame.waitForFunction(()=>window.craftEngine.audio().source==='mic');assert.equal(await frame.evaluate(()=>window.craftEngine.music()),false);
  await page.getByRole('button',{name:'Disable microphone reaction',exact:true}).click();await frame.waitForFunction(()=>window.craftEngine.audio().source===null);
  assert.equal(await frame.evaluate(()=>JSON.stringify(window.craftEngine.snapshot().config)),project);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
  const boxes=await page.locator('.tools button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,right:r.right};}));
  assert(boxes.every(r=>r.x>=0&&r.right<=390));for(let i=1;i<boxes.length;i++)assert(boxes[i].x>=boxes[i-1].right);
  await page.screenshot({path:'dist/craft-audio-tools-phone.png'});
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('dist/lynden-audio-results.json',JSON.stringify({status:'passed',syntheticMicrophone:true,checks:['silent mic','denial','cancel','late permission','play without mic','source switching','project preserved','craft toolbar'],errors},null,2));
  console.log('Passed: silent microphone, denied/cancelled permissions, late permission cleanup, music + effects, source switching, unchanged settings, craft toolbar.');
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
