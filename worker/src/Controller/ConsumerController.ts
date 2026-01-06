import amqp from 'amqplib';

export default class ConsumerController {

    private static queueName = process.env.EMAIL_QUEUE_NAME ?? "";
    private static amqpUrl = process.env.RABBIT_SERVER_URL ?? "";

    static async handle() {

        const connection = await amqp.connect(this.amqpUrl);
        const channel = await connection.createChannel();

        try {
            const q = await channel.checkQueue(this.queueName);
            console.log(`Queue exists. Messages: ${q.messageCount}`);
        } catch (err) {
            console.error('Queue does not exist yet, cannot consume.');
            process.exit(1);
        }


        await channel.consume(this.queueName, (message) => {
            if (!message) return null;

            try {

                // Idempotency - Check if already processed
                const exists = await redis.get(key);
                if (exists) {
                    channel.ack(message);
                    return;
                }


                // process the message
                const parsedMessage = JSON.parse(message.content.toString());
                console.log('Handling notification:', parsedMessage);
                if (parsedMessage.id < 5) throw Error("Just wanted to break things");

                channel.ack(message);
            } catch (err) {
                channel.nack(message, false, false);
            }
        });
    }
}