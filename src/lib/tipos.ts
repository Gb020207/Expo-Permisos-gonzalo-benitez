// src/lib/tipos.ts

export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';
export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula?: string;
  categoria: Categoria;
  fotoUri?: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  sectorManual?: string;
  estado: EstadoReporte;
  fechaCreacion: string; // ISO string
}

export interface Aviso {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO
  reporteId: string;
  leido: boolean;
}
