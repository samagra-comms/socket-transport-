export const config = () => ({
  app: {
    redisport: process.env.SERVER_PORT,
    port: process.env.SERVER_PORT,
    bot_request_event: process.env.SKT_REQ_EVT || 'botrequest',
    bot_session_event: process.env.SKT_SESSION_EVT || 'session'
  },
  ADAPTER_URL: process.env.ADAPTER_URL,
  database: {},
});
