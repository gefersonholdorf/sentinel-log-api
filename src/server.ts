import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "./env";
import { logRoutes } from "./routes/log-routes";
import { RabbitMQServer } from "./config/rabbitmq";
import { MongoDBClient } from "./config/mongodb";
import { clientsRoutes } from "./routes/client-routes";
import { apiRoutes } from "./routes/api-routes";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: "*"
})

app.register(fastifySwagger, {
	openapi: {
		openapi: "3.0.0",
		info: {
			title: "Sentinel Log",
			description: "Official documentation for the Sentinel Log application.",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter your token.",
				},
			},
		},
		security: [],
	},
	transform: jsonSchemaTransform,
	transformObject: jsonSchemaTransformObject,
});

app.register(fastifyApiReference, {
	routePrefix: "/docs",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET_KEY,
});

export const rabbitMQClient = new RabbitMQServer(env.RABBITMQ_URL, 'sentinel.exchange', 'direct')
export const mongoClient = new MongoDBClient(env.MONGO_URL)

app.addHook("onReady", async() => {
	await rabbitMQClient.start()
	await mongoClient.start()
})

app.register(logRoutes)
app.register(clientsRoutes)
app.register(apiRoutes)