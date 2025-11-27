import type { FastifyInstance } from "fastify";
import { db } from "../config/drizzle";
import { apisTable } from "../config/drizzle/schema";
import { uuid } from "zod";

export function apiRoutes(app: FastifyInstance) {
    app.post('/apis', {
        schema: {
            tags: ["Apis"],
            summary: "Create a new Api",
            description: "Endpoint to create a new API in the system.",
        }
    }, async(request, reply) => {
        const token = uuid()
        const clientId = await db.insert(apisTable).values({
            clientId: 1,
            name: 'API 1',
            token: String(token),
        }).$returningId()
    })
}