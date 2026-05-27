import { TelemetryData, MateEvent, HistoryRow } from "@/types/telemetry"

let temperature = 72.4
let pourCount = 3
const historyRows: HistoryRow[] = [
  { timestamp: "16:43:08", temperature: 72.4, target: 78, status: "calentando" },
  { timestamp: "16:43:03", temperature: 71.9, target: 78, status: "calentando" },
  { timestamp: "16:42:58", temperature: 71.3, target: 78, status: "calentando" },
  { timestamp: "16:42:53", temperature: 70.8, target: 75, status: "activo" },
  { timestamp: "16:42:48", temperature: 70.1, target: 75, status: "activo" },
]

export async function getLiveData(): Promise<TelemetryData> {
  temperature = parseFloat((temperature - 0.1 + Math.random() * 0.2).toFixed(1))
  const eta = parseFloat(((78 - temperature) / 1.5).toFixed(1))
  return {
    temperature,
    targetTemperature: 78,
    pourCount,
    pourRate: 0.18,
    sessionStatus: "Activa",
    eta: eta > 0 ? eta : 0,
    alert: temperature < 78 ? "Temperatura por debajo del objetivo" : null,
  }
}

export async function getEvents(): Promise<MateEvent[]> {
  return [
    { id: 1, type: "POUR", description: `Cebada #${pourCount}`, time: "16:42:55" },
    { id: 2, type: "TARGET_CHANGED", description: "75°C → 78°C", time: "16:41:30" },
    { id: 3, type: "POUR", description: "Cebada #2", time: "16:39:10" },
    { id: 4, type: "HEAT", description: "Calentamiento iniciado", time: "16:35:00" },
    { id: 5, type: "POUR", description: "Cebada #1", time: "16:32:40" },
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
    temperature,
    target: 78,
    status: "activo",
  })
}