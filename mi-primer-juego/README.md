# BOMBA NOVA — Laberinto Neón

Videojuego arcade original **inspirado en la mecánica de Bomberman**, desarrollado con **Phaser 3** en JavaScript. Es un proyecto web estático (HTML + CSS + JS), sin backend y sin compilación, preparado para publicarse directamente con GitHub Pages.

## Cómo jugar

- **Flechas / W, A, S, D:** moverte por las casillas. El personaje gira para mirar a la izquierda, derecha, arriba o abajo, y anima sus pies y brazos mientras camina.
- **Espacio:** colocar una bomba (explota en cruz después de ~2,15 segundos).
- **Esc:** pausar / continuar.
- **Pantalla táctil:** controles direccionales y botón BOMBA en el panel derecho.
- **Meta:** destruir cajas, eliminar los enemigos y llegar al portal oculto para superar tres sectores.
- ¡Evita tus propias explosiones! Empiezas con **3 vidas**.

### Potenciadores

- **Fuego:** aumenta el alcance de tus explosiones.
- **Bomba:** permite colocar más bombas al mismo tiempo.
- **Velocidad:** permite moverte más rápido.

La dificultad se configura desde **OPCIONES**. El equilibrio general es ahora un poco más accesible: hay **2, 4 y 6 enemigos** según el sector (antes 3, 5 y 7), los enemigos se mueven algo más despacio y las bombas dan un instante adicional para escapar. Se conservan las tres vidas y todas las animaciones direccionales. Tu récord y preferencias se guardan localmente en el navegador.

## Cómo ejecutar en VS Code

1. Descomprime este proyecto.
2. Abre la carpeta `mi-primer-juego` en VS Code.
3. Instala la extensión **Live Server** (si no la tienes).
4. Abre `index.html` con **Open with Live Server**.
5. El navegador ejecutará el juego. **Necesitas Internet** para cargar Phaser 3 desde su CDN.

También puedes usar `python -m http.server 8000` y entrar a `http://localhost:8000`.

## Estructura del proyecto

```text
mi-primer-juego/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js                 # Reglas generales, récord y configuración
│   ├── audio.js                  # Sonidos generados por Web Audio
│   ├── ui.js                     # Componentes y utilidades visuales
│   ├── main.js                   # Configuración de Phaser 3
│   └── scenes/
│       ├── BootScene.js          # Inicializa preferencias
│       ├── PreloaderScene.js     # Texturas generadas con Graphics
│       ├── MenuScene.js          # Pantalla inicial
│       ├── HelpScene.js          # Instrucciones
│       ├── SettingsScene.js      # Sonido y dificultad
│       ├── GameScene.js          # Mapa, IA, bombas, colisiones y niveles
│       ├── HUDScene.js           # Interfaz fija y pausa
│       └── ResultScene.js        # Victoria, derrota y reintento
└── README.md
```

## Relación con los PDF de clase

- **Arquitectura de escenas:** Boot → Preloader → Menú → Juego → Resultado. Se amplió con escenas de Ayuda, Opciones y HUD.
- **Protagonista, acciones, respuesta y objetivo:** personaje animado, movimiento y bombas, tiempo/puntaje/vidas, portal de victoria.
- **Mapa mayor que la pantalla:** tablero 25 × 19 de 44 píxeles (1100 × 836). La cámara sigue al personaje con `startFollow()` y se limita con `setBounds()`.
- **Física y movimiento:** movimiento de cuadrícula en cuatro direcciones (propio del género), animación direccional de personaje con sprites procedimentales, detección de colisiones y efectos temporizados. El prototipo del carrito usa ocho direcciones; aquí se adaptó al diseño del laberinto.
- **HUD:** permanece fijo mediante otra escena mientras la cámara se desplaza.
- **Condición de victoria y repetición:** elimina enemigos, descubre el portal, supera 3 sectores, registra tiempo, puntaje y récord.
- **Entrega:** repositorio público y enlace en GitHub Pages.

## Publicar en GitHub Pages

Sigue el procedimiento del taller «Setup, Desarrollo y Despliegue con Phaser 3»:

1. Crea un repositorio público en la organización de la asignatura, con el nombre indicado por tu docente: `apellidos-nombres-jueg-gr3` (o el formato exacto vigente de tu grupo).
2. Sube **el contenido** de esta carpeta a la raíz del repositorio (no otra subcarpeta), de modo que `index.html` esté en la raíz.
3. En GitHub: **Settings → Pages**.
4. En **Source** elige **Deploy from a branch**, selecciona **main** y la carpeta **/(root)** y guarda.
5. Cuando GitHub publique, abre el enlace `https://<usuario-o-organizacion>.github.io/<nombre-repositorio>/` y comprueba el juego.
6. Entrega en Teams el enlace público al juego y al repositorio según el taller.

> Este juego se inspira en las reglas clásicas de laberintos con bombas, pero el nombre, los personajes, los gráficos y la lógica fueron creados para este proyecto. No incluye recursos gráficos oficiales de Bomberman.

## Notas técnicas

- Phaser 3 se carga por CDN en `index.html`.
- Las texturas se dibujan programáticamente con Phaser Graphics: no hay imágenes externas.
- Los sonidos son sintetizados con Web Audio API tras interacción del usuario.
- Las partidas no requieren registro ni red; solo la carga inicial del motor requiere conexión.
