export interface TelemetryData {
  temperature: number
  targetTemperature: number
  pourCount: number
  pourRate: number
  sessionStatus: string
  eta: number
  alert: string | null
}

export interface MateEvent {
  id: number
  type: "POUR" | "HEAT" | "TARGET_CHANGED"
  description: string
  time: string
}

export interface HistoryRow {
  timestamp: string
  temperature: number
  target: number
  status: string
}