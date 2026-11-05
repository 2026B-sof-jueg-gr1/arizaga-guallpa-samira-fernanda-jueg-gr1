window.NovaUI={
 text(s,x,y,value,size=22,color='#FFF7E9',opts={}){
  return s.add.text(x,y,value,{fontFamily:opts.serif?'Georgia, Cambria, serif':'Trebuchet MS, Arial, sans-serif',fontStyle:opts.bold===false?'normal':'bold',fontSize:size+'px',color,align:opts.align||'left',lineSpacing:opts.lineSpacing||7,
   stroke:opts.stroke||undefined,strokeThickness:opts.stroke?2:0,wordWrap:opts.wrap?{width:opts.wrap}:undefined}).setOrigin(opts.ox??0,opts.oy??.5).setDepth(opts.depth??4);
 },
 button(s,x,y,label,fn,opt={}){
  const w=opt.w||250,h=opt.h||56,primary=Boolean(opt.primary);const base=primary?0xF5C87F:0x25253F,top=primary?0xFFDB99:0x333251;
  const wrap=s.add.container(x,y).setDepth(opt.depth||30);
  const shadow=s.add.rectangle(0,5,w,h,0x040816,.35).setOrigin(.5);
  const back=s.add.rectangle(0,0,w,h,base,1).setStrokeStyle(2,primary?0xFFF0BE:0x83749A,.8);
  const stripe=s.add.rectangle(-w/2+8,0,4,h-17,primary?0xA56C61:0x71DDCA,.8);
  const t=this.text(s,0,0,label,opt.font||17,primary?'#34243B':'#FFF5E9',{ox:.5});wrap.add([shadow,back,stripe,t]);
  back.setInteractive({useHandCursor:true});
  back.on('pointerover',()=>{back.setFillStyle(top);s.tweens.add({targets:wrap,scale:1.03,duration:110});});
  back.on('pointerout',()=>{back.setFillStyle(base);s.tweens.add({targets:wrap,scale:1,duration:110});});
  back.on('pointerdown',()=>{NovaAudio.play('tap');fn();});
  return wrap;
 },
 card(s,x,y,w,h,shade=0x201E39,alpha=.95){const g=s.add.graphics().setDepth(1);g.fillStyle(0x080A19,.26).fillRoundedRect(x+5,y+7,w,h,18);g.fillStyle(shade,alpha).fillRoundedRect(x,y,w,h,18);g.lineStyle(2,0x89708E,.68).strokeRoundedRect(x,y,w,h,18);return g;},
 line(s,x,y,w,color=0xBE9B92){const g=s.add.graphics().setDepth(3);g.lineStyle(1.3,color,.6).lineBetween(x,y,x+w,y);return g;},
 title(s,eyebrow,heading,sub){this.text(s,65,68,eyebrow,14,'#FBD28F');this.text(s,65,133,heading,48,'#FFF7E9',{serif:true});if(sub)this.text(s,67,187,sub,18,'#C9BDD7',{bold:false,wrap:1010});this.line(s,65,223,1072);},
 back(s,fn,label='←  VOLVER'){this.button(s,1023,68,label,fn,{w:245,h:48,font:15});},
 background(s,stage=0){s.cameras.main.setBackgroundColor('#16162F');s.add.image(600,380,'sky-'+stage).setDepth(-20);const veil=s.add.rectangle(600,380,1200,760,0x12112A,.19).setDepth(-17);return veil;},
 tag(s,x,y,value,color='#F6D596'){const t=this.text(s,x+14,y+15,value,13,color);const b=s.add.rectangle(x+Math.max(70,t.width+28)/2,y+15,Math.max(70,t.width+28),31,0x252541,.91).setStrokeStyle(1,0xBBA1AC,.65).setDepth(2);t.setDepth(3);return [b,t];},
 particle(s,x,y,color=0xF5CE95,n=12){for(let i=0;i<n;i++){const a=Math.PI*2*i/n,d=20+Math.random()*55;const dot=s.add.circle(x,y,2.5+Math.random()*3,color,.85).setDepth(60);s.tweens.add({targets:dot,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,scale:0,duration:450+Math.random()*420,ease:'Cubic.easeOut',onComplete:()=>dot.destroy()});}},
 glow(s,x,y,color=0xF5CA7D,r=37){return s.add.circle(x,y,r,color,.13).setBlendMode(Phaser.BlendModes.ADD);}
};
