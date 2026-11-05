class MenuScene extends Phaser.Scene {
 constructor(){super('Menu');}
 create(){NovaUI.background(this,0);NovaArt.fog(this);
   this.add.rectangle(598,379,1164,724,0x181429,.16).setStrokeStyle(1,0xD6B8A4,.36);
   this.add.rectangle(326,389,545,651,0x17162E,.86).setStrokeStyle(2,0x997A93,.7);
   this.add.rectangle(68,74,7,49,0xF6D08D);
   NovaUI.text(this,92,86,'UNA AVENTURA ENTRE SOMBRAS Y RECUERDOS',14,'#F5CE98');
   NovaUI.text(this,89,178,'QUITO',96,'#FFF2DC',{serif:true});
   NovaUI.text(this,95,252,'GUARDIANES DE',33,'#F4CC91',{serif:true});
   NovaUI.text(this,94,315,'LAS LEYENDAS',53,'#FFF1E0',{serif:true});
   NovaUI.line(this,95,356,417,0xE0AC95);
   NovaUI.text(this,95,406,'La ciudad ha olvidado sus historias.\nEnciende su memoria, una leyenda a la vez.',19,'#D8D0DC',{bold:false,lineSpacing:13});
   NovaUI.button(this,326,496,'✦  NUEVA AVENTURA',()=>{NovaData.beginNew();this.scene.start('Intro',{newGame:true});},{w:440,h:48,primary:true});
   if(NovaData.hasSave())NovaUI.button(this,326,558,'▶  CONTINUAR',()=>this.scene.start('CityMap'),{w:440,h:48});
   else{this.add.rectangle(326,558,440,48,0x28243C,.96).setStrokeStyle(1,0x5A536E);NovaUI.text(this,326,558,'▶  CONTINUAR · BLOQUEADO',14,'#857C99',{ox:.5});}
   NovaUI.button(this,326,620,'◈  LIBRO DE LEYENDAS',()=>this.scene.start('LegendBook'),{w:440,h:48,font:16});
   NovaUI.button(this,445,684,'?  AYUDA',()=>this.scene.start('Help'),{w:202,h:40,font:14});
   NovaUI.button(this,207,684,'⚙  OPCIONES',()=>this.scene.start('Settings'),{w:202,h:40,font:14});
   // Tarjeta visual del protagonista y pequeños vestigios del mapa.
   this.add.rectangle(867,363,494,550,0x22203F,.79).setStrokeStyle(1.5,0xB89B9B,.8);
   this.add.rectangle(867,363,468,523,0x322B4D,.34).setStrokeStyle(1,0xF2D298,.3);
   this.add.circle(867,285,155,0xF7CC95,.09);
   this.add.circle(867,285,124,0xF7D69F,.08);
   this.add.circle(867,285,89,0x72DCCA,.09);
   const hero=this.add.image(868,326,'hero-down-0').setScale(4.85).setDepth(5);
   this.tweens.add({targets:hero,y:314,duration:1450,ease:'Sine.easeInOut',yoyo:true,repeat:-1});
   const lamp=this.add.image(966,362,'lantern-on').setScale(1.75).setDepth(6);
   this.tweens.add({targets:lamp,alpha:.64,duration:970,yoyo:true,repeat:-1});
   const stars=[{x:699,y:178},{x:1076,y:211},{x:759,y:492},{x:1036,y:446}];
   stars.forEach(({x,y},i)=>{const c=this.add.star(x,y,5,3,8,0xFFE0A6,.7);this.tweens.add({targets:c,alpha:.25,scale:.6,duration:870+i*150,yoyo:true,repeat:-1});});
   NovaUI.text(this,867,530,'NOVA · GUARDIANA DEL FAROL',18,'#FFE0AA',{ox:.5});
   NovaUI.text(this,867,572,'4 LUGARES    ·    4 FRAGMENTOS',14,'#BEBBD2',{ox:.5});
   NovaUI.text(this,865,617,'DOS TIPOS DE BOMBAS · UN SOLO DESTINO',13,'#8EE1D0',{ox:.5});
   NovaUI.text(this,1160,729,'CREADO CON PHASER 3  ·  QUITO, ECUADOR',12,'#D9C6CF',{ox:1});

 }
}
