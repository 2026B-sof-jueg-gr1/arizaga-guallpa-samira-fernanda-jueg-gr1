class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    NovaData.load();
    this.scene.start('Preloader');
  }
}
