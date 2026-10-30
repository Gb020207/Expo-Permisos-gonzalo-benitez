import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useReportes } from '@/hooks/useReportes';
import { ReporteCard } from '@/components/ReporteCard';
import { PrimaryButton } from '@/components/primary-button';

export default function ReportesScreen() {
  const { reportes, cargando } = useReportes();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Mis Reportes</ThemedText>
      {cargando && <ThemedText>Cargando...</ThemedText>}
      {!cargando && reportes.length === 0 && (
        <ThemedText>No hay reportes aún.</ThemedText>
      )}
      {!cargando &&
        reportes.map(r => (
          <ReporteCard key={r.id} reporte={r} />
        ))}
      <Link href="/reporte/nuevo" asChild>
        <PrimaryButton title="Nuevo reporte" />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
});
