type EventHandler = (data: unknown) => void;

class EventBus {
  private clients: Set<ReadableStreamDefaultController> = new Set();
  private handlers: Map<string, Set<EventHandler>> = new Map();

  addClient(controller: ReadableStreamDefaultController) {
    this.clients.add(controller);
  }

  removeClient(controller: ReadableStreamDefaultController) {
    this.clients.delete(controller);
  }

  get clientCount(): number {
    return this.clients.size;
  }

  broadcast(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();

    for (const client of this.clients) {
      try {
        client.enqueue(encoder.encode(payload));
      } catch {
        this.clients.delete(client);
      }
    }

    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        try {
          handler(data);
        } catch {
          // ignore handler errors
        }
      }
    }
  }

  sendHeartbeat() {
    const encoder = new TextEncoder();
    const heartbeat = `: heartbeat\n\n`;
    for (const client of this.clients) {
      try {
        client.enqueue(encoder.encode(heartbeat));
      } catch {
        this.clients.delete(client);
      }
    }
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler) {
    this.handlers.get(event)?.delete(handler);
  }
}

const globalForEventBus = globalThis as typeof globalThis & {
  __indbidEventBus?: EventBus;
};

export const eventBus = globalForEventBus.__indbidEventBus ?? new EventBus();

if (process.env.NODE_ENV !== "production") {
  globalForEventBus.__indbidEventBus = eventBus;
}
