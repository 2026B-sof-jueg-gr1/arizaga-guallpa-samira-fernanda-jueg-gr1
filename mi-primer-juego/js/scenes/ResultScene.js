class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }
  init(data) { this.outcome=data; }
  create() {
    NovaUI.backdrop(this);
    const {won,level,score,lives,seconds}=this.outcome;
    const allDone=won && level>=NOVA.LEVELS;
    const headline= won ? (allDone ? '¡MISIÓN CUMPLIDA!' : '¡SECTOR DESPEJADO!') : '¡FIN DE LA PARTIDA!';
    const caption=won ? (allDone ? 'Has salvado todos los sectores del universo Nova.' : '¡Buen trabajo! El siguiente laberinto te espera.') : 'Las explosiones ganaron esta vez. ¡Puedes intentarlo otra vez!';
    NovaUI.text(this,600,98,won?'★  RETO SUPERADO  ★':'✹  SIGUE INTENTÁNDOLO  ✹',18,won?'#5df4c8':'#ff929d',{ox:.5});
    NovaUI.text(this,600,174,headline,52,'#f2fbff',{ox:.5});
    NovaUI.text(this,600,237,caption,19,'#98b6ce',{ox:.5,bold:false});
    NovaUI.panel(this,298,288,604,205);
    const timestr=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
    const values=[['PUNTOS',String(score).padStart(6,'0')],['TIEMPO',timestr],['VIDAS',String(lives)]];
    values.forEach((val,i)=>{
      const x=400+i*199;
      NovaUI.text(this,x,335,val[0],15,'#87adc1',{ox:.5});
      NovaUI.text(this,x,390,val[1],30,i===0?'#ffe09e':'#f4f8ff',{ox:.5});
    });
    NovaUI.text(this,600,457,`MEJOR PUNTUACIÓN: ${NovaData.highscore}`,15,'#6be6c0',{ox:.5});
    if(won && !allDone) NovaUI.button(this,600,553,'▶  SIGUIENTE SECTOR',()=>this.scene.start('Game',{level:level+1,score,lives}),{width:390,primary:true,size:20});
    else NovaUI.button(this,600,553,'↻  JUGAR DE NUEVO',()=>this.scene.start('Game',{level:1,score:0,lives:3}),{width:390,primary:true,size:20});
    NovaUI.button(this,600,646,'⌂  MENÚ PRINCIPAL',()=>this.scene.start('Menu'),{width:390,size:19});
    this.input.keyboard.once('keydown-ENTER',()=>{
      if(won&&!allDone) this.scene.start('Game',{level:level+1,score,lives});
      else this.scene.start('Game',{level:1,score:0,lives:3});
    });
  }
}
