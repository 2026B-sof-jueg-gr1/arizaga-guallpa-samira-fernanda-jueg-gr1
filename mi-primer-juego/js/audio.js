/* Efectos producidos por WebAudio: no se necesitan sonidos de terceros. */
window.NovaAudio={ctx:null,play(kind='tap'){
 if(!NovaData.settings.sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!this.ctx)this.ctx=new AC();if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
 const sounds={tap:[540,700,.09,'sine',.07],bomb:[320,190,.16,'triangle',.10],blast:[150,48,.36,'sawtooth',.10],memory:[500,1040,.5,'sine',.12],item:[660,960,.21,'sine',.11],hit:[320,95,.34,'triangle',.12],win:[660,1170,.52,'sine',.12],enemy:[250,430,.13,'triangle',.06],unlock:[460,850,.38,'sine',.09],warning:[225,170,.28,'sine',.07]};
 const [f,to,d,wave,vol]=sounds[kind]||sounds.tap;const now=this.ctx.currentTime;const o=this.ctx.createOscillator();const gain=this.ctx.createGain();o.type=wave;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(to,now+d);gain.gain.setValueAtTime(vol,now);gain.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(gain);gain.connect(this.ctx.destination);o.start(now);o.stop(now+d+.025);
 }catch(e){}
 }};
