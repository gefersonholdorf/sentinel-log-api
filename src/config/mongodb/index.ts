import { MongoClient } from "mongodb";
import { env } from "../../env";

export class MongoDBClient {
    private client!: MongoClient

    constructor(
        private uri: string
    ) {}

    async start() {
        try {
            this.client = new MongoClient(this.uri)
            await this.client.connect()

            console.log("MongoDB connected successfully.");

            return this.client
        } catch (error) {
            console.error("MongoDB connection failed:", error);
            return null
        }
    }

    async collection(colletionName: string) {
        if (!this.client) {
            throw new Error("MongoDB client not connected. Call connect() first.");
        }

        const db = this.client.db();
        return db.collection(colletionName);
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log("MongoDB connection closed.");
        }
    }
}

