# Documento de diseño de videojuego — Bomba Nova

## 1. Idea principal

**Título:** Bomba Nova — Laberinto Neón  
**Género:** arcade, acción estratégica, vista superior 2D.  
**Inspiración:** mecánica de bombas y cajas destructibles similar a Bomberman, con universo y gráficos originales.  
**Público objetivo:** jugadores casuales que disfrutan resolver laberintos cortos.  
**Motor:** Phaser 3.90.0 con HTML, CSS y JavaScript.  
**Entrega:** página estática en GitHub Pages.

## 2. Elementos fundamentales (referencia: «Conceptos de Diseño en Carrito», p. 2)

| Elemento | Aplicación en Bomba Nova |
| --- | --- |
| Protagonista | Un pequeño explorador futurista verde llamado Nova. |
| Meta | Encontrar el portal, liberarlo y entrar tras eliminar todos los enemigos. |
| Acciones | Caminar en 4 direcciones, colocar bombas, recoger potenciadores. |
| Respuesta | Movimiento animado, explosiones, efectos de audio, puntuación, temporizador y vidas. |

## 3. Ciclo de juego

**Observar → decidir → moverse → colocar bomba → escapar → evaluar**. La decisión principal consiste en buscar posiciones seguras, destruir obstáculos y crear rutas. La partida termina al perder todas las vidas o completar los tres sectores.

## 4. Escenas (referencia: «Presentación de Carrito», p. 4)

```text
BOOT → PRELOADER → MENÚ ─────────┐
                     │           ├→ INSTRUCCIONES → MENÚ
                     │           └→ OPCIONES → MENÚ
                     └→ JUEGO + HUD → RESULTADO
                                 ↑        │
                                 └────────┘ (siguiente nivel / reinicio)
```

- **Boot:** preferencias y récord de almacenamiento local.
- **Preloader:** texturas originales construidas con Graphics.
- **Menú:** presentación, selección Jugar, Instrucciones u Opciones.
- **Game:** mapa, movimiento, IA, bombas, mejoras, colisiones, objetivos.
- **HUD:** escena independiente con información estática y ventana de pausa.
- **Result:** pantalla de victoria o derrota, tiempo, puntaje y reintento.

## 5. Diseño del mundo y cámara (referencia: «Conceptos...», pp. 5–6)

| Propiedad | Valor |
| --- | --- |
| Tablero | 25 columnas × 19 filas |
| Tamaño casilla | 44 × 44 px |
| Dimensión del mapa | 1100 × 836 px |
| Pantalla | 1200 × 760 px |
| Región visible del mapa | 860 × 594 px |
| Cámara | `startFollow(hero, false, .11, .11)` |
| Límites | `setBounds(0, 0, 1100, 836)` |
| HUD | Escena superpuesta que no se desplaza con la cámara |

El mapa no cabe completo en la región de juego; conforme Nova avanza la cámara lo acompaña. El recorrido del laberinto se genera automáticamente pero **cada nivel tiene su propia semilla**, de modo que el reinicio es predecible.

## 6. Reglas y físicas (referencia: «Conceptos...», pp. 8–9)

- Movimiento en **4 direcciones**: es una adaptación de las 8 direcciones del juego Carrito, porque el laberinto se construye sobre casillas.
- **Muros indestructibles** bloquean el movimiento y detienen inmediatamente las explosiones.
- **Cajas destructibles** bloquean el movimiento y se rompen al recibir una explosión; una explosión no continúa después de atravesar una caja.
- **Bombas**: aparecen en la casilla del jugador, detonan tras ~2,15 s y dañan en forma de cruz.
- **Reacciones en cadena**: una explosión puede detonar otra bomba.
- **Enemigos**: hay 2 en el sector 1, 4 en el sector 2 y 6 en el sector 3. Recorren pasillos a un ritmo moderado y en ocasiones persiguen al jugador. El contacto con ellos resta una vida.
- **Invulnerabilidad breve (~1,95 s)** después de recibir daño, para evitar perder varias vidas en un mismo instante.
- **Potenciadores**: alcance, cantidad simultánea de bombas y velocidad.
- **Portal**: está oculto bajo una caja de una posición conocida por el sistema. Solo se abre al eliminar a todos los enemigos.
- **Victoria**: entrar al portal activo; superar tres sectores para ganar la aventura.
- **Derrota**: vidas = 0.

