/* Inicio fiable de Quito: Guardianes de las Leyendas.
   Si un CDN o una escena falla, mostramos el error en vez de dejar el lienzo vacío. */
(() => {
  'use strict';
  const el = document.querySelector('#loading-note');
  const heading = document.querySelector('#startup-heading');
  const detail = document.querySelector('#startup-detail');
  const retry = document.querySelector('#retry-startup');
  let ready = false;
  let failed = false;

  if (retry) retry.addEventListener('click', () => window.location.reload());
  const friendlyError = (error) => {
    if (!error) return 'Error desconocido';
    return (error.message || String(error)).slice(0, 550);
  };
  window.QuitoStartup = {
    progress(message) {
      if (ready || failed) return;
      if (detail) detail.textContent = message;
    },
    success() {
      if (failed || ready) return;
      ready = true;
      if (el) el.remove();
    },
    fail(message, error) {
      if (ready || failed) return;
      failed = true;
      if (el) el.classList.add('failed');
      if (heading) heading.textContent = 'No se pudo iniciar la aventura';
      if (detail) detail.textContent = message + (error ? '\n' + friendlyError(error) : '') + '\nPuedes pulsar F12 → Consola para ver el error técnico.';
      if (retry) retry.hidden = false;
      console.error('[Quito Guardianes]', message, error || '');
    },
    get ready() { return ready; }
  };
  // Captura errores en scripts y promesas de Phaser para que no queden ocultos.
  window.addEventListener('error', (event) => {
    const msg = event.message || 'Error de JavaScript';
    if (!ready) window.QuitoStartup.fail('Ocurrió un error al preparar el juego.', event.error || msg);
    else console.error('[Quito] Error durante la partida:', msg);
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (!ready) window.QuitoStartup.fail('Ocurrió un error mientras se iniciaba Phaser.', event.reason);
    else console.error('[Quito] Promesa rechazada:', event.reason);
  });

  function loadScript(source, timeout = 12000) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let finished = false;
      const t = setTimeout(() => finish(new Error('Tiempo agotado: ' + source)), timeout);
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(t);
        script.onload = script.onerror = null;
        if (error) { script.remove(); reject(error); }
        else resolve();
      }
      // Cambiar la revisión invalida también las escenas cargadas dinámicamente.
      script.src = source.startsWith('https://') ? source : source + '?v=20261105-menu2';
      script.async = false;
      script.onload = () => finish();
      script.onerror = () => finish(new Error('No se pudo descargar ' + source));
      document.head.appendChild(script);
    });
  }

  const files = [
    'js/config.js', 'js/audio.js', 'js/ui.js', 'js/art.js', 'js/photos.js',
    'js/scenes/BootScene.js', 'js/scenes/PreloaderScene.js',
    'js/scenes/MenuScene.js', 'js/scenes/IntroScene.js',
    'js/scenes/CityMapScene.js', 'js/scenes/LegendBookScene.js',
    'js/scenes/HelpScene.js', 'js/scenes/SettingsScene.js',
    'js/scenes/GameScene.js', 'js/scenes/HUDScene.js',
    'js/scenes/ResultScene.js', 'js/scenes/EndingScene.js'
  ];

  function verifyFirstFrame() {
    // La escena puede crearse sin lanzar errores y aun así dejar un lienzo vacío.
    // Verificamos algunos píxeles para detectar exactamente ese caso.
    setTimeout(() => {
      if (failed || ready) return;
      const canvas = document.querySelector('#game-container canvas');
      if (!canvas) {
        window.QuitoStartup.fail('Phaser no creó el lienzo del juego.');
        return;
      }
      try {
        const context = canvas.getContext('2d');
        if (context) {
          const locations = [[100, 100], [450, 300], [780, 190], [1020, 580], [600, 650]];
          const colors = locations.map(([x,y]) => {
            const pixel = context.getImageData(x, y, 1, 1).data;
            return [pixel[0], pixel[1], pixel[2]].join(',');
          });
          if (new Set(colors).size < 2) {
            window.QuitoStartup.fail('El motor creó el lienzo, pero la imagen sigue vacía. Abre F12 → Consola para ver el error.');
            return;
          }
        }
      } catch (error) {
        console.warn('[Quito] La verificación de imagen no se pudo realizar:', error);
      }
      window.QuitoStartup.success();
    }, 950);
  }

  function observeScenes() {
    const scenes = [
      ['Boot', BootScene], ['Preloader', PreloaderScene], ['Menu', MenuScene],
      ['Intro', IntroScene], ['CityMap', CityMapScene], ['LegendBook', LegendBookScene],
      ['Help', HelpScene], ['Settings', SettingsScene], ['Game', GameScene],
      ['HUD', HUDScene], ['Result', ResultScene], ['Ending', EndingScene]
    ];
    scenes.forEach(([key, SceneClass]) => {
      const original = SceneClass.prototype.create;
      if (!original) return;
      SceneClass.prototype.create = function (...args) {
        try {
          const out = original.apply(this, args);
          if (key === 'Menu') verifyFirstFrame();
          return out;
        } catch (error) {
          const message = 'Falló la escena «' + key + '». ';
          window.QuitoStartup.fail(message, error);
          // El mensaje permanece visible y no se elimina al crear el canvas.
          console.error(message, error);
          throw error;
        }
      };
    });
  }

  async function start() {
    try {
      window.QuitoStartup.progress('Cargando Phaser 3…');
      const providers = [
        'assets/phaser.min.js',
        'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.90.0/phaser.min.js',
        'https://unpkg.com/phaser@3.90.0/dist/phaser.min.js'
      ];
      let phaserLoaded = typeof window.Phaser !== 'undefined';
      for (let i=0; i<providers.length && !phaserLoaded; i++) {
        try {
          window.QuitoStartup.progress('Cargando el motor del juego… (' + (i+1) + '/' + providers.length + ')');
          await loadScript(providers[i], 12000);
          phaserLoaded = typeof window.Phaser !== 'undefined';
        } catch (error) { console.warn('[Quito] Proveedor no disponible:', error.message); }
      }
      if (!phaserLoaded) throw new Error('Los servidores de Phaser no respondieron. Revisa tu conexión a Internet.');
      for (let i=0; i<files.length; i++) {
        window.QuitoStartup.progress('Preparando el juego… ' + (i+1) + ' / ' + files.length);
        await loadScript(files[i], 7500);
      }
      observeScenes();
      window.QuitoStartup.progress('Encendiendo los faroles del Centro Histórico…');
      await loadScript('js/main.js', 7500);
      // Si el lienzo se creó pero la escena nunca empezó, indicamos dónde revisar.
      setTimeout(() => {
        if (!window.QuitoStartup.ready) window.QuitoStartup.fail('El motor se cargó, pero el menú no llegó a dibujarse. Revisa el detalle en la consola.');
      }, 10000);
    } catch (error) {
      window.QuitoStartup.fail('No se pudo cargar un recurso necesario.', error);
    }
  }
  start();
})();
