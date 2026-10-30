import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TouchableOpacity } from 'react-native';

/**
 * Pantalla modal que muestra información explicativa del permiso antes de solicitarlo.
 * Se muestra sólo cuando el usuario toca la función que necesita el permiso.
 */
export default function PermisoModal() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const router = useRouter();

  const getInfo = () => {
    switch (recurso) {
      case 'camera':
        return {
          nombre: 'Cámara',
          beneficio: 'Escanear el código QR del aula y tomar fotos del desperfecto.',
        };
      case 'location':
        return {
          nombre: 'Ubicación',
          beneficio: 'Marcar la posición exacta del desperfecto dentro del Instituto.',
        };
      case 'notifications':
        return {
          nombre: 'Notificaciones',
          beneficio: 'Recibir avisos cuando tu reporte sea resuelto.',
        };
      default:
        return { nombre: recurso, beneficio: '' };
    }
  };

  const info = getInfo();

  const handlePrimary = async () => {
    // Simplemente vuelve atrás; la pantalla que la llamó debe solicitar el permiso
    router.back();
  };

  const handleOpenSettings = async () => {
    // Redirigimos a la pantalla de permisos para que el usuario pueda abrir ajustes
    router.push('/permisos');
  };

  // Determinar cuál botón mostrar según estado (esto es simplificado; en la práctica
  // la pantalla que invoca pasa el estado a través de params o contexto)
  const isBlocked = false; // placeholder – actual logic handled in usePermiso

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{info.nombre}</ThemedText>
      <ThemedText type="small" style={styles.beneficio}>
        {info.beneficio}
      </ThemedText>
      <ThemedText type="small" style={styles.explanation}>
        Esta aplicación necesita este permiso para ofrecer la funcionalidad necesaria. Puedes cambiar
        la autorización en Ajustes en cualquier momento.
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={handlePrimary}>
        <ThemedText type="code">Continuar</ThemedText>
      </TouchableOpacity>
      {isBlocked && (
        <TouchableOpacity style={styles.button} onPress={handleOpenSettings}>
          <ThemedText type="code">Abrir Ajustes</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  beneficio: {
    marginVertical: 12,
  },
  explanation: {
    marginBottom: 24,
  },
  button: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
});
