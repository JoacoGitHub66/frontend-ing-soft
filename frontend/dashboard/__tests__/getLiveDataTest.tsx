import { getLiveData } from "@/services/api";

describe("API", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("getLiveData devuelve datos correctamente", async () => {

    const mockData = {
      ultimaTemperatura: 80
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    const result = await getLiveData();

    expect(result).toEqual(mockData);

  });

});