# Laboratorio 11 — Hooks del agente

**Proyecto:** Cine Plus — cartelera de cine (React 18 + Vite 5)
**Repositorio:** <https://github.com/yo-sud/Django-lab11>
**Rama de trabajo:** `feature/semana-11-hooks`
**Fecha:** 14 de noviembre de 2026
**Punto de partida:** el proyecto del Laboratorio 10 ya funcionando en la rama `main` (commit `6f808fc`).

---

## 1. Repositorio, rama y commits

El trabajo se hizo en una rama de sesión dentro del repositorio del equipo. La rama parte del commit que dejó la sesión anterior con la IA (`6f808fc`) y conserva ese estado antes de corregirlo.

| Commit | Mensaje | Qué contiene |
|--------|---------|--------------|
| `6f808fc` | Botón limpiar filtro desde el banner… | Último commit de la sesión con IA: punto de partida, con los defectos del baseline |
| `99ada9e` | chore: congelar baseline de la version IA y documentar defectos antes de arreglar | `docs/IA_BASELINE.md`: 13 defectos congelados antes de tocar código |
| `7c6dedf` | test: configurar Vitest, jsdom y 26 pruebas con evidencia antes/despues | Configuración de pruebas + evidencia `test-before.txt` / `test-after.txt` |
| `14b4672` | fix: adaptador unico para datos crudos de cartelera y estrenos | `movieAdapter.js`, datos fuente, placeholder |
| `0b35d50` | feat: hooks reutilizables useDebounce, useWindowSize y usePremieres | Los tres hooks personalizados |
| `804473e` | feat: aviso de favoritas y buscador con debounce sin acoplar la tarjeta a la presentacion | `FavoriteToast`, `MovieSearch`, `MovieCard`, `Hero`, `Header` |
| `3596b35` | feat: seccion de estrenos con skeleton, estado de error y carrusel | `PremieresSection`, `PremiereCarousel`, `PremiereSkeleton` |
| `0201e91` | feat: elevar favoritas y filtro a App y sincronizar limpiar filtro con buscador y listado | `App.jsx`, `MovieList.jsx` |
| `ba8230d` | style: tipografia, utilidades accesibles, grilla responsiva y estilos de aviso, carrusel y skeleton | `src/styles/index.css` |

El commit `99ada9e` es importante para la entrega: guarda **la versión original de la IA sin corregir**, de modo que cualquier revisor puede ejecutar `git diff 99ada9e..ba8230d` y ver exactamente qué cambió la persona y qué dejó la IA.

---

## 2. Las once tareas y dónde están resueltas

| # | Tarea | Archivo principal | Evidencia |
|---|-------|-------------------|-----------|
| 1 | Ampliar hoja de estilos y tipografía; verificar componentes existentes | `src/styles/index.css` | Tokens, escala tipográfica, `visually-hidden`, grilla 1/2/3, estilos de aviso, carrusel y skeleton |
| 2 | Utilidad adaptadora para los datos de películas | `src/utils/movieAdapter.js` | `adaptMovie`, `adaptMovies`, `adaptPremiere` + 4 pruebas |
| 3 | Aviso de favoritas sin que la tarjeta conozca la presentación | `src/App.jsx`, `src/components/FavoriteToast.jsx` | `notification` en `App`; `MovieCard` solo llama `onToggleFavorite(id)` |
| 4 | `useDebounce` en la búsqueda | `src/hooks/useDebounce.js`, `MovieSearch.jsx` | Hook + 2 pruebas; montado en Hero y en la lista |
| 5 | `useWindowSize` para tarjetas por fila | `src/hooks/useWindowSize.js`, `App.jsx` | Hook + 2 pruebas; clases `movie-grid--1/2/3` |
| 6 | `usePremieres` con carga, datos y error | `src/hooks/usePremieres.js` | Hook + 3 pruebas; `state`, `data`, `error`, `reload` |
| 7 | Skeleton + carrusel de estrenos | `PremieresSection.jsx`, `PremiereSkeleton.jsx`, `PremiereCarousel.jsx` | Sección `#estrenos` con los tres estados y reintento |
| 8 | Elevar el contador de favoritas a la raíz y mostrarlo en la cabecera sin pasar la lista completa | `App.jsx`, `Header.jsx` | `favoritesCount = favorites.length`; `Header` recibe solo el número |
| 9 | Botón «Limpiar filtro» en el banner sincronizado con buscador y listado | `Hero.jsx`, `MovieSearch.jsx` | `onQueryChange('')`; el efecto de sincronización limpia ambos inputs |
| 10 | Documentar el árbol de componentes y por qué el contador no puede vivir en la cabecera | Este documento, sección 5 | Tabla de datos por nivel y justificación |
| 11 | Pruebas, evidencia y control de la salida de la IA | `src/test/`, `docs/evidencias/` | 26 pruebas, `test-before.txt`, `test-after.txt`, `build-after.txt` |

