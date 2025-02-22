module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: ['http://localhost:5173'], // Your frontend URL
      headers: ['*'], // Allow all headers
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      keepHeaderOnError: true,
    },
  },
};
