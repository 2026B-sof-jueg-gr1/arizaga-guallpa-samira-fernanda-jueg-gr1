## Corrección de inicio — 5 de noviembre de 2026

Se corrigió el fallo `g.lineStyle(...).strokeArc is not a function` de la escena **Preloader**. Phaser 3 no tiene ese método en `Graphics`: los arcos decorativos del Convento de San Diego ahora usan `lineBetween()`. Se agregó la prueba `tests/preloader-textures.js` para comprobar la creación de las texturas antes de abrir el juego.

**Para instalar esta revisión:** descomprime esta carpeta nueva, ábrela en VS Code, inicia `index.html` con Live Server y recarga con `Ctrl + F5`. Evita mezclar archivos de versiones anteriores.

**Pruebas automáticas:** `node tests/preloader-textures.js` y `node tests/smoke.js`. Se revisó la sintaxis de los JavaScript. La ejecución gráfica completa debe verificarse en el navegador con acceso al CDN de Phaser.

---

# QUITO: Guardianes de las Leyendas

**Videojuego 2D original con Phaser 3**, desarrollado a partir de Bomba Nova. Recorre cuatro lugares emblemáticos de Quito y recupera sus recuerdos usando dos tipos de bombas.

## Iniciar el juego en Visual Studio Code

1. Descomprime `Quito_Guardianes_Leyendas_Phaser3.zip`.
2. Abre la carpeta `Quito_Guardianes_Leyendas_Phaser3` en **VS Code** (`Archivo → Abrir carpeta`).
3. Instala la extensión **Live Server** si todavía no la tienes.
4. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
5. El juego aparecerá en el navegador. **Necesita Internet al cargar**, ya que Phaser 3 se obtiene mediante CDN; los dibujos del juego se generan con código; las fotos reales de los lugares se obtienen desde Wikimedia Commons con atribución y requieren Internet.

Alternativa desde PowerShell, dentro de la carpeta:

```powershell
py -m http.server 5500
```

Después abre http://localhost:5500/. Para cerrar el servidor: `Ctrl+C`.

## Controles

| Tecla | Acción |
|---|---|
| Flechas / WASD | Caminar (Nova mira a la dirección correcta) |
| ESPACIO | Colocar una bomba normal (rompe cajas) |
| E | Luz de memoria: acércate al objetivo (máximo 2 casillas en cualquier dirección) para encender faroles, revelar secretos y aturdir sombras |
| SHIFT | Comodín equipado (viento o reloj) |
| ESC | Pausa |
| Ratón / táctil | Menús y botones de juego |

**Tutorial del nivel 1:** busca un farol apagado con un pequeño halo dorado. Camina hasta quedar a **dos casillas o menos**, incluso diagonalmente, y presiona **E**. El farol se encenderá y el objetivo subirá de 0/3 a 1/3. **ESPACIO no enciende faroles**: solo sirve para destruir cajas y enemigos. El HUD inferior avisa cuando estás suficientemente cerca y si la luz se está recargando.

La bomba de memoria se **recarga automáticamente en 10 segundos**. No es necesario derrotar a todos los enemigos. Para pasar de capítulo, cumple la misión y camina hasta el portal turquesa (extremo inferior derecho del mapa).

## Capítulos

1. **Plaza Grande — El canto perdido:** restaura 3 faroles usando E.
2. **San Francisco — La piedra de Cantuña:** abre las cajas especiales y revela el sello con E, recoge 3 piedras y pisa 3 pedestales. El cuarto queda vacío intencionalmente.
3. **San Diego — El camino de Almeida:** encuentra 3 llaves de luz. E también abre temporalmente pasadizos y aturde a las sombras.
4. **El Panecillo — El corazón de la niebla:** rompe escudos de los 3 núcleos con ESPACIO y restáuralos con E. ¡Evita las franjas que la niebla avisa antes de atacar!

Antes de comenzar cada capítulo aparece una **presentación narrativa con su misión**. Tras completar cada lugar se desbloquea una **postal cultural** en el Libro de Leyendas. Los relatos tradicionales están diferenciados de los elementos de fantasía del videojuego.

## Fotografías reales de Quito

Cada capítulo incluye **una postal con fotografía real** al iniciar la misión y **una mini fotografía al lado del título** durante la partida. Pulsa sobre ella para abrir la página original, donde están el autor y la licencia. El proyecto carga cuatro fotografías desde Wikimedia Commons, por lo que también se mostrarán en GitHub Pages con conexión a Internet. Si el servidor de imágenes no responde, aparecerá un dibujo de respaldo y **no se interrumpirá la partida**.

Los autores y las licencias están documentados en [`docs/CREDITOS_FOTOGRAFIAS.md`](docs/CREDITOS_FOTOGRAFIAS.md). Mantén estos créditos al publicar el repositorio.

## Comodines

