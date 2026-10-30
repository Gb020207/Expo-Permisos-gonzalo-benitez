import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';

export default function AvisosScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Avisos</ThemedText>
      {/* Lista de avisos interna se implementará en futuros pasos */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
