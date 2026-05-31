//Esta seria una impotetica forma en que podrian tener los contratos con el backend, 
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
}