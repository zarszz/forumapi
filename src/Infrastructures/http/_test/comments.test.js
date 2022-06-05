const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');
const bcrypt = require('bcrypt');

describe('/threads/{threadId}/comments endpoint', () => {

  const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-321',
      username: 'dicoding',
      password: await bcryptPasswordHash.hash('password'),
      fullname: 'dicoding'
    });
    await ThreadsTableTestHelper.add({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      owner: 'user-321'
    });
  })

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Indonesia',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Indonesia',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-5555555/comments',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding'
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: [],
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);
      
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });


      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and deleted comment', async () => {

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 because comment not found', async () => {

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-55555',
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 403 because not have valid authorization', async () => {

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-322',
        username: 'dicoding2',
        password: await bcryptPasswordHash.hash('password'),
        fullname: 'dicoding2'
      });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'password',
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
