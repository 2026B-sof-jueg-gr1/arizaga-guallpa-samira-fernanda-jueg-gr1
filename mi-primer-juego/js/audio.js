// Efectos sonoros sintéticos: no se necesitan archivos externos.
window.NovaAudio = {
  context: null,
  play(kind = 'tap') {
    if (!NovaData.settings.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.context) this.context = new AudioContext();
      if (this.context.state === 'suspended') this.context.resume().catch(() => {});
      const ctx = this.context;
      const configs = {
        tap: [460, 650, .075, 'sine', .055],
        bomb: [260, 140, .16, 'triangle', .10],
        blast: [135, 45, .34, 'sawtooth', .10],
        item: [520, 920, .22, 'sine', .075],
        hit: [370, 100, .38, 'sawtooth', .12],
        win: [560, 920, .42, 'sine', .09],
        enemy: [230, 370, .10, 'triangle', .06]
      };
      const [from, to, duration, wave, volume] = configs[kind] || configs.tap;
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = wave;
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(to, now + duration);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + duration + .01);
    } catch (err) { /* El audio nunca debe interrumpir la partida. */ }
  }
};
