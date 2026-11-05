class SettingsScene extends Phaser.Scene {
 constructor(){super('Settings');}
 create(){NovaUI.background(this,2);NovaUI.title(this,'PERSONALIZA TU EXPERIENCIA','Opciones','Puedes cambiar la dificultad y el brillo de las explosiones cuando quieras.');NovaUI.back(this,()=>this.scene.start('Menu'));
  NovaUI.card(this,175,259,850,404,0x25223E,.96);
  const row=(y,title,desc)=>{NovaUI.text(this,212,y,title,21,'#FBE0B1');NovaUI.text(this,214,y+35,desc,16,'#C6BFD2',{bold:false});};
  row(318,'SONIDO','Pequeños efectos creados directamente con WebAudio.');
  this.sound=NovaUI.button(this,856,334,NovaData.settings.sound?'ACTIVADO':'DESACTIVADO',()=>{NovaData.settings.sound=!NovaData.settings.sound;NovaData.save();this.soundText.setText(NovaData.settings.sound?'ACTIVADO':'DESACTIVADO');},{w:218,h:50});this.soundText=this.sound.list[this.sound.list.length-1];
  NovaUI.line(this,212,391,774);
  row(425,'DIFICULTAD','En FÁCIL las sombras se mueven un poco más lento.');
  this.diffs=['FÁCIL','NORMAL','DIFÍCIL'];this.diffButtons=[];
  this.diffs.forEach((d,i)=>{const b=NovaUI.button(this,663+i*124,456,d,()=>{NovaData.settings.difficulty=d;NovaData.save();this.updateDifficulty();},{w:113,h:48,font:13});this.diffButtons.push(b);});this.updateDifficulty();
  NovaUI.line(this,212,515,774);
  row(544,'DESTELLOS','Reduce los flashes brillantes de las explosiones.');
  this.flash=NovaUI.button(this,858,567,NovaData.settings.reducedFlash?'REDUCIDOS':'NORMALES',()=>{NovaData.settings.reducedFlash=!NovaData.settings.reducedFlash;NovaData.save();this.flash.list[this.flash.list.length-1].setText(NovaData.settings.reducedFlash?'REDUCIDOS':'NORMALES');},{w:217,h:46,font:14});
 }
 updateDifficulty(){this.diffButtons.forEach((b,i)=>b.list[1].setStrokeStyle(this.diffs[i]===NovaData.settings.difficulty?3:1,this.diffs[i]===NovaData.settings.difficulty?0xFFE5AA:0x826C91));}
}
