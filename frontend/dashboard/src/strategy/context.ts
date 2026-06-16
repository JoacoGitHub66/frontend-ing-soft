import {SessionStatus} from "@/types/sessionStatus"
import {strategy} from "./strategy"

export class StatusContext {
  private strategy: strategy

  constructor(strategy: strategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: strategy) {
    this.strategy = strategy
  }

  doSomething(
    currentTemperature: number,
    targetTemperature: number
  ): SessionStatus {
    return this.strategy.execute(
      currentTemperature,
      targetTemperature
    )
  }
}