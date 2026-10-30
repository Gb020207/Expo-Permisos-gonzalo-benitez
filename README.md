# Mantenimiento IPF

**Descripción**: aplicación móvil para que alumnos y docentes reporten desperfectos del Instituto Politécnico Formosa y reciban notificaciones cuando se resuelvan.

## Tecnologías
- **Expo SDK 58**
- **React Native 0.88.1**
- **TypeScript 6.0.3**
- **Expo Router** (navegación basada en archivos en `src/app/`)
- **expo-camera**, **expo-location**, **expo-image-picker**, **expo-notifications**
- **@react-native-async-storage/async-storage** para persistencia local

## Versión de Expo SDK
```json
"expo": "~58.0.21"
```

## Requisitos para ejecutar
1. Tener **Node.js 20+** y **bun** (el proyecto usa `bun.lock`).
2. Instalar las dependencias con `npx expo install` (ya ejecutado).
3. Ejecutar con `npm start` o `bunx expo start`.
4. Para probar funcionalidades que requieren código nativo (cámara, QR, notificaciones) generar una **development build**:
   ```bash
   npx eas build --profile development --platform ios   # o android
   ```
   Luego instalar el build en el dispositivo.

## Comandos útiles
- `npm start` – inicia Expo Go.
- `npm run android` / `npm run ios` – abre la app en el emulador o dispositivo.
- `npm run web` – ejecuta la versión web.
- `npm run lint` – lint del proyecto.
- `npx expo-doctor` – diagnóstico de configuración.

## Árbol de `src/app/`
```
src/app/
├─ _layout.tsx          # Layout raíz con ThemeProvider y splash
├─ index.tsx            # Pantalla de bienvenida (Home)
├─ reporte/
│   ├─ index.tsx       # Lista de reportes propios
│   ├─ nuevo.tsx       # Formulario para crear un reporte
│   └─ [id].tsx        # Detalle del reporte y simulación de resolución
├─ avisos/
│   └─ index.tsx       # Bandeja interna de avisos
├─ permisos/
│   ├─ index.tsx       # Panel de permisos (cámara, ubicación, notificaciones)
│   └─ [recurso].tsx   # Pantalla modal previa al solicitar permiso
└─ ajustes-app.tsx      # Configuración de notificaciones (switch)
```

## Arquitectura
- **Hooks** en `src/hooks/`: `usePermiso` (gestión unificada de permisos) y `useReportes` (carga y CRUD de reportes).
- **Componentes UI** en `src/components/`: tarjetas, botones, pantalla de permisos, etc.
- **Lógica de almacenamiento** en `src/lib/`: tipos (`tipos.ts`), funciones de AsyncStorage (`almacenamiento.ts`), acceso a reportes (`reportes.ts`).
- **Navegación**: `expo-router` crea automáticamente stacks y tabs mediante `NativeTabs` definido en `src/components/app-tabs.tsx`.

## Plugins de `app.json`
```json
{
  "expo": {
    "plugins": [
      ["expo-camera", {"cameraPermission": "Usamos tu cámara para escanear el código QR del aula y registrar el lugar del desperfecto."}],
      ["expo-location", {"locationPermission": "Usamos tu ubicación para señalar dónde se encuentra el desperfecto dentro del Instituto."}],
      "expo-notifications"
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Usamos tu cámara para escanear el código QR del aula y registrar el lugar del desperfecto.",
        "NSLocationWhenInUseUsageDescription": "Usamos tu ubicación para señalar dónde se encuentra el desperfecto dentro del Instituto.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "",
        "NSPhotoLibraryUsageDescription": "Permite seleccionar fotos de la galería para adjuntarlas al reporte."
      }
    }
  }
}
```

## Tabla de permisos
| Recurso      | Módulo Expo          | Cuándo se pide                     | Alternativa                               |
|-------------|----------------------|-----------------------------------|-------------------------------------------|
| Cámara      | expo-camera          | Al escanear QR o al tomar foto   | El usuario puede ingresar el aula manualmente |
| Ubicación   | expo-location        | Al marcar ubicación en el reporte | Selección manual de sector (Patio, Pasillo, etc.) |
| Notificaciones | expo-notifications | Al activar el switch en ajustes   | Avisos internos en la app (bandeja) |
| Fotos (galería) | expo-image-picker | Al elegir foto de la galería (no se pide permiso) | — |

## Justificación de `blockedPermissions`
Se bloquean permisos que el proyecto **no** utiliza directamente:
- `SYSTEM_ALERT_WINDOW` – sólo necesario para overlays del sistema.
- `RECORD_AUDIO` – no hay funcionalidad de audio.
- `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` – el selector de imágenes del sistema no requiere permiso explícito.
- `ACCESS_BACKGROUND_LOCATION` – la app nunca solicita ubicación en segundo plano.

## Diferencias Expo Go vs Development Build
- **Expo Go** incluye sólo los módulos compatibles con la versión de Expo y no permite módulos nativos que requieran compilación (ej. escáner QR). En esa modalidad se muestra el mensaje de *development build required*.
- **Development Build** (generada con `eas build --profile development`) incluye los plugins nativos configurados en `app.json`, permite el escáner QR y las notificaciones locales.

## Diferencias SDK 57 → SDK 58
- Cambios en la API de permisos: `Permissions.askAsync` (SDK 57) fue reemplazado por los métodos específicos de cada módulo (`requestCameraPermissionsAsync`, `requestForegroundPermissionsAsync`, etc.).
- Introducción de **provisional notifications** en iOS y mejor manejo de permisos aproximados de ubicación.
- `expo-splash-screen` ahora requiere llamar a `preventAutoHideAsync` antes de renderizar la UI (ya implementado).

---

*Este documento se mantiene actualizado con la última versión del proyecto.*
