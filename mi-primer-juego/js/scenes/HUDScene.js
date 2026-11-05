/* HUD fijo: la cámara del juego se desplaza sin mover la interfaz. */
class HUDScene extends Phaser.Scene {
 constructor(){super('HUD');}
 create(){this.world=this.scene.get('Game');this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
  const g=this.add.graphics().setDepth(1);
  g.fillStyle(0x171729,1).fillRect(0,0,1200,105).fillRect(0,105,35,563).fillRect(908,105,292,655).fillRect(0,668,910,92);
  g.lineStyle(2,0x8C7391,.65).strokeRoundedRect(34,104,875,565,9);
  g.fillStyle(0x24233D,1).fillRoundedRect(925,113,261,633,14);
  g.lineStyle(1.5,0x94799E,.73).strokeRoundedRect(925,113,261,633,14);
  g.fillStyle(0xF5CC8C,1).fillRoundedRect(43,100,107,4,2);
  NovaUI.text(this,47,37,'QUITO',34,'#F9E3B9',{serif:true});
  NovaUI.text(this,47,75,'GUARDIANES DE LAS LEYENDAS',12,'#B7A9C7');
  NovaUI.text(this,505,35,`CAPÍTULO 0${this.world.level} / 04`,18,'#FFE0A4',{ox:.5});
  NovaUI.text(this,505,74,this.world.stage.name.toUpperCase(),13,'#A9EBD7',{ox:.5});
  NovaUI.button(this,1092,53,'Ⅱ   PAUSA',()=>this.world.togglePause(),{w:167,h:49,font:17});
  NovaUI.text(this,949,143,'TU MISIÓN',12,'#A3C9C3');
  this.goalText=NovaUI.text(this,949,177,'',21,'#FFF4E9',{wrap:218,oy:0,lineSpacing:4});
  this.progressText=NovaUI.text(this,949,260,'',16,'#F9C994');
  this.divider(288);
  NovaUI.text(this,949,314,'VIDAS',11,'#B2A8C4');
  this.lifeText=NovaUI.text(this,949,347,'♥ ♥ ♥',24,'#FE9AAE');
  NovaUI.text(this,1090,314,'TIEMPO',11,'#B2A8C4');
  this.timeText=NovaUI.text(this,1090,347,'00:00',21,'#FFF3DE');
  this.divider(377);
  NovaUI.text(this,949,403,'PUNTOS',11,'#B2A8C4');
  this.scoreText=NovaUI.text(this,1159,403,'0',21,'#FBE0A1',{ox:1});
  NovaUI.text(this,949,447,'LUZ DE MEMORIA',11,'#A3C9C3');
  this.memoryText=NovaUI.text(this,949,477,'',17,'#B0FFE8');
  this.shieldText=NovaUI.text(this,949,507,'',12,'#F2D6A2',{wrap:218,oy:0,lineSpacing:4});
  this.addPad();
  this.guideText=NovaUI.text(this,52,691,'',16,'#FFE2A4',{wrap:830,oy:0,lineSpacing:3});
  NovaUI.text(this,52,741,'WASD / Flechas: mover   ·   Espacio: bomba   ·   E: luz   ·   Shift: poder',13,'#B7AEC6');
  this.bannerBg=this.add.rectangle(471,702,848,52,0x171729,1).setDepth(96).setVisible(false);
  this.banner=NovaUI.text(this,471,702,'',15,'#FFF0C9',{ox:.5,depth:97,wrap:814,align:'left',lineSpacing:3}).setVisible(false);
  this.makePauseOverlay();
  this.makeStageIntro();
 }
 divider(y){this.add.rectangle(945,y,220,1,0x786586,.85).setOrigin(0);}
 addPad(){
  const start=this.children.list.length;
  const make=(x,y,label,dir)=>{
    const bg=this.add.rectangle(x,y,40,36,0x343149).setStrokeStyle(1,0x756D88).setInteractive({useHandCursor:true});
    NovaUI.text(this,x,y,label,17,'#E6DCE8',{ox:.5});
    bg.on('pointerdown',()=>{this.world.touchDirection=dir;});
    for(const event of ['pointerup','pointerout'])bg.on(event,()=>{if(this.world.touchDirection===dir)this.world.touchDirection=null;});
  };
  make(995,592,'↑','up');make(951,632,'←','left');make(1039,632,'→','right');make(995,672,'↓','down');
  NovaUI.button(this,1123,610,'Bomba',()=>this.world.placeBomb(),{w:94,h:43,font:14});
  NovaUI.button(this,1123,666,'Luz',()=>this.world.useMemory(),{w:94,h:43,font:14});
  NovaUI.button(this,1055,722,'Usar poder',()=>this.world.useBonus(),{w:218,h:34,font:13});
  this.padLayer=this.add.container(0,0,this.children.list.slice(start)).setDepth(12);
  this.padLayer.setVisible(!this.sys.game.device.os.desktop && Boolean(this.sys.game.device.input.touch));
  this.padToggle=NovaUI.button(this,1055,554,this.padLayer.visible?'Ocultar controles':'Controles en pantalla',()=>{
    this.padLayer.setVisible(!this.padLayer.visible);this.world.touchDirection=null;
    this.padToggle.list.find(child=>child.type==='Text').setText(this.padLayer.visible?'Ocultar controles':'Controles en pantalla');
  },{w:218,h:34,font:12});
  this.input.on('pointerup',()=>{this.world.touchDirection=null;});
 }
 toast(message,duration=2300){if(!this.banner)return;
  this.banner.setText(message).setVisible(true);this.bannerBg.setVisible(true);
  this.guideText.setVisible(false);
  if(this.toastTimer)this.toastTimer.remove(false);
  this.toastTimer=this.time.delayedCall(duration,()=>{this.banner?.setVisible(false);this.bannerBg?.setVisible(false);this.guideText?.setVisible(true);});
 }
 update(){const g=this.world;if(!g||!g.scene.isActive()||!this.lifeText)return;
  const sec=Math.floor(g.elapsed/1000);this.timeText.setText(`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`);
  this.lifeText.setText(g.lives>0?'♥ '.repeat(g.lives).trim():'—');this.scoreText.setText(String(Math.floor(g.score)));
  this.goalText.setText(g.stage.goal);this.progressText.setText(g.portalOpen?'3 / 3 · Salida abierta':`${g.missionProgress} / 3 recuerdos`);
  this.memoryText.setText(g.memoryCharges?`Lista · ${g.memoryCharges}/${g.maxMemCharges}`:
    `Recarga · ${Math.max(0,Math.ceil((Math.min(...g.memRecharge)-g.time.now)/1000))} s`);
  this.guideText.setText(g.getInteractionPrompt());
  this.shieldText.setText([g.hasShield?'Poncho protector':'',g.heldBonus?`${g.heldBonus==='clock'?'Reloj':'Viento'} · Shift`:''].filter(Boolean).join(' / '));
 }
 makeStageIntro(){const l=this.world.stage;
  const stories=[
    'La plaza ha perdido su canto. Devuelve la luz a tres faroles para que sus historias despierten.',
    'Cantuña guardó un secreto entre piedras. Encuentra tres y deja el cuarto pedestal vacío.',
    'Entre los pasillos del convento, las sombras custodian tres llaves. Usa la luz para engañarlas.',
    'El olvido tiene tres corazones. Rompe su protección y haz brillar cada uno antes del amanecer.'
  ];
  this.introLayer=this.add.container(0,0).setDepth(155);
  const shade=this.add.rectangle(600,380,1200,760,0x15142D,.92).setInteractive();
  const panel=this.add.rectangle(600,388,800,537,0x25223F).setStrokeStyle(2,0xE6BC8F);
  const badge=NovaUI.text(this,600,175,`CAPÍTULO 0${this.world.level}  /  04`,16,'#F5D394',{ox:.5});
  const title=NovaUI.text(this,600,245,l.name,52,'#FFF3E2',{serif:true,ox:.5});
  const subtitle=NovaUI.text(this,600,304,l.title,25,'#BCE6DD',{serif:true,ox:.5});
  // Postal con foto real; si Wikimedia Commons no responde, queda el dibujo del lugar.
  this.introLayer.add([shade,panel,badge,title,subtitle]);
  NovaPhotos.place(this,this.world.level,600,391,290,117,this.introLayer,{depth:6});
  const credit=NovaUI.text(this,600,457,`FOTO: ${NovaPhotos.photos[this.world.level-1].author} · ${NovaPhotos.photos[this.world.level-1].license}`,11,'#EEDCC5',{ox:.5});
  this.introLayer.add(credit);
  const line=NovaUI.text(this,600,484,stories[this.world.level-1],18,'#E2D7E2',{ox:.5,align:'center',wrap:660,bold:false,lineSpacing:4,oy:0});
  const mission=NovaUI.text(this,600,550,`OBJETIVO · ${l.goal.toUpperCase()} (${l.count})`,15,'#F5D495',{ox:.5});
  const tip=NovaUI.text(this,600,580,this.world.level===1?'✦ ACÉRCATE A UN FAROL (MÁX. 2 CASILLAS) Y PULSA E':'ESPACIO = DESTRUIR    ·    E = LUZ DE MEMORIA (RECARGA: 10 S)',14,'#8FEBD5',{ox:.5});
  this.introLayer.add([line,mission,tip]);
  this.introLayer.add(NovaUI.button(this,600,628,'✦  EMPEZAR MISIÓN',()=>{this.introLayer.destroy();this.world.releaseStory();},{w:326,primary:true}));
 }
 makePauseOverlay(){const overlay=this.add.container(0,0).setVisible(false).setDepth(150);this.pauseLayer=overlay;
  const shade=this.add.rectangle(600,380,1200,760,0x0C0D20,.89).setInteractive();
  const panel=this.add.rectangle(600,386,566,520,0x28223F).setStrokeStyle(2,0xE5BF95);
  const lamp=this.add.image(600,224,'lantern-on').setScale(1.7);
  const title=NovaUI.text(this,600,297,'UNA PAUSA EN LA AVENTURA',32,'#FFF0DA',{serif:true,ox:.5});
  const subtitle=NovaUI.text(this,600,349,'Las leyendas te esperan cuando estés listo.',18,'#D0C2D8',{ox:.5,bold:false});
  overlay.add([shade,panel,lamp,title,subtitle]);
  overlay.add(NovaUI.button(this,600,425,'▶  CONTINUAR',()=>this.world.togglePause(),{w:330,primary:true}));
  overlay.add(NovaUI.button(this,600,498,'↻  REINICIAR NIVEL',()=>this.world.restartLevel(),{w:330}));
  overlay.add(NovaUI.button(this,600,571,'⌂  VOLVER AL MAPA',()=>this.world.backToMap(),{w:330}));
 }
 setPause(flag){this.pauseLayer.setVisible(flag);}
}
