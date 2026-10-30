// src/components/primary-button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  title: string;
  onPress?: () => void;
}

export const PrimaryButton: React.FC<Props> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <ThemedText type="code" style={styles.text}>
      {title}
    </ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    color: '#fff',
  },
});
