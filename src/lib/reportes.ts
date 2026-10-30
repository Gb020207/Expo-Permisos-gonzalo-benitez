// src/lib/reportes.ts
import { Reporte } from '@/lib/tipos';
import { loadItem, saveItem } from '@/lib/almacenamiento';

const KEY = 'reportes';

export const getReportes = async (): Promise<Reporte[]> => {
  const data = await loadItem<Reporte[]>(KEY);
  return data ?? [];
};

export const addReporte = async (reporte: Reporte) => {
  const list = await getReportes();
  list.push(reporte);
  await saveItem(KEY, list);
};

export const updateReporte = async (updated: Reporte) => {
  const list = await getReportes();
  const idx = list.findIndex(r => r.id === updated.id);
  if (idx >= 0) {
    list[idx] = updated;
    await saveItem(KEY, list);
  }
};

export const getReporteById = async (id: string): Promise<Reporte | undefined> => {
  const list = await getReportes();
  return list.find(r => r.id === id);
};
