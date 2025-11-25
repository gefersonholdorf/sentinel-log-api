import type { FastifyInstance } from "fastify";
import { rabbitMQClient } from "../server";
import z from "zod";

const teste = {
  "id": "abc123xyz",
  "systemId": "API2",
  "personaId": "persona123",
  "userId": "user456",
  "action": "update",
  "entity": "cliente",
  "entityId": "cliente789",
  "timestamp": "2025-11-25T15:30:00Z",
  "message": "User updated cliente record",
  "ip": "203.0.113.42",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "requestId": "req_abc123xyz"
}

export function logRoutes(app: FastifyInstance) {
    app.post('/logs', {
        schema: {
            summary: "Submit User Action Logs",
            description: `Endpoint to submit user action logs to SentinelLog. Each log represents an action performed by a user (e.g., create, update, delete, login) on
                a specific resource. Logs are processed asynchronously via RabbitMQ and
                stored in MongoDB, ensuring high throughput, reliability, and minimal
                impact on client applications. Only authenticated personas with valid
                tokens can submit logs for their own resources.`,            
            tags: ["Logs"],
            body: z.object({

            })
        }
    }, async (request, reply) => {
        rabbitMQClient.publish('sentinel.exchange', `personaA.logs`, { message: 'New log entry', timestamp: new Date().toISOString() });

        return reply.send({ status: 'Log entry queued' });
    })
}