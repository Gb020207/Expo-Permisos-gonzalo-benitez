// src/lib/almacenamiento.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Error saving', key, e);
  }
};

export const loadItem = async <T>(key: string): Promise<T | null> => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (e) {
    console.warn('Error loading', key, e);
    return null;
  }
};
