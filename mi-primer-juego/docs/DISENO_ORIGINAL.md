# Documento de diseño de videojuego (GDD)
## QUITO: Guardianes de las Leyendas
**Versión:** 1.0 — propuesta de preproducción, sin implementación.  
**Motor planificado:** Phaser 3, JavaScript, HTML/CSS; publicación en GitHub Pages.  
**Punto de partida:** `BombaNova_Phaser3_dificultad_suave.zip`.

## 1. Visión y propuesta de valor
Videojuego arcade de exploración y estrategia en vista superior 2D, inspirado en las bombas y laberintos de Bomberman, con personajes, historia, misiones y arte originales. Nova es una pequeña guardiana de un farol mágico. Una entidad ficticia llamada **la Niebla del Olvido** está borrando los recuerdos de Quito. Nova visita cuatro lugares reales, asociados a leyendas quiteñas, y restaura sus recuerdos.

**Diferencia principal:** el juego dispone de **bombas convencionales**, que destruyen obstáculos, y **bombas de memoria**, que restauran faroles y recuerdos, revelan rutas y aturden sombras. Cada escenario tiene un objetivo distinto; no es obligatorio eliminar a todos los enemigos para avanzar. El progreso cambia visualmente los escenarios y desbloquea postales culturales.

**Estilo narrativo:** empieza cálido y colorido (atardecer), pasa al crepúsculo y la noche, culmina en una medianoche mágica, y recupera un amanecer luminoso.

**Público y duración meta:** público casual; campaña aproximada de 15 a 25 minutos. La duración es una meta de diseño que debe verificarse al probar.

## 2. Historia
Una niebla violeta cubre las calles y apaga faroles y recuerdos. Nova encuentra un farol mágico y escucha una petición: reunir cuatro fragmentos para que las historias vuelvan a iluminar Quito. En cada nivel descubre pistas de una leyenda tradicional y derrota la versión corrompida de sus recuerdos sin convertir a los personajes históricos o legendarios en villanos. La Niebla del Olvido es **una creación original del videojuego**.

**Fragmentos:** Eco (Plaza Grande), Ingenio (San Francisco), Valentía (San Diego), Esperanza (Panecillo). Al obtener los cuatro, regresa la luz del amanecer.

## 3. Flujo de pantallas
`Boot → Preloader → Menú`  
`Menú → Introducción → Mapa de Quito → Nivel (Game + HUD) → Resultado → Mapa`  
`Menú ↔ Libro de Leyendas / Cómo jugar / Opciones`  
`Nivel ↔ Pausa`  
`Nivel 4 superado → Final de aventura y créditos → Menú`

| Pantalla | Contenido | Acciones |
|---|---|---|
| Menú | Silueta de Quito al atardecer, Nova, niebla y título. | Nueva aventura, Continuar (si hay progreso), Libro, Cómo jugar, Opciones. |
| Introducción | 3 viñetas breves: Quito iluminado, aparición de niebla, Nova y farol. | Siguiente, Saltar. |
| Mapa | Ruta ilustrada con 4 lugares; nivel desbloqueado resaltado y niveles restaurados iluminados. | Elegir nivel disponible, volver. |
| Juego | Mapa top-down, enemigos, bombas, recompensas, objetivo y miniayudas. | Moverse, usar bombas, comodín, pausa. |
| Pausa | Oscurecimiento del fondo; controles y objetivo de misión. | Continuar, reiniciar nivel, volver al mapa. |
| Resultado | Postal y fragmento recuperado; tiempo y puntuación; estrellas opcionales. | Siguiente nivel, mapa, repetir. |
| Derrota | Mensaje breve sin penalización permanente de progreso. | Reintentar nivel, mapa. |
| Libro | 4 postales; lugar, leyenda en lenguaje sencillo, qué es ficción del juego. | Abrir ficha, volver. |
| Opciones | Música/sonido, dificultad y reducción de destellos. | Guardar y volver. |
| Final | Niebla desaparece, secuencia de amanecer, 4 fragmentos reunidos. | Menú, revisar libro. |

