"use client"
import { useEffect, useState } from "react"
import { getLiveData, getEvents, getHistory, postPour } from "@/services/mockApi"
import { TelemetryData, MateEvent, HistoryRow } from "@/types/telemetry"

export default function Home() {
  const [liveData, setLiveData] = useState<TelemetryData | null>(null)
  const [events, setEvents] = useState<MateEvent[]>([])
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [page, setPage] = useState(1)

  const fetchAll = async () => {
    const [live, evts, hist] = await Promise.all([
      getLiveData(),
      getEvents(),
      getHistory(),
    ])
    setLiveData(live)
    setEvents(evts)
    setHistory(hist)
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 3000)
    return () => clearInterval(interval)
  }, [])

  const handlePour = async () => {
    await postPour()
    await fetchAll()
  }

  const pillColor = (type: string) => {
    if (type === "POUR") return "bg-green-900 text-green-300"
    if (type === "HEAT") return "bg-orange-900 text-orange-300"
    return "bg-purple-900 text-purple-300"
  }

  const statusColor = (status: string) =>
    status === "calentando" ? "text-orange-400" : "text-green-400"

  if (!liveData) return <p className="text-white p-8">Cargando...</p>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-400">🧉 Patecito IoT</h1>
        <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          termo-1 • en vivo
        </span>
      </div>

      {liveData.alert && (
        <div className="bg-orange-950 border border-orange-700 text-orange-300 text-sm rounded-xl px-4 py-2 mb-4">
          ⚠ {liveData.alert} — ETA: ~{liveData.eta} min
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-4">

        <div className="flex flex-col gap-4">
          <div className="bg-gray-800 rounded-xl p-5 flex-1">
            <p className="text-xs text-gray-400">Temperatura actual</p>
            <p className="text-3xl font-bold text-orange-400 mt-1">{liveData.temperature}°C</p>
            <p className="text-xs text-gray-500 mt-1">hace 2 s</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 flex-1">
            <p className="text-xs text-gray-400">Cebadas en sesión</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{liveData.pourCount}</p>
            <p className="text-xs text-gray-500 mt-1">{liveData.pourRate} / min</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Objetivo (potenciómetro)</p>
          <p className="text-3xl font-bold text-purple-400 mt-1">{liveData.targetTemperature}°C</p>
          <p className="text-xs text-gray-500 mt-1">setpoint actual</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-3">Últimos eventos</p>
          <div className="flex flex-col gap-2">
            {events.slice(0, 4).map(e => (
              <div key={e.id} className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full text-xs ${pillColor(e.type)}`}>
                  {e.type}
                </span>
                <span className="text-gray-300 truncate">{e.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-3">Estado de sesión</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Sesión</span>
              <span className="text-green-400 font-bold">{liveData.sessionStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inicio</span>
              <span>16:30:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duración</span>
              <span>13 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ETA</span>
              <span className="text-orange-400">~{liveData.eta} min</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-4 gap-4">

        <div className="col-span-2 bg-gray-800 rounded-xl p-5 h-48">
          <p className="text-xs text-gray-400 mb-3">Gráfico histórico de temperatura</p>
          <div className="flex items-end gap-1 h-28">
            {[65, 67, 70, 75, 78, 76, 74, 72, 71, 71.5, liveData.temperature].map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-orange-500 rounded-sm"
                  style={{ height: `${((t - 60) / 25) * 100}%` }}
                />
                {i % 3 === 0 && (
                  <span className="text-gray-500" style={{ fontSize: "9px" }}>
                    {16 + Math.floor(i / 2)}:{i % 2 === 0 ? "30" : "00"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 h-48 overflow-auto">
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
                  <td className="py-1 text-orange-400">{row.temperature}°C</td>
                  <td className={`py-1 ${statusColor(row.status)}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-2 py-0.5 bg-gray-700 rounded"
            >←</button>
            Página {page}
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-2 py-0.5 bg-gray-700 rounded"
            >→</button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handlePour}
            className="bg-green-700 hover:bg-green-600 active:scale-95 transition-all text-white font-bold py-6 px-8 rounded-xl text-lg"
          >
            Cebar 🧉
          </button>
        </div>

      </div>

    </main>
  )
}
/*import { redirect } from 'next/navigation';

/**
 * Root page — immediately sends users to the dashboard.
 *
 * No further changes expected here; keeps a single entry point for the app.
 * Uses `redirect('/dashboard')` from `next/navigation`.
 *

export default function Home() {
  redirect('/dashboard');
}*/
