export default class Broadcaster {
  constructor() {
    this.subscribers = new Map();
    this.nextKey = 0;
  }

  subscribe(subscriber) {
    // Add new subscriber to the list of subscribers.
    this.subscribers.set(this.nextKey, subscriber);
    return this.nextKey++;
  }

  unsubscribe(reference) {
    this.subscribers.delete(reference);
  }

  send(message) {
    for(let subscriber of this.subscribers.values()) {
      subscriber(message);
    }
  }

  getSubscriberCount() {
    return this.subscribers.size;
  }
}