---

## 3. Estilos y tipografía

La hoja `src/styles/index.css` pasó de estilos sueltos a un sistema pequeño y explícito:

- **Tokens en `:root`**: colores, superficies, radios, sombras, espaciados y familias tipográficas. Los componentes usan variables, no valores mágicos repetidos.
- **Escala tipográfica**: títulos con `clamp()` para que el `h1`/`h2` crezcan con la pantalla sin media queries adicionales; cuerpo con altura de línea cómoda (1.6) y medida limitada para lectura.
- **Utilidades accesibles**: `.visually-hidden` para etiquetas que existen para lectores de pantalla pero no visualmente; `@media (prefers-reduced-motion: reduce)` desactiva animaciones del aviso, el skeleton y el carrusel.
- **Grilla coherente con JavaScript**: `App` calcula `columns` (1, 2 o 3) y `MovieList` aplica `movie-grid--N`. Las tres clases existen en CSS, por lo que el valor que decide JS siempre tiene una regla real; ya no se genera la clase inexistente `movie-grid--undefined`.
- **Estados nuevos**: `.toast`, `.premiere`, `.carousel__*`, `.skeleton` y `.premiere-skeleton__*` con animaciones suaves y contraste suficiente.
- **Responsive**: `@media (max-width: 980px)` y `(max-width: 767px)` reorganizan cabecera, controles, grilla y carrusel.

Los componentes que ya existían (`Header`, `Hero`, `Footer`, `Button`, `MovieCard`, `MovieList`) se revisaron contra la nueva hoja: no se cambió su estructura salvo donde una tarea lo pedía, y se comprobó que siguieran renderizando con las pruebas.

---

## 4. Adaptador de datos

`src/utils/movieAdapter.js` es el único lugar que conoce la forma de los datos crudos. Los componentes consumen siempre el mismo modelo: `id`, `title`, `image`, `synopsis`, `classification`, `rating`, `schedule`, `releaseDate`.

| Campo crudo posible | Campo del modelo | Valor por defecto |
|---------------------|------------------|-------------------|
| `id` / `_id` / `slug` | `id` | `null` |
| `title` / `titulo` | `title` | `'Película sin título'` |
| `image` / `poster` / `posterUrl` | `image` | `/posters/placeholder.svg` |
| `synopsis` / `sinopsis` / `overview` | `synopsis` | `''` |
| `classification` / `clasificacion` / `rated` | `classification` | `'N/A'` |
| `rating` / `vote_average` | `rating` | `0` (número finito) |
| `schedule` / `schedules` / `horarios` | `schedule` | `[]` (copia) |
| `releaseDate` / `release_date` | `releaseDate` | `null` |

Decisiones relevantes:

1. **`adaptMovie` devuelve `null`** para entradas que no son objetos, y `adaptMovies` filtra esos `null`. Así un dato corrupto no rompe el `.map()` de la lista.
2. **Los estrenos pasan por el mismo adaptador** (`adaptPremiere` reutiliza `adaptMovie` y añade `isNew` y `badgeText`). No hay dos modelos distintos para cartelera y estrenos.
3. **Las imágenes que no existen** (`deadpool-3.jpg`, `inside-out-2.jpg` en el baseline) se sustituyen por el placeholder local `public/posters/placeholder.svg`; además los datos fuente apuntan a pósters que sí existen.
4. **El adaptador es una función pura**: se puede probar sin montar React, y por eso sus 4 pruebas son las más rápidas de la suite.

Lo que el adaptador **no** hace: no valida reglas de negocio ni autoriza nada. Solo normaliza forma. Un dato con forma correcta pero contenido falso pasaría el adaptador; eso se resuelve en el servidor, no en el cliente.

---

## 5. Aviso de favoritas: la tarjeta no sabe cómo se muestra

El flujo quedó así:

1. `App` guarda `notification` con `{ message, type }` y lo apaga con un `useEffect` de 2.8 s (temporizador con limpieza).
2. `App` pasa `toggleFavorite` a `MovieList`, que lo pasa a cada `MovieCard`.
3. `MovieCard` ejecuta `onToggleFavorite(movie.id)`. No importa `FavoriteToast`, no conoce el texto del aviso, no decide dónde aparece ni cuánto dura.
4. `FavoriteToast` se monta una sola vez al final de `App` y recibe `notification` + `onClose`.

Esto es inversión de control: la tarjeta notifica una **intención** («esta película cambió de estado»), y la raíz decide la **presentación**. Si mañana el aviso pasa de toast a banner o a una lista de actividad, `MovieCard` no cambia.

En el baseline la tarjeta recibía `onFavoriteNotification` para construir el mensaje ella misma; `MovieList` ni siquiera pasaba esa prop y el clic rompía la tarjeta. Ese acoplamiento es justo el que la tarea pedía eliminar.

El aviso es accesible: `role="status"`, `aria-live="polite"` y un botón «Cerrar aviso» con etiqueta.

