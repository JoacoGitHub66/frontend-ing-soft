//La conexión al backend real
//Este archivo le pregunta al backend de Spring por nuevos datos.

/*
import { TelemetryData, MateEvent, HistoryRow } from "@/types/telemetry" //Trae las interfaces que definiste en telemetry.ts
                                                                         //Si el backend te devuelve algo que no coincide con estas interfaces, 
                                                                         //typeScript te va a tirar un error

const BASE_URL = "http://localhost:8080/api"  //Es la dirección donde corre Spring
                                              //->esto lo tengo que ver con dp de back y ver si es la misma direccion



                                              
//le pregunta al backend el estado actual: temperatura, objetivo, cebadas, eta y alerta. Se llama cada 3 segundos.
export async function getLiveData(): Promise<TelemetryData> {
  const res = await fetch(`${BASE_URL}/live`)
  if (!res.ok) throw new Error("Error al obtener datos en vivo")
  return res.json()
}

//le pide al backend la lista de últimos eventos (POUR, HEAT, TARGET_CHANGED) para mostrarlos en el panel.
export async function getEvents(): Promise<MateEvent[]> {
  const res = await fetch(`${BASE_URL}/events`)
  if (!res.ok) throw new Error("Error al obtener eventos")
  return res.json()
}

//le pide al backend el historial de datos para mostrarlo en el panel.
//le pide al backend las filas de la tabla histórica de telemetría del dispositivo termo-1.
export async function getHistory(): Promise<HistoryRow[]> {
  const res = await fetch(`${BASE_URL}/telemetry?deviceId=termo-1`)
  if (!res.ok) throw new Error("Error al obtener historial")
  return res.json()
}

//le avisa al backend que el usuario apretó el botón cebar, mandando la hora exacta en que ocurrió.
export async function postPour(): Promise<void> {
  await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "POUR",
      deviceId: "termo-1",
      occurredAt: new Date().toISOString(),
    }),
  })
}*/