import type { FastifyInstance } from "fastify";
import { db } from "../config/drizzle";
import { clientsTable } from "../config/drizzle/schema";

export function clientsRoutes(app: FastifyInstance) {
    app.post('/clients', {
        schema: {
            tags: ["Clients"],
            summary: "Create a new client",
            description: "Endpoint to create a new client in the system.",
        }
    }, async(request, reply) => {
        const clientId = await db.insert(clientsTable).values({
            name: 'Client 1',
            description: "Teste",
        }).$returningId()
    })
}