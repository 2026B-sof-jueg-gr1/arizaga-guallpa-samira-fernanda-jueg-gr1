class ResultScene extends Phaser.Scene {
 constructor(){super('Result');}
 init(data){this.level=Phaser.Math.Clamp(data.level||1,1,4);this.win=Boolean(data.win);this.score=data.score||0;this.elapsed=data.elapsed||0;}
 create(){const l=NOVA.STAGES[this.level-1];NovaUI.background(this,this.win?Math.max(0,this.level-2):4);NovaArt.fog(this);
  this.add.rectangle(600,394,832,618,0x1C1C36,.92).setStrokeStyle(2,this.win?0xF8D191:0xA87EAC);
  const ring=this.add.circle(600,234,95,this.win?0xF9CB8D:0xB494C5,.16).setStrokeStyle(2,this.win?0xE9C89C:0xAF8ECB,.75);
  this.add.image(600,230,this.win?'lantern-on':'lantern-off').setScale(3.2);
  if(this.win)NovaUI.particle(this,600,231,0xF9DAAB,28);
  NovaUI.text(this,600,347,this.win?'✦ RECUERDO RECUPERADO ✦':'LA NIEBLA TE ALCANZÓ',16,this.win?'#FFDC9F':'#E2BDDC',{ox:.5});
  NovaUI.text(this,600,401,this.win?l.fragment:'NO TE RINDAS, NOVA',42,'#FFF4E6',{serif:true,ox:.5});
  NovaUI.text(this,600,457,this.win?`${l.name} vuelve a iluminarse.`:'Puedes volver a intentarlo. Tus postales están a salvo.',18,'#DFD2DE',{bold:false,ox:.5});
  const sec=Math.floor(this.elapsed/1000);
  NovaUI.text(this,600,502,`TIEMPO  ${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}      ·      PUNTOS  ${String(Math.floor(this.score)).padStart(6,'0')}`,15,'#F4CE9A',{ox:.5});
  if(this.win)NovaUI.text(this,600,538,`POSTAL DESBLOQUEADA · ${l.legend}`,14,'#A7E5CF',{ox:.5});
  NovaUI.button(this,600,598,this.win?(this.level===4?'VER EL AMANECER →':'SIGUIENTE CAPÍTULO →'):'↻  INTENTAR DE NUEVO',()=>{
   if(this.win&&this.level===4)this.scene.start('Ending');
   else if(this.win)this.scene.start('Game',{level:this.level+1});
   else this.scene.start('Game',{level:this.level});
  },{w:341,primary:true});
  NovaUI.button(this,600,666,'VER MAPA DE QUITO',()=>this.scene.start('CityMap',{selected:this.win?Math.min(4,this.level+1):this.level}),{w:341,h:50,font:16});
 }
}
