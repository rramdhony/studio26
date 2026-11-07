/* Studio26's finite particle opening. Content and settled artwork are the default. */
(() => {
  'use strict';
  const stage = document.getElementById('opening');
  const canvas = document.getElementById('introCanvas');
  const image = document.getElementById('introComplete');
  const control = document.getElementById('introToggle');
  if (!stage || !canvas || !image || !control) return;
  const label = control.querySelector('[data-control-label]');
  const glyph = control.querySelector('.control-glyph');
  const status = document.getElementById('introStatus');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width:750px)');
  const duration = 4.4;
  let gl, program, buffer, count = 0, frame = 0;
  let ready = false, playing = false, visible = true, time = duration, last = 0, userPlayback = false;
  let current = [0, 0], pointer = [0, 0], energy = 0;
  const uniforms = {};
  const loadedAt = performance.now();
  let scrolled = scrollY > 8;
  addEventListener('scroll', () => { scrolled = true; }, {once: true, passive: true});
  const ease = n => { const t = Math.max(0, Math.min(1, n)); return t*t*(3-2*t); };
  function logoFrame(reveal, compact) {
    const mobile = narrow.matches;
    stage.style.setProperty('--logo-opacity', String(reveal));
    stage.style.setProperty('--logo-scale', String((mobile ? .95 : .70) - compact*(mobile ? .23 : .22)));
    stage.style.setProperty('--logo-x', `${mobile ? 0 : stage.clientWidth*.19}px`);
    stage.style.setProperty('--logo-y', `${(mobile ? 30 : -40) - compact*30}px`);
    stage.style.setProperty('--particle-opacity', String(1-reveal));
  }
  function setState(state, announce = false) {
    stage.dataset.introState = state;
    label.textContent = state === 'running' ? 'Pause opening' : state === 'paused' ? 'Resume opening' : 'Replay opening';
    glyph.textContent = state === 'running' ? 'Ⅱ' : state === 'paused' ? '▷' : '↻';
    if (announce) status.textContent = state === 'running' ? 'Opening playing.' : state === 'paused' ? 'Opening paused.' : 'Opening complete.';
  }
  function stopFrame() { cancelAnimationFrame(frame); frame = 0; }
  function finish(announce = false) {
    playing = false; stopFrame(); time = duration;
    logoFrame(1,1); setState('complete', announce);
  }
  const vertex = `
    precision highp float;
    attribute vec3 aBase;
    attribute vec2 aSeed;
    uniform float uTime, uAspect, uDpr, uScatter, uScale, uEnergy;
    uniform vec2 uPointer;
    varying vec3 vColor;
    varying float vAlpha;
    mat2 rotate(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
    void main() {
      vec3 p = aBase;
      float t = uTime * .32;
      float s = aSeed.x * 6.28318;
      vec3 flow = vec3(sin(p.y*2.2+t+s), cos(p.z*2.8-t+s*.8), sin(p.x*2.4+t*.7-s));
      float life = .5 + .5*sin(t*.7+s*1.7);
      float drift = pow(life, 3.) * (.15+uEnergy*.65) + uScatter*2.9;
      p += flow * drift;
      p.xy = rotate(.10*sin(t*.35)+uPointer.x*.13) * p.xy;
      p.yz = rotate(-.65+uPointer.y*.12) * p.yz;
      p.xz = rotate(-.10 + sin(t*.3)*.2) * p.xz;
      p.xy += uPointer * .08;
      float perspective = 4.8/(4.8-p.z);
      vec2 projected = p.xy*perspective*uScale;
      projected.x /= uAspect;
      projected.y += .13;
      gl_Position = vec4(projected, 0., 1.);
      gl_PointSize = clamp((.85+aSeed.y*1.05)*perspective*uDpr, 1., 4.5);
      vec3 cobalt = vec3(.16,.34,.88);
      vec3 chrome = vec3(.74,.83,1.);
      vec3 warm = vec3(.97,.73,.61);
      float shade = .5+.5*sin(s+aBase.z*2.);
      vColor = mix(cobalt, chrome, smoothstep(.1,.9,shade));
      vColor = mix(vColor,warm,pow(aSeed.y,12.)*.8);
      vAlpha = (.25+.65*aSeed.y)*(1.-uScatter*.75);
    }`;
  const fragment = `
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      float r = length(gl_PointCoord-.5);
      if(r>.5) discard;
      float light = 1.-smoothstep(.18,.5,r);
      gl_FragColor = vec4(vColor,light*vAlpha);
    }`;

  function build() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
      if (!gl) return false;
      const compile = (type, source) => {
        const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        return shader;
      };
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Particle program unavailable');
      gl.useProgram(program);
      let seed = 260711;
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      count = narrow.matches ? 16000 : 36000;
      const data = new Float32Array(count*5);
      for (let i=0; i<count; i++) {
        const petal = Math.floor(random()*11);
        const u = random(), v = (random()-.5)*2;
        const angle = petal*2.399963 + u*.9;
        const radius = .10 + u*(.55+petal*.075);
        const width = Math.sin(u*Math.PI)*(.16+petal*.009);
        const x = Math.cos(angle)*radius - Math.sin(angle)*v*width;
        const y = Math.sin(angle)*radius + Math.cos(angle)*v*width;
        const z = .32*Math.pow(u,1.7) + .42*Math.cos(u*Math.PI*.95) + v*v*.13 - petal*.022;
        data.set([x,y,z,random(),random()],i*5);
      }
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      for(const [name,size,offset] of [['aBase',3,0],['aSeed',2,12]]) {
        const index = gl.getAttribLocation(program,name); gl.enableVertexAttribArray(index); gl.vertexAttribPointer(index,size,gl.FLOAT,false,20,offset);
      }
      for(const name of ['uTime','uAspect','uDpr','uScatter','uScale','uEnergy','uPointer']) uniforms[name]=gl.getUniformLocation(program,name);
      gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE,gl.ONE,gl.ONE); gl.disable(gl.DEPTH_TEST);
      ready = true;
      stage.dataset.motionReady = 'true';
      control.hidden = reduced.matches;
      resize();
      return true;
    } catch (error) {
      ready = false;
      stage.dataset.motionReady = 'false';
      control.hidden = true;
      finish();
      return false;
    }
  }

  function resize() {
    if (!ready || !gl || gl.isContextLost()) { logoFrame(1,1); return; }
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    canvas.width = Math.max(1, Math.round(width*dpr));
    canvas.height = Math.max(1, Math.round(height*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform1f(uniforms.uAspect,width/height);
    gl.uniform1f(uniforms.uDpr,dpr);
    gl.uniform1f(uniforms.uScale,narrow.matches ? .60 : .65);
    draw();
  }
  function draw() {
    if (!ready || !gl || gl.isContextLost()) return;
    const scatter = Math.max(0,Math.min(1,(time-1.35)/1.45));
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.uTime,time); gl.uniform1f(uniforms.uScatter,scatter);
    gl.uniform1f(uniforms.uEnergy,energy); gl.uniform2f(uniforms.uPointer,current[0],current[1]);
    gl.drawArrays(gl.POINTS,0,count);
    logoFrame(ease((time-1.45)/.9),ease((time-2.35)/1.4));
  }
  function tick(now) {
    frame=0;
    if (!playing || !visible || document.hidden) return;
    time += (now-last)/1000; last=now;
    current=current.map((value,index)=>value+(pointer[index]-value)*.045); energy*=.96;
    draw();
    if (time >= duration) { finish(userPlayback); return; }
    frame=requestAnimationFrame(tick);
  }
  function schedule() {
    stopFrame();
    if (playing && ready && visible && !document.hidden && !reduced.matches) {
      last=performance.now(); frame=requestAnimationFrame(tick);
    }
  }
  function start(reset=false, announce=true) {
    if (!ready || reduced.matches || gl.isContextLost()) return;
    if (reset) { time=0; current=[0,0]; pointer=[0,0]; energy=0; }
    userPlayback=announce; playing=true; setState('running',announce); draw(); schedule();
  }
  control.addEventListener('click',()=>{
    if (playing) { playing=false; stopFrame(); setState('paused',true); }
    else start(time >= duration);
  });
  stage.addEventListener('pointermove',event=>{
    if (!playing || event.pointerType === 'touch') return;
    const box=stage.getBoundingClientRect();
    const next=[(event.clientX-box.left)/box.width*2-1,1-(event.clientY-box.top)/box.height*2];
    energy=Math.min(1.7,energy+Math.hypot(next[0]-pointer[0],next[1]-pointer[1])*1.4); pointer=next;
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{pointer=[0,0];},{passive:true});
  document.addEventListener('visibilitychange',schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting; schedule();
  }).observe(stage);
  addEventListener('resize',resize,{passive:true});
  narrow.addEventListener('change',resize);
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault(); ready=false; stage.dataset.motionReady='false';
    finish();
    if (document.activeElement === control) stage.querySelector('.opening-project').focus({preventScroll:true});
    control.hidden=true;
  });
  function changeMotion() {
    finish();
    if (!reduced.matches && !gl && image.naturalWidth) build();
    if (reduced.matches && document.activeElement === control) stage.querySelector('.opening-project').focus({preventScroll:true});
    control.hidden=reduced.matches || !ready;
    stage.dataset.motionReady=String(ready && !reduced.matches);
    if (ready && !reduced.matches) resize();
  }
  reduced.addEventListener('change',changeMotion);
  function imageReady() {
    if (!image.naturalWidth) return;
    // A slow image must not replace a settled composition with a late autoplay.
    if (!reduced.matches && build()) {
      finish();
      if (!scrolled && performance.now()-loadedAt < 1200 && !document.hidden) start(true,false);
    }
  }
  image.addEventListener('error',()=>{finish();control.hidden=true;});
  finish();
  if (image.complete) imageReady();
  else image.addEventListener('load',imageReady,{once:true});
})();
