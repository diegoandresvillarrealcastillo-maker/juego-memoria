# 🧩 Juego de Memoria Ilustrativo

### Encuentra las 18 parejas y revela la imagen escondida

**▶ [Jugar ahora](https://diegoandresvillarrealcastillo-maker.github.io/juego-memoria/)**

---

## 📖 Descripción

Un juego de memoria de **36 cartas en 18 parejas**. Cada pareja encontrada retira dos cartas del tablero y descubre una porción más de la ilustración que está detrás. Al completar el tablero, la imagen queda revelada por completo.

Desarrollado en HTML, CSS y JavaScript sin librerías externas.

---

## 🎮 Cómo jugar

1. Haz clic en una carta para voltearla.
2. Voltea una segunda carta buscando su pareja.
3. Si coinciden, las dos se quedan descubiertas y el fondo se aclara un poco más.
4. Si no coinciden, vuelven a taparse: memoriza dónde estaban.
5. Completa las 18 parejas para revelar la ilustración entera.

El contador lleva el registro de parejas encontradas, movimientos realizados y porcentaje de avance.

---

## ✨ Características

| Característica | Detalle |
|---|---|
| 🃏 Tablero | 36 cartas en cuadrícula, barajadas de nuevo en cada partida |
| 🖼 Revelado progresivo | La opacidad del velo baja con cada acierto y descubre el fondo |
| 📊 Estadísticas en vivo | Parejas, movimientos y porcentaje de avance |
| 🔁 Reinicio | Vuelve a mezclar en cualquier momento sin recargar la página |
| 🗂 Guía visual | Panel lateral con las 18 ilustraciones y sus parejas |
| ♿ Accesibilidad | Cartas como botones, `aria-label` que cambia al voltear y región `aria-live` que anuncia cada jugada |
| 📱 Responsive | Se adapta a pantallas de escritorio y móvil |

---

## 🗂 Estructura de archivos

```
juego-memoria/
├── index.html    ← Estructura de la página y del tablero
├── script.js     ← Lógica: barajado, emparejado, progreso
├── styles.css    ← Estilos, cuadrícula y animaciones de volteo
└── *.webp/.avif/.png/.jpg   ← Las 18 ilustraciones y el fondo revelado
```

---

## 🎨 Decisiones de diseño

- **Sin librerías externas** — HTML, CSS y JavaScript puro.
- **Barajado Fisher-Yates** — cada partida reparte las cartas en un orden distinto.
- **Bloqueo del tablero** — mientras se comparan dos cartas no se aceptan más clics, para evitar que queden tres cartas descubiertas.
- **Imágenes en formatos modernos** — AVIF y WebP para que el juego cargue rápido incluso con 18 ilustraciones.

---

## 🖥 Cómo ejecutarlo

Ábrelo en línea desde [GitHub Pages](https://diegoandresvillarrealcastillo-maker.github.io/juego-memoria/), o descarga el repositorio y abre `index.html` en cualquier navegador moderno. No requiere instalación ni servidor.
