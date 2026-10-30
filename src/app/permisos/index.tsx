import { Stack } from 'expo-router';
import { PermissionCard } from '@/components/PermissionCard';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';

export default function PermisosScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Permisos</ThemedText>
      <PermissionCard recurso="camera" />
      <PermissionCard recurso="location" />
      <PermissionCard recurso="notifications" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
});