---

## 6. `useDebounce`

```js
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

Se usa en `MovieSearch`, que mantiene el texto visible en estado local para que cada tecla se sienta instantánea, y solo avisa al padre cuando el valor lleva 300 ms quieto. `MovieSearch` está montado **dos veces** (buscador del banner y buscador de la lista); ese es el argumento de reutilización: la misma lógica de retardo sirve a dos contextos sin duplicar `useEffect`.

Detalle importante: `lastEmittedRef` evita que el efecto de sincronización externa dispare un aviso al padre cuando el cambio vino de él mismo (por ejemplo, al pulsar «Limpiar filtro»). Sin esa referencia se produce un bucle de actualizaciones.

---

## 7. `useWindowSize`

```js
const getWindowSize = () => ({
  width: typeof window === 'undefined' ? 0 : window.innerWidth,
  height: typeof window === 'undefined' ? 0 : window.innerHeight,
})
```

- Se inicializa con una función (`useState(getWindowSize)`) y protege el caso sin `window`, para no reventar en un entorno de pruebas o en un futuro render en servidor.
- Se suscribe **una vez** a `resize` y limpia el listener al desmontar.
- `App` lo usa para `columns` (`>=1200 → 3`, `>=768 → 2`, resto `1`).
- `PremiereCarousel` lo usa para `perView` (`>=900 → 2`, resto `1`).
- Hay como máximo dos suscripciones (una por componente que necesita el dato), no una por tarjeta. Ese es el punto: el ancho se lee en el nivel que decide el diseño, no en cada hoja del árbol.

Efecto secundario consciente: el primer render en un entorno sin `window` vale `0` y muestra una columna hasta que corre el efecto. En el navegador el valor inicial ya es el correcto.

---

## 8. `usePremieres`

El hook modela la petición con un solo estado explícito: `'loading' | 'success' | 'error'`, más `data`, `error` y `reload`.

```js
const { state, data, error, reload } = usePremieres({ delay, shouldFail: simulateError })
```

- **Determinista:** el fallo se pide con `shouldFail`, no con `Math.random()`. El baseline usaba probabilidad, así que ni las pruebas ni la demostración del estado de error eran reproducibles.
- **Reintento real:** `reload()` incrementa `reloadKey`, que está en las dependencias del efecto; volver a llamarlo repite la carga.
- **Sin carreras:** la bandera `cancelled` y el `clearTimeout` evitan actualizar estado después de desmontar o después de un reintento.
- **Datos adaptados:** `rawPremieres.map(adaptPremiere).filter(Boolean)`, es decir, la sección nunca ve la forma cruda.
- **Ubicación:** el hook vive dentro de `PremieresSection`, no en `App`. Los estrenos no los necesita nadie más; subirlos a la raíz sería estado global innecesario. Si otra sección los necesitara, se elevaría al ancestro común mínimo.

---

## 9. Skeleton y carrusel de estrenos

`PremieresSection` renderiza exactamente uno de tres estados:

| Estado | Qué se ve |
|--------|-----------|
| `loading` | `PremiereSkeleton`: tarjetas grises con la misma proporción que las reales, `role="status"` y etiqueta «Cargando estrenos» |
| `error` | Bloque `role="alert"` con el mensaje del hook y botón «Reintentar» |
| `success` | `PremiereCarousel` con los estrenos adaptados |

Hay además un botón «Simular error» para demostrar el estado de error en vivo sin tocar código. Al pulsar «Reintentar», la sección desactiva la simulación y llama `reload()`.

El carrusel no usa una librería: calcula `perView` con `useWindowSize`, limita el índice con `maxIndex` y mueve el track con `transform: translateX(...)`. Los controles tienen etiquetas (`Estrenos anteriores`, `Estrenos siguientes`, `Ir al grupo N`) y los slides fuera de vista llevan `aria-hidden`.

El skeleton no es un spinner: replica la estructura para que el contenido no «salte» al llegar. Eso es lo que pide la rúbrica de UI de carga.

---

## 10. Contador de favoritas en la raíz

`App` es dueño de `favorites` (arreglo de ids) y deriva `favoritesCount = favorites.length`. `Header` recibe **solo el número**:

```jsx
<Header tickets={tickets} favoritesCount={favoritesCount} />
```

Por qué no se pasa el arreglo:

- `Header` no filtra, no ordena ni muestra títulos; con el número le basta. Pasar la lista sería darle datos que no usa y acoplar la cabecera al modelo de favoritas.
- El contador es **derivado**, no un segundo estado. El baseline tenía `favoritesCount` en paralelo y lo actualizaba con una expresión que mezclaba `favorites` obsoleto y `prev` fuera de alcance; el resultado se desincronizaba. Un solo dueño elimina esa clase de error.
- La persistencia (`localStorage`) sigue en `App`, junto al estado que persiste. Ningún hijo escribe claves de almacenamiento por su cuenta.

Las tres tarjetas de la app que tocan favoritas quedan así: `MovieCard` notifica, `MovieList` transporta, `App` decide y `Header` y `FavoriteToast` presentan.

---

## 11. «Limpiar filtro» sincronizado

El texto de búsqueda vive en `App` (`query`). El botón del banner no limpia el DOM ni el input por su cuenta: llama `onQueryChange('')`.

`MovieSearch` sincroniza su estado local cuando cambia `value`:

```js
useEffect(() => {
  const nextValue = value ?? ''
  setInputValue(nextValue)
  lastEmittedRef.current = nextValue
}, [value])
```

Resultado verificable en la prueba de integración: al escribir «dune» en el buscador del banner y esperar 300 ms, el buscador de la lista muestra «dune» y la grilla solo contiene *Dune: Parte Dos*. Al pulsar «Limpiar filtro», **ambos** inputs quedan vacíos y vuelven las ocho películas. El listado y el banner nunca tuvieron estados separados que sincronizar: comparten la misma fuente.

---

## 12. Árbol de componentes y datos por nivel

```
App
│  estado propio: tickets:number · favorites:number[] · notification:{message,type}|null
│                 query:string · width:number (useWindowSize)
│  derivados:     favoritesCount = favorites.length · columns = 1|2|3 · adaptedMovies
│
├── Header                       ← tickets:number · favoritesCount:number
│
├── <main>
│   ├── Hero                     ← movie:AdaptedMovie|null · query:string · onQueryChange:(v)=>void
│   │   ├── MovieSearch          ← value:query · onChange:onQueryChange · id/label/placeholder
│   │   └── Button               ← children:'Limpiar filtro' · onClick:()=>onQueryChange('')
│   │
│   ├── PremieresSection         ← delay?:number   (sin datos: el hook vive aquí)
│   │   ├── Button               ← children:'Simular error'
│   │   ├── PremiereSkeleton     ← (sin props; solo se monta en loading)
│   │   └── PremiereCarousel     ← premieres:AdaptedPremiere[]
│   │       ├── useWindowSize    ← width:number (suscripción propia)
│   │       ├── slide × N        ← premiere:AdaptedPremiere
│   │       └── Button/dots      ← índice y callbacks internos
│   │
│   ├── MovieList                ← movies:AdaptedMovie[] · favorites:number[] · onToggleFavorite:(id)=>void
│   │                              onBuy:()=>void · query:string · onQueryChange:(v)=>void · columns:number
│   │   ├── MovieSearch          ← value:query · onChange:onQueryChange
│   │   ├── Button (filtros)     ← children:clasificación
│   │   └── MovieCard × N        ← movie:AdaptedMovie · isFavorite:boolean
│   │       │                       onToggleFavorite:(id)=>void · onBuy:()=>void
│   │       └── Button × 3 tipos ← horarios · compra · favorita
│   │
│   └── Footer                   ← (sin props)
│
└── FavoriteToast                ← notification:{message,type}|null · onClose:()=>void
```

| Nivel | Qué dato conoce | Qué NO conoce |
|-------|-----------------|---------------|
| `App` | tickets, lista completa de favoritas, query, aviso, ancho de ventana | cómo se dibuja cada tarjeta o el carrusel |
| `Header` | número de entradas y número de favoritas | ids, títulos, cómo se calcula el número |
| `Hero` | película destacada adaptada, query y callback | la lista completa, el estado de favoritas |
| `PremieresSection` | estado de la petición de estrenos (vía hook) | favoritas, búsqueda, tickets |
| `PremiereCarousel` | estrenos adaptados y ancho de ventana | el origen de los datos |
| `MovieList` | películas adaptadas, favoritas, query, columnas, callbacks | cómo se persiste o cómo se muestra el aviso |
| `MovieCard` | una película, si es favorita, callbacks | el arreglo global, el toast, `localStorage` |
| `FavoriteToast` | el mensaje ya construido | qué película lo provocó |

### Por qué el contador de favoritas no puede vivir en `Header`

1. **El ancestro común mínimo de los datos es `App`.** Las favoritas las cambian tarjetas que están dentro de `MovieList`, y el número lo muestra `Header`, que es hermano de `main`. El único componente que es ancestro de ambos es `App`. Si el estado viviera en `Header`, las tarjetas no tendrían forma de modificarlo sin pasar callbacks hacia arriba por ramas que no lo necesitan.
2. **`Header` no puede derivar el número.** Solo recibe lo que el padre le da. Si guardara su propio contador, necesitaría que alguien le avisara de cada cambio; ese «alguien» tendría que ser igualmente `App`, con lo que el estado seguiría en la raíz y además duplicado.
3. **El contador es una función del arreglo.** `favoritesCount = favorites.length` no es un dato independiente. Guardarlo aparte crea dos fuentes de verdad que se desincronizan (fue exactamente el defecto #3 del baseline).
4. **Persistencia y consistencia.** `localStorage` se escribe desde el mismo lugar que posee el arreglo. Tener el contador en la cabecera obligaría a que la cabecera conociera la clave de almacenamiento, mezclando presentación con persistencia.

Regla aplicada: **el estado vive en el ancestro común más cercano que lo necesita, y lo derivable no se guarda.**

---

## 13. Pruebas y medición antes/después

Herramientas: **Vitest 2.1.9**, **jsdom**, **@testing-library/react** y **@testing-library/user-event**. Los comandos son:

```bash
npm test           # una pasada
npm run test:watch # modo interactivo
npm run build      # compilación de producción
```

### Resultado global

| Momento | Archivos | Pruebas | Pasan | Fallan |
|---------|----------|---------|-------|--------|
| Baseline de la IA (`99ada9e`) | 10 | 22 | 5 | 17 |
| Versión final | 10 | **26** | **26** | **0** |

Evidencias completas: `docs/evidencias/test-before.txt`, `docs/evidencias/test-after.txt` y `docs/evidencias/build-after.txt` (`vite build` → 48 módulos, sin errores).

### Antes/después por arreglo

| Arreglo | Archivo de prueba | Antes | Después |
|---------|-------------------|-------|---------|
| Adaptador de datos | `movieAdapter.test.js` | 0/4 | 4/4 |
| `useDebounce` | `useDebounce.test.jsx` | 0/2 | 2/2 |
| `useWindowSize` | `useWindowSize.test.jsx` | 0/2 | 2/2 |
| `usePremieres` | `usePremieres.test.jsx` | 0/3 | 3/3 |
| Buscador con debounce | `MovieSearch.test.jsx` | 1/2 | 2/2 |
| Cabecera con contador | `Header.test.jsx` | 2/2 | 2/2 |
| Aviso sin acoplar la tarjeta | `MovieCard.test.jsx` | 2/3 | 3/3 |
| Grilla y búsqueda compartida | `MovieList.test.jsx` | no compilaba (0 pruebas) | 3/3 |
| Sección de estrenos | `PremieresSection.test.jsx` | no compilaba (0 pruebas) | 1/1 |
| Integración de estado en la raíz | `App.test.jsx` | 0/4 | 4/4 |

Qué cubre cada grupo:

- **Adaptador:** traducción de campos, valores por defecto sin inventar clasificación, `null` para entradas inválidas y filtrado, insignia de estreno sin perder el modelo base.
- **`useDebounce`:** valor inicial, actualización exactamente al vencer el retardo (299 ms no, 300 ms sí) y cancelación cuando el valor cambia rápido.
- **`useWindowSize`:** lectura inicial y actualización por `resize`; tras desmontar, un nuevo `resize` ya no actualiza el valor.
- **`usePremieres`:** `loading → success` con datos adaptados, `loading → error` determinista, y reintento tras cambiar `shouldFail`.
- **Componentes:** el buscador avisa una sola vez tras el retardo; la cabecera refleja el número recibido; la tarjeta llama `onToggleFavorite` sin renderizar el aviso; la lista filtra por query y aplica columnas.
- **Estrenos:** el esqueleto aparece primero, luego el carrusel, y el estado de error se puede provocar y reintentar.
- **`App`:** contador elevado + aviso + persistencia; sincronización banner/lista/limpiar; cambio de columnas por ancho de ventana; montaje de estrenos.

La suite se ejecutó al menos dos veces: una contra el código del baseline (documentada, con 17 fallos) y otra contra la versión final (26/26). La diferencia no es solo «más pruebas»: las pruebas existían antes de arreglar el código, y por eso el baseline falla.

---

## 14. Preguntas de revisión (cuatro por hook)

### `useDebounce`

**1. ¿Por qué el retardo vive en un hook y no en un `useEffect` dentro de `App`?**
Porque la lógica es reutilizable y no pertenece al estado global. `MovieSearch` se monta dos veces; con el hook, ambas instancias comparten la misma implementación y su propia limpieza. Si viviera en `App`, solo el buscador conectado a `App` podría beneficiarse y la lógica quedaría mezclada con tickets, favoritas y estrenos.

**2. ¿Qué ocurre si el componente se desmonta antes de que venza el temporizador?**
El `useEffect` devuelve `clearTimeout(timer)`. Al desmontar, React ejecuta la limpieza y el `setDebouncedValue` pendiente nunca corre. Sin esa limpieza, el temporizador intentaría actualizar un componente desmontado y dejaría trabajo inútil (y advertencias en desarrollo).

**3. Si el padre limpia el filtro, ¿por qué el input no se queda con el texto viejo?**
`MovieSearch` mantiene `inputValue` local, pero un efecto observa la prop `value` y sincroniza el input cuando el padre la cambia. Además `lastEmittedRef` registra el último valor emitido para no reenviar al padre el mismo cambio que acaba de llegar de él, evitando un ciclo de actualizaciones.

**4. ¿El debounce reduce el costura del filtrado?**
Reduce la **frecuencia**: de una escritura por tecla a una escritura tras 300 ms de pausa. No reduce el coste de un filtrado concreto ni sustituye la paginación o una búsqueda en servidor. Es una mejora de UX y de trabajo repetido, no un algoritmo de búsqueda. Además introduce 300 ms de latencia percibida, un intercambio deliberado.

### `useWindowSize`

**1. ¿Por qué no calcula cada `MovieCard` cuántas tarjetas caben?**
Porque el número de columnas es una decisión de **diseño de la grilla**, no de la tarjeta. Si cada tarjeta leyera el ancho, habría N suscripciones a `resize` y N decisiones que podrían diferir. `App` decide una vez y `MovieList` aplica una clase coherente a toda la grilla.

**2. ¿Cómo se evita romper en un entorno sin `window`?**
`getWindowSize` comprueba `typeof window === 'undefined'` y devuelve `{ width: 0, height: 0 }`. Eso permite renderizar en pruebas o en un futuro SSR sin `ReferenceError`. En el navegador el efecto inicial corrige el valor de inmediato.

**3. ¿Cuántas suscripciones a `resize` crea la aplicación?**
Dos: una en `App` (columnas) y otra en `PremiereCarousel` (estrenos por vista). No hay una por tarjeta ni una por slide. Es el coste mínimo para dos decisiones de diseño independientes.

**4. ¿Cómo se demuestra que el listener se limpia?**
La prueba monta el hook, cambia el ancho a 640 y dispara `resize`: el valor pasa a 640. Después desmonta, cambia el ancho a 320 y vuelve a disparar `resize`: el valor sigue en 640. Si el listener no se hubiera eliminado, el valor habría cambiado.

### `usePremieres`

**1. ¿Por qué un solo `state` con tres valores y no tres booleanos (`isLoading`, `isError`, `hasData`)?**
Porque los booleanos permiten combinaciones imposibles (cargando y con error a la vez, éxito sin datos). Un estado enumerado hace que la UI tenga exactamente tres ramas y que la sección no necesite priorizar condiciones. Es la misma idea de «hacer imposible el estado imposible».

**2. ¿Por qué `shouldFail` en lugar de `Math.random()`?**
Porque una probabilidad hace que la prueba y la demostración fallen de forma intermitente: el mismo código puede dar éxito o error. `shouldFail` convierte el error en una entrada explícita y determinista. También permite que la UI ofrezca el botón «Simular error» sin efectos aleatorios en producción.

**3. ¿Cómo se evita una actualización de estado después de desmontar o de un reintento?**
El efecto declara `let cancelled = false`, guarda el `setTimeout` y, en su limpieza, pone `cancelled = true` y hace `clearTimeout`. El callback comprueba `if (cancelled) return` antes de tocar estado. Como `reloadKey` está en las dependencias, un reintento limpia el efecto anterior y empieza de cero.

**4. ¿Por qué el hook vive en `PremieresSection` y no en `App`?**
Porque el dato solo lo consume esa sección. Elevarlo a `App` obligaría a pasar `data`, `error` y `reload` por props hasta el carrusel y haría que la raíz se enterara de una petición que no le incumbe. Si otra parte de la app necesitara los estrenos, el hook se elevaría al ancestro común mínimo, no antes.

---

## 15. ¿La interfaz de props es una frontera de seguridad?

**No.** Las props son un contrato de **flujo de datos y responsabilidades**, no un mecanismo de control de acceso.

Razones concretas en esta aplicación:

1. **Todo el código corre en el cliente del usuario.** El bundle de JavaScript incluye el adaptador, los datos y la lógica de favoritas. Cualquiera puede abrirlo con las herramientas del navegador, leer `localStorage` o modificar el estado con React DevTools. Que `Header` no reciba la lista completa no impide que alguien la obtenga desde el mismo origen.
2. **El padre puede pasar cualquier cosa.** Que `MovieCard` espere `isFavorite: boolean` no impide que un componente padre (o una modificación del código) le pase un objeto, un `true` inventado o un callback distinto. React no valida tipos en ejecución sin `prop-types`/TypeScript, y aun con ellos la validación es de desarrollo, no de seguridad.
3. **Ocultar un dato no es autorizarlo.** No pasar los ids de favoritas a `Header` es una decisión de diseño (evitar acoplamiento), no una protección: el arreglo sigue en memoria y en `localStorage`. La frontera real de seguridad es el **servidor**: autenticación, autorización por recurso y validación de cada petición. Si el cliente pudiera decidir qué es favorito de otro usuario, ningún reparto de props lo arreglaría.
4. **La interfaz de props sí aporta otra cosa.** Hace explícito qué necesita cada componente, reduce el acoplamiento, facilita las pruebas y limita el daño de un cambio (el adaptador es el único que conoce la forma cruda). Eso es ingeniería de mantenibilidad, no seguridad.

En resumen: **el límite de confianza está en el servidor; las props solo describen la forma en que la interfaz se compone.** Tratar las props como seguridad sería como cerrar la puerta de una habitación mientras la casa no tiene techo.

---

## 16. Uso de la IA y control de calidad

La IA se usó como generador de borradores y de pruebas, no como fuente de verdad. Cada salida se contrastó con el comportamiento observable (pruebas, `npm run build`, revisión del diff). La versión original quedó congelada en `99ada9e` antes de corregir.

| Tarea | Qué se pidió a la IA | Qué devolvió | Evidencia | Decisión |
|-------|----------------------|--------------|-----------|----------|
| Estilos y tipografía | «Amplía la hoja con tokens, escala tipográfica y estilos para aviso, carrusel y skeleton» | Variables, `clamp()`, utilidades y animaciones | `ba8230d`, `src/styles/index.css` | Aceptado y ajustado: se eliminó `transition-transform` (propiedad inválida) y se alinearon las clases del grid con las que genera JS |
| Adaptador | «Crea una utilidad que traduzca los datos crudos al modelo de la app» | `adaptMovie`/`adaptMovies` con valores por defecto | `14b4672`, 4 pruebas | Aceptado con correcciones: `null` para entradas inválidas y placeholder local |
| Aviso de favoritas | «Muestra un aviso sin que la tarjeta sepa cómo se presenta» | Estado `notification` en `App` + componente `FavoriteToast` | `804473e`, pruebas de `App` y `MovieCard` | Aceptado; se rechazó la variante del baseline que pasaba `onFavoriteNotification` a la tarjeta |
| `useDebounce` | «Extrae el retardo a un hook reutilizable» | Hook con `useState`/`useEffect` | `0b35d50`, 2 pruebas | Aceptado; se añadió sincronización externa en `MovieSearch` |
| `useWindowSize` | «Hook para saber el ancho y decidir columnas» | Hook con listener de `resize` | `0b35d50`, 2 pruebas + integración en `App` | Aceptado; se añadió la protección `typeof window` |
| `usePremieres` | «Hook con estados de carga, datos y error, y reintento» | Primera versión con `Math.random()` y sin `reload` | Baseline `6f808fc` vs. `0b35d50` | **Rechazado el azar**; reescrito con `shouldFail`, `reload` y bandera de cancelación |
| Skeleton y carrusel | «Sección de estrenos con esqueleto, error y carrusel» | Componentes y controles | `3596b35`, prueba de `PremieresSection` | Aceptado; se añadieron etiquetas ARIA y el botón de reintento |
| Elevar favoritas | «El contador debe mostrarse en la cabecera sin pasar la lista» | `favoritesCount` como estado aparte | Baseline `6f808fc` | **Rechazado**; se sustituyó por `favorites.length` derivado |
| Limpiar filtro | «Botón del banner que limpie buscador y listado» | Llamada a `onQueryChange('')` | `0201e91`, prueba de integración | Aceptado; se corrigió el bucle con `lastEmittedRef` |
| Pruebas | «Cubre adaptador, hooks, componentes e integración» | 10 archivos, 26 pruebas | `7c6dedf`, `test-after.txt` | Aceptado tras ajustar una prueba ambigua con `within(grid())` |

### Diff rechazado 1 — `usePremieres` con azar y sin reintento

Versión de la IA (baseline `6f808fc`):

```diff
-export const usePremieres = (delay = 1000, errorChance = 0.2) => {
+export const usePremieres = ({ delay = 1200, shouldFail = false } = {}) => {
   const [state, setState] = useState('loading')
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
+  const [reloadKey, setReloadKey] = useState(0)
+
+  const reload = useCallback(() => {
+    setReloadKey((key) => key + 1)
+  }, [])
 
   useEffect(() => {
-    setState('loading')
-    setData([])
-    setError(null)
+    let cancelled = false
 
     const timer = setTimeout(() => {
-      if (Math.random() < errorChance) {
+      if (cancelled) return
+
+      if (shouldFail) {
         setError({ code: 'NETWORK_ERROR', message: '...' })
         setState('error')
-      } else {
-        setData(simulatedData)
-        setState('success')
+        return
       }
+
+      setData(rawPremieres.map(adaptPremiere).filter(Boolean))
+      setState('success')
     }, delay)
 
-    return () => clearTimeout(timer)
-  }, [])
+    return () => {
+      cancelled = true
+      clearTimeout(timer)
+    }
+  }, [delay, shouldFail, reloadKey])
 
-  return { state, data, error }
+  return { state, data, error, reload }
 }
