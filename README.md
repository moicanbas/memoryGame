# 🎮 Juego de Memoria - Vue 3 + Tailwind

Un juego de memoria clásico desarrollado con **Vue 3 (Composition API)** y **TailwindCSS**, con un diseño responsive, niveles de dificultad y almacenamiento de puntajes en **LocalStorage**.

## ✨ Características

- ✅ Tres niveles de dificultad:
  - Fácil: **4x4**
  - Medio: **6x6**
  - Difícil: **12x12**
- ✅ Cronómetro para medir tu tiempo.
- ✅ Guardado de puntajes en **LocalStorage**.
- ✅ Vista de **mejores puntajes**.
- ✅ Interfaz amigable con colores en tonos **lila suave**.
- ✅ Responsive y adaptado para escritorio y móviles.

## 📸 Vistas

- **🏠 Home**: Ingresar el nombre del jugador y elegir nivel de dificultad.
- **🎮 Juego**: Panel de cartas interactivas con cronómetro.
- **🏆 Mejores puntajes**: Ranking de los mejores tiempos por nivel.

## 🛠️ Tecnologías usadas

- [Vue 3](https://vuejs.org/) (Composition API)
- [Vue Router](https://router.vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)

## 🚀 Instalación y uso

Clona el repositorio e instala dependencias:

```bash
git clone https://github.com/moicanbas/memoryGame.git
cd memoryGame
npm install
```

Ejecuta en modo desarrollo:

```bash
npm run dev
```

Compilar para producción:
```bash
npm run build
```

## 📂 Estructura del proyecto
```bash
src/
├── components/
│   ├── Home.vue          # Vista de inicio
│   ├── Game.vue          # Panel del juego
│   ├── Scores.vue        # Mejores puntajes
│
├── router/
│   └── index.js          # Configuración de rutas
│
├── App.vue               # Layout principal
└── main.js               # Punto de entrada
```

## 🧩 Próximas mejoras

- 🎨 Animaciones de volteo de cartas.

- 🎵 Sonidos al acertar o fallar.

- 🌍 Soporte multilenguaje.

- 👥 Ranking global en línea.

## 📜 Licencia

Este proyecto es open-source bajo la licencia MIT.