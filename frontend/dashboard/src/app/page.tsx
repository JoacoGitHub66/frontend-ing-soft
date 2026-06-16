"use client"
import { useEffect, useRef, useState } from "react"
import { getLiveData, getEvents, getHistory, postPour } from "@/services/mockApi"//le paso el moquito de prueba para el grafico
import { TelemetryData, MateEvent, HistoryRow } from "@/types/telemetry"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { concreteObserver } from "@/observer/concreteObserver"
import { subject } from "@/observer/subjetc"
import { SessionStatus } from "@/types/sessionStatus"
import { StatusContext } from "@/strategy/context"
import { stateMate } from "@/strategy/stateMate"
import {descargarPDF} from "@/utils/pdfGenerator"

export default function Home() {
  //variables especiales de React, cuando cambian o las cambiamos, la pantalla se actualiza sola
  const [liveData, setLiveData] = useState<TelemetryData | null>(null)
  const [events, setEvents] = useState<MateEvent[]>([])
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [page, setPage] = useState(1)
  const [tempHistory, setTempHistory] = useState<{ time: string; temp: number }[]>([]) // puntos del grafico: hora y temperatura. Se va llenando con el tiempo
  const [rango, setrango] = useState("10s")  // esto es lpara los botones de cambio de timepo 10s, 1m, 10m y 1h
  const temperatureSubjectRef = useRef<subject | null>(null)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(SessionStatus.CALENTANDO)
  
  const statusContextRef = useRef<StatusContext | null>(null)

  //función que pide todos los datos al servicio y actualiza los estados
  const fetchAll = async () => {
    //llama los tres servicios al mismo tiempo (en paralelo, no uno por uno)
    const [live, evts, hist] = await Promise.all([
      getLiveData(),// trae temperatura actual, alertas
      getEvents(),
      getHistory(),// trae filas del historial
    ])


    temperatureSubjectRef.current?.notify(live.ultimaTemperatura)

    //guarda cada resultado en su estado → React actualiza la pantalla automaticamente
    setLiveData(live)
    setEvents(evts)
    setHistory(hist)

    //agrega un nuevo punto al grafico con la hora actual y la temperatura que llego
    setTempHistory(prev => {
      const now = new Date()
      const label = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`
      const next = [...prev, { time: label, temp: live.ultimaTemperatura }]
      return next.slice(-20)
    })

     const status = statusContextRef.current?.doSomething(
      live.ultimaTemperatura,
      live.temperaturaObjetivo
    )

    if (status) {
      setSessionStatus(status)
    }

  }

  // se ejecuta cuando el usuario aprieta el botón "Cebar"
  const handlePour = async () => {
    await postPour()
    await fetchAll()
  }

  const statusColor = (status: string) =>
    status === "calentando" ? "text-orango-400" : "text-green-400"

useEffect(() => {
  statusContextRef.current = new StatusContext(new stateMate())

  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log("Permiso de notificación:", permission)
    })
  }

  temperatureSubjectRef.current = new subject()

  const temperatureObserver = new concreteObserver(78)
  temperatureSubjectRef.current.subscribe(temperatureObserver)

  fetchAll()

  const interval = setInterval(fetchAll, 3000)

  return () => clearInterval(interval)
}, [])

  // mientras fetchAll no terminó la primera llamada, liveData es null
  // esto evita que React intente mostrar liveData.temperature cuando todavía no hay datos
  if (!liveData) return <p className="text-white p-8">Cargando...</p>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          termo-1 • en vivo
        </span>
      </div>

      {/* Fila de métricas — altura fija en todos */}
      <div className="grid grid-cols-4 gap-4 mb-4">

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Temperatura actual</p>
          <p className="text-3xl font-bold text-orango-400 mt-1">{liveData.ultimaTemperatura}°C</p>
          <p className="text-xs text-gray-500 mt-1">hace 2 s</p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Cebadas en sesión</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{liveData.pourCount}</p>
          <p className="text-xs text-gray-500 mt-1">{liveData.pourRate} / min</p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Objetivo (potenciómetro)</p>
          <p className="text-3xl font-bold text-purple-400 mt-1">{liveData.temperaturaObjetivo}°C</p>
          <p className="text-xs text-gray-500 mt-1">setpoint actual</p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-3">Estado de sesión</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Sesión</span>
              {/* <span className="text-green-400 font-bold">{liveData.sessionStatus}</span> */}
              <span className="text-green-400 font-bold">{sessionStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inicio</span>
              <span>16:30:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duración</span>
              <span>13 min</span>
            </div>
          </div>
        </div>

      </div>

      {/* Fila inferior — altura fija en todos */}
      <div className="grid grid-cols-4 gap-4">

        {/* Gráfico */}
        <div className="col-span-2 bg-gray-800 rounded-xl p-5" style={{ height: "320px" }}>
          {/* encabezado del gráfico con botones de filtro de tiempo */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">Gráfico histórico de temperatura</p>
            <div className="flex gap-2">
              {/*aca esta la parte en que pone los botonsitos arriba del grafico*/}
              {["10s", "1m", "10m", "1h"].map((r) => (
                <button
                  key={r}
                  onClick={() => setrango(r)}
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    rango === r
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/*aca esto es para el grafico, marca el tamaño x e y, ademas de marcar las liñas*/}
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
              <XAxis
                dataKey="time"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                tickFormatter={(v) => `${v}°`}
              />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }}
                labelStyle={{ color: "#9ca3af" }}
                formatter={(v) => [`${v}°C`, "Temperatura"]}
              />
              <ReferenceLine
                y={liveData.temperaturaObjetivo}
                stroke="#a855f7"
                strokeDasharray="4 4"
                label={{ value: "Objetivo", fill: "#a855f7", fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Historial */}
        <div className="bg-gray-800 rounded-xl p-5 overflow-auto" style={{ height: "320px" }}>
          <p className="text-xs text-gray-400 mb-3">Historial de cebadas</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700">
                <th className="text-left pb-1">Hora</th>
                <th className="text-left pb-1">Temp</th>
                <th className="text-left pb-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-1 text-gray-300">{row.timestamp}</td>
                  <td className="py-1 text-white-400">{row.temperatureC}°C</td>
                  <td className={`py-1 ${statusColor(row.status)}`}>
                  {row.status}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*botonn de cebar */}
        <div className="flex items-center justify-center" style={{ height: "320px" }}>
          <button
            onClick={() => descargarPDF(history)}
            className="bg-green-700 hover:bg-green-600 active:scale-95 transition-all text-white font-bold py-6 px-8 rounded-xl text-lg"
            >
          Descargar PDF
        </button>
        </div>

      </div>

    </main>
  )
}
