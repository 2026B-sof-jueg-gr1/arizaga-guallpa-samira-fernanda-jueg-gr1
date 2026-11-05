class HelpScene extends Phaser.Scene {
 constructor(){super('Help');}
 create(){NovaUI.background(this,3);NovaUI.title(this,'MANUAL DEL GUARDIÁN','Cómo jugar','Dos bombas, cuatro leyendas y una misión: devolverle la luz a Quito.');NovaUI.back(this,()=>this.scene.start('Menu'));
  NovaUI.card(this,65,258,1068,418,0x25223E,.96);
  const rows=[['WASD o FLECHAS','Mover a Nova por el laberinto. Su mirada cambia según la dirección.'],['ESPACIO · BOMBA NORMAL','Rompe cajas y ahuyenta sombras. ¡Aléjate antes de la explosión!'],['E · BOMBA DE MEMORIA','Acércate hasta 2 casillas, pulsa E. La luz se recarga sola en 10 segundos.'],['SHIFT · COMODÍN','Usa un poncho protector, viento o un reloj ancestral, si tienes uno.'],['ESC · PAUSA','Descansa, repite el nivel o vuelve al mapa sin perder tus postales.']];
  rows.forEach((r,i)=>{const yy=305+i*70;NovaUI.text(this,98,yy,r[0],19,'#F9D295');NovaUI.text(this,432,yy,r[1],17,'#E3D9E2',{bold:false,wrap:640});if(i<4)NovaUI.line(this,100,yy+33,985,0x725B7C);});
  NovaUI.text(this,600,716,'CONSEJO: NO NECESITAS DERROTAR A TODOS LOS ENEMIGOS PARA AVANZAR.',15,'#A5E9D4',{ox:.5});
 }
}
