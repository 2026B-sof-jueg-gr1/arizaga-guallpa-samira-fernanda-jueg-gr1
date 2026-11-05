const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const context = { window: {}, Math };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/art.js'), 'utf8'), context);
let backgrounds = 0;
const gradient = { addColorStop() {} };
const canvas = new Proxy({}, {
  get(_target, key) {
    if (key === 'ellipse') return (...args) => {
      assert(args.length >= 7, 'Canvas ellipse necesita siete argumentos');
      assert(args.every(Number.isFinite), 'Coordenadas de ellipse inválidas');
    };
    if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => gradient;
    return () => {};
  }
});
context.window.NovaArt.makeSkies({ textures: { createCanvas() {
  backgrounds++;
  return { getContext: () => canvas, refresh() {} };
} } });
assert.equal(backgrounds, 5);
console.log('✓ Los cinco fondos usan llamadas Canvas válidas');
