/* Original Studio26 parametric bloom study. No reference-site model or shader is used. */
(() => {
  'use strict';
  const stage = document.querySelector('.stage');
  const canvas = document.getElementById('bloom-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = document.getElementById('pause-motion');
  const replay = document.getElementById('replay-motion');
  const status = document.getElementById('motion-status');
  let mode = 'logo';
  let gl, program, buffer, frame = 0, time = 0, last = 0, playing = false, visible = true;
  let pointer = [0, 0], current = [0, 0], energy = 0, count = 0;
  const uniforms = {};
  const duration = () => mode === 'logo' ? 4.4 : 6;
  const ease = n => { const t = Math.max(0, Math.min(1, n)); return t*t*(3-2*t); };
  function headingLevel(id, tag) {
    const old = document.getElementById(id);
    if(old.tagName.toLowerCase() === tag) return;
    const heading = document.createElement(tag); heading.id = id;
    heading.append(...old.childNodes); old.replaceWith(heading);
  }
  function logoFrame(reveal, compact) {
    const mobile = stage.clientWidth < 750;
    stage.style.setProperty('--logo-opacity', String(reveal));
    stage.style.setProperty('--logo-scale', String(.96 + reveal*.04 - compact*(mobile ? .28 : .52)));
    stage.style.setProperty('--logo-x', `${compact*(mobile ? 0 : stage.clientWidth*.19)}px`);
    stage.style.setProperty('--logo-y', `${compact*(mobile ? -190 : -70)}px`);
    stage.style.setProperty('--particle-opacity', String(1-reveal));
    stage.style.setProperty('--copy-opacity', String(compact));
    stage.dataset.phase = compact >= 1 ? 'settled' : 'revealing';
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

  function announce(text) { status.textContent = text; }
  function settle() {
    playing = false;
    cancelAnimationFrame(frame); frame = 0;
    stage.dataset.playing = 'false';
    pause.textContent = 'Play motion';
    if (mode === 'logo') {
      logoFrame(1, 1);
    }
  }
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
      count = innerWidth < 750 ? 16000 : 36000;
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
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.disable(gl.DEPTH_TEST);
      stage.dataset.ready = 'true';
      replay.hidden = false;
      resize();
      return true;
    } catch (error) {
      stage.dataset.renderError = error.message;
      stage.dataset.ready = 'false';
      pause.hidden = true;
      replay.hidden = true;
      settle();
      return false;
    }
  }
  function resize() {
    if(!gl) { if(mode==='logo') logoFrame(1,1); return; }
    const dpr = Math.min(devicePixelRatio || 1,1.5);
    const w=stage.clientWidth,h=stage.clientHeight;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform1f(uniforms.uAspect,w/h);gl.uniform1f(uniforms.uDpr,dpr);
    gl.uniform1f(uniforms.uScale,w<750?.30:.65);
    draw();
    if(!playing && mode==='logo' && (time>=duration() || reduced.matches)) logoFrame(1,1);
  }
  function draw() {
    if(!gl || gl.isContextLost()) return;
    const scatter = mode==='logo' ? Math.max(0,Math.min(1,(time-1.35)/1.45)) : 0;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uScatter,scatter);
    gl.uniform1f(uniforms.uEnergy,energy);gl.uniform2f(uniforms.uPointer,current[0],current[1]);
    gl.drawArrays(gl.POINTS,0,count);
    if(mode==='logo') {
      logoFrame(ease((time-1.45)/.9), ease((time-2.35)/1.4));
    }
  }
  function tick(now) {
    frame=0;
    if(!playing || !visible || document.hidden) return;
    time+=Math.min((now-last)/1000,.05);last=now;
    current=current.map((v,i)=>v+(pointer[i]-v)*.045);energy*=.96;
    draw();
    if(time>=duration()) { settle(); announce('Opening complete. Replay is available.'); return; }
    frame=requestAnimationFrame(tick);
  }
  function start(reset=false) {
    if(reduced.matches || !gl) return;
    if(reset) {time=0;energy=0;current=[0,0];pointer=[0,0];}
    playing=true;stage.dataset.playing='true';pause.hidden=false;pause.textContent='Pause motion';
    if(reset) draw();
    if(!frame && visible && !document.hidden) {last=performance.now();frame=requestAnimationFrame(tick);}
  }
  pause.addEventListener('click',()=>{
    if(playing) {playing=false;cancelAnimationFrame(frame);frame=0;stage.dataset.playing='false';pause.textContent='Resume motion';announce('Opening paused.');}
    else {start(time>=duration());announce('Opening playing.');}
  });
  replay.addEventListener('click',()=>{start(true);announce('Opening replaying.');});
  document.querySelectorAll('[data-mode]').forEach(button=>{
    if(button.tagName!=='BUTTON') return;
    button.addEventListener('click',()=>{
      mode=button.dataset.mode;stage.dataset.mode=mode;
      document.querySelectorAll('button[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      document.getElementById('stage-identity').textContent=mode==='academy'?'Studio26 Academy':'Studio26';
      document.getElementById('stage-note').textContent=mode==='academy'?'An idea taking shape.':'Websites, AI assistants & films.';
      document.querySelector('.academy-copy').hidden = mode !== 'academy';
      document.querySelector('.homepage-copy').hidden = mode !== 'logo';
      headingLevel('hero-title', mode === 'academy' ? 'h1' : 'h2');
      headingLevel('home-title', mode === 'logo' ? 'h1' : 'h2');
      stage.setAttribute('aria-labelledby', mode === 'academy' ? 'hero-title' : 'home-title');
      document.querySelector('.logo-reveal').setAttribute('aria-hidden',String(mode!=='logo'));
      start(true);
      if(reduced.matches || !gl) settle();
    });
  });
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch' || !playing) return;
    const box=stage.getBoundingClientRect();
    const next=[(event.clientX-box.left)/box.width*2-1,1-(event.clientY-box.top)/box.height*2];
    energy=Math.min(1.7,energy+Math.hypot(next[0]-pointer[0],next[1]-pointer[1])*1.4);pointer=next;
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{pointer=[0,0];},{passive:true});
  const syncVisibility=()=>{cancelAnimationFrame(frame);frame=0;if(playing && visible && !document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}};
  document.addEventListener('visibilitychange',syncVisibility);
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncVisibility();}).observe(stage);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){settle();pause.hidden=true;replay.hidden=true;stage.dataset.ready='false';}
    else {if(!gl) build();stage.dataset.ready=String(Boolean(gl));replay.hidden=!gl;draw();settle();}
  });
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();settle();stage.dataset.ready='false';pause.hidden=true;replay.hidden=true;});
  window.addEventListener('resize',resize,{passive:true});
  if(!reduced.matches && build()) start(true);
  if(reduced.matches || !gl) settle();
})();
