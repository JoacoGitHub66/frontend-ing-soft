import useSWR from 'swr';
import { apiClient } from '@/types/api-conect';
import { MateDeviceState } from '@/types/telemetry';

export function useMateDevice() {
  // 1. Pide la última telemetría cada 3 segundos directamente al backend
  const { data: telemetry, error: telError, mutate: mutateTelemetry } = useSWR(
    'telemetry/latest',
    () => apiClient.getLatestTelemetry(),
    { refreshInterval: 3000 }
  );

  // 2. Pide el último evento cada 3 segundos
  const { data: event, error: evError, mutate: mutateEvent } = useSWR(
    'events/latest',
    () => apiClient.getLatestEvent(),
    { refreshInterval: 3000 }
  );

  // 3. Pide la sesión activa cada 5 segundos
  const { data: session, error: sesError, mutate: mutateSession } = useSWR(
    'sessions/latest',
    () => apiClient.getLatestSession(),
    { refreshInterval: 5000 }
  );

  // Funciones disparadoras para los botones de la pantalla
  const startNewSession = async () => {
    await apiClient.startSession();
    mutateSession(); // Fuerza a React a enterarse que la sesión empezó
  };

  const endCurrentSession = async (mates: number) => {
    await apiClient.finishSession(mates);
    mutateSession(); // Fuerza a React a enterarse que la sesión terminó
  };

  // Junta todo en el estado combinado que tú diseñaste
  const deviceState: MateDeviceState = {
    currentTelemetry: telemetry || null,
    latestEvent: event || null,
    activeSession: session || null,
    isHeating: event?.type === 'HEATING_STARTED',
  };

  return {
    state: deviceState,
    startNewSession,
    endCurrentSession,
    isLoading: !telemetry && !telError,
    isError: telError || evError || sesError,
  };
}