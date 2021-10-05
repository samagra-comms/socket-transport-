# Chatbot web socket service

web socket service is used to communicate between chatbot client and UCI adapter.
## Features

- Takes request from chatbot client and send it to UCI adapter to get response and return it back to bot client

## Tech
- [node.js] - evented I/O for the backend
- [NestJs] - fast node.js network app framework
- [socket.io] -  V4.0.0
- [redis] - for socket io redis adapter

## Installation

chatbot websocket service requires [Node.js](https://nodejs.org/) v12+ to run.

clone the repo and set the .env variable 
```
REDIS_PORT={REDIS PORT}
SERVER_PORT={SERVER PORT}
ADAPTER_URL={UCI ADAPTER URL}
```

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/Nik720/bot-socket-service.git
cd bot-socket-service
npm i
npm run start
```

Docs

[High Level Design](https://app.diagrams.net/#G1v8l6Xd6e00UnBC9A0PbAEnUMoSo5iE0C)
