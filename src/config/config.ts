export const config = () => ({
  app: {
    redisport: process.env.SERVER_PORT,
    port: process.env.SERVER_PORT,
  },
  ADAPTER_URL: process.env.ADAPTER_URL,
  database: {},
});
