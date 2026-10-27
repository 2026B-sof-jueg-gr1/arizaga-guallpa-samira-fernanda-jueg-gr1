class HelpScene extends Phaser.Scene {
  constructor() { super('Help'); }
  create() {
    NovaUI.backdrop(this);
    NovaUI.header(this, 'MANUAL DE SUPERVIVENCIA // 01', 'CÓMO JUGAR', 'Haz estallar los obstáculos, elimina enemigos y alcanza el portal de salida.');
    const sections = [
      {x:76,y:258,w:505,h:162, num:'01', title:'MUÉVETE', desc:'Usa las FLECHAS o W · A · S · D para recorrer\nel laberinto. También hay controles táctiles.', icon:'↕'},
      {x:617,y:258,w:505,h:162, num:'02', title:'COLOCA BOMBAS', desc:'Pulsa ESPACIO para dejar una bomba. Huye\nantes de que explote en forma de cruz.', icon:'✹'},
      {x:76,y:444,w:505,h:162, num:'03', title:'CONSIGUE MEJORAS', desc:'Al destruir cajas puedes encontrar mayor\nalcance, más bombas o velocidad extra.', icon:'★'},
      {x:617,y:444,w:505,h:162, num:'04', title:'LLEGA AL PORTAL', desc:'Derrota a los enemigos y descubre el portal\nque se oculta bajo una caja especial.', icon:'◎'}
    ];
    sections.forEach(s => {
      NovaUI.panel(this, s.x,s.y,s.w,s.h);
      NovaUI.text(this,s.x+27,s.y+36,s.num,17,'#68e8c9');
      NovaUI.text(this,s.x+s.w-40,s.y+36,s.icon,28,'#ffbe8c',{ox:.5});
      NovaUI.text(this,s.x+28,s.y+70,s.title,23);
      NovaUI.text(this,s.x+28,s.y+120,s.desc,16,'#a4bdd4',{bold:false});
    });
    NovaUI.text(this, 80, 652, 'CONSEJO: ¡Tus propias explosiones también pueden dañarte!', 16, '#ffd083');
    NovaUI.button(this, 1030, 688, '← VOLVER', () => this.scene.start('Menu'), { width:185,height:55,size:18 });
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
  }
}
