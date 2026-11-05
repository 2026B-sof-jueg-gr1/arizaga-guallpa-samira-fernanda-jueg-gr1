class IntroScene extends Phaser.Scene {
 constructor(){super('Intro');}
 init(){this.page=0;}
 create(){NovaUI.background(this,0);NovaArt.fog(this);NovaUI.title(this,'PRÓLOGO','La noche en que Quito olvidó','Una pequeña historia antes de encender el primer farol.');this.nextPage();}
 nextPage(){if(this.content){this.content.forEach(o=>o?.destroy());}if(this.page>=3){NovaData.progress.seenIntro=true;NovaData.save();this.scene.start('CityMap');return;}
 const parts=[
  {tag:'01 / LA CIUDAD',title:'Quito brillaba al atardecer…',desc:'Sus calles guardaban historias transmitidas de generación en generación. Cada farol iluminaba un recuerdo.',star:'☀',color:0xF8D39A},
  {tag:'02 / LA NIEBLA',title:'Una sombra silenciosa llegó.',desc:'La Niebla del Olvido cubrió plazas y conventos. Las leyendas comenzaron a desvanecerse.',star:'☾',color:0xC6A1EC},
  {tag:'03 / LA GUARDIANA',title:'Pero alguien encontró una luz.',desc:'Nova recibió un antiguo farol mágico. Su misión: recuperar los cuatro fragmentos de la memoria de Quito.',star:'✦',color:0x88E5CF}
 ];const p=parts[this.page];this.content=[];
 const panel=NovaUI.card(this,107,249,986,362,0x25233F,.94);this.content.push(panel);
 const a=this.add.circle(330,428,122,p.color,.15).setDepth(3),b=this.add.circle(330,428,94,p.color,.14).setDepth(3);this.content.push(a,b);
 const symbol=NovaUI.text(this,330,428,p.star,132,'#FFE1B2',{serif:true,ox:.5});this.content.push(symbol);
 if(this.page===2){const h=this.add.image(329,440,'hero-down-0').setScale(2.1).setDepth(9);this.content.push(h);}
 this.content.push(NovaUI.text(this,510,333,p.tag,15,'#EFC98E'));
 this.content.push(NovaUI.text(this,510,404,p.title,34,'#FFF8ED',{serif:true,wrap:530}));
 this.content.push(NovaUI.text(this,510,511,p.desc,19,'#D7D0E1',{bold:false,wrap:500,lineSpacing:10}));
 this.content.push(NovaUI.text(this,600,643,`${this.page+1}   /   3`,15,'#FFE1B2',{ox:.5}));
 const btn=NovaUI.button(this,946,689,this.page===2?'IR AL MAPA  →':'SIGUIENTE  →',()=>this.nextPage(),{w:248,primary:true});
 const skip=NovaUI.button(this,212,690,'SALTAR INTRO',()=>{NovaData.progress.seenIntro=true;NovaData.save();this.scene.start('CityMap');},{w:200,h:48,font:15});
 this.content.push(btn,skip);this.page++;
 }
}
