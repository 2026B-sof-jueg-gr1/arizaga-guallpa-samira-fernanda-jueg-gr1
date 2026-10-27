// Dimensiones y parámetros del mundo. La partida usa una cuadrícula de 25 x 19.
window.NOVA = Object.freeze({
  WIDTH: 1200, HEIGHT: 760, TILE: 44, COLS: 25, ROWS: 19,
  COLORS: { bg: 0x0b1225, panel: 0x101f38, line: 0x27425d,
    cyan: 0x57f2c5, coral: 0xff7489, yellow: 0xffd27a,
    violet: 0x9984ff, white: '#eef8ff', soft: '#90acc5' },
  LEVELS: 3,
  STORAGE: 'bomba-nova-v1'
});
window.NovaData = {
  settings: { sound: true, difficulty: 'NORMAL' },
  highscore: 0,
  load() {
    try {
      const data = JSON.parse(localStorage.getItem(NOVA.STORAGE) || '{}');
      this.settings.sound = data.sound !== false;
      this.settings.difficulty = ['FÁCIL', 'NORMAL', 'DIFÍCIL'].includes(data.difficulty) ? data.difficulty : 'NORMAL';
      this.highscore = Number(data.highscore) || 0;
    } catch (err) { /* El juego funciona aun si el navegador bloquea localStorage. */ }
  },
  save() {
    try { localStorage.setItem(NOVA.STORAGE, JSON.stringify({ ...this.settings, highscore: this.highscore })); } catch (err) {}
  },
  setHighscore(score) {
    if (score > this.highscore) { this.highscore = score; this.save(); }
  }
};
