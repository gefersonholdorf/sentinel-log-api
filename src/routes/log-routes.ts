import type { FastifyInstance } from "fastify";
import { rabbitMQClient } from "../server";
import z from "zod/v4";
import type { Log } from "../contracts/log";

const LogSchema = z.object({
  systemId: z.string().min(1).max(100),
  systemName: z.string().min(1).max(200),
  action: z.enum(["create", "update", "delete", "login", "logout", "view"]),
  entity: z.string().min(1).max(100),
  personaId: z.string().min(1).max(100),
  userId: z.string().min(1).max(100),
  userName: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
});

type LogInput = z.infer<typeof LogSchema>;

export function logRoutes(app: FastifyInstance) {
    app.post<{ Body: LogInput }>('/logs', {
        schema: {
            summary: "Submit User Action Logs",
            description: `Endpoint to submit user action logs to SentinelLog. Each log represents an action performed by a user (e.g., create, update, delete, login) on
                a specific resource. Logs are processed asynchronously via RabbitMQ and
                stored in MongoDB, ensuring high throughput, reliability, and minimal
                impact on client applications. Only authenticated personas with valid
                tokens can submit logs for their own resources.`,            
            tags: ["Logs"],
            body: LogSchema,
            response: {
                200: z.object({
                    status: z.string().describe("Status of the log submission."),
                }),
                500: z.object({
                    message: z.string().describe("Error message indicating the failure reason."),
                })
            }
        }
    }, async (request, reply) => {
        const ip = request.ip
        const userAgent = request.headers['user-agent'];

        const { userName, action, entity, message, personaId, systemId, systemName, userId } = request.body

        const logEntry: Log = {
            id: crypto.randomUUID(),
            userName, 
            userId, 
            personaId, 
            systemId, 
            systemName,
            action, 
            entity, 
            message,
            date: new Date(),
            ip,
            userAgent
        }

        rabbitMQClient.publish('sentinel.exchange', `personaA.logs`, { ...logEntry});

        return reply.status(200).send({ status: 'Log entry queued' });
    })
}