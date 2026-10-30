import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { TextInput, Platform, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/primary-button';
import { useReportes } from '@/hooks/useReportes';
import { Categoria } from '@/lib/tipos';
import { router } from 'expo-router';

export default function NuevoReporteScreen() {
  const { crear } = useReportes();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('electricidad');

  const handleSubmit = async () => {
    if (!titulo || !descripcion) {
      alert('Complete los campos obligatorios');
      return;
    }
    await crear({ titulo, descripcion, aula, categoria, fotoUri: undefined, coordenadas: undefined, sectorManual: undefined });
    router.replace('/reporte');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Nuevo Reporte</ThemedText>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline style={styles.input} />
      <TextInput placeholder="Aula (opcional)" value={aula} onChangeText={setAula} style={styles.input} />
      {Platform.OS !== 'web' && (
        <Picker selectedValue={categoria} onValueChange={(v: any) => setCategoria(v as Categoria)} style={styles.picker}>
          <Picker.Item label="Electricidad" value="electricidad" />
          <Picker.Item label="Agua" value="agua" />
          <Picker.Item label="Mobiliario" value="mobiliario" />
          <Picker.Item label="Equipos" value="equipos" />
        </Picker>
      )}
      {/* Explicación */}
      <ThemedText type="small" style={{ marginBottom: 8 }}>
        Completá los datos del desperfecto para que el equipo de mantenimiento pueda identificarlo y solucionarlo.
      </ThemedText>
      <PrimaryButton title="Escanear QR" onPress={() => router.navigate('/reporte/escanear')} />
      <PrimaryButton title="Adjuntar foto" onPress={() => {
        // TODO: abrir selector de foto
      }} />
      <PrimaryButton title="Usar ubicación" onPress={() => {
        // TODO: abrir pantalla de ubicación
      }} />
      <PrimaryButton title="Guardar" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  picker: { marginBottom: 12 },
});
