const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.addThreadHandler,
    options: {
      auth: 'forumapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadHandler
  },
]);

module.exports = routes;
