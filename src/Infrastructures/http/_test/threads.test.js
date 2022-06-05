const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /treads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };
      const authPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: authPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: authPayload.username,
          password: authPayload.password,
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding'
      };
      const authPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: authPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: authPayload.username,
          password: authPayload.password,
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: true,
      };
      const authPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: authPayload,
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: authPayload.username,
          password: authPayload.password,
        },
      });

      const json = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': 'Bearer ' + json.data.accessToken,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });
  
  describe('when GET /threads/{threadId}', () => {
    it('should response 200', async () => {
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        id: 'user-321'
      });
      await ThreadsTableTestHelper.add({
          id: 'thread-123',
          title: 'asdadasda',
          body: 'asdada',
          owner: 'user-321',
      });
      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asdadasda',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();      
      expect(responseJson.data.thread.id).toEqual('thread-123');
      expect(responseJson.data.thread.title).toEqual('asdadasda');
      expect(responseJson.data.thread.body).toEqual('asdada');

      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments.length > 0).toBeTruthy();
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-4444',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
