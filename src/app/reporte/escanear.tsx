import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { usePermiso } from '@/hooks/usePermiso';
import * as Linking from 'expo-linking';
import { AppState } from 'react-native';

/**
 * Pantalla de escaneo QR para el aula.
 * Maneja cuatro estados: cargando, preguntable, concedido, bloqueado.
 */
export default function EscanearScreen() {
  const router = useRouter();
  const { estado, pedir, abrirAjustes, consultar } = usePermiso('camera');
  const [scanned, setScanned] = useState<string | null>(null);

  // Cuando volvemos a foco, volver a consultar permiso
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        consultar();
      }
    });
    return () => sub.remove();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(data);
      // devolver al formulario anterior con el código
      router.navigate({ pathname: '/reporte/nuevo', params: { aula: data } });
    }
  };

  if (estado === 'cargando') {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Consultando permiso de cámara...</ThemedText>
      </ThemedView>
    );
  }

  if (estado === 'bloqueado') {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Cámara deshabilitada</ThemedText>
        <ThemedText type="small">
          El acceso a la cámara está desactivado. Podés habilitarlo en los ajustes del dispositivo.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={abrirAjustes}>
          <ThemedText type="code">Abrir Ajustes</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (estado === 'preguntable') {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Permiso de cámara</ThemedText>
        <ThemedText type="small">
          Necesitamos acceder a tu cámara para escanear el código QR del aula y completar automáticamente su identificación.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={pedir}>
          <ThemedText type="code">Continuar</ThemedText>
        </TouchableOpacity>
        {/* Opción manual */}
        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <ThemedText type="code">Ingresar aula manualmente</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // estado concedido
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  button: { marginTop: 12, padding: 12, backgroundColor: '#007bff', borderRadius: 6 },
  link: { marginTop: 8 },
  cameraContainer: { flex: 1 },
});
