# Frontend Cuidarte

Aplicación móvil (frontend) de Cuidarte, construida con Expo y React Native. Este repositorio contiene únicamente la capa cliente; la API y servicios se deben configurar aparte mediante variables de entorno.

## Tecnologías

- Expo
- React Native
- TypeScript

## Requisitos

- Node.js (16+ recomendado)
- npm o Yarn
- Expo Go (para probar en dispositivo) o Expo Dev Client

## Instalación

```bash
npm install
```

## Variables de entorno

Configura al menos:

- `EXPO_PUBLIC_API_URL`: URL base del backend (por ejemplo `https://api.example.com`).

Si no configuras `EXPO_PUBLIC_API_URL`, la app intentará conectarse a `http://localhost:3000` por defecto.
En emulador Android usa `http://10.0.2.2:3000` (el valor por defecto ya detecta esto).

Otras variables relacionadas con notificaciones push o servicios externos pueden añadirse según el entorno.

## Ejecutar en desarrollo

```bash
npm start
```

Usa Expo Go para escanear el QR y abrir la app en tu dispositivo, o ejecuta en emulador/simulador según tu flujo de trabajo.

## Estructura del proyecto

Carpetas principales dentro de `src`:

- `auth` — pantallas de autenticación (login, registro, recuperación)
- `common` — componentes reutilizables, hooks y utilidades
- `modules` — funcionalidades por dominio (`family`, `senior`, ...)
- `services` — integración con APIs, cámaras, localización y notificaciones
- `store` — estado global (Zustand/mobx/redux según implementación)
- `types` — definiciones TypeScript

## Contribuir

1. Haz un fork y crea una rama con tu feature: `git checkout -b feat/mi-cambio`.
2. Instala dependencias y prueba localmente.
3. Abre un pull request con descripción clara.

## Licencia

Incluye la licencia del proyecto según corresponda.

---

Para detalles sobre rutas, servicios o cómo conectar el backend, revisa el código en `src/` y los servicios en `src/services`.
