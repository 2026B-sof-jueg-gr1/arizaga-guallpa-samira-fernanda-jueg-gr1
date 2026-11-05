/* Quito: Guardianes de las Leyendas — motor de los cuatro capítulos.
   Se reutilizan la cuadrícula, las vistas de Nova, bombas, cámara y enemigos
   del juego Bomba Nova. Las misiones se resuelven mediante datos de cada nivel. */
class GameScene extends Phaser.Scene {
 constructor(){super('Game');}
 init(data={}){
  this.level=Phaser.Math.Clamp(Number(data.level)||1,1,NOVA.LEVELS);
  this.stage=NOVA.STAGES[this.level-1];this.score=Number(data.score)||0;
  this.lives=3;this.elapsed=0;this.ended=false;this.pausedByPlayer=false;this.storyOpening=true;
  this.heroGrid={col:1,row:1};this.heroFacing='down';this.lastMove=-1000;
  this.speedStepMs=165;this.maxBombs=1;this.bombRange=2;
  this.bombs=new Map();this.flames=new Map();this.powerups=new Map();this.enemies=[];
  this.objectives=[];this.pedestals=[];this.gates=[];this.missionProgress=0;
  this.stoneInventory=0;this.stonesFound=0;this.portalOpen=false;this.hasShield=false;this.heldBonus=null;
  this.maxMemCharges=1;this.memoryCharges=1;this.memRecharge=[];
  this.invincibleUntil=-1;this.nextHintAt=41000;this.lastProgressAt=0;
  this.touchDirection=null;this.heroWalking=false;this.hazardTiles=[];
  this.rng=this.seeded(20261105+this.level*9821);
 }
 seeded(seed){return()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
 create(){
  this.cameras.main.setBackgroundColor('#29263B');
  this.cameras.main.setViewport(35,105,873,563);
  this.cameras.main.setBounds(0,0,NOVA.COLS*NOVA.TILE,NOVA.ROWS*NOVA.TILE);
  this.makeWorld();this.createAnimations();
  const [hx,hy]=this.center(1,1);this.hero=this.add.sprite(hx,hy,'hero-down-0').setScale(.94).setDepth(22);
  this.hero.setData('facing','down');
  this.lanternOnBack=this.add.image(hx+13,hy+10,'lantern-on').setScale(.34).setDepth(23);
  this.cameras.main.startFollow(this.hero,false,.14,.14);
  this.spawnMission();this.spawnEnemies();this.spawnGuaranteedBonus();
  this.keys=this.input.keyboard.addKeys({up:'UP',down:'DOWN',left:'LEFT',right:'RIGHT',w:'W',a:'A',s:'S',d:'D',bomb:'SPACE',memory:'E',special:'SHIFT',pause:'ESC'});
  this.input.keyboard.addCapture('UP,DOWN,LEFT,RIGHT,SPACE,SHIFT');
  this.input.keyboard.on('keydown-SPACE',this.placeBomb,this);
  this.input.keyboard.on('keydown-E',this.useMemory,this);
  this.input.keyboard.on('keydown-SHIFT',this.useBonus,this);
  this.input.keyboard.on('keydown-ESC',this.togglePause,this);
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
    this.input.keyboard.off('keydown-SPACE',this.placeBomb,this);
    this.input.keyboard.off('keydown-E',this.useMemory,this);
    this.input.keyboard.off('keydown-SHIFT',this.useBonus,this);
    this.input.keyboard.off('keydown-ESC',this.togglePause,this);
    if(this.scene.isActive('HUD'))this.scene.stop('HUD');
  });
  if(this.level===4){this.time.delayedCall(9000,()=>{if(!this.ended)this.scheduleHazard();});}
  this.time.paused=true; // Presentamos el objetivo antes de iniciar cada nivel.
  this.scene.launch('HUD');this.scene.bringToTop('HUD');
  this.time.delayedCall(600,()=>this.notify(this.getHint(),3600));
 }
 center(c,r){return[(c+.5)*NOVA.TILE,(r+.5)*NOVA.TILE];}
 key(c,r){return c+','+r;}
 inBounds(c,r){return c>=0&&r>=0&&c<NOVA.COLS&&r<NOVA.ROWS;}
 fixedPositions(){
  const list=[[1,1],[1,2],[2,1],[3,1],[1,3],[3,3],[23,17],[23,16],[22,17],[21,17]];
  if(this.level===1)list.push([5,5],[13,9],[21,15]);
  if(this.level===2)list.push([5,7],[13,9],[19,15],[7,3],[15,5],[21,13],[21,3]);
  if(this.level===3)list.push([5,5],[13,9],[21,15],[9,7],[17,11]);
  if(this.level===4)list.push([7,5],[17,9],[11,15],[13,9]);
  list.push([21,7],[3,13],[17,15],[19,3]);
  return list;
 }
 makeWorld(){
  this.grid=Array.from({length:NOVA.ROWS},()=>Array(NOVA.COLS).fill('floor'));
  this.blocks=Array.from({length:NOVA.ROWS},()=>Array(NOVA.COLS).fill(null));
  const clear=new Set();
  this.fixedPositions().forEach(([x,y])=>{for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])clear.add(this.key(x+dx,y+dy));});
  const density=[.20,.23,.22,.19][this.level-1];
  for(let r=0;r<NOVA.ROWS;r++)for(let c=0;c<NOVA.COLS;c++){
    const permanent=c===0||r===0||c===NOVA.COLS-1||r===NOVA.ROWS-1||(c%2===0&&r%2===0);
    const crate=!permanent&&!clear.has(this.key(c,r))&&this.rng()<density;
    const type=permanent?'wall':crate?'crate':'floor';this.grid[r][c]=type;
    const [x,y]=this.center(c,r);
    this.add.image(x,y,`floor${(c+r)%2?'-alt':''}-${this.level}`).setDepth(0);
    if(type!=='floor')this.blocks[r][c]=this.add.image(x,y,type==='wall'?`stonewall-${this.level}`:`crate-${this.level}`).setDepth(type==='wall'?6:7);
    else if(this.rng()<.046)this.add.circle(x+13,y-9,1.5,0xFFF1C2,.25).setDepth(1);
  }
  this.drawProps();
  const [px,py]=this.center(23,17);this.portal=this.add.image(px,py,'portal-closed').setDepth(13);
  this.tweens.add({targets:this.portal,alpha:.6,duration:920,yoyo:true,repeat:-1});
 }
 drawProps(){
  const g=this.add.graphics().setDepth(1);
  this.decorateEdges();
  // Ornamentación temática para que cada escenario se identifique con Quito.
  if(this.level===1){
    this.add.image(13*NOVA.TILE, 48, 'landmark-plaza').setDepth(2).setAlpha(.96);
    this.placeLamps([[3,2],[23,2],[3,16],[23,16],[6,9],[20,9]]);
    this.placePlanters([[5,4],[9,4],[17,4],[21,4],[5,14],[9,14],[17,14],[21,14]]);
    const [cx,cy]=this.center(13,3);
    g.fillStyle(0x6F9D9B,.42).fillEllipse(cx,cy,122,68);
    g.lineStyle(6,0xEBDDBA,.64).strokeEllipse(cx,cy,122,68);
    g.fillStyle(0x7DC7CB,.58).fillEllipse(cx,cy,86,38);
    g.fillStyle(0xFFF6CC,.72).fillCircle(cx,cy,9);
    for(const col of [5,9,17,21]){const [px,py]=this.center(col,11);g.fillStyle(0x5C9469,.45).fillEllipse(px,py,64,24);g.fillStyle(0xDFC082,.38).fillEllipse(px,py,46,10);} 
  }else if(this.level===2){
    this.add.image(13*NOVA.TILE, 52, 'landmark-san-francisco').setDepth(2).setAlpha(.98);
    this.placeLamps([[4,3],[22,3],[6,8],[20,8],[4,15],[22,15]]);
    this.placePlanters([[7,5],[19,5],[10,14],[16,14]]);
    const [cx,cy]=this.center(13,3);
    for(let i=0;i<6;i++){g.fillStyle(i%2?0xEACCA9:0xC79B7C,.36).fillRoundedRect(cx-175,cy-44+i*15,350,12,3);} 
    for(const col of [5,21]){const [x,y]=this.center(col,3);g.fillStyle(0xF1D7BB,.34).fillRoundedRect(x-18,y-27,36,64,5);g.lineStyle(3,0x6A4B4A,.42).strokeRoundedRect(x-18,y-27,36,64,5);} 
  }else if(this.level===3){
    this.add.image(13*NOVA.TILE, 48, 'landmark-san-diego').setDepth(2).setAlpha(.97);
    this.placeCypresses([[3,4],[23,4],[3,14],[23,14],[9,2],[17,2]]);
    this.placeLamps([[6,4],[20,4],[6,14],[20,14]]);
    for(const [c,r]of [[7,3],[13,3],[19,3],[7,15],[13,15],[19,15]]){const[x,y]=this.center(c,r);g.lineStyle(4,0xD7D8E2,.38).strokeRoundedRect(x-16,y-20,32,40,13);} 
    const [fx,fy]=this.center(11,7);g.fillStyle(0x8AD4D0,.22).fillEllipse(fx,fy,86,50);
    g.fillStyle(0xEDEDEE,.15).fillRoundedRect(fx-54,fy-38,108,76,10);
  }else{
    this.add.image(13*NOVA.TILE, 52, 'landmark-panecillo').setDepth(2).setAlpha(.98);
    this.placeLamps([[5,15],[9,13],[13,12],[17,13],[21,15]]);
    const [sx,sy]=this.center(13,5);
    g.fillStyle(0xF2C691,.11).fillCircle(sx,sy,88);
    g.lineStyle(4,0xD5A4CF,.38).strokeEllipse(sx,sy,142,94);
    g.fillStyle(0xBEA1E6,.26).fillTriangle(sx-16,sy+15,sx,sy-44,sx+16,sy+15);
    for(let j=0;j<7;j++){const[x,y]=this.center(3+j*3,13);g.fillStyle(0xE1A2E9,.27).fillTriangle(x-4,y+7,x+1,y-2,x+6,y+7);} 
    for(let j=0;j<5;j++){const[x,y]=this.center(9+j*2,16);g.fillStyle(0xF5DDA3,.22).fillCircle(x,y,18-j*2);} 
  }
  for(let i=0;i<26;i++){
    const c=1+Math.floor(this.rng()*23),r=1+Math.floor(this.rng()*17);
    if(this.grid[r][c]!=='floor')continue;
    const [x,y]=this.center(c,r);const d=this.rng();
    if(this.level===1){g.fillStyle(d>.55?0x6A9E87:0xF4C783,.38);g.fillCircle(x-12,y+11,3).fillCircle(x-8,y+8,2);} 
    else if(this.level===2){g.lineStyle(2,0xF5D0AA,.28).strokeRect(x-9,y-5,18,12);} 
    else if(this.level===3){g.fillStyle(0x85C2CF,.28).fillEllipse(x-8,y+9,13,4);} 
    else{g.fillStyle(0xBDA4E3,.24).fillTriangle(x-4,y+7,x+1,y-2,x+6,y+7);} 
  }
 }
 placeLamps(list){
  list.forEach(([c,r])=>{const[x,y]=this.center(c,r);const lamp=this.add.image(x,y+2,'deco-lamp-post').setDepth(3).setScale(.85);lamp.setAlpha(.92);});
 }
 placePlanters(list){
  list.forEach(([c,r])=>{const[x,y]=this.center(c,r);this.add.image(x,y+8,'deco-planter').setDepth(3).setScale(.78);});
 }
 placeCypresses(list){
  list.forEach(([c,r])=>{const[x,y]=this.center(c,r);this.add.image(x,y-4,'deco-tree-top').setDepth(3).setScale(.8);});
 }
 decorateEdges(){
  const edge=this.add.graphics().setDepth(.5);
  edge.fillStyle(0x0B1023,.18).fillRect(0,0,NOVA.COLS*NOVA.TILE,16).fillRect(0,NOVA.ROWS*NOVA.TILE-16,NOVA.COLS*NOVA.TILE,16);
  if(this.level===1){
    edge.fillStyle(0x7FA37F,.35).fillRect(0,0,NOVA.COLS*NOVA.TILE,12);
    edge.fillStyle(0x7FA37F,.35).fillRect(0,NOVA.ROWS*NOVA.TILE-12,NOVA.COLS*NOVA.TILE,12);
  }else if(this.level===2){
    for(let i=0;i<5;i++)edge.fillStyle(i%2?0xC7A07C:0xE0C29C,.30).fillRect(0,i*8,NOVA.COLS*NOVA.TILE,4);
  }else if(this.level===3){
    for(let x=20;x<NOVA.COLS*NOVA.TILE;x+=88){this.add.image(x,20,'deco-tree-top').setDepth(1.5).setScale(.45).setAlpha(.72);this.add.image(x,NOVA.ROWS*NOVA.TILE-18,'deco-tree-top').setDepth(1.5).setScale(.45).setAlpha(.72);}
  }else if(this.level===4){
    edge.fillStyle(0x566C58,.28).fillEllipse(NOVA.COLS*NOVA.TILE/2,NOVA.ROWS*NOVA.TILE-12,680,40);
    for(let x=20;x<NOVA.COLS*NOVA.TILE;x+=60){edge.fillStyle(0xF6D79A,.55).fillRect(x,NOVA.ROWS*NOVA.TILE-22,2,4);} 
  }
 }
 createAnimations(){for(const pose of ['down','back','side']){
   const key=`guardian-walk-${pose}`;
   if(!this.anims.exists(key))this.anims.create({key,frames:[{key:`hero-${pose}-0`},{key:`hero-${pose}-1`}],frameRate:11,repeat:-1});
  }}
 face(dx,dy){const dir=dx<0?'left':dx>0?'right':dy<0?'up':'down';this.heroFacing=dir;
  const pose=dir==='left'||dir==='right'?'side':dir==='up'?'back':'down';
  this.hero.setFlipX(dir==='left');if(!this.heroWalking)this.hero.setTexture(`hero-${pose}-0`);
  return pose;
 }
 isWalkable(c,r){if(!this.inBounds(c,r))return false;const tile=this.grid[r][c];
  if(tile==='wall'||tile==='crate')return false;
  if(tile==='gate'){const gate=this.gates.find(g=>g.col===c&&g.row===r);if(gate&&!gate.open)return false;}
  if(this.bombs.has(this.key(c,r)))return false;return true;
 }
 moveHero(dx,dy){const pose=this.face(dx,dy),c=this.heroGrid.col+dx,r=this.heroGrid.row+dy;
  if(this.heroWalking||!this.isWalkable(c,r))return;
  this.heroGrid={col:c,row:r};this.heroWalking=true;
  this.hero.anims.play(`guardian-walk-${pose}`,true);
  const [x,y]=this.center(c,r);
  this.tweens.add({targets:this.hero,x,y,duration:Math.max(90,this.speedStepMs-20),ease:'Sine.easeInOut',onComplete:()=>{
     this.heroWalking=false;this.hero.anims.stop();this.hero.setTexture(`hero-${pose}-0`);
  }});
  this.checkTile(c,r);
 }
 moveFromControls(time){if(time-this.lastMove<this.speedStepMs)return;let dx=0,dy=0;
  const k=this.keys,d=this.touchDirection;
  if(k.left.isDown||k.a.isDown||d==='left')dx=-1;
  else if(k.right.isDown||k.d.isDown||d==='right')dx=1;
  else if(k.up.isDown||k.w.isDown||d==='up')dy=-1;
  else if(k.down.isDown||k.s.isDown||d==='down')dy=1;
  if(dx||dy){this.lastMove=time;this.moveHero(dx,dy);}
 }
 spawnMission(){
  if(this.level===1){[[5,5],[13,9],[21,15]].forEach(([c,r])=>{
    const [x,y]=this.center(c,r);
    const halo=this.add.circle(x,y,25,0xFFD889,.19).setDepth(12);
    this.tweens.add({targets:halo,scale:1.22,alpha:.07,duration:1100,yoyo:true,repeat:-1});
    const sprite=this.add.image(x,y,'lantern-off').setDepth(14);
    this.objectives.push({col:c,row:r,sprite,halo,done:false,type:'lantern'});
  });}
  if(this.level===2){
   const stones=[[5,7,'crate'],[13,9,'seal'],[19,15,'crate']];
   stones.forEach(([c,r,hide])=>{
     if(hide==='crate')this.addCrate(c,r);
     const [x,y]=this.center(c,r);
     const sprite=this.add.image(x,y,hide==='seal'?'seal':'stone-token').setDepth(14).setVisible(hide==='seal');
     this.objectives.push({col:c,row:r,sprite,done:false,hidden:hide,type:'stone',revealed:hide==='seal'?false:hide==='crate'?false:true});
   });
   [[7,3],[15,5],[21,13],[21,3]].forEach(([c,r],i)=>{
     const [x,y]=this.center(c,r),sprite=this.add.image(x,y,'pedestal-off').setDepth(12);
     this.pedestals.push({col:c,row:r,sprite,done:false,decoy:i===3});
     if(i===3){sprite.setTint(0xAA7EAC);this.add.text(x,y+26,'?',{font:'18px Georgia',color:'#FFE0B8'}).setOrigin(.5).setDepth(13);}
   });
  }
  if(this.level===3){[[5,5],[13,9],[21,15]].forEach(([c,r])=>{
     const [x,y]=this.center(c,r),sprite=this.add.image(x,y,'key-glow').setDepth(14);
     this.tweens.add({targets:sprite,y:y-5,duration:850,yoyo:true,repeat:-1});
     this.objectives.push({col:c,row:r,sprite,done:false,type:'key'});
   });
   [[9,7],[17,11]].forEach(([c,r])=>{
     this.grid[r][c]='gate';const [x,y]=this.center(c,r);
     const sprite=this.add.image(x,y,'mist-door').setDepth(12);
     this.gates.push({col:c,row:r,sprite,open:false,until:0});
   });
  }
  if(this.level===4){
   [[7,5],[17,9],[11,15]].forEach(([c,r])=>{
     const [x,y]=this.center(c,r),sprite=this.add.image(x,y,'core-shield').setDepth(16);
     this.tweens.add({targets:sprite,scale:1.1,duration:1100,yoyo:true,repeat:-1});
     this.objectives.push({col:c,row:r,sprite,done:false,shielded:true,type:'core'});
   });
   const [bx,by]=this.center(13,9);this.boss=this.add.image(bx,by-13,'boss').setScale(1.75).setDepth(15);
   this.tweens.add({targets:this.boss,y:by-23,angle:6,duration:1250,yoyo:true,repeat:-1});
   this.add.circle(bx,by,42,0xB476CA,.18).setDepth(3);
  }
 }
 addCrate(c,r){const old=this.blocks[r][c];old?.destroy();this.grid[r][c]='crate';const[x,y]=this.center(c,r);
  this.blocks[r][c]=this.add.image(x,y,`crate-${this.level}`).setDepth(7);
 }
 spawnEnemies(){
  const spawns=[[21,7],[3,13],[17,15],[19,3]];const diff=NovaData.settings.difficulty;
  const count=this.stage.enemy+(diff==='DIFÍCIL'?1:0);
  spawns.slice(0,count).forEach(([c,r],i)=>{
   const [x,y]=this.center(c,r),sprite=this.add.image(x,y,(i%2?'enemy-pink':'enemy-violet')).setDepth(19);
   sprite.setTint(this.level>=3?0xC3B3F5:0xFFFFFF);
   const vision=this.level===3?this.add.graphics().setDepth(3):null;
   this.enemies.push({col:c,row:r,sprite,vision,alive:true,stunnedUntil:0,lastMove:0,
     interval:(diff==='FÁCIL'?810:diff==='DIFÍCIL'?460:650)+i*55,faceX:i%2?1:-1,faceY:0});
  });
 }
 spawnGuaranteedBonus(){this.createPickup(3,3,'shield');}
 createPickup(c,r,type){if(this.grid[r][c]!=='floor'||this.powerups.has(this.key(c,r)))return;
  const [x,y]=this.center(c,r),name=({shield:'item-shield',clock:'item-clock',wind:'item-wind',memory:'item-memory',fire:'item-fire',capacity:'item-capacity',speed:'item-speed'})[type];
  const sprite=this.add.image(x,y,name).setDepth(10).setScale(.94);this.tweens.add({targets:sprite,scale:1.07,duration:800,yoyo:true,repeat:-1});
  this.powerups.set(this.key(c,r),{type,sprite});
 }
 checkTile(c,r){
  const bonus=this.powerups.get(this.key(c,r));if(bonus){bonus.sprite.destroy();this.powerups.delete(this.key(c,r));this.applyPickup(bonus.type);}
  for(const o of this.objectives){if(o.done||o.col!==c||o.row!==r)continue;
    if(o.type==='stone'&&o.revealed){o.done=true;o.sprite.destroy();this.stoneInventory++;this.stonesFound++;this.score+=125;NovaAudio.play('item');this.notify(`¡Piedra recuperada! ${this.stonesFound}/3`);}
    if(o.type==='key'){o.done=true;o.sprite.destroy();this.progress(1);this.score+=150;NovaAudio.play('item');this.notify('¡Llave de luz encontrada!');}
  }
  if(this.level===2){for(const p of this.pedestals){if(p.col===c&&p.row===r&&!p.done&&!p.decoy&&this.stoneInventory>0){p.done=true;p.sprite.setTexture('pedestal-on');this.stoneInventory--;this.progress(1);this.score+=150;NovaAudio.play('memory');this.notify('¡Piedra colocada en el atrio!');break;}}}
  if(c===23&&r===17){if(this.portalOpen)this.finish(true);else this.notify('El portal necesita los tres recuerdos.');}
 }
 applyPickup(type){NovaAudio.play('item');this.score+=70;
  if(type==='shield'){this.hasShield=true;this.notify('¡Poncho protector! Bloquea un impacto.');}
  else if(type==='clock'||type==='wind'){this.heldBonus=type;this.notify(type==='clock'?'Reloj ancestral equipado · SHIFT':'Viento del Pichincha equipado · SHIFT');}
  else if(type==='memory'){this.maxMemCharges=2;this.memoryCharges=Math.min(2,this.memoryCharges+1);this.notify('¡Farol mejorado! Ahora tienes 2 cargas.');}
  else if(type==='fire'){this.bombRange=Math.min(4,this.bombRange+1);this.notify('¡Bombas con mayor alcance!');}
  else if(type==='capacity'){this.maxBombs=Math.min(3,this.maxBombs+1);this.notify('¡Puedes colocar más bombas!');}
  else if(type==='speed'){this.speedStepMs=Math.max(115,this.speedStepMs-22);this.notify('¡Nova camina más rápido!');}
 }
 placeBomb(){if(this.ended||this.storyOpening||this.pausedByPlayer||this.bombs.size>=this.maxBombs)return;
  const {col:c,row:r}=this.heroGrid,id=this.key(c,r);if(this.bombs.has(id))return;
  NovaAudio.play('bomb');const[x,y]=this.center(c,r);
  const sprite=this.add.image(x,y,'bomb').setDepth(17);
  const bomb={col:c,row:r,sprite,id,exploded:false,timer:null};this.bombs.set(id,bomb);
  this.tweens.add({targets:sprite,scale:1.14,duration:340,yoyo:true,repeat:-1});
  bomb.timer=this.time.delayedCall(2150,()=>this.explode(bomb));
 }
 rayCells(c,r,range,kind){const out=[[c,r]];
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){
   for(let i=1;i<=range;i++){
    const x=c+i*dx,y=r+i*dy;if(!this.inBounds(x,y))break;
    const tile=this.grid[y][x];if(tile==='wall')break;
    if(kind==='memory'&&tile==='crate')break;
    out.push([x,y]);if(kind==='bomb'&&(tile==='crate'||tile==='gate'))break;
   }
  }return out;
 }
 memoryArea(c,r){
  // La luz es un halo cercano: alcanza objetivos adyacentes incluso en diagonal.
  // Se conserva la onda en cruz de 3 casillas para mantener el carácter Bomberman.
  const visited = new Set(this.rayCells(c,r,3,'memory').map(([x,y])=>this.key(x,y)));
  for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){
    const x=c+dx,y=r+dy;
    if(this.inBounds(x,y)&&Math.max(Math.abs(dx),Math.abs(dy))<=2&&this.grid[y][x]!=='wall')visited.add(this.key(x,y));
  }
  return Array.from(visited).map(s=>s.split(',').map(Number));
 }
 explode(bomb){if(!bomb||bomb.exploded||this.ended)return;
  bomb.exploded=true;bomb.timer?.remove(false);this.bombs.delete(bomb.id);bomb.sprite.destroy();NovaAudio.play('blast');
  const cells=this.rayCells(bomb.col,bomb.row,this.bombRange,'bomb');
  cells.forEach(([c,r])=>{
    const id=this.key(c,r),[x,y]=this.center(c,r);
    const fx=this.add.image(x,y,'flame').setDepth(24).setAlpha(NovaData.settings.reducedFlash?.75:.95);
    this.tweens.add({targets:fx,alpha:0,scale:1.2,duration:440,onComplete:()=>fx.destroy()});
    this.flames.set(id,this.time.now+420);
    if(this.heroGrid.col===c&&this.heroGrid.row===r)this.takeDamage();
    this.enemies.forEach(e=>{if(e.alive&&e.col===c&&e.row===r)this.removeEnemy(e);});
    this.objectives.forEach(o=>{if(o.type==='core'&&!o.done&&o.shielded&&o.col===c&&o.row===r){o.shielded=false;o.sprite.setTexture('core-open');NovaAudio.play('unlock');this.score+=100;this.notify('¡Escudo roto! Usa una bomba de memoria.');}});
    if(this.grid[r][c]==='crate')this.breakCrate(c,r);
    const other=this.bombs.get(id);if(other&&!other.exploded)this.time.delayedCall(40,()=>this.explode(other));
  });
 }
 breakCrate(c,r){if(this.grid[r][c]!=='crate')return;
  this.grid[r][c]='floor';this.blocks[r][c]?.destroy();this.blocks[r][c]=null;
  const stone=this.objectives.find(o=>o.type==='stone'&&o.col===c&&o.row===r&&o.hidden==='crate');
  if(stone){stone.revealed=true;stone.sprite.setVisible(true).setTexture('stone-token');this.notify('¡Encontraste una piedra antigua!');}
  else if(this.rng()<.20){const types=['shield','clock','wind','memory','fire','capacity','speed'];this.createPickup(c,r,types[Math.floor(this.rng()*types.length)]);}
  this.score+=25;
 }
 useMemory(){if(this.ended||this.storyOpening||this.pausedByPlayer)return;
  if(this.memoryCharges<1){this.notify('El farol está recargando su energía…',1100);return;}
  this.memoryCharges--;this.memRecharge.push(this.time.now+10000);
  const {col:c,row:r}=this.heroGrid;const cells=this.memoryArea(c,r);NovaAudio.play('memory');
  // La bomba mágica aparece un instante antes de desplegar su onda restauradora.
  const [mx,my]=this.center(c,r);const magicalBomb=this.add.image(mx,my,'memory-bomb').setDepth(27).setScale(.78);
  this.tweens.add({targets:magicalBomb,scale:1.36,alpha:0,duration:490,onComplete:()=>magicalBomb.destroy()});
  cells.forEach(([x,y])=>{
    const [px,py]=this.center(x,y);const spark=this.add.image(px,py,'memory-wave').setAlpha(.93).setDepth(28);
    this.tweens.add({targets:spark,alpha:0,scale:1.4,duration:NovaData.settings.reducedFlash?340:570,onComplete:()=>spark.destroy()});
    this.enemies.forEach(e=>{if(e.alive&&e.col===x&&e.row===y){e.stunnedUntil=this.time.now+2400;e.sprite.setTint(0xA3FFF0);}});
    this.objectives.forEach(o=>{if(o.col!==x||o.row!==y||o.done)return;
      if(o.type==='lantern'){o.done=true;o.sprite.setTexture('lantern-on');o.halo?.setFillStyle(0x70E9C9,.25);this.restoreLight(o.col,o.row);this.progress(1);this.score+=180;this.notify('¡Farol restaurado!');}
      else if(o.type==='stone'&&o.hidden==='seal'&&!o.revealed){o.revealed=true;o.sprite.setTexture('stone-token');this.notify('¡Una piedra apareció donde había un sello!');this.score+=90;}
      else if(o.type==='core'&&!o.shielded){o.done=true;o.sprite.setTexture('core-done');this.restoreLight(o.col,o.row);this.progress(1);this.score+=200;this.notify('¡Núcleo liberado!');}
    });
    this.gates.forEach(g=>{if(g.col===x&&g.row===y)this.openGate(g);});
  });
  const[x,y]=this.center(c,r);NovaUI.particle(this,x,y,0xD5FFF1,15);
  if(!cells.some(([x,y])=>this.objectives.some(o=>o.col===x&&o.row===y)))this.notify('La luz revela caminos, faroles y recuerdos cercanos.',1800);
 }
 openGate(g){g.open=true;g.until=this.time.now+8000;g.sprite.setAlpha(.26);this.notify('¡Pasadizo iluminado durante 8 segundos!');}
 restoreLight(c,r){const[x,y]=this.center(c,r);
  const glow=this.add.circle(x,y,55,0xFFF0B6,.22).setDepth(2).setBlendMode(Phaser.BlendModes.ADD);
  this.tweens.add({targets:glow,alpha:.08,scale:1.2,duration:1600,yoyo:true,repeat:-1});
  NovaUI.particle(this,x,y,0xF6D69C,17);
 }
 updateMemory(){if(!this.memRecharge.length)return;
  const done=this.memRecharge.filter(deadline=>this.time.now>=deadline).length;
  if(done){this.memoryCharges=Math.min(this.maxMemCharges,this.memoryCharges+done);this.memRecharge=this.memRecharge.filter(deadline=>deadline>this.time.now);}
 }
 useBonus(){if(this.ended||this.storyOpening||this.pausedByPlayer||!this.heldBonus)return;
  const bonus=this.heldBonus;this.heldBonus=null;NovaAudio.play('memory');
  if(bonus==='clock'){this.enemies.forEach(e=>{if(e.alive){e.stunnedUntil=this.time.now+4000;e.sprite.setTint(0xA4F1D8);}});this.notify('¡Tiempo detenido durante 4 segundos!');}
  if(bonus==='wind'){const {col:c,row:r}=this.heroGrid;this.enemies.forEach(e=>{
    if(!e.alive||Math.abs(e.col-c)+Math.abs(e.row-r)>4)return;
    const dx=e.col===c?0:e.col>c?1:-1,dy=e.row===r?0:e.row>r?1:-1;
    const nc=e.col+dx,nr=e.row+dy;if(this.isWalkable(nc,nr)){e.col=nc;e.row=nr;const[x,y]=this.center(nc,nr);e.sprite.setPosition(x,y);}
    e.stunnedUntil=this.time.now+1500;
  });this.notify('¡Viento del Pichincha! Las sombras retroceden.');}
 }
 progress(n){this.missionProgress=Math.min(this.stage.count,this.missionProgress+n);this.lastProgressAt=this.time.now;
   if(this.missionProgress>=this.stage.count&&!this.portalOpen){this.portalOpen=true;this.portal.setTexture('exit').setAlpha(1);this.score+=350;NovaAudio.play('unlock');this.notify('¡MISIÓN COMPLETA! Dirígete al portal turquesa.',4500);const[x,y]=this.center(23,17);NovaUI.particle(this,x,y,0x8FFFF0,22);}
 }
 removeEnemy(e){if(!e.alive)return;e.alive=false;this.score+=100;NovaAudio.play('enemy');NovaUI.particle(this,e.sprite.x,e.sprite.y,0xBA8DEE,10);e.sprite.destroy();e.vision?.destroy();}
 takeDamage(){if(this.ended||this.time.now<this.invincibleUntil)return;
  this.invincibleUntil=this.time.now+2050;
  if(this.hasShield){this.hasShield=false;NovaAudio.play('item');this.notify('El poncho te protegió del impacto.');return;}
  this.lives--;NovaAudio.play('hit');this.notify('¡Cuidado, Nova! Te quedan '+this.lives+' vidas.');
  this.tweens.add({targets:this.hero,alpha:.27,duration:115,repeat:8,yoyo:true,onComplete:()=>this.hero?.setAlpha(1)});
  if(this.lives<=0)this.time.delayedCall(350,()=>this.finish(false));
 }
 moveEnemies(time){for(const e of this.enemies){if(!e.alive)continue;
   if(time<e.stunnedUntil){e.sprite.setTint(0xA5F4DF);continue;}else e.sprite.setTint(this.level>=3?0xD1B8F3:0xFFFFFF);
   if(time-e.lastMove<e.interval)continue;e.lastMove=time;
   const dirs=[[0,1],[1,0],[-1,0],[0,-1]];const possible=dirs.filter(([dx,dy])=>this.isWalkable(e.col+dx,e.row+dy));if(!possible.length)continue;
   let dir=possible[Math.floor(this.rng()*possible.length)];
   const heroDx=this.heroGrid.col-e.col,heroDy=this.heroGrid.row-e.row;
   if(this.level!==3&&Math.abs(heroDx)+Math.abs(heroDy)<5&&this.rng()<.23){const pursue=possible.find(d=>(heroDx!==0&&d[0]===Math.sign(heroDx))||(heroDx===0&&d[1]===Math.sign(heroDy)));if(pursue)dir=pursue;}
   if(this.level===3&&this.rng()<.58){const patrol=possible.find(d=>(e.faceX!==0&&d[0]===e.faceX)||(e.faceY!==0&&d[1]===e.faceY));if(patrol)dir=patrol;}
   e.col+=dir[0];e.row+=dir[1];e.faceX=dir[0];e.faceY=dir[1];const[x,y]=this.center(e.col,e.row);
   this.tweens.add({targets:e.sprite,x,y,duration:e.interval*.46,ease:'Sine.easeInOut'});
  }}
 checkEnemyHit(){const {col:c,row:r}=this.heroGrid;this.enemies.forEach(e=>{
   if(!e.alive||this.time.now<e.stunnedUntil)return;
   if(e.col===c&&e.row===r)this.takeDamage();
   if(this.level===3){const dx=c-e.col,dy=r-e.row;const along=(e.faceX&&dy===0&&dx*e.faceX>0&&dx*e.faceX<=2)||(e.faceY&&dx===0&&dy*e.faceY>0&&dy*e.faceY<=2);
    if(along){let clear=true;const n=Math.abs(dx)+Math.abs(dy);
     for(let k=1;k<n;k++){const x=e.col+Math.sign(dx)*k,y=e.row+Math.sign(dy)*k;if(['wall','crate','gate'].includes(this.grid[y][x])){clear=false;break;}}
     if(clear)this.takeDamage();
    }
   }
  });}
 drawEnemyVision(){if(this.level!==3)return;for(const e of this.enemies){if(!e.alive||!e.vision)continue;
    e.vision.clear();if(this.time.now<e.stunnedUntil)continue;
    const [x,y]=this.center(e.col,e.row),dx=e.faceX,dy=e.faceY;
    const tx=x+dx*93,ty=y+dy*93,wx=dy*30,wy=dx*30;
    e.vision.fillStyle(0xFAD2A9,.12).fillTriangle(x,y,tx+wx,ty+wy,tx-wx,ty-wy);
    e.vision.lineStyle(1,0xF7D6B0,.26).lineBetween(x,y,tx+wx,ty+wy).lineBetween(x,y,tx-wx,ty-wy);
  }}
 updateGates(){this.gates.forEach(g=>{if(g.open&&this.time.now>g.until){if(this.heroGrid.col===g.col&&this.heroGrid.row===g.row){g.until=this.time.now+1000;return;}g.open=false;g.sprite.setAlpha(1);}});}
 scheduleHazard(){if(this.ended)return;
  const lane=[5,9,13][Math.floor(this.rng()*3)];const horizontal=this.rng()>.4;const tiles=[];
  for(let i=1;i<(horizontal?NOVA.COLS-1:NOVA.ROWS-1);i++){
   const c=horizontal?i:lane,r=horizontal?lane:i;if(this.grid[r][c]==='wall')continue;tiles.push([c,r]);
  }
  const signs=tiles.map(([c,r])=>{const[x,y]=this.center(c,r);return this.add.rectangle(x,y,40,40,0xFF8AAE,.33).setDepth(3);});
  NovaAudio.play('warning');this.notify('¡Cuidado! La niebla va a atacar la franja iluminada.',1900);
  this.time.delayedCall(1450,()=>{
   signs.forEach(g=>g.destroy());if(this.ended)return;
   tiles.forEach(([c,r])=>{const[x,y]=this.center(c,r);const glow=this.add.rectangle(x,y,40,40,0xD987DE,.52).setDepth(13);
    this.tweens.add({targets:glow,alpha:0,duration:530,onComplete:()=>glow.destroy()});
    if(this.heroGrid.col===c&&this.heroGrid.row===r)this.takeDamage();
   });
  });
  this.time.delayedCall(13500,()=>this.scheduleHazard());
 }
 getObjective(){
  if(this.portalOpen)return '¡Portal abierto! Encuentra la salida.';
  if(this.level===1)return `Faroles restaurados  ${this.missionProgress}/3`;
  if(this.level===2)return `Piedras colocadas  ${this.missionProgress}/3  ·  mochila ${this.stoneInventory}`;
  if(this.level===3)return `Llaves de luz  ${this.missionProgress}/3`;
  return `Núcleos liberados  ${this.missionProgress}/3`;
 }
 getInteractionPrompt(){
  if(this.portalOpen)return '✦ ¡Portal abierto! Camina hasta la salida turquesa.';
  const {col,row}=this.heroGrid;
  const near=(o)=>!o.done&&Math.max(Math.abs(o.col-col),Math.abs(o.row-row))<=2;
  let action='';
  if(this.level===1&&this.objectives.some(o=>o.type==='lantern'&&near(o)))action='FAROL CERCA: pulsa E para encenderlo';
  if(this.level===2&&this.objectives.some(o=>o.type==='stone'&&o.hidden==='seal'&&!o.revealed&&near(o)))action='SELLO CERCA: pulsa E para revelar la piedra';
  if(this.level===4&&this.objectives.some(o=>o.type==='core'&&!o.shielded&&near(o)))action='NÚCLEO LISTO: pulsa E para restaurarlo';
  if(this.level===4&&this.objectives.some(o=>o.type==='core'&&o.shielded&&near(o)))action='NÚCLEO PROTEGIDO: usa ESPACIO primero';
  if(action&&this.memoryCharges<1&&!(this.level===4&&action.startsWith('NÚCLEO PROTEGIDO'))){
    const remaining=this.memRecharge.length?Math.max(0,Math.ceil((Math.min(...this.memRecharge)-this.time.now)/1000)):10;
    return `◌ Estás cerca: la luz se recarga en ${remaining}s`;
  }
  if(action)return '✦ '+action;
  if(this.level===1)return '✦ Busca un farol apagado, acércate y pulsa E.';
  if(this.level===2)return '✦ ESPACIO rompe cajas · E revela el sello brillante.';
  if(this.level===3)return '✦ E abre puertas de niebla y detiene vigilantes.';
  return '✦ ESPACIO rompe escudos · E restaura los núcleos.';
 }
 getHint(){return [
  'Busca un farol apagado. Colócate a dos casillas o menos y pulsa E para iluminarlo.',
  'Rompe cajas para hallar piedras. Revela el sello con E y pisa los pedestales.',
  'Recoge las tres llaves brillantes. E abre las puertas de niebla y aturde vigilantes.',
  'Rompe el escudo de cada cristal con ESPACIO y luego usa E para restaurarlo.'
 ][this.level-1];}
 notify(message,duration=2400){const hud=this.scene.get('HUD');if(this.scene.isActive('HUD')&&hud?.toast)hud.toast(message,duration);}
 releaseStory(){this.storyOpening=false;this.time.paused=false;this.notify(this.getHint(),3900);}
 togglePause(){if(this.ended||this.storyOpening)return;this.pausedByPlayer=!this.pausedByPlayer;this.time.paused=this.pausedByPlayer;
  if(this.pausedByPlayer)this.tweens.pauseAll();else this.tweens.resumeAll();
  this.touchDirection=null;const hud=this.scene.get('HUD');if(this.scene.isActive('HUD'))hud.setPause(this.pausedByPlayer);
 }
 restartLevel(){this.time.paused=false;this.tweens.resumeAll();this.scene.stop('HUD');this.scene.restart({level:this.level});}
 backToMap(){this.time.paused=false;this.tweens.resumeAll();this.scene.stop('HUD');this.scene.start('CityMap',{selected:this.level});}
 finish(win){if(this.ended)return;this.ended=true;this.time.paused=false;this.tweens.resumeAll();this.touchDirection=null;
  if(win){this.score+=Math.max(0,Math.floor(1200-this.elapsed/120));NovaData.complete(this.level,this.score);NovaAudio.play('win');}
  this.scene.stop('HUD');this.scene.start('Result',{level:this.level,win,score:this.score,elapsed:this.elapsed});
 }
 update(time,delta){if(this.ended||this.storyOpening||this.pausedByPlayer||!this.hero)return;
  this.elapsed+=Math.min(delta,60);this.moveFromControls(this.time.now);this.updateMemory();this.updateGates();this.moveEnemies(this.time.now);this.drawEnemyVision();this.checkEnemyHit();
  this.lanternOnBack?.setPosition(this.hero.x+(this.heroFacing==='left'?-13:13),this.hero.y+10);
  this.lanternOnBack?.setDepth(this.heroFacing==='up'?23:20);
  for(const[id,deadline]of this.flames){if(this.time.now>deadline)this.flames.delete(id);}
  if(this.flames.has(this.key(this.heroGrid.col,this.heroGrid.row)))this.takeDamage();
  if(this.time.now-this.lastProgressAt>40000&&this.time.now>this.nextHintAt){this.notify('PISTA: '+this.getHint(),4400);this.nextHintAt=this.time.now+35000;}
 }
}
