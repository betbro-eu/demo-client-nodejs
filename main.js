const amqp = require('amqplib');
const fs = require('fs-extra');
const moment = require('moment');
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

	fs.ensureDir(`${__dirname}/messages/`);
})();

async function handleMessage(message) {
	message.content = await JSON.parse(message.content.toString());

	// Dump message to console
	// console.dir(message.content, { depth: null, colors: true })
	process.stdout.write('.');

	// Record message to file
	if (message.properties.headers.fixture_id) {
		// Create file if not exists
		await fs.ensureFile(`${__dirname}/messages/${message.properties.headers.fixture_id}`);
		// Append message to file
		await fs.appendFileSync(`${__dirname}/messages/${message.properties.headers.fixture_id}`, moment().utc().toISOString() + ' | ' + JSON.stringify(message.content) + ' | ' + JSON.stringify(message.fields) + ' | ' + JSON.stringify(message.properties.headers) + '\n');
	}
}
