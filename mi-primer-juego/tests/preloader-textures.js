/* Detecta llamadas a métodos de Graphics inexistentes antes de que fallen
   en el navegador. Prueba de generación de texturas (sin render real). */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const project = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(project, 'js/scenes/PreloaderScene.js'), 'utf8');
const context = {
  console,
  window: {},
  Phaser: {Scene: class{}},
  NOVA: {
    TILE:44,
    STAGES: [
      {floor:0xB6B69B,wall:0x7A8997,crate:0xA16E5D},
      {floor:0xA89D9B,wall:0x746C83,crate:0xAA6A58},
      {floor:0x6B7290,wall:0x5C6487,crate:0x765C78},
      {floor:0x5D6684,wall:0x4A4A71,crate:0x715272},
    ]
  }
};
vm.createContext(context);
vm.runInContext(code, context, {filename:'PreloaderScene.js'});
vm.runInContext('globalThis.TestPreloader = PreloaderScene;', context);
const names = [];
// Whitelist de métodos de Graphics 3; cualquier otro método fallará.
const graphicMethods = new Set(['fillStyle','fillRect','fillRoundedRect','strokeRoundedRect',
 'fillCircle','strokeCircle','fillEllipse','strokeEllipse','fillTriangle','lineStyle',
 'lineBetween','strokeRect','generateTexture','destroy','beginPath','arc','strokePath']);
function graphics(){
 let obj;
 obj = new Proxy({}, {
  get(_t,name){
   if (!graphicMethods.has(name)) throw new Error('Graphics no permite el método: '+String(name));
   if (name === 'generateTexture') return (key,w,h)=>{if(!key||w<1||h<1)throw Error('Textura inválida: '+key); names.push(key);return obj;};
   return ()=>obj;
  }
 });
 return obj;
}
const scene = new context.TestPreloader();
scene.add={graphics};
scene.makeTextures();
for(const texture of ['hero-down-0','hero-side-0','landmark-plaza','landmark-san-francisco',
 'landmark-san-diego','landmark-panecillo','bomb','memory-bomb','portal-closed','exit']){
 if(!names.includes(texture))throw Error('No se generó: '+texture);
}
console.log(`✓ ${names.length} texturas se generan con métodos Graphics compatibles`);