## 7. Interfaz (referencia: «Conceptos...», p. 11)

La capa de interfaz muestra sector actual, puntuación, tiempo, vidas, enemigos restantes y mejoras. Se ofrece un botón de pausa, una cruceta y un botón de bomba. El menú incluye instrucciones y opciones (sonido, dificultad), que no forman parte del ejemplo Carrito pero se añadieron para la propuesta personalizada.

## 8. Pruebas funcionales sugeridas

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Inicio | Clic en JUGAR | Comienza el Sector 01 con 3 vidas. |
| Movimiento | Pulsar flechas / WASD | El personaje pasa a una casilla libre. |
| Colisión | Intentar entrar a un muro o caja | No puede atravesarlo. |
| Bomba | Espacio en casilla libre | Aparece bomba y explota tras el retardo. |
| Caja | Colocar bomba junto a caja | La caja se destruye y suma puntos. |
| Enemigo | Explosión alcanza enemigo | Desaparece y aumentan los puntos. |
| Vida | Ser alcanzado por explosión | Disminuye una vida y hay invulnerabilidad temporal. |
| Mejora | Recoger potenciador | Cambia capacidad, alcance o velocidad. |
| Pausa | Escape / botón Pausa | Se congelan tiempo y movimientos. |
| Portal | Descubrir y entrar con enemigos vivos | Indica que aún faltan enemigos. |
| Victoria | Entrar con 0 enemigos | Aparece resultado de nivel o victoria final. |
| Derrota | Quedarse sin vidas | Pantalla de derrota con reinicio. |
| Publicación | Abrir URL de GitHub Pages | Menú y partida se muestran sin rutas absolutas. |

## 9. Referencias suministradas por el docente

1. *Conceptos de Diseño en Carrito* (12 diapositivas): elementos, ciclo, escenas, mundo/cámara, movimiento, reglas, HUD, victoria.
2. *Presentación de Carrito* (9 diapositivas): mapa expansivo, escenas, controles, cámara, estructura del código.
3. *Taller Práctico: Setup, Desarrollo y Despliegue con Phaser 3* (10 diapositivas): creación, ejecución local, Git/GitHub Pages y entrega en Teams.

**Adaptación intencional:** la presentación de Carrito está basada en Phaser 4 + Vite, pero el taller individual solicita Phaser 3, por lo que este proyecto usa Phaser 3 y archivos estáticos con CDN, como el taller.

## Animación direccional del personaje

El protagonista tiene sprites diseñados por código para tres vistas: de frente (`hero-down`), de espaldas (`hero-back`) y de perfil (`hero-side`). Al caminar a la izquierda, Phaser invierte horizontalmente el perfil (`setFlipX(true)`); a la derecha, lo muestra sin invertir. El perfil tiene un visor pronunciado, una marca triangular hacia donde mira y un brazo visible que cambia de posición.

Cada vista tiene dos fotogramas alternados de pies y brazos, reproducidos como animación Phaser 3 con `this.anims.create()` durante el desplazamiento de una casilla. Un rebote vertical leve refuerza la sensación de caminar. Si el jugador pulsa una dirección bloqueada, el personaje gira en esa dirección aunque no avance. Al parar, regresa al fotograma de reposo correspondiente. Todo se encuentra en `PreloaderScene.js` (dibujos) y `GameScene.js` (orientación, animación y movimiento).

## Ajuste suave de dificultad

Esta revisión conserva los tres sectores, tres vidas, bombas, enemigos y portal, pero facilita ligeramente la partida: menos cajas bloqueando pasillos, un enemigo menos por nivel, desplazamiento y persecución enemiga algo más suaves, explosión a los 2,15 s y 1,95 s de protección tras recibir daño. Las opciones FÁCIL / NORMAL / DIFÍCIL siguen disponibles y las animaciones direccionales del personaje se mantienen.