```

Por qué se rechazó: el azar hacía que la misma acción pudiera dar éxito o error, así que ni la prueba del estado de error ni la demostración eran confiables; además no había forma de reintentar. La versión final conserva los tres estados, pero con una entrada explícita y un reintento reproducible.

### Diff rechazado 2 — contador de favoritas duplicado

Versión de la IA (baseline `6f808fc`):

```diff
-  const [favoritesCount, setFavoritesCount] = useState(favorites.length)
...
   const toggleFavorite = (movieId) => {
     setFavorites((prev) =>
       prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
     )
-    setFavoritesCount(favorites.length + (prev.includes(movieId) ? -1 : 1))
+    const isFavorite = favorites.includes(movieId)
+    setNotification({
+      message: isFavorite ? 'Película quitada de favoritas' : 'Película añadida a favoritas',
+      type: isFavorite ? 'info' : 'success',
+    })
   }
...
-  const cols = width > 1200 ? 3 : width > 768 ? 2 : 1
-  const featured = adaptMovie(movies[0])
+  const columns = width >= 1200 ? 3 : width >= 768 ? 2 : 1
+  const adaptedMovies = useMemo(() => adaptMovies(rawMovies), [])
+  const featured = adaptedMovies[0] ?? null
+  const favoritesCount = favorites.length
```

Por qué se rechazó: `prev` no existe fuera del actualizador y `favorites` es el valor del render anterior; el contador se desincronizaba. Además `cols` se calculaba pero nunca llegaba a `MovieList`, y `adaptMovie` no estaba importado. La versión final deriva el contador del arreglo y pasa `columns` explícitamente.

---

## 17. Observaciones y conclusiones

1. **Estado en el ancestro común mínimo.** Favoritas y query subieron a `App` porque las necesitan ramas distintas del árbol. Estrenos, clasificación, horario y confirmación se quedaron locales porque solo los usa su componente. La regla no es «todo arriba», es «tan arriba como haga falta y no más».
2. **Lo derivable no se guarda.** El contador de favoritas es `favorites.length`; las columnas son una función del ancho; la lista filtrada es una función de `query` y la clasificación. Cada estado paralelo que se eliminó era una oportunidad menos de desincronización.
3. **Los hooks encapsulan comportamiento, no datos globales.** `useDebounce`, `useWindowSize` y `usePremieres` son piezas pequeñas y probables por separado. `MovieSearch` demuestra la reutilización real al montarse dos veces.
4. **La tarjeta no sabe cómo se presenta su acción.** `MovieCard` notifica; `App` decide el aviso. Esa separación permitió probar la tarjeta sin montar el toast y cambiar la presentación sin tocar la tarjeta.
5. **La IA acelera el borrador, no reemplaza la revisión.** Los 13 defectos del baseline incluían hooks sin importar, estado duplicado, una prop que nadie pasaba y clases CSS inexistentes. La suite escrita antes de corregir convirtió esos fallos en una lista verificable, y la evidencia conserva el antes y el después.
6. **La interfaz de props no es seguridad.** Ordena el flujo de datos y facilita el mantenimiento; la autorización real pertenece al servidor.

### Reproducir la entrega

```bash
git clone https://github.com/yo-sud/Django-lab11.git
cd Django-lab11
git checkout feature/semana-11-hooks
npm install
npm test        # 10 archivos, 26 pruebas en verde
npm run build   # compilación de producción
npm run dev     # http://localhost:5173
```

---

## Anexo: archivos nuevos o modificados

| Archivo | Tipo | Propósito |
|---------|------|-----------|
| `src/hooks/useDebounce.js` | nuevo | Retardo reutilizable de valores |
| `src/hooks/useWindowSize.js` | nuevo | Ancho/alto de ventana con limpieza |
| `src/hooks/usePremieres.js` | reescrito | Carga, éxito, error y reintento |
| `src/utils/movieAdapter.js` | reescrito | Normalización de datos crudos |
| `src/data/premieres.js` | nuevo | Datos fuente de estrenos |
| `src/components/MovieSearch.jsx` | reescrito | Input controlado + debounce + sincronización |
| `src/components/FavoriteToast.jsx` | nuevo | Presentación del aviso |
| `src/components/PremieresSection.jsx` | nuevo | Sección con los tres estados |
| `src/components/PremiereCarousel.jsx` | nuevo | Carrusel responsive |
| `src/components/PremiereSkeleton.jsx` | nuevo | UI de carga |
| `src/components/MovieCard.jsx` | modificado | Solo notifica la intención |
| `src/components/MovieList.jsx` | modificado | Filtro compartido y columnas |
| `src/components/Header.jsx` | modificado | Recibe el número, no la lista |
| `src/components/Hero.jsx` | modificado | Buscador y «Limpiar filtro» |
| `src/App.jsx` | reescrito | Dueño del estado y composición |
| `src/styles/index.css` | ampliado | Tokens, tipografía, grilla y estados |
| `src/test/*` | nuevos | 10 archivos, 26 pruebas |
| `docs/IA_BASELINE.md` | nuevo | Defectos congelados antes de corregir |
| `docs/evidencias/*` | nuevos | Salidas reales de pruebas y build |
