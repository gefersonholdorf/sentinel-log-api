import { connect, type Connection, type Channel, type Message } from "amqplib";
import type { Log } from "../../contracts/log";

export class RabbitMQServer {
  private conn!: Connection;
  private channel!: Channel;

  constructor(
    private uri: string,
    private exchange: string,
    private exchangeType: "direct" | "topic" | "fanout" | "headers"
  ) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();

    await this.channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    console.log(`RabbitMQ is running and exchange "${this.exchange}" is ready`);
  }

  async publish(exchange: string, routingKey: string, data: Log) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized. Call start() first.");
    }

    const test = this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );

    console.log("Message published to RabbitMQ:", test);
  }

  async consume(
    queue: string,
    routingKey: string,
    callback: (msg: Message) => void
  ) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized. Call start() first.");
    }

    await this.channel.assertQueue(queue, { durable: true });

    await this.channel.bindQueue(queue, this.exchange, routingKey);

    return this.channel.consume(queue, (msg) => {
      if (!msg) return;

      try {
        callback(msg);
        this.channel.ack(msg);
      } catch (error) {
        console.error("Error processing message from queue:", error);
        this.channel.nack(msg, false, false);
      }
    });
  }
}
