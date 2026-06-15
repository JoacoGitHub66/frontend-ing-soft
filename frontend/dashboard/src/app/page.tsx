// app/page.tsx
"use client"
import { useEffect, useState, useRef } from "react"
import { useMateDevice } from "@/hooks/mateDevice"  // ← Importás tu hook
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"


export default function Home() {
  // 🔥 Usás el hook que ya tiene toda la lógica
  const { state, startNewSession, endCurrentSession, isLoading, isError } = useMateDevice()
  
  // Estado local para el gráfico y UI
  const [tempHistory, setTempHistory] = useState<{ time: string; temp: number }[]>([])
  const [pours, setPours] = useState(0)  // Cebadas locales (para contar durante la sesión)
  const [rango, setrango] = useState("10s")

  // Extraer datos del estado combinado
  const currentTemp = state.currentTelemetry?.temperature ?? 0
  const targetTemp = state.currentTelemetry?.targetTemperature ?? 80
  const sessionId = state.currentTelemetry?.sessionId
  const isHeating = state.isHeating
  const activeSession = state.activeSession
  const totalPoursFromBackend = activeSession?.totalPours ?? 0

  // Actualizar gráfico cuando cambia la temperatura
  useEffect(() => {
    if (currentTemp) {
      setTempHistory(prev => {
        const now = new Date()
        const label = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`
        const next = [...prev, { time: label, temp: currentTemp }]
        return next.slice(-20)
      })
    }
  }, [currentTemp])

  // Sincronizar pours locales con el backend cuando cambia la sesión
  useEffect(() => {
    if (activeSession?.sessionType === 'SYSTEM_STARTED') {
      setPours(totalPoursFromBackend)
    } else {
      setPours(0)
    }
  }, [activeSession, totalPoursFromBackend])

  // Notificaciones y observer
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        console.log("Permiso de notificación:", permission)
      })
    }

    return () => {
      // cleanup si es necesario
    }
  }, [])

  // Manejadores de acciones
  const handleStartRound = async () => {
    await startNewSession()
    setPours(0)
  }

  const handlePour = async () => {
    const newPours = pours + 1
    setPours(newPours)
    // Opcional: podrías actualizar la sesión en tiempo real
    // Pero según el contrato, se actualiza al finalizar la sesión
  }

  const handleFinishRound = async () => {
    if (pours > 0) {
      await endCurrentSession(pours)
      setPours(0)
    } else {
      alert("No hay cebadas para finalizar la sesión")
    }
  }

  // Estados de carga y error
  if (isLoading) return <p className="text-white p-8">Cargando...</p>
  if (isError) return <p className="text-red-500 p-8">Error al cargar datos del mate</p>

  const statusColor = (status: string) =>
    status === "calentando" ? "text-orange-400" : "text-green-400"

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          {sessionId ? `Sesión #${sessionId}` : "Sin sesión activa"} • {isHeating ? "🔥 Calentando" : "❄️ Enfriando"}
        </span>
      </div>

      {/* Fila de métricas */}
      <div className="grid grid-cols-4 gap-4 mb-4">

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Temperatura actual</p>
          <p className="text-3xl font-bold text-orange-400 mt-1">{currentTemp}°C</p>
          <p className="text-xs text-gray-500 mt-1">Objetivo: {targetTemp}°C</p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Cebadas en sesión</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{pours}</p>
          <p className="text-xs text-gray-500 mt-1">
            {activeSession ? "Sesión activa" : "Sin sesión"}
          </p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Calentador</p>
          <p className="text-3xl font-bold mt-1">{isHeating ? "🔥 ON" : "⭕ OFF"}</p>
          <p className="text-xs text-gray-500 mt-1">
            Último evento: {state.latestEvent?.type || "ninguno"}
          </p>
        </div>

        <div style={{ height: "128px" }} className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-3">Estado de sesión</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Sesión</span>
              <span className={`font-bold ${activeSession ? 'text-green-400' : 'text-gray-500'}`}>
                {activeSession ? 'ACTIVA' : 'INACTIVA'}
              </span>
            </div>
            {activeSession && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inicio</span>
                  <span>{new Date(activeSession.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cebadas</span>
                  <span>{pours}</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Fila inferior */}
      <div className="grid grid-cols-4 gap-4">

        {/* Gráfico */}
        <div className="col-span-2 bg-gray-800 rounded-xl p-5" style={{ height: "320px" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">Gráfico histórico de temperatura</p>
            <div className="flex gap-2">
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
                y={targetTemp}
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

        {/* Historial - Podés agregar datos reales después */}
        <div className="bg-gray-800 rounded-xl p-5 overflow-auto" style={{ height: "320px" }}>
          <p className="text-xs text-gray-400 mb-3">Historial de eventos</p>
          <div className="text-center text-gray-500 py-8">
            {state.latestEvent ? (
              <div>
                <p>Último evento: {state.latestEvent.type}</p>
                <p className="text-xs">{new Date(state.latestEvent.timestamp).toLocaleTimeString()}</p>
              </div>
            ) : (
              <p>No hay eventos recientes</p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-4 justify-center" style={{ height: "320px" }}>
          {!activeSession ? (
            <button
              onClick={handleStartRound}
              className="bg-green-700 hover:bg-green-600 active:scale-95 transition-all text-white font-bold py-6 px-8 rounded-xl text-lg"
            >
              🧉 Iniciar ronda
            </button>
          ) : (
            <>
              <button
                onClick={handlePour}
                className="bg-blue-700 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold py-6 px-8 rounded-xl text-lg"
              >
                +1 Cebada ({pours})
              </button>
              <button
                onClick={handleFinishRound}
                className="bg-red-700 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-4 px-8 rounded-xl text-lg"
              >
                Terminar ronda
              </button>
            </>
          )}
        </div>

      </div>

    </main>
  )
}