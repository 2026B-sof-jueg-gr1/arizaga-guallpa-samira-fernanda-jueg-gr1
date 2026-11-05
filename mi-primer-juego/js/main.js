(() => {
 if (typeof Phaser === 'undefined') { window.QuitoStartup?.fail('Phaser 3 no pudo cargarse.'); return; }
 window.NovaData.load();
 window.QuitoStartup?.progress('Dibujando Quito y preparando las escenas…');
 window.quitoGame=new Phaser.Game({type:Phaser.CANVAS,parent:'game-container',width:NOVA.WIDTH,height:NOVA.HEIGHT,
  backgroundColor:'#15142e',pixelArt:false,antialias:true,render:{roundPixels:true},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:NOVA.WIDTH,height:NOVA.HEIGHT},
  input:{activePointers:5},scene:[BootScene,PreloaderScene,MenuScene,IntroScene,CityMapScene,LegendBookScene,HelpScene,SettingsScene,GameScene,HUDScene,ResultScene,EndingScene]});
})();
