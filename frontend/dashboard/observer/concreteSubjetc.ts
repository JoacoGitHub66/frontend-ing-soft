import { observer } from "./observer"

export class concreteobserverAlert implements observer {

  private notified = false

  constructor(
    private getTargetTemperature: () => number,
    private showAlert: (message: string) => void
  ) {}

  update(currentTemperature: number): void {

    const target = this.getTargetTemperature()

    if (
      currentTemperature >= target &&
      !this.notified
    ) {
      this.showAlert("✅ Llegó a la temperatura deseada")
      this.notified = true
    }

    if (currentTemperature < target) {
      this.notified = false
    }
  }
}