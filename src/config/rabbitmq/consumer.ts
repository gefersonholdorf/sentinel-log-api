import { RabbitMQServer } from ".";
import { env } from "../../env";
import { mongoClient } from "../../server";
import { MongoDBClient } from "../mongodb";

async function bootstrap() {
  const rabbit = new RabbitMQServer(
    env.RABBITMQ_URL,
    "sentinel.exchange",
    "direct"
  );

  const mongo = new MongoDBClient(env.MONGO_URL)

  await rabbit.start();
  await mongo.start()

  await rabbit.consume(
    "queue.personaA",
    "personaA.logs",
    async (msg) => {
      const content = JSON.parse(msg.content.toString());
      console.log('CONSUMO INICIADO', content);

      const teste = await mongo.collection("logs").insertOne(content)
      console.log(teste)
    }
  );
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar worker:", err);
  process.exit(1);
});
