import { TelemetryData, MateEvent, HistoryRow } from "@/types/telemetry"

let temperature = 15
let pourCount = 3
const historyRows: HistoryRow[] = [
  { timestamp: "16:43:08", temperatureC: 30.5, temperaturaObjetivoC: 78, status: "calentando" },
  { timestamp: "16:43:03", temperatureC: 40.6, temperaturaObjetivoC: 78, status: "calentando" },
  { timestamp: "16:42:58", temperatureC: 1.9, temperaturaObjetivoC: 78, status: "calentando" },
  { timestamp: "16:42:53", temperatureC: 90.9, temperaturaObjetivoC: 75, status: "activo" },
  { timestamp: "16:42:48", temperatureC: 70.0, temperaturaObjetivoC: 75, status: "activo" },
]

//este seria el ciclo que sigue en bucle la pagina
const temperatureLoop = [72, 10, 80, 3, 15, 56, 77, 39, 1, 44, 82, 19, 65, 78, 23]
let loopIndex = 0

export async function getLiveData(): Promise<TelemetryData> {
  const temperature = temperatureLoop[loopIndex]
  loopIndex = (loopIndex + 1) % temperatureLoop.length  // cuando llega al final vuelve al inicio
  
  return {
    ultimaTemperatura: temperature,
    temperaturaObjetivo: 78,
    pourCount,
    pourRate: 0.18,
    sessionStatus: "Activa",
    eta: parseFloat(((78 - temperature) / 1.5).toFixed(1)),
    alerta: temperature < 78 ? "Temperatura por debajo del objetivo" : null,
  }
}

//esto lo borrare despues o nose
export async function getEvents(): Promise<MateEvent[]> {
  return [
    { id: 1, type: "POUR", description: `Cebada #${pourCount}`, occurredAt: "16:42:55" },
    { id: 2, type: "TARGET_CHANGED", description: "75°C → 78°C", occurredAt: "16:41:30" },
    { id: 3, type: "POUR", description: "Cebada #2", occurredAt: "16:39:10" },
    { id: 4, type: "HEAT", description: "Calentamiento iniciado", occurredAt: "16:35:00" },
    { id: 5, type: "POUR", description: "Cebada #1", occurredAt: "16:32:40" },
  ]
}

export async function getHistory(): Promise<HistoryRow[]> {
  return historyRows
}

export async function postPour(): Promise<void> {
  pourCount++
  const now = new Date()
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  historyRows.unshift({
    timestamp: time,
    temperatureC: temperature,
    temperaturaObjetivoC: 78,
    status: "activo",
  })
}