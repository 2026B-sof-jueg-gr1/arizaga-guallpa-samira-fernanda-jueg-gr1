class CityMapScene extends Phaser.Scene {
 constructor(){super('CityMap');}
 init(d){this.selected=Phaser.Math.Clamp(d?.selected||NovaData.progress.unlocked,1,4);}
 create(){NovaUI.background(this,1);NovaArt.fog(this);NovaUI.title(this,'CAPÍTULOS DE LA AVENTURA','El mapa de los recuerdos','Selecciona un lugar desbloqueado. Cada recuerdo recuperado ilumina un tramo de Quito.');NovaUI.back(this,()=>this.scene.start('Menu'));
  const path=this.add.graphics().setDepth(2);const points=[[166,340],[441,350],[711,350],[985,340]];
  path.lineStyle(13,0x17172D,.66);path.beginPath();path.moveTo(166,340);path.lineTo(985,340);path.strokePath();
  path.lineStyle(4,0xF8CD8E,.87);path.beginPath();path.moveTo(166,340);path.lineTo(166+((NovaData.progress.unlocked-1)/3)*819,340);path.strokePath();
  this.cards=[];NOVA.STAGES.forEach((l,i)=>this.stageCard(i,l,points[i][0],335));
  this.focus=NovaUI.card(this,83,509,1033,177,0x221E3A,.96);
  this.focusTag=NovaUI.text(this,115,547,'',14,'#F9D092');this.focusName=NovaUI.text(this,115,586,'',30,'#FFF5E4',{serif:true});
  this.focusDesc=NovaUI.text(this,115,625,'',17,'#D8CDDC',{bold:false,wrap:680});
  this.enter=NovaUI.button(this,971,615,'INICIAR NIVEL →',()=>this.scene.start('Game',{level:this.selected}),{w:233,h:55,primary:true,font:16});
  this.refresh();
 }
 stageCard(i,l,x,y){const level=i+1,open=level<=NovaData.progress.unlocked,completed=NovaData.progress.completed.includes(level);
  const card=this.add.container(x,y).setDepth(8);
  const bg=this.add.rectangle(0,0,244,237,open?0x302A47:0x17172B,.96).setStrokeStyle(2,open?0xC9A488:0x5A5668,1);
  const accent=this.add.rectangle(0,-114,240,8,l.accent).setDepth(1);
  const panel=this.add.rectangle(0,-34,206,106,l.night,.7);
  const circle=this.add.circle(0,-31,46,completed?0x70DBC7:open?0xF6CA86:0x6F6D89,.22).setStrokeStyle(2,completed?0x70DBC7:0xF6CA86,.75);
  const icon=this.add.image(0,-33,completed?'lantern-on':open?'memory-bomb':'portal-closed').setScale(1.42).setAlpha(open?1:.55);
  const num=NovaUI.text(this,-99,-99,`CAPÍTULO 0${level}`,12,'#F4D398');const title=NovaUI.text(this,0,57,l.name,21,open?'#FFF4E5':'#9992AC',{ox:.5});
  const sub=NovaUI.text(this,0,87,completed?'✦ RESTAURADO':open?'DISPONIBLE':'🔒 BLOQUEADO',13,completed?'#8EE5CE':'#C1ABC1',{ox:.5});
  card.add([bg,accent,panel,circle,icon,num,title,sub]);this.cards.push({card,bg,open,level});
  if(open){bg.setInteractive({useHandCursor:true});bg.on('pointerdown',()=>{NovaAudio.play('tap');this.selected=level;this.refresh();});}
 }
 refresh(){this.cards.forEach(c=>{c.card.setScale(c.level===this.selected?1.035:1);c.bg.setStrokeStyle(c.level===this.selected?3:2,c.level===this.selected?0xFFE4AE:c.open?0xBE978C:0x5A5668);});
  const l=NOVA.STAGES[this.selected-1];this.focusTag.setText(`0${this.selected} / 04     ·     ${l.fragment}     ·     ${l.legend.toUpperCase()}`);
  this.focusName.setText(`${l.name} — ${l.title}`);this.focusDesc.setText(`Misión: ${l.goal.toLowerCase()}.  Un fragmento de memoria te espera.`);
  this.enter.setVisible(this.selected<=NovaData.progress.unlocked);
 }
}
