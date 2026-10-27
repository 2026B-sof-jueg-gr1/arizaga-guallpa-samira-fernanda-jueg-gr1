class PreloaderScene extends Phaser.Scene {
  constructor() { super('Preloader'); }
  create() {
    this.makeTextures();
    this.scene.start('Menu');
  }
  makeTextures() {
    const t = NOVA.TILE;
    const make = (name, draw) => {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      draw(g);
      g.generateTexture(name, t, t);
      g.destroy();
    };
    make('tile-floor', g => {
      g.fillStyle(0x152941).fillRect(0, 0, t, t);
      g.fillStyle(0x192e47).fillRect(2, 2, t-4, t-4);
      g.lineStyle(1, 0x294763, .75).strokeRect(2, 2, t-4, t-4);
      g.fillStyle(0x41627c, .35).fillCircle(9, 9, 1.5).fillCircle(34, 32, 1.4);
    });
    make('tile-floor-b', g => {
      g.fillStyle(0x12263b).fillRect(0, 0, t, t);
      g.fillStyle(0x193049).fillRect(2, 2, t-4, t-4);
      g.lineStyle(1, 0x294763, .55).strokeRect(2, 2, t-4, t-4);
      g.fillStyle(0x41627c, .35).fillRect(11, 10, 3, 3);
    });
    make('tile-wall', g => {
      g.fillStyle(0x102031).fillRoundedRect(1, 4, 42, 39, 7);
      g.fillStyle(0x335877).fillRoundedRect(1, 0, 42, 37, 7);
      g.fillStyle(0x4e7895).fillRoundedRect(4, 3, 36, 29, 5);
      g.fillStyle(0x273f5c).fillRoundedRect(7, 6, 30, 24, 4);
      g.lineStyle(2, 0x74e9cd, .70).strokeRoundedRect(5, 4, 34, 28, 5);
      g.fillStyle(0x7df4d6, .8).fillRect(9, 9, 4, 4).fillRect(31, 24, 4, 4);
    });
    make('tile-crate', g => {
      g.fillStyle(0x513452).fillRoundedRect(2, 5, 40, 36, 5);
      g.fillStyle(0xa35b78).fillRoundedRect(3, 1, 38, 34, 4);
      g.fillStyle(0xe88c91).fillRoundedRect(5, 3, 34, 28, 3);
      g.lineStyle(3, 0x88465f, 1).lineBetween(9, 8, 35, 29);
      g.lineStyle(3, 0x88465f, 1).lineBetween(35, 8, 9, 29);
      g.fillStyle(0xffd8aa).fillRect(6, 5, 5, 5).fillRect(33, 24, 5, 5);
    });
    make('hero', g => {
      g.fillStyle(0x061727, .28).fillEllipse(22, 39, 28, 8);
      g.fillStyle(0x5b56ba).fillRoundedRect(11, 32, 9, 9, 3).fillRoundedRect(24, 32, 9, 9, 3);
      g.fillStyle(0x35c9a8).fillRoundedRect(7, 12, 30, 24, 11);
      g.fillStyle(0x72f6cd).fillRoundedRect(9, 10, 26, 24, 10);
      g.fillStyle(0x50baa9).fillRoundedRect(2, 19, 8, 15, 4).fillRoundedRect(34, 19, 8, 15, 4);
      g.fillStyle(0xb2a2ff).fillRoundedRect(7, 3, 30, 21, 9);
      g.fillStyle(0x172b52).fillRoundedRect(10, 7, 24, 14, 6);
      g.fillStyle(0x91edff).fillEllipse(18, 12, 9, 4);
      g.fillStyle(0xffd782).fillCircle(35, 15, 3);
    });
    // Animaciones del protagonista: dibujos propios para frente, espalda y perfil.
    // El perfil tiene visor y punta orientados a la derecha; al caminar a la izquierda
    // Phaser lo refleja horizontalmente con setFlipX(true).
    const drawBoots = (g, step) => {
      g.fillStyle(0x29265f);
      g.fillRoundedRect(step ? 10 : 12, step ? 31 : 34, 11, 8, 3);
      g.fillRoundedRect(step ? 25 : 23, step ? 34 : 31, 11, 8, 3);
      g.fillStyle(0x8a83e4);
      g.fillRect(step ? 12 : 14, step ? 37 : 39, 8, 2);
      g.fillRect(step ? 27 : 25, step ? 39 : 37, 8, 2);
    };
    const drawDown = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      drawBoots(g, step);
      g.fillStyle(0x2d977f).fillRoundedRect(8, 16, 28, 21, 9);
      g.fillStyle(0x72f6cd).fillRoundedRect(10, 15, 24, 20, 9);
      g.fillStyle(0x39aa9e).fillRoundedRect(3, step ? 22 : 18, 8, 13, 3);
      g.fillStyle(0x48bdb0).fillRoundedRect(33, step ? 18 : 22, 8, 13, 3);
      g.fillStyle(0xb4a3ff).fillRoundedRect(8, 3, 28, 23, 9);
      g.fillStyle(0x172b52).fillRoundedRect(10, 8, 24, 13, 6);
      g.fillStyle(0x92f1ff).fillEllipse(19, 12, 10, 4);
      g.fillStyle(0xffd782).fillCircle(34, 16, 2.5);
      g.fillStyle(0x3b9e8b).fillRoundedRect(19, 25, 6, 7, 2);
    };
    const drawBack = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      drawBoots(g, step);
      g.fillStyle(0x2d977f).fillRoundedRect(8, 16, 28, 21, 9);
      g.fillStyle(0x6ae4bb).fillRoundedRect(10, 15, 24, 20, 9);
      g.fillStyle(0x349b95).fillRoundedRect(3, step ? 21 : 17, 8, 13, 3);
      g.fillStyle(0x349b95).fillRoundedRect(33, step ? 17 : 21, 8, 13, 3);
      g.fillStyle(0x8278d7).fillRoundedRect(7, 4, 30, 23, 9);
      g.fillStyle(0xb4a3ff).fillRoundedRect(9, 5, 26, 18, 8);
      g.fillStyle(0x6962b6).fillRoundedRect(13, 17, 18, 18, 5);
      g.fillStyle(0x3b457b).fillRoundedRect(16, 19, 12, 13, 3);
      g.fillStyle(0x72f6cd).fillRect(20, 21, 4, 8);
      g.fillStyle(0xffd782).fillCircle(22, 8, 3);
    };
    const drawSide = (g, step) => {
      g.fillStyle(0x061727, .24).fillEllipse(22, 41, 29, 5);
      // Botas a distinta altura y brazos alternados hacen visible cada paso.
      g.fillStyle(0x38316f).fillRoundedRect(step ? 10 : 16, step ? 34 : 31, 12, 8, 3);
      g.fillStyle(0x655fbe).fillRoundedRect(step ? 26 : 20, step ? 31 : 34, 12, 8, 3);
      g.fillStyle(0x9995f9).fillRect(step ? 12 : 18, step ? 39 : 36, 9, 2);
      g.fillStyle(0x7e78de).fillRect(step ? 28 : 22, step ? 36 : 39, 9, 2);
      g.fillStyle(0x259782).fillRoundedRect(9, 16, 26, 20, 9);
      g.fillStyle(0x68e8c4).fillRoundedRect(13, 15, 22, 20, 8);
      g.fillStyle(0x2fada0).fillRoundedRect(step ? 10 : 14, step ? 19 : 24, 9, 13, 4);
      g.fillStyle(0x96f9da).fillRect(step ? 17 : 18, step ? 24 : 28, 3, 4);
      // Cabeza de perfil: protector trasero a la izquierda, visor y nariz a la derecha.
      g.fillStyle(0x766ccd).fillRoundedRect(8, 5, 29, 22, 9);
      g.fillStyle(0xbaabff).fillRoundedRect(11, 3, 25, 23, 9);
      g.fillStyle(0x1a2c50).fillRoundedRect(18, 8, 21, 13, 5);
      g.fillStyle(0x1a2c50).fillTriangle(35, 9, 42, 16, 35, 21);
      g.fillStyle(0x93f5ff).fillRoundedRect(27, 11, 9, 5, 2);
      g.fillStyle(0xd5faff).fillCircle(35, 13, 2);
      g.fillStyle(0xffd782).fillCircle(11, 17, 2.5);
      // Flecha luminosa sobre el torso, apuntando en la dirección de la mirada.
      g.fillStyle(0xffd782).fillTriangle(25, 23, 33, 26, 25, 29);
    };
    for (let step=0; step<2; step++) {
      make(`hero-down-${step}`, g => drawDown(g, step));
      make(`hero-back-${step}`, g => drawBack(g, step));
      make(`hero-side-${step}`, g => drawSide(g, step));
    }
    make('enemy-pink', g => {
      g.fillStyle(0x050e1c, .32).fillEllipse(22, 40, 31, 6);
      g.fillStyle(0xe7557d).fillRoundedRect(5, 10, 34, 29, 11);
      g.fillStyle(0xff829e).fillRoundedRect(7, 7, 30, 27, 11);
      g.fillStyle(0xff829e).fillTriangle(7, 14, 12, 2, 18, 14);
      g.fillStyle(0xff829e).fillTriangle(26, 14, 33, 2, 39, 14);
      g.fillStyle(0xffffff).fillCircle(16, 21, 5).fillCircle(28, 21, 5);
      g.fillStyle(0x15233d).fillCircle(18, 21, 2.5).fillCircle(29, 21, 2.5);
      g.fillStyle(0x91354e).fillRoundedRect(18, 29, 8, 3, 1);
    });
    make('enemy-violet', g => {
      g.fillStyle(0x050e1c, .3).fillEllipse(22, 40, 31, 6);
      g.fillStyle(0x735fd0).fillRoundedRect(5, 10, 34, 29, 11);
      g.fillStyle(0xa38aff).fillRoundedRect(7, 7, 30, 27, 11);
      g.fillStyle(0xa38aff).fillTriangle(7, 14, 12, 2, 18, 14);
      g.fillStyle(0xa38aff).fillTriangle(26, 14, 33, 2, 39, 14);
      g.fillStyle(0xffffff).fillCircle(16, 21, 5).fillCircle(28, 21, 5);
      g.fillStyle(0x15233d).fillCircle(17, 21, 2.5).fillCircle(27, 21, 2.5);
      g.fillStyle(0x5f469a).fillRoundedRect(18, 29, 8, 3, 1);
    });
    make('bomb', g => {
      g.fillStyle(0x091024, .4).fillEllipse(22, 40, 32, 7);
      g.fillStyle(0x090f23).fillCircle(22, 25, 15);
      g.fillStyle(0x263e57).fillCircle(22, 22, 15);
      g.fillStyle(0x122138).fillCircle(22, 25, 13);
      g.fillStyle(0x8cecd6).fillEllipse(16, 18, 9, 5);
      g.fillStyle(0x7b8ca6).fillRoundedRect(19, 5, 8, 9, 2);
      g.lineStyle(3, 0xffd17a).lineBetween(23, 6, 27, 2);
      g.fillStyle(0xffe3a6).fillCircle(29, 4, 3);
    });
    make('flame', g => {
      g.fillStyle(0xff4d6a, .37).fillCircle(22, 22, 22);
      g.fillStyle(0xff9666, .75).fillRoundedRect(5, 6, 34, 32, 11);
      g.fillStyle(0xffd777, .95).fillRoundedRect(10, 11, 24, 22, 8);
      g.fillStyle(0xfff8b2).fillCircle(22, 22, 9);
    });
    make('item-fire', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0xffcf72).fillTriangle(20, 5, 12, 28, 23, 30);
      g.fillStyle(0xff8a68).fillTriangle(26, 11, 16, 34, 32, 30);
      g.fillStyle(0xfff1a6).fillTriangle(23, 19, 19, 31, 26, 29);
    });
    make('item-capacity', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0x15243c).fillCircle(21, 23, 12);
      g.fillStyle(0x86e6d6).fillEllipse(17, 18, 8, 4);
      g.fillStyle(0xffc774).fillRect(20, 7, 5, 7);
      g.lineStyle(2, 0xf2c96b).lineBetween(24, 9, 28, 5);
    });
    make('item-speed', g => {
      g.fillStyle(0x2f405e).fillRoundedRect(5, 5, 34, 34, 8);
      g.fillStyle(0x9d8dff).fillTriangle(25, 8, 14, 24, 24, 24);
      g.fillStyle(0xe0caff).fillTriangle(18, 36, 31, 19, 21, 19);
    });
    make('exit', g => {
      g.fillStyle(0x48e5bd, .2).fillCircle(22, 22, 21);
      g.lineStyle(4, 0x52f4c5, .9).strokeCircle(22, 22, 16);
      g.lineStyle(2, 0xe6fff5, 1).strokeCircle(22, 22, 9);
      g.fillStyle(0xffffff).fillCircle(22, 22, 4);
    });
  }
}
