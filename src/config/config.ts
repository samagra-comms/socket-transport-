export const config = () => ({
  app: {
    redisport: process.env.REDIS_PORT,
    redishost: process.env.REDIS_HOST,
    port: process.env.SERVER_PORT,
    bot_session_event: process.env.SKT_SESSION_EVT || 'session'
  },
  ADAPTER_URL: process.env.ADAPTER_URL,
  database: {},
});
