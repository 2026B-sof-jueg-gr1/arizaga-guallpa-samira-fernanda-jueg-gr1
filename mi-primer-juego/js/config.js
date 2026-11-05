/* Configuración compartida y avance persistente. */
window.NOVA = Object.freeze({
  WIDTH:1200, HEIGHT:760, TILE:44, COLS:25, ROWS:19, LEVELS:4,
  STORAGE:'quito-guardianes-leyendas-v1',
  C:{ink:'#FFF7E9',muted:'#BEB9D2',gold:'#FFD58D',mint:'#70E1CA',rose:'#F494A5',night:0x16182F},
  STAGES:[
    {name:'Plaza Grande',title:'El canto perdido',legend:'El Gallito de la Catedral',fragment:'ECO',goal:'Enciende los faroles',count:3,kind:'lantern',night:0x9E6488,sky:'#F9BD83',floor:0xB6B69B,wall:0x7A8997,crate:0xA16E5D,accent:0xFFD58D,enemy:2,
      lore:'Cuenta la leyenda que un gallito de la Catedral cobró vida para dar una lección a un personaje fanfarrón. Esta historia pertenece a la tradición oral quiteña.',fiction:'En el juego, sus cantos anuncian sombras y Nova recupera faroles mágicos: esos acontecimientos son inventados.'},
    {name:'San Francisco',title:'La piedra de Cantuña',legend:'Cantuña y la piedra faltante',fragment:'INGENIO',goal:'Coloca las tres piedras',count:3,kind:'stone',night:0x55456E,sky:'#C8816E',floor:0xA89D9B,wall:0x746C83,crate:0xAA6A58,accent:0xFFCE83,enemy:3,
      lore:'Según la leyenda de Cantuña, una piedra quedó sin colocar en la construcción del atrio de San Francisco y fue clave para salvar al protagonista del relato.',fiction:'Las piedras mágicas, pedestales y bombas de memoria son una reinterpretación fantástica para el juego.'},
    {name:'San Diego',title:'El camino de Almeida',legend:'El Padre Almeida',fragment:'VALENTÍA',goal:'Recoge las llaves de luz',count:3,kind:'keys',night:0x252B5C,sky:'#323A73',floor:0x6B7290,wall:0x5C6487,crate:0x765C78,accent:0x80E3DB,enemy:3,
      lore:'La leyenda del Padre Almeida cuenta las salidas nocturnas de un religioso del convento de San Diego y una advertencia que cambiaría su conducta.',fiction:'Los vigilantes de niebla, llaves luminosas y pasadizos mágicos no forman parte del relato tradicional.'},
    {name:'El Panecillo',title:'El corazón de la niebla',legend:'El Panecillo de Quito',fragment:'ESPERANZA',goal:'Libera los núcleos de niebla',count:3,kind:'cores',night:0x191836,sky:'#222347',floor:0x5D6684,wall:0x4A4A71,crate:0x715272,accent:0xF6BC89,enemy:2,
      lore:'El Panecillo es una colina emblemática de Quito, famosa por sus vistas y por la imagen de la Virgen de Quito.',fiction:'La Niebla del Olvido, el combate final y la restauración de recuerdos son una historia original.'}
  ]
});
window.NovaData={
  settings:{sound:true,difficulty:'NORMAL',reducedFlash:false},
  progress:{unlocked:1,completed:[],highscore:0,seenIntro:false},
  load(){try{const d=JSON.parse(localStorage.getItem(NOVA.STORAGE)||'{}');if(d.settings){this.settings={...this.settings,...d.settings};}
    if(d.progress){this.progress={...this.progress,...d.progress};this.progress.completed=Array.isArray(this.progress.completed)?this.progress.completed.filter(n=>n>=1&&n<=4):[];this.progress.unlocked=Phaser.Math.Clamp(Number(this.progress.unlocked)||1,1,4);}
    }catch(e){/* navegador sin almacenamiento */}},
  save(){try{localStorage.setItem(NOVA.STORAGE,JSON.stringify({settings:this.settings,progress:this.progress}));}catch(e){}},
  beginNew(){this.progress={unlocked:1,completed:[],highscore:0,seenIntro:true};this.save();},
  complete(level,score){if(!this.progress.completed.includes(level))this.progress.completed.push(level);this.progress.unlocked=Math.max(this.progress.unlocked,Math.min(4,level+1));this.progress.highscore=Math.max(this.progress.highscore,score);this.save();},
  hasSave(){return this.progress.seenIntro || this.progress.completed.length>0 || this.progress.unlocked>1;}
};
