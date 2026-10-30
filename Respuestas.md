# Respuestas del Trabajo Práctico N.º 3 – Permisos móviles

## PARTE A

**A1.** Los permisos son autorizaciones que el sistema operativo otorga a una aplicación para que pueda acceder a recursos sensibles (cámara, ubicación, contactos, etc.).

**A2.** Android utiliza un modelo de **sandbox**: cada aplicación se ejecuta en su propio proceso con UID único y no puede acceder a los datos de otras apps sin permiso explícito.

**A3.** Los permisos deben declararse en el *AndroidManifest.xml* (Android) o en el *Info.plist* (iOS) y solicitarse en tiempo de ejecución cuando la funcionalidad lo requiera.

**A4.** Estados comunes:
- **grant** / **granted** – permiso concedido.
- **denied** – denegado y no se puede volver a preguntar (el usuario debe ir a Ajustes).
- **undetermined** / **prompt** – aún no se ha preguntado.
- **restricted** (iOS) – el sistema impide la solicitud.

**A5.** Verdadero/Falso:
1. En Android los permisos se piden siempre al instalar la app. – **Falso** (a partir de Android 6.0 se piden en tiempo de ejecución).
2. iOS permite solicitar permiso de cámara sin haberlo declarado en *Info.plist*. – **Falso**.
3. Un permiso denegado con "No volver a preguntar" se considera bloqueado. – **Verdadero**.

---

## PARTE B

**B1.** Clasificación (Android 13+):
- **Normal** – otorgado automáticamente (INTERNET).
- **Dangerous** – requieren confirmación del usuario (CAMERA, LOCATION, STORAGE).
- **Signature** – solo para apps del mismo firmante del sistema.

**B2.** Grupos de permisos (ejemplo):
- *CALENDAR*: READ_CALENDAR, WRITE_CALENDAR.
- *CAMERA*: CAMERA.
- *LOCATION*: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION.
- *STORAGE*: READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE.

**B3.** En *AndroidManifest.xml* declaramos `<uses-permission android:name="android.permission.CAMERA" />`. En Expo se hace vía *app.json* → `plugins`.

**B4.** Desde Android 12 (API 31) se introducen **approximate location** (`ACCESS_COARSE_LOCATION`). El SDK de la app debe indicar `android:targetSdkVersion` ≥ 31 para que el sistema ofrezca la opción de permiso aproximado.

**B5.** Google Play exige que los permisos declarados coincidan con la funcionalidad real de la app; los permisos innecesarios pueden ser rechazados en la revisión.

---

## PARTE C

**C1.** En *Info.plist* se declara la clave `NSCameraUsageDescription` con un texto que explica el porqué se necesita la cámara.

**C2.** Otros permisos iOS típicos:
- `NSLocationWhenInUseUsageDescription` – ubicación en primer plano.
- `NSLocationAlwaysAndWhenInUseUsageDescription` – ubicación en segundo plano (no usada en este TP).
- `NSPhotoLibraryUsageDescription` – acceso a la galería.

**C3.** Diferencias:
- Android permite permisos aproximados (`ACCESS_COARSE_LOCATION`), iOS sólo tiene la precisión fina; iOS ofrece *provisional* notifications.
- En Android el permiso se solicita mediante `requestPermissions`, en iOS se usa `requestWhenInUseAuthorization` de `expo-location`.

---

## PARTE D

**D1.** En Expo SDK 58 los módulos recomendados son:
- `expo-camera` → `requestCameraPermissionsAsync` / `getCameraPermissionsAsync`.
- `expo-location` → `requestForegroundPermissionsAsync`.
- `expo-image-picker` no necesita permiso explícito de galería, usa el selector del sistema.
- `expo-notifications` → `requestPermissionsAsync`.

**D2.** Cada módulo devuelve un `PermissionResponse` con campos `status`, `granted`, `canAskAgain` y, en iOS, `ios` con `expires` y `status`.

**D3.** En *app.json* se añaden los plugins:
```json
"plugins": [
  ["expo-camera", {"cameraPermission": "Usamos tu cámara para escanear el código QR del aula y registrar el lugar del desperfecto."}],
  ["expo-location", {"locationAlwaysPermission": "Usamos tu ubicación para señalar dónde se encuentra el desperfecto dentro del Instituto."}],
  ["expo-notifications"]
]
```

**D4.** En Expo Go solo funcionan los permisos declarados por los plugins; para funcionalidades avanzadas (p. ej. escáner QR) se necesita una *development build*.

---

## PARTE E

**E1.** Corrección de código típica: al montar una pantalla que usa la cámara, no llamar automáticamente a `requestCameraPermissionsAsync`; en su lugar usar el hook `usePermiso` que solo solicita el permiso cuando el usuario pulsa el botón "Escanear".

**E2.** Lectura en segundo plano está prohibida para `expo-location` en este TP; en iOS habría que usar `requestBackgroundPermissionsAsync`, que no usamos.

**E3.** Para notificaciones, si el permiso está denegado, la app debe seguir mostrando el aviso dentro de la bandeja interna y no intentar enviar una notificación local.

---

## PARTE F

**F1.** Buenas prácticas:
- Pedir permisos justo antes de necesitarlos.
- Mostrar una pantalla previa que explique el beneficio (como la modal de `/permisos/[recurso]`).
- Respetar el principio de **mínimo privilegio** (p. ej. pedir solo `ACCESS_COARSE_LOCATION` cuando la precisión exacta no es requerida).

**F2.** En la tienda, incluir en la descripción de la app los permisos que será solicitada y su justificación.

**F3.** Errores frecuentes:
- Solicitar permisos en `useEffect` al montar la pantalla → rechazo del usuario.
- No manejar el caso de permiso denegado → funcionalidades bloqueadas sin alternativa.
- Declarar permisos no usados → rechazo de Google Play.

---

*Nota:* El proyecto está configurado con Expo SDK 58; cualquier referencia a SDK 57 del enunciado original se ha actualizado a la API correspondiente de SDK 58.
