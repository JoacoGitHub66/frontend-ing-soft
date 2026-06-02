import { observer } from "./observer";

export class concreteObserver implements observer {

  private targetTemperature: number;
  private notificationSent = false;

  constructor(targetTemperature: number) {
    this.targetTemperature = targetTemperature;
  }

  update(temperature: number): void {

    if (
      temperature >= this.targetTemperature &&
      !this.notificationSent
    ) {

      this.notificationSent = true;

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {

        new Notification("🧉 Mate listo", {
          body: `El agua alcanzó ${temperature}°C`,
        });

      }

    }

  }
}