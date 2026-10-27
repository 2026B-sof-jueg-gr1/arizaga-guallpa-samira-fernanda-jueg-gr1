window.NovaUI = {
  text(scene, x, y, value, size = 24, color = '#f5f9ff', opts = {}) {
    return scene.add.text(x, y, value, { fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: `${size}px`, color, fontStyle: opts.bold === false ? 'normal' : 'bold',
      align: opts.align || 'left', lineSpacing: opts.lineSpacing || 5,
      wordWrap: opts.wrap ? { width: opts.wrap } : undefined }).setOrigin(opts.ox ?? 0, opts.oy ?? 0.5).setDepth(opts.depth ?? 2);
  },
  button(scene, x, y, label, onClick, options = {}) {
    const w = options.width || 280, h = options.height || 62;
    const active = options.primary === true;
    const base = active ? 0x48dfb5 : 0x182943;
    const hover = active ? 0x85ffdc : 0x274461;
    const textColor = active ? '#082338' : '#f2f9ff';
    const container = scene.add.container(x, y).setDepth(options.depth || 10);
    const shadow = scene.add.rectangle(0, 5, w, h, 0x000000, .28).setOrigin(.5).setStrokeStyle(1, 0x355572, .3);
    const bg = scene.add.rectangle(0, 0, w, h, base, 1).setOrigin(.5).setStrokeStyle(1.5, active ? 0x77f9d5 : 0x355572, 1);
    const caption = this.text(scene, 0, 0, label, options.size || 19, textColor, { ox: .5, oy: .5 });
    container.add([shadow, bg, caption]);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => { bg.setFillStyle(hover); container.setScale(1.035); });
    bg.on('pointerout', () => { bg.setFillStyle(base); container.setScale(1); });
    bg.on('pointerdown', () => { NovaAudio.play('tap'); onClick(); });
    return container;
  },
  header(scene, eyebrow, title, subtitle) {
    this.text(scene, 80, 69, eyebrow, 13, '#58f2c3');
    this.text(scene, 80, 124, title, 44);
    this.text(scene, 82, 178, subtitle, 18, '#8baac6', { bold: false });
    scene.add.rectangle(80, 218, 1040, 2, 0x29445d).setOrigin(0);
  },
  backdrop(scene) {
    scene.cameras.main.setBackgroundColor('#0b1225');
    const g = scene.add.graphics().setDepth(0);
    g.fillStyle(0x0b1225).fillRect(0, 0, NOVA.WIDTH, NOVA.HEIGHT);
    for (let x=0; x<NOVA.WIDTH; x+=44) { g.lineStyle(1, 0x1b3654, .22); g.lineBetween(x, 0, x, NOVA.HEIGHT); }
    for (let y=0; y<NOVA.HEIGHT; y+=44) { g.lineStyle(1, 0x1b3654, .22); g.lineBetween(0, y, NOVA.WIDTH, y); }
    g.fillStyle(0x335e75, .22).fillCircle(1050, 100, 260);
    g.fillStyle(0x3c356e, .17).fillCircle(70, 710, 280);
    g.lineStyle(2, 0x4df1c5, .25).strokeRect(16, 16, 1168, 728);
    this.text(scene, 1140, 726, 'NOVA // 2026', 12, '#536f8c', { ox: 1 });
  },
  panel(scene, x, y, w, h, color = 0x13233c) {
    const g = scene.add.graphics().setDepth(1);
    g.fillStyle(color, .96).fillRoundedRect(x, y, w, h, 17);
    g.lineStyle(1.5, 0x355470, .9).strokeRoundedRect(x, y, w, h, 17);
    return g;
  }
};
