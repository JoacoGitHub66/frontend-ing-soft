import { observer } from "./observer";

export class concreteObserver implements observer {

  private targetTemperature: number;
  private notificationSent = false;

  constructor(targetTemperature: number) {
    this.targetTemperature = targetTemperature;
  }

  update(temperature: number): void {

    console.log("Observer recibió temperatura:", temperature)

    if(temperature < this.targetTemperature) {
      this.notificationSent = false;
    }

    if (
      temperature >= this.targetTemperature &&
      !this.notificationSent
    ) {
      console.log("Temperatura objetivo alcanzada")

      this.notificationSent = true;

      console.log("Permiso actual:", Notification.permission)

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {

        new Notification("🧉 Mate listo", {
          body: `El agua alcanzó ${temperature}°C`,
        });

        alert(`El agua alcanzó ${temperature}°C. ¡Tu mate está listo!`)

      }

    }

  }
}




