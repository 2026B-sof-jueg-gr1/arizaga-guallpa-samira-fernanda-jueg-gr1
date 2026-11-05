class EndingScene extends Phaser.Scene {
 constructor(){super('Ending');}
 create(){NovaUI.background(this,0);
  const light=this.add.circle(600,310,247,0xF5D49C,.1);this.tweens.add({targets:light,scale:1.16,alpha:.18,yoyo:true,repeat:-1,duration:2250});
  this.add.image(600,342,'hero-down-0').setScale(3.5).setDepth(9);
  this.add.image(688,368,'lantern-on').setScale(1.4).setDepth(10);
  NovaUI.text(this,600,94,'EL AMANECER REGRESA A QUITO',18,'#F9DBA4',{ox:.5});
  NovaUI.text(this,600,183,'Las leyendas viven',58,'#FFF4DF',{ox:.5,serif:true});
  NovaUI.text(this,600,243,'mientras alguien las recuerda.',35,'#FFF1E3',{ox:.5,serif:true});
  const names=['ECO','INGENIO','VALENTÍA','ESPERANZA'];
  names.forEach((n,i)=>{const x=290+i*205;this.add.circle(x,518,25,0xF9D898,.2).setStrokeStyle(1.4,0xE5C5A7);this.add.image(x,518,'lantern-on').setScale(.63);
   NovaUI.text(this,x,565,n,14,'#FFF1CD',{ox:.5});});
  NovaUI.text(this,600,627,'Cuatro recuerdos restaurados. Una ciudad llena de historias.',17,'#DFD2DE',{ox:.5,bold:false});
  NovaUI.button(this,433,699,'LIBRO DE LEYENDAS',()=>this.scene.start('LegendBook'),{w:292,h:47,font:15,primary:true});
  NovaUI.button(this,754,699,'MENÚ PRINCIPAL',()=>this.scene.start('Menu'),{w:290,h:47,font:15});
  for(let i=0;i<24;i++){const x=(i*127+32)%1170+16,y=(i*59+95)%690+21;const dot=this.add.circle(x,y,1.9,0xFBE2AE,.53).setDepth(5);
   this.tweens.add({targets:dot,alpha:.12,y:y-25,duration:1800+i*70,yoyo:true,repeat:-1});}
 }
}
