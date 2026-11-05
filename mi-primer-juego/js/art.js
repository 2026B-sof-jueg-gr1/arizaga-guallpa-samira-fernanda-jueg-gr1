/* Fondos dibujados mediante Canvas 2D y cacheados como texturas Phaser.
   Todos los paisajes e iconos son originales, sin imágenes externas. */
window.NovaArt={
 makeSkies(scene){for(let i=0;i<=4;i++)this.makeSky(scene,i);},
 makeSky(scene,id){const W=1200,H=760;const tex=scene.textures.createCanvas('sky-'+id,W,H);const c=tex.getContext();
 const colors=[['#D08BA6','#EFC18B','#39315E'],['#E5A87F','#F0BD87','#514177'],['#9B6E93','#D49F8A','#34315C'],['#36436D','#656391','#22213E'],['#282447','#51466F','#101525']][id];
 const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,colors[0]);bg.addColorStop(.56,colors[1]);bg.addColorStop(1,colors[2]);c.fillStyle=bg;c.fillRect(0,0,W,H);
 // Luna / sol y aura
 const lx=id===4?925:820, ly=id>=3?144:172, rad=id>=3?54:83;
 const halo=c.createRadialGradient(lx,ly,7,lx,ly,235);halo.addColorStop(0,id>=3?'#F9F0CC77':'#FFF4BB88');halo.addColorStop(1,'#FFFFFF00');c.fillStyle=halo;c.fillRect(lx-235,ly-235,470,470);
 c.fillStyle=id>=3?'#E0D9D5':'#FFE3A4';c.beginPath();c.arc(lx,ly,rad,0,Math.PI*2);c.fill();
 // nube discontinua / neblina suave
 for(let n=0;n<15;n++){const x=(n*191+id*63)%1320-70,y=50+(n*53)%320;c.fillStyle=id>=3?'#8E82B028':'#FEF5D32A';c.beginPath();c.ellipse(x,y,98+(n%5)*15,15+(n%3)*7,.05,0,Math.PI*2);c.fill();}
 // montañas en capas
 for(let layer=0;layer<3;layer++){const y=425+layer*92;const peaks=[[0,y+75],[110,y-17],[225,y+43],[348,y-70],[472,y+51],[606,y-90],[748,y+30],[877,y-38],[992,y+51],[1111,y-51],[1200,y+36]];
 c.fillStyle=[id>=3?'#30304F':'#676887',id>=3?'#292A4B':'#4D526D',id>=3?'#1B2442':'#323D53'][layer];c.beginPath();c.moveTo(0,760);c.lineTo(0,peaks[0][1]);for(const [px,py]of peaks)c.lineTo(px,py+layer*22);c.lineTo(1200,760);c.fill();}
 // ciudad: edificios, tejados, torres, domos y ventanas
 const seed=()=>{let a=0;return()=>{a++;return ((a*89+id*37)%101)/101;};};const r=seed();
 for(let x=-12;x<1240;){let w=38+Math.floor(r()*46),h=90+Math.floor(r()*95),y=625-h;let shade=id>=3?'#252844':'#39445E';c.fillStyle=shade;c.fillRect(x,y,w,h);
 c.fillStyle=id>=3?'#30314D':'#5E5269';c.beginPath();c.moveTo(x-7,y+1);c.lineTo(x+w/2,y-17);c.lineTo(x+w+7,y+1);c.fill();
 for(let px=x+10;px<x+w-6;px+=17){for(let py=y+13;py<y+h-6;py+=27){c.fillStyle=(r()>.58)?'#FBD79A':(id>=3?'#51465D':'#A9958C');c.fillRect(px,py,6,11);}}
 x+=w+7;}
 // catedral y torres en un extremo
 const tower=(x,h)=>{c.fillStyle=id>=3?'#20243D':'#414257';c.fillRect(x,610-h,36,h);c.fillRect(x+7,610-h-34,22,34);c.beginPath();c.moveTo(x-8,610-h-31);c.lineTo(x+18,610-h-74);c.lineTo(x+44,610-h-31);c.fill();c.fillStyle='#F4C77A';c.fillRect(x+14,610-h+22,8,15);};tower(170,175);tower(277,174);
 c.fillStyle=id>=3?'#24273D':'#4E495E';c.fillRect(207,470,74,140);c.beginPath();c.ellipse(245,471,49,49,0,Math.PI,Math.PI*2);c.fill();
 // Panecillo, representación estilizada en la colina
 c.fillStyle=id>=3?'#23263C':'#4D5266';c.beginPath();c.ellipse(982,623,180,75,0,Math.PI,Math.PI*2);c.fill();
 c.fillRect(973,438,20,100);c.beginPath();c.ellipse(982,434,20,24,0,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(982,466);c.lineTo(941,493);c.lineTo(957,502);c.lineTo(982,487);c.lineTo(1012,501);c.lineTo(1025,491);c.fill();
 const grd=c.createLinearGradient(0,550,0,760);grd.addColorStop(0,'#151A3499');grd.addColorStop(1,'#15152BEF');c.fillStyle=grd;c.fillRect(0,560,1200,200);
 // guirnalda de pequeñas luces
 for(let k=0;k<44;k++){let x=15+k*28,y=640+(k%4)*13;let cr=c.createRadialGradient(x,y,0,x,y,13);cr.addColorStop(0,'#FFE6A99C');cr.addColorStop(1,'#FFE6A900');c.fillStyle=cr;c.fillRect(x-13,y-13,26,26);c.fillStyle='#FBE2A9';c.fillRect(x,y,2,3);}
 // punteado de estrellas
 for(let k=0;k<35;k++){const x=(k*157+43)%1150+16,y=(k*71+19)%310+9;c.fillStyle=id>=2?'#F6E7D79C':'#FFF5D35C';c.beginPath();c.arc(x,y,k%5===0?2:1,0,Math.PI*2);c.fill();}
 tex.refresh();
 },
 fog(scene,color=0xC08FDF){let dots=[];for(let i=0;i<9;i++){const x=100+i*137,y=558+(i%3)*48;const p=scene.add.ellipse(x,y,210,52,color,.043).setDepth(-8);scene.tweens.add({targets:p,x:x+40,duration:4600+i*260,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});dots.push(p);}return dots;},
 skylinePanel(scene,x,y,w,h,stage){const clip=scene.add.rectangle(x,y,w,h,0x151930,.3).setStrokeStyle(1.5,0xB28D9F,.9);return clip;}
};
