import { RabbitMQServer } from ".";
import { env } from "../../env";

async function bootstrap() {
  const rabbit = new RabbitMQServer(
    env.RABBITMQ_URL,
    "sentinel.exchange",
    "direct"
  );

  await rabbit.start();

  await rabbit.consume(
    "queue.personaA",
    "personaA.logs",
    (msg) => {
      const content = JSON.parse(msg.content.toString());

      console.log("📥 Log recebido pelo worker:");
      console.log(content);

      // Aqui você grava no banco
      // saveToDatabase(content);
    }
  );
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar worker:", err);
  process.exit(1);
});
