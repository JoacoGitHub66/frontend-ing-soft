// ===== TELEMETRY =====
export interface TelemetryRequest {
  temperature: number;        // 0.0 – 100.0
  targetTemperature: number;  // 10.0 – 90.0
  waterLevel: number;         // 0.0 – 100.0
}

export interface TelemetryResponse {
  id: number;
  temperature: number;
  targetTemperature: number;
  waterLevel: number;
  sessionId: number;          // ID de la sesión activa
  createdAt: string;          // ISO 8601
}

// ===== EVENTS =====
export type EventType = 'HEATING_STARTED' | 'HEATING_STOPPED';

export interface EventRequest {
  type: EventType;
}

export interface EventResponse {
  id: number;
  type: EventType;
  timestamp: string;
}

// ===== MATE SESSION =====
export type SessionType = 'SYSTEM_STARTED' | 'SYSTEM_STOPPED';

export interface MateSessionRequest {
  sessionType: SessionType;
  totalPours?: number | null;
}

export interface MateSessionResponse {
  id: number;
  sessionType: SessionType;
  totalPours: number | null;
  createdAt: string;
}

// ===== ESTADO COMBINADO PARA EL DASHBOARD =====
export interface MateDeviceState {
  currentTelemetry: TelemetryResponse | null;
  latestEvent: EventResponse | null;
  activeSession: MateSessionResponse | null;
  isHeating: boolean;
}


/*//Esta seria una impotetica forma en que podrian tener los contratos con el backend, 
//para que el frontend sepa que esperar de cada endpoint.
//Este archivo no hace nada por sí solo, solo describe cómo van a venir los datos del backend


// Esto le dice a TypeScript: "cuando el backend me mande datos en vivo, van a tener esta forma"
export interface TelemetryData {
  ultimaTemperatura: number      //un numero con decimales
  temperaturaObjetivo: number    //numero
  pourCount: number            //un numero entero
  pourRate: number             //
  sessionStatus: string        //texto
  eta: number        
  alerta: string | null
}

// Esto describe un evento (cebada, calentamiento, etc.)
export interface MateEvent {
  id: number
  type: "POUR" | "HEAT" | "TARGET_CHANGED" // solo puede ser uno de estos tres
  description: string
  occurredAt: string          
}

// Esto describe un evento (cebada, calentamiento, etc.)
export interface HistoryRow {
  timestamp: string
  temperatureC: number       
  temperaturaObjetivoC: number
  status: string
}*/