/* Pruebas automáticas de reglas (sin navegador). Node.js >=18.
   No pretende sustituir una prueba visual completa en Chrome/Edge. */
const fs=require('fs');const vm=require('vm');const path=require('path');
const root=path.resolve(__dirname,'..');
const context={console,Math,JSON,Map,Set,Array,Number,String,window:{},Phaser:{Scene:class{},Math:{Clamp:(v,a,b)=>Math.min(b,Math.max(a,v))},BlendModes:{ADD:1}}};
vm.createContext(context);
const scripts=['js/config.js','js/photos.js','js/ui.js','js/scenes/GameScene.js'];
for(const name of scripts)vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
// Los script clásicos almacenan NOVA y NovaData en window; un navegador los expone en global.
context.NOVA=context.window.NOVA;context.NovaData=context.window.NovaData;
assertPhotos=context.window.NovaPhotos;
context.NovaAudio={play:()=>{}};context.NovaUI={particle:()=>{}};
vm.runInContext('globalThis.GameSceneForTests=GameScene',context);
const assert=(value,message)=>{if(!value)throw Error(message);};
assert(assertPhotos.photos.length===4,'Deben existir cuatro fotografías con créditos');
for(const p of assertPhotos.photos)assert(p.url.startsWith('https://')&&p.author&&p.license&&p.source,'Falta autor o licencia de foto');
function sprite(x=0,y=0){const base={x,y,alpha:1,visible:true,texture:'',active:true,
 setDepth(){return this},setFillStyle(){return this},setScale(){return this},setAlpha(a){this.alpha=a;return this},setTint(){return this},setVisible(v){this.visible=v;return this},setTexture(t){this.texture=t;return this},setPosition(px,py){this.x=px;this.y=py;return this},setOrigin(){return this},setData(){return this},setBlendMode(){return this},destroy(){this.active=false;return this}};return base;}
function graphics(){const o=sprite();let proxy;proxy=new Proxy(o,{get(base,key){if(key==='setDepth')return()=>proxy;return base[key]??(()=>proxy);}});return proxy;}
function build(level){const Game=context.GameSceneForTests,s=new Game();s.init({level});
 s.add={image:(x,y)=>sprite(x,y),circle:(x,y)=>sprite(x,y),rectangle:(x,y)=>sprite(x,y),text:(x,y)=>sprite(x,y),graphics:()=>graphics()};
 s.tweens={add:()=>({}),pauseAll(){},resumeAll(){}};
 s.time={now:1000,delayedCall:()=>({remove(){}})};
 s.scene={isActive:()=>false,get:()=>({}),stop(){},start(){}};
 s.hero=s.add.image(0,0);s.lanternOnBack=s.add.image(0,0);
 s.makeWorld();s.spawnMission();s.spawnEnemies();s.spawnGuaranteedBonus();s.storyOpening=false;
 return s;
}
for(let level=1;level<=4;level++){
 const s=build(level);
 const seen=new Set(['1,1']),stack=[[1,1]];
 while(stack.length){const [c,r]=stack.pop();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
 const x=c+dx,y=r+dy;if(!s.inBounds(x,y)||s.grid[y][x]==='wall')continue;
 const id=s.key(x,y);if(!seen.has(id)){seen.add(id);stack.push([x,y]);}
 }}
 assert(seen.has('23,17'),`El portal del nivel ${level} es inaccesible incluso al limpiar cajas`);
 for(const o of s.objectives)assert(seen.has(s.key(o.col,o.row)),`Objetivo bloqueado en nivel ${level}`);
 console.log(`✓ Nivel ${level}: ${s.stage.name}, ${s.objectives.length} objetivos alcanzables`);
 if(level===1){for(const [i,o] of s.objectives.entries()){
  // También debe funcionar en diagonal, tal como enseña el nuevo tutorial.
  s.heroGrid=i===0?{col:o.col-1,row:o.row-1}:{col:o.col,row:o.row-1};
  assert(s.getInteractionPrompt().includes('E'),'El HUD no indica usar E al estar cerca del farol');
  s.time.now+=11000;s.updateMemory();s.useMemory();
 }
 assert(s.missionProgress===3&&s.portalOpen,'Faroles no activan portal');}
 if(level===2){for(const o of s.objectives){if(o.hidden==='crate')s.breakCrate(o.col,o.row);
 if(o.hidden==='seal'){s.heroGrid={col:o.col,row:o.row-1};s.time.now+=11000;s.updateMemory();s.useMemory();}
 s.checkTile(o.col,o.row);
 }
 assert(s.stoneInventory===3,'Las tres piedras no se recogen');
 for(const p of s.pedestals.filter(p=>!p.decoy))s.checkTile(p.col,p.row);
 assert(s.portalOpen&&s.missionProgress===3,'Los pedestales no desbloquean la salida');
 assert(!s.pedestals[3].done,'Se activó el pedestal que debe estar vacío');}
 if(level===3){for(const o of s.objectives)s.checkTile(o.col,o.row);
 assert(s.missionProgress===3&&s.portalOpen,'Las llaves no desbloquean el portal');}
 if(level===4){for(const o of s.objectives){s.bombRange=2;s.heroGrid={col:1,row:1};
 // Explosión adyacente al núcleo: rompe el escudo.
 const bomb={col:o.col,row:o.row-1,id:s.key(o.col,o.row-1),sprite:sprite(),timer:{remove(){}},exploded:false};s.bombs.set(bomb.id,bomb);s.explode(bomb);
 assert(!o.shielded,`No se puede romper un escudo de nivel 4 en ${o.col},${o.row}`);
 s.heroGrid={col:o.col,row:o.row-1};s.time.now+=11000;s.updateMemory();s.useMemory();assert(o.done,'El cristal no se puede restaurar');}
 assert(s.portalOpen&&s.missionProgress===3,'El jefe final no se completa');}
}
console.log('✓ Misiones y portal de los cuatro niveles verificados');
