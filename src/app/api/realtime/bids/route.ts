import { eventBus } from "@/lib/realtime/event-bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      eventBus.addClient(controller);

      const welcomePayload = `event: connected\ndata: ${JSON.stringify({ clientCount: eventBus.clientCount })}\n\n`;
      controller.enqueue(encoder.encode(welcomePayload));

      const heartbeatInterval = setInterval(() => {
        eventBus.sendHeartbeat();
      }, 15000);

      const cleanup = () => {
        clearInterval(heartbeatInterval);
        eventBus.removeClient(controller);
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      const originalClose = controller.close.bind(controller);
      controller.close = () => {
        cleanup();
        return originalClose();
      };
    },
    cancel(controller) {
      eventBus.removeClient(controller as ReadableStreamDefaultController);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
