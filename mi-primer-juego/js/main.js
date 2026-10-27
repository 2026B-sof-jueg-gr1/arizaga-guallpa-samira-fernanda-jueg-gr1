(() => {
  if(typeof Phaser === 'undefined') {
    document.querySelector('#game-container').textContent = 'No se pudo cargar Phaser 3. Comprueba tu conexión a Internet.';
    return;
  }
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    width: NOVA.WIDTH, height: NOVA.HEIGHT,
    backgroundColor: '#0b1225',
    pixelArt: false,
    antialias: true,
    render: { roundPixels: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH,
      width: NOVA.WIDTH, height: NOVA.HEIGHT },
    physics: { default: 'arcade', arcade: { debug: false } },
    input: { activePointers: 3 },
    scene: [BootScene, PreloaderScene, MenuScene, HelpScene, SettingsScene, GameScene, HUDScene, ResultScene]
  });
})();
