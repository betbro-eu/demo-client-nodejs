# Demo Node.js Client

This is a simple demo client for connecting to the Sportsbook real-time data feed using Node.js and the amqplib library.

## Usage
Install dependencies
```
npm install
```
Run the client
```
node main.js
```
The client will connect to the RabbitMQ server, create a queue, bind it to the exchange, and start consuming fixture data.

The received messages will be logged to the console.
