import { 
  TelemetryRequest, 
  TelemetryResponse, 
  EventRequest, 
  EventResponse,
  MateSessionResponse 
} from './telemetry';

const BACKEND_URL = /*process.env.BACKEND_URL ||*/ 'http://localhost:8080';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ===== TELEMETRY =====
  /*async getTelemetry(): Promise<TelemetryResponse[]> {
    return this.request('/telemetry');
  }*/

  async getLatestTelemetry(): Promise<TelemetryResponse | null> {
    try {
      return await this.request('/telemetry/latest');
    } catch (error) {
      if ((error as Error).message.includes('404')) return null;
      throw error;
    }
  }

  /*async sendTelemetry(data: TelemetryRequest): Promise<TelemetryResponse> {
    return this.request('/telemetry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }*/

  // ===== EVENTS =====
  /*async getEvents(): Promise<EventResponse[]> {
    return this.request('/events');
  }*/

  async getLatestEvent(): Promise<EventResponse | null> {
    try {
      return await this.request('/events/latest');
    } catch (error) {
      if ((error as Error).message.includes('404')) return null;
      throw error;
    }
  }

  /*async sendEvent(event: EventRequest): Promise<EventResponse> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }*/

  // ===== SESSIONS =====
  /*async getSessions(): Promise<MateSessionResponse[]> {
    return this.request('/sessions');
  }*/

  async getLatestSession(): Promise<MateSessionResponse | null> {
    try {
      return await this.request('/sessions/latest');
    } catch (error) {
      if ((error as Error).message.includes('404')) return null;
      throw error;
    }
  }

  async startSession(): Promise<MateSessionResponse> {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ sessionType: 'SYSTEM_STARTED' }),
    });
  }

  async finishSession(totalPours: number): Promise<void> {
    return this.request('/sessions/finish', {
      method: 'POST',
      body: JSON.stringify({ 
        sessionType: 'SYSTEM_STOPPED', 
        totalPours 
      }),
    });
  }
}

export const apiClient = new ApiClient();