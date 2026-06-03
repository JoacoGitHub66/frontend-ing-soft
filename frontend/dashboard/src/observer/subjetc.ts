import { observer } from "./observer"

export class subject {

  private observers: observer[] = []

  subscribe(observer: observer) {
    this.observers.push(observer)
  }

  unsubscribe(observer: observer) {
    this.observers = this.observers.filter(o => o !== observer)
  }

  notify(temperature: number) {
    this.observers.forEach(observer =>
      observer.update(temperature)
    )
  }
}