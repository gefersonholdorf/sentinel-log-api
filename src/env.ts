import z from "zod/v4"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET_KEY: z.string(),
    RABBITMQ_URL: z.url(),
    MONGO_URL: z.url(),
    DATABASE_URL: z.url()
})

export const env = envSchema.parse(process.env)