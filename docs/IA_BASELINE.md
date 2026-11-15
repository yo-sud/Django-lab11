# Baseline de la versión generada por la IA

- **Rama de trabajo:** `feature/semana-11-hooks`
- **Commit base del equipo:** `6f808fc` (`main` al iniciar la sesión)
- **Fecha de congelación:** 2026-11-14
- **Propósito:** conservar, antes de cualquier arreglo, el estado exacto del código que dejó el asistente en la sesión anterior. Los arreglos se hacen en commits posteriores para poder comparar el diff y medir las pruebas antes/después.

## Defectos detectados en el baseline

| # | Archivo | Defecto | Efecto |
|---|---------|---------|--------|
| 1 | `src/App.jsx` | Usa `adaptMovie` y `adaptMovie(movies[0])` sin importar el adaptador. | La aplicación falla al renderizar (`ReferenceError: adaptMovie is not defined`). |
| 2 | `src/App.jsx` | `toggleFavorite` usa `prev` fuera del alcance del actualizador de `setFavorites`. | Cualquier clic en favoritas lanza `ReferenceError: prev is not defined`. |
| 3 | `src/App.jsx` | Existe un estado `favoritesCount` paralelo a `favorites`; se calcula con `favorites.length` obsoleto. | El contador de la cabecera se desincroniza del arreglo real. |
| 4 | `src/App.jsx` / `MovieList.jsx` | `cols` se calcula en `App` pero no se pasa a `MovieList`; la clase queda `movie-grid--undefined`. | El número de tarjetas por fila no responde al tamaño de la ventana. |
| 5 | `src/App.jsx` / `MovieCard.jsx` | `MovieCard` recibe `onFavoriteNotification`, pero `MovieList` no la pasa; además la tarjeta conoce el mecanismo del aviso. | Al marcar una favorita se rompe la tarjeta y se mezclan responsabilidades. |
| 6 | `src/App.jsx` | El aviso de favoritas se guarda en estado, pero no se monta ningún componente que lo muestre. | El usuario no ve confirmación visual. |
| 7 | `src/hooks/useDebounce.js` | Usa `useState`/`useEffect` sin importarlos. | El módulo falla al cargarse. |
| 8 | `src/hooks/useWindowSize.js` | Usa `useState`/`useEffect` sin importarlos; asume `window` en el render. | El módulo falla al cargarse y no es robusto fuera del navegador. |
| 9 | `src/hooks/usePremieres.js` | Usa hooks sin importarlos, depende de `Math.random()` (no determinista) y no expone recarga. | No se puede probar ni mostrar el estado de error de forma reproducible. |
| 10 | `src/hooks/usePremieres.js` | Las imágenes `deadpool-3.jpg` e `inside-out-2.jpg` no existen en `public/posters`. | El carrusel mostraría imágenes rotas. |
| 11 | `src/components/MovieList.jsx` | Recibe `movies` sin adaptar y no usa `columns`. | El patrón adaptador no llega a la cartelera y el grid queda indefinido. |
| 12 | `src/styles/index.css` | `transition-transform` no es una propiedad CSS válida; las clases de grid no coinciden con las que genera JS; faltan estilos de tipografía, aviso, esqueleto y carrusel. | Los estados nuevos no se ven bien y el grid no cambia por fila. |
| 13 | `src/components/PremieresSection.jsx` | No existe. | El hook `usePremieres` no está montado y no se muestran carga, datos ni error. |

## Criterio de aceptación de los arreglos

1. `npm run build` compila sin errores.
2. La suite de Vitest pasa completa.
3. Cada defecto anterior queda cubierto por una prueba o por una verificación manual documentada.
4. El estado de favoritas vive en `App`; `Header` recibe solo el número y `MovieCard` solo notifica la intención.
