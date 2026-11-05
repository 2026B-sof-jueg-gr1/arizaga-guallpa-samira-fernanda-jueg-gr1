class PreloaderScene extends Phaser.Scene {
  constructor() { super('Preloader'); }
  create() {
    this.makeTextures();
    NovaArt.makeSkies(this);
    this.scene.start('Menu');
  }
  makeTextures() {
    const t = NOVA.TILE;
    const make = (name, draw) => {
      const g = this.add.graphics({ x: 0, y: 0 });
      draw(g);
      g.generateTexture(name, t, t);
      g.destroy();
    };
    const makeSized = (name, w, h, draw) => {
      const g = this.add.graphics({ x: 0, y: 0 });
      draw(g, w, h);
      g.generateTexture(name, w, h);
      g.destroy();
    };
    make('tile-floor', g => {
      g.fillStyle(0x152941).fillRect(0, 0, t, t);
      g.fillStyle(0x192e47).fillRect(2, 2, t-4, t-4);
      g.lineStyle(1, 0x294763, .75).strokeRect(2, 2, t-4, t-4);
      g.fillStyle(0x41627c, .35).fillCircle(9, 9, 1.5).fillCircle(34, 32, 1.4);
    });
    make('tile-floor-b', g => {
      g.fillStyle(0x12263b).fillRect(0, 0, t, t);
      g.fillStyle(0x193049).fillRect(2, 2, t-4, t-4);
      g.lineStyle(1, 0x294763, .55).strokeRect(2, 2, t-4, t-4);
      g.fillStyle(0x41627c, .35).fillRect(11, 10, 3, 3);
    });
    make('tile-wall', g => {
      g.fillStyle(0x102031).fillRoundedRect(1, 4, 42, 39, 7);
      g.fillStyle(0x335877).fillRoundedRect(1, 0, 42, 37, 7);
      g.fillStyle(0x4e7895).fillRoundedRect(4, 3, 36, 29, 5);
      g.fillStyle(0x273f5c).fillRoundedRect(7, 6, 30, 24, 4);
      g.lineStyle(2, 0x74e9cd, .70).strokeRoundedRect(5, 4, 34, 28, 5);
      g.fillStyle(0x7df4d6, .8).fillRect(9, 9, 4, 4).fillRect(31, 24, 4, 4);
    });
    make('tile-crate', g => {
      g.fillStyle(0x513452).fillRoundedRect(2, 5, 40, 36, 5);
      g.fillStyle(0xa35b78).fillRoundedRect(3, 1, 38, 34, 4);
      g.fillStyle(0xe88c91).fillRoundedRect(5, 3, 34, 28, 3);
      g.lineStyle(3, 0x88465f, 1).lineBetween(9, 8, 35, 29);
      g.lineStyle(3, 0x88465f, 1).lineBetween(35, 8, 9, 29);
      g.fillStyle(0xffd8aa).fillRect(6, 5, 5, 5).fillRect(33, 24, 5, 5);
    });
    make('hero', g => {
      g.fillStyle(0x061727, .28).fillEllipse(22, 39, 28, 8);
      g.fillStyle(0x5b56ba).fillRoundedRect(11, 32, 9, 9, 3).fillRoundedRect(24, 32, 9, 9, 3);
      g.fillStyle(0x35c9a8).fillRoundedRect(7, 12, 30, 24, 11);
      g.fillStyle(0x72f6cd).fillRoundedRect(9, 10, 26, 24, 10);
      g.fillStyle(0x50baa9).fillRoundedRect(2, 19, 8, 15, 4).fillRoundedRect(34, 19, 8, 15, 4);
      g.fillStyle(0xb2a2ff).fillRoundedRect(7, 3, 30, 21, 9);
      g.fillStyle(0x172b52).fillRoundedRect(10, 7, 24, 14, 6);
      g.fillStyle(0x91edff).fillEllipse(18, 12, 9, 4);
      g.fillStyle(0xffd782).fillCircle(35, 15, 3);
    });
    // Animaciones del protagonista: dibujos propios para frente, espalda y perfil.
    // El perfil tiene visor y punta orientados a la derecha; al caminar a la izquierda
    // Phaser lo refleja horizontalmente con setFlipX(true).
    const drawBoots = (g, step) => {
      g.fillStyle(0x29265f);
      g.fillRoundedRect(step ? 10 : 12, step ? 31 : 34, 11, 8, 3);
      g.fillRoundedRect(step ? 25 : 23, step ? 34 : 31, 11, 8, 3);
      g.fillStyle(0x8a83e4);
      g.fillRect(step ? 12 : 14, step ? 37 : 39, 8, 2);
      g.fillRect(step ? 27 : 25, step ? 39 : 37, 8, 2);
    };
    const drawDown = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      drawBoots(g, step);
      g.fillStyle(0x2d977f).fillRoundedRect(8, 16, 28, 21, 9);
      g.fillStyle(0x72f6cd).fillRoundedRect(10, 15, 24, 20, 9);
      g.fillStyle(0x39aa9e).fillRoundedRect(3, step ? 22 : 18, 8, 13, 3);
      g.fillStyle(0x48bdb0).fillRoundedRect(33, step ? 18 : 22, 8, 13, 3);
      g.fillStyle(0xb4a3ff).fillRoundedRect(8, 3, 28, 23, 9);
      g.fillStyle(0x172b52).fillRoundedRect(10, 8, 24, 13, 6);
      g.fillStyle(0x92f1ff).fillEllipse(19, 12, 10, 4);
      g.fillStyle(0xffd782).fillCircle(34, 16, 2.5);
      g.fillStyle(0x3b9e8b).fillRoundedRect(19, 25, 6, 7, 2);
    };
    const drawBack = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      drawBoots(g, step);
      g.fillStyle(0x2d977f).fillRoundedRect(8, 16, 28, 21, 9);
      g.fillStyle(0x6ae4bb).fillRoundedRect(10, 15, 24, 20, 9);
      g.fillStyle(0x349b95).fillRoundedRect(3, step ? 21 : 17, 8, 13, 3);
      g.fillStyle(0x349b95).fillRoundedRect(33, step ? 17 : 21, 8, 13, 3);
      g.fillStyle(0x8278d7).fillRoundedRect(7, 4, 30, 23, 9);
      g.fillStyle(0xb4a3ff).fillRoundedRect(9, 5, 26, 18, 8);
      g.fillStyle(0x6962b6).fillRoundedRect(13, 17, 18, 18, 5);
      g.fillStyle(0x3b457b).fillRoundedRect(16, 19, 12, 13, 3);
      g.fillStyle(0x72f6cd).fillRect(20, 21, 4, 8);
      g.fillStyle(0xffd782).fillCircle(22, 8, 3);
    };
    const drawSide = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      // Botas a distinta altura y brazos alternados hacen visible cada paso.
      g.fillStyle(0x38316f).fillRoundedRect(step ? 10 : 16, step ? 34 : 31, 12, 8, 3);
      g.fillStyle(0x655fbe).fillRoundedRect(step ? 26 : 20, step ? 31 : 34, 12, 8, 3);
      g.fillStyle(0x9995f9).fillRect(step ? 12 : 18, step ? 39 : 36, 9, 2);
      g.fillStyle(0x7e78de).fillRect(step ? 28 : 22, step ? 36 : 39, 9, 2);
      g.fillStyle(0x259782).fillRoundedRect(9, 16, 26, 20, 9);
      g.fillStyle(0x68e8c4).fillRoundedRect(13, 15, 22, 20, 8);
      g.fillStyle(0x2fada0).fillRoundedRect(step ? 10 : 14, step ? 19 : 24, 9, 13, 4);
      g.fillStyle(0x96f9da).fillRect(step ? 17 : 18, step ? 24 : 28, 3, 4);
      // Cabeza de perfil: protector trasero a la izquierda, visor y nariz a la derecha.
      g.fillStyle(0x766ccd).fillRoundedRect(8, 5, 29, 22, 9);
      g.fillStyle(0xbaabff).fillRoundedRect(11, 3, 25, 23, 9);
      g.fillStyle(0x1a2c50).fillRoundedRect(18, 8, 21, 13, 5);
      g.fillStyle(0x1a2c50).fillTriangle(35, 9, 42, 16, 35, 21);
      g.fillStyle(0x93f5ff).fillRoundedRect(27, 11, 9, 5, 2);
      g.fillStyle(0xd5faff).fillCircle(35, 13, 2);
      g.fillStyle(0xffd782).fillCircle(11, 17, 2.5);
      // Flecha luminosa sobre el torso, apuntando en la dirección de la mirada.
      g.fillStyle(0xffd782).fillTriangle(25, 23, 33, 26, 25, 29);
    };
    for (let step=0; step<2; step++) {
      make(`hero-down-${step}`, g => drawDown(g, step));
      make(`hero-back-${step}`, g => drawBack(g, step));
      make(`hero-side-${step}`, g => drawSide(g, step));
    }
    make('enemy-pink', g => {
      g.fillStyle(0x050e1c, .32).fillEllipse(22, 40, 31, 6);
      g.fillStyle(0xe7557d).fillRoundedRect(5, 10, 34, 29, 11);
      g.fillStyle(0xff829e).fillRoundedRect(7, 7, 30, 27, 11);
      g.fillStyle(0xff829e).fillTriangle(7, 14, 12, 2, 18, 14);
      g.fillStyle(0xff829e).fillTriangle(26, 14, 33, 2, 39, 14);
      g.fillStyle(0xffffff).fillCircle(16, 21, 5).fillCircle(28, 21, 5);
      g.fillStyle(0x15233d).fillCircle(18, 21, 2.5).fillCircle(29, 21, 2.5);
      g.fillStyle(0x91354e).fillRoundedRect(18, 29, 8, 3, 1);
    });
    make('enemy-violet', g => {
      g.fillStyle(0x050e1c, .3).fillEllipse(22, 40, 31, 6);
      g.fillStyle(0x735fd0).fillRoundedRect(5, 10, 34, 29, 11);
      g.fillStyle(0xa38aff).fillRoundedRect(7, 7, 30, 27, 11);
      g.fillStyle(0xa38aff).fillTriangle(7, 14, 12, 2, 18, 14);
      g.fillStyle(0xa38aff).fillTriangle(26, 14, 33, 2, 39, 14);
      g.fillStyle(0xffffff).fillCircle(16, 21, 5).fillCircle(28, 21, 5);
      g.fillStyle(0x15233d).fillCircle(17, 21, 2.5).fillCircle(27, 21, 2.5);
      g.fillStyle(0x5f469a).fillRoundedRect(18, 29, 8, 3, 1);
    });
    make('bomb', g => {
      g.fillStyle(0x091024, .4).fillEllipse(22, 40, 32, 7);
      g.fillStyle(0x090f23).fillCircle(22, 25, 15);
      g.fillStyle(0x263e57).fillCircle(22, 22, 15);
      g.fillStyle(0x122138).fillCircle(22, 25, 13);
      g.fillStyle(0x8cecd6).fillEllipse(16, 18, 9, 5);
      g.fillStyle(0x7b8ca6).fillRoundedRect(19, 5, 8, 9, 2);
      g.lineStyle(3, 0xffd17a).lineBetween(23, 6, 27, 2);
      g.fillStyle(0xffe3a6).fillCircle(29, 4, 3);
    });
    make('flame', g => {
      g.fillStyle(0xff4d6a, .37).fillCircle(22, 22, 22);
      g.fillStyle(0xff9666, .75).fillRoundedRect(5, 6, 34, 32, 11);
      g.fillStyle(0xffd777, .95).fillRoundedRect(10, 11, 24, 22, 8);
      g.fillStyle(0xfff8b2).fillCircle(22, 22, 9);
    });
    make('item-fire', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0xffcf72).fillTriangle(20, 5, 12, 28, 23, 30);
      g.fillStyle(0xff8a68).fillTriangle(26, 11, 16, 34, 32, 30);
      g.fillStyle(0xfff1a6).fillTriangle(23, 19, 19, 31, 26, 29);
    });
    make('item-capacity', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0x15243c).fillCircle(21, 23, 12);
      g.fillStyle(0x86e6d6).fillEllipse(17, 18, 8, 4);
      g.fillStyle(0xffc774).fillRect(20, 7, 5, 7);
      g.lineStyle(2, 0xf2c96b).lineBetween(24, 9, 28, 5);
    });
    make('item-speed', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0x9d8dff).fillTriangle(25, 8, 14, 24, 24, 24);
      g.fillStyle(0xe0caff).fillTriangle(18, 36, 31, 19, 21, 19);
    });

    // Nuevas baldosas por barrio: mismo motor, paletas y piedra distintas.
    const mix = (a,b,p) => {
      const ar=(a>>16)&255, ag=(a>>8)&255, ab=a&255;
      const br=(b>>16)&255, bg=(b>>8)&255, bb=b&255;
      return (Math.round(ar+(br-ar)*p)<<16)|(Math.round(ag+(bg-ag)*p)<<8)|Math.round(ab+(bb-ab)*p);
    };
    NOVA.STAGES.forEach((level,i)=>{
      make(`floor-${i+1}`,g=>{
        g.fillStyle(mix(level.floor,0x1B1D3C,.47)).fillRect(0,0,44,44);
        g.fillStyle(level.floor,.88).fillRoundedRect(1,1,42,42,3);
        g.lineStyle(1.2,mix(level.floor,0xFFFFFF,.35),.37);
        g.lineBetween(1,13,43,13);g.lineBetween(1,31,43,31);
        g.lineBetween(19,1,19,13);g.lineBetween(32,13,32,31);g.lineBetween(14,31,14,43);
        g.fillStyle(0xF1DDAD,.14).fillCircle(9,8,1.4).fillCircle(37,37,1.2);
      });
      make(`floor-alt-${i+1}`,g=>{
        g.fillStyle(mix(level.floor,0x1B1D3C,.52)).fillRect(0,0,44,44);
        g.fillStyle(mix(level.floor,0xEEE0C4,.12)).fillRoundedRect(1,1,42,42,3);
        g.lineStyle(1,mix(level.floor,0xFFFFFF,.45),.32).strokeRoundedRect(2,2,40,40,3);
        g.lineBetween(12,1,12,42);g.lineBetween(0,22,44,22);
        g.fillStyle(0x182A43,.14).fillRect(23,8,4,2);
      });
      make(`stonewall-${i+1}`,g=>{
        g.fillStyle(0x10182D,.44).fillRoundedRect(1,6,42,37,5);
        g.fillStyle(mix(level.wall,0x12172D,.33)).fillRoundedRect(1,2,42,36,5);
        g.fillStyle(level.wall).fillRoundedRect(3,0,38,31,5);
        g.fillStyle(mix(level.wall,0xF8E4C2,.27)).fillRoundedRect(5,2,34,23,3);
        g.lineStyle(2,mix(level.wall,0x10152B,.55),.82).lineBetween(5,13,39,13);
        g.lineStyle(1,mix(level.wall,0x10152B,.5),.8).lineBetween(20,2,20,13);
        g.lineBetween(13,13,13,25);g.lineBetween(33,13,33,25);
        g.fillStyle(0xFFF1C8,.19).fillRect(8,5,14,3);
      });
      make(`crate-${i+1}`,g=>{
        g.fillStyle(0x130F20,.32).fillRoundedRect(3,8,39,34,4);
        g.fillStyle(mix(level.crate,0x211630,.28)).fillRoundedRect(3,4,38,34,4);
        g.fillStyle(level.crate).fillRoundedRect(4,1,36,32,4);
        g.lineStyle(3,mix(level.crate,0xF9E2AD,.26),.94).strokeRoundedRect(7,5,30,25,3);
        g.lineStyle(4,mix(level.crate,0x32203D,.36),.9).lineBetween(10,8,34,27);
        g.lineBetween(34,8,10,27);
        g.fillStyle(0xEDD7A3).fillRect(5,5,5,5).fillRect(34,24,5,5);
      });
    });
    make('lantern-off',g=>{
      g.fillStyle(0x0B1327,.24).fillEllipse(22,41,28,5);
      g.fillStyle(0x49364C).fillRoundedRect(18,9,8,6,3);
      g.lineStyle(3,0x9C8B85).strokeRoundedRect(12,11,20,22,4);
      g.fillStyle(0x473D62).fillRoundedRect(13,15,18,17,2);
      g.fillStyle(0xB89A82).fillRoundedRect(9,32,26,5,2);
      g.fillStyle(0xB89A82).fillRoundedRect(18,37,8,5,2);
    });
    make('lantern-on',g=>{
      g.fillStyle(0xFFE9A2,.19).fillCircle(22,22,21);
      g.fillStyle(0xF9C36B,.23).fillCircle(22,21,17);
      g.fillStyle(0x49364C).fillRoundedRect(18,8,8,6,3);
      g.lineStyle(3,0xE4BA77).strokeRoundedRect(12,11,20,22,4);
      g.fillStyle(0xFFE9AB).fillRoundedRect(14,14,16,17,4);
      g.fillStyle(0xFFF8D9).fillEllipse(22,22,5,11);
      g.fillStyle(0xCB956B).fillRoundedRect(9,32,26,5,2);
      g.fillStyle(0xA8806B).fillRoundedRect(18,37,8,5,2);
    });
    make('memory-bomb',g=>{
      g.fillStyle(0x75FFF1,.18).fillCircle(22,22,21);
      g.fillStyle(0x473D8D).fillCircle(22,25,15);
      g.lineStyle(2,0x8AEBE0).strokeCircle(22,25,13);
      g.fillStyle(0xD5FFE9).fillCircle(22,25,9);
      g.fillStyle(0xFFF4CF).fillTriangle(22,14,32,25,22,36);
      g.fillStyle(0xFFD17F).fillCircle(22,24,4);
      g.fillStyle(0xE8CB83).fillRoundedRect(19,4,7,10,2);
    });
    make('memory-wave',g=>{
      g.fillStyle(0x6AEAD4,.17).fillRoundedRect(1,1,42,42,8);
      g.lineStyle(3,0xE1F9BE,.9).strokeRoundedRect(4,4,36,36,8);
      g.fillStyle(0xFFFFFF,.63).fillCircle(22,22,6);
      g.lineStyle(2,0x71FFF0,.9).lineBetween(22,4,22,12).lineBetween(4,22,12,22).lineBetween(32,22,40,22);
    });
    make('portal-closed',g=>{
      g.fillStyle(0x100E29,.65).fillEllipse(22,25,15,17);
      g.lineStyle(4,0x9276B5,.8).strokeEllipse(22,25,23,33);
      g.fillStyle(0x796198,.35).fillEllipse(22,25,12,20);
    });
    make('stone-token',g=>{
      g.fillStyle(0x15132B,.28).fillEllipse(22,39,25,7);
      g.fillStyle(0xC6B093).fillRoundedRect(9,8,26,27,5);
      g.fillStyle(0xF2DCAA).fillRoundedRect(12,7,20,20,4);
      g.lineStyle(2,0x98717C,.9).lineBetween(14,17,23,10).lineBetween(23,10,30,18);
      g.fillStyle(0x79DFC9).fillCircle(22,21,4);
    });
    make('pedestal-off',g=>{
      g.fillStyle(0x15132B,.27).fillEllipse(22,39,32,7);
      g.fillStyle(0x5D587A).fillRoundedRect(8,20,28,15,3);
      g.fillStyle(0x9E8D9C).fillRoundedRect(6,15,32,9,3);
      g.lineStyle(2,0xBC9DAC,.7).strokeEllipse(22,19,14,6);
    });
    make('pedestal-on',g=>{
      g.fillStyle(0xFBD78A,.18).fillCircle(22,19,21);
      g.fillStyle(0x746B89).fillRoundedRect(8,20,28,15,3);
      g.fillStyle(0xE6C599).fillRoundedRect(6,15,32,9,3);
      g.fillStyle(0xE8F1CC).fillTriangle(22,2,31,18,22,23);
      g.fillStyle(0x7BE9DD).fillCircle(22,15,6);
    });
    make('seal',g=>{
      g.fillStyle(0x221D49,.78).fillRoundedRect(6,6,32,32,9);
      g.lineStyle(2,0xA78ADC).strokeRoundedRect(8,8,28,28,7);
      g.fillStyle(0xBDA6EE).fillTriangle(22,9,35,22,22,35).fillTriangle(22,9,9,22,22,35);
      g.fillStyle(0xFFE4A0).fillCircle(22,22,4);
    });
    make('key-glow',g=>{
      g.fillStyle(0x82F1DF,.18).fillCircle(22,21,20);
      g.lineStyle(5,0xF8DF95).strokeCircle(16,16,7);
      g.lineStyle(5,0xF8DF95).lineBetween(20,22,33,35);
      g.lineBetween(27,29,33,23).lineBetween(30,32,37,26);
      g.fillStyle(0xFFFFFF).fillCircle(16,16,2);
    });
    make('mist-door',g=>{
      g.fillStyle(0x8064BD,.36).fillRoundedRect(5,2,34,39,9);
      g.lineStyle(3,0xC4A0FE).strokeRoundedRect(9,3,26,34,8);
      g.fillStyle(0xBE9FFF,.45).fillEllipse(22,19,11,26);
      g.fillStyle(0xFFFFFF,.43).fillCircle(22,16,3);
    });
    make('core-shield',g=>{
      g.fillStyle(0xE8A8ED,.13).fillCircle(22,22,22);
      g.fillStyle(0x543B82).fillTriangle(22,2,39,23,22,42);
      g.fillStyle(0xA36EDD).fillTriangle(22,2,5,23,22,42);
      g.lineStyle(3,0xEAA7EF).strokeCircle(22,22,19);
      g.fillStyle(0xECBDFF).fillCircle(22,22,4);
    });
    make('core-open',g=>{
      g.fillStyle(0xFFA37E,.13).fillCircle(22,22,21);
      g.fillStyle(0xE59B7F).fillTriangle(22,2,38,22,22,42);
      g.fillStyle(0xFBD196).fillTriangle(22,2,6,22,22,42);
      g.fillStyle(0xFFF7CC).fillCircle(22,21,5);
    });
    make('core-done',g=>{
      g.fillStyle(0x6FFFE0,.19).fillCircle(22,22,21);
      g.fillStyle(0x63C9AD).fillRoundedRect(17,8,10,28,4);
      g.fillStyle(0xFEECAD).fillCircle(22,13,8);
      g.fillStyle(0xF4FFFF).fillCircle(22,13,3);
    });
    make('boss',g=>{
      g.fillStyle(0x74459D,.25).fillCircle(22,22,21);
      g.fillStyle(0x513675).fillRoundedRect(4,8,36,30,14);
      g.fillStyle(0x9470C1).fillRoundedRect(7,6,30,27,12);
      g.fillStyle(0x1A1638).fillEllipse(16,21,7,10).fillEllipse(29,21,7,10);
      g.fillStyle(0xFFB5CE).fillCircle(16,21,3).fillCircle(29,21,3);
      g.fillStyle(0x644393).fillTriangle(10,12,3,0,23,11);
      g.fillStyle(0x644393).fillTriangle(29,12,39,0,41,17);
    });
    make('item-shield',g=>{
      g.fillStyle(0x78E4C4,.22).fillCircle(22,22,19);
      g.fillStyle(0x5BAEA4).fillRoundedRect(12,10,20,25,5);
      g.fillStyle(0xD5F6BF).fillTriangle(22,12,32,20,22,33);
      g.fillStyle(0xFFFFFF).fillCircle(22,21,3);
    });
    make('item-clock',g=>{
      g.fillStyle(0x9875D9,.28).fillCircle(22,22,20);
      g.fillStyle(0xE4C4F9).fillCircle(22,22,14);
      g.fillStyle(0x40366E).fillCircle(22,22,10);
      g.lineStyle(3,0xFFF1C1).lineBetween(22,22,22,13).lineBetween(22,22,29,26);
    });
    make('item-wind',g=>{
      g.fillStyle(0x74E3F1,.16).fillCircle(22,22,20);
      g.lineStyle(4,0xBDF8E9).strokeEllipse(22,22,27,13);
      g.lineBetween(12,17,31,10);g.lineBetween(13,25,33,31);
    });
    make('item-memory',g=>{
      g.fillStyle(0xFFCE89,.2).fillCircle(22,22,20);
      g.fillStyle(0xDAA774).fillRoundedRect(15,9,14,25,4);
      g.fillStyle(0xFFF7D1).fillRoundedRect(18,12,8,18,3);
      g.fillStyle(0x91EBDC).fillCircle(22,20,4);
    });


    makeSized('deco-lamp-post', 40, 92, (g,w,h)=>{
      g.fillStyle(0x0d1327,.22).fillEllipse(20,86,18,6);
      g.fillStyle(0x4B372F).fillRect(17,22,6,55);
      g.fillStyle(0xD2B68A).fillRect(15,20,10,4);
      g.lineStyle(4,0xD8B989).lineBetween(20,8,20,22).lineBetween(20,8,31,14);
      g.fillStyle(0xF2D8A1).fillRoundedRect(24,14,12,16,4);
      g.fillStyle(0xFFF1B8,.28).fillCircle(30,24,18);
      g.fillStyle(0xFFF7D7,.95).fillRoundedRect(26,17,8,10,3);
    });
    makeSized('deco-planter', 64, 34, (g,w,h)=>{
      g.fillStyle(0x3F2A22,.22).fillEllipse(32,29,46,6);
      g.fillStyle(0xB57555).fillRoundedRect(10,12,44,14,4);
      g.fillStyle(0xD89B74).fillRoundedRect(12,10,40,10,4);
      for(const x of [18,26,34,42]){g.fillStyle(0x5E8F62).fillCircle(x,10,7);g.fillStyle(0x84BE7D).fillCircle(x+2,8,5);}
      g.fillStyle(0xE8C26E).fillCircle(23,8,2);g.fillStyle(0xE58BA2).fillCircle(31,6,2);g.fillStyle(0xF0D7A1).fillCircle(39,8,2);
    });
    makeSized('deco-tree-top', 58, 60, (g,w,h)=>{
      g.fillStyle(0x0c1324,.18).fillEllipse(29,54,28,8);
      g.fillStyle(0x6E4E3E).fillRect(25,38,8,12);
      g.fillStyle(0x3D6B48).fillCircle(29,31,18);
      g.fillStyle(0x5F9966).fillCircle(19,27,13).fillCircle(39,27,13).fillCircle(29,18,12);
      g.fillStyle(0x79B67B).fillCircle(23,24,8).fillCircle(35,22,7);
    });
    makeSized('landmark-plaza', 280, 136, (g,w,h)=>{
      g.fillStyle(0x1B1C31,.18).fillEllipse(140,124,230,10);
      g.fillStyle(0xC9C1B8).fillRoundedRect(18,66,244,42,6);
      g.fillStyle(0xE7DED0).fillRoundedRect(24,56,232,32,5);
      g.fillStyle(0xF2E8D8).fillRoundedRect(96,38,88,54,4);
      g.fillStyle(0xC9C1B8).fillRoundedRect(112,28,56,20,4);
      for(const x of [42,76,204,238]){g.fillStyle(0xEDE1D2).fillRoundedRect(x,28,24,70,4);g.fillStyle(0xC9C1B8).fillRect(x+4,20,16,10);g.fillStyle(0xB4A89D).fillTriangle(x+2,20,x+12,4,x+22,20);}
      for(const x of [36,56,104,124,144,164,212,232]){g.fillStyle(0x856D63).fillRoundedRect(x,68,10,20,2);}
      g.fillStyle(0x846B60).fillRoundedRect(128,58,24,30,3);
      g.fillStyle(0xD4A15A).fillRect(138,12,4,18); g.fillStyle(0xE7D1A4).fillRect(136,10,8,4);
      g.fillStyle(0x8AB388).fillEllipse(20,104,36,14);g.fillStyle(0x8AB388).fillEllipse(260,104,36,14);
    });
    makeSized('landmark-san-francisco', 304, 146, (g,w,h)=>{
      g.fillStyle(0x1D1B2C,.18).fillEllipse(152,134,240,12);
      for(let i=0;i<5;i++){g.fillStyle(i%2?0xC7A78B:0xDFC2A2).fillRoundedRect(54-i*6,108-i*10,196+i*12,9,3);}
      g.fillStyle(0xE9D1B7).fillRoundedRect(42,54,220,40,5);
      g.fillStyle(0xD7B79A).fillRoundedRect(50,44,204,18,4);
      g.fillStyle(0xF1DEC7).fillRoundedRect(128,32,52,64,4);
      g.fillStyle(0xD0B096).fillRoundedRect(146,18,16,16,3);
      g.fillStyle(0xE9D1B7).fillRoundedRect(72,30,26,66,4);g.fillStyle(0xE9D1B7).fillRoundedRect(206,30,26,66,4);
      g.fillStyle(0xD0B096).fillTriangle(70,30,85,10,100,30);g.fillTriangle(204,30,219,10,234,30);
      for(const x of [84,104,124,176,196,216]){g.fillStyle(0x8A6C62).fillRoundedRect(x,58,8,28,2);} 
      g.fillStyle(0x8A6C62).fillRoundedRect(145,54,18,34,2);
    });
    makeSized('landmark-san-diego', 268, 134, (g,w,h)=>{
      g.fillStyle(0x181B2F,.18).fillEllipse(134,123,214,10);
      g.fillStyle(0xDFE1E7).fillRoundedRect(18,48,232,54,6);
      g.fillStyle(0xC5CBD7).fillRoundedRect(28,58,212,14,4);
      g.fillStyle(0xBAC3D0).fillRoundedRect(28,80,212,12,4);
      for(const x of [38,78,118,158,198]){g.fillStyle(0x8E95A7).fillRoundedRect(x,58,14,34,4);g.lineStyle(3,0xE7EAF0).lineBetween(x-3,60,x+7,48).lineBetween(x+7,48,x+17,60);}
      g.fillStyle(0x7EC4C3).fillEllipse(134,100,54,20);g.fillStyle(0xE8F7F5).fillCircle(134,96,4);
      g.fillStyle(0xE6EAF0).fillRoundedRect(104,26,60,20,4);
      g.fillStyle(0xB0B8C5).fillTriangle(102,26,134,10,166,26);
    });
    makeSized('landmark-panecillo', 296, 150, (g,w,h)=>{
      g.fillStyle(0x15172A,.18).fillEllipse(148,140,238,12);
      g.fillStyle(0x4F6A56).fillEllipse(148,126,236,52);
      g.fillStyle(0x6F8D72).fillEllipse(148,120,210,36);
      g.fillStyle(0x7D8FA5).fillRect(138,52,20,44);
      g.fillStyle(0xD3C7BC).fillRect(134,96,28,16);
      g.fillStyle(0xCBB6B8).fillTriangle(148,20,132,58,164,58);
      g.fillStyle(0xE8DCCB).fillTriangle(148,18,138,48,158,48);
      g.fillStyle(0xE8DCCB).fillTriangle(148,38,122,70,133,76);
      g.fillTriangle(148,36,174,70,163,76);
      g.fillStyle(0xF9E2A3,.2).fillCircle(148,52,36);
      for(let i=0;i<8;i++){const x=44+i*28;g.fillStyle(0xF7D79A,.55).fillRect(x,122+(i%2)*4,2,3);} 
    });
    make('exit', g => {
      g.fillStyle(0x48e5bd, .2).fillCircle(22, 22, 21);
      g.lineStyle(4, 0x52f4c5, .9).strokeCircle(22, 22, 16);
      g.lineStyle(2, 0xe6fff5, 1).strokeCircle(22, 22, 9);
      g.fillStyle(0xffffff).fillCircle(22, 22, 4);
    });
  }
}
