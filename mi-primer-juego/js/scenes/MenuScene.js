class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    NovaUI.backdrop(this);
    NovaUI.text(this, 80, 77, '✦  MINI ARCADE  /  AVENTURA DE ACCIÓN', 16, '#6af5ca');
    NovaUI.text(this, 79, 190, 'BOMBA', 94, '#f5fcff');
    NovaUI.text(this, 79, 290, 'NOVA', 105, '#66f3c9');
    NovaUI.text(this, 84, 353, 'LABERINTO NEÓN', 20, '#a0b9d6');
    NovaUI.text(this, 84, 403, 'Enciende tu ingenio. Abre tu camino.\nEscapa antes de que sea demasiado tarde.', 20, '#a9c2d7', { bold: false, lineSpacing: 13 });
    NovaUI.button(this, 83 + 155, 522, '▶   JUGAR', () => this.scene.start('Game', { level: 1, score: 0, lives: 3 }), { width: 310, primary: true, size: 23 });
    NovaUI.button(this, 83 + 155, 604, '⌨   CÓMO JUGAR', () => this.scene.start('Help'), { width: 310, size: 18 });
    NovaUI.button(this, 83 + 155, 677, '⚙   OPCIONES', () => this.scene.start('Settings'), { width: 310, height: 54, size: 18 });
    NovaUI.text(this, 472, 704, `RÉCORD   ${String(NovaData.highscore).padStart(6, '0')}`, 14, '#7098b3');
    this.drawShowcase();
  }
  drawShowcase() {
    const x=648, y=104, step=48, cols=10, rows=10;
    const g=this.add.graphics();
    g.fillStyle(0x102039, 1).fillRoundedRect(x-22,y-23,520,520,21);
    g.lineStyle(2, 0x2d4b62, 1).strokeRoundedRect(x-22,y-23,520,520,21);
    const boxes = new Set(['2,1','3,1','6,1','7,2','2,3','5,3','8,3','3,5','4,5','7,5','1,7','6,7','8,8']);
    const walls = new Set();
    for (let row=0;row<rows;row++) for (let col=0;col<cols;col++) {
      if ((row%2===0 && col%2===0) || row===0 || col===0 || row===9 || col===9) walls.add(`${col},${row}`);
    }
    for (let row=0;row<rows;row++) for (let col=0;col<cols;col++) {
      const id=`${col},${row}`;
      const tile = walls.has(id) ? 'tile-wall' : boxes.has(id) ? 'tile-crate' : ((col+row)%2 ? 'tile-floor' : 'tile-floor-b');
      this.add.image(x+col*step,y+row*step,tile).setDisplaySize(45,45).setAlpha(walls.has(id)?1:.95);
    }
    const hero = this.add.image(x+step,y+step,'hero').setDisplaySize(58,58);
    this.tweens.add({targets:hero,y:hero.y-5,duration:1000,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    const foe = this.add.image(x+step*7,y+step*7,'enemy-pink').setDisplaySize(49,49);
    this.tweens.add({targets:foe,angle:7,duration:800,yoyo:true,repeat:-1});
    const bomb=this.add.image(x+step*4,y+step*7,'bomb').setDisplaySize(50,50);
    this.tweens.add({targets:bomb,scaleX:1.22,scaleY:1.22,duration:700,yoyo:true,repeat:-1});
    this.add.image(x+step*7,y+step*3,'item-fire');
    NovaUI.text(this, x+220, 621, 'UNA BOMBA PUEDE CAMBIARLO TODO', 14, '#6c9cba', { ox:.5 });
    NovaUI.text(this, 1150, 684, '1 JUGADOR   ·   3 MUNDOS', 14, '#8abbd0', { ox:1 });
  }
}
