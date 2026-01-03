import amqp from 'amqplib';

export default class ConsumerController {

    static async handle() {

        const url = process.env.RABBIT_SERVER_URL ?? "";
        const connection = await amqp.connect(url);
        const channel: amqp.Channel = await connection.createChannel();

        // Subscribing to email-queue
        await channel.assertQueue('email-queue', {durable: true});
        await channel.consume('email-queue', (msg) => {
            if (msg) this.handleMessage(channel, 'sms-queue', msg);
        });

        // Subscribing to sms-queue
        await channel.assertQueue('sms-queue', {durable: true});
        await channel.consume('sms-queue', (msg) => {
            return msg ? this.handleMessage(channel, 'sms-queue', msg) : null;
        });
    }

    private static async handleMessage(channel: amqp.Channel, queueName: string, message: amqp.ConsumeMessage) {

        const parsedMessage = JSON.parse(message.content.toString());

        if (queueName === 'email-queue') {
            console.log('Handling email notification:', parsedMessage);
        } else if (queueName === 'sms-queue') {
            console.log('Handling SMS notification:', parsedMessage);
        } else {
            console.log('Unknown queue:', queueName);
        }

        channel.ack(message);
    }
}