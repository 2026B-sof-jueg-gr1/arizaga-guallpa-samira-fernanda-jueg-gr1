// Escena HUD independiente: la cámara sigue el mundo, pero la interfaz permanece fija.
class HUDScene extends Phaser.Scene {
  constructor() { super('HUD'); }
  create() {
    this.world=this.scene.get('Game');
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    const g=this.add.graphics().setDepth(1);
    g.fillStyle(0x0b1225,1).fillRect(0,0,1200,110).fillRect(0,109,44,610)
      .fillRect(912,100,288,660).fillRect(0,709,917,51);
    g.lineStyle(2, 0x35536b,1).strokeRoundedRect(43,110,867,600,7);
    g.fillStyle(0x14253f,1).fillRoundedRect(926,110,257,599,16);
    g.lineStyle(1,0x355674,1).strokeRoundedRect(926,110,257,599,16);
    g.fillStyle(0x57f2c5,1).fillRoundedRect(45,87,123,4,2);
    NovaUI.text(this,48,38,'BOMBA',27,'#ecfaff');
    NovaUI.text(this,163,38,'NOVA',27,'#59f2c5');
    NovaUI.text(this,48,72,'LABERINTO NEÓN  /  MISIÓN EN CURSO',12,'#668daa');
    NovaUI.text(this,516,36,`SECTOR ${String(this.world.level).padStart(2,'0')} / 03`,18,'#f1f7ff',{ox:.5});
    NovaUI.text(this,516,68,'DESTRUYE · SOBREVIVE · ESCAPA',11,'#81a1bc',{ox:.5});
    NovaUI.button(this,1089,49,'Ⅱ  PAUSA',()=>this.world.togglePause(),{width:178,height:53,size:16});
    NovaUI.text(this,948,142,'PANEL DE MISIÓN',13,'#60eac3');
    this.statTitle(946,187,'TIEMPO');
    this.timeText=NovaUI.text(this,946,224,'00:00',36,'#e9f7ff');
    this.divider(946,264);
    this.statTitle(946,290,'PUNTUACIÓN');
    this.scoreText=NovaUI.text(this,946,327,'000000',33,'#ffd78c');
    this.divider(946,368);
    this.statTitle(946,393,'VIDAS');
    this.lifeText=NovaUI.text(this,946,425,'♥ ♥ ♥',27,'#ff849d');
    this.statTitle(1060,393,'ENEMIGOS');
    this.enemyText=NovaUI.text(this,1073,425,'03',26,'#f0f8ff');
    this.divider(946,464);
    this.statTitle(946,487,'POTENCIADORES');
    this.powerText=NovaUI.text(this,946,517,'✹ 2    ● 1    ➤ NORMAL',15,'#b7d0de');
    this.divider(946,542);
    NovaUI.text(this,946,555,'CONTROLES TÁCTILES',12,'#76acc7');
    this.addPad();
    NovaUI.text(this,48,735,'FLECHAS / WASD   MOVER     ·     ESPACIO   BOMBA     ·     ESC   PAUSA',14,'#789bb7');
    this.banner=NovaUI.text(this,480,736,'',13,'#ffce8b',{ox:.5});
    this.makePauseOverlay();
  }
  divider(x,y) { this.add.rectangle(x,y,215,1,0x29445e).setOrigin(0); }
  statTitle(x,y,label) { NovaUI.text(this,x,y,label,12,'#8aacc5'); }
  addPad() {
    const makePad=(x,y,label,dir)=>{
      const bg=this.add.rectangle(x,y,39,37,0x263d56).setStrokeStyle(1,0x4d7d8f).setInteractive({useHandCursor:true});
      NovaUI.text(this,x,y,label,21,'#b2e8db',{ox:.5});
      bg.on('pointerdown',()=>{this.world.touchDirection=dir;});
      bg.on('pointerup',()=>{this.world.touchDirection=null;});
      bg.on('pointerout',()=>{this.world.touchDirection=null;});
    };
    makePad(1011,584,'▲','up');
    makePad(970,627,'◀','left');
    makePad(1052,627,'▶','right');
    makePad(1011,670,'▼','down');
    const b=this.add.rectangle(1123,626,92,92,0xf1a46e).setStrokeStyle(2,0xffdba5).setInteractive({useHandCursor:true});
    NovaUI.text(this,1123,613,'✹',30,'#1b2643',{ox:.5});
    NovaUI.text(this,1123,643,'BOMBA',12,'#1b2643',{ox:.5});
    b.on('pointerdown',()=>this.world.placeBomb());
    this.input.on('pointerup',()=>{this.world.touchDirection=null;});
  }
  toast(message) {
    if(!this.banner || !this.banner.active) return;
    this.banner.setText(message);
    this.banner.setAlpha(1);
    if(this.toastEvent) this.toastEvent.remove(false);
    this.toastEvent=this.time.delayedCall(1900,()=>this.banner?.setText(''));
  }
  update() {
    const g=this.world;
    if(!g || !g.scene.isActive() || !this.timeText) return;
    const seconds=Math.floor(g.elapsed/1000);
    this.timeText.setText(`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`);
    this.scoreText.setText(String(g.score).padStart(6,'0'));
    this.lifeText.setText(g.lives>0?'♥ '.repeat(g.lives).trim():'—');
    this.enemyText.setText(String(g.enemies.filter(e=>e.alive).length).padStart(2,'0'));
    this.powerText.setText(`✹ ${g.bombRange}    ● ${g.maxBombs}    ➤ ${g.speedStepMs<145?'RÁPIDO':'NORMAL'}`);
  }
  makePauseOverlay() {
    this.pauseLayer=this.add.container(0,0).setDepth(120).setVisible(false);
    const shade=this.add.rectangle(600,380,1200,760,0x06101f,.88).setInteractive();
    const panel=this.add.rectangle(600,380,515,475,0x15263f).setStrokeStyle(2,0x57e2bc);
    const title=NovaUI.text(this,600,251,'PARTIDA EN PAUSA',37,'#eefaff',{ox:.5});
    const subtitle=NovaUI.text(this,600,299,'Tómate un respiro, explorador.',19,'#90bbcf',{ox:.5,bold:false});
    this.pauseLayer.add([shade,panel,title,subtitle]);
    this.pauseLayer.add(NovaUI.button(this,600,369,'▶  CONTINUAR',()=>this.world.togglePause(),{width:325,primary:true}));
    this.pauseLayer.add(NovaUI.button(this,600,450,'↻  REINICIAR',()=>this.world.restart(),{width:325}));
    this.pauseLayer.add(NovaUI.button(this,600,531,'⌂  MENÚ PRINCIPAL',()=>this.world.backToMenu(),{width:325}));
  }
  setPause(isPaused) { this.pauseLayer.setVisible(isPaused); }
}
