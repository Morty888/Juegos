  /* -------------------------
     CONFIG y estado del juego
     ------------------------- */
     const gameArea = document.getElementById('gameArea');
     const starCanvas = document.getElementById('starCanvas');
     const startBtn = document.getElementById('startBtn');
     const musicToggle = document.getElementById('musicToggle');
     const musicState = document.getElementById('musicState');
     const musicLed = document.getElementById('musicLed');
     const resetBtn = document.getElementById('resetBtn');
     
     /* ✅ Referencias a los dos HUD */
     const hud1 = document.getElementById('hud1'); // Puntos
     const hud2 = document.getElementById('hud2'); // Nivel
     
   
     const musica = document.getElementById('musicaFondo');
     const sonidoAcierto = document.getElementById('sonidoAcierto');
     const sonidoFallo = document.getElementById('sonidoFallo');
     
   
     const redesHTML = [   //ICONOS DE REDES SOCIALES <-> Se insertan usando etiquetas <i> o <span> con clases específicas.
       '<i class="fab fa-facebook" style="color:#1877f2;"></i>',
       '<i class="fab fa-instagram" style="color:#e1306c;"></i>',
       '<i class="fab fa-tiktok" style="color:#000;"></i>',
       '<i class="fab fa-youtube" style="color:#ff0000;"></i>',
       '<i class="fab fa-twitter" style="color:#1da1f2;"></i>',
       '<i class="fab fa-linkedin" style="color:#0077b5;"></i>'
     ];
     
     const trampaHTML = '<span style="font-size:66px;">💩</span>';  //ICONO CACA
     
     let puntos = 0;
     let nivel = 1;
     let velocidad = 2000;  // vida del icono (ms)
     let intervalo = 800;   // tiempo entre spawns (ms)
     let spawner = null;
     let juegoActivo = false;
     let iconosActivos = new Set();
     
     /* -------------------------
        STARFIELD (canvas)
        ------------------------- */
     const ctx = starCanvas.getContext('2d', { alpha: true }); //se define la const canvas 2D dibujar en graficos planos.  -> ctx es como tu pincel virtual.
     let stars = [];
     function resizeCanvas() {
       starCanvas.width = gameArea.clientWidth;
       starCanvas.height = gameArea.clientHeight;
     }
     window.addEventListener('resize', () => {
       resizeCanvas();
       initStars();
     });
     function initStars() {
       stars = [];
       const count = Math.floor((starCanvas.width * starCanvas.height) / 2000);
       for (let i=0;i<count;i++){
         stars.push({
           x: Math.random()*starCanvas.width,
           y: Math.random()*starCanvas.height,
           r: Math.random()*1.6 + 0.4,
           alpha: Math.random()*0.8 + 0.2,
           dx: (Math.random()-0.5)*0.02,
           dy: (Math.random()-0.5)*0.02,
           twinkle: Math.random()*0.02 + 0.005
         });
       }
     }
     function drawStars() {
       ctx.clearRect(0,0,starCanvas.width, starCanvas.height);
       for (const s of stars){
         s.alpha += (Math.random()-0.5)*s.twinkle;
         s.alpha = Math.max(0.15, Math.min(1, s.alpha));
         ctx.beginPath();
         ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
         ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
         ctx.fill();
         s.x += s.dx;
         s.y += s.dy;
         if (s.x < 0) s.x = starCanvas.width;
         if (s.x > starCanvas.width) s.x = 0;
         if (s.y < 0) s.y = starCanvas.height;
         if (s.y > starCanvas.height) s.y = 0;
       }
       requestAnimationFrame(drawStars);
     }
     
     /* -------------------------
        SPAWNER / ICON LOGIC
        ------------------------- */
     function randomPositionForIcon(iconSize=66){
       const w = gameArea.clientWidth - iconSize;
       const h = gameArea.clientHeight - iconSize;
       return { x: Math.random()*w, y: Math.random()*h };
     }
     
     function spawnIcon(){
       if (!juegoActivo) return;
       const icono = document.createElement('div');
       icono.className = 'icono';
       const esCaca = Math.random() < 0.20;
       icono.innerHTML = esCaca ? trampaHTML : redesHTML[Math.floor(Math.random()*redesHTML.length)];
     
       const size = 66;
       const pos = randomPositionForIcon(size);
       let x = pos.x, y = pos.y;
       icono.style.left = x + 'px';
       icono.style.top  = y + 'px';
     
       const speedBase = 1 + (nivel-1)*0.4;
       let dx = (Math.random()-0.5) * (2.2 * speedBase);
       let dy = (Math.random()-0.5) * (2.2 * speedBase);
     
       const id = Symbol();
       iconosActivos.add(id);
     
       icono.addEventListener('click', (ev) => {
         ev.stopPropagation();
         if (!juegoActivo) return;
         if (!musica._unlocked) unlockAudio();
         if (esCaca){
           puntos = 0;
           nivel = 1;
           velocidad = 2000;
           intervalo = 800;
           playSafe(sonidoFallo);
           restartSpawner();
         } else {
           puntos++;
           playSafe(sonidoAcierto);
           if (puntos % 10 === 0){
             nivel++;
             velocidad = Math.max(800, velocidad - 200);
             intervalo = Math.max(300, intervalo - 100);
             restartSpawner();
           }
         }
         updateHUD();
         icono.remove();
         iconosActivos.delete(id);
       });
     
       gameArea.appendChild(icono);
     
       const mover = setInterval(() => {
         x += dx; y += dy;
         if (x <= 0){ x = 0; dx *= -1; }
         if (y <= 0){ y = 0; dy *= -1; }
         if (x >= gameArea.clientWidth - 66){ x = gameArea.clientWidth - 66; dx *= -1; }
         if (y >= gameArea.clientHeight - 66){ y = gameArea.clientHeight - 66; dy *= -1; }
         icono.style.left = x + 'px';
         icono.style.top  = y + 'px';
       }, 16);
     
       const remover = setTimeout(() => {
         clearInterval(mover);
         if (icono.parentElement) icono.remove();
         iconosActivos.delete(id);
       }, velocidad);
     
       icono._cleanup = () => { clearInterval(mover); clearTimeout(remover); if (icono.parentElement) icono.remove(); iconosActivos.delete(id); };
     }
     
     /* CONTROL SPAWNER */
     function startSpawner(){
       if (spawner) clearInterval(spawner);
       spawner = setInterval(spawnIcon, intervalo);
     }
     function stopSpawner(){
       if (spawner) { clearInterval(spawner); spawner = null; }
     }
     function restartSpawner(){
       stopSpawner();
       startSpawner();
     }
     
     /* -------------------------
        AUDIO helpers / desbloqueo
        ------------------------- */
     function playSafe(audioEl){
       audioEl.currentTime = 0;
       audioEl.play().catch(()=>{});
     }
     function unlockAudio(){
       musica._unlocked = true;
       if (musicState.textContent === 'ON') {
         musicOn();
       }
     }
     function musicOn(){
       musica.volume = 0.32;
       musica.play().catch(()=>{});
       musicState.textContent = 'ON';
       musicLed.classList.remove('off'); musicLed.classList.add('on');
       musicToggle.classList.remove('secondary');
     }
     function musicOff(){
       musica.pause();
       musicState.textContent = 'OFF';
       musicLed.classList.remove('on'); musicLed.classList.add('off');
       musicToggle.classList.add('secondary');
     }
     
     /* -------------------------
        HUD y controles
        ------------------------- */
     
     function updateHUD(){
       if (hud1) hud1.textContent = `Puntos: ${puntos}`;
       if (hud2) hud2.textContent = `Nivel: ${nivel}`;
     }
     
     /* START / RESET handlers */
     startBtn.addEventListener('click', () => {
       if (!juegoActivo){
         juegoActivo = true;
         puntos = 0; nivel = 1; velocidad = 2000; intervalo = 800;
         updateHUD();
         resizeCanvas(); initStars(); drawStars();
         startSpawner();
         musicToggle.disabled = false;
         unlockAudio();
         startBtn.style.display = 'none';
       }
     });
     
     musicToggle.addEventListener('click', () => {
       if (musicState.textContent === 'OFF'){
         musicOn();
         musica._unlocked = true;
       } else {
         musicOff();
       }
     });
     
     resetBtn.addEventListener('click', () => {
       stopSpawner();
       juegoActivo = false;
       for (const el of Array.from(gameArea.querySelectorAll('.icono'))){
         if (el._cleanup) el._cleanup(); else el.remove();
       }
       iconosActivos.clear();
       puntos = 0; nivel = 1; velocidad = 2000; intervalo = 800;
       updateHUD();
       startBtn.style.display = 'inline-block';
     });
     
     /* -------------------------
        UTILS y arranque
        ------------------------- */
     function init(){
       updateHUD();          // mostrará Puntos: 0 | Nivel: 1
       resizeCanvas();
       initStars();
       drawStars();
       [musica, sonidoAcierto, sonidoFallo].forEach(a => { a.load(); a._unlocked = false; });
       musicOff();
     }
     init();