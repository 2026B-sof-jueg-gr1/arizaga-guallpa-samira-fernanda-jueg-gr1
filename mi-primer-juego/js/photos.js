/* Fotografías documentales de Quito, con atribución en docs/CREDITOS_FOTOGRAFIAS.md.
   Se obtienen en segundo plano desde Wikimedia Commons para no bloquear Phaser.
   Si no hay conexión a imágenes, el juego continúa mostrando una ilustración. */
window.NovaPhotos = (() => {
  const photos = [
    {
      title: 'Plaza Grande', author: 'Ángel M. Felicísimo', license: 'CC BY-SA 4.0',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Plaza_Grande_-_Quito.jpg/960px-Plaza_Grande_-_Quito.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:Plaza_Grande_-_Quito.jpg'
    },
    {
      title: 'Iglesia de San Francisco', author: 'Kmiv26', license: 'CC BY-SA 4.0',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Iglesia_de_San_Francisco_de_Quito_desde_la_plaza.jpg/640px-Iglesia_de_San_Francisco_de_Quito_desde_la_plaza.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Francisco_de_Quito_desde_la_plaza.jpg'
    },
    {
      title: 'Convento de San Diego', author: 'Bernard Gagnon', license: 'CC BY-SA 3.0',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Convento_de_San_Diego%2C_Quito.jpg/640px-Convento_de_San_Diego%2C_Quito.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:Convento_de_San_Diego,_Quito.jpg'
    },
    {
      title: 'El Panecillo', author: 'MartínGonzález 2396', license: 'CC BY-SA 4.0',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/El_Panecillo.JPG/500px-El_Panecillo.JPG',
      source: 'https://commons.wikimedia.org/wiki/File:El_Panecillo.JPG'
    }
  ];
  const loaded = new Map();
  function fetchPhoto(index) {
    if (loaded.has(index)) return loaded.get(index);
    const item = photos[index];
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se descargó la fotografía de ' + item.title));
      img.src = item.url;
    });
    // Si un intento falla, las siguientes pantallas pueden probar otra vez.
    loaded.set(index, promise);
    promise.catch(() => { if (loaded.get(index) === promise) loaded.delete(index); });
    return promise;
  }
  function thumbnail(scene, image, key, width, height) {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    const quality = 2;
    canvas.width = Math.round(width * quality);
    canvas.height = Math.round(height * quality);
    const ctx = canvas.getContext('2d');
    const targetRatio = width / height;
    const srcRatio = image.naturalWidth / image.naturalHeight;
    let sx=0, sy=0, sw=image.naturalWidth, sh=image.naturalHeight;
    if (srcRatio > targetRatio) {
      sw = sh * targetRatio;
      sx = (image.naturalWidth - sw) / 2;
    } else {
      sh = sw / targetRatio;
      sy = (image.naturalHeight - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    scene.textures.addCanvas(key, canvas);
  }
  function place(scene, level, x, y, width, height, container=null, opts={}) {
    const i = level - 1;
    const item = photos[i];
    const depth = opts.depth || 13;
    const backdrop = scene.add.rectangle(x, y, width + 9, height + 9, 0x16152F)
      .setStrokeStyle(2, 0xF0C894, .92).setDepth(depth);
    const placeholderKey = ['landmark-plaza','landmark-san-francisco','landmark-san-diego','landmark-panecillo'][i];
    const photo = scene.add.image(x, y, placeholderKey).setDisplaySize(width, height).setDepth(depth + 1);
    const ribbon = scene.add.rectangle(x, y + height/2 - 12, width, 24, 0x17152E, .88).setDepth(depth + 2);
    const label = scene.add.text(x, y + height/2 - 12, `✦  ${item.title.toUpperCase()}`, {
      fontFamily: 'Arial, sans-serif', fontSize: opts.small ? '11px' : '12px',
      color: '#FFF4D9', fontStyle: 'bold', align:'center'
    }).setOrigin(.5).setDepth(depth + 3);
    const status = scene.add.text(x - width / 2 + 6, y - height / 2 + 6, 'CARGANDO FOTO…', {
      fontFamily:'Arial, sans-serif',fontSize:opts.small?'9px':'10px',color:'#FFF9E9',backgroundColor:'#17152E'
    }).setDepth(depth + 4);
    const objects = [backdrop, photo, ribbon, label, status];
    if (container) container.add(objects);
    const texKey = `quito-foto-real-${level}-${Math.round(width)}x${Math.round(height)}`;
    const setPhoto = () => {
      if (!photo.active || (scene.sys && !scene.sys.isActive())) return;
      photo.setTexture(texKey).setDisplaySize(width,height);
      status.setText('FOTO REAL  ·  VER CRÉDITOS ↗');
    };
    if (scene.textures.exists(texKey)) setPhoto();
    else fetchPhoto(i).then(img => {
      if (!photo.active || (scene.sys && !scene.sys.isActive())) return;
      try { thumbnail(scene, img, texKey, width, height); setPhoto(); }
      catch (error) { console.warn('[Fotos de Quito] No se pudo preparar la fotografía:', error); }
    }).catch(error => {
      if(status.active)status.setText('ILUSTRACIÓN DE RESPALDO');
      console.warn('[Fotos de Quito] Se utiliza la ilustración de respaldo:', error.message);
    });
    // Abre la ficha de autor y licencia; no altera la partida.
    backdrop.setInteractive({useHandCursor:true});
    backdrop.on('pointerdown', () => { window.open(item.source,'_blank','noopener,noreferrer'); });
    return objects;
  }
  return {photos, place};
})();