- **Poncho protector**: absorbe automáticamente un golpe.
- **Viento del Pichincha**: aleja sombras cercanas. SHIFT.
- **Reloj ancestral**: paraliza a las sombras 4 segundos. SHIFT.
- **Farol mejorado**: permite llevar dos cargas de memoria.
- Además: mayor alcance, capacidad de bombas y velocidad.

Cada nivel tiene 3 vidas por intento. Al perder, puedes reintentarlo sin borrar los capítulos desbloqueados. Hay opciones de dificultad y reducción de destellos.

## Estructura

```text
Quito_Guardianes_Leyendas_Phaser3/
├── index.html                 Entrada web / Phaser 3 por CDN
├── css/styles.css             Diseño del contenedor web
├── js/
│   ├── config.js              Datos culturales, niveles, ajustes y guardado
│   ├── main.js                Inicio de Phaser
│   ├── art.js                 Paisajes originales generados por Canvas 2D
│   ├── photos.js              Postales fotográficas reales (Wikimedia Commons)
│   ├── audio.js               Efectos propios por WebAudio
│   ├── ui.js                  Sistema de tarjetas, botones y textos
│   └── scenes/
│       ├── BootScene.js       Arranque
│       ├── PreloaderScene.js  Texturas de los personajes y escenarios
│       ├── MenuScene.js       Portada
│       ├── IntroScene.js      Prólogo
│       ├── CityMapScene.js    Selección de nivel
│       ├── LegendBookScene.js Postales
│       ├── HelpScene.js       Controles
│       ├── SettingsScene.js   Configuración
│       ├── GameScene.js       Reglas y misiones, sin repetir código
│       ├── HUDScene.js        Barra de misión, pausa y controles táctiles
│       ├── ResultScene.js     Victoria o derrota
│       └── EndingScene.js     Amanecer final
└── docs/
    └── DISENO_ORIGINAL.md     Documento de diseño previo
```

## Publicar gratis en GitHub Pages

1. Crea un repositorio de GitHub. Sube los **contenidos** de esta carpeta a la raíz del repositorio (en particular `index.html`, `css`, `js`).
2. Ve a `Settings → Pages`, elige `Deploy from a branch`, rama `main` y carpeta `/(root)`.
3. Guarda y abre la dirección `https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/` cuando GitHub indique que la publicación está activa.

No necesita backend, base de datos, Node.js ni compilación. El progreso se almacena en `localStorage` del navegador.

## ¿Qué hace único al juego?

A diferencia de un juego tradicional de laberintos, las bombas aquí tienen **dos finalidades opuestas**: las normales destruyen y las bombas de memoria restauran. El jugador debe combinar ambas para reconstruir cuatro escenarios inspirados en leyendas quiteñas. El avance cambia la apariencia de los lugares y desbloquea postales que distinguen tradición cultural y ficción original.

**Nota académica:** Las leyendas mencionadas son adaptaciones de la tradición oral. Nova, la Niebla del Olvido, las bombas mágicas y los fragmentos son personajes y recursos de ficción. Juego educativo-creativo, no reconstrucción histórica literal.

## Comprobación opcional del código (Node.js)

Las reglas de las cuatro misiones tienen una prueba automatizada sin dependencias:

```powershell
node tests/smoke.js
```

La prueba comprueba que se puede acceder a cada objetivo (retirando cajas destructibles), que los faroles responden a la bomba de memoria, que las tres piedras y pedestales funcionan, que las llaves se recogen y que los escudos finales se rompen antes de restaurarse. **No sustituye jugar una partida completa en el navegador.**

Para **probar todos los niveles rápidamente** desde el navegador, abre las herramientas de desarrollador (`F12`) y ejecuta en la consola:

```javascript
NovaData.progress.unlocked = 4;
NovaData.save();
location.reload();
```

Esto desbloquea los capítulos para pruebas sin declarar las postales como completadas. Para empezar una partida normal desde cero, utiliza **Nueva aventura**.

**Atajo para Windows:** también puedes hacer doble clic en `INICIAR_JUEGO.bat` si tienes Python instalado. Se abrirá un servidor local en el puerto 5500 y la página del juego. Si el puerto ya está ocupado, usa Live Server o cambia el puerto en el `.bat`.


## Solución para pantalla oscura (corrección del 5 de noviembre de 2026)

La versión corregida inicia Phaser de manera controlada: carga primero el motor, después
los scripts en orden y **solo esconde el mensaje de carga cuando el menú realmente se crea**.
El renderizado usa el modo Canvas, de mayor compatibilidad en equipos Windows.
Si ocurre un problema, se muestra un error visible y el botón **Volver a intentar**.

- Abre el `index.html` de **esta versión** mediante Live Server.
- Si el navegador conserva la versión anterior, presiona `Ctrl + F5`.
- Debes tener conexión a Internet para cargar Phaser 3 por CDN.
- Si aparece un mensaje de error, abre F12 > Consola y copia la primera línea roja.
- No abras directamente `file:///.../index.html`: usa Live Server.
