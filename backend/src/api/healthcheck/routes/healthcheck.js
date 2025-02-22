module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/healthcheck',
      handler: (ctx) => {
        ctx.status = 200;
        return { status: 'ok' };
      },
      config: {
        auth: false,
      },
    },
  ],
};
