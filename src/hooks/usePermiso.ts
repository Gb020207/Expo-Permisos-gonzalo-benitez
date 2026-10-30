import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export interface UsePermisoResult {
  estado: EstadoPermiso;
  parcial: boolean; // true when permission is partial (e.g., approximate location)
  detalle?: string; // optional extra info like accuracy description
  respuesta: any; // raw permission response
  pedir: () => Promise<void>;
  abrirAjustes: () => Promise<void>;
  consultar: () => Promise<void>;
}

/**
 * Hook que gestiona permisos de cámara, ubicación (primer plano) y notificaciones.
 * Se adapta a las APIs de Expo SDK 58.
 */
export function usePermiso(recurso: 'camera' | 'location' | 'notifications'): UsePermisoResult {
  const [estado, setEstado] = useState<EstadoPermiso>('cargando');
  const [parcial, setParcial] = useState(false);
  const [detalle, setDetalle] = useState<string | undefined>(undefined);
  const [respuesta, setRespuesta] = useState<any>(null);

  // Camera permissions via modern hook
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const consultar = async () => {
    try {
      let resp: any;
      if (recurso === 'camera') {
        const { status, granted, canAskAgain } = cameraPermission || {};
        resp = { status, granted, canAskAgain };
        setParcial(false);
        setDetalle(undefined);
        if (status === 'granted') setEstado('concedido');
        else if (canAskAgain) setEstado('preguntable');
        else setEstado('bloqueado');
      } else if (recurso === 'location') {
        const { status, granted, canAskAgain } = await Location.getForegroundPermissionsAsync();
        resp = { status, granted, canAskAgain };
        // iOS precise/approximate
        if (granted) {
          const acc = await Location.getCurrentPositionAsync({});
          const isPrecise = (acc?.coords?.accuracy ?? Infinity) <= 100;
          setParcial(!isPrecise);
          setDetalle(isPrecise ? undefined : 'Ubicación aproximada');
          setEstado('concedido');
        } else if (canAskAgain) {
          setEstado('preguntable');
          setParcial(false);
        } else {
          setEstado('bloqueado');
          setParcial(false);
        }
      } else if (recurso === 'notifications') {
        const { status, granted, canAskAgain, ios } = await Notifications.getPermissionsAsync();
        resp = { status, granted, canAskAgain, ios };
        setParcial(false);
        setDetalle(undefined);
        if (status === 'granted') {
          setEstado('concedido');
        } else if (canAskAgain) {
          setEstado('preguntable');
        } else {
          setEstado('bloqueado');
        }
      }
      setRespuesta(resp);
    } catch (e) {
      console.warn('Error consultando permiso', e);
      setEstado('bloqueado');
    }
  };

  const pedir = async () => {
    try {
      let resp: any;
      if (recurso === 'camera') {
        await requestCameraPermission();
        // permiso actualizado via hook state, re‑consultar
        await consultar();
        return;
      } else if (recurso === 'location') {
        resp = await Location.requestForegroundPermissionsAsync();
      } else if (recurso === 'notifications') {
        resp = await Notifications.requestPermissionsAsync();
      }
      setRespuesta(resp);
      await consultar();
    } catch (e) {
      console.warn('Error al solicitar permiso', e);
    }
  };

  const abrirAjustes = async () => {
    const url = Platform.OS === 'ios' ? 'app-settings:' : 'package:' + (await import('expo-constants')).default?.expoConfig?.slug;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('No se pudo abrir ajustes', e);
    }
  };

  useEffect(() => {
    consultar();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        consultar();
      }
    });
    return () => subscription.remove();
  }, []);

  return { estado, parcial, detalle, respuesta, pedir, abrirAjustes, consultar };
}
