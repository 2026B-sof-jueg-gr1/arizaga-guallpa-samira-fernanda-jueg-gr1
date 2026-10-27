// Mecánicas originales inspiradas en los juegos arcade de laberintos con bombas.
// Grid separado de la representación gráfica: resulta sencillo ampliar el juego.
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init(data) {
    this.level = Phaser.Math.Clamp(data.level || 1, 1, NOVA.LEVELS);
    this.score = data.score || 0;
    this.lives = data.lives ?? 3;
    this.elapsed = 0;
    this.maxBombs = 1;
    this.bombRange = 2;
    this.speedStepMs = 145;
    this.activeBombs = new Map();
    this.activeFlames = new Map();
    this.powerups = new Map();
    this.enemies = [];
    this.ended = false;
    this.pausedByPlayer = false;
    this.isMoving = false;
    this.touchDirection = null;
    this.lastMove = 0;
    this.invincibleUntil = 0;
    this.portalRevealed = false;
    this.portalOpen = false;
    this.random = this.seeded(20261023 + this.level * 893);
  }
  seeded(seed) {
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  create() {
    this.cameras.main.setBackgroundColor('#102036');
    this.cameras.main.setViewport(47, 114, 860, 594);
    this.cameras.main.setBounds(0, 0, NOVA.COLS * NOVA.TILE, NOVA.ROWS * NOVA.TILE);
    this.physics.world.setBounds(0, 0, NOVA.COLS * NOVA.TILE, NOVA.ROWS * NOVA.TILE);
    this.drawMap();
    this.createHeroAnimations();
    this.hero = this.add.sprite(...this.centerOf(1,1), 'hero-down-0').setDepth(11).setScale(.96);
    this.heroFacing = 'down';
    this.heroGrid = { col: 1, row: 1 };
    this.cameras.main.startFollow(this.hero, false, .11, .11);
    this.spawnEnemies();
    this.keys = this.input.keyboard.addKeys({
      up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
      w: 'W', a: 'A', s: 'S', d: 'D', space: 'SPACE', esc: 'ESC'
    });
    this.input.keyboard.addCapture('UP,DOWN,LEFT,RIGHT,SPACE');
    this.input.keyboard.on('keydown-SPACE', this.placeBomb, this);
    this.input.keyboard.on('keydown-ESC', this.togglePause, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off('keydown-SPACE', this.placeBomb, this);
      this.input.keyboard.off('keydown-ESC', this.togglePause, this);
      if (this.scene.isActive('HUD')) this.scene.stop('HUD');
    });
    this.scene.launch('HUD');
    this.scene.bringToTop('HUD');
  }
  createHeroAnimations() {
    // Cada orientación posee dos poses de piernas y brazos alternados.
    // Las animaciones se registran una sola vez y también funcionan al reiniciar.
    for (const pose of ['down', 'back', 'side']) {
      const key = `nova-walk-${pose}`;
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: [{ key: `hero-${pose}-0` }, { key: `hero-${pose}-1` }],
          frameRate: 14,
          repeat: -1
        });
      }
    }
  }
  setHeroFacing(dx, dy) {
    const direction = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
    this.heroFacing = direction;
    const pose = (direction === 'left' || direction === 'right') ? 'side' : direction === 'up' ? 'back' : 'down';
    // El perfil es asimétrico: el visor y la flecha señalan derecha o izquierda.
    this.hero.setFlipX(direction === 'left');
    this.hero.setTexture(`hero-${pose}-0`);
    return pose;
  }
  centerOf(col, row) { return [(col + .5) * NOVA.TILE, (row + .5) * NOVA.TILE]; }
  key(col, row) { return `${col},${row}`; }
  inside(col,row) { return col>=0 && row>=0 && col<NOVA.COLS && row<NOVA.ROWS; }
  drawMap() {
    const C=NOVA.COLS, R=NOVA.ROWS, T=NOVA.TILE;
    this.grid=Array.from({length:R},()=>Array(C).fill('floor'));
    this.blocks=Array.from({length:R},()=>Array(C).fill(null));
    const enemySpawn=[[23,1],[1,17],[21,15],[19,1],[1,15],[23,13],[13,9]];
    this.spawnLocations = enemySpawn;
    const clear = new Set();
    const keepOpen = [[1,1],...enemySpawn];
    for(const [x,y] of keepOpen) {
      for (const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])
        if (this.inside(x+dx,y+dy)) clear.add(this.key(x+dx,y+dy));
    }
    clear.add('3,1'); clear.add('1,3');
    for (let row=0;row<R;row++) for (let col=0;col<C;col++) {
      const isWall = col===0 || row===0 || col===C-1 || row===R-1 || (col%2===0 && row%2===0);
      const exitCell = col===23 && row===17;
      const isCrate = !isWall && (exitCell || (!clear.has(this.key(col,row)) && this.random() < (.37 + this.level*.04)));
      const kind = isWall ? 'wall' : isCrate ? 'crate' : 'floor';
      this.grid[row][col] = kind;
      const [px,py] = this.centerOf(col,row);
      this.add.image(px,py,(col+row)%2 ? 'tile-floor' : 'tile-floor-b').setDepth(0);
      if(kind !== 'floor') {
        this.blocks[row][col] = this.add.image(px,py,kind==='wall'?'tile-wall':'tile-crate').setDepth(kind==='wall' ? 3:4);
      } else if (this.random() < .045) {
        this.add.circle(px + 13, py - 11, 1.6, 0x91faea, .22).setDepth(1);
      }
    }
    // La salida siempre queda oculta detrás de una caja; nunca se pierde por azar.
    this.exitGrid = {col:23,row:17};
    const [ex,ey]=this.centerOf(23,17);
    this.exitImage = this.add.image(ex,ey,'exit').setDepth(2).setVisible(false);
    this.tweens.add({targets:this.exitImage,angle:360,duration:5000,repeat:-1});
  }
  spawnEnemies() {
    // Balance suave: 2, 4 y 6 enemigos en los sectores 1, 2 y 3.
    const count= Math.min(this.spawnLocations.length, 2*this.level);
    const difficulty = NovaData.settings.difficulty;
    // Ritmo ligeramente más lento para permitir esquivar sin eliminar el desafío.
    const speedFactor = difficulty === 'FÁCIL' ? 1.42 : difficulty === 'DIFÍCIL' ? .90 : 1.12;
    for(let i=0;i<count;i++) {
      const [col,row]=this.spawnLocations[i];
      const [px,py]=this.centerOf(col,row);
      const img=this.add.image(px,py,i%2?'enemy-violet':'enemy-pink').setDepth(9);
      const enemy={col,row,img,alive:true,moving:false};
      this.enemies.push(enemy);
      const delay=(490 - this.level*42 + this.random()*170)*speedFactor;
      this.time.addEvent({delay, loop:true, callback:()=>this.moveEnemy(enemy)});
      this.tweens.add({targets:img,scaleY:.93,scaleX:1.04,duration:500,repeat:-1,yoyo:true});
    }
  }
  update(time,delta) {
    if(this.ended || this.pausedByPlayer) return;
    this.elapsed += delta;
    if (this.hero && this.invincibleUntil > this.time.now) this.hero.alpha = (Math.floor(time/90)%2===0) ? .30 : 1;
    else if(this.hero) this.hero.alpha = 1;
    if(this.isMoving || time < this.lastMove) return;
    const k=this.keys; let dx=0,dy=0;
    const direction=this.touchDirection;
    if (k.left.isDown || k.a.isDown || direction==='left') dx=-1;
    else if (k.right.isDown || k.d.isDown || direction==='right') dx=1;
    else if (k.up.isDown || k.w.isDown || direction==='up') dy=-1;
    else if (k.down.isDown || k.s.isDown || direction==='down') dy=1;
    if(dx||dy) this.stepHero(dx,dy,time);
  }
  isFree(col,row) { return this.inside(col,row) && this.grid[row][col]==='floor' && !this.activeBombs.has(this.key(col,row)); }
  stepHero(dx,dy,time) {
    const col=this.heroGrid.col+dx, row=this.heroGrid.row+dy;
    this.lastMove = time+92;
    // El personaje gira hacia la tecla pulsada incluso si hay una pared enfrente.
    const pose = this.setHeroFacing(dx,dy);
    if(!this.isFree(col,row)) return;
    this.isMoving = true;
    this.heroGrid={col,row};
    this.hero.play(`nova-walk-${pose}`, true);
    this.tweens.add({targets:this.hero,x:(col+.5)*NOVA.TILE,y:(row+.5)*NOVA.TILE,
      duration:this.speedStepMs,ease:'Sine.easeInOut',
      onUpdate:tween=>{
        // Pequeño rebote vertical, manteniendo intacta la posición en la casilla.
        this.hero.setScale(.96, .96 + Math.sin(tween.progress * Math.PI) * .035);
      },
      onComplete:()=>{
        this.hero.anims.stop();
        this.hero.setTexture(`hero-${pose}-0`).setScale(.96);
        this.isMoving=false;
        if (!this.ended) { this.onHeroCell(); this.checkEnemyCollision(); }
      }});
  }
  onHeroCell() {
    const {col,row}=this.heroGrid;
    const key=this.key(col,row);
    if(this.activeFlames.has(key)) this.hitHero();
    if(this.powerups.has(key)) this.takePowerup(key);
    if(this.portalRevealed && col===this.exitGrid.col && row===this.exitGrid.row) {
      if(this.portalOpen) this.finish(true);
      else this.showToast('¡ELIMINA A TODOS LOS ENEMIGOS!');
    }
  }
  placeBomb() {
    if(this.ended || this.pausedByPlayer || this.isMoving) return;
    const {col,row}=this.heroGrid, key=this.key(col,row);
    if(this.activeBombs.has(key) || this.activeBombs.size >= this.maxBombs) return;
    const [px,py]=this.centerOf(col,row);
    const img=this.add.image(px,py,'bomb').setDepth(6).setScale(.9);
    const bomb={col,row,key,img,exploded:false,range:this.bombRange,timer:null};
    this.activeBombs.set(key,bomb);
    NovaAudio.play('bomb');
    this.tweens.add({targets:img,scale:1.09,duration:360,repeat:3,yoyo:true,ease:'Sine.easeInOut'});
    // Un instante extra para alejarse antes de la detonación.
    bomb.timer=this.time.delayedCall(2150,()=>this.explodeBomb(bomb));
  }
  explodeBomb(bomb) {
    if(bomb.exploded || this.ended) return;
    bomb.exploded = true;
    if(bomb.timer) bomb.timer.remove(false);
    this.activeBombs.delete(bomb.key);
    bomb.img.destroy();
    NovaAudio.play('blast');
    this.cameras.main.shake(90, .0025);
    this.flameCell(bomb.col,bomb.row);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      for(let n=1;n<=bomb.range;n++) {
        const col=bomb.col+dx*n, row=bomb.row+dy*n;
        if(!this.inside(col,row)) break;
        const kind=this.grid[row][col];
        if(kind==='wall') break;
        this.flameCell(col,row);
        if(kind==='crate') { this.breakCrate(col,row); break; }
      }
    }
    this.checkEnemyCollision();
  }
  flameCell(col,row) {
    const key=this.key(col,row);
    if(this.activeFlames.has(key)) return;
    const [px,py]=this.centerOf(col,row);
    const flame=this.add.image(px,py,'flame').setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    this.activeFlames.set(key,flame);
    this.tweens.add({targets:flame,alpha:.65,scaleX:1.14,scaleY:1.14,duration:150,yoyo:true,repeat:2});
    if(this.heroGrid.col===col && this.heroGrid.row===row) this.hitHero();
    for (const enemy of this.enemies) if(enemy.alive && enemy.col===col && enemy.row===row) this.killEnemy(enemy);
    const chained=this.activeBombs.get(key);
    if(chained) this.explodeBomb(chained);
    this.time.delayedCall(560,()=>{
      if(this.activeFlames.get(key)===flame) this.activeFlames.delete(key);
      if(flame.active) flame.destroy();
    });
  }
  breakCrate(col,row) {
    if(this.grid[row][col]!=='crate') return;
    this.grid[row][col]='floor';
    const tile=this.blocks[row][col];
    if(tile) {
      this.tweens.add({targets:tile,alpha:0,scale:.55,duration:180,
        onComplete:()=>tile.destroy()});
      this.blocks[row][col]=null;
    }
    this.score+=10;
    if(col===this.exitGrid.col && row===this.exitGrid.row) {
      this.portalRevealed=true;
      this.exitImage.setVisible(true);
      this.portalState();
      this.showToast('¡PORTAL ENCONTRADO!');
    } else if(this.random()<.17) {
      const types=['fire','capacity','speed'];
      const type=types[Math.floor(this.random()*types.length)];
      const [px,py]=this.centerOf(col,row);
      const img=this.add.image(px,py,`item-${type}`).setDepth(5);
      this.tweens.add({targets:img,scale:1.14,duration:490,repeat:-1,yoyo:true});
      this.powerups.set(this.key(col,row),{img,type,col,row});
    }
  }
  takePowerup(key) {
    const item=this.powerups.get(key);
    if(!item) return;
    this.powerups.delete(key);
    this.tweens.killTweensOf(item.img);
    item.img.destroy();
    if(item.type==='fire') { this.bombRange=Math.min(5,this.bombRange+1); this.showToast('¡EXPLOSIÓN +1!'); }
    else if(item.type==='capacity') {this.maxBombs=Math.min(4,this.maxBombs+1);this.showToast('¡BOMBAS +1!'); }
    else {this.speedStepMs=Math.max(88,this.speedStepMs-16);this.showToast('¡VELOCIDAD +1!');}
    this.score+=50;
    NovaAudio.play('item');
  }
  moveEnemy(enemy) {
    if(!enemy.alive || enemy.moving || this.pausedByPlayer || this.ended) return;
    const directions=[[1,0],[-1,0],[0,1],[0,-1]];
    const safe=directions.filter(([dx,dy])=>{
      const col=enemy.col+dx,row=enemy.row+dy;
      return this.isFree(col,row) && !this.activeFlames.has(this.key(col,row)) &&
        !this.enemies.some(other=>other!==enemy && other.alive && other.col===col && other.row===row);
    });
    if(safe.length===0) return;
    // A veces persiguen al jugador; también vagan como enemigos arcade.
    if(this.random()<.43) safe.sort((a,b)=>{
      const score=dir=>Math.abs(this.heroGrid.col-(enemy.col+dir[0]))+Math.abs(this.heroGrid.row-(enemy.row+dir[1]));
      return score(a)-score(b);
    });
    else safe.sort(()=>this.random()-.5);
    const [dx,dy]=safe[0];
    enemy.col+=dx; enemy.row+=dy; enemy.moving=true;
    this.tweens.add({targets:enemy.img, x:(enemy.col+.5)*NOVA.TILE,y:(enemy.row+.5)*NOVA.TILE,
      duration:240,ease:'Sine.easeInOut',onComplete:()=>{
        enemy.moving=false;
        if(!enemy.alive||this.ended) return;
        if(this.activeFlames.has(this.key(enemy.col,enemy.row))) this.killEnemy(enemy);
        this.checkEnemyCollision();
      }});
    this.checkEnemyCollision();
  }
  checkEnemyCollision() {
    for(const e of this.enemies) {
      if(e.alive && e.col===this.heroGrid.col && e.row===this.heroGrid.row) { this.hitHero(); return; }
    }
  }
  killEnemy(enemy) {
    if(!enemy.alive || this.ended) return;
    enemy.alive=false; enemy.moving=false;
    this.tweens.killTweensOf(enemy.img);
    this.tweens.add({targets:enemy.img,scale:1.5,alpha:0,angle:38,duration:220,
      onComplete:()=>enemy.img.destroy()});
    this.score+=100;
    NovaAudio.play('enemy');
    this.portalState();
  }
  portalState() {
    const count=this.enemies.filter(e=>e.alive).length;
    this.portalOpen=count===0;
    if(this.portalRevealed) {
      this.exitImage.setTint(this.portalOpen ? 0xffffff : 0x7695a2);
      if(this.portalOpen) this.showToast('¡PORTAL ACTIVADO!');
    }
    if(this.portalOpen && this.portalRevealed &&
       this.heroGrid.col===this.exitGrid.col && this.heroGrid.row===this.exitGrid.row) this.finish(true);
  }
  hitHero() {
    if(this.ended || this.invincibleUntil>this.time.now) return;
    this.lives--;
    this.invincibleUntil=this.time.now+1950;
    NovaAudio.play('hit');
    this.cameras.main.shake(190,.007);
    if(this.lives<=0) this.finish(false);
    else this.showToast('¡CUIDADO! TE QUEDAN '+this.lives+' VIDAS');
  }
  showToast(message) {
    if(this.ended) return;
    const hud=this.scene.get('HUD');
    if(this.scene.isActive('HUD') && hud && hud.toast) hud.toast(message);
  }
  togglePause() {
    if(this.ended) return;
    this.pausedByPlayer=!this.pausedByPlayer;
    this.time.paused=this.pausedByPlayer;
    if(this.pausedByPlayer) this.tweens.pauseAll(); else this.tweens.resumeAll();
    const hud=this.scene.get('HUD');
    if(this.scene.isActive('HUD')) hud.setPause(this.pausedByPlayer);
    this.touchDirection=null;
  }
  restart() {
    this.time.paused=false;
    this.tweens.resumeAll();
    const level=this.level;
    this.scene.stop('HUD');
    this.scene.restart({level,score:0,lives:3});
  }
  backToMenu() {
    this.time.paused=false;
    this.tweens.resumeAll();
    this.scene.stop('HUD');
    this.scene.start('Menu');
  }
  finish(won) {
    if(this.ended) return;
    this.ended=true;
    this.time.paused=false;
    this.tweens.resumeAll();
    if(won) {this.score+=200 + Math.max(0,Math.floor(500-this.elapsed/1000*3)); NovaAudio.play('win');}
    NovaData.setHighscore(this.score);
    this.scene.stop('HUD');
    this.time.delayedCall(450,()=>this.scene.start('Result',{
      won,level:this.level,score:this.score,lives:this.lives,seconds:Math.floor(this.elapsed/1000)
    }));
  }
}
