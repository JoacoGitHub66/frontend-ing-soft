import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {HistoryRow} from "@/types/telemetry"

export function descargarPDF(history: HistoryRow[]) {
  const doc = new jsPDF()

  doc.text("Historial de cebadas", 14, 15)

  autoTable(doc, {
    startY: 25,
    head: [["Fecha", "Temperatura", "Estado"]],
    body: history.map((row) => [
      row.timestamp,
      row.temperatureC,
      row.status,
    ]),
  })

  doc.save("historial-cebadas.pdf")
}