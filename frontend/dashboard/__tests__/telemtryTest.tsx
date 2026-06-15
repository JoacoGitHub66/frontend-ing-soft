import { getLiveData } from "@/services/api";

describe("getLiveData", () => {

  test("devuelve una estructura TelemetryData válida", async () => {

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ultimaTemperatura: 80,
        temperaturaObjetivo: 78,
        pourCount: 5,
        pourRate: 2,
        sessionStatus: "Activa",
        eta: 0,
        alerta: null
      })
    });

    const result = await getLiveData();

    expect(result).toHaveProperty("ultimaTemperatura");
    expect(result).toHaveProperty("temperaturaObjetivo");
    expect(result).toHaveProperty("pourCount");
    expect(result).toHaveProperty("pourRate");
    expect(result).toHaveProperty("sessionStatus");
    expect(result).toHaveProperty("eta");
    expect(result).toHaveProperty("alerta");

    expect(typeof result.ultimaTemperatura).toBe("number");
    expect(typeof result.temperaturaObjetivo).toBe("number");
    expect(typeof result.pourCount).toBe("number");
    expect(typeof result.pourRate).toBe("number");
    expect(typeof result.sessionStatus).toBe("string");
    expect(typeof result.eta).toBe("string");

  });

});