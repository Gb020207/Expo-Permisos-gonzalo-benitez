import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { getReporteById, updateReporte } from '@/lib/reportes';
import { Reporte } from '@/lib/tipos';
import { PrimaryButton } from '@/components/primary-button';

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null>(null);

  const cargar = async () => {
    const data = await getReporteById(id!);
    if (data) setReporte(data);
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const simularResolucion = async () => {
    if (!reporte) return;
    const actualizado = { ...reporte, estado: 'resuelto' } as Reporte;
    await updateReporte(actualizado);
    setReporte(actualizado);
    // Aquí se generaría la notificación interna y, si está permitido, una local
  };

  if (!reporte) return <ThemedView style={styles.center}><ThemedText>Cargando...</ThemedText></ThemedView>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{reporte.titulo}</ThemedText>
      <ThemedText>{reporte.descripcion}</ThemedText>
      <ThemedText>Estado: {reporte.estado}</ThemedText>
      <PrimaryButton title="Simular resolución" onPress={simularResolucion} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
