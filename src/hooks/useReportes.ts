// src/hooks/useReportes.ts
import { useEffect, useState } from 'react';
import { Reporte } from '@/lib/tipos';
import { getReportes, addReporte, updateReporte } from '@/lib/reportes';

export const useReportes = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    const data = await getReportes();
    setReportes(data);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (reporte: Omit<Reporte, 'id' | 'estado' | 'fechaCreacion'>) => {
    const nuevo: Reporte = {
      ...reporte,
      id: Date.now().toString(),
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
    };
    await addReporte(nuevo);
    setReportes(prev => [...prev, nuevo]);
  };

  const modificar = async (reporte: Reporte) => {
    await updateReporte(reporte);
    setReportes(prev => prev.map(r => (r.id === reporte.id ? reporte : r)));
  };

  return { reportes, cargando, crear, modificar, recargar: cargar };
};
