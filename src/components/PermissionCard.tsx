import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { usePermiso } from '@/hooks/usePermiso';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

interface PermissionCardProps {
  recurso: 'camera' | 'location' | 'notifications';
}

export const PermissionCard: React.FC<PermissionCardProps> = ({ recurso }) => {
  const { estado, parcial, detalle, pedir, abrirAjustes } = usePermiso(recurso);

  const getColor = () => {
    switch (estado) {
      case 'concedido':
        return Colors.light.success;
      case 'preguntable':
        return Colors.light.info;
      case 'bloqueado':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const renderAction = () => {
    if (estado === 'preguntable') {
      return (
        <TouchableOpacity style={styles.button} onPress={pedir}>
          <ThemedText type="code">Continuar</ThemedText>
        </TouchableOpacity>
      );
    }
    if (estado === 'bloqueado') {
      return (
        <TouchableOpacity style={styles.button} onPress={abrirAjustes}>
          <ThemedText type="code">Abrir Ajustes</ThemedText>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ThemedView style={[styles.card, { borderColor: getColor(), borderWidth: 1 }] }>
      <ThemedText type="subtitle">{recurso.charAt(0).toUpperCase() + recurso.slice(1)}</ThemedText>
      <ThemedText type="small" style={{ color: getColor() }}>
        Estado: {estado}{parcial ? ' (parcial)' : ''}
      </ThemedText>
      {detalle && <ThemedText type="small">{detalle}</ThemedText>}
      {renderAction()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
});
