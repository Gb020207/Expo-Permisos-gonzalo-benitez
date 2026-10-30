// src/components/ReporteCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Reporte } from '@/lib/tipos';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';

interface Props {
  reporte: Reporte;
}

export const ReporteCard: React.FC<Props> = ({ reporte }) => {
  return (
    <TouchableOpacity onPress={() => (router as any).push('/reporte/' + reporte.id)} style={styles.card}>

        <ThemedText type="subtitle">{reporte.titulo}</ThemedText>
        <ThemedText type="small">Aula: {reporte.aula ?? 'N/A'}</ThemedText>
        <ThemedText type="small">Estado: {reporte.estado}</ThemedText>


    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});
