class LegendBookScene extends Phaser.Scene {
 constructor(){super('LegendBook');}
 create(){NovaUI.background(this,2);NovaUI.title(this,'COLECCIÓN DE RECUERDOS','El libro de leyendas','Completa las misiones para descubrir las cuatro postales de Quito.');NovaUI.back(this,()=>this.scene.start('Menu'));
  this.detail=NovaUI.card(this,442,246,681,419,0x25223D,.96);
  this.detailLabel=NovaUI.text(this,478,287,'POSTAL DE QUITO',14,'#FBD38F');
  this.detailTitle=NovaUI.text(this,478,344,'Selecciona una postal',34,'#FFF4E6',{serif:true,wrap:600});
  this.detailLore=NovaUI.text(this,478,453,'Cada lugar conserva una historia.\nExplora el juego para descubrirlas.',20,'#DDD1E3',{bold:false,wrap:588,lineSpacing:12});
  this.detailFiction=NovaUI.text(this,478,579,'',15,'#9CE4CF',{bold:false,wrap:585});
  NOVA.STAGES.forEach((l,i)=>{const open=NovaData.progress.completed.includes(i+1);const y=277+i*107;
    const plate=this.add.rectangle(247,y,322,90,open?0x38334C:0x211D32).setStrokeStyle(2,open?0xEDC58D:0x574F6A).setInteractive({useHandCursor:true}).setDepth(3);
    const icon=this.add.image(136,y,open?'lantern-on':'portal-closed').setScale(.98).setDepth(4).setAlpha(open?1:.55);
    NovaUI.text(this,165,y-15,`0${i+1}  ${l.name}`,18,open?'#FFF2DE':'#A89EB6');
    NovaUI.text(this,165,y+19,open?'POSTAL DESBLOQUEADA':'POR DESCUBRIR',12,open?'#8BE0CC':'#81778D');
    plate.on('pointerdown',()=>{NovaAudio.play('tap');this.showPostcard(i,open);});
  });
  this.showPostcard(NovaData.progress.completed.length?NovaData.progress.completed[0]-1:0,NovaData.progress.completed.includes(1));
 }
 showPostcard(i,open){const l=NOVA.STAGES[i];this.detailLabel.setText(open?`FRAGMENTO ${l.fragment}  ·  0${i+1}/04`:`POSTAL 0${i+1}/04  ·  BLOQUEADA`);
  this.detailTitle.setText(open?l.legend:'Un recuerdo por descubrir');
  this.detailLore.setText(open?l.lore:'Supera este capítulo para desbloquear su historia y el fragmento de memoria correspondiente.');
  this.detailFiction.setText(open?'EN EL JUEGO (FICCIÓN): '+l.fiction:'✦  Los relatos culturales se separan de las partes inventadas del videojuego.');
 }
}
