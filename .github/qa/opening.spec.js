const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
async function pauseOpening(page){
  await expect(page.locator('#opening')).toHaveAttribute('data-motion-ready','true');
  await expect.poll(()=>page.locator('#opening').evaluate(el=>{
    const control=document.getElementById('introToggle');
    if(el.dataset.introState==='complete') control.click();
    if(el.dataset.introState==='running') control.click();
    return el.dataset.introState;
  })).toBe('paused');
}

test('finite production opening keeps content usable and settles to a compact logo',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('#opening')).toHaveAttribute('data-motion-ready','true');
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('.opening-project')).toBeVisible();
  await expect(page.locator('#introStatus')).toHaveText('');
  await pauseOpening(page);
  await page.locator('#introToggle').click();
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','complete',{timeout:8000});
  expect((await page.locator('#introComplete').boundingBox()).width).toBeLessThanOrEqual(450);
  await page.locator('#introToggle').click();
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','running');
  expect(errors).toEqual([]);
});

test('graphics context loss settles safely and removes unusable controls',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#opening')).toHaveAttribute('data-motion-ready','true');
  await page.locator('#introToggle').focus();
  await page.locator('#introCanvas').evaluate(c=>c.getContext('webgl').getExtension('WEBGL_lose_context').loseContext());
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','complete');
  await expect(page.locator('#opening')).toHaveAttribute('data-motion-ready','false');
  await expect(page.locator('.opening-project')).toBeFocused();
  await expect(page.locator('#introToggle')).toBeHidden();
  expect(await page.locator('.opening-stage').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  await page.setViewportSize({width:390,height:844});
  expect((await page.locator('#introComplete').boundingBox()).width).toBeLessThan(300);
});

test('resize while paused preserves the frame, motion preferences retain focus',async({page})=>{
  await page.goto('/');await expect(page.locator('#introToggle')).toBeVisible();
  await pauseOpening(page);
  const opacity=await page.locator('.opening-stage').evaluate(el=>getComputedStyle(el).opacity);
  await page.setViewportSize({width:390,height:844});
  expect(await page.locator('.opening-stage').evaluate(el=>getComputedStyle(el).opacity)).toBe(opacity);
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','paused');
  await page.locator('#introToggle').focus();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.opening-project')).toBeFocused();
  await expect(page.locator('#introToggle')).toBeHidden();
  await page.setViewportSize({width:750,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect.poll(()=>page.locator('#introCanvas').evaluate(c=>c.width)).toBeGreaterThan(1);
  expect(await page.locator('#introCanvas').evaluate(c=>{const gl=c.getContext('webgl');const aspect=gl.getUniform(gl.getParameter(gl.CURRENT_PROGRAM),gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM),'uAspect'));return aspect>0 && Number.isFinite(aspect);})).toBe(true);
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','complete');
  await expect(page.locator('#introToggle')).toHaveText(/Replay opening/);
});

test('dark opening has no overflow or accessibility violations at required widths',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  for(const width of [320,375,390,430,750,751,760,767,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});


test('mobile flow preserves links and controls with enlarged and spaced text',async({page})=>{
  await page.setViewportSize({width:320,height:900});
  await page.goto('/');await expect(page.locator('#introToggle')).toBeVisible();
  await page.addStyleTag({content:'.opening-particles p,.opening-particles a,.opening-particles button{font-size:24px!important;letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}.opening-particles h1{font-size:72px!important;line-height:1.5!important;letter-spacing:.12em!important;overflow-wrap:anywhere}'});
  const section=await page.locator('#opening').boundingBox();
  const heading=await page.locator('.opening-heading').boundingBox();
  const bottom=await page.locator('.opening-bottom').boundingBox();
  expect(bottom.y).toBeGreaterThanOrEqual(heading.y+heading.height);
  for(const selector of ['.opening-project','#introToggle']){
    const box=await page.locator(selector).boundingBox();
    expect(box.y+box.height).toBeLessThanOrEqual(section.y+section.height);
    expect(box.x+box.width).toBeLessThanOrEqual(320);
  }
});

test('CSS and animation agree at the mobile breakpoint, including classic scrollbar widths',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  for(const width of [750,751,760,767,768]){
    await page.setViewportSize({width,height:900});
    const result=await page.locator('#opening').evaluate(el=>({mobile:matchMedia('(max-width:750px)').matches,x:parseFloat(getComputedStyle(el).getPropertyValue('--logo-x')),width:el.clientWidth,scale:parseFloat(getComputedStyle(el).getPropertyValue('--logo-scale'))}));
    expect(result.x).toBeCloseTo(result.mobile?0:result.width*.19,1);
    expect(result.scale).toBeCloseTo(result.mobile?.72:.48,2);
  }
});

for(const failure of ['unavailable','shader']) test(`graphics ${failure} leaves the settled artwork and enquiry usable`,async({page})=>{
  await page.addInitScript(mode=>{
    if(mode==='unavailable'){
      const original=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};
    }else WebGLRenderingContext.prototype.getShaderParameter=()=>false;
  },failure);
  await page.goto('/');await expect(page.locator('#introComplete')).toBeVisible();
  await expect(page.locator('#introToggle')).toBeHidden();
  await expect(page.locator('.opening-project')).toBeVisible();
  expect(await page.locator('.opening-stage').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
});

test('reduced motion at load can enable an explicit replay without late autoplay',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('#introToggle')).toBeHidden();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('#introToggle')).toBeVisible();
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','complete');
  await page.locator('#introToggle').click();
  await expect(page.locator('#opening')).toHaveAttribute('data-intro-state','running');
});
