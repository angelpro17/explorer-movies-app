# 🎬 Explorer Movies App

Una aplicación moderna y profesional para explorar películas utilizando la API de TMDB (The Movie Database).

## ✨ Características Principales

### 🎯 Funcionalidades Básicas
- **Búsqueda de películas** con debounce automático
- **Catálogo completo** con diferentes categorías
- **Sistema de favoritos** persistente en localStorage
- **Watchlist personal** para películas por ver
- **Navegación intuitiva** entre secciones

### 🎨 Diseño Profesional
- **Interfaz moderna** con Material Design 3
- **Diseño responsive** para todos los dispositivos
- **Animaciones suaves** y transiciones elegantes
- **Gradientes y sombras** para profundidad visual
- **Tipografía optimizada** para mejor legibilidad

### 🔍 Filtros Avanzados
- **Filtro por géneros** con selección múltiple
- **Rango de años** personalizable
- **Calificación mínima** con slider interactivo
- **Ordenamiento** por popularidad, calificación, fecha o título
- **Filtros combinables** para resultados precisos

### 📱 Categorías de Películas
- **Populares** - Las más vistas del momento
- **Mejor Valoradas** - Películas con mejores críticas
- **Próximos Estrenos** - Películas por venir
- **En Cartelera** - Películas actualmente en cines

### 🎥 Detalles Mejorados
- **Página de detalle completa** con información extensa
- **Trailer integrado** de YouTube
- **Películas similares** recomendadas
- **Información técnica** (presupuesto, ingresos, estado)
- **Géneros y metadatos** completos

### 💾 Gestión de Datos
- **Persistencia local** de favoritos y watchlist
- **Sincronización automática** entre componentes
- **Manejo de errores** robusto
- **Estados de carga** informativos

## 🚀 Tecnologías Utilizadas

- **Angular 17** - Framework principal
- **Angular Material** - Componentes UI
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **TMDB API** - Datos de películas
- **CSS Grid & Flexbox** - Layout moderno
- **LocalStorage** - Persistencia de datos

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd ExplorerMoviesApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear el archivo `src/app/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     tmdbApiKey: 'TU_API_KEY_DE_TMDB',
     tmdbBaseUrl: 'https://api.themoviedb.org/3'
   };
   ```

4. **Obtener API Key de TMDB**
   - Registrarse en [TMDB](https://www.themoviedb.org/settings/api)
   - Copiar la API Key y agregarla al archivo de environment

5. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

## 🎯 Uso de la Aplicación

### Navegación Principal
- **Inicio**: Catálogo general con búsqueda y filtros
- **Favoritas**: Películas marcadas como favoritas
- **Watchlist**: Películas agregadas para ver después

### Búsqueda y Filtros
1. Usar la barra de búsqueda para encontrar películas específicas
2. Expandir "Filtros Avanzados" para opciones detalladas
3. Seleccionar categorías en las pestañas superiores
4. Aplicar múltiples filtros simultáneamente

### Gestión de Películas
- **Agregar a favoritos**: Click en el corazón ❤️
- **Agregar a watchlist**: Click en el marcador 📖
- **Ver detalles**: Click en "Ver detalles" o en la tarjeta

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── movies/
│   │   ├── movies.component.ts          # Componente principal
│   │   ├── movie-detail.component.ts    # Detalle de película
│   │   ├── movie-card.component.ts      # Tarjeta de película
│   │   ├── movie-filters.component.ts   # Filtros avanzados
│   │   ├── movie-categories.component.ts # Categorías
│   │   └── *.html, *.css                # Templates y estilos
│   ├── services/
│   │   └── movies.service.ts            # Servicio de API
│   ├── environments/
│   │   └── environment.ts               # Configuración
│   └── app.*                            # Componente raíz
├── styles.css                           # Estilos globales
└── main.ts                              # Punto de entrada
```

## 🔧 Configuración Avanzada

### Personalización de Estilos
- Modificar `src/styles.css` para cambios globales
- Editar archivos CSS de componentes para estilos específicos
- Usar variables CSS para temas personalizados

### Agregar Nuevas Funcionalidades
- Crear nuevos componentes en `src/app/movies/`
- Extender el servicio en `src/app/services/movies.service.ts`
- Actualizar rutas en `src/app/app.routes.ts`

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** (1200px+): Layout completo con sidebar
- **Tablet** (768px-1199px): Layout adaptativo
- **Mobile** (<768px): Layout vertical optimizado

## 🐛 Solución de Problemas

### Error de API
- Verificar que la API Key sea válida
- Comprobar conexión a internet
- Revisar límites de rate limiting de TMDB

### Problemas de Rendimiento
- Las imágenes se cargan con lazy loading
- Los datos se cachean en localStorage
- Debounce en búsquedas para optimizar requests

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [TMDB](https://www.themoviedb.org/) por proporcionar la API
- [Angular Material](https://material.angular.io/) por los componentes UI
- [Angular](https://angular.io/) por el framework

---

**Desarrollado con ❤️ usando Angular y Material Design**
# explorer-movies-app
