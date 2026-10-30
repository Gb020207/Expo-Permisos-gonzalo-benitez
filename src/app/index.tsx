import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing, Colors } from '@/constants/theme';
import { useReportes } from '@/hooks/useReportes';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { reportes, cargando } = useReportes();

  const pendientes = reportes.filter(r => r.estado === 'pendiente').length;
  const enCurso = reportes.filter(r => r.estado === 'en curso').length;
  const resueltos = reportes.filter(r => r.estado === 'resuelto').length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>Mantenimiento IPF</ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>Gestión de incidencias del instituto</ThemedText>
          </ThemedView>

          {/* Summary */}
          <ThemedView style={styles.summary}>
            <ThemedText type="smallBold" style={{ color: Colors.light.warning }}>Pendientes: {pendientes}</ThemedText>
            <ThemedText type="smallBold" style={{ color: Colors.light.info }}>En curso: {enCurso}</ThemedText>
            <ThemedText type="smallBold" style={{ color: Colors.light.success }}>Resueltos: {resueltos}</ThemedText>
          </ThemedView>

          {/* Acción principal */}
          <PrimaryButton title="Nuevo reporte" onPress={() => router.push('/reporte/nuevo')} />

          {/* Últimos reportes */}
          <ThemedText type="title" style={styles.sectionTitle}>Mis Reportes Recientes</ThemedText>
          {cargando && <ThemedText type="small">Cargando...</ThemedText>}
          {!cargando && reportes.length === 0 && (
            <ThemedText type="small">Aún no tenés reportes. ¡Creá uno!</ThemedText>
          )}
          {!cargando &&
            reportes.slice(0, 5).map(r => (
              <View key={r.id} style={styles.cardWrapper}>
                <TouchableOpacity onPress={() => (router as any).push('/reporte/' + r.id)}>
                  <ThemedView style={styles.card}>
                    <ThemedText type="subtitle">{r.titulo}</ThemedText>
                    <ThemedText type="small">Aula: {r.aula ?? 'N/A'}</ThemedText>
                    <ThemedText type="small">Estado: {r.estado}</ThemedText>
                    <ThemedText type="small" style={styles.date}>
                      {new Date(r.fechaCreacion).toLocaleDateString()}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              </View>
            ))}


          {/* Cómo funciona */}
          <ThemedText type="title" style={styles.sectionTitle}>¿Cómo funciona?</ThemedText>
          <View style={styles.steps}>
            <View style={styles.stepItem}>
              <ThemedText type="subtitle">1. Reportá el desperfecto</ThemedText>
              <ThemedText type="small">Completá los datos y enviá el reporte.</ThemedText>
            </View>
            <View style={styles.stepItem}>
              <ThemedText type="subtitle">2. Adjuntá foto o escaneá QR</ThemedText>
              <ThemedText type="small">Podés agregar una foto o usar el escáner QR del aula.</ThemedText>
            </View>
            <View style={styles.stepItem}>
              <ThemedText type="subtitle">3. Seguí el estado</ThemedText>
              <ThemedText type="small">Revisá si está pendiente, en curso o resuelto.</ThemedText>
            </View>
          </View>

          {Platform.OS === 'web' && <WebBadge />}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth },
  content: { paddingBottom: BottomTabInset + Spacing.three, gap: Spacing.three },
  header: { alignItems: 'center', marginBottom: Spacing.three },
  title: { fontSize: 28, fontWeight: '600' },
  subtitle: { fontSize: 16, color: Colors.light.textSecondary },
  summary: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.three },
  sectionTitle: { marginTop: Spacing.three, marginBottom: Spacing.one },
  cardWrapper: { marginBottom: Spacing.one },
  card: { padding: Spacing.one, borderRadius: 8, backgroundColor: Colors.light.backgroundElement },
  date: { fontSize: 12, color: Colors.light.textSecondary },
  steps: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.three },
  stepItem: { flex: 1, alignItems: 'center' },
});