### Wireframe lógico del HUD
- **Arriba izquierda:** nombre del lugar + objetivo actual (por ejemplo, `Faroles 1/3`).
- **Arriba derecha:** 3 corazones, tiempo, puntos, pausa.
- **Zona central:** mapa en vista superior; los indicadores nunca ocultan al personaje.
- **Abajo:** iconos de bomba normal, memoria con tiempo de recarga, comodín disponible; controles táctiles si procede.
- Los objetivos se representan tanto con texto como con iconos y cambios visuales, evitando depender solo del color.

## 4. Protagonista: Nova
**Rol:** guardiana de los faroles y exploradora. **Silueta:** personaje chibi de aproximadamente 34 × 38 px dentro de casillas de 44 × 44 px, visor turquesa, traje verde, detalle violeta, mochila pequeña y farol dorado. El farol se ilumina al usar la memoria.

**Animaciones previstas:** quieto, caminar hacia arriba, abajo, izquierda y derecha, poner bomba, activar memoria, recibir daño, victoria. Se **reutilizan las vistas direccionales ya existentes**: frontal, espalda, perfil derecho y perfil invertido al moverse a la izquierda. Se preserva la animación de brazos y piernas.

**Comportamiento:** giro visible al pulsar una dirección incluso cuando hay pared; pequeña invulnerabilidad visual después de recibir daño.

## 5. Mecánicas y reglas
| Elemento | Especificación inicial |
|---|---|
| Movimiento | 4 direcciones, mediante flechas/WASD y controles táctiles. |
| Bomba normal | ESPACIO o botón rojo; disponible sin límite de cantidad total, solo 1 activa al inicio; detona después de ~2,15 s y se propaga en cruz hasta 2 casillas inicialmente; rompe cajas, daña sombras y jugador; las paredes cortan el alcance. |
| Bomba de memoria | E o botón dorado; **no causa daño al protagonista** ni destruye cajas; emite una onda luminosa en cruz hasta 2 casillas; activa faroles, revela huellas y pistas, aturde sombras 2 s. |
| Recarga de memoria | 1 carga inicial, se recupera automáticamente tras 10 s; evita bloqueos permanentes por falta de recursos. |
| Farol de recuerdos | Potenciador especial: permite almacenar hasta 2 cargas de memoria; las cargas se recuperan por separado. |
| Otros potenciadores clásicos | Alcance de bomba, capacidad simultánea y velocidad, existentes en Bomba Nova. |
| Poncho protector | Bloquea un golpe. |
| Viento del Pichincha | Empuja enemigos cercanos un cuadro y abre espacio. |
| Reloj ancestral | Congela enemigos 4 s. |
| Vidas | 3 por intento de nivel; el progreso desbloqueado permanece aunque se pierda. |
| Impactos | 1 vida por contacto o explosión, con ~2 s de invulnerabilidad posterior. |
| Victoria de nivel | Completar la misión especial y entrar al portal, independientemente de cuántos enemigos queden. |
| Tiempo | Registra puntuación, pero no causa derrota automática. |
| Ayudas | Si el jugador no progresa durante 40 s, se destaca suavemente el siguiente objetivo. |
| Guardado | Preferencias, niveles desbloqueados y postales en `localStorage`. |

**Control del comodín:** SHIFT o botón especial; solo se lleva un comodín equipable a la vez. Las recompensas no desaparecen al salir al mapa antes de iniciar un nivel nuevo; no se utiliza para bloquear puertas obligatorias.

