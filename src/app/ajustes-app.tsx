import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Switch, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const PREF_KEY = 'pref_notif';

export default function AjustesAppScreen() {
  const [activo, setActivo] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const load = async () => {
      const value = await AsyncStorage.getItem(PREF_KEY);
      setActivo(value === 'true');
      setCargando(false);
    };
    load();
  }, []);

  const toggle = async (value: boolean) => {
    setActivo(value);
    await AsyncStorage.setItem(PREF_KEY, value.toString());
    if (value) {
      // mostrar pantalla previa antes de pedir permiso
      router.push({ pathname: '/permisos/notifications' as any });
    } else {
      // no hacemos nada
    }
  };

  if (cargando) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ajustes de la aplicación</ThemedText>
      <ThemedText type="small">Avisarme cuando se resuelva mi reporte</ThemedText>
      <Switch value={activo} onValueChange={toggle} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
