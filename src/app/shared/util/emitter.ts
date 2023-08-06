type Callback<T> = (data: T) => void;

export default class EventEmitter {
  private subscribers: Map<string, Callback<unknown>[]> = new Map<string, Callback<unknown>[]>();

  public emit<T>(event: string, data: T): void {
    const callbacks = this.subscribers.get(event);
    callbacks?.forEach((callback) => {
      callback(data);
    });
  }

  public subscribe<T>(event: string, callback: Callback<T>): void {
    const callbacks = this.subscribers.get(event) ?? [];
    this.subscribers.set(event, [...callbacks, callback as Callback<unknown>]);
  }

  public unsubscrive<T>(event: string, callback: Callback<T>): void {
    const callbacks = this.subscribers.get(event) || [];
    this.subscribers.set(
      event,
      callbacks.filter((cb) => cb !== callback)
    );
  }
}