## 6. Cuatro niveles
### Nivel 1 — Plaza Grande: El canto perdido
- **Leyenda inspiradora:** El Gallito de la Catedral. La Catedral se representa en un borde de la plaza, donde corresponde el homenaje a la leyenda; el resto del espacio evoca la Plaza de la Independencia.
- **Momento:** atardecer; **dificultad:** tutorial.
- **Visual:** jardines y caminos claros, monumento central, faroles dorados, edificio colonial al fondo, niebla tenue en bordes.
- **Misión principal:** activar **3 faroles** con bombas de memoria y después llegar al portal junto a la Catedral.
- **Variante mecánica:** cada canto anuncia la aparición de una pequeña sombra cerca de un farol (aviso visual y sonoro, nunca sorpresa inevitable).
- **Enemigos previstos:** 2 sombras lentas.
- **Aprendizaje:** caminar, poner bomba normal, evitar explosiones y activar memoria.
- **Fragmento/postal:** Eco / Gallito de la Catedral.
- **Paleta aproximada:** cielo `#F8BD78`, piedra `#E9C8A4`, plantas `#66B998`, luz `#FFD77B`, niebla `#8A6BC1`.

### Nivel 2 — San Francisco: La piedra de Cantuña
- **Leyenda inspiradora:** Cantuña y la piedra faltante del atrio.
- **Momento:** crepúsculo.
- **Visual:** atrio empedrado, escaleras amplias, paredes ocres y terracota, ventanas encendidas y sombras violetas.
- **Misión principal:** recuperar **3 piedras de recuerdo**, revelar una con una bomba de memoria y activar **3 pedestales**; el **cuarto hueco debe permanecer vacío** como guiño al ingenio de la leyenda. La salida se abre al entender la pista del hueco sin piedra, no al encontrar una cuarta.
- **Variante mecánica:** combinación de bombas destructivas y reveladoras, y un sencillo acertijo de observación.
- **Enemigos previstos:** 3 sombras lentas.
- **Fragmento/postal:** Ingenio / Cantuña.
- **Paleta:** terracota `#C77F66`, arena `#D4AA80`, azul noche `#354F79`, violeta `#6A4E99`, farol `#F5C77B`.

### Nivel 3 — San Diego: El camino de Almeida
- **Leyenda inspiradora:** Padre Almeida y el Convento de San Diego.
- **Momento:** noche.
- **Visual:** claustros, patios, arcos de piedra, puertas de madera, estanque, caminos parcialmente iluminados.
- **Misión principal:** reunir **3 llaves de luz** para abrir un portón y encontrar la salida.
- **Variante mecánica:** sombras vigilantes con un área de visión visible; la bomba de memoria permite aturdirlas por unos segundos, y existen pasadizos iluminados de forma temporal.
- **Enemigos previstos:** 3 vigilantes, sin persecución continua desde todo el mapa.
- **Fragmento/postal:** Valentía / Padre Almeida.
- **Paleta:** índigo `#252B5C`, piedra `#7B80A1`, púrpura `#7756AC`, cian `#5ED9CB`, luz `#F3C782`.

### Nivel 4 — El Panecillo: El corazón de la niebla
- **Origen del relato:** desenlace original, ambientado en un lugar real; no se presenta como leyenda tradicional.
- **Momento:** medianoche; cambia a amanecer al completar.
- **Visual:** camino en subida, plaza circular al pie de un monumento estilizado, nubes violetas, cristales oscuros y 3 grandes faroles.
- **Misión principal:** desactivar **3 núcleos oscuros** usando bombas normales para romper su protección y bombas de memoria para restaurar los faroles; al completar la tercera fase, entrar en el portal de luz.
- **Variante mecánica:** mini-jefe ambiental, con 3 ciclos de sombra anunciados por señales claras; no requiere un sistema de combate complejo.
- **Enemigos previstos:** hasta 4 sombras; zona segura siempre accesible.
- **Fragmento/postal:** Esperanza / El Panecillo y la memoria colectiva de Quito.
- **Paleta inicial:** noche `#151A40`, morado `#604090`, magenta `#D96F9A`, cian `#5ADCCB`; **amanecer:** coral `#FFBD9B` y dorado `#FFE09A`.

## 7. Curva emocional y visual
1. Plaza Grande: **asombro** y aprendizaje — luces cálidas y saturadas.
2. San Francisco: **intriga** y observación — cae el sol, sombras más largas.
3. San Diego: **tensión controlada** — paleta fría, luces que guían.
4. Panecillo: **confrontación y esperanza** — casi todo oscuro al inicio; la restauración devuelve el color en tiempo real.

