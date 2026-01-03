import amqp from 'amqplib';

export default class ProducerController {

    static async handle() {

        const url = process.env.RABBIT_SERVER_URL ?? "";
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        await this.sendMessage(channel, 'email-queue', this.payloads.email);
        await this.sendMessage(channel, 'sms-queue', this.payloads.sms);

        await channel.close();
        await connection.close();
    }

    private static async sendMessage(channel: amqp.Channel, queueName: string, payload: any) {
        const message = JSON.stringify(payload);

        await channel.assertQueue(queueName, {durable: true});
        channel.sendToQueue(queueName, Buffer.from(message));

        console.log(`Message sent to ${queueName}: ${message}`);
    }


    private static payloads = {
        email: {
            to: 'receiver@example.com',
            from: 'sender@example.com',
            subject: 'Sample Email',
            body: 'This is a sample email notification'
        },
        sms: {
            phoneNumber: '1234567890',
            message: 'This is a sample SMS notification',
        }
    };
}