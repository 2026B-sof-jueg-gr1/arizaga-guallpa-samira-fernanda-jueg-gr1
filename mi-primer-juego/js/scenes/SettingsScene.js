class SettingsScene extends Phaser.Scene {
  constructor() { super('Settings'); }
  create() {
    NovaUI.backdrop(this);
    NovaUI.header(this, 'CENTRO DE CONTROL // 02', 'OPCIONES', 'Configura tu experiencia y vuelve a la aventura.');
    NovaUI.panel(this, 238, 260, 724, 328);
    NovaUI.text(this, 278, 314, 'EFECTOS DE SONIDO', 21, '#ecf8ff');
    this.soundButton = NovaUI.button(this, 786, 315, '', () => {
      NovaData.settings.sound = !NovaData.settings.sound;
      NovaData.save(); this.refresh();
    }, {width:246,height:56,size:17});
    this.add.rectangle(280, 369, 636, 1, 0x2b4660);
    NovaUI.text(this, 278, 415, 'DIFICULTAD', 21, '#ecf8ff');
    this.levelButton = NovaUI.button(this, 786, 416, '', () => {
      const options=['FÁCIL','NORMAL','DIFÍCIL'];
      NovaData.settings.difficulty = options[(options.indexOf(NovaData.settings.difficulty)+1)%options.length];
      NovaData.save(); this.refresh();
    }, {width:246,height:56,size:17});
    NovaUI.text(this, 280, 500, 'FÁCIL: enemigos lentos · DIFÍCIL: enemigos más rápidos', 16, '#87a6bf',{bold:false});
    NovaUI.button(this, 600, 664, '← GUARDAR Y VOLVER', () => this.scene.start('Menu'), { width:342, primary:true, size:19 });
    this.refresh();
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
  }
  refresh() {
    this.soundButton.list.find(o => o.type === 'Text').setText(NovaData.settings.sound ? '♫ ACTIVADO' : '♫ DESACTIVADO');
    this.levelButton.list.find(o => o.type === 'Text').setText(`◈ ${NovaData.settings.difficulty}`);
  }
}