Evitar pantallas completamente negras. El personaje, las bombas y las zonas seguras siempre deben tener contraste suficiente. Hay opción de reducir destellos y las pistas incluyen iconos además de color.

## 8. Enemigos y objetos (identidad visual)
- **Sombra pequeña:** silueta violeta redondeada y ojos luminosos; movimiento lento.
- **Vigilante de neblina:** máscara de farol y cono de visión visible; aparece en San Diego.
- **Núcleo de niebla:** cristal/espiral inerte protegida por obstáculos; Panecillo.
- **Cajas destructibles:** cajones de madera con ornamentos coloniales, diferentes del suelo.
- **Muros permanentes:** mampostería de piedra, siempre con contorno reconocible.
- **Faroles/recuerdos:** dorado con destellos cian, distintos de las explosiones rojas.
- **Puertas/portales:** se iluminan en turquesa al completar el objetivo.

## 9. Arquitectura prevista sobre Bomba Nova
Conservar: `BootScene`, `PreloaderScene`, `MenuScene`, `GameScene`, `HUDScene`, `ResultScene`, `SettingsScene`, `HelpScene`, sistema de cámara, base de animaciones direccionales, bombas normales y parámetros de dificultad suave.

Agregar o ampliar: `IntroScene`, `CityMapScene`, `LegendBookScene`, `EndingScene`; configuraciones de niveles, datos de misión, detonación de memoria, sistema de objetivos, postales y guardado. Evitar cuatro copias de `GameScene`: un motor con datos específicos por escenario.

**Base actual comprobada en el proyecto ZIP:** tablero 25 × 19, casilla 44 px, pantalla 1200 × 760, viewport del mundo 860 × 594, seguimiento suave de cámara, 3 niveles, bomba normal de 2,15 s, 3 vidas iniciales y animación de perfil que se invierte horizontalmente. Estos parámetros se conservarán o adaptarán explícitamente.

## 10. Alcance de desarrollo
**Primera versión jugable:** menú, intro, mapa, Nova, dos tipos de bombas, HUD, guardado y Nivel 1 completo.  
**Segunda versión:** niveles 2 y 3, enigmas, Libro de Leyendas, comodines.  
**Versión de entrega:** nivel 4, final dinámico, sonidos, pulido visual, controles táctiles y publicación.

**Criterios de aceptación:** movimiento claramente visible en cuatro direcciones; cada misión puede completarse sin matar a todos los enemigos; ninguna misión depende de recursos agotables sin regeneración; guardar y continuar funciona; victoria/derrota y pausa funcionan; los cuatro niveles cambian mecánica y paleta; las postales separan información tradicional de elementos ficticios; publicación correcta en GitHub Pages.

## 11. Referencias culturales y académicas
**Fuentes culturales consultadas:**
- Visit Quito, *Rutas de Leyendas y Misterios en el Centro Histórico* — plaza, Catedral y Gallito.
- Pichincha es Turismo, *Iglesia de San Francisco de Quito* — Cantuña y piedra faltante.
- Quito Informa, *El mito y la realidad en el Museo Franciscano del Padre Almeida* — Convento de San Diego.
- Wikimedia Commons, *El Panecillo, Quito* — referencia visual del lugar.

**Documentos de clase del usuario:**
- *Conceptos de Diseño en Carrito*: protagonista, meta, acciones, respuesta, ciclo, escenas, mundo/cámara, movimiento, reglas, HUD, final.
- *Presentación de Carrito*: mapa, seguimiento de cámara, entradas, organización del código; se adapta a Phaser 3.
- *Taller Práctico: Despliegue con Phaser 3*: juego individual, ejecución local, GitHub Pages y entrega del enlace.

> **Nota cultural:** el juego es una interpretación fantástica. Las leyendas, plazas y conventos existen en la tradición y geografía de Quito; Nova, la Niebla del Olvido, las bombas mágicas, los fragmentos y los acertijos son elementos ficticios.

**Estado:** diseño propuesto; no se ha modificado ni programado el juego en esta etapa.
