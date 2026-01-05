import amqp from 'amqplib';

export default class ProducerController {

    private static queueName = process.env.EMAIL_QUEUE_NAME ?? "";
    private static amqpUrl = process.env.RABBIT_SERVER_URL ?? "";


    static async publishWithDLX() {

        const MAIN_EXCHANGE = 'main-exchange';
        const DLX = 'dead-letter-exchange';

        const MAIN_QUEUE = this.queueName;
        const DLQ = 'email-dlq';

        const ROUTING_KEY = 'email.send';
        const DL_ROUTING_KEY = 'email.failed';

        const connection = await amqp.connect(this.amqpUrl);
        const channel = await connection.createChannel();

        // Exchanges
        await channel.assertExchange(DLX, 'direct', {durable: true});
        await channel.assertExchange(MAIN_EXCHANGE, 'direct', {durable: true});

        // Queues
        await channel.assertQueue(DLQ, {durable: true});
        await channel.bindQueue(DLQ, DLX, DL_ROUTING_KEY);

        await channel.assertQueue(MAIN_QUEUE, {
            durable: true,
            arguments: {'x-dead-letter-exchange': DLX, 'x-dead-letter-routing-key': DL_ROUTING_KEY}
        });
        await channel.bindQueue(MAIN_QUEUE, MAIN_EXCHANGE, ROUTING_KEY);


        channel.publish(
            MAIN_EXCHANGE,
            ROUTING_KEY,
            Buffer.from(JSON.stringify(this.payloads())),
            {persistent: true, contentType: 'application/json'}
        );

        console.log(`Message sent to ${this.queueName}`);
        setTimeout(async () => {
            await channel.close();
            await connection.close();
        }, 500);
    }

    static async handle() {

        const connection = await amqp.connect(this.amqpUrl);
        const channel = await connection.createChannel();

        const message = JSON.stringify(this.payloads());
        await channel.assertQueue(this.queueName, {durable: true});
        channel.sendToQueue(this.queueName, Buffer.from(message));

        console.log(`Message sent to ${this.queueName}: ${message}`);

        await channel.close();
        await connection.close();
    }

    private static payloads() {
        return {
            id: Math.random() * 10 ^ 6,
            to: 'receiver@example.com',
            from: 'sender@example.com',
            subject: 'Sample Email',
            body: 'This is a sample email notification'
        }
    };
}