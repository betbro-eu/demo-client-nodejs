const amqp = require('amqplib');
const CONNECTION_URI = 'amqp://demo:demo@116.202.19.203:5672/demo';
const EXCHANGE = 'customer-exchange';
const QUEUE = 'customer-queue';
const ROUTING_KEY = '#';

(async () => {
	const connection = await amqp.connect(CONNECTION_URI);
	channel = await connection.createChannel();
	await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
	await channel.assertQueue(QUEUE, { exclusive: false, autoDelete: true });
	await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
	await channel.prefetch(1);
	await channel.consume(QUEUE, await handleMessage, { noAck: true });
})();

async function handleMessage(message) {
	let message_content = await JSON.parse(message.content.toString());
	console.dir(message_content, { depth: null, colors: true })
}
